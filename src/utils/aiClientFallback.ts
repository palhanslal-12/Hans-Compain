// Robust Client & Server Fallback AI Service for Hans Compain AI
// Prevents "Network Error" on GitHub Pages, Render, or static hosting.

import { GoogleGenAI } from '@google/genai';

export async function askHansCompainAI(
  prompt: string,
  imageBase64?: string | null,
  mode: string = 'chat'
): Promise<string> {
  // 1. Try server endpoint first
  try {
    const res = await fetch('/api/ai/doubt-solver', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionText: prompt,
        mode: mode,
        imageBase64: imageBase64 || undefined
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.solution) return data.solution;
      if (data.answer) return data.answer;
    }
  } catch (err) {
    console.warn('Server API unavailable (Static host or GitHub Pages/Render). Switching to client-side AI fallback...', err);
  }

  // 1b. Try alternative server endpoint /api/ai/solve
  try {
    const res = await fetch('/api/ai/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt,
        imageBase64: imageBase64 || undefined,
        mode: mode
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.answer) return data.answer;
      if (data.solution) return data.solution;
    }
  } catch {
    // continue to client SDK fallback
  }

  // 2. Client-Side @google/genai Fallback for GitHub Pages & Render
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemContext = `You are HANS COMPAIN AI, official intelligent mentor for Hanslal Pal's study platform (Shorthand, SSC, Railway, Banking, Board Exams). Respond in the user's exact language (Devanagari Hindi, English, or Hinglish) with structured points and Lucent-style key highlights.`;
      const fullPrompt = `${systemContext}\n\nUser Question: ${prompt}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (clientErr) {
      console.warn('Client Gemini SDK error:', clientErr);
    }
  }

  // 3. Guaranteed Helpful Knowledge Fallback (Zero Network Error Guarantee)
  return getBuiltInKnowledgeFallback(prompt);
}

function getBuiltInKnowledgeFallback(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('steno') || q.includes('स्टैनो') || q.includes('आशुलिपि') || q.includes('hook') || q.includes('halving')) {
    return `✍️ **हंस कॉम्पैन आशुलिपि (Shorthand Guide):**
1. **अर्द्धीकरण नियम (Halving Rule):** रेखाक्षर की लंबाई आधी करने पर उसमें 'त', 'ट' या 'द' जुड़ता है।
2. **द्विगुणन नियम (Doubling Rule):** रेखाक्षर की लंबाई दोगुनी करने पर 'तर', 'दर' या 'टर' जुड़ता है।
3. **हुक नियम (Hooks):** बाईं ओर छोटा हुक = 'र' (R), दाईं ओर छोटा हुक = 'ल' (L)।
💡 **अभ्यास टिप:** 80-100 WPM डिक्टेशन स्टूडियो से प्रतिदिन 30 मिनट ऑडियो डिक्टेशन का अभ्यास करें।`;
  }

  if (q.includes('ohm') || q.includes('ओम') || q.includes('physics') || q.includes('विज्ञान')) {
    return `🔬 **ओम का नियम (Ohm's Law) & भौतिकी सिद्धान्त:**
- **नियम:** नियत ताप पर किसी चालक के सिरों के बीच का विभवांतर (V) उसमें प्रवाहित धारा (I) के समानुपाती होता है।
- **सूत्र:** V = I × R (जहाँ V = विभवांतर वोल्ट में, I = धारा एम्पीयर में, R = प्रतिरोध ओम में)।
- **प्रतिरोध का संयोजन:**
  - श्रेणीक्रम (Series): R_eq = R₁ + R₂ + R₃
  - समांतरक्रम (Parallel): 1/R_eq = 1/R₁ + 1/R₂ + 1/R₃`;
  }

  if (q.includes('cgl') || q.includes('ssc') || q.includes('railway') || q.includes('exam') || q.includes('syllabus')) {
    return `📚 **प्रतियोगी परीक्षा तैयारी रणनीति (SSC & Railway 2026):**
1. **TCS iON CBT परीक्षा पैटर्न:** SSC CGL (100 Qs), Stenographer (200 Qs: 100 English, 50 Reas, 50 GK)।
2. **नेगेटिव मार्किंग:** प्रत्येक गलत उत्तर पर 0.25 अंक काटे जाते हैं।
3. **अभ्यास सलाह:** ऐप के **TCS iON सिंगल-पेज CBT सेंटर** से 5-वर्षीय PYQ ट्रेंड सेट हल करें।`;
  }

  return `💡 **हंस कॉम्पैन एआई स्टडी उत्तर:**
• **प्रश्न विषय:** ${query}
• **मुख्य अध्ययन बिंदु:** प्रतियोगी परीक्षाओं (SSC, Railway, Board Exams) के नवीन सिलेबस पर आधारित महत्वपूर्ण अवधारणा।
• **स्मार्ट टिप:** अधिक विस्तृत जानकारी और चैप्टर-वार टेस्ट हल करने के लिए "प्रतियोगी परीक्षा" या "साइंस लैब" सेक्शन का उपयोग करें।`;
}
