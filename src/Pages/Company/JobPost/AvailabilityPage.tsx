import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  id: string;
  day: string;
  dayOfWeek?: string;
  enabled: boolean;
  times: TimeSlot[];
}

export default function AvailabilityPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"specific" | "recurring">("specific");
  const [timeZone] = useState<string>("Eastern Time - US and Canada");
  const [interviewLength] = useState<number>(30);
  
  const [specificDates, setSpecificDates] = useState<DayAvailability[]>([
    { id: "1", day: "December 11", enabled: false, times: [] },
    { id: "2", day: "December 12", dayOfWeek: "Monday", enabled: true, times: [
      { start: "8:00 AM", end: "11:30 AM" },
      { start: "2:00 PM", end: "5:00 PM" }
    ]},
    { id: "3", day: "December 13", dayOfWeek: "Tuesday", enabled: true, times: [
      { start: "9:10 AM", end: "2:30 PM" },
      { start: "4:00 PM", end: "6:00 PM" }
    ]},
    { id: "4", day: "December 14", enabled: false, times: [] },
    { id: "5", day: "December 15", dayOfWeek: "Thursday", enabled: true, times: [
      { start: "2:40 PM", end: "3:40 PM" }
    ]},
    { id: "6", day: "December 16", dayOfWeek: "Friday", enabled: true, times: [
      { start: "9:00 AM", end: "12:00 PM" }
    ]},
    { id: "7", day: "December 17", dayOfWeek: "Saturday", enabled: false, times: [] }
  ]);

  const [recurringDays, setRecurringDays] = useState<DayAvailability[]>([
    { id: "1", day: "Sunday", enabled: false, times: [] },
    { id: "2", day: "Monday", enabled: true, times: [
      { start: "8:00 AM", end: "11:30 AM" },
      { start: "2:00 PM", end: "5:00 PM" }
    ]},
    { id: "3", day: "Tuesday", enabled: true, times: [
      { start: "9:10 AM", end: "2:30 PM" },
      { start: "4:00 PM", end: "6:00 PM" }
    ]},
    { id: "4", day: "Wednesday", enabled: false, times: [] },
    { id: "5", day: "Thursday", enabled: true, times: [
      { start: "2:40 PM", end: "3:40 PM" }
    ]},
    { id: "6", day: "Friday", enabled: true, times: [
      { start: "9:00 AM", end: "12:00 PM" }
    ]},
    { id: "7", day: "Saturday", enabled: false, times: [] }
  ]);

  const [currentWeek, setCurrentWeek] = useState<string>("Week of May 11-17");

  const handleSaveSettings = () => {
    alert("Settings saved!");
    navigate('/jobs');
  };

  const addTimeSlot = (dayId: string) => {
    const days = activeTab === "specific" ? [...specificDates] : [...recurringDays];
    const dayIndex = days.findIndex(day => day.id === dayId);

    if (dayIndex !== -1) {
      days[dayIndex].times.push({ start: "9:00 AM", end: "12:00 PM" });
      if (activeTab === "specific") {
        setSpecificDates(days);
      } else {
        setRecurringDays(days);
      }
    }
  };

  const removeTimeSlot = (dayId: string, index: number) => {
    const days = activeTab === "specific" ? [...specificDates] : [...recurringDays];
    const dayIndex = days.findIndex(day => day.id === dayId);

    if (dayIndex !== -1) {
      days[dayIndex].times.splice(index, 1);
      if (activeTab === "specific") {
        setSpecificDates(days);
      } else {
        setRecurringDays(days);
      }
    }
  };

  const toggleDayEnabled = (dayId: string) => {
    const days = activeTab === "specific" ? [...specificDates] : [...recurringDays];
    const dayIndex = days.findIndex(day => day.id === dayId);

    if (dayIndex !== -1) {
      days[dayIndex].enabled = !days[dayIndex].enabled;
      if (!days[dayIndex].enabled) {
        days[dayIndex].times = [];
      } else if (days[dayIndex].times.length === 0) {
        days[dayIndex].times.push({ start: "9:00 AM", end: "12:00 PM" });
      }

      if (activeTab === "specific") {
        setSpecificDates(days);
      } else {
        setRecurringDays(days);
      }
    }
  };

  const navigateWeek = (direction: "next" | "prev") => {
    setCurrentWeek(direction === "next" ? "Next Week Range" : "Previous Week Range");
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="w-full px-[140px]">
        <h1 className="text-[40px] font-bold text-center mb-[108px] whitespace-nowrap">
          Choose Your <span className="text-[rgba(10,132,255,1)]">Interview Availability</span>
        </h1>
        
        <div className="space-y-6">
          {/* Time Zone Section */}
          <div className="mb-6">
            <h2 className="text-[40px] font-[700] mb-2">Time Zone</h2>
            <div className="w-[576px] h-[40px] ml-[120px] flex items-center justify-between bg-transparent rounded-[8px] border border-[#FFFFFF] px-4">
              <span className="font-normal text-[24px] leading-[100%]">{timeZone}</span>
              <span className="font-normal text-[24px] leading-[100%] text-right">11:52 AM</span>
            </div>
          </div>
          
            {/* Interview Length Section */}
            <div className="mb-6">
            <h2 className="text-[40px] font-[700] mb-2">Interview Length</h2>
            <div className="w-[196px] h-[40px] text-[24px] ml-[120px] flex items-center bg-transparent rounded-[8px] border border-[#FFFFFF] px-4 whitespace-nowrap">
              {/* Clock icon using Heroicons or similar */}
              <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              </svg>
              <span>
              <span className="text-[rgba(10,132,255,1)] font-[700]">{interviewLength}</span>
              <span className="text-white"> Minutes</span>
              </span>
            </div>
            </div>

          
          {/* Tab Selection */}
            <div className="flex justify-center space-x-8 mb-6">
            <button 
              className={`w-[237px] h-[40px] rounded-[6px] px-4 py-1 text-[32px] whitespace-nowrap font-medium transition-all duration-200 flex items-center justify-center ${
              activeTab === "specific"
                ? "text-[#0A84FF] bg-transparent shadow-[0px_0px_12px_0px_#0A84FF99]"
                : "text-gray-400 bg-transparent"
              }`}
              onClick={() => setActiveTab("specific")}
            >
              Specific Dates
            </button>

            <button 
              className={`w-[237px] h-[40px] rounded-[6px] px-4 py-1 text-[32px] whitespace-nowrap font-medium transition-all duration-200 flex items-center justify-center ${
              activeTab === "recurring"
                ? "text-[#0A84FF] bg-transparent shadow-[0px_0px_12px_0px_#0A84FF99]"
                : "text-gray-400 bg-transparent"
              }`}
              onClick={() => setActiveTab("recurring")}
            >
              Recurring
            </button>
            </div>
            <hr className="border-t border-[#252525E5] mb-6" />

          {/* Available Times Section */}
          <div>
            <h2 className="text-[40px] font-[700] mb-4">Available Times</h2>
            
            {activeTab === "specific" && (
  <>
    <div className="flex justify-center items-center text-[32px] font-[400] mb-4 space-x-4">
      <button onClick={() => navigateWeek("prev")} className="text-[rgba(10,132,255,1)]">
        &lt;
      </button>
      <span className="text-[#0A84FF]">{currentWeek}</span>
      <button onClick={() => navigateWeek("next")} className="text-[rgba(10,132,255,1)]">
        &gt;
      </button>
    </div>

    <div className="space-y-4">
      {specificDates.map((day) => (
        <div key={day.id} className="pb-3">
          <div className="flex items-start justify-between gap-6">
            {/* Left: Checkbox + Day Info */}
            <div className="flex items-center justify-start">
              <input
                type="checkbox"
                checked={day.enabled}
                onChange={() => toggleDayEnabled(day.id)}
                className="mr-3 w-[45px] h-[45px] rounded-[20px] border-2 border-white text-[rgba(10,132,255,1)] focus:ring-[rgba(10,132,255,1)]"
              />
              <div className="flex items-center space-x-4">
                <div>
                  <span className="font-[700] text-[40px] leading-none">{day.day}</span>
                  {day.dayOfWeek && (
                    <span className="text-[rgba(10,132,255,1)] text-sm block">{day.dayOfWeek}</span>
                  )}
                </div>
                {!day.enabled && (
                  <span className="text-[#ACAAAA] text-[40px] font-[400] leading-[100%] text-center">
                    Click to Enable
                  </span>
                )}
              </div>
            </div>

            {/* Right: Time Slots + Add Button inline */}
            {day.enabled && (
              <div className="flex flex-col space-y-3 mr-[610px]">
                {day.times.map((time, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-[208px] h-[54px] text-[rgba(10,132,255,1)] m-3 bg-transparent flex items-center justify-center rounded-[8px] border-2 border-[#0A84FF]">
                      <span className="font-[700] text-[40px] leading-none text-center">{time.start}</span>
                    </div>
                    <span className="text-[rgba(10,132,255,1)] font-[900]"> ——— </span>
                    <div className="w-[208px] h-[54px] text-[rgba(10,132,255,1)] bg-transparent flex items-center justify-center rounded-[8px] border-2 border-[#0A84FF]">
                      <span className="font-[700] text-[40px] leading-none text-center">{time.end}</span>
                    </div>
                    <button
                      onClick={() => removeTimeSlot(day.id, index)}
                      className="text-white text-[32px] leading-none pl-4"
                    >
                      ✕
                    </button>

                    {/* Only show + on the first slot */}
                    {index === 0 && (
                      <button
                        onClick={() => addTimeSlot(day.id)}
                        className="text-white text-[48px] leading-none pl-7 ml-8"
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Added 1000px border line below each day and date */}
          <div className="w-[1000px] border-b border-[#ACAAAA] mt-3 mb-3"></div>
        </div>
      ))}
    </div>
  </>
)}


            {activeTab === "recurring" && (
            <div className="space-y-4">
              {recurringDays.map((day) => (
              <div key={day.id} className="pb-3">
                <div className="flex items-start justify-between gap-6">
                {/* Left: Checkbox + Day Info */}
                <div className="flex items-center justify-start">
                  <input
                  type="checkbox"
                  checked={day.enabled}
                  onChange={() => toggleDayEnabled(day.id)}
                  className="mr-3 w-[45px] h-[45px] rounded-[20px] border-2 border-white text-[rgba(10,132,255,1)] focus:ring-[rgba(10,132,255,1)]"
                  />
                  <span className="font-[700] text-[40px] leading-none">{day.day}</span>
                  {!day.enabled && (
                  <span className="text-[#ACAAAA] text-[40px] font-[400] leading-[100%] text-center ml-4">
                    Click to Enable
                  </span>
                  )}
                </div>

                {/* Right: Time Slots + Add Button inline */}
                {day.enabled && (
                  <div className="flex flex-col space-y-3 mr-[700px]">
                  {day.times.map((time, index) => (
                    <div key={index} className="flex items-center space-x-2">
                    <div className="w-[208px] h-[54px] text-[rgba(10,132,255,1)] m-3 bg-transparent flex items-center justify-center rounded-[8px] border-2 border-[#0A84FF]">
                      <span className="font-[700] text-[40px] leading-none text-center">{time.start}</span>
                    </div>
                    <span className="text-[rgba(10,132,255,1)] font-[900]"> ——— </span>
                    <div className="w-[208px] h-[54px] text-[rgba(10,132,255,1)] m-3 bg-transparent flex items-center justify-center rounded-[8px] border-2 border-[#0A84FF]">
                      <span className="font-[700] text-[40px] leading-none text-center">{time.end}</span>
                    </div>
                    <button
                      onClick={() => removeTimeSlot(day.id, index)}
                      className="text-white text-[32px] leading-none pl-4"
                    >
                      ✕
                    </button>

                    {/* Only show + on the first slot */}
                    {index === 0 && (
                      <button
                      onClick={() => addTimeSlot(day.id)}
                      className="text-white text-[48px] leading-none pl-7 ml-8"
                      >
                      +
                      </button>
                    )}
                    </div>
                  ))}
                  </div>
                )}
                </div>
                {/* Added 1000px border line below each day */}
                <div className="w-[1000px] border-b border-[#ACAAAA] mt-3 mb-3"></div>
              </div>
              ))}
            </div>
            )}

          {/* Save Button */}
          <div className="flex justify-center mt-8">
  <button
    onClick={handleSaveSettings}
    className="w-[312px] h-[80px] bg-[#0A84FF] text-white font-medium rounded-[8px] hover:bg-blue-600 transition-colors relative"
    style={{
      boxShadow: "8px -8px 8px 0px rgba(0, 0, 0, 0.25) inset, -8px 8px 8px 0px rgba(0, 0, 0, 0.25) inset"
    }}
  >
    <span className="text-[40px] font-[700]">Save Settings</span>
  </button>
</div>
        </div>
      </div>
    </div>
  </div>
  );
}