import { useEffect, useRef, useState } from "react";
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
  AlertCircle
} from 'lucide-react';

export default function SettingMenuScreen() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
     useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);
    return (
        <div className="relative flex flex-col items-center z-50" ref={menuRef} >
            <button
            onClick={() => setIsOpen(!isOpen)} 
            className="p-3 text-gray-600 hover:text-yellow-500 transition-colors rounded-full hover:bg-yellow-50">
              <Settings className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 min-w-[160px] bg-white px-2 py-2 rounded-xl shadow-xl border border-gray-200 z-[9999]" >
                    <ul className="space-y-1">
                        <li className="text-gray-900 px-3 py-2 rounded-lg hover:bg-yellow-50 cursor-pointer transition-colors">Profile</li>
                        <li className="text-gray-900 px-3 py-2 rounded-lg hover:bg-yellow-50 cursor-pointer transition-colors">Settings</li>
                        <li className="text-gray-900 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors">Logout</li>
                    </ul>
                </div>)
                }
        </div>
    );
}

