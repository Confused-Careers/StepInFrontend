import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { ChatService, Chat, Message as ChatMessage } from '@/services/chatServices';
import jobSeekerServices from '@/services/jobSeekerServices';
import applicationServices, { Application } from '@/services/applicationServices';
import io, { Socket } from 'socket.io-client';
import { WEBSOCKET_BASE_URL } from '@/utils/config';
import { toast } from 'sonner';
import useScrollToBottom from '../../hooks/useScrollToBottom';
import { Input } from '@/components/ui/input';
// Extend Chat interface to include selectedPosition
interface ExtendedChat extends Chat {
  selectedPosition?: string | null;
}

const JobSeekerMessagesPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<ExtendedChat | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [chats, setChats] = useState<ExtendedChat[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobSeekerUserId, setJobSeekerUserId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAllPositions, setShowAllPositions] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const optimisticFileUrlsRef = useRef<Set<string>>(new Set());
  const chatContainerRef = useScrollToBottom<HTMLDivElement>([selectedChat, messages]);

  const statusStyles: Record<string, string> = {
    applied: 'border-yellow-400 text-yellow-400',
    in_progress: 'border-blue-400 text-blue-400',
    interview: 'border-blue-400 text-blue-400',
    rejected: 'border-red-400 text-red-400',
    withdrawn: 'border-gray-400 text-gray-400',
    hired: 'border-purple-400 text-purple-400',
    'first-round': 'border-blue-300 text-blue-300',
    'under-review': 'border-yellow-300 text-yellow-300',
    offer: 'border-green-400 text-green-400',
  };

  useEffect(() => {
    const fetchChatsAndApplications = async () => {
      setLoading(true);
      try {
        const profile = await jobSeekerServices.getProfile();
        setJobSeekerUserId(profile.userId);
        const [chats, applicationsResp] = await Promise.all([
          ChatService.getUserChats(profile.userId),
          applicationServices.getUserApplications({ sortBy: 'applicationDate', sortOrder: 'desc' }),
        ]);
        console.log('[DEBUG] Chats fetched:', chats);
        console.log('[DEBUG] Applications fetched:', applicationsResp);
        // Initialize chats with selectedPosition from applications
        const extendedChats: ExtendedChat[] = chats.map((chat) => {
          const applications = (applicationsResp.applications || []).filter(
            (app) => app.companyUserId === chat.company?.userId || app.companyUserId === chat.company?.id
          );
          return {
            ...chat,
            selectedPosition: applications[0]?.job?.title || null,
          };
        });
        setChats(extendedChats);
        setJobApplications(applicationsResp.applications || []);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Failed to load chats or applications');
        toast.error('Failed to load chats or applications');
        console.error('[DEBUG] Error fetching chats or applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChatsAndApplications();
  }, []);

  useEffect(() => {
    if (!selectedChat) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const token = localStorage.getItem('accessToken');
    socketRef.current = io(WEBSOCKET_BASE_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('[DEBUG] WebSocket connected');
      socketRef.current?.emit('joinChat', selectedChat.id);
    });

    socketRef.current.on('joinedChat', (chatId: string) => {
      console.log('[DEBUG] Joined chat:', chatId);
    });

    socketRef.current.on('newMessage', (rawMessage: any) => {
      console.log('[DEBUG] Raw socket message:', rawMessage);
      const message: ChatMessage = {
        id: rawMessage.id,
        chatId: rawMessage.chatId || rawMessage.chat?.id,
        senderId: rawMessage.senderId || rawMessage.sender?.id,
        senderName:
          String(rawMessage.senderId || rawMessage.sender?.id) === String(jobSeekerUserId)
            ? 'You'
            : rawMessage.senderName || rawMessage.sender?.email || 'Unknown',
        content: rawMessage.content || '',
        type: (rawMessage.type || 'TEXT').toUpperCase() as 'TEXT' | 'FILE' | 'SYSTEM',
        status: rawMessage.status || 'sent',
        createdAt: rawMessage.createdAt || new Date().toISOString(),
        fileUrl: rawMessage.fileUrl || undefined,
        fileName: rawMessage.fileName || undefined,
      };

      console.log('[DEBUG] New message received (normalized):', message);
      if (!message.id || !message.chatId) {
        console.warn('[DEBUG] Invalid message structure (missing id/chatId):', message);
        return;
      }
      if (message.chatId !== selectedChat.id) {
        console.warn('[DEBUG] Message for different chat:', { messageChatId: message.chatId, selectedChatId: selectedChat.id });
        return;
      }
      if (message.type === 'FILE' && (!message.fileUrl || !message.fileName)) {
        console.warn('[DEBUG] FILE message missing fileUrl or fileName:', message);
        message.content = message.content || 'Document shared (file metadata missing)';
      }

      setMessages((prev) => {
        const isDuplicate = prev.some(
          (msg) =>
            msg.id === message.id ||
            (msg.senderId === message.senderId &&
             msg.content === message.content &&
             (!msg.fileName || !message.fileName || msg.fileName === message.fileName) &&
             Math.abs(new Date(msg.createdAt).getTime() - new Date(message.createdAt).getTime()) < 5000)
        );
        if (isDuplicate) {
          console.log('[DEBUG] Skipping duplicate message:', message.id);
          const updatedMessages = prev.filter(
            (msg) =>
              !msg.id?.startsWith('optimistic-') ||
              !(msg.senderId === message.senderId && msg.content === message.content && (!msg.fileName || msg.fileName === message.fileName))
          );
          if (message.fileUrl && optimisticFileUrlsRef.current.has(message.fileUrl)) {
            URL.revokeObjectURL(message.fileUrl);
            optimisticFileUrlsRef.current.delete(message.fileUrl);
          }
          return updatedMessages.concat(message);
        }
        return [...prev, message];
      });
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('[DEBUG] WebSocket connection error:', error);
      toast.error('WebSocket connection failed');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      optimisticFileUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      optimisticFileUrlsRef.current.clear();
    };
  }, [selectedChat, jobSeekerUserId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) {
        console.log('[DEBUG] No selectedChat, skipping fetchMessages');
        return;
      }
      try {
        console.log('[DEBUG] Fetching messages for chatId:', selectedChat.id);
        const chatMessages = await ChatService.getChatHistory(selectedChat.id);
        console.log('[DEBUG] Messages fetched:', chatMessages);
        setMessages((prev) => {
          const normalizedMessages = chatMessages.map((msg) => ({
            ...msg,
            senderName:
              String(msg.senderId) === String(jobSeekerUserId)
                ? 'You'
                : msg.senderName || msg.sender?.email || 'Unknown',
          }));
          const mergedMessages = [...prev];
          normalizedMessages.forEach((newMsg) => {
            const isDuplicate = mergedMessages.some(
              (msg) =>
                msg.id === newMsg.id ||
                (msg.senderId === newMsg.senderId &&
                 msg.content === newMsg.content &&
                 (!msg.fileName || !newMsg.fileName || msg.fileName === newMsg.fileName) &&
                 Math.abs(new Date(msg.createdAt).getTime() - new Date(newMsg.createdAt).getTime()) < 5000)
            );
            if (!isDuplicate) {
              mergedMessages.push(newMsg);
            } else {
              console.log('[DEBUG] Skipping duplicate fetched message:', newMsg.id);
            }
          });
          return mergedMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        });
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Failed to load messages');
        toast.error('Failed to load messages');
        console.error('[DEBUG] Error fetching messages:', error);
      }
    };
    setMessages([]);
    fetchMessages();
  }, [selectedChat, jobSeekerUserId]);

  const handleSelectChat = async (chat: ExtendedChat) => {
    setSelectedChat(chat);
    setSelectedPosition(chat.selectedPosition);
    setError(null);
    try {
      if (!jobSeekerUserId) {
        setSelectedPosition(null);
        setError('Jobseeker userId not loaded.');
        return;
      }
      const applications = jobApplications.filter(
        (app) => app.companyUserId === chat.company?.userId || app.companyUserId === chat.company?.id
      );
      if (applications.length > 0 && !chat.selectedPosition) {
        const defaultPosition = applications[0].job.title;
        setSelectedPosition(defaultPosition);
        setChats((prev) =>
          prev.map((c) =>
            c.id === chat.id ? { ...c, selectedPosition: defaultPosition } : c
          )
        );
      } else if (!applications.length) {
        setSelectedPosition(null);
        setError('No job applications found for this company.');
      }
    } catch (err: unknown) {
      setSelectedPosition(null);
      setError(err instanceof Error ? err.message : 'Failed to fetch job applications');
      toast.error('Failed to fetch job applications');
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() && !file) return;
    if (!selectedChat || !jobSeekerUserId) return;

    try {
      setSendingMessage(true);
      const content = messageInput.trim() || 'Document shared';
      console.log('[DEBUG] Sending message:', { chatId: selectedChat.id, senderId: jobSeekerUserId, content, file: file?.name });

      const optimisticMessage: ChatMessage = {
        id: `optimistic-${crypto.randomUUID()}`,
        chatId: selectedChat.id,
        senderId: jobSeekerUserId,
        senderName: 'You',
        content,
        type: file ? 'FILE' : 'TEXT',
        status: 'SENT',
        createdAt: new Date().toISOString(),
        ...(file && { fileUrl: URL.createObjectURL(file), fileName: file.name }),
      };
      if (file && optimisticMessage.fileUrl) {
        optimisticFileUrlsRef.current.add(optimisticMessage.fileUrl);
      }
      setMessages((prev) => [...prev, optimisticMessage]);

      const formData = new FormData();
      formData.append('chatId', selectedChat.id);
      formData.append('senderId', jobSeekerUserId);
      formData.append('content', content);
      if (file) {
        formData.append('file', file);
      }

      const response = await ChatService.sendMessage({
        chatId: selectedChat.id,
        senderId: jobSeekerUserId,
        content,
        file,
      });
      console.log('[DEBUG] ChatService.sendMessage response:', response);

      socketRef.current?.emit('sendMessage', {
        id: response.id,
        chatId: selectedChat.id,
        senderId: jobSeekerUserId,
        senderName: 'You',
        content: response.content,
        type: response.type || (file ? 'FILE' : 'TEXT'),
        fileUrl: response.fileUrl,
        fileName: response.fileName,
        status: response.status || 'sent',
        createdAt: response.createdAt || new Date().toISOString(),
      });

      setMessageInput('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      console.error('[DEBUG] Error sending message:', errorMessage, error);
      toast.error(errorMessage);
      setMessages((prev) =>
        prev.filter((msg) => {
          if (msg.id?.startsWith('optimistic-') && msg.fileUrl && optimisticFileUrlsRef.current.has(msg.fileUrl)) {
            URL.revokeObjectURL(msg.fileUrl);
            optimisticFileUrlsRef.current.delete(msg.fileUrl);
          }
          return !msg.id?.startsWith('optimistic-');
        })
      );
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      console.log('[DEBUG] File selected:', e.target.files[0].name);
    }
  };

  const filteredChats = chats.filter((chat) => {
    const companyName = chat.company?.companyName?.toLowerCase() || '';
    const applications = jobApplications.filter(
      (app) => app.companyUserId === chat.company?.userId || app.companyUserId === chat.company?.id
    );
    const position = chat.selectedPosition?.toLowerCase() || applications[0]?.job?.title?.toLowerCase() || '';
    const searchLower = searchQuery.toLowerCase();
    return companyName.includes(searchLower) || position.includes(searchLower);
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Your <span className="text-blue-500">Messages</span>
      </h1>
      <div className="max-w-5xl mx-auto flex gap-6">
        <aside className="w-100 bg-gradient-to-b from-[#10131a] via-[#181c23] to-[#0a0e1a] rounded-xl border border-[#232a3a] flex flex-col p-4 shadow-2xl shadow-blue-900/30">
          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 mb-4 px-3 py-2 rounded bg-gradient-to-r from-[#181c23] via-[#232a3a] to-[#181c23] text-white border border-[#232a3a] focus:outline-none focus:ring-2 focus:ring-blue-700/60 shadow-inner"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center text-gray-400 py-8">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : filteredChats.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No conversations found.</div>
            ) : (
              filteredChats.map((chat) => {
                const applications = jobApplications.filter(
                  (app) => app.companyUserId === chat.company?.userId || app.companyUserId === chat.company?.id
                );
                return (
                  <button
                    key={chat.id}
                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg mb-2 transition-colors ${
                      selectedChat?.id === chat.id
                        ? 'bg-gradient-to-r from-blue-900/80 via-indigo-900/60 to-[#181c23] border border-blue-600 shadow-lg shadow-blue-900/40'
                        : 'hover:bg-gradient-to-r hover:from-[#181c23] hover:via-[#232a3a] hover:to-[#181c23]'
                    }`}
                    onClick={() => handleSelectChat(chat)}
                  >
                    {chat.company?.logoUrl || applications[0]?.company?.logoUrl ? (
                      <img
                        src={chat.company?.logoUrl || applications[0]?.company?.logoUrl}
                        alt="Company Logo"
                        className="w-10 h-10 rounded-full object-cover border border-[#232a3a] bg-[#232a3a] shadow-md shadow-blue-900/30"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#232a3a] flex items-center justify-center text-lg font-bold text-gray-400 shadow-md shadow-blue-900/30">
                        {chat.company?.companyName
                          ? chat.company.companyName[0]
                          : applications[0]?.company?.companyName
                          ? applications[0].company.companyName[0]
                          : '?'}
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-white text-base truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                        {chat.company?.companyName || (applications[0]?.company?.companyName ?? 'Unknown Company')}
                      </div>
                      <div className="text-gray-400 text-xs truncate max-w-[160px]">
                        {chat.selectedPosition || applications[0]?.job?.title || 'Position Unknown'}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {chat.updatedAt ? formatTime(chat.updatedAt) : ''}
                      </span>
                      {chat.unreadCount > 0 && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full block" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className="flex-1 bg-gradient-to-br from-[#10131a] via-[#181c23] to-[#0a0e1a] rounded-xl border border-[#232a3a] flex flex-col shadow-2xl shadow-blue-900/40 min-h-[700px]">
          {selectedChat ? (
            <>
              <div className="h-20 flex items-center border-b border-[#232a3a] px-8 py-2 bg-gradient-to-r from-[#181c23] via-[#232a3a] to-[#10131a] rounded-t-xl relative shadow-md shadow-blue-900/20">
                <div className="flex items-center gap-4 w-full">
                  {(() => {
                    const applications = jobApplications.filter(
                      (app) => app.companyUserId === selectedChat.company?.userId || app.companyUserId === selectedChat.company?.id
                    );
                    const activeApplication = applications.find((app) => app.job.title === selectedPosition) || applications[0];
                    return (
                      <>
                        {activeApplication?.company?.logoUrl ? (
                          <img
                            src={activeApplication.company.logoUrl}
                            alt="Company Logo"
                            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-md"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center text-xl font-bold text-gray-400">
                            {activeApplication?.company?.companyName ? activeApplication.company.companyName[0] : '?'}
                          </div>
                        )}
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-bold text-lg text-white leading-tight truncate">
                            {activeApplication?.company?.companyName || selectedChat.company?.companyName || 'Unknown Company'}
                          </span>
                          <div className="flex items-center gap-2 relative">
                            <button
                              className="flex whitespace-nowrap items-center gap-2 px-2 py-1 rounded bg-gradient-to-r from-blue-900 to-blue-700 text-white font-semibold text-sm shadow border border-blue-600 hover:brightness-110 transition"
                              onClick={() => setShowDropdown((v) => !v)}
                            >
                              <span>{activeApplication?.job?.title || 'No position'}</span>
                              <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-2 py-0.5 rounded text-xs font-semibold shadow ml-2">
                                {activeApplication?.matchScore !== undefined ? `${activeApplication.matchScore}% Match` : 'N/A'}
                              </span>
                              <svg className="ml-1 w-4 h-4 text-blue-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <div className={`absolute left-0 top-10 z-20 w-auto max-w-2xl bg-gradient-to-br from-[#181c23] via-[#232a3a] to-[#10131a] border border-blue-700 rounded-xl shadow-2xl p-2 animate-fade-in ${!showDropdown ? 'hidden' : ''}`}>
                              {applications.map((app, idx) => {
                                if (!showAllPositions && idx >= 2) return null;
                                return (
                                  <div
                                    key={app.id}
                                    className="flex items-start justify-between px-3 py-2 rounded-lg hover:bg-blue-900/30 transition cursor-pointer"
                                    onClick={() => {
                                      setSelectedPosition(app.job.title);
                                      setShowDropdown(false);
                                      setShowAllPositions(false);
                                      setChats((prev) =>
                                        prev.map((chat) =>
                                          chat.id === selectedChat.id
                                            ? { ...chat, selectedPosition: app.job.title }
                                            : chat
                                        )
                                      );
                                    }}
                                  >
                                    <span className={`font-semibold text-sm ${app.job.title === activeApplication?.job?.title ? 'text-blue-300' : 'text-white'} flex-1 mr-3`}>
                                      {app.job.title}
                                    </span>
                                    <div className="flex gap-2 flex-shrink-0">
                                      <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-2 py-0.5 rounded text-xs font-semibold shadow whitespace-nowrap">
                                        {app.matchScore !== undefined ? `${app.matchScore}% Match` : 'N/A'}
                                      </span>
                                      <span
                                        className={`px-2 py-0.5 rounded text-xs font-semibold border ${statusStyles[app.status] || 'border-gray-400 text-gray-400'} whitespace-nowrap`}
                                        style={{ background: 'transparent' }}
                                      >
                                        {app.status}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                              {applications.length >= 3 && !showAllPositions && (
                                <div className="text-center mt-2">
                                  <button
                                    className="text-blue-400 text-xs underline hover:text-blue-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowAllPositions(true);
                                    }}
                                  >
                                    SEE MORE
                                  </button>
                                </div>
                              )}
                              {showAllPositions && (
                                <div className="text-center mt-2">
                                  <button
                                    className="text-blue-400 text-xs underline hover:text-blue-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowAllPositions(false);
                                    }}
                                  >
                                    SEE LESS
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div ref={chatContainerRef} className="h-[500px] overflow-y-auto px-8 py-6 bg-gradient-to-br from-[#10131a] via-[#181c23] to-[#0a0e1a]">
                {loading ? (
                  <div className="flex h-full items-center justify-center text-gray-400">Loading chat...</div>
                ) : error ? (
                  <div className="flex h-full items-center justify-center text-red-500">{error}</div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="bg-gradient-to-br from-[#181c23] via-[#232a3a] to-[#10131a] border border-[#232a3a] rounded-lg px-6 py-4 text-gray-400 text-center shadow-inner">
                      No messages yet. Start the conversation!
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {messages.map((message) => {
                      const isOptimistic = message.id?.startsWith('optimistic-');
                      const senderId = isOptimistic ? message.senderId : message.sender?.id || message.senderId;
                      console.log('[DEBUG] Message sender check:', { messageId: message.id, senderId, jobSeekerUserId, isSentByJobSeeker: String(senderId) === String(jobSeekerUserId) });
                      const isSentByJobSeeker = jobSeekerUserId && String(senderId) === String(jobSeekerUserId);
                      const senderName = isSentByJobSeeker
                        ? 'You'
                        : message.senderName || message.sender?.email || 'Unknown';
                      return (
                        <div key={message.id} className={`flex ${isSentByJobSeeker ? 'justify-end' : 'justify-start'}`}>
                          <div className="flex flex-col items-end max-w-[70%]">
                            <div
                              className={`px-5 py-3 rounded-2xl text-base font-medium shadow-lg ${
                                isSentByJobSeeker
                                  ? 'bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-700 text-white border border-blue-400 shadow-blue-700/30'
                                  : 'bg-gradient-to-br from-[#232a3a] via-[#181c23] to-[#232a3a] text-white border border-blue-900 shadow-blue-900/30'
                              }`}
                              style={{
                                borderTopLeftRadius: isSentByJobSeeker ? '1.5rem' : 0,
                                borderTopRightRadius: isSentByJobSeeker ? 0 : '1.5rem',
                              }}
                            >
                              <div className="text-xs text-gray-400 mb-1">{senderName}</div>
                              {message.content}
                              {message.fileUrl && (
                                <div className="mt-2">
                                  <a
                                    href={message.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                  >
                                    {message.fileName || 'Document'}
                                  </a>
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 mt-1 mr-2 self-end" style={{ fontSize: '0.75rem' }}>
                              {new Date(message.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border-t border-[#232a3a] px-8 py-6 flex items-center gap-3 bg-gradient-to-r from-[#181c23] via-[#232a3a] to-[#10131a] rounded-b-xl shadow-inner">
                <button
                  className="text-blue-400 hover:text-blue-300 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#232a3a] to-[#181c23] border border-blue-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                {file && (
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <span>{file.name}</span>
                  </div>
                )}
                <div className="flex-1 flex items-center bg-gradient-to-r from-[#191e2a] via-[#232a3a] to-[#181c23] rounded-2xl border border-[#232a3a] shadow-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/60 transition-all duration-200">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none border-none py-2 px-0 text-base focus:outline-none"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sendingMessage || !selectedChat}
                    aria-label="Type a message"
                  />
                </div>
                <button
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-700 to-blue-400 shadow-lg border-2 border-blue-300 hover:scale-105 hover:shadow-blue-400/40 focus:ring-2 focus:ring-blue-400 transition-transform duration-150"
                  onClick={handleSendMessage}
                  disabled={(!messageInput.trim() && !file) || sendingMessage || !selectedChat}
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-gradient-to-br from-[#181c23] via-[#232a3a] to-[#10131a] border border-[#232a3a] rounded-lg px-6 py-4 text-gray-300 text-center shadow-inner">
                Select a conversation to get started or search a company above
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default JobSeekerMessagesPage;