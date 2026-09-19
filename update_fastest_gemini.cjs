const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf8');

// Replace fallback sequence in server.ts to prioritize fastest models (gemini-2.5-flash, gemini-1.5-flash, gemini-2.5-flash)
const targetSequence = `const fallbackSequence = [requested, "gemini-3.7-flash", "gemini-3.1-flash-lite", "gemini-1.5-flash", "gemini-flash-latest"];`;
const newSequence = `const fallbackSequence = [requested, "gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.5-flash", "gemini-flash-latest"];`;

if (serverCode.includes(targetSequence)) {
  serverCode = serverCode.replace(targetSequence, newSequence);
  console.log("Updated fallback sequence to gemini-2.5-flash / gemini-1.5-flash!");
}

// Replace primary default model from gemini-3.7-flash to gemini-2.5-flash
serverCode = serverCode.replace(/"gemini-3.7-flash"/g, '"gemini-2.5-flash"');
serverCode = serverCode.replace(/gemini-3.7-flash/g, 'gemini-2.5-flash');

fs.writeFileSync('server.ts', serverCode);
console.log("Updated server.ts default Gemini model to gemini-2.5-flash!");

// Update App.tsx default model if present
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/gemini-3\.7-flash/g, 'gemini-2.5-flash');
fs.writeFileSync('src/App.tsx', appCode);
console.log("Updated App.tsx default model to gemini-2.5-flash!");
