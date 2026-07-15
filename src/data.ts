import { DailyRecord } from './types';

// Helper to determine Dew Point Condensation Index status and styles
export interface CondensationStatus {
  label: '안전' | '주의' | '위험';
  bgColor: string;       // Tailwind background class
  bgHex: string;         // Hex code for charts
  textColor: string;     // Tailwind text class
  textHex: string;       // Hex code for chart texts
  borderColor: string;   // Tailwind border class
  description: string;
}

export function getCondensationStatus(val: number): CondensationStatus {
  if (val <= 60) {
    return {
      label: '안전',
      bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      bgHex: '#10b981', // emerald-500
      textColor: 'text-emerald-700',
      textHex: '#047857', // emerald-700
      borderColor: 'border-emerald-200',
      description: '결로 위험이 매우 낮으며 코일 표면이 건조하고 안전한 상태입니다.'
    };
  } else if (val <= 80) {
    return {
      label: '주의',
      bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
      bgHex: '#f59e0b', // amber-500
      textColor: 'text-amber-700',
      textHex: '#b45309', // amber-700
      borderColor: 'border-amber-200',
      description: '온습도 차이로 인해 결로가 발생할 가능성이 있으므로 송풍기 가동을 권장합니다.'
    };
  } else {
    return {
      label: '위험',
      bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
      bgHex: '#ef4444', // rose-500
      textColor: 'text-rose-700',
      textHex: '#be123c', // rose-700
      borderColor: 'border-rose-200',
      description: '결로 발생 특이점 도달! 즉각적인 제습기 가동 및 온도 조절 조치가 필요합니다.'
    };
  }
}

export async function fetchSpreadsheetData(sheetName: string, year: number, month: number): Promise<DailyRecord[]> {
  const url = `https://script.google.com/macros/s/AKfycbwGRuza0OfCDR-sQA3l3yu_aCAIdJPtKWobL8PwGVOsRDGYCW3O-EGo5oNSeGJKILtU4g/exec?sheetName=${sheetName}&t=${new Date().getTime()}`;
  
  try {
    const response = await fetch(url);
    const rawData = await response.json();
    
    const records: DailyRecord[] = [];
    
    for (const item of rawData) {
      if (!item.date || !item.amAirTemp) continue; // Skip empty or invalid rows

      const dateObj = new Date(item.date);
      const itemYear = dateObj.getFullYear();
      const itemMonth = dateObj.getMonth() + 1;
      const itemDay = dateObj.getDate();

      if (itemYear === year && itemMonth === month) {
        records.push({
          day: itemDay,
          am: {
            airTemp: Number(item.amAirTemp),
            surfaceTemp: Number(item.amSurfaceTemp),
            humidity: Number(item.amHumidity),
            dewIndex: Number(item.amCondIndex)
          },
          pm: {
            airTemp: Number(item.pmAirTemp),
            surfaceTemp: Number(item.pmSurfaceTemp),
            humidity: Number(item.pmHumidity),
            dewIndex: Number(item.pmCondIndex)
          }
        });
      }
    }
    
    return records.sort((a, b) => a.day - b.day);
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Generate deterministic realistic factory data for 31 days
export function getMonthlyMockData(factory: '평택포승공장' | '아산인주공장' = '평택포승공장', year: number = 2026, month: number = 7): DailyRecord[] {
  const data: DailyRecord[] = [];

  // Deterministic "random" helper to keep it consistent
  // Use different seed offset for different factories and months so data looks different
  const seedOffset = (factory === '아산인주공장' ? 100 : 0) + (year * 12 + month);

  
  const seedRandom = (day: number) => {
    const x = Math.sin(day + seedOffset) * 10000;
    return x - Math.floor(x);
  };

  const daysInMonth = new Date(year, month, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const rand1 = seedRandom(d * 1.1);
    const rand2 = seedRandom(d * 1.2);
    const rand3 = seedRandom(d * 1.3);

    // Air Temperature trends: Summer July, base is around 22°C AM, 30°C PM
    const amAirTemp = Math.round((21 + rand1 * 4) * 10) / 10; // 21.0 to 25.0
    const pmAirTemp = Math.round((28 + rand2 * 5) * 10) / 10; // 28.0 to 33.0

    // Surface Temperature: lags behind, heats up slower, so slightly cooler in PM, slightly warmer in AM sometimes
    // AM surface temp is typically a bit cooler than air temp because metal cools down overnight
    const amSurfaceTemp = Math.round((amAirTemp - 1.2 - rand3 * 1.5) * 10) / 10; // 1.2 to 2.7 degrees lower
    const pmSurfaceTemp = Math.round((pmAirTemp - 2.0 - rand1 * 2.0) * 10) / 10; // 2.0 to 4.0 degrees lower

    // Humidity trends: high in AM (cooling down makes RH higher), lower in PM (heating makes RH lower)
    // Base AM humidity: 65% - 88%, PM: 40% - 68%
    const amHumidity = Math.round(65 + rand2 * 23);
    const pmHumidity = Math.round(40 + rand3 * 28);

    // Condensation index (결로지수) logic:
    // Condensation happens when surface temp is close to dew point. 
    // Dew point is higher when air temperature is high and humidity is extremely high.
    // Let's model it: Index increases when Relative Humidity is high AND Surface Temp is lower than Air Temp.
    // Also, we explicitly create several "Safe", "Warning", and "Danger" days to demonstrate conditional formatting clearly.
    
    let amDewIndex = 0;
    let pmDewIndex = 0;

    // Specific high risk or medium risk days for demonstration:
    if (d === 3 || d === 13 || d === 24) {
      // Extremely high risk days (Rainy days / humid days where steel is cold)
      amDewIndex = Math.round(82 + rand1 * 12); // 82 to 94 (위험)
      pmDewIndex = Math.round(75 + rand2 * 14); // 75 to 89 (주의 ~ 위험)
    } else if (d === 5 || d === 8 || d === 15 || d === 20 || d === 28) {
      // Moderate warning days
      amDewIndex = Math.round(62 + rand1 * 12); // 62 to 74 (주의)
      pmDewIndex = Math.round(55 + rand2 * 15); // 55 to 70 (안전 ~ 주의)
    } else {
      // Standard safe summer days
      amDewIndex = Math.round(30 + rand1 * 25); // 30 to 55 (안전)
      pmDewIndex = Math.round(25 + rand2 * 25); // 25 to 50 (안전)
    }

    // Clip indexes to [0, 100]
    amDewIndex = Math.max(0, Math.min(100, amDewIndex));
    pmDewIndex = Math.max(0, Math.min(100, pmDewIndex));

    data.push({
      day: d,
      am: {
        airTemp: amAirTemp,
        surfaceTemp: amSurfaceTemp,
        humidity: amHumidity,
        dewIndex: amDewIndex
      },
      pm: {
        airTemp: pmAirTemp,
        surfaceTemp: pmSurfaceTemp,
        humidity: pmHumidity,
        dewIndex: pmDewIndex
      }
    });
  }

  return data;
}
