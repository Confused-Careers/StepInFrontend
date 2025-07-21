import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ApplicantDetailsPage: React.FC = () => {
  const strengths = [
    "Values mission-driven culture; aligns with brand's sustainability push",
    'Makes others feel heard and included',
    'Enjoys feedback and iteration',
    'Sees the big picture and adjusts expectations',
    'Above-average situational awareness & safety orientation -> reduces onsite incidents',
  ];

  const considerations = [
    "May avoid confrontation when it's needed",
    'Overcommits to last-minute requests',
    'Low tolerance for ambiguous priorities; may need clearer sprint goals',
    'May need extra push to share unfinished work',
    "Lower tolerance for rapid pivots; startup's roadmap changes could cause stress",
  ];

  const technicalStrengths = [
    {
      title: 'Front-End Development',
      description: 'Built a responsive, mobile-first dashboard for a real estate analytics platform using React and Tailwind, improving load speed by 40% and reducing user drop-off during onboarding.',
    },
    {
      title: 'Cloud Platforms',
      description: 'Architected and deployed a multi-tier web application on AWS (ECS, RDS, S3, CloudFront), automating infrastructure with Terraform and cutting monthly hosting costs by 35% while improving uptime to 99.9%.',
    },
    {
      title: 'AI/ML Integration',
      description: 'Integrated a machine learning model into a Flask web app to personalize product recommendations, increasing user engagement by 22% and reducing bounce rate across key pages.',
    },
  ];

  const pastRoles = [
    {
      title: 'Senior Product Manager',
      company: 'SpaceX • Starbase, TX',
      date: '2022 - Present',
      description: 'You cut Falcon 9 turnaround 28% by launching a digital-twin dashboard, saving ~18 engineer-hours per rocket.',
      skills: ['LabVIEW', 'SQL', 'Finite-Element Analysis'],
    },
    {
      title: 'Product Manager',
      company: 'Lockheed Martin • Denver, CO',
      date: '2021 - 2022',
      description: 'You launched a digital-twin upkeep suite that formats vehicle maintenance downtime by ~18 hr per jet—adopted by two squadron commanders within 90 days.',
      skills: ['Excel Macros', 'Python', 'Financial Modeling'],
    },
    {
      title: 'Flight Staff Engineer',
      company: 'NASA • Washington, DC',
      date: '2019 - 2021',
      description: 'You built an on-board fault-free AI that slashed ISS anomaly triage from 5 min to 2 sec and averted loss of Attitude Control after the 2022 coolant leak drill.',
      skills: ['Thermal Analysis', 'Additive Manufacturing'],
    },
  ];

  const education = [
    {
      degree: 'M.S. in Mathematics',
      institution: 'UNIVERSITY OF PRINCETON',
      details: 'Harold W. Dodds Fellowship\nResearch on Quantum Field Theory',
      date: '2014 - 2016',
      gpa: '4.46 GPA'
    },
    {
      degree: 'M.S. in Electrical Engineering',
      institution: 'UNIVERSITY OF VIRGINIA',
      details: '3.95 GPA\nPresident Scholar\nPresident of Data Science Club',
      date: '2010 - 2014',
      gpa: '3.95 GPA'
    },
    {
        degree: 'High School Diploma',
        institution: 'DALLAS JESUIT HIGH SCHOOL',
        details: 'Robotics Team Captain\nWrestling Team Captain',
        date: '2010',
        gpa: '4.46 GPA'
    },
  ];

  const certifications = [
    {
      name: 'Excel Expert',
      organization: 'MICROSOFT',
      description: 'Learned to create functions and formulas within Microsoft Excel. Passed assessment.',
      date: '2016',
    },
    {
      name: 'Texas Real Estate License',
      organization: 'TEXAS REAL ESTATE COMMISSION',
      description: 'Equip to operate as a Texas real estate agent in the state of Texas.',
      date: '2023 - 2025',
    },
    {
      name: 'LangGraph',
      organization: 'LANGCHAIN ACADEMY',
      description: 'Learned to build multi-agent AI systems allowing for multi-step reasoning workflows in Python.',
      date: '2025',
    },
  ];

  const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-gradient-to-br from-slate-900/60 via-slate-900/30 to-black/50 border border-slate-800 rounded-xl p-6 shadow-2xl backdrop-blur-lg transition-all hover:border-slate-700 hover:shadow-blue-500/10 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="relative overflow-hidden bg-black text-white min-h-screen font-sans">
      
      <div className="relative z-10 container mx-auto p-4 md:p-8">
        <Link to="/company/job-posts" className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Candidates
        </Link>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 mr-6 flex-shrink-0 shadow-lg overflow-hidden">
              <img 
                src="https://picsum.photos/seed/JimJones/200/200" 
                alt="Jim Jones"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Jim Jones</h1>
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-1 px-4 rounded-lg shadow-md hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105">
                    AI Agent
                </Button>
              </div>
              <p className="text-slate-400 flex items-center mt-1">
                <MapPin size={16} className="mr-2" />
                Dallas, TX
              </p>
              <div className="flex items-center space-x-2 mt-4">
                <span className="px-2 py-1 rounded-md bg-green-500 text-white text-xs font-medium">86% Match</span>
                <span className="px-2 py-1 rounded-md bg-purple-500 text-white text-xs font-medium">79% Cultural</span>
                <span className="px-2 py-1 rounded-md bg-blue-500 text-white text-xs font-medium">92% Technical</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end w-full md:w-auto gap-4">
            <div className="flex items-center space-x-4">
                <button className="bg-[rgba(59,130,246,1)] text-white rounded-md py-2 px-5 text-[16px] font-bold hover:bg-blue-500 transition-colors">
                  Accept
                </button>
                <button className="border border-[rgba(59,130,246,1)] text-[rgba(59,130,246,1)] rounded-md py-2 px-5 text-[16px] font-bold hover:bg-blue-500/10 transition-colors">
                  Interview
                </button>
                <button className="text-[rgba(209,209,214,1)] text-[16px] font-medium hover:text-white transition-colors">
                  Not Interested
                </button>
            </div>
          </div>
        </header>
        
        <div className="space-y-16">
            <section>
                <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-500">What It Feels Like to Work With Jim</h2>
                <div className="border border-blue-400/30 rounded-xl p-8 bg-gradient-to-br from-blue-600/20 via-transparent to-transparent backdrop-blur-md shadow-lg shadow-blue-500/10">
                    <p className="text-slate-300 leading-relaxed text-lg">
                    Jim is the kind of teammate who gets things moving when others are stuck. He brings clarity to chaos and quietly takes ownership without being asked. You'll notice he listens before speaking, but when he does, it's sharp, well-timed, and usually moves the team forward. He's the person others go to when the pressure is high, not because he's loud, but because he's steady. Jim cares about getting it right, not getting credit, and that makes him trusted fast.
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-500">Strengths and Considerations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="space-y-4">
                            {strengths.map((item, index) => (
                                <div key={index} className="bg-gradient-to-br from-green-600/20 to-slate-900/10 border border-green-500/30 text-green-200 p-4 rounded-xl shadow-lg hover:shadow-green-500/20 hover:border-green-400/50 transition-all">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="space-y-4">
                            {considerations.map((item, index) => (
                                <div key={index} className="bg-gradient-to-br from-red-600/20 to-slate-900/10 border border-red-500/30 text-red-200 p-4 rounded-xl shadow-lg hover:shadow-red-500/20 hover:border-red-400/50 transition-all">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section>
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-500">Top Technical Strengths</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {technicalStrengths.map((skill, index) => (
                <Card key={index}>
                    <h3 className="text-xl font-bold mb-3 text-white">{skill.title}</h3>
                    <p className="text-slate-400">{skill.description}</p>
                </Card>
                ))}
            </div>
            </section>
            
            <section>
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-500">Past Roles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastRoles.map((role, index) => (
                <Card key={index}>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-xl font-bold text-white">{role.title}</h3>
                            <p className="text-slate-400">{role.company}</p>
                        </div>
                        <span className="text-sm text-slate-500 flex-shrink-0 pl-2">{role.date}</span>
                    </div>
                    <p className="text-slate-300 my-4">{role.description}</p>
                    <div className="flex flex-wrap gap-2">
                    {role.skills.map((skill, i) => (
                        <span key={i} className="bg-slate-800 text-slate-300 text-xs font-medium px-3 py-1 rounded-full">{skill}</span>
                    ))}
                    </div>
                </Card>
                ))}
            </div>
            </section>

            <section>
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-500">Education</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {education.map((edu, index) => (
                <Card key={index}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                            <p className="text-slate-400">{edu.institution}</p>
                            <p className="text-slate-500 text-sm mt-1">{edu.gpa}</p>
                        </div>
                        <span className="text-sm text-slate-500 flex-shrink-0 pl-2">{edu.date}</span>
                    </div>
                    <div className="border-t border-slate-700 my-4"></div>
                    <p className="text-slate-300 whitespace-pre-line">{edu.details}</p>
                </Card>
                ))}
            </div>
            </section>

            <section>
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-500">Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {certifications.map((cert, index) => (
                <Card key={index}>
                    <h3 className="text-xl font-bold text-white">{cert.name}</h3>
                    <p className="text-slate-400 mb-2">{cert.organization}</p>
                    <p className="text-slate-300 mb-4">{cert.description}</p>
                    <span className="text-sm text-slate-500">{cert.date}</span>
                </Card>
                ))}
            </div>
            </section>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailsPage; 