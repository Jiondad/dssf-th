const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Surface Temp
content = content.replace(
  /<span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">코일 표면 온도<\/span>\s*<h3 className="text-lg font-bold text-slate-800 mt-0\.5">Surface Temp<\/h3>/,
  `<span className="text-base text-slate-800 font-extrabold tracking-tight block">코일 표면 온도</span>
                  <h3 className="text-sm font-medium text-slate-500 mt-0.5 uppercase tracking-wide">Surface Temp</h3>`
);

// Relative Humidity
content = content.replace(
  /<span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">상대 습도<\/span>\s*<h3 className="text-lg font-bold text-slate-800 mt-0\.5">Relative Humidity<\/h3>/,
  `<span className="text-base text-slate-800 font-extrabold tracking-tight block">상대 습도</span>
                  <h3 className="text-sm font-medium text-slate-500 mt-0.5 uppercase tracking-wide">Relative Humidity</h3>`
);

// Condensation Index
content = content.replace(
  /<span className="text-base text-slate-900 font-extrabold tracking-tight block">결로 위험 지수<\/span>\s*<h3 className="text-sm font-medium opacity-75 text-slate-700 mt-0\.5 uppercase tracking-wide">Condensation Index<\/h3>/,
  `<span className="text-base text-slate-800 font-extrabold tracking-tight block">결로 위험 지수</span>
                    <h3 className="text-sm font-medium text-slate-500 mt-0.5 uppercase tracking-wide">Condensation Index</h3>`
);

fs.writeFileSync('src/App.tsx', content);
