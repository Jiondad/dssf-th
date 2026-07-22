const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove the `sheetData.length === 0 ? (...) : null}` block completely
// Or change it to not use absolute overlay if we want to keep the message, 
// but the instruction says: "차트와 표가 비워진 상태로 렌더링되게 해줘." -> "rendered empty"
// Let's remove the empty state overlay.

content = content.replace(
  /\) : sheetData\.length === 0 \? \([\s\S]*?\) : null\}/,
  `) : null}`
);

fs.writeFileSync('src/App.tsx', content);
