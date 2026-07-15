const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/mockData/g, 'sheetData');
content = content.replace(/setMockData/g, 'setSheetData');

fs.writeFileSync('src/App.tsx', content);
