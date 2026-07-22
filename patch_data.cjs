const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf8');

const calcStr = `
const calculateLocalDewIndex = (air: any, surf: any, hum: any) => {
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
};
`;

const oldFetchStart = `export async function fetchSpreadsheetData(sheetName: string, year: number, month: number): Promise<DailyRecord[]> {`;
content = content.replace(oldFetchStart, calcStr + oldFetchStart);

const oldRecordsPush = `        records.push({
          day: itemDay,
          am: {
            airTemp: item.amAirTemp === "" || item.amAirTemp == null ? null : Number(item.amAirTemp),
            surfaceTemp: item.amSurfaceTemp === "" || item.amSurfaceTemp == null ? null : Number(item.amSurfaceTemp),
            humidity: item.amHumidity === "" || item.amHumidity == null ? null : Number(item.amHumidity),
            dewIndex: item.amCondIndex === "" || item.amCondIndex == null ? null : Number(item.amCondIndex)
          },
          pm: {
            airTemp: item.pmAirTemp === "" || item.pmAirTemp == null ? null : Number(item.pmAirTemp),
            surfaceTemp: item.pmSurfaceTemp === "" || item.pmSurfaceTemp == null ? null : Number(item.pmSurfaceTemp),
            humidity: item.pmHumidity === "" || item.pmHumidity == null ? null : Number(item.pmHumidity),
            dewIndex: item.pmCondIndex === "" || item.pmCondIndex == null ? null : Number(item.pmCondIndex)
          }
        });`;

const newRecordsPush = `        records.push({
          day: itemDay,
          am: {
            airTemp: item.amAirTemp === "" || item.amAirTemp == null ? null : Number(item.amAirTemp),
            surfaceTemp: item.amSurfaceTemp === "" || item.amSurfaceTemp == null ? null : Number(item.amSurfaceTemp),
            humidity: item.amHumidity === "" || item.amHumidity == null ? null : Number(item.amHumidity),
            dewIndex: calculateLocalDewIndex(item.amAirTemp, item.amSurfaceTemp, item.amHumidity)
          },
          pm: {
            airTemp: item.pmAirTemp === "" || item.pmAirTemp == null ? null : Number(item.pmAirTemp),
            surfaceTemp: item.pmSurfaceTemp === "" || item.pmSurfaceTemp == null ? null : Number(item.pmSurfaceTemp),
            humidity: item.pmHumidity === "" || item.pmHumidity == null ? null : Number(item.pmHumidity),
            dewIndex: calculateLocalDewIndex(item.pmAirTemp, item.pmSurfaceTemp, item.pmHumidity)
          }
        });`;

content = content.replace(oldRecordsPush, newRecordsPush);

fs.writeFileSync('src/data.ts', content);
console.log("Patched data.ts");
