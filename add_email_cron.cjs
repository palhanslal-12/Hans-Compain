const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

// Add imports
const importsToAdd = `import nodemailer from "nodemailer";
import cron from "node-cron";\n`;

if (!code.includes('import nodemailer')) {
    code = code.replace('import dotenv from "dotenv";', 'import dotenv from "dotenv";\n' + importsToAdd);
}

// Add the Cron job and Transporter
const cronCode = `
// ==========================================
// 📧 AUTOMATIC EMAIL REMINDER SYSTEM (CRON)
// ==========================================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com', // Replace with your Gmail
    pass: process.env.EMAIL_PASS || 'your-app-password'     // Replace with your App Password
  }
});

// Run every day at 10:00 AM server time
cron.schedule('0 10 * * *', () => {
  console.log("Running daily email check for inactive users...");
  const users = loadUsers();
  const now = Date.now();
  const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
  const fourDaysMs = 4 * 24 * 60 * 60 * 1000;

  users.forEach(user => {
    // Only send to valid emails, skip visitors/guests
    if (!user.email || user.email.includes('@student.hansai.in') || user.email.includes('@hansai.visitor')) return;
    
    const lastActive = new Date(user.lastActiveAt || user.registeredAt).getTime();
    const timeSinceActive = now - lastActive;

    // Condition: Inactive for more than 3 days but less than 4 days
    if (timeSinceActive > threeDaysMs && timeSinceActive < fourDaysMs) {
      const mailOptions = {
        from: '"HANS COMPAIN AI" <' + (process.env.EMAIL_USER || 'noreply@hansai.in') + '>',
        to: user.email,
        subject: 'आपका पर्सनल स्टडी असिस्टेंट आपका इंतज़ार कर रहा है! 🚀',
        html: \`
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #4F46E5; margin: 0;">HANS COMPAIN</h1>
              <p style="color: #64748B; font-size: 14px; margin-top: 5px;">Shorthand & AI Learning Platform</p>
            </div>
            
            <h2 style="color: #333;">नमस्ते \${user.name || 'स्टूडेंट'},</h2>
            <p style="color: #555; line-height: 1.6;">हमें उम्मीद है कि आपकी पढ़ाई अच्छी चल रही होगी!</p>
            <p style="color: #555; line-height: 1.6;">आपने कुछ दिन पहले <strong>Hans Compain</strong> पर लॉगिन किया था। क्या आपको याद है? हमने आपकी तैयारी को आसान बनाने के लिए कई शानदार फीचर्स बनाए हैं।</p>
            
            <h3 style="color: #06B6D4; margin-top: 25px;">एक बार फिर से नज़र डालें:</h3>
            <ul style="color: #444; line-height: 1.8;">
              <li>🎙️ <strong>स्टेनो मास्टर:</strong> लाइव डिक्टेशन (60-120 WPM)</li>
              <li>🤖 <strong>AI टीचर:</strong> आपके हर सवाल का सटीक जवाब</li>
              <li>📝 <strong>1-मिनट रीकैप:</strong> फ्लैशकार्ड्स के साथ जल्दी रिवीज़न</li>
              <li>⚔️ <strong>लाइव क्विज़ बैटल:</strong> दोस्तों के साथ रियल-टाइम टेस्ट</li>
            </ul>

            <div style="background-color: #ECFDF5; padding: 15px; border-left: 5px solid #10B981; border-radius: 4px; margin: 25px 0;">
              <p style="margin: 0; font-size: 16px; color: #065F46;"><strong>💡 और सबसे अच्छी बात?</strong> यह प्लेटफॉर्म स्टूडेंट्स के लिए <strong>100% Free</strong> है!</p>
            </div>

            <p style="color: #555; line-height: 1.6;">अपनी तैयारी को एक नया बूस्ट देने के लिए अभी वापस आएं:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://hans-compain.onrender.com/" style="display: inline-block; padding: 14px 28px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">अभी अपनी पढ़ाई शुरू करें 🚀</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #999; text-align: center; line-height: 1.5;">
              अगर आप यह ईमेल आगे नहीं पाना चाहते, तो कृपया इसे इग्नोर करें। <br>
              © 2026 Hans Compain AI Platform by Hans Lal Pal
            </p>
          </div>
        \`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending reminder email to", user.email, error.message);
        } else {
          console.log("Reminder email sent successfully to", user.email, info.messageId);
        }
      });
    }
  });
});
// ==========================================
`;

if (!code.includes('AUTOMATIC EMAIL REMINDER SYSTEM')) {
    // Insert just before startServer() function
    code = code.replace('async function startServer() {', cronCode + '\nasync function startServer() {');
    fs.writeFileSync('server.ts', code);
    console.log("Successfully added email cron job.");
} else {
    console.log("Cron job already exists.");
}

