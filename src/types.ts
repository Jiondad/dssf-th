export interface SensorData {
  airTemp: number;     // 대기온도 (°C)
  surfaceTemp: number; // 코일표면온도 (°C)
  humidity: number;    // 상대습도 (%)
  dewIndex: number;    // 결로지수 (0 ~ 100)
}

export interface DailyRecord {
  day: number;         // 1일 ~ 31일
  am: SensorData;      // 오전 데이터
  pm: SensorData;      // 오후 데이터
}

export type SensorKey = 'airTemp' | 'surfaceTemp' | 'humidity' | 'dewIndex';
