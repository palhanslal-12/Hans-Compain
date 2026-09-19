const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace YouTube link
code = code.replace(/href="https:\/\/youtube\.com\/@hanscompain"/g, 'href="https://youtube.com/@hanscompain-official?si=cqOxfzzecoag1LjP"');

// Replace Instagram link
code = code.replace(/href="https:\/\/instagram\.com\/hans\.compain"/g, 'href="https://www.instagram.com/hans_compain_official?stkn=dDI4ZjR6MnlpaXR4"');

fs.writeFileSync('src/App.tsx', code);
console.log("Updated official YouTube and Instagram links successfully!");
