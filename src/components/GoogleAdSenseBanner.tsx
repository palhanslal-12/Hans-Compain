import React, { useEffect, useRef } from 'react';

interface GoogleAdSenseBannerProps {
  slotId?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  className?: string;
  isResponsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const GoogleAdSenseBanner: React.FC<GoogleAdSenseBannerProps> = ({
  slotId,
  adFormat = 'auto',
  className = '',
  isResponsive = true
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle && !isLoaded.current) {
        window.adsbygoogle.push({});
        isLoaded.current = true;
      }
    } catch (e) {
      console.warn('AdSense load info:', e);
    }
  }, []);

  return (
    <div ref={adRef} className={`w-full overflow-hidden my-2 flex justify-center items-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '50px' }}
        data-ad-client="ca-pub-4553043055793527"
        data-ad-slot={slotId || 'default-slot'}
        data-ad-format={adFormat}
        data-full-width-responsive={isResponsive ? 'true' : 'false'}
      />
    </div>
  );
};
