const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf8');

// Remove getMonthlyMockData completely
content = content.replace(/\/\/ Generate deterministic realistic factory data for 31 days[\s\S]*$/, '');

fs.writeFileSync('src/data.ts', content);
