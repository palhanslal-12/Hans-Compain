import React, { useState, useEffect } from 'react';
import { 
  CloudRain, Sun, Wind, Thermometer, AlertTriangle, ShieldCheck, 
  MapPin, Bell, BellOff, ArrowLeft, RefreshCw, CheckCircle, Volume2, 
  Umbrella, Eye, Sparkles, Navigation
} from 'lucide-react';

interface WeatherAlertViewProps {
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warn') => void;
  language?: 'english' | 'hindi';
  onBack?: () => void;
}

export const WeatherAlertView: React.FC<WeatherAlertViewProps> = ({
  showToast,
  language = 'hindi',
  onBack
}) => {
  const isHindi = language === 'hindi';

  // Weather consent state
  const [hasAgreedConsent, setHasAgreedConsent] = useState<boolean>(() => {
    return localStorage.getItem('hansai_weather_consent') === 'true';
  });

  const [selectedCity, setSelectedCity] = useState<string>('Prayagraj');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [weatherAlertsEnabled, setWeatherAlertsEnabled] = useState<boolean>(true);

  // Weather Data State
  const [weatherData, setWeatherData] = useState({
    city: 'प्रयागराज (Prayagraj)',
    temp: '32°C',
    condition: 'आंशिक रूप से बादल (Partly Cloudy)',
    humidity: '68%',
    windSpeed: '14 km/h',
    rainProbability: '40%',
    aqi: '92 (संतोषजनक / Satisfactory)',
    warningLevel: 'moderate' as 'none' | 'moderate' | 'severe',
    alertMessage: 'शाम को हल्की वर्षा और गरज के साथ हवाएं चलने की संभावना है। (Light rain & thundershowers expected in evening)',
    safetyTip: 'यात्रा के दौरान छाता साथ रखें और बिजली कड़कने के दौरान खुले में न रहें।'
  });

  // Sound chime for severe alerts
  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio context not permitted without interaction');
    }
  };

  const handleAgreeConsent = () => {
    localStorage.setItem('hansai_weather_consent', 'true');
    setHasAgreedConsent(true);
    showToast(
      isHindi ? "मौसम चेतावनी सेवा सफलतापूर्वक सक्रिय हो गई!" : "Weather Alert service activated!",
      "success"
    );
    playAlertSound();
  };

  const handleRevokeConsent = () => {
    localStorage.setItem('hansai_weather_consent', 'false');
    setHasAgreedConsent(false);
    showToast(
      isHindi ? "मौसम अलर्ट सेवा बंद कर दी गई।" : "Weather Alerts disabled.",
      "info"
    );
  };

  const handleFetchCityWeather = (city: string) => {
    setSelectedCity(city);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      let data = { ...weatherData };
      if (city === 'Delhi') {
        data = {
          city: 'नई दिल्ली (New Delhi)',
          temp: '35°C',
          condition: 'धूप व लू की संभावना (Sunny & Hot)',
          humidity: '45%',
          windSpeed: '18 km/h',
          rainProbability: '10%',
          aqi: '185 (मध्यम / Moderate)',
          warningLevel: 'moderate',
          alertMessage: 'दोपहर में तेज तापमान और धूप की चेतावनी (Heatwave Caution).',
          safetyTip: 'भरपूर पानी पिएं और सूती कपड़े पहनें।'
        };
      } else if (city === 'Patna') {
        data = {
          city: 'पटना (Patna)',
          temp: '29°C',
          condition: 'भारी बारिश की संभावना (Heavy Rain Warning)',
          humidity: '88%',
          windSpeed: '22 km/h',
          rainProbability: '85%',
          aqi: '55 (अच्छा / Good)',
          warningLevel: 'severe',
          alertMessage: 'अगले 6 घंटे में भारी बारिश और जलभराव का अलर्ट! (Heavy Rain Alert)',
          safetyTip: 'तटीय व निचले इलाकों से दूर रहें और बिजली के खंभों को न छुएं।'
        };
      } else if (city === 'Varanasi') {
        data = {
          city: 'वाराणसी (Varanasi)',
          temp: '31°C',
          condition: 'बादल छाए रहेंगे (Overcast)',
          humidity: '72%',
          windSpeed: '12 km/h',
          rainProbability: '50%',
          aqi: '85 (अच्छा / Good)',
          warningLevel: 'none',
          alertMessage: 'मौसम सामान्य रहेगा, हल्की बूंदाबांदी संभव।',
          safetyTip: 'गंगा घाटों पर सावधानी बरतें।'
        };
      } else {
        data = {
          city: `${city} (उत्तर भारत / North India)`,
          temp: '32°C',
          condition: 'आंशिक रूप से बादल (Partly Cloudy)',
          humidity: '65%',
          windSpeed: '15 km/h',
          rainProbability: '35%',
          aqi: '90 (संतोषजनक)',
          warningLevel: 'moderate',
          alertMessage: 'शाम को हवा के साथ हल्की वर्षा की उम्मीद।',
          safetyTip: 'मौसम अपडेट पर ध्यान दें।'
        };
      }

      setWeatherData(data);
      showToast(isHindi ? `${city} का मौसम अपडेट हुआ` : `Weather updated for ${city}`, "info");
      if (data.warningLevel === 'severe') {
        playAlertSound();
      }
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-5 space-y-4 font-sans text-left animate-fade-in">
      
      {/* Top Header */}
      <div className="flex items-center justify-between bg-[#0B0F19] border border-slate-800 p-4 rounded-2xl shadow-md">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer border-none"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>{isHindi ? "मौसम एवं आपदा चेतावनी सेवा (Weather Alerts)" : "Live Weather & Climate Alert Center"}</span>
            </h1>
            <p className="text-xs text-slate-400">
              {isHindi ? "सहमति आधारित त्वरित मौसम सूचनाएं एवं सुरक्षा गाइड" : "Consent-driven real-time weather & severe storm notifications"}
            </p>
          </div>
        </div>

        {hasAgreedConsent && (
          <button
            onClick={handleRevokeConsent}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
          >
            <BellOff className="w-3.5 h-3.5 text-rose-400" />
            <span>{isHindi ? "अलर्ट बंद करें" : "Disable Alerts"}</span>
          </button>
        )}
      </div>

      {/* CONSENT AGREEMENT CARD (If user has not agreed yet) */}
      {!hasAgreedConsent ? (
        <div className="bg-[#0B0F19] border-2 border-amber-500/40 p-6 rounded-2xl shadow-xl space-y-5 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <AlertTriangle className="w-8 h-8 animate-pulse" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {isHindi ? "क्या आप मौसम एवं आपदा अलर्ट की सहमति देना चाहते हैं?" : "Would you like to activate Weather Alerts?"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isHindi 
                ? "यह सेवा आपको भारी बारिश, तूफान, लू या आकस्मिक मौसम परिवर्तन के समय सुरक्षा चेतावनी प्रदान करेगी। आप अपनी सहमति देने के बाद ही अलर्ट प्राप्त करेंगे।" 
                : "This service alerts you during heavy rainfall, storms, heatwaves, or unexpected weather changes. You will only receive warnings after your explicit agreement."}
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl max-w-lg mx-auto text-xs text-slate-300 text-left space-y-2">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>{isHindi ? "अलर्ट सहमति की मुख्य शर्तें:" : "Consent Terms & Safety Guidelines:"}</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px]">
              <li>{isHindi ? "लाइव मौसम की स्थिति व वर्षा की संभावना तुरंत दिखेगी" : "Shows live rain probabilities and temperature warnings"}</li>
              <li>{isHindi ? "खराब मौसम में ऑडियो अलार्म बजेगा" : "Plays audio chime when severe weather alert is active"}</li>
              <li>{isHindi ? "आप किसी भी समय सेटिंग से अलर्ट बंद कर सकते हैं" : "You can revoke or disable alerts anytime with 1-click"}</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleAgreeConsent}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer border-none active:scale-95"
            >
              <CheckCircle className="w-5 h-5 fill-slate-950 text-amber-500" />
              <span>{isHindi ? "हाँ, सहमति दें और चालू करें (Agree & Enable)" : "Yes, Agree & Activate Alerts"}</span>
            </button>

            {onBack && (
              <button
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-all cursor-pointer border border-slate-700"
              >
                <span>{isHindi ? "अस्वीकार करें / पीछे जाएं" : "Decline & Back"}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* LIVE WEATHER DASHBOARD (ACTIVE AFTER USER AGREEMENT) */
        <div className="space-y-4">
          
          {/* Active Status Badge */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{isHindi ? "मौसम चेतावनी सेवा सक्रिय है (Weather Alerts Active)" : "Weather Alert Service Active"}</span>
            </div>
            <span className="text-[10px] text-slate-400">
              {isHindi ? "सहमति सत्यापित" : "User Consent Verified"}
            </span>
          </div>

          {/* City Selector */}
          <div className="bg-[#0B0F19] border border-slate-800 p-3.5 rounded-2xl space-y-2 shadow-md">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{isHindi ? "अपना शहर / क्षेत्र चुनें:" : "Select Location / Region:"}</span>
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Prayagraj', 'Delhi', 'Patna', 'Varanasi', 'Lucknow', 'Kolkata', 'Jaipur'].map((c) => (
                <button
                  key={c}
                  onClick={() => handleFetchCityWeather(c)}
                  className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-all border-none ${
                    selectedCity === c 
                      ? 'bg-amber-500 text-slate-950 shadow-md' 
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Severe Warning Alert Card */}
          <div className={`p-4 sm:p-5 rounded-2xl border shadow-lg space-y-3 ${
            weatherData.warningLevel === 'severe'
              ? 'bg-rose-950/60 border-rose-500/60 text-rose-100'
              : weatherData.warningLevel === 'moderate'
              ? 'bg-amber-950/40 border-amber-500/50 text-amber-100'
              : 'bg-slate-900/80 border-slate-800 text-slate-200'
          }`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${weatherData.warningLevel === 'severe' ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide">
                  {weatherData.warningLevel === 'severe' 
                    ? (isHindi ? "गंभीर मौसम अलर्ट / Severe Weather Warning" : "Severe Weather Warning")
                    : (isHindi ? "मौसम सूचना एवं सुझाव" : "Weather Advisory")}
                </span>
              </div>
              <button
                onClick={playAlertSound}
                className="px-2.5 py-1 bg-black/30 hover:bg-black/50 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer border-none"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                <span>{isHindi ? "साउंड सुनें" : "Sound Alarm"}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm font-bold leading-relaxed">
              {weatherData.alertMessage}
            </p>

            <div className="bg-black/20 p-2.5 rounded-xl text-xs flex items-center gap-2">
              <Umbrella className="w-4 h-4 text-amber-300 shrink-0" />
              <span><strong>{isHindi ? "सुरक्षा सुझाव:" : "Safety Tip:"}</strong> {weatherData.safetyTip}</span>
            </div>
          </div>

          {/* Current Weather Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0B0F19] border border-slate-800 p-3.5 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>{isHindi ? "तापमान" : "Temperature"}</span>
                <Thermometer className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-xl font-extrabold text-white">{weatherData.temp}</p>
              <p className="text-[10px] text-slate-400 truncate">{weatherData.condition}</p>
            </div>

            <div className="bg-[#0B0F19] border border-slate-800 p-3.5 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>{isHindi ? "वर्षा की संभावना" : "Rain Probability"}</span>
                <CloudRain className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-xl font-extrabold text-white">{weatherData.rainProbability}</p>
              <p className="text-[10px] text-slate-400">{isHindi ? "आर्द्रता:" : "Humidity:"} {weatherData.humidity}</p>
            </div>

            <div className="bg-[#0B0F19] border border-slate-800 p-3.5 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>{isHindi ? "हवा की गति" : "Wind Speed"}</span>
                <Wind className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xl font-extrabold text-white">{weatherData.windSpeed}</p>
              <p className="text-[10px] text-slate-400">{isHindi ? "सामान्य हवाएँ" : "Moderate breeze"}</p>
            </div>

            <div className="bg-[#0B0F19] border border-slate-800 p-3.5 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>{isHindi ? "वायु गुणवत्ता (AQI)" : "Air Quality"}</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-sm font-extrabold text-white truncate">{weatherData.aqi}</p>
              <p className="text-[10px] text-emerald-400 font-semibold">{isHindi ? "सुरक्षित वायु स्तर" : "Safe Air Level"}</p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
