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
            className="p-3 text-white hover:text-yellow-500 transition-colors rounded-full hover:bg-yellow-50">
              <Settings className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 bg-gray-200 pl-5 pr-5 rounded-2xl shadow-lg border z-50" >
                    <ul className="py-2">
                        <li className="text-black p-1 rounded hover:bg-gray-500 cursor-pointer">Profile</li>
                        <li className="text-black p-1 rounded hover:bg-gray-500 cursor-pointer">Settings</li>
                        <li className="text-black p-1 rounded hover:bg-gray-500 cursor-pointer">Logout</li>
                    </ul>
                </div>)
                }
        </div>
    );
}

