const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /const QuantumSwanLogo = \(\{[\s\S]*?\}\) => \{[\s\S]*?const svgLogo = \([\s\S]*?<\/svg>\s*\);[\s\S]*?if \(!showLightBg\) return svgLogo;[\s\S]*?return \([\s\S]*?\{svgLogo\}[\s\S]*?<\/div>\s*\);\s*\};/m;

const replacement = `const QuantumSwanLogo = ({ 
  className = "w-12 h-12 sm:w-14 sm:h-14", 
  showLightBg = true,
  containerClassName = "",
  showBrandText = true
}: { 
  className?: string; 
  showLightBg?: boolean;
  containerClassName?: string;
  showBrandText?: boolean;
}) => {
  const imgLogo = (
    <img 
      src="/logo.png" 
      alt="Hans Compain Logo" 
      className={\`\${className} transition-transform duration-500 hover:scale-105 object-contain\`} 
    />
  );

  if (!showLightBg) return imgLogo;

  return (
    <div className={\`relative inline-flex items-center justify-center p-2 sm:p-2.5 bg-white border border-slate-200/90 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 shrink-0 \${containerClassName}\`}>
      <div className="relative z-10 flex items-center justify-center">
        {imgLogo}
      </div>
    </div>
  );
};`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Successfully replaced QuantumSwanLogo");
} else {
    console.log("Regex did not match");
}
