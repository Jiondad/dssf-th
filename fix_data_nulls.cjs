const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf8');

content = content.replace(
  /airTemp: Number\(item\.amAirTemp\),\s*surfaceTemp: Number\(item\.amSurfaceTemp\),\s*humidity: Number\(item\.amHumidity\),\s*dewIndex: Number\(item\.amCondIndex\)/,
  `airTemp: item.amAirTemp === "" || item.amAirTemp == null ? null : Number(item.amAirTemp),
            surfaceTemp: item.amSurfaceTemp === "" || item.amSurfaceTemp == null ? null : Number(item.amSurfaceTemp),
            humidity: item.amHumidity === "" || item.amHumidity == null ? null : Number(item.amHumidity),
            dewIndex: item.amCondIndex === "" || item.amCondIndex == null ? null : Number(item.amCondIndex)`
);

content = content.replace(
  /airTemp: Number\(item\.pmAirTemp\),\s*surfaceTemp: Number\(item\.pmSurfaceTemp\),\s*humidity: Number\(item\.pmHumidity\),\s*dewIndex: Number\(item\.pmCondIndex\)/,
  `airTemp: item.pmAirTemp === "" || item.pmAirTemp == null ? null : Number(item.pmAirTemp),
            surfaceTemp: item.pmSurfaceTemp === "" || item.pmSurfaceTemp == null ? null : Number(item.pmSurfaceTemp),
            humidity: item.pmHumidity === "" || item.pmHumidity == null ? null : Number(item.pmHumidity),
            dewIndex: item.pmCondIndex === "" || item.pmCondIndex == null ? null : Number(item.pmCondIndex)`
);

fs.writeFileSync('src/data.ts', content);
