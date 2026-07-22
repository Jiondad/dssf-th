const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '<div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-2 border-b border-slate-100 pb-2 mb-2">',
  '<div className="shrink-0 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-2 border-b border-slate-100 pb-2 mb-2">'
);

fs.writeFileSync('src/App.tsx', content);
