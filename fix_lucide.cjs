const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/Star\s*Settings,/g, 'Star,\n  Settings,');
fs.writeFileSync('src/App.tsx', code);
