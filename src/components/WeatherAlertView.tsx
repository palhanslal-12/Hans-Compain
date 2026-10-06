import React, { useState } from 'react';
import { CloudSun, CloudRain, Wind, AlertTriangle, CheckCircle2, MapPin, Compass } from 'lucide-react';

interface CityWeather {
  city: string;
  state: string;
  temp: number;
  condition: string;
  icon: string;
  fogIndex: string;
  advisory: string;
}

export const WeatherAlertView: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('patna');

  const cityData: Record<string, CityWeather> = {
    patna: {
      city: 'पटना (Patna)',
      state: 'बिहार',
      temp: 28,
      condition: 'हल्के बादल व धूप',
      icon: '⛅',
      fogIndex: 'निम्न (Low)',
      advisory: 'परीक्षा केंद्र पर यातायात सामान्य रहेगा। फिर भी अशोक राजपथ व कंकड़बाग में संभावित जाम को देखते हुए रिपोर्टिंग समय से 45 मिनट पहले पहुँचें।'
    },
    prayagraj: {
      city: 'प्रयागराज (Prayagraj)',
      state: 'उत्तर प्रदेश',
      temp: 29,
      condition: 'साफ मौसम',
      icon: '☀️',
      fogIndex: 'शून्य (Clear)',
      advisory: 'मौसम सुहावना है। सिविल लाइन्स व तेलियरगंज केंद्रों पर वाहनों की पार्किंग सीमित है, सार्वजनिक परिवहन का उपयोग करें।'
    },
    delhi: {
      city: 'नई दिल्ली (New Delhi / NCR)',
      state: 'दिल्ली एनसीआर',
      temp: 26,
      condition: 'हल्की धुंध व सुहावना',
      icon: '🌤️',
      fogIndex: 'मध्यम (Moderate)',
      advisory: 'मेट्रो का उपयोग करें। मुंडका, रोहिणी और नोएडा सेक्टर-62 परीक्षा केंद्रों पर मेट्रो से सीधा आवागमन सुगम है।'
    },
    lucknow: {
      city: 'लखनऊ (Lucknow)',
      state: 'उत्तर प्रदेश',
      temp: 30,
      condition: 'तेज धूप',
      icon: '☀️',
      fogIndex: 'शून्य (Clear)',
      advisory: 'दोपहर की पाली में गर्मी बढ़ सकती है। पारदर्शी पानी की बोतल साथ रखें।'
    },
    ranchi: {
      city: 'रांची (Ranchi)',
      state: 'झारखंड',
      temp: 24,
      condition: 'हल्की बूंदाबांदी की संभावना',
      icon: '🌧️',
      fogIndex: 'निम्न (Low)',
      advisory: 'हल्की बारिश संभव है। एडमिट कार्ड और पहचान पत्र को सुरक्षित रखने के लिए वाटरप्रूफ प्लास्टिक फोल्डर साथ रखें।'
    }
  };

  const current = cityData[selectedCity] || cityData.patna;

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/40 p-5 sm:p-6 rounded-3xl border border-sky-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase border border-sky-500/30 mb-2">
              <CloudSun className="w-3.5 h-3.5" />
              <span>परीक्षा यात्रा व मौसम सलाहकार 2026</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              मौसम व परीक्षा केंद्र चेतावनी (Weather Alert)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              परीक्षा के दिन बारिश, कोहरा या ट्रैफिक संबंधी लाइव सलाह ताकि आप समय से परीक्षा हॉल पहुँच सकें।
            </p>
          </div>
        </div>

        {/* City Switcher */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
          {Object.entries(cityData).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setSelectedCity(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCity === key
                  ? 'bg-sky-500 text-slate-950 shadow'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{item.city}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Weather Card */}
      <div className="bg-[#091122] border-2 border-sky-500/40 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{current.icon}</span>
            <div>
              <h2 className="text-xl font-black text-white">{current.city}</h2>
              <span className="text-xs text-slate-400">{current.state} • {current.condition}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black font-mono text-sky-400">{current.temp}°C</span>
            <span className="text-[10px] text-slate-500 block">ताज़ा तापमान</span>
          </div>
        </div>

        {/* Travel Alert Box */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>परीक्षा केंद्र यात्रा निर्देश (Transit Advisory):</span>
          </div>
          <p className="text-slate-200 leading-relaxed pl-5">
            {current.advisory}
          </p>
        </div>

        {/* Exam Day Mandatory Bag Checklist */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 block">
            परीक्षा हॉल में प्रवेश हेतु अनिवार्य चेकलिस्ट:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              'मूल प्रवेश पत्र (Admit Card) - रंगीन/स्पष्ट प्रिंट',
              'मूल पहचान पत्र (Original Aadhaar Card / Voter ID)',
              '2 नवीनतम पासपोर्ट साइज फोटो (एक जैसी)',
              'पारदर्शी नीला/काला बॉलपॉइंट पेन'
            ].map((item, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
