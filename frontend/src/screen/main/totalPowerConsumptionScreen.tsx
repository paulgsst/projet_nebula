import { 
  Droplets, 
  Bell, 
  Settings, 
  User, 
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  Thermometer
} from 'lucide-react';


function TotalPowerConsumptionScreen({ sizeScreen }: { sizeScreen: number }) {

    const currentPowerConsumption = 1500; 
    const maxPowerConsumption = 5000;
    const percentage = (currentPowerConsumption / maxPowerConsumption) * 100;

    const CircularGauge = ({ value, size = 220 }: { value: number; size?: number }) => {
    const radius = size / 2 - 25;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100 ) * circumference;

    return (
      <div className="flex items-center justify-center">
        <div className="relative animate-float">
          <svg width={size} height={size} className="transform -rotate-90">
            <defs>
              <filter id="glow" x="-30%" y="-30%" width="20%" height="20%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#facc00" />
                <stop offset="30%" stopColor="#facc00" />
                <stop offset="50%" stopColor="#facc00" />
                <stop offset="100%" stopColor="#facc00" />
              </linearGradient>
              <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
                <stop offset="100%" stopColor="rgba(147, 197, 253, 0.05)" />
              </linearGradient>
            </defs>
            
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#backgroundGradient)"
              strokeWidth="18"
              fill="transparent"
            />
            
            {/* Progress circle with enhanced glow */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#progressGradient)"
              strokeWidth="18"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"

            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-500 mb-3 drop-shadow-sm">
                {value*100/maxPowerConsumption}%
              </div>
              <div className="text-sm font-semibold text-yellow-400 uppercase tracking-widest mb-2">
                Power Level
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600">
                  {Math.round(currentPowerConsumption)}W of {maxPowerConsumption}W
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


    return(
        <CircularGauge value={currentPowerConsumption} size={sizeScreen} />
    );
}

export { TotalPowerConsumptionScreen };