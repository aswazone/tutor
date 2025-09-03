import React, { useEffect, useState } from 'react';

interface TimerProps {
  start: boolean;
}

const Timer: React.FC<TimerProps> = ({ start }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (start) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    } else if (!start && seconds !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [start, seconds]);

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const remainingSeconds = secs % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center items-center p-6">
      <div 
        className={`
          font-mono text-sky-400/70 
          bg-gradient-to-b from-[#011e2b] to-sky-[#012333]
          px-6 rounded-xl text-xl font-semibold 
          tracking-wider text-center min-w-[120px]
          relative overflow-hidden
          transition-all duration-300
          hover:text-sky-400
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
        <span className="relative z-10">{formatTime(seconds)}</span>
      </div>
    </div>
  );
};

export default Timer;
