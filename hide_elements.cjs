const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');
content = content.replace(/airTemp: number;/g, 'airTemp: number | null;');
content = content.replace(/surfaceTemp: number;/g, 'surfaceTemp: number | null;');
content = content.replace(/humidity: number;/g, 'humidity: number | null;');
content = content.replace(/dewIndex: number;/g, 'dewIndex: number | null;');
fs.writeFileSync('src/types.ts', content);
