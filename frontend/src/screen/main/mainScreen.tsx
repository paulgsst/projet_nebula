import { useState, useEffect } from 'react';
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
  Thermometer,
  Lightbulb,
  CloudLightning,
  LucideWeight,
  AlertCircle,
  MapPin,
  ChevronDown,
  ChevronUp,
  Cpu,
  Power
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './../card/card';
import { Badge } from './../../ui/badge';
import { Progress } from './../../ui/progress';
import SettingMenuScreen from '../settingMenu/settingMenuScreen';

interface PowerReadingData {
  id: number;
  totalConsumptionMw: number;
  totalCapacityMw: number;
  createdAt: string;
}

interface EquipmentData {
  id: number;
  name: string;
  zoneId: number;
  type: string;
  capacityMaxMw: number;
  importanceWeight: number;
  currentConsumptionMw: number;
  isActive: boolean;
}

interface ZoneData {
  id: number;
  name: string;
  capacityMaxMw: number;
  equipments: EquipmentData[];
}

export default function MainScreen() {
  // Mock data for demonstration
  const currentPowerConsumption = 75; //Percentage of current power consumption
  const maxPowerConsumption = 10000;
  const pumpStatus = "ON";
  const lastUpdate = "2 mins ago";

  // Historical data for the line chart (last 24 hours)
  const [historicalData, setHistoricalData] = useState<{ time: string; level: number }[]>([]);

  useEffect(() => {
    fetch('http://localhost:3333/power-readings')
      .then((res) => res.json())
      .then((data: PowerReadingData[]) => {
        const mapped = data.map((r) => ({
          time: new Date(r.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          level: r.totalCapacityMw > 0
            ? Math.round((r.totalConsumptionMw / r.totalCapacityMw) * 100)
            : 0,
        }));
        setHistoricalData(mapped);
      })
      .catch(() => setHistoricalData([]));
  }, []);

  // Alerts data with proper color coding
  const alerts = [
    {
      id: 1,
      type: 'danger' as const,
      message: 'Water level critically low - immediate attention required',
      timestamp: '15 minutes ago',
      resolved: false
    },
    {
      id: 2,
      type: 'warning' as const,
      message: 'Pump efficiency decreased by 12%',
      timestamp: '2 hours ago',
      resolved: false
    },
    {
      id: 3,
      type: 'info' as const,
      message: 'Scheduled maintenance completed successfully',
      timestamp: '1 day ago',
      resolved: true
    }
  ];

  // Zones data from API
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [zonesLoading, setZonesLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3333/zones')
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setZones(data);
        setZonesLoading(false);
      })
      .catch(() => setZonesLoading(false));
  }, []);

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || null;

  const getZoneConsumption = (zone: ZoneData) =>
    zone.equipments.reduce((sum, eq) => eq.isActive ? sum + Number(eq.currentConsumptionMw) : sum, 0);

  const toggleEquipment = async (equipmentId: number) => {
    try {
      const res = await fetch(`http://localhost:3333/equipments/${equipmentId}/toggle`, {
        method: 'PATCH',
      });
      if (!res.ok) return;
      const updated: EquipmentData = await res.json();
      setZones((prev) =>
        prev.map((zone) => ({
          ...zone,
          equipments: zone.equipments.map((eq) =>
            eq.id === equipmentId ? { ...eq, isActive: updated.isActive } : eq
          ),
        }))
      );
    } catch (err) {
      console.error('Failed to toggle equipment', err);
    }
  };

  const getZonePercentage = (zone: ZoneData) => {
    if (zone.capacityMaxMw === 0) return 0;
    return Math.round((getZoneConsumption(zone) / zone.capacityMaxMw) * 100);
  };

  const getZoneColor = (percentage: number) => {
    if (percentage >= 85) return { text: 'text-red-600', bg: 'bg-red-500', gradient: 'linear-gradient(135deg, #EF4444, #DC2626)', progress: '[&>div]:bg-red-500' };
    if (percentage >= 70) return { text: 'text-orange-500', bg: 'bg-orange-500', gradient: 'linear-gradient(135deg, #F97316, #EA580C)', progress: '[&>div]:bg-orange-500' };
    return { text: 'text-green-600', bg: 'bg-green-500', gradient: 'linear-gradient(135deg, #22C55E, #16A34A)', progress: '[&>div]:bg-green-500' };
  };

  const getEquipmentPercentage = (eq: EquipmentData) => {
    if (eq.capacityMaxMw === 0) return 0;
    return Math.round((Number(eq.currentConsumptionMw) / eq.capacityMaxMw) * 100);
  };

  const globalConsumption = zones.reduce((sum, z) => sum + getZoneConsumption(z), 0);
  const globalCapacity = zones.reduce((sum, z) => sum + Number(z.capacityMaxMw), 0);
  const globalPercentage = globalCapacity > 0 ? Math.round((globalConsumption / globalCapacity) * 100) : 0;
  const globalColor = getZoneColor(globalPercentage);

  // Enhanced Circular Gauge Component with premium glow effect
  const CircularGauge = ({ value, size = 320 }: { value: number; size?: number }) => {
    const clamped = Math.min(value, 100);
    const radius = size / 2 - 25;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (clamped / 100) * circumference;
    const gaugeColor = getZoneColor(value);

    const colorStops = value >= 85
      ? { start: '#DC2626', end: '#EF4444' }
      : value >= 70
      ? { start: '#EA580C', end: '#F97316' }
      : { start: '#16A34A', end: '#22C55E' };

    return (
      <div className="flex items-center justify-center">
        <div className="relative animate-float">
          <svg width={size} height={size} className="transform -rotate-90">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colorStops.start} />
                <stop offset="100%" stopColor={colorStops.end} />
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
              filter="url(#glow)"
              style={{
                filter: `drop-shadow(0 0 20px ${colorStops.end}99)`,
              }}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-6xl font-bold mb-3 drop-shadow-sm ${gaugeColor.text}`}>
                {value}%
              </div>
              <div className={`text-sm font-semibold uppercase tracking-widest mb-2 ${gaugeColor.text}`}>
                Power Consumption
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Zap className={`w-5 h-5 ${gaugeColor.text}`} />
                <span className="text-sm font-medium text-gray-600">
                  {globalConsumption.toFixed(1)} MW / {globalCapacity} MW
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Line Chart Component with smooth curves
  const LineChart = ({ data }: { data: typeof historicalData }) => {
    const width = 700;
    const height = 320;
    const padding = 80;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxLevel = Math.max(...data.map(d => d.level));
    const minLevel = Math.min(...data.map(d => d.level));
    const range = maxLevel - minLevel || 1;

    // Create smooth curve path using Bézier curves
    const createSmoothPath = (data: typeof historicalData) => {
      if (data.length < 2) return '';
      
      let path = '';
      for (let i = 0; i < data.length; i++) {
        const x = padding + (i / (data.length - 1)) * chartWidth;
        const y = padding + ((maxLevel - data[i].level) / range) * chartHeight;
        
        if (i === 0) {
          path += `M ${x} ${y}`;
        } else {
          const prevX = padding + ((i - 1) / (data.length - 1)) * chartWidth;
          const prevY = padding + ((maxLevel - data[i - 1].level) / range) * chartHeight;
          const cpX1 = prevX + (x - prevX) / 3;
          const cpX2 = x - (x - prevX) / 3;
          path += ` C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
        }
      }
      return path;
    };

    const smoothPath = createSmoothPath(data);

    return (
      <div className="w-full h-80 flex items-center justify-center overflow-x-auto">
        <svg 
          width={width} 
          height={height} 
          className="rounded-lg min-w-full"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255, 192, 20, 0.4)" />
              <stop offset="50%" stopColor="rgba(255, 192, 20, 0.2)" />
              <stop offset="100%" stopColor="rgba(255, 192, 20, 0.0)" />
            </linearGradient>
            <filter id="chartLineGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((level) => {
            const y = padding + ((100 - level) / 100) * chartHeight;
            return (
              <g key={level}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="rgba(255, 192, 20, 0.12)"
                  strokeDasharray="6,12"
                  strokeWidth="1"
                />
                <text
                  x={padding - 25}
                  y={y + 5}
                  textAnchor="end"
                  fontSize="13"
                  fill="#6B7280"
                  fontFamily="Inter, Poppins, sans-serif"
                  fontWeight="500"
                >
                  {level}%
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.filter((_, index) => index % 2 === 0).map((item, index) => {
            const x = padding + (index * 2 / (data.length - 1)) * chartWidth;
            return (
              <text
                key={index}
                x={x}
                y={height - padding + 30}
                textAnchor="middle"
                fontSize="13"
                fill="#6B7280"
                fontFamily="Inter, Poppins, sans-serif"
                fontWeight="500"
              >
                {item.time}
              </text>
            );
          })}

          {/* Area fill */}
          <path
            d={`${smoothPath} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
            fill="url(#chartAreaGradient)"
          />

          {/* Smooth line with enhanced glow */}
          <path
            d={smoothPath}
            fill="none"
            stroke="#ffc014"
            strokeWidth="5"
            filter="url(#chartLineGlow)"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.5))',
            }}
          />

          {/* Data points */}
          {data.map((item, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = padding + ((maxLevel - item.level) / range) * chartHeight;
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="7"
                  fill="#ffc014"
                  stroke="white"
                  strokeWidth="4"
                  className="hover:r-9 transition-all cursor-pointer"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(255, 192, 20, 0.4))',
                  }}
                />
                <title>{`${item.time}: ${item.level}%`}</title>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #E6F0FF 0%, #F0F8FF 40%, #FFFFFF 100%)',
      }}
    >
      {/* Enhanced Abstract Wave Patterns */}
      <div className="absolute inset-0 opacity-6">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#93C5FD" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
            <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DBEAFE" />
              <stop offset="100%" stopColor="#BFDBFE" />
            </linearGradient>
          </defs>
          <path d="M0,100 C300,200 600,0 900,100 C1000,150 1100,50 1200,100 L1200,0 L0,0 Z" fill="url(#waveGradient1)" className="animate-pulse" opacity="0.08"/>
          <path d="M0,300 C300,400 600,200 900,300 C1000,350 1100,250 1200,300 L1200,0 L0,0 Z" fill="url(#waveGradient2)" className="animate-pulse" opacity="0.04"/>
          <path d="M0,500 C400,600 800,400 1200,500 L1200,0 L0,0 Z" fill="url(#waveGradient3)" className="animate-pulse" opacity="0.03"/>
        </svg>
      </div>

      {/* Enhanced Header Bar */}
      <header 
        className="backdrop-blur-md border-b border-white/20 px-4 sm:px-6 py-5 relative z-50 overflow-visible"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left side - Logo and title */}
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #fab807, #fab807)',
                boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
              }}
            >
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Power Consumption Monitor</h1>
              <p className="text-sm text-gray-600 hidden sm:block">IoT-Based Monitoring System</p>
            </div>
          </div>
          
          {/* Right side - Profile, notifications, and user info */}
          <div className="flex items-center space-x-4">
            <button className="relative p-3 text-gray-600 hover:text-yellow-500 transition-colors rounded-full hover:bg-yellow-50">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">2</span>
            </button>
            
            <SettingMenuScreen />
            {/*<button className="p-3 text-white hover:text-yellow-500 transition-colors rounded-full hover:bg-yellow-50">
              <Settings className="w-5 h-5" />
            </button> */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-gray-900">Idris Ogundele Olawale</div>
                <div className="text-xs text-gray-500">System Administrator</div>
              </div>
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                }}
              >
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        {/* Four Premium KPI Cards with Glassmorphism Effects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glassmorphism shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-white/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Current Power Consumption</CardTitle>
              <div 
                className="p-3 rounded-xl shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #ffc014, #ed9302)',
                  boxShadow: '0 6px 16px rgba(255, 192, 20, 0.3)',
                }}
              >
                <Zap className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold mb-3 ${globalColor.text}`}>{globalPercentage}%</div>
              <Progress value={Math.min(globalPercentage, 100)} className={`h-3 mb-3 ${globalColor.progress}`} />
              <p className="text-sm text-gray-600">
                {globalConsumption.toFixed(1)} / {globalCapacity} MW
              </p>
            </CardContent>
          </Card>

          {/* Tank Capacity Card */}
          <Card className="glassmorphism shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-white/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Maximum Power Consumption</CardTitle>
              <div 
                className="p-3 rounded-xl shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #10B981, #34D399)',
                  boxShadow: '0 6px 16px rgba(16, 185, 129, 0.3)',
                }}
              >
                <Activity className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 mb-1">{globalCapacity} MW</div>
              <p className="text-sm text-gray-600 mb-2">Total capacity</p>
              <p className="text-xs text-gray-600">
                Current: <span className={`font-semibold ${globalColor.text}`}>{globalConsumption.toFixed(1)} MW</span>
              </p>
            </CardContent>
          </Card>

          {/* Pump Status Card */}
          <Card className="glassmorphism shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-white/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Pump Status</CardTitle>
              <div 
                className="p-3 rounded-xl shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #ffffff, #ffffff)',
                  boxShadow: '0 6px 16px rgba(245, 158, 11, 0.3)',
                }}
              >
                <Lightbulb className="h-5 w-5 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 mb-3">
                <Badge 
                  variant={pumpStatus === "ON" ? "default" : "secondary"} 
                  className="bg-green-100 text-green-800 shadow-sm font-semibold px-3 py-1"
                >
                  {pumpStatus}
                </Badge>
                <div className={`w-3 h-3 rounded-full ${pumpStatus === "ON" ? "bg-green-500 animate-pulse shadow-green-300" : "bg-gray-400"} shadow-lg`}></div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Operational</p>
              <p className="text-xs text-gray-600">Auto mode enabled</p>
            </CardContent>
          </Card>

          {/* Last Update Card */}
          <Card className="glassmorphism shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-white/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Last Update Time</CardTitle>
              <div 
                className="p-3 rounded-xl shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
                  boxShadow: '0 6px 16px rgba(139, 92, 246, 0.3)',
                }}
              >
                <Clock className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 mb-1">{lastUpdate}</div>
              <p className="text-sm text-gray-600 mb-2">System online</p>
              <p className="text-xs text-gray-600 flex items-center">
                <CheckCircle className="inline w-4 h-4 mr-1 text-green-500" />
                Connection stable
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Large Circular Gauge Chart in Center */}
          <Card className="xl:col-span-1 glassmorphism shadow-xl hover:shadow-2xl transition-all duration-300 border-white/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Zap className="w-6 h-6 mr-3 text-yellow-500" />
                Current Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <CircularGauge value={globalPercentage} />
              </div>
              <div className="text-center mt-6">
                <p className="text-sm font-semibold text-gray-600 mb-3">Power Consumption Status</p>
                <Badge
                  variant="outline"
                  className={`shadow-sm px-4 py-2 font-semibold ${
                    globalPercentage >= 85 ? 'border-red-300 text-red-700 bg-red-50'
                    : globalPercentage >= 70 ? 'border-orange-300 text-orange-700 bg-orange-50'
                    : 'border-green-300 text-green-700 bg-green-50'
                  }`}
                >
                  {globalPercentage >= 85 ? 'Critical' : globalPercentage >= 70 ? 'Warning' : 'Normal Range'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Line Chart with Smooth Curves */}
          <Card className="xl:col-span-2 glassmorphism shadow-xl hover:shadow-2xl transition-all duration-300 border-white/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-yellow-500" />
                24-Hour Power Consumption History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={historicalData} />
            </CardContent>
          </Card>
        </div>

        {/* Power by Zone Section */}
        <Card className="glassmorphism shadow-xl hover:shadow-2xl transition-all duration-300 border-white/30 mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-yellow-500" />
              Power Consumption by Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            {zonesLoading ? (
              <div className="text-center py-8 text-gray-500">Loading zones...</div>
            ) : zones.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No zones found</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {zones.map((zone) => {
                    const consumption = getZoneConsumption(zone);
                    const percentage = getZonePercentage(zone);
                    const isSelected = selectedZoneId === zone.id;
                    const color = getZoneColor(percentage);

                    return (
                      <div
                        key={zone.id}
                        onClick={() => setSelectedZoneId(isSelected ? null : zone.id)}
                        className={`p-5 rounded-xl cursor-pointer transition-all duration-300 glassmorphism shadow-sm hover:shadow-lg border-2 ${
                          isSelected
                            ? 'border-yellow-400 bg-yellow-50/50 shadow-yellow-100'
                            : 'border-white/20 hover:border-yellow-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div
                              className="p-2 rounded-lg"
                              style={{ background: color.gradient }}
                            >
                              <MapPin className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{zone.name}</h3>
                              <p className="text-xs text-gray-500">
                                {zone.equipments.length} equipment{zone.equipments.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          {isSelected ? (
                            <ChevronUp className="w-5 h-5 text-yellow-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{consumption.toFixed(2)} MW</span>
                            <span className={`font-semibold ${color.text}`}>{percentage}%</span>
                          </div>
                          <Progress value={Math.min(percentage, 100)} className={`h-2 ${color.progress}`} />
                        </div>
                        <p className="text-xs text-gray-500">
                          Capacity: {zone.capacityMaxMw} MW
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Equipment details for selected zone */}
                {selectedZone && (
                  <div className="mt-6 p-5 rounded-xl glassmorphism border-2 border-yellow-200/50">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Cpu className="w-5 h-5 mr-2 text-yellow-500" />
                      Equipment in {selectedZone.name}
                    </h3>
                    {selectedZone.equipments.length === 0 ? (
                      <p className="text-gray-500 text-sm">No equipment in this zone</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedZone.equipments.map((eq) => {
                          const isDisabled = !eq.isActive;
                          const eqPercentage = isDisabled ? 0 : getEquipmentPercentage(eq);
                          const eqColor = getZoneColor(eqPercentage);
                          return (
                            <div
                              key={eq.id}
                              className={`flex items-center p-4 rounded-lg glassmorphism shadow-sm border border-white/20 transition-opacity duration-300 ${isDisabled ? 'opacity-50' : ''}`}
                            >
                              <button
                                onClick={() => toggleEquipment(eq.id)}
                                className={`mr-4 p-2 rounded-lg transition-all duration-200 ${
                                  isDisabled
                                    ? 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                                }`}
                                title={isDisabled ? 'Activer' : 'Désactiver'}
                              >
                                <Power className="w-4 h-4" />
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className={`font-semibold ${isDisabled ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{eq.name}</span>
                                  <Badge
                                    variant="outline"
                                    className="border-yellow-300 text-yellow-700 bg-yellow-50 text-xs"
                                  >
                                    {eq.type}
                                  </Badge>
                                  {isDisabled && (
                                    <Badge variant="outline" className="border-gray-300 text-gray-500 bg-gray-50 text-xs">
                                      OFF
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600">
                                    {isDisabled ? '0.00' : Number(eq.currentConsumptionMw).toFixed(2)} / {eq.capacityMaxMw} MW
                                  </span>
                                  <span className={`font-semibold ${eqColor.text}`}>{eqPercentage}%</span>
                                </div>
                                <Progress value={Math.min(eqPercentage, 100)} className={`h-1.5 ${eqColor.progress}`} />
                              </div>
                              <div className="ml-4 text-right shrink-0">
                                <div className="text-xs text-gray-500">Weight</div>
                                <div className="font-bold text-gray-900">{eq.importanceWeight}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Alerts Panel with Modern List and Colored Status Tags */}
        <Card className="glassmorphism shadow-xl hover:shadow-2xl transition-all duration-300 border-white/30">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <Bell className="w-6 h-6 mr-3 text-yellow-500" />
              Recent Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className="flex items-start space-x-4 p-5 rounded-xl glassmorphism shadow-sm hover:shadow-md transition-all duration-200 border-white/20"
                >
                  <div className="shrink-0 mt-1">
                    {alert.type === 'danger' && (
                      <div className="p-3 w-37.5 flex flex-col items-center rounded-full bg-red-100 border-2 border-red-200 shadow-md">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <div className='text-red-600'>Critical error</div>                        
                      </div>
                    )}
                    {alert.type === 'warning' && (
                      <div className="p-3 w-37.5 flex flex-col items-center rounded-full bg-orange-100 border-2 border-orange-200 shadow-md">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        <div className='text-orange-600'>Warning</div>
                      </div>
                    )}
                    {alert.type === 'info' && (
                      <div className="p-3 w-37.5 flex flex-col items-center rounded-full bg-blue-100 border-2 border-blue-200 shadow-md">
                        <Bell className="w-5 h-5 flex justify-center text-blue-600" />
                        <div className='text-blue-600'>Info</div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.timestamp}</p>
                  </div>
                  <div className="shrink-0">
                    <Badge 
                      variant={alert.resolved ? "outline" : "destructive"}
                      className={
                        alert.resolved 
                          ? "border-green-300 text-green-700 bg-green-50 font-semibold px-3 py-1" 
                          : alert.type === 'danger'
                          ? "bg-red-100 text-red-800 border-2 border-red-200 font-semibold px-3 py-1"
                          : "bg-orange-100 text-orange-800 border-2 border-orange-200 font-semibold px-3 py-1"
                      }
                    >
                      {alert.resolved ? "Resolved" : "Active"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button className="text-sm font-semibold text-yellow-600 hover:text-yellow-800 bg-yellow-50 px-6 py-3 rounded-full transition-colors hover:bg-yellow-100 border-2 border-yellow-200">
                View all alerts →
              </button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer with Exact Specified Text */}
      <footer className="bg-white/40 backdrop-blur-md border-t border-white/30 px-4 sm:px-6 py-6 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-semibold text-gray-700">
            © 2025 Power Consumption Monitor — <span className="font-bold text-yellow-600">Idris Ogundele Olawale</span> | Matric No: <span className="font-bold text-yellow-600">222956</span>
          </p>
        </div>
      </footer>
    </div>
  );
}