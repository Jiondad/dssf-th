const fs = require('fs');
let code = fs.readFileSync('src/components/SummaryCards.tsx', 'utf8');

// text-[10px] -> text-base
code = code.replace(/<span className="text-\[10px\] text-emerald-800 block font-semibold mb-1">안전 일수<\/span>/,
  '<span className="text-base lg:text-lg text-emerald-800 block font-bold mb-1">안전 일수</span>');
code = code.replace(/<span className="text-sm font-bold text-emerald-600 font-mono">\{monthlyStats\.safeCount\}일<\/span>/,
  '<span className="text-3xl font-extrabold text-emerald-600 font-mono">{monthlyStats.safeCount}일</span>');

code = code.replace(/<span className="text-\[10px\] text-amber-800 block font-semibold mb-1">주의 일수<\/span>/,
  '<span className="text-base lg:text-lg text-amber-800 block font-bold mb-1">주의 일수</span>');
code = code.replace(/<span className="text-sm font-bold text-amber-500 font-mono">\{monthlyStats\.cautionCount\}일<\/span>/,
  '<span className="text-3xl font-extrabold text-amber-500 font-mono">{monthlyStats.cautionCount}일</span>');

code = code.replace(/<span className="text-\[10px\] text-rose-800 block font-semibold mb-1">위험 일수<\/span>/,
  '<span className="text-base lg:text-lg text-rose-800 block font-bold mb-1">위험 일수</span>');
code = code.replace(/<span className="text-sm font-bold text-rose-600 font-mono">\{monthlyStats\.dangerCount\}일<\/span>/,
  '<span className="text-3xl font-extrabold text-rose-600 font-mono">{monthlyStats.dangerCount}일</span>');

fs.writeFileSync('src/components/SummaryCards.tsx', code);
