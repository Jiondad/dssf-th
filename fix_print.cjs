const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/if \(prev >= mockData\.length\) return 1;/g, 'if (prev >= 31) return 1;');
content = content.replace(/Total \{mockData\.length\} Days/g, 'Total 31 Days');
content = content.replace(/max=\{mockData\.length > 0 \? mockData\.length : 31\}/g, 'max={31}');
content = content.replace(/1일부터 \{mockData\.length\}일까지/g, '1일부터 31일까지');
content = content.replace(/전체 \{mockData\.length\}일 대장/g, '전체 31일 대장');

fs.writeFileSync('src/App.tsx', content);
