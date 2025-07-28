import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApplicantsService } from '@/services/applicantServices';

const ApplicantDetailsPage: React.FC = () => {
  const { jobId, applicantId } = useParams<{ jobId: string; applicantId: string }>();
  const routeLocation = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicantData, setApplicantData] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumMessage, setPremiumMessage] = useState<string>('');
  
  // Get match scores from navigation state
  const matchScores = routeLocation.state as {
    matchPercentage?: number;
    skillsScore?: number;
    cultureScore?: number;
  } | null;

  useEffect(() => {
    fetchApplicantData();
  }, [applicantId]);

  const fetchApplicantData = async () => {
    if (!applicantId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch applicant insights using the new endpoint
      const insightsResponse = await ApplicantsService.getApplicantInsights(applicantId);
      
      if (insightsResponse.data) {
        setApplicantData(insightsResponse.data);
        setIsPremium(insightsResponse.data.isPremiumContent || false);
        setPremiumMessage(insightsResponse.data.premiumMessage || '');
      }
    } catch (err: any) {
      console.error('Error fetching applicant data:', err);
      setError(err.message || 'Failed to load applicant details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !applicantData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-white text-lg">{error || 'Failed to load applicant details'}</p>
          <Link to={`/company/dashboard/${jobId}/applications`} className="text-blue-500 hover:underline mt-4 inline-block">
            Back to Applicants
          </Link>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const {
    firstName,
    lastName,
    location,
    profilePictureUrl,
    currentRole,
    currentCompany,
    personalityInsight,
    strengths: apiStrengths,
    considerations: apiConsiderations,
    technicalStrengths: apiTechnicalStrengths,
    pastRoles: apiPastRoles,
    education: apiEducation,
    certifications: apiCertifications,
  } = applicantData;

  // Use API data or fallback to empty arrays
  const strengths = apiStrengths || [
  ];

  const considerations = apiConsiderations || [
  ];

  const technicalStrengths = apiTechnicalStrengths || [
  ];

  const pastRoles = apiPastRoles || [
  ];

  const education = apiEducation || [
  ];

  const certifications = apiCertifications || [
  ];

  const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-gradient-to-br from-slate-900/60 via-slate-900/30 to-black/50 border border-slate-800 rounded-xl p-6 shadow-2xl backdrop-blur-lg transition-all hover:border-slate-700 hover:shadow-blue-500/10 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="relative overflow-hidden bg-black text-white min-h-screen font-sans">
      
      <div className="relative z-10 container mx-auto p-4 md:p-8">
        <Link to={`/company/dashboard/${jobId}/applications`} className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Candidates
        </Link>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 mr-6 flex-shrink-0 shadow-lg overflow-hidden">
              {profilePictureUrl ? (
                <img 
                  src={profilePictureUrl} 
                  alt={`${firstName} ${lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400">
                  {firstName?.[0]}{lastName?.[0]}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{firstName} {lastName}</h1>
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-1 px-4 rounded-lg shadow-md hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105">
                    AI Agent
                </Button>
              </div>
              {(currentRole || currentCompany) && (
                <p className="text-slate-300 mt-2">
                  {currentRole} {currentRole && currentCompany && 'at'} {currentCompany}
                </p>
              )}
              <p className="text-slate-400 flex items-center mt-1">
                <MapPin size={16} className="mr-2" />
                {location || 'Location not specified'}
              </p>
              <div className="flex items-center space-x-2 mt-4">
                {matchScores?.matchPercentage !== undefined && (
                  <span className="px-2 py-1 rounded-md bg-green-500 text-white text-xs font-medium">
                    {Math.round(matchScores.matchPercentage)}% Match
                  </span>
                )}
                {matchScores?.cultureScore !== undefined && (
                  <span className="px-2 py-1 rounded-md bg-purple-500 text-white text-xs font-medium">
                    {Math.round(matchScores.cultureScore)}% Cultural
                  </span>
                )}
                {matchScores?.skillsScore !== undefined && (
                  <span className="px-2 py-1 rounded-md bg-blue-500 text-white text-xs font-medium">
                    {Math.round(matchScores.skillsScore)}% Technical
                  </span>
                )}
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
            {!isPremium && premiumMessage && (
              <div className="mb-8 p-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl">
                <p className="text-amber-200 text-center text-lg font-medium">
                  {premiumMessage}
                </p>
                <div className="text-center mt-4">
                  <Link to="/company/pricing" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all">
                    Upgrade to Premium
                  </Link>
                </div>
              </div>
            )}
            
            <section>
                <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-500">What It Feels Like to Work With {firstName}</h2>
                <div className="border border-blue-400/30 rounded-xl p-8 bg-gradient-to-br from-blue-600/20 via-transparent to-transparent backdrop-blur-md shadow-lg shadow-blue-500/10">
                    <p className="text-slate-300 leading-relaxed text-lg">
                    {personalityInsight || `${firstName} is a dedicated professional who brings valuable skills and experience to the team.`}
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-500">Strengths and Considerations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="space-y-4">
                            {strengths.map((item: string, index: number) => (
                                <div key={index} className="bg-gradient-to-br from-green-600/20 to-slate-900/10 border border-green-500/30 text-green-200 p-4 rounded-xl shadow-lg hover:shadow-green-500/20 hover:border-green-400/50 transition-all">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="space-y-4">
                            {considerations.map((item: string, index: number) => (
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
                {technicalStrengths.map((skill: any, index: number) => (
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
                {pastRoles.map((role: any, index: number) => (
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
                    {role.skills.map((skill: string, i: number) => (
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
                {education.map((edu: any, index: number) => (
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
                {certifications.map((cert: any, index: number) => (
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