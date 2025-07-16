import React, { useState, useEffect, useRef } from 'react';
import { Send, Image as ImageIcon } from 'lucide-react';
import { ChatService, Chat, Message as ChatMessage } from '@/services/chatServices';
import jobSeekerServices from '@/services/jobSeekerServices';
import applicationServices from '@/services/applicationServices';
import io, { Socket } from 'socket.io-client';
import { WEBSOCKET_BASE_URL } from '@/utils/config';
import { toast } from 'sonner';
import useScrollToBottom from '../../hooks/useScrollToBottom';

interface Job {
  id: string;
  title: string;
  company: {
    companyName: string;
    logoUrl?: string;
  };
  matchScore?: number;
}

interface Application {
  id: string;
  job: Job;
  company: {
    companyName: string;
    logoUrl?: string;
  };
  title?: string;
}

const JobSeekerMessagesPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobDetailsError, setJobDetailsError] = useState<string | null>(null);
  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobSeekerUserId, setJobSeekerUserId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useScrollToBottom<HTMLDivElement>([selectedChat, messages]);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const profile = await jobSeekerServices.getProfile();
        setJobSeekerUserId(profile.userId);
        const chats = await ChatService.getUserChats(profile.userId);
        setChats(chats);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Failed to load chats');
        toast.error('Failed to load chats');
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
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

    socketRef.current.on('newMessage', (message: ChatMessage) => {
      console.log('[DEBUG] New message received:', message);
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === message.id)) {
          return prev;
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
    };
  }, [selectedChat]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      setLoading(true);
      try {
        const messages = await ChatService.getChatHistory(selectedChat.id);
        setMessages((prev) => {
          const optimisticIds = prev
            .filter((msg) => msg.id?.startsWith('optimistic-'))
            .map((msg) => msg.id);
          const filteredMessages = messages.filter((msg) => !optimisticIds.includes(msg.id));
          return filteredMessages;
        });
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Failed to load messages');
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedChat]);

  const handleSelectChat = async (chat: Chat) => {
    setSelectedChat(chat);
    setJobDetailsError(null);
    try {
      if (!jobSeekerUserId) {
        setSelectedJob(null);
        setJobDetailsError('Jobseeker userId not loaded.');
        return;
      }
      const applicationsResp = await applicationServices.getUserApplications({
        sortBy: 'applicationDate',
        sortOrder: 'desc',
      });
      const apps = applicationsResp.applications || [];
      setJobApplications(apps);
      if (apps.length > 0 && apps[0].job) {
        setSelectedJob(apps[0].job);
      } else {
        setSelectedJob(null);
        setJobDetailsError('No job applications found for this user.');
      }
    } catch (err: unknown) {
      setSelectedJob(null);
      setJobDetailsError(err instanceof Error ? err.message : 'Failed to fetch job applications');
      toast.error('Failed to fetch job applications');
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() && !file) return;
    if (!selectedChat || !jobSeekerUserId) return;

    try {
      const content = messageInput.trim() || 'Document shared';
      console.log('[DEBUG] Sending message:', { chatId: selectedChat.id, senderId: jobSeekerUserId, content, file: file?.name });
      const optimisticMessage: ChatMessage = {
        id: `optimistic-${crypto.randomUUID()}`,
        chatId: selectedChat.id,
        senderId: jobSeekerUserId,
        senderName: 'You',
        content,
        type: file ? 'file' : 'TEXT',
        status: 'SENT',
        createdAt: new Date().toISOString(),
        ...(file && { fileUrl: URL.createObjectURL(file), fileName: file.name }),
      };
      setMessages((prev) => [...prev, optimisticMessage]);

      const response = await ChatService.sendMessage({
        chatId: selectedChat.id,
        senderId: jobSeekerUserId,
        content,
        ...(file && { file }),
      });
      console.log('[DEBUG] ChatService.sendMessage response:', response);

      if (file && (!response.fileUrl || !response.fileName)) {
        console.error('[DEBUG] Server response missing fileUrl or fileName:', response);
        toast.error('Failed to upload file');
      }

      socketRef.current?.emit('sendMessage', {
        chatId: selectedChat.id,
        senderId: jobSeekerUserId,
        content,
        type: file ? 'file' : 'TEXT',
        ...(file && response.fileUrl && { fileUrl: response.fileUrl, fileName: response.fileName }),
      });

      setMessageInput('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (response) {
        const lastMessage = response;
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === selectedChat.id
              ? { ...chat, lastMessage, updatedAt: new Date().toISOString() }
              : chat,
          ),
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      console.error('[DEBUG] Error sending message:', errorMessage, error);
      setError(errorMessage);
      toast.error(errorMessage);
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

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Your <span className="text-blue-500">Messages</span>
      </h1>
      <div className="max-w-5xl mx-auto flex gap-6">
        <aside className="w-100 bg-gradient-to-b from-[#10131a] via-[#181c23] to-[#0a0e1a] rounded-xl border border-[#232a3a] flex flex-col p-4 shadow-2xl shadow-blue-900/30">
          <input
            type="text"
            placeholder="Search by Company"
            className="mb-4 px-3 py-2 rounded bg-gradient-to-r from-[#181c23] via-[#232a3a] to-[#181c23] text-white border border-[#232a3a] focus:outline-none focus:ring-2 focus:ring-blue-700/60 shadow-inner"
          />
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center text-gray-400 py-8">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : chats.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No conversations found.</div>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg mb-2 transition-colors ${
                    selectedChat?.id === chat.id
                      ? 'bg-gradient-to-r from-blue-900/80 via-indigo-900/60 to-[#181c23] border border-blue-600 shadow-lg shadow-blue-900/40'
                      : 'hover:bg-gradient-to-r hover:from-[#181c23] hover:via-[#232a3a] hover:to-[#181c23]'
                  }`}
                  onClick={() => handleSelectChat(chat)}
                >
                  {chat.company?.logoUrl || jobApplications[0]?.company?.logoUrl ? (
                    <img
                      src={chat.company?.logoUrl || jobApplications[0]?.company?.logoUrl}
                      alt="Company Logo"
                      className="w-10 h-10 rounded-full object-cover border border-[#232a3a] bg-[#232a3a] shadow-md shadow-blue-900/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#232a3a] flex items-center justify-center text-lg font-bold text-gray-400 shadow-md shadow-blue-900/30">
                      {chat.company?.companyName
                        ? chat.company.companyName[0]
                        : jobApplications[0]?.company?.companyName
                        ? jobApplications[0].company.companyName[0]
                        : '?'}
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-white text-base truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                      {chat.company?.companyName || (jobApplications[0]?.company?.companyName ?? 'Unknown Company')}
                    </div>
                    <div className="text-gray-400 text-xs truncate max-w-[160px]">
                      {jobApplications[0]?.job?.title || jobApplications[0]?.title || 'Position Unknown'}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {chat.updatedAt ? new Date(chat.updatedAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <section className="flex-1 bg-gradient-to-br from-[#10131a] via-[#181c23] to-[#0a0e1a] rounded-xl border border-[#232a3a] flex flex-col shadow-2xl shadow-blue-900/40 min-h-[700px]">
          {selectedChat && (
            <div className="h-20 flex items-center border-b border-[#232a3a] px-8 py-2 bg-gradient-to-r from-[#181c23] via-[#232a3a] to-[#10131a] rounded-t-xl relative shadow-md shadow-blue-900/20">
              <div className="flex items-center gap-4 w-full">
                {selectedJob?.company?.logoUrl ? (
                  <img
                    src={selectedJob.company.logoUrl}
                    alt="Company Logo"
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center text-xl font-bold text-gray-400">
                    {selectedJob?.company?.companyName ? selectedJob.company.companyName[0] : '?'}
                  </div>
                )}
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-bold text-lg text-white leading-tight truncate">
                    {selectedJob?.company?.companyName || selectedChat?.company?.companyName || 'Unknown Company'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">
                      {selectedJob?.title || 'Position Unknown'}
                    </span>
                    {selectedJob && (
                      <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-2 py-0.5 rounded text-xs font-semibold shadow">
                        Match: {selectedJob.matchScore !== undefined ? `${selectedJob.matchScore}%` : 'N/A'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {jobDetailsError && (
                <div className="text-red-400 text-xs mt-2">{jobDetailsError}</div>
              )}
            </div>
          )}

          <div ref={chatContainerRef} className="h-[500px] overflow-y-auto px-8 py-6 bg-gradient-to-br from-[#10131a] via-[#181c23] to-[#0a0e1a]">
            {!selectedChat ? (
              <div className="flex h-full items-center justify-center">
                <div className="bg-gradient-to-br from-[#181c23] via-[#232a3a] to-[#10131a] border border-[#232a3a] rounded-lg px-6 py-4 text-gray-300 text-center shadow-inner">
                  Select a conversation to get started or search a new company above
                </div>
              </div>
            ) : loading ? (
              <div className="flex h-full items-center justify-center text-gray-400">Loading chat...</div>
            ) : error ? (
              <div className="flex h-full items-center justify-center text-red-500">{error}</div>
            ) : (
              <div className="flex flex-col gap-6">
                {messages.map((message) => {
                  const isOptimistic = message.id?.startsWith('optimistic-');
                  const senderId = isOptimistic ? message.senderId : message.sender?.id;
                  const isSentByJobSeeker = String(senderId) === String(jobSeekerUserId);
                  const senderName = isOptimistic ? message.senderName : (message.sender?.email || 'Unknown');
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

          {selectedChat && (
            <div className="border-t border-[#232a3a] px-8 py-6 flex items-center gap-3 bg-gradient-to-r from-[#181c23] via-[#232a3a] to-[#10131a] rounded-b-xl shadow-inner">
              <button
                className="text-blue-400 hover:text-blue-300 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#232a3a] to-[#181c23] border border-blue-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-5 h-5" />
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
                  disabled={!selectedChat}
                  aria-label="Type a message"
                />
              </div>
              <button
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-700 to-blue-400 shadow-lg border-2 border-blue-300 hover:scale-105 hover:shadow-blue-400/40 focus:ring-2 focus:ring-blue-400 transition-transform duration-150"
                onClick={handleSendMessage}
                disabled={(!messageInput.trim() && !file) || !selectedChat}
                aria-label="Send message"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default JobSeekerMessagesPage;