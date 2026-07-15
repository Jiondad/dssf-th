const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'const calculateLocalDewIndex = (air: number | null, surf: number | null, hum: number | null) => {\n        if (air === null || surf === null || hum === null) return null;',
  'const calculateLocalDewIndex = (air: any, surf: any, hum: any) => {\n        if (air === null || surf === null || hum === null || air === "" || surf === "" || hum === "" || isNaN(Number(air)) || isNaN(Number(surf)) || isNaN(Number(hum)) || air === undefined || surf === undefined || hum === undefined) return null;'
);

fs.writeFileSync('src/App.tsx', content);
