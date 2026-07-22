const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Air Temp Summary
content = content.replace(
  /<span className="text-2xl font-bold font-mono text-slate-800">\{currentRecord\.am\.airTemp\}<\/span>/g,
  '<span className="text-2xl font-bold font-mono text-slate-800">{currentRecord.am.airTemp !== null ? currentRecord.am.airTemp : "-"}</span>'
);
content = content.replace(
  /<span className="text-2xl font-bold font-mono text-slate-800">\{currentRecord\.pm\.airTemp\}<\/span>/g,
  '<span className="text-2xl font-bold font-mono text-slate-800">{currentRecord.pm.airTemp !== null ? currentRecord.pm.airTemp : "-"}</span>'
);
content = content.replace(
  /일교차: \{Math\.round\(\(currentRecord\.pm\.airTemp - currentRecord\.am\.airTemp\) \* 10\) \/ 10\}℃/g,
  '일교차: {currentRecord.pm.airTemp !== null && currentRecord.am.airTemp !== null ? Math.round((currentRecord.pm.airTemp - currentRecord.am.airTemp) * 10) / 10 + "℃" : "-"}'
);

// Surface Temp Summary
content = content.replace(
  /<span className="text-2xl font-bold font-mono text-slate-800">\{currentRecord\.am\.surfaceTemp\}<\/span>/g,
  '<span className="text-2xl font-bold font-mono text-slate-800">{currentRecord.am.surfaceTemp !== null ? currentRecord.am.surfaceTemp : "-"}</span>'
);
content = content.replace(
  /<span className="text-2xl font-bold font-mono text-slate-800">\{currentRecord\.pm\.surfaceTemp\}<\/span>/g,
  '<span className="text-2xl font-bold font-mono text-slate-800">{currentRecord.pm.surfaceTemp !== null ? currentRecord.pm.surfaceTemp : "-"}</span>'
);
content = content.replace(
  /<span>대기대비차: 오전 \{Math\.round\(\(currentRecord\.am\.airTemp - currentRecord\.am\.surfaceTemp\) \* 10\) \/ 10\}℃ <span className="text-slate-300 mx-1">\|<\/span> 오후 \{Math\.round\(\(currentRecord\.pm\.airTemp - currentRecord\.pm\.surfaceTemp\) \* 10\) \/ 10\}℃<\/span>/g,
  '<span>대기대비차: 오전 {currentRecord.am.airTemp !== null && currentRecord.am.surfaceTemp !== null ? Math.round((currentRecord.am.airTemp - currentRecord.am.surfaceTemp) * 10) / 10 + "℃" : "-"} <span className="text-slate-300 mx-1">|</span> 오후 {currentRecord.pm.airTemp !== null && currentRecord.pm.surfaceTemp !== null ? Math.round((currentRecord.pm.airTemp - currentRecord.pm.surfaceTemp) * 10) / 10 + "℃" : "-"}</span>'
);

// Humidity Summary
content = content.replace(
  /<span className="text-2xl font-bold font-mono text-slate-800">\{currentRecord\.am\.humidity\}<\/span>/g,
  '<span className="text-2xl font-bold font-mono text-slate-800">{currentRecord.am.humidity !== null ? currentRecord.am.humidity : "-"}</span>'
);
content = content.replace(
  /<span className="text-2xl font-bold font-mono text-slate-800">\{currentRecord\.pm\.humidity\}<\/span>/g,
  '<span className="text-2xl font-bold font-mono text-slate-800">{currentRecord.pm.humidity !== null ? currentRecord.pm.humidity : "-"}</span>'
);
content = content.replace(
  /일교차: \{currentRecord\.am\.humidity - currentRecord\.pm\.humidity\}%/g,
  '일교차: {currentRecord.am.humidity !== null && currentRecord.pm.humidity !== null ? (currentRecord.am.humidity - currentRecord.pm.humidity) + "%" : "-"}'
);

// Dew Index Summary
content = content.replace(
  /<span className="text-2xl font-black font-mono text-slate-900">\{currentRecord\.am\.dewIndex\}<\/span>/g,
  '<span className="text-2xl font-black font-mono text-slate-900">{currentRecord.am.dewIndex !== null ? currentRecord.am.dewIndex : "-"}</span>'
);
content = content.replace(
  /<span className="text-2xl font-black font-mono text-slate-900">\{currentRecord\.pm\.dewIndex\}<\/span>/g,
  '<span className="text-2xl font-black font-mono text-slate-900">{currentRecord.pm.dewIndex !== null ? currentRecord.pm.dewIndex : "-"}</span>'
);

// calculateLocalDewIndex Math.max for maxCondensationIndex
content = content.replace(
  /return Math\.max\(currentRecord\.am\.dewIndex, currentRecord\.pm\.dewIndex\);/,
  `if (currentRecord.am.dewIndex === null && currentRecord.pm.dewIndex === null) return 0;
    if (currentRecord.am.dewIndex === null) return currentRecord.pm.dewIndex;
    if (currentRecord.pm.dewIndex === null) return currentRecord.am.dewIndex;
    return Math.max(currentRecord.am.dewIndex, currentRecord.pm.dewIndex);`
);

fs.writeFileSync('src/App.tsx', content);
