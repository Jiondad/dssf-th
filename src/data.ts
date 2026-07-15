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
  const url = `https://script.google.com/macros/s/AKfycbwGRuza0OfCDR-sQA3l3yu_aCAIdJPtKWobL8PwGVOsRDGYCW3O-EGo5oNSeGJKILtU4g/exec?sheetName=${sheetName}&factory=${sheetName === 'Data2' ? '아산인주공장' : '평택포승공장'}&t=${new Date().getTime()}`;
  
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
        });
      }
    }
    
    return records.sort((a, b) => a.day - b.day);
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

