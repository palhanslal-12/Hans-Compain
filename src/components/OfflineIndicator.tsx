import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/usePWAInstall';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-amber-600/95 border border-amber-400 px-3.5 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-md animate-fade-in">
      <WifiOff className="w-4 h-4 text-white animate-pulse shrink-0" />
      <span>ऑफलाइन मोड सक्रिय — कैश्ड डेटा से पढ़ाई जारी है।</span>
    </div>
  );
};
