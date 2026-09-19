const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf8');

// Target the /api/chat route where req.body is destructured
const targetCode = `let { messages: reqMessages, message: singleMessage, systemInstruction: customSystemInstruction, model, image, images, imagePayload, advancedResearch, isEncrypted: reqIsEncrypted, userName, userEmail } = req.body;`;

const newCode = `let { messages: reqMessages, message: singleMessage, systemInstruction: customSystemInstruction, model, image, images, imagePayload, advancedResearch, isEncrypted: reqIsEncrypted, userName, userEmail, userRole } = req.body;`;

if (serverCode.includes(targetCode)) {
  serverCode = serverCode.replace(targetCode, newCode);
  console.log("Updated req.body destructuring with userRole!");
} else {
  console.log("targetCode not found, checking if already updated");
}

// Target where customizedInstruction is defined
const targetPromptSetup = `let customizedInstruction = customSystemInstruction || otaConfig.systemInstruction;`;

const newPromptSetup = `let customizedInstruction = customSystemInstruction || otaConfig.systemInstruction;

    // HANS COMPAIN Role-Based Adaptation Rules
    if (userRole === 'steno_aspirant') {
      customizedInstruction += "\\n\\nROLE ADAPTABILITY MANDATE (SSC STENOGRAPHER ASPIRANT): The user is a Stenographer aspirant. Focus heavily on English grammar rules, dictation speed tips (60-120 WPM), Pitman shorthand strokes/phrasal outlines, vocabulary, and TCS iON mock analysis.";
    } else if (userRole === 'board_student') {
      customizedInstruction += "\\n\\nROLE ADAPTABILITY MANDATE (BOARD STUDENT 10TH/12TH): The user is a Board exam student (10th or 12th). Focus on NCERT-aligned solutions, chapter summaries, key formula breakdowns, and structured subjective answer writing step-by-step.";
    }`;

if (serverCode.includes(targetPromptSetup) && !serverCode.includes("steno_aspirant")) {
  serverCode = serverCode.replace(targetPromptSetup, newPromptSetup);
  console.log("Added userRole prompt adaptation to customizedInstruction!");
} else {
  console.log("Prompt setup target not found or already added.");
}

fs.writeFileSync('server.ts', serverCode);
console.log("server.ts updated successfully!");
