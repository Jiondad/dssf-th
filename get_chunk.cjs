const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = content.indexOf('<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-3 mb-3">');
const endIndex = content.indexOf('{/* Recharts Container */}');

if (startIndex !== -1 && endIndex !== -1) {
  fs.writeFileSync('chunk_to_replace.txt', content.substring(startIndex, endIndex));
  console.log("Chunk written.");
} else {
  console.log("Not found.", startIndex, endIndex);
}
