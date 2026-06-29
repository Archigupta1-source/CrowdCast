import { useState, useEffect } from 'react';

const Timer = ({ seconds }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const percentage = (timeLeft / seconds) * 100;
  const isLow = timeLeft <= 10;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F3F4F6" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15.9"
            fill="none"
            stroke={isLow ? '#EF4444' : '#7C3AED'}
            strokeWidth="3"
            strokeDasharray="100"
            strokeDashoffset={100 - percentage}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-xs font-semibold ${isLow ? 'text-red-500' : 'text-gray-700'}`}>
          {timeLeft}
        </span>
      </div>
    </div>
  );
};

export default Timer;