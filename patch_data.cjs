const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldCalc = `      const calculateLocalDewIndex = (air: any, surf: any, hum: any) => {
        if (air === null || surf === null || hum === null || air === "" || surf === "" || hum === "" || isNaN(Number(air)) || isNaN(Number(surf)) || isNaN(Number(hum)) || air === undefined || surf === undefined || hum === undefined) return null;
        const dewPoint = air - ((100 - hum) / 5);
        const diff = surf - dewPoint;
        if (diff <= 0) return 95;
        if (diff >= 6) return Math.max(15, Math.round(35 - (diff - 6) * 4));
        return Math.max(0, Math.min(100, Math.round(95 - (diff * 10))));
      };`;

const newCalc = `      const calculateLocalDewIndex = (air: any, surf: any, hum: any) => {
        if (air === null || surf === null || hum === null || air === "" || surf === "" || hum === "" || isNaN(Number(air)) || isNaN(Number(surf)) || isNaN(Number(hum)) || air === undefined || surf === undefined || hum === undefined) return null;
        const dewPoint = air - ((100 - hum) / 5);
        const diff = surf - dewPoint;
        if (diff <= 0) {
          return Math.max(81, Math.min(100, Math.round(90 - (diff * 10))));
        } else if (diff <= 3) {
          return Math.max(61, Math.min(80, Math.round(80 - (diff / 3) * 19)));
        } else {
          return Math.max(15, Math.min(60, Math.round(60 - (diff - 3) * 5)));
        }
      };`;

content = content.replace(oldCalc, newCalc);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched calc successfully!");
