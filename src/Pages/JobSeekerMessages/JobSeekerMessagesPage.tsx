import React, { useState } from 'react';
import {  
  Send, 
  Paperclip, 
  Image as ImageIcon,
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isFromCompany: boolean;
  senderName: string;
}

interface JobApplication {
  id: string;
  companyName: string;
  position: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted';
  matchPercentage: number;
  appliedDate: string;
  location: string;
  messages: Message[];
}

const JobSeekerMessagesPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<JobApplication | null>(null);
  const [messageInput, setMessageInput] = useState('');

  // Dummy data for job applications with messages
  const [conversations] = useState<JobApplication[]>([
    {
      id: '1',
      companyName: 'TechCorp Solutions',
      position: 'Senior React Developer',
      status: 'shortlisted',
      matchPercentage: 92,
      appliedDate: '2024-01-15',
      location: 'San Francisco, CA',
      messages: [
        {
          id: '1',
          text: 'Thank you for your application! We were impressed with your portfolio.',
          timestamp: '2024-01-16 10:30',
          isFromCompany: true,
          senderName: 'Sarah Johnson (HR Manager)'
        },
        {
          id: '2',
          text: 'Thank you! I\'m excited about the opportunity. When can we schedule an interview?',
          timestamp: '2024-01-16 14:20',
          isFromCompany: false,
          senderName: 'You'
        },
        {
          id: '3',
          text: 'We\'d like to schedule a technical interview for next week. Are you available on Tuesday?',
          timestamp: '2024-01-17 09:15',
          isFromCompany: true,
          senderName: 'Sarah Johnson (HR Manager)'
        }
      ]
    },
    {
      id: '2',
      companyName: 'InnovateTech',
      position: 'Full Stack Developer',
      status: 'reviewing',
      matchPercentage: 87,
      appliedDate: '2024-01-10',
      location: 'New York, NY',
      messages: [
        {
          id: '1',
          text: 'Hi! We received your application and are currently reviewing it.',
          timestamp: '2024-01-11 16:45',
          isFromCompany: true,
          senderName: 'Mike Chen (Recruiter)'
        },
        {
          id: '2',
          text: 'Great! I look forward to hearing from you. Do you need any additional information?',
          timestamp: '2024-01-12 11:30',
          isFromCompany: false,
          senderName: 'You'
        }
      ]
    },
    {
      id: '3',
      companyName: 'StartupXYZ',
      position: 'Frontend Engineer',
      status: 'pending',
      matchPercentage: 78,
      appliedDate: '2024-01-18',
      location: 'Austin, TX',
      messages: [
        {
          id: '1',
          text: 'Application received! We\'ll get back to you within 48 hours.',
          timestamp: '2024-01-18 13:20',
          isFromCompany: true,
          senderName: 'Lisa Rodriguez (HR)'
        }
      ]
    },
    {
      id: '4',
      companyName: 'Enterprise Solutions Inc',
      position: 'Software Engineer',
      status: 'accepted',
      matchPercentage: 95,
      appliedDate: '2024-01-05',
      location: 'Seattle, WA',
      messages: [
        {
          id: '1',
          text: 'Congratulations! We\'re excited to offer you the position.',
          timestamp: '2024-01-08 10:00',
          isFromCompany: true,
          senderName: 'David Wilson (Hiring Manager)'
        },
        {
          id: '2',
          text: 'Thank you so much! I\'m thrilled to join the team. When do I start?',
          timestamp: '2024-01-08 14:30',
          isFromCompany: false,
          senderName: 'You'
        },
        {
          id: '3',
          text: 'We\'ll send you the offer letter and onboarding details by tomorrow.',
          timestamp: '2024-01-09 09:15',
          isFromCompany: true,
          senderName: 'David Wilson (Hiring Manager)'
        }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'border-green-500 text-green-400';
      case 'shortlisted':
        return 'border-blue-500 text-blue-400';
      case 'reviewing':
        return 'border-blue-400 text-blue-300';
      case 'rejected':
        return 'border-red-500 text-red-400';
      default:
        return 'border-gray-500 text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'shortlisted':
        return 'Shortlisted';
      case 'reviewing':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageInput,
      timestamp: new Date().toLocaleString(),
      isFromCompany: false,
      senderName: 'You'
    };

    // In a real app, you would send this to the backend
    console.log('Sending message:', newMessage);
    
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Your <span className="text-blue-500">Messages</span>
      </h1>
      <div className="max-w-5xl mx-auto flex gap-6">
        {/* Sidebar: Applications List */}
        <aside className="w-100 bg-gradient-to-b from-[#10131a] via-[#181c23] to-[#0a0e1a] rounded-xl border border-[#232a3a] flex flex-col p-4 shadow-2xl shadow-blue-900/30">
          <input
            type="text"
            placeholder="Search by Company"
            className="mb-4 px-3 py-2 rounded bg-gradient-to-r from-[#181c23] via-[#232a3a] to-[#181c23] text-white border border-[#232a3a] focus:outline-none focus:ring-2 focus:ring-blue-700/60 shadow-inner"
          />
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg mb-2 transition-colors ${
                  selectedConversation?.id === conversation.id 
                    ? 'bg-gradient-to-r from-blue-900/80 via-indigo-900/60 to-[#181c23] border border-blue-600 shadow-lg shadow-blue-900/40' 
                    : 'hover:bg-gradient-to-r hover:from-[#181c23] hover:via-[#232a3a] hover:to-[#181c23]'
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="w-10 h-10 rounded-full bg-[#232a3a] flex items-center justify-center text-lg font-bold text-gray-400 shadow-md shadow-blue-900/30">
                  {conversation.companyName[0]}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-white text-base truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                    {conversation.companyName}
                  </div>
                  <div className="text-gray-400 text-xs truncate max-w-[160px]">
                    {conversation.position}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(conversation.appliedDate).toLocaleDateString()}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusColor(conversation.status)}`} style={{background: 'transparent'}}>
                    {getStatusText(conversation.status)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Chat Area */}
        <section className="flex-1 bg-gradient-to-br from-[#10131a] via-[#181c23] to-[#0a0e1a] rounded-xl border border-[#232a3a] flex flex-col shadow-2xl shadow-blue-900/40 min-h-[700px]">
          {/* Chat header */}
          {selectedConversation && (
            <div className="h-20 flex items-center border-b border-[#232a3a] px-8 py-2 bg-gradient-to-r from-[#181c23] via-[#232a3a] to-[#10131a] rounded-t-xl relative shadow-md shadow-blue-900/20">
              <div className="flex items-center gap-4 w-full">
                <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center text-xl font-bold text-gray-400">
                  {selectedConversation.companyName[0]}
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-bold text-lg text-white leading-tight">
                    {selectedConversation.companyName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">{selectedConversation.position}</span>
                    <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-2 py-0.5 rounded text-xs font-semibold shadow">
                      {selectedConversation.matchPercentage}% Match
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusColor(selectedConversation.status)}`} style={{background: 'transparent'}}>
                      {getStatusText(selectedConversation.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat messages area */}
          <div className="flex-1 flex flex-col justify-end px-8 py-6 overflow-y-auto bg-gradient-to-br from-[#10131a] via-[#181c23] to-[#0a0e1a]">
            {!selectedConversation ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="bg-gradient-to-br from-[#181c23] via-[#232a3a] to-[#10131a] border border-[#232a3a] rounded-lg px-6 py-4 text-gray-300 text-center shadow-inner">
                  Select a conversation to get started or search a new company above
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {selectedConversation.messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isFromCompany ? 'justify-start' : 'justify-end'}`}>
                    <div className="flex flex-col items-end max-w-[70%]">
                      <div
                        className={`px-5 py-3 rounded-2xl text-base font-medium shadow-lg ${
                          message.isFromCompany
                            ? 'bg-gradient-to-br from-[#232a3a] via-[#181c23] to-[#232a3a] text-white border border-blue-900 shadow-blue-900/30'
                            : 'bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-700 text-white border border-blue-400 shadow-blue-700/30'
                        }`}
                        style={{
                          borderTopLeftRadius: message.isFromCompany ? 0 : '1.5rem',
                          borderTopRightRadius: message.isFromCompany ? '1.5rem' : 0,
                        }}
                      >
                        <div className="text-xs text-gray-400 mb-1">
                          {message.senderName}
                        </div>
                        {message.text}
                      </div>
                      <span className="text-xs text-gray-500 mt-1 mr-2 self-end" style={{fontSize: '0.75rem'}}>
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message input area */}
          {selectedConversation && (
            <div className="border-t border-[#232a3a] px-8 py-6 flex items-center gap-3 bg-gradient-to-r from-[#181c23] via-[#232a3a] to-[#10131a] rounded-b-xl shadow-inner">
              <button className="text-blue-400 hover:text-blue-300 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#232a3a] to-[#181c23] border border-blue-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500/60">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button className="text-blue-400 hover:text-blue-300 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#232a3a] to-[#181c23] border border-blue-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500/60">
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="flex-1 flex items-center bg-gradient-to-r from-[#191e2a] via-[#232a3a] to-[#181c23] rounded-2xl border border-[#232a3a] shadow-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/60 transition-all duration-200">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none border-none py-2 px-0 text-base focus:outline-none"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!selectedConversation}
                  aria-label="Type a message"
                />
              </div>
              <button
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-700 to-blue-400 shadow-lg border-2 border-blue-300 hover:scale-105 hover:shadow-blue-400/40 focus:ring-2 focus:ring-blue-400 transition-transform duration-150"
                onClick={handleSendMessage}
                disabled={!selectedConversation || !messageInput.trim()}
                aria-label="Send message"
              >
                <Send className="w-5 h-5 text-white drop-shadow-glow" />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default JobSeekerMessagesPage; 