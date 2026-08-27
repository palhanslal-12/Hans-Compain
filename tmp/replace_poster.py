import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find and replace the WHATSAPP STUDY STATUS POSTER MODAL section.
target = """      {/* WHATSAPP STUDY STATUS POSTER MODAL (9:16 ASPECT RATIO) */}
      {isSharePosterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-[#090D16] border border-emerald-500/20 rounded-3xl w-full max-w-md p-5 sm:p-6 relative shadow-2xl space-y-4 text-left max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3 border-none shadow-none bg-transparent">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎨</span>
                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-wide">WhatsApp Daily Status Poster</h3>
                  <p className="text-[9px] text-slate-500 font-bold">9:16 Custom Educational Branding Card</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSharePosterOpen(false)}
                className="p-1 px-2.5 text-slate-400 hover:text-white bg-slate-850/80 hover:bg-slate-800 rounded-lg transition-all text-xs font-bold border-none"
              >
                ✕ Close
              </button>
            </div>

            {/* Poster Canvas Preview */}
            <div className="py-2 flex justify-center">
              <div id="status-share-poster-card" className="aspect-[9/16] w-[270px] sm:w-[290px] bg-gradient-to-b from-[#090F1C] via-[#0E172E] to-[#040710] border-2 border-emerald-500/40 rounded-3xl p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden text-left font-sans group">
                {/* Background decorative glows */}
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-sky-500/15 blur-2xl rounded-full pointer-events-none" />
                <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-emerald-500/15 blur-2xl rounded-full pointer-events-none" />
                
                {/* Poster Header with Light Background Official Logo */}
                <div className="space-y-3 relative z-10 text-center">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-emerald-400 font-extrabold uppercase tracking-widest bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      OFFICIAL BADGE
                    </span>
                    <span className="text-[9px] text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                      2026 EDITION
                    </span>
                  </div>

                  {/* Centered HANS COMPAIN Light Logo */}
                  <div className="pt-1 flex flex-col items-center justify-center">
                    <QuantumSwanLogo className="w-16 h-16 sm:w-18 sm:h-18" showLightBg={true} />
                  </div>
                  
                  <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/50 via-sky-500/50 to-indigo-500/50 rounded-full" />
                </div>

                {/* Poster Center Quote Area */}
                <div className="my-auto py-4 space-y-3 relative z-10">
                  <span className="text-4xl text-emerald-400/25 font-serif leading-none absolute -top-3 -left-1 select-none">“</span>
                  <p className="text-xs sm:text-sm font-bold text-slate-100 leading-relaxed tracking-wide text-center pt-2 italic px-2">
                    {(() => {
                      const sampleQuotes = [
                        { t: "शिक्षा सबसे शक्तिशाली हथियार है जिसका उपयोग आप दुनिया को बदलने के लिए कर सकते हैं।", a: "Nelson Mandela" },
                        { t: "उठो, जागो और तब तक मत रुको जब तक लक्ष्य की प्राप्ति न हो जाए।", a: "Swami Vivekananda" },
                        { t: "कठिन परिश्रम का कोई विकल्प नहीं है, निरंतर अभ्यास ही सफलता की कुंजी है।", a: "Golden Study Rule" },
                        { t: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", a: "Brian Herbert" },
                        { t: "सफलता की शुरुआत हमेशा स्वयं पर विश्वास करने से होती है।", a: "HANS COMPAIN Guidance" }
                      ];
                      const activeQuote = sampleQuotes[new Date().getDate() % sampleQuotes.length];
                      return activeQuote.t;
                    })()}
                  </p>
                  <p className="text-[10px] text-emerald-400 text-right pr-2 font-extrabold select-none leading-none">
                    — {(() => {
                      const sampleQuotes = [
                        { t: "शिक्षा सबसे शक्तिशाली हथियार है जिसका उपयोग आप दुनिया को बदलने के लिए कर सकते हैं।", a: "Nelson Mandela" },
                        { t: "उठो, जागो और तब तक मत रुको जब तक लक्ष्य की प्राप्ति न हो जाए।", a: "Swami Vivekananda" },
                        { t: "कठिन परिश्रम का कोई विकल्प नहीं है, निरंतर अभ्यास ही सफलता की कुंजी है।", a: "Golden Study Rule" },
                        { t: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", a: "Brian Herbert" },
                        { t: "सफलता की शुरुआत हमेशा स्वयं पर विश्वास करने से होती है।", a: "HANS COMPAIN Guidance" }
                      ];
                      const activeQuote = sampleQuotes[new Date().getDate() % sampleQuotes.length];
                      return activeQuote.a;
                    })()}
                  </p>
                </div>

                {/* Poster Footer Feature Highlights & Branding */}
                <div className="space-y-2 border-t border-slate-800/80 pt-3 text-center relative z-10">
                  <div className="flex items-center justify-center gap-1.5 flex-wrap text-[8px] font-extrabold text-sky-300 uppercase tracking-tight">
                    <span className="bg-sky-950/60 border border-sky-500/30 px-1.5 py-0.5 rounded">✍️ Shorthand</span>
                    <span className="bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">🧠 Live Quiz</span>
                    <span className="bg-indigo-950/60 border border-indigo-500/30 px-1.5 py-0.5 rounded">🔬 Science Lab</span>
                  </div>
                  
                  <div className="bg-[#02050A]/90 p-2 rounded-xl border border-slate-800 text-center">
                    <p className="text-[8px] font-extrabold text-emerald-400 font-mono tracking-tight uppercase">
                      HANS COMPAIN • AI Academic & Shorthand Studio
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions for modal */}
            <div className="space-y-2 pt-1 font-sans">
              <button
                type="button"
                onClick={() => {
                  const sampleQuotes = [
                    { t: "शिक्षा सबसे शक्तिशाली हथियार है जिसका उपयोग आप दुनिया को बदलने के लिए कर सकते हैं।", a: "Nelson Mandela" },
                    { t: "उठो, जागो और तब तक मत रुको जब तक लक्ष्य की प्राप्ति न हो जाए।", a: "Swami Vivekananda" },
                    { t: "कठिन परिश्रम का कोई विकल्प नहीं है, निरंतर अभ्यास ही सफलता की कुंजी है।", a: "Golden Study Rule" },
                    { t: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", a: "Brian Herbert" },
                    { t: "सफलता की शुरुआत हमेशा स्वयं पर विश्वास करने से होती है।", a: "HANS COMPAIN Guidance" }
                  ];
                  const activeQuote = sampleQuotes[new Date().getDate() % sampleQuotes.length];
                  const dynamicShareUrl = getAppShareUrl();
                  
                  const shareText = `🎯 *HANS COMPAIN - Daily Study Motivation* 🎯\\n\\n"${activeQuote.t}"\\n- _${activeQuote.a}_\\n\\n📲 *Start practicing Live Quizzes, Shorthand & Science Lab for exams!* Join Free At:\\n${dynamicShareUrl}\\n\\n🕊️ _HANS COMPAIN • AI Academic & Shorthand Ecosystem_`;
                  
                  if (navigator.share) {
                    navigator.share({
                      title: 'HANS COMPAIN Daily Status Badge',
                      text: shareText,
                      url: dynamicShareUrl
                    }).then(() => {
                      showToast("Shared successfully! 🎉", "success");
                    }).catch(() => {
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
                    });
                  } else {
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
                    showToast("Opening WhatsApp Status Share... 💬", "info");
                  }
                }}
                className="w-full py-2.5 bg-emerald-650 hover:bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-2 shadow-lg cursor-pointer border-none"
              >
                <span>💬 share status on whatsapp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const sampleQuotes = [
                    { t: "शिक्षा सबसे शक्तिशाली हथियार है जिसका उपयोग आप दुनिया को बदलने के लिए कर सकते हैं।", a: "Nelson Mandela" },
                    { t: "उठो, जागो और तब तक मत रुको जब तक लक्ष्य की प्राप्ति न हो जाए।", a: "Swami Vivekananda" },
                    { t: "कठिन परिश्रम का कोई विकल्प नहीं है, निरंतर अभ्यास ही सफलता की कुंजी है।", a: "Golden Study Rule" },
                    { t: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", a: "Brian Herbert" },
                    { t: "सफलता की शुरुआत हमेशा स्वयं पर विश्वास करने से होती है।", a: "HANS COMPAIN Guidance" }
                  ];
                  const activeQuote = sampleQuotes[new Date().getDate() % sampleQuotes.length];
                  const dynamicShareUrl = getAppShareUrl();
                  
                  const shareText = `🎯 *HANS COMPAIN - Daily Study Motivation* 🎯\\n\\n"${activeQuote.t}"\\n- _${activeQuote.a}_\\n\\n📲 JOIN AT: ${dynamicShareUrl}\\n\\n🕊️ _HANS COMPAIN • AI Academic & Shorthand Ecosystem_`;
                  copyToClipboard(shareText, showToast);
                }}
                className="w-full py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none"
              >
                <span>📋 copy status quote text</span>
              </button>
            </div>
          </div>
        </div>
      )}"""

# Let's replace it with the new customizable, editable status poster modal!
replacement = """      {/* WHATSAPP STUDY STATUS POSTER MODAL (9:16 ASPECT RATIO) */}
      {isSharePosterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-[#090D16] border border-emerald-500/20 rounded-3xl w-full max-w-md p-5 sm:p-6 relative shadow-2xl space-y-4 text-left max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3 border-none shadow-none bg-transparent">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎨</span>
                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-wide">WhatsApp Daily Status Poster</h3>
                  <p className="text-[9px] text-slate-500 font-bold">9:16 Custom Educational Branding Card</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSharePosterOpen(false)}
                className="p-1 px-2.5 text-slate-400 hover:text-white bg-slate-850/80 hover:bg-slate-800 rounded-lg transition-all text-xs font-bold border-none"
              >
                ✕ Close
              </button>
            </div>

            {/* Poster Canvas Preview */}
            <div className="py-2 flex justify-center">
              <div id="status-share-poster-card" className="aspect-[9/16] w-[270px] sm:w-[290px] bg-gradient-to-b from-[#090F1C] via-[#0E172E] to-[#040710] border-2 border-emerald-500/40 rounded-3xl p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden text-left font-sans group">
                {/* Background decorative glows */}
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-sky-500/15 blur-2xl rounded-full pointer-events-none" />
                <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-emerald-500/15 blur-2xl rounded-full pointer-events-none" />
                
                {/* Poster Header with Light Background Official Logo */}
                <div className="space-y-3 relative z-10 text-center">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-emerald-400 font-extrabold uppercase tracking-widest bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      OFFICIAL BADGE
                    </span>
                    <span className="text-[9px] text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                      2026 EDITION
                    </span>
                  </div>

                  {/* Centered HANS COMPAIN Light Logo */}
                  <div className="pt-1 flex flex-col items-center justify-center">
                    <QuantumSwanLogo className="w-16 h-16 sm:w-18 sm:h-18" showLightBg={true} />
                  </div>
                  
                  <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/50 via-sky-500/50 to-indigo-500/50 rounded-full" />
                </div>

                {/* Poster Center Quote Area */}
                <div className="my-auto py-4 space-y-3 relative z-10">
                  <span className="text-4xl text-emerald-400/25 font-serif leading-none absolute -top-3 -left-1 select-none">“</span>
                  <p className={`text-xs sm:text-sm font-bold text-center pt-2 italic px-2 leading-relaxed tracking-wide ${customPosterFont}`}>
                    {customPosterQuote}
                  </p>
                  <p className="text-[10px] text-emerald-400 text-right pr-2 font-extrabold select-none leading-none">
                    — {customPosterAuthor}
                  </p>
                </div>

                {/* Poster Footer Feature Highlights & Branding */}
                <div className="space-y-2 border-t border-slate-800/80 pt-3 text-center relative z-10">
                  <div className="flex items-center justify-center gap-1.5 flex-wrap text-[8px] font-extrabold text-sky-300 uppercase tracking-tight">
                    <span className="bg-sky-950/60 border border-sky-500/30 px-1.5 py-0.5 rounded">✍️ Shorthand</span>
                    <span className="bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">🧠 Live Quiz</span>
                    <span className="bg-indigo-950/60 border border-indigo-500/30 px-1.5 py-0.5 rounded">🔬 Science Lab</span>
                  </div>
                  
                  <div className="bg-[#02050A]/90 p-2 rounded-xl border border-slate-800 text-center">
                    <p className="text-[8px] font-extrabold text-emerald-400 font-mono tracking-tight uppercase">
                      HANS COMPAIN • AI Academic & Shorthand Studio
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customization Controls (अल्टरनेट फोंट्स और शब्द एडिटिंग) */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-850 space-y-3 font-sans">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Font Style (चुनें अलग फॉन्ट स्टाइल):</span>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { id: 'font-serif italic text-slate-100', name: 'Scholar 📜' },
                    { id: 'font-sans font-black tracking-tight text-white uppercase', name: 'Impact 💥' },
                    { id: 'font-mono tracking-widest text-emerald-300', name: 'Digital 💻' },
                    { id: 'font-sans font-semibold tracking-wide text-indigo-200', name: 'Modern ✨' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setCustomPosterFont(f.id)}
                      className={`p-1.5 text-[10px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                        customPosterFont === f.id ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Status Text (लिखा हुआ शब्द बदलें):</span>
                  <textarea
                    value={customPosterQuote}
                    onChange={(e) => setCustomPosterQuote(e.target.value)}
                    className="w-full bg-[#050812] border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium resize-none border-none"
                    rows={2}
                    placeholder="Enter status quote/text..."
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Signature Name (लेखक का नाम):</span>
                  <input
                    type="text"
                    value={customPosterAuthor}
                    onChange={(e) => setCustomPosterAuthor(e.target.value)}
                    className="w-full bg-[#050812] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium border-none"
                    placeholder="Author name..."
                  />
                </div>
              </div>
            </div>

            {/* Actions for modal */}
            <div className="space-y-2 pt-1 font-sans">
              <button
                type="button"
                onClick={() => {
                  const dynamicShareUrl = getAppShareUrl();
                  const shareText = `🎯 *HANS COMPAIN - Daily Study Motivation* 🎯\\n\\n"${customPosterQuote}"\\n- _${customPosterAuthor}_\\n\\n📲 *Start practicing Live Quizzes, Shorthand & Science Lab for exams!* Join Free At:\\n${dynamicShareUrl}\\n\\n🕊️ _HANS COMPAIN • AI Academic & Shorthand Ecosystem_`;
                  
                  if (navigator.share) {
                    navigator.share({
                      title: 'HANS COMPAIN Daily Status Badge',
                      text: shareText,
                      url: dynamicShareUrl
                    }).then(() => {
                      showToast("Shared successfully! 🎉", "success");
                    }).catch(() => {
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
                    });
                  } else {
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
                    showToast("Opening WhatsApp Status Share... 💬", "info");
                  }
                }}
                className="w-full py-2.5 bg-emerald-650 hover:bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-2 shadow-lg cursor-pointer border-none"
              >
                <span>💬 share status on whatsapp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const dynamicShareUrl = getAppShareUrl();
                  const shareText = `🎯 *HANS COMPAIN - Daily Study Motivation* 🎯\\n\\n"${customPosterQuote}"\\n- _${customPosterAuthor}_\\n\\n📲 JOIN AT: ${dynamicShareUrl}\\n\\n🕊️ _HANS COMPAIN • AI Academic & Shorthand Ecosystem_`;
                  copyToClipboard(shareText, showToast);
                }}
                className="w-full py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none"
              >
                <span>📋 copy status quote text</span>
              </button>
            </div>
          </div>
        </div>
      )}"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success: Poster modal replaced successfully!")
else:
    # Let's try matching with normal line endings
    target_clean = target.replace('\\r\\n', '\\n')
    if target_clean in content:
        content = content.replace(target_clean, replacement)
        with open('src/App.tsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Success: Poster modal replaced with clean target!")
    else:
        # Fallback to general lookup
        idx = content.find("WHATSAPP STUDY STATUS POSTER MODAL")
        if idx != -1:
            print("Found label at index", idx)
        else:
            print("Error: Could not find target block in src/App.tsx")
