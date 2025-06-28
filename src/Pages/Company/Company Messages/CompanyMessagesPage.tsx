import { useState } from 'react';

export type StatusType = 'Under Review' | 'First Round' | 'Rejected';

const statusStyles: Record<StatusType, string> = {
  'Under Review': 'border-blue-400 text-blue-300',
  'First Round': 'border-blue-500 text-blue-400',
  'Rejected': 'border-red-500 text-red-400',
};

// Dummy messages for each position (for demonstration)
const dummyMessagesByPosition: Record<string, { id: number; sender: 'company' | 'applicant'; text: string; time: string }[]> = {
  'Electrical Engineer': [
    { id: 1, sender: 'applicant', text: "I think that's a great idea", time: 'Jun 11 - 1:07 PM' },
    { id: 2, sender: 'company', text: "Perfect, I say we do that then. Tell Mark and we'll set a target date for Friday", time: 'Yesterday - 3:16 AM' },
  ],
  'Mechanical Engineer': [
    { id: 1, sender: 'company', text: "Hi, are you available for a quick call about the design?", time: 'Today - 10:00 AM' },
    { id: 2, sender: 'applicant', text: "Yes, I am!", time: 'Today - 10:01 AM' },
  ],
  'Plasma Physicist': [
    { id: 1, sender: 'company', text: "Can you send your latest research paper?", time: 'Yesterday - 2:00 PM' },
    { id: 2, sender: 'applicant', text: "Sure, sending now.", time: 'Yesterday - 2:01 PM' },
  ],
  'Chip Designer': [
    { id: 1, sender: 'company', text: "We liked your portfolio!", time: 'Last week' },
    { id: 2, sender: 'applicant', text: "Thank you!", time: 'Last week' },
  ],
  'Senior Developer': [
    { id: 1, sender: 'company', text: "What is your experience with React?", time: 'Last month' },
    { id: 2, sender: 'applicant', text: "5 years, mostly with TypeScript.", time: 'Last month' },
  ],
  'Product Designer': [
    { id: 1, sender: 'company', text: "Can you share your Dribbble?", time: 'Yesterday - 11:00 AM' },
    { id: 2, sender: 'applicant', text: "Here it is: dribbble.com/jenniferking", time: 'Yesterday - 11:01 AM' },
  ],
  'UX Researcher': [
    { id: 1, sender: 'company', text: "How do you approach user interviews?", time: 'Yesterday - 9:00 AM' },
    { id: 2, sender: 'applicant', text: "I use open-ended questions and empathy mapping.", time: 'Yesterday - 9:05 AM' },
  ],
  'UI Engineer': [
    { id: 1, sender: 'company', text: "What CSS frameworks do you prefer?", time: 'Yesterday - 8:00 AM' },
    { id: 2, sender: 'applicant', text: "Tailwind and Styled Components.", time: 'Yesterday - 8:01 AM' },
  ],
  'QA Analyst': [
    { id: 1, sender: 'company', text: "How do you write test cases?", time: 'Yesterday - 7:00 AM' },
    { id: 2, sender: 'applicant', text: "I use BDD and Gherkin syntax.", time: 'Yesterday - 7:05 AM' },
  ],
  'Automation Engineer': [
    { id: 1, sender: 'company', text: "What tools do you use for automation?", time: 'Yesterday - 6:00 AM' },
    { id: 2, sender: 'applicant', text: "Selenium and Cypress.", time: 'Yesterday - 6:01 AM' },
  ],
  'Test Lead': [
    { id: 1, sender: 'company', text: "How do you manage a QA team?", time: 'Yesterday - 5:00 AM' },
    { id: 2, sender: 'applicant', text: "With regular standups and clear documentation.", time: 'Yesterday - 5:01 AM' },
  ],
  'Marketing Manager': [
    { id: 1, sender: 'company', text: "What campaigns have you led?", time: 'Yesterday - 4:00 AM' },
    { id: 2, sender: 'applicant', text: "Several product launches and social campaigns.", time: 'Yesterday - 4:01 AM' },
  ],
  'Content Strategist': [
    { id: 1, sender: 'company', text: "How do you plan content calendars?", time: 'Yesterday - 3:00 AM' },
    { id: 2, sender: 'applicant', text: "I use Trello and Notion.", time: 'Yesterday - 3:01 AM' },
  ],
  'DevOps Engineer': [
    { id: 1, sender: 'company', text: "What CI/CD tools do you use?", time: 'Yesterday - 2:00 AM' },
    { id: 2, sender: 'applicant', text: "GitHub Actions and Jenkins.", time: 'Yesterday - 2:01 AM' },
  ],
  'Cloud Architect': [
    { id: 1, sender: 'company', text: "How do you design scalable systems?", time: 'Yesterday - 1:00 AM' },
    { id: 2, sender: 'applicant', text: "I use microservices and cloud-native patterns.", time: 'Yesterday - 1:01 AM' },
  ],
  'System Admin': [
    { id: 1, sender: 'company', text: "What monitoring tools do you use?", time: 'Yesterday - 12:00 AM' },
    { id: 2, sender: 'applicant', text: "Nagios and Prometheus.", time: 'Yesterday - 12:01 AM' },
  ],
  'Business Analyst': [
    { id: 1, sender: 'company', text: "How do you gather requirements?", time: 'Yesterday - 11:00 PM' },
    { id: 2, sender: 'applicant', text: "Through stakeholder interviews.", time: 'Yesterday - 11:01 PM' },
  ],
  'Data Scientist': [
    { id: 1, sender: 'company', text: "What ML frameworks do you use?", time: 'Yesterday - 10:00 PM' },
    { id: 2, sender: 'applicant', text: "TensorFlow and PyTorch.", time: 'Yesterday - 10:01 PM' },
  ],
};

const conversations = [
  {
    id: 1,
    name: 'David Jones',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: 'Perfect, I say we do that then. Tell Mark and we\'ll set a target date for Friday',
    time: '20 min',
    unread: false,
    position: 'Electrical Engineer',
    match: 86,
    positions: [
      { title: 'Electrical Engineer', match: 86, status: 'Under Review' as StatusType },
      { title: 'Mechanical Engineer', match: 71, status: 'First Round' as StatusType },
      { title: 'Plasma Physicist', match: 22, status: 'First Round' as StatusType },
      { title: 'Chip Designer', match: 91, status: 'Rejected' as StatusType },
      { title: 'Senior Developer', match: 62, status: 'Rejected' as StatusType },
    ],
    messages: [
      {
        id: 1,
        sender: 'applicant',
        text: "I think that's a great idea",
        time: 'Jun 11 - 1:07 PM',
      },
      {
        id: 2,
        sender: 'company',
        text: "Perfect, I say we do that then. Tell Mark and we'll set a target date for Friday",
        time: 'Yesterday - 3:16 AM',
      },
    ],
  },
  {
    id: 2,
    name: 'Jennifer King',
    avatar: '',
    lastMessage: "That's a great idea!",
    time: '2 hours',
    unread: true,
    position: 'Product Designer',
    match: 78,
    positions: [
      { title: 'Product Designer', match: 78, status: 'Under Review' as StatusType },
      { title: 'UX Researcher', match: 65, status: 'First Round' as StatusType },
      { title: 'UI Engineer', match: 54, status: 'Rejected' as StatusType },
    ],
    messages: [],
  },
  {
    id: 3,
    name: 'Stacey Everett',
    avatar: '',
    lastMessage: "I think it's a good thought, but we're still ...",
    time: '12 hours',
    unread: false,
    position: 'QA Analyst',
    match: 81,
    positions: [
      { title: 'QA Analyst', match: 81, status: 'First Round' as StatusType },
      { title: 'Automation Engineer', match: 74, status: 'Under Review' as StatusType },
      { title: 'Test Lead', match: 60, status: 'Rejected' as StatusType },
    ],
  },
  {
    id: 4,
    name: 'Barbara Banchero',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    lastMessage: 'Can you send me the PPT again?',
    time: '2 days',
    unread: false,
    position: 'Marketing Manager',
    match: 69,
    positions: [
      { title: 'Marketing Manager', match: 69, status: 'First Round' as StatusType },
      { title: 'Content Strategist', match: 55, status: 'Rejected' as StatusType },
    ],
  },
  {
    id: 5,
    name: 'Ricky Becker',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    lastMessage: 'Thanks for your help',
    time: '3 weeks',
    unread: true,
    position: 'DevOps Engineer',
    match: 88,
    positions: [
      { title: 'DevOps Engineer', match: 88, status: 'Under Review' as StatusType },
      { title: 'Cloud Architect', match: 77, status: 'First Round' as StatusType },
      { title: 'System Admin', match: 59, status: 'Rejected' as StatusType },
    ],
  },
  {
    id: 6,
    name: 'Netflix',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    lastMessage: "Let's meet back up in June",
    time: '2 months',
    unread: false,
    position: 'Business Analyst',
    match: 73,
    positions: [
      { title: 'Business Analyst', match: 73, status: 'First Round' as StatusType },
      { title: 'Data Scientist', match: 68, status: 'Rejected' as StatusType },
    ],
  },
];

export default function CompanyMessagesPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  // Track selected position for each conversation
  const [selectedPositions, setSelectedPositions] = useState<Record<number, string>>({});

  const selectedConversation = conversations.find((c) => c.id === selectedId);
  // Determine the active position for the selected conversation
  const activePosition = selectedConversation
    ? selectedPositions[selectedConversation.id] || selectedConversation.position
    : '';
  // Find the position object for the active position
  const activePositionObj = selectedConversation?.positions?.find((p) => p.title === activePosition);
  // Show messages for the active position
  const messages = activePosition && dummyMessagesByPosition[activePosition]
    ? dummyMessagesByPosition[activePosition]
    : [];

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Your <span className="text-blue-500">Conversations</span>
      </h1>
      <div className="max-w-5xl mx-auto flex gap-6">
        {/* Sidebar: Conversation List */}
        <aside className="w-100 bg-gradient-to-b from-[#10131a] via-[#181c23] to-[#0a0e1a] rounded-xl border border-[#232a3a] flex flex-col p-4 shadow-2xl shadow-blue-900/30">
          <input
            type="text"
            placeholder="Search by Name"
            className="mb-4 px-3 py-2 rounded bg-gradient-to-r from-[#181c23] via-[#232a3a] to-[#181c23] text-white border border-[#232a3a] focus:outline-none focus:ring-2 focus:ring-blue-700/60 shadow-inner"
          />
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg mb-2 transition-colors ${selectedId === conv.id ? 'bg-gradient-to-r from-blue-900/80 via-indigo-900/60 to-[#181c23] border border-blue-600 shadow-lg shadow-blue-900/40' : 'hover:bg-gradient-to-r hover:from-[#181c23] hover:via-[#232a3a] hover:to-[#181c23]'}`}
                onClick={() => setSelectedId(conv.id)}
              >
                {conv.avatar ? (
                  <img
                    src={conv.avatar}
                    alt={conv.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#232a3a] bg-[#232a3a] shadow-md shadow-blue-900/30"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#232a3a] flex items-center justify-center text-lg font-bold text-gray-400 shadow-md shadow-blue-900/30">
                    {conv.name[0]}
                  </div>
                )}
                <div className="flex-1 text-left">
                  <div className="font-semibold text-white text-base truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">{conv.name}</div>
                  <div className="text-gray-400 text-xs truncate max-w-[160px]">{conv.lastMessage}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-500 whitespace-nowrap">{conv.time}</span>
                  {conv.unread && <span className="w-2 h-2 bg-blue-500 rounded-full block" />}
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
                {selectedConversation.avatar ? (
                  <img
                    src={selectedConversation.avatar}
                    alt={selectedConversation.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center text-xl font-bold text-gray-400">
                    {selectedConversation.name[0]}
                  </div>
                )}
                <div className="flex flex-col flex-1">
                  <span className="font-bold text-lg text-white leading-tight">{selectedConversation.name}</span>
                  <div className="flex items-center gap-2 relative">
                    <button
                      className="flex items-center gap-2 px-2 py-1 rounded bg-gradient-to-r from-blue-900 to-blue-700 text-white font-semibold text-sm shadow border border-blue-600 hover:brightness-110 transition"
                      onClick={() => setShowDropdown((v) => !v)}
                    >
                      <span>{activePositionObj?.title || selectedConversation.position}</span>
                      <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-2 py-0.5 rounded text-xs font-semibold shadow ml-2">{activePositionObj?.match || selectedConversation.match}% Match</span>
                      <svg className="ml-1 w-4 h-4 text-blue-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {showDropdown && (
                      <div className="absolute left-0 top-10 z-20 w-180 bg-gradient-to-br from-[#181c23] via-[#232a3a] to-[#10131a] border border-blue-700 rounded-xl shadow-2xl p-2 animate-fade-in">
                        {selectedConversation.positions?.map((pos, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-900/30 transition flex-nowrap whitespace-nowrap cursor-pointer"
                            onClick={() => {
                              setSelectedPositions((prev) => ({ ...prev, [selectedConversation.id]: pos.title }));
                              setShowDropdown(false);
                            }}
                          >
                            <span className={`font-semibold text-sm ${pos.title === activePosition ? 'text-blue-300' : 'text-white'} whitespace-nowrap`}>{pos.title}</span>
                            <span className="flex items-center gap-2 ml-2 whitespace-nowrap">
                              <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-2 py-0.5 rounded text-xs font-semibold shadow whitespace-nowrap">{pos.match}% Match</span>
                              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold border ${statusStyles[pos.status]} whitespace-nowrap`} style={{background: 'transparent'}}>{pos.status}</span>
                            </span>
                          </div>
                        ))}
                        <div className="text-center mt-2">
                          <button className="text-blue-400 text-xs underline hover:text-blue-200">SEE MORE</button>
                        </div>
                      </div>
                    )}
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
                  Select a conversation to get started or search a new recipient above
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'company' ? 'justify-start' : 'justify-end'}`}>
                    <div className="flex flex-col items-end max-w-[70%]">
                      <div
                        className={`px-5 py-3 rounded-2xl text-base font-medium shadow-lg ${
                          msg.sender === 'company'
                            ? 'bg-gradient-to-br from-[#232a3a] via-[#181c23] to-[#232a3a] text-white border border-blue-900 shadow-blue-900/30'
                            : 'bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-700 text-white border border-blue-400 shadow-blue-700/30'
                        }`}
                        style={{
                          borderTopLeftRadius: msg.sender === 'company' ? 0 : '1.5rem',
                          borderTopRightRadius: msg.sender === 'applicant' ? 0 : '1.5rem',
                        }}
                      >
                        {msg.text}
                      </div>
                      <span className="text-xs text-gray-500 mt-1 mr-2 self-end" style={{fontSize: '0.75rem'}}>{msg.time}</span>
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
                {/* Gallery icon */}
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-image mr-1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </button>
              <button className="text-blue-400 hover:text-blue-300 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#232a3a] to-[#181c23] border border-blue-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500/60">
                {/* Attachment icon */}
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-paperclip"><path d="M21.44 11.05l-9.19 9.19a5.5 5.5 0 0 1-7.78-7.78l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.2 9.19a1.5 1.5 0 1 1-2.12-2.12l8.49-8.49"/></svg>
              </button>
              <div className="flex-1 flex items-center bg-gradient-to-r from-[#191e2a] via-[#232a3a] to-[#181c23] rounded-2xl border border-[#232a3a] shadow-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/60 transition-all duration-200">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none border-none py-2 px-0 text-base focus:outline-none"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={!selectedConversation}
                  aria-label="Type a message"
                />
              </div>
              <button
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-700 to-blue-400 shadow-lg border-2 border-blue-300 hover:scale-105 hover:shadow-blue-400/40 focus:ring-2 focus:ring-blue-400 transition-transform duration-150"
                disabled={!selectedConversation}
                aria-label="Send message"
              >
                <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send drop-shadow-glow"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
