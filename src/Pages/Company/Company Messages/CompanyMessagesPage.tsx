import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import useScrollToBottom from '../../../hooks/useScrollToBottom';
import { ChatService, Chat, Message } from '../../../services/chatServices';
import { ApplicantsService, ApplicantCardDto } from '../../../services/applicantServices';
import companyServices from '../../../services/companyServices';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip } from 'lucide-react';
import { WEBSOCKET_BASE_URL } from '@/utils/config';
import { useLocation } from 'react-router-dom';

export default function CompanyMessagesPage() {
  const location = useLocation();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(location.state?.selectedChatId || null);
  const [input, setInput] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const chatContainerRef = useScrollToBottom<HTMLDivElement>([selectedChatId, messages]);
  const [applicantDetails, setApplicantDetails] = useState<
    Record<
      string,
      ApplicantCardDto & {
        appliedJobs?: { jobId: string; title: string; matchPercentage: number; applicationStatus: string; applicationId: string }[];
      } | null
    >
  >({});
  const [loading, setLoading] = useState(true);
  const [companyProfile, setCompanyProfile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    scheduledAt: '',
    meetingLink: '',
    notes: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<Record<string, string>>({});
  const [showAllPositions, setShowAllPositions] = useState(false);
  const companyIdRef = useRef<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const optimisticFileUrlsRef = useRef<Set<string>>(new Set()); // Track temporary file URLs for cleanup

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const statusStyles: Record<string, string> = {
    accepted: 'border-green-400 text-green-400',
    rejected: 'border-red-400 text-red-400',
    interview: 'border-blue-400 text-blue-400',
    hired: 'border-purple-400 text-purple-400',
    not_suitable: 'border-gray-400 text-gray-400',
    pending: 'border-yellow-400 text-yellow-400',
  };

  const fetchApplicantDetails = async () => {
    const details: Record<
      string,
      ApplicantCardDto & {
        appliedJobs?: { jobId: string; title: string; matchPercentage: number; applicationStatus: string; applicationId: string }[];
      } | null
    > = {};
    try {
      const jobs = await companyServices.getCompanyJobs();
      for (const job of jobs) {
        try {
          const res = await ApplicantsService.getJobApplicants({ jobId: job.id, limit: 100 });
          for (const applicant of res.data) {
            if (!details[applicant.userId]) {
              details[applicant.userId] = { ...applicant, appliedJobs: [] };
            }
            details[applicant.userId]!.appliedJobs!.push({
              jobId: job.id,
              title: job.title,
              matchPercentage: applicant.matchPercentage || 0,
              applicationStatus: applicant.applicationStatus || 'pending',
              applicationId: applicant.applicationId || '',
            });
          }
        } catch (e) {
          console.error('[DEBUG] Error fetching applicants for job:', job.id, e);
        }
      }
    } catch (e) {
      console.error('[DEBUG] Error fetching company jobs:', e);
    }
    setApplicantDetails(details);
  };

  const fetchChats = async () => {
    try {
      setLoading(true);
      const profile = await companyServices.getProfile();
      setCompanyProfile(profile);
      console.log('[DEBUG] Company profile:', profile);
      const companyUserId = (profile as any).userId;
      companyIdRef.current = companyUserId;
      console.log('[DEBUG] Using companyUserId for chats:', companyUserId);
      let companyChats: Chat[] = [];
      if (companyUserId) {
        companyChats = await ChatService.getUserChats(companyUserId);
        console.log('[DEBUG] Chats fetched:', companyChats);
        setChats(companyChats);
        await fetchApplicantDetails();
      } else {
        console.warn('[DEBUG] No companyUserId found in profile!');
      }
      if (companyChats.length > 0) {
        setSelectedChatId((prev) => (prev && companyChats.some((c) => c.id === prev) ? prev : companyChats[0].id));
      } else {
        setSelectedChatId(null);
        console.warn('[DEBUG] No chats found for this company.');
      }
    } catch (error) {
      toast.error('Failed to load chats');
      console.error('[DEBUG] Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('[DEBUG] CompanyMessagesPage mounted');
    fetchChats();
  }, []);

  useEffect(() => {
    if (!selectedChatId) return;

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
      socketRef.current?.emit('joinChat', selectedChatId);
    });

    socketRef.current.on('joinedChat', (chatId: string) => {
      console.log('[DEBUG] Joined chat:', chatId);
    });

    socketRef.current.on('newMessage', (rawMessage: any) => {
      console.log('[DEBUG] Raw socket message:', rawMessage);
      const message: Message = {
        id: rawMessage.id,
        chatId: rawMessage.chatId || rawMessage.chat?.id,
        senderId: rawMessage.senderId || rawMessage.sender?.id,
        senderName:
          String(rawMessage.senderId || rawMessage.sender?.id) === String(companyProfile?.userId)
            ? companyProfile?.companyName || 'You'
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
      if (message.chatId !== selectedChatId) {
        console.warn('[DEBUG] Message for different chat:', { messageChatId: message.chatId, selectedChatId });
        return;
      }
      if (message.type === 'FILE' && (!message.fileUrl || !message.fileName)) {
        console.warn('[DEBUG] FILE message missing fileUrl or fileName:', message);
        message.content = message.content || 'Document shared (file metadata missing)';
      }

      setMessages((prev) => {
        // Check for duplicates based on ID, or senderId, content, fileName, and timestamp proximity
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
          // Remove optimistic message and revoke temporary file URL
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
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      // Cleanup all temporary file URLs
      optimisticFileUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      optimisticFileUrlsRef.current.clear();
    };
  }, [selectedChatId, companyProfile]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChatId) {
        console.log('[DEBUG] No selectedChatId, skipping fetchMessages');
        return;
      }
      try {
        console.log('[DEBUG] Fetching messages for chatId:', selectedChatId);
        const chatMessages = await ChatService.getChatHistory(selectedChatId);
        console.log('[DEBUG] Messages fetched:', chatMessages);
        // Normalize senderName and deduplicate against existing messages
        setMessages((prev) => {
          const normalizedMessages = chatMessages.map((msg) => ({
            ...msg,
            senderName:
              String(msg.senderId) === String(companyProfile?.userId)
                ? companyProfile?.companyName || 'You'
                : msg.senderName || (msg as any)?.sender?.email || 'Unknown',
          }));
          // Deduplicate by merging with existing messages
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
          // Sort by createdAt to ensure correct order
          return mergedMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        });
      } catch (error) {
        toast.error('Failed to load messages');
        console.error('[DEBUG] Error fetching messages:', error);
      }
    };
    // Clear messages before fetching to avoid stale data
    setMessages([]);
    fetchMessages();
  }, [selectedChatId, companyProfile]);

  const handleSendMessage = async () => {
    if (!selectedChatId || !companyProfile) return;
    if (!input.trim() && !file) return;

    try {
      setSendingMessage(true);
      const companyId = String(companyProfile?.userId || '');
      const chatId = String(selectedChatId || '');
      const content = input.trim() || 'Document shared';
      console.log('[DEBUG] Sending message:', { chatId, senderId: companyId, content, file: file?.name });

      if (!companyId || !chatId) {
        toast.error('Missing required fields for sending message.');
        console.error('[DEBUG] sendMessage missing fields:', { companyId, chatId, content });
        setSendingMessage(false);
        return;
      }

      const optimisticMessage: Message = {
        id: `optimistic-${crypto.randomUUID()}`,
        chatId,
        senderId: companyId,
        senderName: companyProfile?.companyName || 'You',
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
      formData.append('chatId', chatId);
      formData.append('senderId', companyId);
      formData.append('content', content);
      if (file) {
        formData.append('file', file);
      }

      const response = await ChatService.sendMessage({
        chatId,
        senderId: companyId,
        content,
        file: file ?? undefined,
      });
      console.log('[DEBUG] ChatService.sendMessage response:', response);

      // Emit sendMessage with server response data
      socketRef.current?.emit('sendMessage', {
        id: response.id,
        chatId,
        senderId: companyId,
        senderName: companyProfile?.companyName || 'You',
        content: response.content,
        type: response.type || (file ? 'FILE' : 'TEXT'),
        fileUrl: response.fileUrl,
        fileName: response.fileName,
        status: response.status || 'sent',
        createdAt: response.createdAt || new Date().toISOString(),
      });

      setInput('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      console.error('[DEBUG] Error sending message:', errorMessage, error);
      toast.error(errorMessage);
      // Remove optimistic message and revoke temporary file URL
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

  const handleScheduleInterview = async () => {
    if (!selectedChatId || !scheduleData.scheduledAt || !scheduleData.meetingLink || !companyIdRef.current) return;

    try {
      await ChatService.scheduleInterview({
        chatId: selectedChatId,
        scheduledAt: scheduleData.scheduledAt,
        meetingLink: scheduleData.meetingLink,
        notes: scheduleData.notes,
      });

      const messageContent = `Interview Scheduled\nDate & Time: ${new Date(scheduleData.scheduledAt).toLocaleString()}\nMeeting Link: ${scheduleData.meetingLink}${scheduleData.notes ? `\nNotes: ${scheduleData.notes}` : ''}`;
      const optimisticMessage: Message = {
        id: `optimistic-${crypto.randomUUID()}`,
        chatId: selectedChatId,
        senderId: companyIdRef.current,
        senderName: companyProfile?.companyName || 'You',
        content: messageContent,
        type: 'TEXT',
        status: 'SENT',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMessage]);

      const response = await ChatService.sendMessage({
        chatId: selectedChatId,
        senderId: companyIdRef.current,
        content: messageContent,
        file: undefined,
      });

      // Emit sendMessage with server response data
      socketRef.current?.emit('sendMessage', {
        id: response.id,
        chatId: selectedChatId,
        senderId: companyIdRef.current,
        senderName: companyProfile?.companyName || 'You',
        content: messageContent,
        type: 'TEXT',
        status: response.status || 'sent',
        createdAt: response.createdAt || new Date().toISOString(),
      });

      setScheduleData({ scheduledAt: '', meetingLink: '', notes: '' });
      setShowScheduleForm(false);
      toast.success('Interview scheduled successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to schedule interview';
      console.error('[ERROR] handleScheduleInterview:', errorMessage, error);
      toast.error(errorMessage);
      // Remove optimistic message
      setMessages((prev) => prev.filter((msg) => !msg.id?.startsWith('optimistic-')));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      console.log('[DEBUG] File selected:', e.target.files[0].name);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = chats.filter((chat) => {
    const jobSeekerId = chat.jobSeeker?.userId || chat.jobSeeker?.id;
    const details = jobSeekerId ? applicantDetails[jobSeekerId] : null;
    const searchLower = searchQuery.toLowerCase();
    const applicantName = details ? `${details.firstName} ${details.lastName}`.toLowerCase() : '';
    const position = details?.appliedJobs?.find((job) => job.title === selectedPositions[chat.id])?.title?.toLowerCase() || '';
    const company = details?.currentCompany?.toLowerCase() || '';
    return applicantName.includes(searchLower) || position.includes(searchLower) || company.includes(searchLower);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Your <span className="text-blue-500">Conversations</span>
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
            {filteredChats.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </div>
            ) : (
              filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg mb-2 transition-colors ${
                    selectedChatId === chat.id
                      ? 'bg-gradient-to-r from-blue-900/80 via-indigo-900/60 to-[#181c23] border border-blue-600 shadow-lg shadow-blue-900/40'
                      : 'hover:bg-gradient-to-r hover:from-[#181c23] hover:via-[#232a3a] hover:to-[#181c23]'
                  }`}
                  onClick={() => setSelectedChatId(chat.id)}
                >
                  {(() => {
                    const jobSeekerId = chat.jobSeeker?.userId || chat.jobSeeker?.id;
                    const details = jobSeekerId ? applicantDetails[jobSeekerId] : null;
                    if (details && details.profilePictureUrl) {
                      return (
                        <img
                          src={details.profilePictureUrl}
                          alt={`${details.firstName ?? ''} ${details.lastName ?? ''}`}
                          className="w-10 h-10 rounded-full object-cover border border-[#232a3a] bg-[#232a3a] shadow-md shadow-blue-900/30"
                        />
                      );
                    }
                    return (
                      <div className="w-10 h-10 rounded-full bg-[#232a3a] flex items-center justify-center text-lg font-bold text-gray-400 shadow-md shadow-blue-900/30">
                        {details && details.firstName ? details.firstName[0] : '?'}
                      </div>
                    );
                  })()}
                  <div className="flex-1 text-left min-w-0">
                    {(() => {
                      const jobSeekerId = chat.jobSeeker?.userId || chat.jobSeeker?.id;
                      const details = jobSeekerId ? applicantDetails[jobSeekerId] : null;
                      const activePosition = selectedPositions[chat.id] || details?.appliedJobs?.[0]?.title || 'No position';
                      return (
                        <>
                          <div className="font-semibold text-white text-base truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                            {details ? `${details.firstName} ${details.lastName}` : 'Unknown'}
                          </div>
                          <div className="text-gray-400 text-xs truncate max-w-[160px]">
                            {activePosition}
                          </div>
                        </>
                      );
                    })()}
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
              ))
            )}
          </div>
        </aside>

        <section className="flex-1 bg-gradient-to-br from-[#10131a] via-[#181c23] to-[#0a0e1a] rounded-xl border border-[#232a3a] flex flex-col shadow-2xl shadow-blue-900/40 min-h-[700px]">
          {selectedChat ? (
            <>
              <div className="h-20 flex items-center border-b border-[#232a3a] px-8 py-2 bg-gradient-to-r from-[#181c23] via-[#232a3a] to-[#10131a] rounded-t-xl relative shadow-md shadow-blue-900/20">
                <div className="flex items-center gap-4 w-full">
                  {(() => {
                    const jobSeekerId = selectedChat.jobSeeker?.userId || selectedChat.jobSeeker?.id;
                    const details = jobSeekerId ? applicantDetails[jobSeekerId] : null;
                    if (details && details.profilePictureUrl) {
                      return (
                        <img
                          src={details.profilePictureUrl}
                          alt={`${details.firstName ?? ''} ${details.lastName ?? ''}`}
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-md"
                        />
                      );
                    }
                    return (
                      <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center text-xl font-bold text-gray-400">
                        {details && details.firstName ? details.firstName[0] : '?'}
                      </div>
                    );
                  })()}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-bold text-lg text-white leading-tight truncate">
                      {(() => {
                        const jobSeekerId = selectedChat.jobSeeker?.userId || selectedChat.jobSeeker?.id;
                        const details = jobSeekerId ? applicantDetails[jobSeekerId] : null;
                        return details ? `${details.firstName} ${details.lastName}` : 'Unknown';
                      })()}
                    </span>
                    <div className="flex items-center gap-2 relative">
                      {(() => {
                        const jobSeekerId = selectedChat.jobSeeker?.userId || selectedChat.jobSeeker?.id;
                        const details = jobSeekerId ? applicantDetails[jobSeekerId] : null;
                        const activePosition = selectedChatId ? selectedPositions[selectedChatId] : null;
                        const activePositionObj = details?.appliedJobs?.find((job) => job.title === activePosition) || details?.appliedJobs?.[0];
                        return (
                          <>
                            <button
                              className="flex whitespace-nowrap items-center gap-2 px-2 py-1 rounded bg-gradient-to-r from-blue-900 to-blue-700 text-white font-semibold text-sm shadow border border-blue-600 hover:brightness-110 transition"
                              onClick={() => setShowDropdown((v) => !v)}
                            >
                              <span>{activePositionObj?.title || 'No position'}</span>
                              <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-2 py-0.5 rounded text-xs font-semibold shadow ml-2">
                                {activePositionObj?.matchPercentage || 0}% Match
                              </span>
                              <svg className="ml-1 w-4 h-4 text-blue-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <div className={`absolute left-0 top-10 z-20 w-full max-w-2xl bg-gradient-to-br from-[#181c23] via-[#232a3a] to-[#10131a] border border-blue-700 rounded-xl shadow-2xl p-2 animate-fade-in ${!showDropdown ? 'hidden' : ''}`}>
                              {details?.appliedJobs?.map((pos, idx) => {
                                if (!showAllPositions && idx >= 2) return null;
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-start justify-between px-3 py-2 rounded-lg hover:bg-blue-900/30 transition cursor-pointer"
                                    onClick={() => {
                                      setSelectedPositions((prev) => ({ ...prev, [selectedChatId!]: pos.title }));
                                      setShowDropdown(false);
                                      setShowAllPositions(false); // Reset the expanded state when selecting
                                    }}
                                  >
                                    <span className={`font-semibold text-sm ${pos.title === activePositionObj?.title ? 'text-blue-300' : 'text-white'} flex-1 mr-3`}>
                                      {pos.title}
                                    </span>
                                    <div className="flex gap-2 flex-shrink-0">
                                      <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-2 py-0.5 rounded text-xs font-semibold shadow whitespace-nowrap">
                                        {pos.matchPercentage}% Match
                                      </span>
                                      <span
                                        className={`px-2 py-0.5 rounded text-xs font-semibold border ${statusStyles[pos.applicationStatus] || 'border-gray-400 text-gray-400'} whitespace-nowrap`}
                                        style={{ background: 'transparent' }}
                                      >
                                        {pos.applicationStatus}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                              {details?.appliedJobs && details.appliedJobs.length >= 3 && !showAllPositions && (
                                <div className="text-center mt-2">
                                  <button
                                    className="text-blue-400 text-xs underline hover:text-blue-200"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent closing dropdown
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
                                      e.stopPropagation(); // Prevent closing dropdown
                                      setShowAllPositions(false);
                                    }}
                                  >
                                    SEE LESS
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <Button
                    className="flex items-center gap-2 px-2 py-1 rounded bg-gradient-to-r from-blue-900 to-blue-700 text-white font-semibold text-sm shadow border border-blue-600 hover:brightness-110 transition"
                    onClick={() => setShowScheduleForm(true)}
                  >
                    Schedule Interview
                  </Button>
                </div>
              </div>

              <div ref={chatContainerRef} className="h-[500px] overflow-y-auto px-8 py-6 bg-gradient-to-br from-[#10131a] via-[#181c23] to-[#0a0e1a]">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="bg-gradient-to-br from-[#181c23] via-[#232a3a] to-[#10131a] border border-[#232a3a] rounded-lg px-6 py-4 text-gray-300 text-center shadow-inner">
                      No messages yet. Start the conversation!
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {messages.map((message) => {
                      const isOptimistic = message.id?.startsWith('optimistic-');
                      const senderId = isOptimistic ? message.senderId : message.senderId || message.senderId;
                      const isSentByCompany = companyProfile?.userId && String(senderId) === String(companyProfile.userId);
                      const senderName = isSentByCompany
                        ? companyProfile?.companyName || 'You'
                        : message.senderName || (message as any)?.sender?.email || 'Unknown'
                      return (
                        <div key={message.id} className={`flex ${isSentByCompany ? 'justify-end' : 'justify-start'}`}>
                          <div className="flex flex-col items-end max-w-[70%]">
                            <div
                              className={`px-5 py-3 rounded-2xl text-base font-medium shadow-lg ${
                                isSentByCompany
                                  ? 'bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-700 text-white border border-blue-400 shadow-blue-700/30'
                                  : 'bg-gradient-to-br from-[#232a3a] via-[#181c23] to-[#232a3a] text-white border border-blue-900 shadow-blue-900/30'
                              }`}
                              style={{
                                borderTopLeftRadius: isSentByCompany ? '1.5rem' : 0,
                                borderTopRightRadius: isSentByCompany ? 0 : '1.5rem',
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

              <div className="border-t border-[#232a3a] px-8 py-6 flex items-center gap-3 bg-gradient-to-r from-[#181c23] via-[#232a3a] to-[#10131a] rounded-b-xl shadow-down">
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
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sendingMessage}
                    aria-label="Type a message"
                  />
                </div>
                <button
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-700 to-blue-400 shadow-lg border-2 border-blue-300 hover:scale-105 hover:shadow-blue-400/40 focus:ring-2 focus:ring-blue-400 transition-transform duration-150"
                  onClick={handleSendMessage}
                  disabled={(!input.trim() && !file) || sendingMessage}
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-gradient-to-br from-[#181c23] via-[#232a3a] to-[#10131a] border border-[#232a3a] rounded-lg px-6 py-4 text-gray-300 text-center shadow-inner">
                Select a conversation to start messaging
              </div>
            </div>
          )}
        </section>

        {showScheduleForm && selectedChat && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="relative bg-gradient-to-br from-[#0a0e1a] via-[#181c23] to-[#10131a] p-8 rounded-2xl border border-blue-900/50 shadow-2xl shadow-blue-900/40 w-full max-w-md transform transition-all duration-300 scale-100 hover:scale-102">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowScheduleForm(false)}
                aria-label="Close schedule form"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-white mb-6">Schedule Interview</h2>
              <div className="space-y-6">
                <div className="relative">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Date and Time</label>
                  <Input
                    type="datetime-local"
                    value={scheduleData.scheduledAt}
                    onChange={(e) => setScheduleData({ ...scheduleData, scheduledAt: e.target.value })}
                    className="w-full bg-gradient-to-r from-[#191e2a] to-[#232a3a] text-white border border-blue-700/50 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-all duration-200 placeholder-gray-500"
                    placeholder="Select date and time"
                  />
                </div>
                <div className="relative">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Meeting Link</label>
                  <Input
                    type="url"
                    value={scheduleData.meetingLink}
                    onChange={(e) => setScheduleData({ ...scheduleData, meetingLink: e.target.value })}
                    placeholder="https://meet.example.com/abc"
                    className="w-full bg-gradient-to-r from-[#191e2a] to-[#232a3a] text-white border border-blue-700/50 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-all duration-200 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Notes (Optional)</label>
                  <textarea
                    value={scheduleData.notes}
                    onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
                    placeholder="Enter any additional notes"
                    className="w-full bg-gradient-to-r from-[#191e2a] to-[#232a3a] text-white border border-blue-700/50 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-all duration-200 placeholder-gray-500 resize-none h-24"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    className="px-4 py-2 bg-transparent text-blue-400 border border-blue-400 rounded-lg hover:bg-blue-400/10 hover:text-blue-300 transition-all duration-200 font-semibold text-sm shadow-sm"
                    onClick={() => setShowScheduleForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-lg hover:from-blue-600 hover:to-blue-400 transition-all duration-200 font-semibold text-sm shadow-md border border-blue-600"
                    onClick={handleScheduleInterview}
                    disabled={!scheduleData.scheduledAt || !scheduleData.meetingLink}
                  >
                    Schedule Interview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}