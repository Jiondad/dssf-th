const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/@media print \{[\s\S]*\}\}/g, '');
fs.writeFileSync('src/index.css', css);
