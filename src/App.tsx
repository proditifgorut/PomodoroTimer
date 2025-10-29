import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Briefcase, Volume2, VolumeX } from 'lucide-react';

type SessionType = 'work' | 'break';

function App() {
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  const [timeLeft, setTimeLeft] = useState<number>(WORK_TIME);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKni77RgGwU7k9n1fqAXOXiN7pioPh0pIJ8o');
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    if (isSoundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }

    if (sessionType === 'work') {
      setCompletedSessions((prev) => prev + 1);
      setSessionType('break');
      setTimeLeft(BREAK_TIME);
    } else {
      setSessionType('work');
      setTimeLeft(WORK_TIME);
    }
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionType === 'work' ? WORK_TIME : BREAK_TIME);
  };

  const switchSession = (type: SessionType) => {
    setIsRunning(false);
    setSessionType(type);
    setTimeLeft(type === 'work' ? WORK_TIME : BREAK_TIME);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = sessionType === 'work' 
    ? ((WORK_TIME - timeLeft) / WORK_TIME) * 100
    : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      sessionType === 'work' 
        ? 'bg-gradient-to-br from-rose-500 via-red-500 to-orange-500' 
        : 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500'
    }`}>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg">
              Pomodoro Timer
            </h1>
            <p className="text-white/90 text-sm md:text-lg">
              Tingkatkan produktivitas dengan teknik Pomodoro
            </p>
          </div>

          {/* Main Timer Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 mb-6">
            {/* Session Type Selector */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={() => switchSession('work')}
                className={`flex-1 py-3 md:py-4 px-4 md:px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  sessionType === 'work'
                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">Kerja</span>
              </button>
              <button
                onClick={() => switchSession('break')}
                className={`flex-1 py-3 md:py-4 px-4 md:px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  sessionType === 'break'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Coffee className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">Istirahat</span>
              </button>
            </div>

            {/* Timer Display */}
            <div className="relative mb-8">
              <svg className="w-full h-auto" viewBox="0 0 400 400">
                <circle
                  cx="200"
                  cy="200"
                  r="180"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="20"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="180"
                  fill="none"
                  stroke={sessionType === 'work' ? 'url(#workGradient)' : 'url(#breakGradient)'}
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 180}`}
                  strokeDashoffset={`${2 * Math.PI * 180 * (1 - progress / 100)}`}
                  transform="rotate(-90 200 200)"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="workGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                  <linearGradient id="breakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl md:text-7xl font-bold text-gray-800 mb-2 md:mb-4 tabular-nums">
                    {formatTime(timeLeft)}
                  </div>
                  <div className={`text-sm md:text-lg font-medium ${
                    sessionType === 'work' ? 'text-rose-500' : 'text-emerald-500'
                  }`}>
                    {sessionType === 'work' ? 'Waktu Fokus' : 'Waktu Istirahat'}
                  </div>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-3 md:gap-4 justify-center mb-6">
              <button
                onClick={toggleTimer}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
                  sessionType === 'work'
                    ? 'bg-gradient-to-br from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600'
                    : 'bg-gradient-to-br from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600'
                } text-white`}
              >
                {isRunning ? (
                  <Pause className="w-7 h-7 md:w-9 md:h-9" />
                ) : (
                  <Play className="w-7 h-7 md:w-9 md:h-9 ml-1" />
                )}
              </button>
              <button
                onClick={resetTimer}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:border-gray-400 active:scale-95 text-gray-700"
              >
                <RotateCcw className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              <button
                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:border-gray-400 active:scale-95 text-gray-700"
              >
                {isSoundEnabled ? (
                  <Volume2 className="w-6 h-6 md:w-8 md:h-8" />
                ) : (
                  <VolumeX className="w-6 h-6 md:w-8 md:h-8" />
                )}
              </button>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 md:p-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">
                  {completedSessions}
                </div>
                <div className="text-xs md:text-sm text-gray-600 font-medium">
                  Sesi Selesai Hari Ini
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">Tentang Teknik Pomodoro</h3>
            <ul className="space-y-2 text-xs md:text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>Kerja fokus selama 25 menit tanpa gangguan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>Istirahat 5 menit setelah setiap sesi kerja</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>Setelah 4 sesi, ambil istirahat lebih panjang (15-30 menit)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
