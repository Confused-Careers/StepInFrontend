import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, MessageCircle, DollarSign } from "lucide-react";

export function JobPostingPage() {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => setIsApplying(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header - Centered */}
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Senior Electrical Engineer</h1>
              <p className="text-xl text-gray-400">Google · Palo Alto, CA</p>
            </div>

            {/* Why this role */}
            <div className="rounded-lg p-6 bg-gradient-to-r from-[#050B1A] to-[#0F172A] border border-[#2A2F40]">
              <h2 className="text-xl font-semibold mb-4">Why this role</h2>
              <div className="space-y-3 text-gray-300">
                <p>· Build the materials stack powering AI GPUs for 2030</p>
                <p>· Own process R&D and step into Tech Lead in 12 months</p>
                <p>· Only here: pioneer immersion-cooling GPUs at datacenter scale</p>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="rounded-lg p-6 bg-gradient-to-r from-[#050B1A] to-[#0F172A] border border-[#2A2F40]">
              <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
              <div className="space-y-3 text-gray-300">
                <p>· Lead materials selection and qualification for next-generation GPU and AI hardware, focusing on PCB laminates, polymers, and metal routing-compatible films</p>
                <p>· Develop and own validation test plans, including experimental design, pass/fail criteria, and data analysis for high-temperature, high-power environments</p>
                <p>· Drive process development for new manufacturing routes—resin formulations, metallization, solder-reflow windows—to hit electrical, thermal, and cost targets <span className="text-blue-400 cursor-pointer hover:underline">see more</span></p>
              </div>
            </div>

            {/* Qualifications */}
            <div className="rounded-lg p-6 bg-gradient-to-r from-[#050B1A] to-[#0F172A] border border-[#2A2F40]">
              <h2 className="text-xl font-semibold mb-4">Qualifications</h2>
              <div className="space-y-3 text-gray-300">
                <p>· M.S. or Ph.D. in Materials Science, Chemical Engineering, Chemistry, or related field</p>
                <p>· 6-8+ years of experience in PCB or electronic-materials R&D / manufacturing</p>
                <p>· Deep knowledge of polymer structure-property relationships and high-speed laminate systems <span className="text-blue-400 cursor-pointer hover:underline">see more</span></p>
              </div>
            </div>
          </div>

          {/* Sidebar - Job Card */}
          <div className="lg:col-span-1 flex justify-center lg:justify-start">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl p-6 sticky top-8 bg-gradient-to-b from-[#050B1A] to-[#0F172A] border relative overflow-hidden flex flex-col"
              style={{
                width: '100%',
                maxWidth: '326px',
                height: '547px',
                boxShadow: '0px 0px 12px 0px #0A84FF80',
                border: '1px solid #0A84FF'
              }}
            >
              {/* Company Logo */}
              <div className="flex justify-center mb-12">
                <div className="text-5xl font-bold">
                  <span className="text-blue-500">G</span>
                  <span className="text-red-500">o</span>
                  <span className="text-yellow-500">o</span>
                  <span className="text-blue-500">g</span>
                  <span className="text-green-500">l</span>
                  <span className="text-red-500">e</span>
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApply}
                className="w-full bg-[#0A84FF] text-white h-12 rounded-xl font-bold text-[28px] leading-none transition-all duration-200 hover:bg-[#0876E8] disabled:opacity-50 mb-12"
                disabled={isApplying}
              >
                {isApplying ? "Applying..." : "Apply in < 2 min"}
              </button>

              {/* Job Details */}
              <div className="flex flex-col gap-10">
                {/* Salary */}
                <div className="flex justify-center">
                  <div 
                    className="rounded-lg px-4 py-2 text-white bg-gradient-to-r from-[rgba(26,52,78,0.5)] to-[#03284D] flex items-center justify-center"
                    style={{
                      width: '168px',
                      height: '31px',
                      fontFamily: 'Inter',
                      fontWeight: 600,
                      fontSize: '20px',
                      lineHeight: '100%',
                      textAlign: 'center'
                    }}
                  >
                    $100K - $250K
                  </div>
                </div>
                
                {/* Location and Applications */}
                <div className="space-y-8 px-4">
                  <div className="flex items-center gap-3 font-medium text-xl leading-none">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <span>Palo Alto, CA</span>
                  </div>
                  
                  <div className="flex items-center gap-3 font-medium text-xl whitespace-nowrap leading-none">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span>Rolling Applications</span>
                  </div>
                </div>
              </div>

              {/* Talk to AI - Positioned at bottom */}
              <div className="mt-auto">
                <button className="w-full h-[45px] bg-transparent text-blue-400 hover:bg-blue-600/10 rounded-md border border-[#0A84FF] font-bold text-[24px] leading-[140%] flex items-center justify-center gap-2 transition-all duration-200">
                  <MessageCircle className="w-5 h-5" />
                  Talk to StepIn AI
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}