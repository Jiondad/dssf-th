const fs = require('fs');
let code = fs.readFileSync('src/components/MonthlyChart.tsx', 'utf8');

// PM Air
code = code.replace(/<span className="w-3 h-0 border-b-\[2px\] border-dashed border-\[#ea580c\] shrink-0"><\/span>/,
  '<div className="flex items-center gap-[2px] shrink-0 w-3"><span className="w-[5px] h-0.5 bg-[#ea580c]"></span><span className="w-[5px] h-0.5 bg-[#ea580c]"></span></div>');

// PM Surface
code = code.replace(/<span className="w-3 h-0 border-b-\[2px\] border-dashed border-\[#2563eb\] shrink-0"><\/span>/,
  '<div className="flex items-center gap-[2px] shrink-0 w-3"><span className="w-[5px] h-0.5 bg-[#2563eb]"></span><span className="w-[5px] h-0.5 bg-[#2563eb]"></span></div>');

// PM Humidity
code = code.replace(/<span className="w-3 h-0 border-b-\[2px\] border-dashed border-\[#7c3aed\] shrink-0"><\/span>/,
  '<div className="flex items-center gap-[2px] shrink-0 w-3"><span className="w-[5px] h-0.5 bg-[#7c3aed]"></span><span className="w-[5px] h-0.5 bg-[#7c3aed]"></span></div>');

// PM Dew
code = code.replace(/<span className="w-3 h-0 border-b-\[2px\] border-dashed border-\[#10b981\] shrink-0"><\/span>/,
  '<div className="flex items-center gap-[2px] shrink-0 w-3"><span className="w-[5px] h-0.5 bg-[#10b981]"></span><span className="w-[5px] h-0.5 bg-[#10b981]"></span></div>');

fs.writeFileSync('src/components/MonthlyChart.tsx', code);
