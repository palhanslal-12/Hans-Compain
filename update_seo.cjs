const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Update Title
html = html.replace(
  /<title>.*?<\/title>/, 
  '<title>HANS COMPAIN Shorthand | हंस कैंपेन शॉर्टहैंड</title>'
);

// Update Description
html = html.replace(
  /<meta name="description" content=".*?" \/>/, 
  '<meta name="description" content="Hans Compain Shorthand (हंस कैंपेन शॉर्टहैंड) by Hans Lal Pal. The best platform for Hans Compain, Compain Shorthand, Steno Dictation, and AI Learning." />'
);

// Update Keywords
html = html.replace(
  /<meta name="keywords" content=".*?" \/>/, 
  '<meta name="keywords" content="Hans Compain, Hans Compain Shorthand, Compain Shorthand, हंस कैंपेन, हंस कैंपेन शॉर्टहैंड, कैंपेन शॉर्टहैंड, Hans Lal Pal, Steno Dictation" />'
);

// Update Open Graph Title
html = html.replace(
  /<meta property="og:title" content=".*?" \/>/, 
  '<meta property="og:title" content="HANS COMPAIN Shorthand | हंस कैंपेन शॉर्टहैंड" />'
);

// Update JSON-LD alternateNames
html = html.replace(
  /"alternateName": \[.*?\],/,
  '"alternateName": ["Hans Compain Shorthand", "Hans Compain", "Compain Shorthand", "हंस कैंपेन", "हंस कैंपेन शॉर्टहैंड"],'
);

fs.writeFileSync('index.html', html);
console.log("SEO updated successfully");
