import { useState } from "react";
import { Calendar1, CircleCheckBig, CircleDollarSign, Clock, LockKeyhole, LockOpen, UserRound, X } from "lucide-react";

export default function Checkout() {
  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [country, setCountry] = useState("US");
  const [zip, setZip] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div
        className="relative w-[1000px] max-w-full rounded-2xl border border-blue-400 p-0 max-h-[860px]"
        style={{
          background: "linear-gradient(180deg, #111113 0%, #0F172A 100%)",
        }}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <div className="px-12 pt-10 pb-8">
          <h2 className="text-white text-2xl font-bold text-center mb-2">
            Unlock the Real Story Behind Every Candidate
          </h2>
          <p className="text-gray-400 text-base text-center mb-8">
            Resumes show what they've done. StepIn shows who they are.
          </p>
          <div className="grid grid-cols-2 gap-14">
            <div>
              <div className="rounded-xl border border-blue-400 p-4 mb-7" style={{ background: "linear-gradient(90deg, #11171E 0%, #0D2B49 100%)" }}>
                <h3 className="text-white font-semibold mb-2 text-xl text-left flex justify-center">
                  Your Plan
                </h3>
                <ul className="space-y-2 text-md font-[500]">
                  <li className="flex items-center text-blue-100">
                    <UserRound className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>
                    Plan: StepIn Premium
                  </li>
                  <li className="flex items-center text-blue-100">
                    <Calendar1 className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>
                    Duration: 60 days
                  </li>
                  <li className="flex items-center text-blue-100">
                    <LockOpen className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>
                    Access: Unlimited candidate insights
                  </li>
                  <li className="flex items-center text-blue-100">
                    <CircleDollarSign className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>
                    Price: $299 (one-time)
                  </li>
                  <li className="flex items-center text-blue-100">
                    <Clock  className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>
                    Status: Founding rate, expires soon
                  </li>
                </ul>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2 text-xl flex justify-center">
                    Why StepIn Premium?
                </h3>
                <ul className="space-y-2 text-md font-[500]">
                    <li className="flex items-center text-blue-100">
                    <CircleCheckBig className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>
                    Full culture + technical fit breakdown
                    </li>
                    <li className="flex items-center text-blue-100">
                    <CircleCheckBig className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>
                    Personality-driven insights
                    </li>
                    <li className="flex items-center text-blue-100">
                    <CircleCheckBig className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>
                    Red flags and working style
                    </li>
                    <li className="flex items-center text-blue-100">
                    <CircleCheckBig className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>
                    No auto-renew, no hidden fees
                    </li>
                    <li className="flex items-center text-blue-100">
                    <CircleCheckBig className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>
                    Dedicated support during your pilot
                    </li>
                </ul>
              </div>
            </div>
            <div>
              <div className="space-y-5">
                <div>
                  <label className="block text-white text-md font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-[#1a2232] border border-[#0A84FF] rounded-xl px-4 py-2 text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Card Information
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Credit/Debit Card Number"
                      className="w-full bg-[#1a2232] border border-[#0A84FF] rounded-xl px-4 py-2 text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 pr-24"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-5 w-8 object-contain" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 w-8 object-contain" />
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="Expiration MM/YY"
                      className="flex-1 bg-[#1a2232] border border-[#0A84FF] rounded-xl px-4 py-2 text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="CVC"
                      className="flex-1 bg-[#1a2232] border border-[#0A84FF] rounded-xl px-4 py-2 text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                  <input
                    type="text"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    placeholder="Name on Card"
                    className="w-full bg-[#1a2232] border border-[#0A84FF] rounded-xl px-4 py-2 text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 mt-2"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Country or Region
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country or Region"
                    className="w-full bg-[#1a2232] border border-[#0A84FF] rounded-xl px-4 py-2 text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 mb-2"
                  />
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="ZIP"
                    className="w-[43%] bg-[#1a2232] border border-[#0A84FF] rounded-xl px-4 py-2 text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div className="flex justify-center">
                    <button className="w-ful hover:bg-blue-600 text-white font-semibold py-2 px-2 rounded-xl text-lg transition-colors duration-200 shadow-lg mt-2" style={{ background: "linear-gradient(90deg, #0A84FF 0%, #33BFFF 100%)" }}>
                        Get Full Access – $299
                    </button>
                </div>
                <div>
                    <p className="text-xs text-[#A0A0A0] text-center mt-2">
                    No subscriptions. No surprises. You keep access for 60 days.</p>
                    <p className="text-xs text-[#A0A0A0] flex flex-row justify-center mt-1"> <LockKeyhole className="mr-2 text-[#0A84FF]" height={14} width={14}/>Secured by Stripe. Instant access on success.</p>
                    <p className="text-xs text-[#A0A0A0] text-center">
                        <span className="block mt-2 text-[#0A84FF] underline">
                            Need help?{" "}
                            <a
                            href="mailto:support@stepincompany.com"
                            className="text-[#0A84FF] underline"
                            >
                            support@stepincompany.com
                            </a>
                        </span>
                    </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}