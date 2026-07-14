const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// The multi-line ones:
code = code.replace(/p-2\.5 font-mono cursor-pointer transition-colors/g, 'p-1 xl:p-1.5 font-mono cursor-pointer transition-colors');
code = code.replace(/p-2\.5 font-mono cursor-pointer font-semibold transition-all/g, 'p-1 xl:p-1.5 font-mono cursor-pointer font-semibold transition-all');

// Let's also check if the text sizes of the measurement values are a bit too large. Currently they are not explicitly sized in the mapped td, meaning they inherit from table (text-[10px] xl:text-xs).
fs.writeFileSync('src/App.tsx', code);
console.log("Replaced successfully!");
