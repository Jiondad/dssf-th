import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  Thermometer, 
  Layers, 
  Droplets, 
  AlertTriangle, 
  Calendar, 
  Play, 
  Pause, 
  RotateCcw,
  FileSpreadsheet, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp,
  ArrowRight,
  TrendingDown,
  Gauge,
  Plus,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Factory,
  ChevronDown
, Printer } from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { fetchSpreadsheetData, getCondensationStatus, CondensationStatus } from "./data";
import { DailyRecord, SensorKey } from "./types";

// --- Custom Dew Index Colors & Dots ---
const getDewColor = (value: number) => {
  if (value <= 60) return '#10b981'; // Safe (Green)
  if (value <= 80) return '#f59e0b'; // Caution (Orange)
  return '#ef4444'; // Danger (Red)
};

const CustomDewDot = (props: any) => {
  const { cx, cy, value } = props;
  if (!cx || !cy || value === undefined) return null;
  const color = getDewColor(value);


  return (
    <circle cx={cx} cy={cy} r={4} fill={color} stroke="#fff" strokeWidth={1} />
  );
};

const CustomDewActiveDot = (props: any) => {
  const { cx, cy, value } = props;
  if (!cx || !cy || value === undefined) return null;
  const color = getDewColor(value);
  return (
    <circle cx={cx} cy={cy} r={8} fill={color} stroke="#fff" strokeWidth={2} style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' }} />
  );
};

export default function App() {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [selectedFactory, setSelectedFactory] = useState<'평택포승공장' | '아산인주공장'>('평택포승공장');
  const [isFactoryPickerOpen, setIsFactoryPickerOpen] = useState<boolean>(false);

  const [sheetData, setSheetData] = useState<DailyRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    let timer: ReturnType<typeof setInterval>;

    const loadData = async (isBackground = false) => {
      if (!isBackground) {
        setIsLoadingData(true);
      }
      
      try {
        // Determine the simulated sheet name based on the factory
        const sheetName = selectedFactory === '평택포승공장' ? 'Data' : 'Data2';
        
        const newData = await fetchSpreadsheetData(sheetName, selectedYear, selectedMonth);
        
        if (isMounted) {
          setSheetData(newData);
          
          // Ensure selectedDay is within the valid range of the new data
          if (!isBackground) {
            setSelectedDay(prev => {
              const maxDay = newData.length > 0 ? Math.max(...newData.map(d => d.day)) : 1;
              const minDay = newData.length > 0 ? Math.min(...newData.map(d => d.day)) : 1;
              if (prev > maxDay) return maxDay;
              if (prev < minDay) return minDay;
              return prev;
            });
            setIsLoadingData(false);
          }
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        if (isMounted && !isBackground) {
          setIsLoadingData(false);
        }
      }
    };
    
    // Initial load
    loadData();
    
    // Auto-polling every 10 minutes (600,000 ms)
    timer = setInterval(() => {
      loadData(true); // silent background load
    }, 600000);
    
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [selectedYear, selectedMonth, selectedFactory]);

  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeAmPm, setActiveAmPm] = useState<'am' | 'pm'>('am'); // For mobile toggle details
  
  // New Data Entry States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalFactory, setModalFactory] = useState<'평택포승공장' | '아산인주공장'>('평택포승공장');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
    amAirTemp: "23.5",
    amSurfaceTemp: "21.2",
    amHumidity: "72",
    pmAirTemp: "31.2",
    pmSurfaceTemp: "28.5",
    pmHumidity: "48",
  });

  const handleDateChange = (dateVal: string) => {
    setFormData(prev => {
      const updated = { ...prev, date: dateVal };
      const dateObj = new Date(dateVal);
      // Adjust timezone offset to get the correct date day safely
      const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(dateObj.getTime() + userTimezoneOffset);
      const day = adjustedDate.getDate();
      const existing = sheetData.find(r => r.day === day);
      if (existing) {
        return {
          ...updated,
          amAirTemp: existing.am.airTemp !== null ? existing.am.airTemp.toString() : "",
          amSurfaceTemp: existing.am.surfaceTemp !== null ? existing.am.surfaceTemp.toString() : "",
          amHumidity: existing.am.humidity !== null ? existing.am.humidity.toString() : "",
          pmAirTemp: existing.pm.airTemp !== null ? existing.pm.airTemp.toString() : "",
          pmSurfaceTemp: existing.pm.surfaceTemp !== null ? existing.pm.surfaceTemp.toString() : "",
          pmHumidity: existing.pm.humidity !== null ? existing.pm.humidity.toString() : "",
         };
      }
      return updated;
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      const calculateLocalDewIndex = (air: any, surf: any, hum: any) => {
        if (air === null || surf === null || hum === null || air === "" || surf === "" || hum === "" || isNaN(Number(air)) || isNaN(Number(surf)) || isNaN(Number(hum)) || air === undefined || surf === undefined || hum === undefined) return null;
        const dewPoint = air - ((100 - hum) / 5);
        const diff = surf - dewPoint;
        if (diff <= 0) return 95;
        if (diff >= 6) return Math.max(15, Math.round(35 - (diff - 6) * 4));
        return Math.max(0, Math.min(100, Math.round(95 - (diff * 10))));
      };

      const amAirTemp = formData.amAirTemp === "" ? null : Number(formData.amAirTemp);
      const amSurfaceTemp = formData.amSurfaceTemp === "" ? null : Number(formData.amSurfaceTemp);
      const amHumidity = formData.amHumidity === "" ? null : Number(formData.amHumidity);
      const pmAirTemp = formData.pmAirTemp === "" ? null : Number(formData.pmAirTemp);
      const pmSurfaceTemp = formData.pmSurfaceTemp === "" ? null : Number(formData.pmSurfaceTemp);
      const pmHumidity = formData.pmHumidity === "" ? null : Number(formData.pmHumidity);

      const payload = {
        sheetName: modalFactory === '평택포승공장' ? 'Data' : 'Data2',
        factory: modalFactory,
        date: formData.date,
        amAirTemp,
        amSurfaceTemp,
        amHumidity,
        amCondIndex: calculateLocalDewIndex(amAirTemp, amSurfaceTemp, amHumidity),
        pmAirTemp,
        pmSurfaceTemp,
        pmHumidity,
        pmCondIndex: calculateLocalDewIndex(pmAirTemp, pmSurfaceTemp, pmHumidity)
      };

      const dateObj = new Date(formData.date);
      const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(dateObj.getTime() + userTimezoneOffset);
      const parsedDay = adjustedDate.getDate();

      // Optimistic Update
      if (modalFactory === selectedFactory && adjustedDate.getFullYear() === selectedYear && (adjustedDate.getMonth() + 1) === selectedMonth) {
        setSheetData(prev => {
          const newData = [...prev];
          const existingIdx = newData.findIndex(r => r.day === parsedDay);
          const updatedRecord = {
            day: parsedDay,
            am: {
              airTemp: payload.amAirTemp,
              surfaceTemp: payload.amSurfaceTemp,
              humidity: payload.amHumidity,
              dewIndex: payload.amCondIndex
            },
            pm: {
              airTemp: payload.pmAirTemp,
              surfaceTemp: payload.pmSurfaceTemp,
              humidity: payload.pmHumidity,
              dewIndex: payload.pmCondIndex
            }
          };
          
          if (existingIdx !== -1) {
            newData[existingIdx] = updatedRecord;
          } else {
            newData.push(updatedRecord);
            newData.sort((a, b) => a.day - b.day);
          }
          return newData;
        });
        setSelectedDay(parsedDay);
      }

      // POST to Google Apps Script API
      await fetch("https://script.google.com/macros/s/AKfycbwGRuza0OfCDR-sQA3l3yu_aCAIdJPtKWobL8PwGVOsRDGYCW3O-EGo5oNSeGJKILtU4g/exec", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      alert("데이터가 성공적으로 등록되었습니다.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("데이터 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
      // Data Refetch for 100% Sync
      setIsLoadingData(true);
      try {
        const sheetName = selectedFactory === '평택포승공장' ? 'Data' : 'Data2';
        const newData = await fetchSpreadsheetData(sheetName, selectedYear, selectedMonth);
        setSheetData(newData);
      } catch (err) {
        console.error("Failed to refetch data:", err);
      }
      setIsLoadingData(false);
    }
  };
  
  // Custom Line Visibility state for Recharts
  const [visibleLines, setVisibleLines] = useState<Record<string, boolean>>({
    '오전 대기온도': true,
    '오후 대기온도': true,
    '오전 표면온도': true,
    '오후 표면온도': true,
    '오전 상대습도': false,
    '오후 상대습도': false,
    '오전 결로지수': true,
    '오후 결로지수': true,
  });

  // Fixed array of 1 to 31 days
  const fixedDays = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

  // Flat data for Recharts
  const chartData = useMemo(() => {
    return fixedDays.map(day => {
      const record = sheetData.find(r => r.day === day);
      if (!record) {
        return {
          name: `${day}일`,
          day: day,
          '오전 대기온도': null,
          '오후 대기온도': null,
          '오전 표면온도': null,
          '오후 표면온도': null,
          '오전 상대습도': null,
          '오후 상대습도': null,
          '오전 결로지수': null,
          '오후 결로지수': null,
        };
      }
      return {
        name: `${record.day}일`,
        day: record.day,
        '오전 대기온도': record.am.airTemp,
        '오후 대기온도': record.pm.airTemp,
        '오전 표면온도': record.am.surfaceTemp,
        '오후 표면온도': record.pm.surfaceTemp,
        '오전 상대습도': record.am.humidity,
        '오후 상대습도': record.pm.humidity,
        '오전 결로지수': record.am.dewIndex,
        '오후 결로지수': record.pm.dewIndex,
      };
    });
  }, [sheetData, fixedDays]);

  const dewOffsets = useMemo(() => {
    let amDewMin = 100, amDewMax = 0;
    let pmDewMin = 100, pmDewMax = 0;
    chartData.forEach(d => {
      const am = d['오전 결로지수'];
      const pm = d['오후 결로지수'];
      if (am !== null) {
        if (am < amDewMin) amDewMin = am;
        if (am > amDewMax) amDewMax = am;
      }
      if (pm !== null) {
        if (pm < pmDewMin) pmDewMin = pm;
        if (pm > pmDewMax) pmDewMax = pm;
      }
    });
    
    if (amDewMin >= amDewMax) { amDewMin = 0; amDewMax = 100; }
    if (pmDewMin >= pmDewMax) { pmDewMin = 0; pmDewMax = 100; }

    const getOffset = (val, min, max) => {
      return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
    };

    return {
      am60: getOffset(60, amDewMin, amDewMax),
      am80: getOffset(80, amDewMin, amDewMax),
      pm60: getOffset(60, pmDewMin, pmDewMax),
      pm80: getOffset(80, pmDewMin, pmDewMax),
    };
  }, [chartData]);


  // Current record details based on selected day
  const currentRecord = useMemo(() => {
    const found = sheetData.find(r => r.day === selectedDay);
    if (found) return found;
    return {
      day: selectedDay,
      am: { airTemp: null, surfaceTemp: null, humidity: null, dewIndex: null },
      pm: { airTemp: null, surfaceTemp: null, humidity: null, dewIndex: null }
    };
  }, [selectedDay, sheetData]);

  // Max condensation index of the selected day to determine card safety level
  const maxDewIndexToday = useMemo(() => {
    if (!currentRecord) return 0;
    if (currentRecord.am.dewIndex === null && currentRecord.pm.dewIndex === null) return 0;
    if (currentRecord.am.dewIndex === null) return currentRecord.pm.dewIndex;
    if (currentRecord.pm.dewIndex === null) return currentRecord.am.dewIndex;
    return Math.max(currentRecord.am.dewIndex, currentRecord.pm.dewIndex);
  }, [currentRecord]);

  const condensationStatus = useMemo(() => {
    return getCondensationStatus(maxDewIndexToday);
  }, [maxDewIndexToday]);

  // Simulation playhead
  useEffect(() => {
    let intervalId: any;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setSelectedDay(prev => {
          if (prev >= 31) return 1;
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying]);

  // Toggle visibility of a line
  const toggleLine = (lineName: string) => {
    setVisibleLines(prev => ({
      ...prev,
      [lineName]: !prev[lineName]
    }));
  };

  // Helper to quickly select/deselect all lines
  const setAllLines = (visible: boolean) => {
    setVisibleLines(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        updated[key] = visible;
      });
      return updated;
    });
  };

  // Safe status summary counts for the month
  const monthlyStats = useMemo(() => {
    let safeCount = 0;
    let cautionCount = 0;
    let dangerCount = 0;

    sheetData.forEach(r => {
      if (r.am.dewIndex === null && r.pm.dewIndex === null) return;
      const amDew = r.am.dewIndex !== null ? r.am.dewIndex : -1;
      const pmDew = r.pm.dewIndex !== null ? r.pm.dewIndex : -1;
      const maxIndex = Math.max(amDew, pmDew);
      if (maxIndex < 0) return;
      if (maxIndex <= 60) safeCount++;
      else if (maxIndex <= 80) cautionCount++;
      else dangerCount++;
    });

    return { safeCount, cautionCount, dangerCount };
  }, [sheetData]);

  const renderTable = (daysToRender: number[], isPrint: boolean) => (
                <table className={`w-full text-center border-collapse table-fixed ${isPrint ? "text-[11px] print-table-a4" : "text-[10px] xl:text-xs min-w-[800px]"}`}>
              <thead>
                <tr className="bg-slate-900 text-white font-sans text-center">
                  <th className="sticky left-0 bg-slate-900 border border-slate-700 p-1 xl:p-1.5 z-20 font-bold w-[35px] xl:w-[45px] break-keep">구분</th>
                  <th className="sticky left-[35px] xl:left-[45px] bg-slate-900 border border-slate-700 p-1 xl:p-1.5 z-20 font-bold w-[95px] xl:w-[125px] print:w-[115px] whitespace-nowrap">측정 항목</th>
                  {daysToRender.map((day) => (
                    <th 
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`border border-slate-700 p-1 xl:p-1.5 font-bold font-mono cursor-pointer transition-all hover:bg-blue-800 ${
                        day === selectedDay ? "bg-blue-600 text-white" : "bg-slate-800/85"
                      }`}
                      title={`${day}일 정밀조회`}
                    >
                      {day}일
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* 1. 오전 Group */}
                
                {/* 대기온도 */}
                <tr className="hover:bg-slate-50 transition-colors text-center">
                  <td className="sticky left-0 bg-slate-100 font-bold border border-slate-200 p-1 xl:p-1.5 text-slate-700 z-10 text-center shadow-xs" rowSpan={4}>
                    오전<br/><span className="text-[10px] font-mono text-slate-500 font-normal">(AM)</span>
                  </td>
                  <td className="sticky left-[35px] xl:left-[45px] bg-slate-50 border border-slate-200 p-1 xl:p-1.5 font-semibold text-slate-700 text-left z-10 shadow-xs whitespace-nowrap">
                    대기온도 (℃)
                  </td>
                  {daysToRender.map((day) => {
                    const item = sheetData.find(r => r.day === day);
                    return (
                    <td 
                      key={day} 
                      onClick={() => setSelectedDay(day)}
                      className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-colors ${
                        day === selectedDay ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
                      }`}
                    >
                      {item ? item.am.airTemp !== null ? item.am.airTemp.toFixed(1) : '-' : '-'}
                    </td>
                  )
})}
                </tr>

                {/* 표면온도 */}
                <tr className="hover:bg-slate-50 transition-colors text-center">
                  <td className="sticky left-[35px] xl:left-[45px] bg-slate-50 border border-slate-200 p-1 xl:p-1.5 font-semibold text-slate-700 text-left z-10 shadow-xs whitespace-nowrap">
                    코일표면온도 (℃)
                  </td>
                  {daysToRender.map((day) => {
                    const item = sheetData.find(r => r.day === day);
                    return (
                    <td 
                      key={day} 
                      onClick={() => setSelectedDay(day)}
                      className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-colors ${
                        day === selectedDay ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
                      }`}
                    >
                      {item ? item.am.surfaceTemp !== null ? item.am.surfaceTemp.toFixed(1) : '-' : '-'}
                    </td>
                  )
})}
                </tr>

                {/* 상대습도 */}
                <tr className="hover:bg-slate-50 transition-colors text-center">
                  <td className="sticky left-[35px] xl:left-[45px] bg-slate-50 border border-slate-200 p-1 xl:p-1.5 font-semibold text-slate-700 text-left z-10 shadow-xs whitespace-nowrap">
                    상대습도 (%)
                  </td>
                  {daysToRender.map((day) => {
                    const item = sheetData.find(r => r.day === day);
                    return (
                    <td 
                      key={day} 
                      onClick={() => setSelectedDay(day)}
                      className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-colors ${
                        day === selectedDay ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
                      }`}
                    >
                      {item ? (item.am.humidity !== null ? item.am.humidity : '-') : '-'}
                    </td>
                  )
})}
                </tr>

                {/* 결로지수 */}
                <tr className="hover:bg-slate-50 transition-colors text-center">
                  <td className="sticky left-[35px] xl:left-[45px] bg-slate-50 border border-slate-200 p-1 xl:p-1.5 font-bold text-slate-800 text-left z-10 shadow-xs whitespace-nowrap">
                    결로지수 (Pt)
                  </td>
                  {daysToRender.map((day) => {
                    const item = sheetData.find(r => r.day === day);
                    if (!item) {
                      return (
                        <td key={day} onClick={() => setSelectedDay(day)} className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-all ${day === selectedDay ? "ring-2 ring-blue-500 ring-offset-1 z-10" : ""}`}>
                          -
                        </td>
                      );
                    }
                    const indexVal = item.am.dewIndex;
                    if (indexVal === null || indexVal === undefined || indexVal === "") {
                      return (
                        <td key={day} onClick={() => setSelectedDay(day)} className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-all ${day === selectedDay ? "ring-2 ring-blue-500 ring-offset-1 z-10" : ""}`}>
                          -
                        </td>
                      );
                    }
                    let cellColor = "bg-[#d1fae5] text-[#065f46]"; // Safe
                    if (indexVal > 80) cellColor = "bg-[#ffe4e6] text-[#9f1239] font-black animate-pulse"; // Danger
                    else if (indexVal > 60) cellColor = "bg-[#fef3c7] text-[#92400e] font-bold"; // Caution
                    return (
                      <td 
                        key={day} 
                        onClick={() => setSelectedDay(day)}
                        className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer font-semibold transition-all hover:opacity-80 ${cellColor} ${
                          day === selectedDay ? "ring-2 ring-blue-500 ring-offset-1 z-10" : ""
                        }`}
                        title={`${day}일 오전 결로지수: ${indexVal} Pt`}
                      >
                        {indexVal}
                      </td>
                    );
                  })}
                </tr>


                {/* Separator row */}
                <tr className="bg-slate-200 text-center h-2">
                  <td className="sticky left-0 bg-slate-200 p-0" colSpan={1}></td>
                  <td className="sticky left-[35px] xl:left-[45px] bg-slate-200 p-0" colSpan={1}></td>
                  <td colSpan={daysToRender.length} className="p-0"></td>
                </tr>


                {/* 2. 오후 Group */}
                
                {/* 대기온도 */}
                <tr className="hover:bg-slate-50 transition-colors text-center">
                  <td className="sticky left-0 bg-slate-100 font-bold border border-slate-200 p-1 xl:p-1.5 text-slate-700 z-10 text-center shadow-xs" rowSpan={4}>
                    오후<br/><span className="text-[10px] font-mono text-slate-500 font-normal">(PM)</span>
                  </td>
                  <td className="sticky left-[35px] xl:left-[45px] bg-slate-50 border border-slate-200 p-1 xl:p-1.5 font-semibold text-slate-700 text-left z-10 shadow-xs whitespace-nowrap">
                    대기온도 (℃)
                  </td>
                  {daysToRender.map((day) => {
                    const item = sheetData.find(r => r.day === day);
                    return (
                    <td 
                      key={day} 
                      onClick={() => setSelectedDay(day)}
                      className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-colors ${
                        day === selectedDay ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
                      }`}
                    >
                      {item ? item.pm.airTemp !== null ? item.pm.airTemp.toFixed(1) : '-' : '-'}
                    </td>
                  )
})}
                </tr>

                {/* 표면온도 */}
                <tr className="hover:bg-slate-50 transition-colors text-center">
                  <td className="sticky left-[35px] xl:left-[45px] bg-slate-50 border border-slate-200 p-1 xl:p-1.5 font-semibold text-slate-700 text-left z-10 shadow-xs whitespace-nowrap">
                    코일표면온도 (℃)
                  </td>
                  {daysToRender.map((day) => {
                    const item = sheetData.find(r => r.day === day);
                    return (
                    <td 
                      key={day} 
                      onClick={() => setSelectedDay(day)}
                      className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-colors ${
                        day === selectedDay ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
                      }`}
                    >
                      {item ? item.pm.surfaceTemp !== null ? item.pm.surfaceTemp.toFixed(1) : '-' : '-'}
                    </td>
                  )
})}
                </tr>

                {/* 상대습도 */}
                <tr className="hover:bg-slate-50 transition-colors text-center">
                  <td className="sticky left-[35px] xl:left-[45px] bg-slate-50 border border-slate-200 p-1 xl:p-1.5 font-semibold text-slate-700 text-left z-10 shadow-xs whitespace-nowrap">
                    상대습도 (%)
                  </td>
                  {daysToRender.map((day) => {
                    const item = sheetData.find(r => r.day === day);
                    return (
                    <td 
                      key={day} 
                      onClick={() => setSelectedDay(day)}
                      className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-colors ${
                        day === selectedDay ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
                      }`}
                    >
                      {item ? (item.pm.humidity !== null ? item.pm.humidity : '-') : '-'}
                    </td>
                  )
})}
                </tr>

                {/* 결로지수 */}
                <tr className="hover:bg-slate-50 transition-colors text-center">
                  <td className="sticky left-[35px] xl:left-[45px] bg-slate-50 border border-slate-200 p-1 xl:p-1.5 font-bold text-slate-800 text-left z-10 shadow-xs whitespace-nowrap">
                    결로지수 (Pt)
                  </td>
                  {daysToRender.map((day) => {
                    const item = sheetData.find(r => r.day === day);
                    if (!item) {
                      return (
                        <td key={day} onClick={() => setSelectedDay(day)} className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-all ${day === selectedDay ? "ring-2 ring-blue-500 ring-offset-1 z-10" : ""}`}>
                          -
                        </td>
                      );
                    }
                    const indexVal = item.pm.dewIndex;
                    if (indexVal === null || indexVal === undefined || indexVal === "") {
                      return (
                        <td key={day} onClick={() => setSelectedDay(day)} className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-all ${day === selectedDay ? "ring-2 ring-blue-500 ring-offset-1 z-10" : ""}`}>
                          -
                        </td>
                      );
                    }
                    let cellColor = "bg-[#d1fae5] text-[#065f46]"; // Safe
                    if (indexVal > 80) cellColor = "bg-[#ffe4e6] text-[#9f1239] font-black animate-pulse"; // Danger
                    else if (indexVal > 60) cellColor = "bg-[#fef3c7] text-[#92400e] font-bold"; // Caution
                    return (
                      <td 
                        key={day} 
                        onClick={() => setSelectedDay(day)}
                        className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer font-semibold transition-all hover:opacity-80 ${cellColor} ${
                          day === selectedDay ? "ring-2 ring-blue-500 ring-offset-1 z-10" : ""
                        }`}
                        title={`${day}일 오후 결로지수: ${indexVal} Pt`}
                      >
                        {indexVal}
                      </td>
                    );
                  })}
                </tr>

              </tbody>
            </table>
  );
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-12 print:bg-white print:pb-0 print:min-h-0" id="app_root">
            <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 5mm 8mm;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
          }
          .print\:hidden {
            display: none !important;
          }
          .print-container {
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
            height: 100vh !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          table {
            width: 100% !important;
            table-layout: fixed !important;
          }
          .print-table-a4 th, .print-table-a4 td {
            padding: 2px 1px !important;
            font-size: 10px !important;
          }
        }
      `}</style>
      
            {/* Print Only View */}
      <div className="hidden print:flex print:flex-col print-container h-screen py-2">
        <h2 className="text-[22px] font-bold text-center text-slate-900 tracking-tight mt-[50px]">{selectedMonth}월 온습도 및 결로지수 대장 - {selectedFactory}</h2>
        
        <div className="mt-[70px]">
          {renderTable(fixedDays.slice(0, 16), true)}
        </div>
        <div className="pt-3">
          {renderTable(fixedDays.slice(16, 31), true)}
        </div>
        
        {/* Print Layout: Condensation Formula and Status */}
        <div className="mt-auto pt-4 pb-2 border-t border-slate-200">
          <h4 className="font-bold text-[13px] mb-2 text-slate-800">결로지수 산출 및 환산 원리</h4>
          <div className="grid grid-cols-3 gap-3 text-[11px]">
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex flex-col justify-center">
              <p className="font-bold text-slate-700 mb-1">1단계 (이슬점 약식 계산)</p>
              <p className="font-mono text-[10.5px] text-slate-600 bg-white p-1 rounded border border-slate-100">이슬점 ≈ 대기온도 - ((100 - 상대습도) / 5)</p>
            </div>
            {/* Step 2 */}
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex flex-col justify-center">
              <p className="font-bold text-slate-700 mb-1">2단계 (마진 산출)</p>
              <p className="font-mono text-[10.5px] text-slate-600 bg-white p-1 rounded border border-slate-100">Margin = 코일표면온도 - 이슬점</p>
            </div>
            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
              <p className="font-bold text-slate-700 mb-1.5">3단계 (지수 환산 기준)</p>
              <ul className="space-y-1 text-[10px] text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 
                  <span className="font-semibold text-emerald-700">0~60 (안전)</span> 
                  <span className="ml-auto">Margin &gt; 5℃</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> 
                  <span className="font-semibold text-amber-700">61~80 (주의)</span> 
                  <span className="ml-auto">0 &lt; Margin ≤ 5℃</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> 
                  <span className="font-semibold text-rose-700">81~100 (위험)</span> 
                  <span className="ml-auto">Margin ≤ 0℃</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Top Professional Header */}
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 print:hidden" id="header_section">
        <div className="max-w-[1920px] mx-auto px-4 py-2.5 md:py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-inner flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-sans">
                대성스틸 결로 방지 모니터링
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 font-mono">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                DAESUNG STEEL Smart Factory • Environment Control Room
              </p>
            </div>
          </div>
          
          {/* Quick Info & Sim Controls */}
          <div className="flex items-center gap-3 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50">
            
            {/* Factory Selector */}
            <div className="relative z-50 mr-2 pr-4 border-r border-slate-700">
              <span className="text-[10px] text-slate-400 block font-mono mb-0.5">공장구분</span>
              <button 
                onClick={() => setIsFactoryPickerOpen(!isFactoryPickerOpen)}
                className="flex items-center gap-1.5 hover:bg-slate-700 p-1 -ml-1 rounded-md transition-colors"
                title="공장 변경"
              >
                <Factory className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-slate-200">{selectedFactory}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {isFactoryPickerOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setIsFactoryPickerOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden origin-top-left text-slate-900 z-50"
                    >
                      <div className="p-1.5 flex flex-col gap-1">
                        {['평택포승공장', '아산인주공장'].map(factory => (
                          <button
                            key={factory}
                            onClick={() => {
                              setSelectedFactory(factory as any);
                              setIsFactoryPickerOpen(false);
                            }}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                              selectedFactory === factory
                                ? "bg-emerald-50 text-emerald-700"
                                : "text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <Factory className={`w-4 h-4 ${selectedFactory === factory ? 'text-emerald-500' : 'text-slate-400'}`} />
                            {factory}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Date Picker & Panel */}
            <div className="text-right flex flex-col items-end">
              <span className="text-[10px] text-slate-400 block font-mono">SIMULATION PANEL</span>
              
              <div className="relative z-50 flex items-center gap-1">
                <button 
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="flex items-center gap-1.5 hover:bg-slate-700 p-1 -ml-1 rounded-md transition-colors"
                  title="연/월 변경"
                >
                  <span className="text-sm font-bold text-blue-300">{selectedYear}년 {selectedMonth}월</span>
                  <Calendar className="w-3.5 h-3.5 text-blue-400/80" />
                </button>
                <span className="text-sm font-semibold text-slate-200">{selectedDay}일 모니터링 중</span>

                <AnimatePresence>
                  {isDatePickerOpen && (
                    <>
                      {/* Invisible overlay for closing */}
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDatePickerOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden origin-top-right text-slate-900 z-50"
                      >
                        <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedYear(y => y - 1); }}
                          className="p-1.5 hover:bg-slate-200 rounded-md text-slate-600 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-slate-800 text-sm">{selectedYear}년</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedYear(y => y + 1); }}
                          className="p-1.5 hover:bg-slate-200 rounded-md text-slate-600 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-3 grid grid-cols-4 gap-1.5">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <button
                            key={month}
                            onClick={() => {
                              setSelectedMonth(month);
                              setIsDatePickerOpen(false);
                            }}
                            className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                              selectedMonth === month 
                                ? "bg-blue-600 text-white shadow-md ring-1 ring-blue-600 ring-offset-1"
                                : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                            }`}
                          >
                            {month}월
                          </button>
                        ))}
                      </div>
                    </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex gap-1.5 ml-2 border-l border-slate-700 pl-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                  isPlaying 
                    ? "bg-amber-500 hover:bg-amber-600 text-slate-950" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                title={isPlaying ? "시뮬레이션 일시정지" : "시뮬레이션 재생"}
                id="btn_sim_play"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  const currentToday = new Date();
                  if (selectedYear === currentToday.getFullYear() && selectedMonth === currentToday.getMonth() + 1) {
                    setSelectedDay(currentToday.getDate());
                  } else {
                    setSelectedDay(1);
                  }
                  setIsPlaying(false);
                }}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-all flex items-center justify-center"
                title="기본값으로 리셋"
                id="btn_sim_reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 mt-4 space-y-4 relative print:hidden">
        {isLoadingData ? (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm min-h-[600px] rounded-2xl">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-slate-600 font-semibold text-sm">데이터를 불러오는 중입니다...</p>
            </div>
          </div>
        ) : null}

        {/* 1. 요약 대시보드 카드 뷰 Section */}
        <section className={`transition-opacity duration-300 ${isLoadingData ? 'opacity-30' : 'opacity-100'} print:hidden`} id="summary_cards_section">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
             {/* Cards Section */}
             <div className="xl:col-span-9 flex flex-col gap-3">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                 <div>
                   <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                     <span className="h-4 w-1 bg-blue-600 rounded-full inline-block"></span>
                     실시간 환경 모니터링 현황 ({selectedMonth}월 {selectedDay}일)
                   </h2>
                   <p className="text-[11px] text-slate-500 mt-0.5 print:hidden">선택된 일자의 오전(AM) 및 오후(PM) {selectedFactory} 환경 측정치 요약입니다.</p>
                 </div>
                 {/* Quick Slider */}
                 <div className="w-full sm:w-auto flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                   <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">일자 선택:</span>
                   <input 
                     type="range" min={1} max={31} value={selectedDay}
                     onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                     className="w-24 md:w-32 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                   />
                   <span className="text-[11px] font-bold text-blue-600 font-mono min-w-8 text-center">{selectedDay}일</span>
                 </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                 {/* Card 1: 대기온도 */}
                 <motion.div 
                   layoutId="card_air_temp"
                   className="bg-blue-50/50 rounded-xl border border-blue-100 p-3 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
                   id="card_air_temp"
                 >
                   <div className="flex justify-between items-start mb-2">
                     <div>
                       <span className="text-base font-extrabold tracking-tight text-slate-900 block">대기 온도</span>
                       <h3 className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Air Temperature</h3>
                     </div>
                     <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                       <Thermometer className="w-4 h-4" />
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-2 divide-x divide-slate-100 mt-2">
                     <div className="flex flex-col justify-center">
                       <span className="text-[10px] text-slate-400 font-semibold block uppercase">오전(AM)</span>
                       <div className="flex items-baseline gap-0.5 mt-0.5">
                         <span className="text-lg font-bold font-mono text-slate-800">{currentRecord.am.airTemp !== null ? currentRecord.am.airTemp : "-"}</span>
                         <span className="text-[10px] text-slate-500 font-bold">℃</span>
                       </div>
                     </div>
                     <div className="pl-2 flex flex-col justify-center">
                       <span className="text-[10px] text-slate-400 font-semibold block uppercase">오후(PM)</span>
                       <div className="flex items-baseline gap-0.5 mt-0.5">
                         <span className="text-lg font-bold font-mono text-slate-800">{currentRecord.pm.airTemp !== null ? currentRecord.pm.airTemp : "-"}</span>
                         <span className="text-[10px] text-slate-500 font-bold">℃</span>
                       </div>
                     </div>
                   </div>

                   {/* Technical Indicator */}
                   <div className="mt-2 pt-2 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-500">
                     <span className="flex items-center gap-1 whitespace-nowrap">
                       <TrendingUp className="w-3 h-3 text-blue-500" />
                       일교차: {currentRecord.pm.airTemp !== null && currentRecord.am.airTemp !== null ? Math.round((currentRecord.pm.airTemp - currentRecord.am.airTemp) * 10) / 10 + "℃" : "-"}
                     </span>
                     <span className={`font-mono px-1 py-0.5 rounded whitespace-nowrap ${maxDewIndexToday > 80 ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                       Target: 18~28℃
                     </span>
                   </div>
                 </motion.div>

                 {/* Card 2: 코일표면온도 */}
                 <motion.div 
                   layoutId="card_surface_temp"
                   className="bg-teal-50/50 rounded-xl border border-teal-100 p-3 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
                   id="card_surface_temp"
                 >
                   <div className="flex justify-between items-start mb-2">
                     <div>
                       <span className="text-base font-extrabold tracking-tight text-slate-900 block">코일 표면 온도</span>
                       <h3 className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Surface Temp</h3>
                     </div>
                     <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
                       <Layers className="w-4 h-4" />
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-2 divide-x divide-slate-100 mt-2">
                     <div className="flex flex-col justify-center">
                       <span className="text-[10px] text-slate-400 font-semibold block uppercase">오전(AM)</span>
                       <div className="flex items-baseline gap-0.5 mt-0.5">
                         <span className="text-lg font-bold font-mono text-slate-800">{currentRecord.am.surfaceTemp !== null ? currentRecord.am.surfaceTemp : "-"}</span>
                         <span className="text-[10px] text-slate-500 font-bold">℃</span>
                       </div>
                     </div>
                     <div className="pl-2 flex flex-col justify-center">
                       <span className="text-[10px] text-slate-400 font-semibold block uppercase">오후(PM)</span>
                       <div className="flex items-baseline gap-0.5 mt-0.5">
                         <span className="text-lg font-bold font-mono text-slate-800">{currentRecord.pm.surfaceTemp !== null ? currentRecord.pm.surfaceTemp : "-"}</span>
                         <span className="text-[10px] text-slate-500 font-bold">℃</span>
                       </div>
                     </div>
                   </div>

                   {/* Technical Indicator */}
                   <div className="mt-2 pt-2 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-500">
                     <span className="flex items-center gap-1 whitespace-nowrap">
                       <TrendingDown className="w-3 h-3 text-teal-500" />
                       편차: {currentRecord.am.surfaceTemp !== null && currentRecord.pm.surfaceTemp !== null ? Math.round((currentRecord.pm.surfaceTemp - currentRecord.am.surfaceTemp) * 10) / 10 + "℃" : "-"}
                     </span>
                     <span className="font-mono bg-slate-100 text-slate-600 px-1 py-0.5 rounded whitespace-nowrap">
                       Target: &gt; 대기온도
                     </span>
                   </div>
                 </motion.div>

                 {/* Card 3: 상대습도 */}
                 <motion.div 
                   layoutId="card_humidity"
                   className="bg-violet-50/50 rounded-xl border border-violet-100 p-3 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
                   id="card_humidity"
                 >
                   <div className="flex justify-between items-start mb-2">
                     <div>
                       <span className="text-base font-extrabold tracking-tight text-slate-900 block">상대 습도</span>
                       <h3 className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Relative Humidity</h3>
                     </div>
                     <div className="p-1.5 bg-violet-50 text-violet-600 rounded-lg">
                       <Droplets className="w-4 h-4" />
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-2 divide-x divide-slate-100 mt-2">
                     <div className="flex flex-col justify-center">
                       <span className="text-[10px] text-slate-400 font-semibold block uppercase">오전(AM)</span>
                       <div className="flex items-baseline gap-0.5 mt-0.5">
                         <span className="text-lg font-bold font-mono text-slate-800">{currentRecord.am.humidity !== null ? currentRecord.am.humidity : "-"}</span>
                         <span className="text-[10px] text-slate-500 font-bold">%</span>
                       </div>
                     </div>
                     <div className="pl-2 flex flex-col justify-center">
                       <span className="text-[10px] text-slate-400 font-semibold block uppercase">오후(PM)</span>
                       <div className="flex items-baseline gap-0.5 mt-0.5">
                         <span className="text-lg font-bold font-mono text-slate-800">{currentRecord.pm.humidity !== null ? currentRecord.pm.humidity : "-"}</span>
                         <span className="text-[10px] text-slate-500 font-bold">%</span>
                       </div>
                     </div>
                   </div>

                   {/* Technical Indicator */}
                   <div className="mt-2 pt-2 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-500">
                     <span className="flex items-center gap-1 whitespace-nowrap">
                       <TrendingDown className="w-3 h-3 text-violet-500" />
                       일교차: {currentRecord.am.humidity !== null && currentRecord.pm.humidity !== null ? (currentRecord.am.humidity - currentRecord.pm.humidity) + "%" : "-"}
                     </span>
                     <span className="font-mono bg-indigo-50 text-indigo-600 px-1 py-0.5 rounded font-bold whitespace-nowrap">
                       Target: &lt;65%
                     </span>
                   </div>
                 </motion.div>

                {/* Card 4: 결로지수 */}
                <motion.div 
                  layoutId="card_dew_index"
                  animate={{ backgroundColor: condensationStatus.bgColor.includes('emerald') ? '#d1fae5' : condensationStatus.bgColor.includes('amber') ? '#fef3c7' : '#ef4444' }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-xl border p-3 shadow-xs hover:shadow-md transition-all relative z-10 overflow-visible flex flex-col justify-between ${maxDewIndexToday > 80 ? 'border-red-600 bg-red-500 text-white' : condensationStatus.borderColor}`}
                  style={maxDewIndexToday > 80 ? { animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite' } : undefined}
                  id="card_dew_index"
                >
                   <div>
                     <div className="flex justify-between items-start mb-2">
                       <div>
                         <span className={`text-base font-extrabold tracking-tight block ${maxDewIndexToday > 80 ? 'text-white' : 'text-slate-900'}`}>결로 위험 지수</span>
                         <h3 className={`text-[10px] font-medium uppercase tracking-wide ${maxDewIndexToday > 80 ? 'text-white/80' : 'text-slate-500'}`}>Condensation Index</h3>
                       </div>
                       <div className="relative group p-2 rounded-xl bg-white/80 cursor-help">
                         <AlertTriangle className="w-6 h-6 text-slate-900 transition-transform group-hover:scale-110" />
                    
                         {/* Tooltip Content */}
                         <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-slate-900 text-white p-4 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                           <h4 className="font-bold text-sm mb-3 text-blue-300 border-b border-slate-700 pb-2">결로지수 산출 및 환산 원리</h4>
                           <div className="space-y-3 text-xs">
                             <div>
                               <p className="font-semibold text-slate-300">1단계 (이슬점 약식 계산)</p>
                               <p className="font-mono text-[11px] bg-slate-800 text-slate-200 p-1.5 rounded mt-1 border border-slate-700">T_dew ≈ T_air - ((100 - H) / 5)</p>
                             </div>
                             <div>
                               <p className="font-semibold text-slate-300">2단계 (마진 산출)</p>
                               <p className="font-mono text-[11px] bg-slate-800 text-slate-200 p-1.5 rounded mt-1 border border-slate-700">Margin = T_surface - T_dew</p>
                             </div>
                             <div>
                               <p className="font-semibold text-slate-300 mb-1">3단계 (지수 환산 기준)</p>
                               <ul className="space-y-1.5 text-[11px] bg-slate-800 p-2 rounded border border-slate-700">
                                 <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"></span> <span className="text-emerald-100 font-medium">0~60 (안전)</span> <span className="text-slate-400 ml-auto">Margin &gt; 5℃</span></li>
                                 <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.5)]"></span> <span className="text-amber-100 font-medium">61~80 (주의)</span> <span className="text-slate-400 ml-auto">0 &lt; Margin ≤ 5℃</span></li>
                                 <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_4px_rgba(225,29,72,0.5)]"></span> <span className="text-rose-100 font-medium">81~100 (위험)</span> <span className="text-slate-400 ml-auto">Margin ≤ 0℃</span></li>
                               </ul>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>

                     <div className="grid grid-cols-2 gap-2 divide-x divide-slate-200 mt-2">
                       <div className="flex flex-col justify-center">
                         <span className={`text-[10px] font-semibold block uppercase ${maxDewIndexToday > 80 ? 'text-white/90' : 'text-slate-600'}`}>오전(AM)</span>
                         <div className="flex items-baseline gap-0.5 mt-0.5">
                           <span className={`text-lg font-black font-mono ${maxDewIndexToday > 80 ? 'text-white' : 'text-slate-900'}`}>{currentRecord.am.dewIndex !== null ? currentRecord.am.dewIndex : "-"}</span>
                           <span className={`text-[10px] font-bold ${maxDewIndexToday > 80 ? 'text-white/90' : 'text-slate-600'}`}>Pt</span>
                         </div>
                       </div>
                       <div className="pl-2 flex flex-col justify-center">
                         <span className={`text-[10px] font-semibold block uppercase ${maxDewIndexToday > 80 ? 'text-white/90' : 'text-slate-600'}`}>오후(PM)</span>
                         <div className="flex items-baseline gap-0.5 mt-0.5">
                           <span className={`text-lg font-black font-mono ${maxDewIndexToday > 80 ? 'text-white' : 'text-slate-900'}`}>{currentRecord.pm.dewIndex !== null ? currentRecord.pm.dewIndex : "-"}</span>
                           <span className={`text-[10px] font-bold ${maxDewIndexToday > 80 ? 'text-white/90' : 'text-slate-600'}`}>Pt</span>
                         </div>
                       </div>
                     </div>
                   </div>

                   <div className="mt-2 pt-2 border-t border-slate-200/50 flex justify-between items-center text-[10px]">
                     <span className={`font-bold flex items-center gap-1 whitespace-nowrap ${
                       maxDewIndexToday > 80 
                         ? 'text-white animate-pulse' 
                         : maxDewIndexToday > 60 
                           ? 'text-amber-600 font-extrabold' 
                           : 'text-emerald-600 font-semibold'
                     }`}>
                       {condensationStatus.icon}
                       {maxDewIndexToday > 80 
                         ? '즉시 환기 및 히터 가동 (결로 주의)' 
                         : maxDewIndexToday > 60 
                           ? '통풍 실시 및 온습도 주의 관찰' 
                           : '환기 및 코일 상태 양호 (정상 관리)'}
                     </span>
                     <span className={`font-mono px-1 py-0.5 rounded whitespace-nowrap ${maxDewIndexToday > 80 ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                       Target: &lt;60Pt
                     </span>
                   </div>
                </motion.div>
               </div>
             </div>
             
             {/* Monthly Stats Section */}
             <div className="xl:col-span-3 flex flex-col gap-3">
               <div className="flex items-end justify-between sm:justify-start xl:justify-between h-7">
                 <div className="h-full flex items-center">
                   <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                     <Calendar className="w-4 h-4 text-slate-400" />
                     {selectedMonth}월 종합 지표
                   </h2>
                 </div>
               </div>
               <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs h-[126px] flex flex-col justify-center">
                 <div className="grid grid-cols-3 gap-2 text-center h-full">
                   <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100 flex flex-col items-center justify-center h-full">
                     <span className="text-[10px] text-emerald-800 block font-semibold mb-1">안전 일수</span>
                     <span className="text-sm font-bold text-emerald-600 font-mono">{monthlyStats.safeCount}일</span>
                   </div>
                   <div className="bg-amber-50 rounded-lg p-2 border border-amber-100 flex flex-col items-center justify-center h-full">
                     <span className="text-[10px] text-amber-800 block font-semibold mb-1">주의 일수</span>
                     <span className="text-sm font-bold text-amber-500 font-mono">{monthlyStats.cautionCount}일</span>
                   </div>
                   <div className="bg-rose-50 rounded-lg p-2 border border-rose-100 flex flex-col items-center justify-center h-full">
                     <span className="text-[10px] text-rose-800 block font-semibold mb-1">위험 일수</span>
                     <span className="text-sm font-bold text-rose-600 font-mono">{monthlyStats.dangerCount}일</span>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </section>
        
{/* 2. 월간 그래프 Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-3 md:p-4 shadow-xs print:hidden" id="monthly_chart_section">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-2 border-b border-slate-100 pb-2 mb-2">
            <div className="shrink-0">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="h-4 w-1 bg-blue-600 rounded-full inline-block"></span>
                {selectedMonth}월 분석 그래프
              </h2>
            </div>

            {/* Quick Chart actions & Toggles */}
            <div className="flex flex-wrap items-center gap-1.5 w-full xl:w-auto xl:justify-end">
              <div className="flex flex-wrap items-center gap-1">
                {/* Air Temp toggles */}
                <button 
                  onClick={() => toggleLine('오전 대기온도')}
                  className={`flex items-center gap-1.5 p-1 px-1.5 rounded-md text-[10px] font-medium border transition-all whitespace-nowrap overflow-hidden ${
                    visibleLines['오전 대기온도'] 
                      ? 'bg-white text-slate-900 border-blue-400 shadow-xs' 
                      : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
                  }`}
                  id="toggle_am_air"
                >
                  <span className="w-2 h-1.5 rounded-full bg-[#60a5fa] shrink-0"></span>
                  AM 대기
                </button>
                <button 
                  onClick={() => toggleLine('오후 대기온도')}
                  className={`flex items-center gap-1.5 p-1 px-1.5 rounded-md text-[10px] font-medium border transition-all whitespace-nowrap overflow-hidden ${
                    visibleLines['오후 대기온도'] 
                      ? 'bg-white text-slate-900 border-blue-600 shadow-xs' 
                      : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
                  }`}
                  id="toggle_pm_air"
                >
                  <span className="w-2 h-1.5 rounded-full bg-[#2563eb] shrink-0"></span>
                  PM 대기
                </button>

                {/* Surface Temp toggles */}
                <button 
                  onClick={() => toggleLine('오전 표면온도')}
                  className={`flex items-center gap-1.5 p-1 px-1.5 rounded-md text-[10px] font-medium border transition-all whitespace-nowrap overflow-hidden ${
                    visibleLines['오전 표면온도'] 
                      ? 'bg-white text-slate-900 border-teal-400 shadow-xs' 
                      : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
                  }`}
                  id="toggle_am_surface"
                >
                  <span className="w-2 h-1.5 rounded-full bg-[#2dd4bf] shrink-0"></span>
                  AM 표면
                </button>
                <button 
                  onClick={() => toggleLine('오후 표면온도')}
                  className={`flex items-center gap-1.5 p-1 px-1.5 rounded-md text-[10px] font-medium border transition-all whitespace-nowrap overflow-hidden ${
                    visibleLines['오후 표면온도'] 
                      ? 'bg-white text-slate-900 border-teal-700 shadow-xs' 
                      : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
                  }`}
                  id="toggle_pm_surface"
                >
                  <span className="w-2 h-1.5 rounded-full bg-[#0f766e] shrink-0"></span>
                  PM 표면
                </button>

                {/* Humidity toggles */}
                <button 
                  onClick={() => toggleLine('오전 상대습도')}
                  className={`flex items-center gap-1.5 p-1 px-1.5 rounded-md text-[10px] font-medium border transition-all whitespace-nowrap overflow-hidden ${
                    visibleLines['오전 상대습도'] 
                      ? 'bg-white text-slate-900 border-violet-400 shadow-xs' 
                      : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
                  }`}
                  id="toggle_am_humidity"
                >
                  <span className="w-2 h-1.5 rounded-full bg-[#a78bfa] shrink-0"></span>
                  AM 습도
                </button>
                <button 
                  onClick={() => toggleLine('오후 상대습도')}
                  className={`flex items-center gap-1.5 p-1 px-1.5 rounded-md text-[10px] font-medium border transition-all whitespace-nowrap overflow-hidden ${
                    visibleLines['오후 상대습도'] 
                      ? 'bg-white text-slate-900 border-violet-600 shadow-xs' 
                      : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
                  }`}
                  id="toggle_pm_humidity"
                >
                  <span className="w-2 h-1.5 rounded-full bg-[#7c3aed] shrink-0"></span>
                  PM 습도
                </button>

                {/* Condensation Index toggles */}
                <button 
                  onClick={() => toggleLine('오전 결로지수')}
                  className={`flex items-center gap-1.5 p-1 px-1.5 rounded-md text-[10px] font-medium border transition-all whitespace-nowrap overflow-hidden ${
                    visibleLines['오전 결로지수'] 
                      ? 'bg-white text-slate-900 border-amber-400 shadow-xs' 
                      : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
                  }`}
                  id="toggle_am_dew"
                >
                  <span className="w-2 h-1.5 rounded-full bg-[#fb923c] shrink-0"></span>
                  AM 결로
                </button>
                <button 
                  onClick={() => toggleLine('오후 결로지수')}
                  className={`flex items-center gap-1.5 p-1 px-1.5 rounded-md text-[10px] font-medium border transition-all whitespace-nowrap overflow-hidden ${
                    visibleLines['오후 결로지수'] 
                      ? 'bg-white text-slate-900 border-rose-600 shadow-xs' 
                      : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
                  }`}
                  id="toggle_pm_dew"
                >
                  <span className="w-2 h-1.5 rounded-full bg-[#e11d48] shrink-0"></span>
                  PM 결로
                </button>
              </div>

              <div className="flex items-center gap-1 ml-auto xl:ml-2 pl-2 border-l border-slate-200 shrink-0">
                <button 
                  onClick={() => setAllLines(true)} 
                  className="px-2 py-1 text-[10px] font-semibold text-blue-600 hover:bg-blue-50 rounded-md transition-colors border border-blue-100"
                  id="btn_chart_all_on"
                >
                  전체 켜기
                </button>
                <button 
                  onClick={() => setAllLines(false)} 
                  className="px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition-colors border border-slate-200"
                  id="btn_chart_all_off"
                >
                  전체 끄기
                </button>
              </div>
            </div>
          </div>

          
{/* Recharts Container */}
          <div className="h-[410px] md:h-[490px] w-full" id="chart_container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData} 
                margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                onClick={(state) => {
                  if (state && state.activeTooltipIndex !== undefined) {
                    setSelectedDay(Number(state.activeTooltipIndex) + 1);
                  }
                }}
              >
                <defs>
                  <linearGradient id="amDewGradient" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset={`${dewOffsets.am60}%`} stopColor="#10b981" />
                    <stop offset={`${dewOffsets.am60}%`} stopColor="#f59e0b" />
                    <stop offset={`${dewOffsets.am80}%`} stopColor="#f59e0b" />
                    <stop offset={`${dewOffsets.am80}%`} stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                  <linearGradient id="pmDewGradient" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset={`${dewOffsets.pm60}%`} stopColor="#10b981" />
                    <stop offset={`${dewOffsets.pm60}%`} stopColor="#f59e0b" />
                    <stop offset={`${dewOffsets.pm80}%`} stopColor="#f59e0b" />
                    <stop offset={`${dewOffsets.pm80}%`} stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748b', fontSize: 13 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                
                {/* Left Axis for Temp & Dew Index */}
                <YAxis 
                  yAxisId="left"
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                  tick={{ fill: '#475569', fontSize: 13 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  label={{ value: '온도(℃) / 지수(Point)', angle: -90, position: 'insideLeft', offset: 10, fill: '#475569', style: { textAnchor: 'middle', fontSize: 13, fontWeight: 'bold' } }}
                />

                {/* Right Axis for Humidity % */}
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#4d4d4d', fontSize: 13 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  label={{ value: '상대습도(%)', angle: 90, position: 'insideRight', offset: 10, fill: '#4d4d4d', style: { textAnchor: 'middle', fontSize: 13, fontWeight: 'bold' } }}
                />

                {/* Custom Tooltip */}
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    padding: '12px'
                  }}
                  itemStyle={{ fontSize: '13px', padding: '2px 0' }}
                  labelStyle={{ fontSize: '14px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '6px' }}
                />

                {/* Reference highlight for selected day */}
                <ReferenceLine 
                  x={`${selectedDay}일`} 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  strokeDasharray="4 4"
                  yAxisId="left"
                />

                {/* Condensation Risk Reference Line */}
                <ReferenceLine 
                  y={80} 
                  stroke="#ef4444" 
                  strokeWidth={1.5} 
                  strokeDasharray="3 3" 
                  label={{ value: '위험 기준선 (80 Pt)', position: 'insideTopRight', fill: '#ef4444', fontSize: 11, fontWeight: 'bold' }} 
                  yAxisId="left" 
                />

                {/* Lines with toggling visibility */}
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="오전 대기온도" 
                  stroke="#60a5fa" 
                  strokeWidth={2.5}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                  hide={!visibleLines['오전 대기온도']}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="오후 대기온도" 
                  stroke="#2563eb" 
                  strokeWidth={2.5}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                  hide={!visibleLines['오후 대기온도']}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="오전 표면온도" 
                  stroke="#2dd4bf" 
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                  hide={!visibleLines['오전 표면온도']}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="오후 표면온도" 
                  stroke="#0f766e" 
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                  hide={!visibleLines['오후 표면온도']}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="오전 상대습도" 
                  stroke="#a78bfa" 
                  strokeWidth={1.5}
                  dot={{ r: 1 }}
                  activeDot={{ r: 5 }}
                  hide={!visibleLines['오전 상대습도']}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="오후 상대습도" 
                  stroke="#6d28d9" 
                  strokeWidth={1.5}
                  dot={{ r: 1 }}
                  activeDot={{ r: 5 }}
                  hide={!visibleLines['오후 상대습도']}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="오전 결로지수" 
                  stroke="url(#amDewGradient)" 
                  strokeWidth={3}
                  dot={(props: any) => <CustomDewDot {...props} isAm={true} />}
                  activeDot={(props: any) => <CustomDewActiveDot {...props} isAm={true} />}
                  hide={!visibleLines['오전 결로지수']}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="오후 결로지수" 
                  stroke="url(#pmDewGradient)" 
                  strokeWidth={3}
                  dot={(props: any) => <CustomDewDot {...props} isAm={false} />}
                  activeDot={(props: any) => <CustomDewActiveDot {...props} isAm={false} />}
                  hide={!visibleLines['오후 결로지수']}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          
        </section>

        {/* 3. 월간 데이터 표 Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-3 md:p-4 shadow-xs overflow-hidden" id="monthly_table_section">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-slate-100 pb-3 mb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5.5 h-5.5 text-blue-600 print:hidden" />
                {selectedMonth}월 온습도 및 결로지수 대장 (Monthly Excel Ledger)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 print:hidden">
                오전(AM)/오후(PM) 그룹별 측정대장입니다. 결로지수는 위험도 수준에 맞춰 조건부 서식이 적용되어 있으며 날짜 헤더 클릭 시 상세 데이터로 바인딩됩니다.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-between sm:justify-end print:hidden">
              
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-md transition-all shrink-0 cursor-pointer print:hidden"
                id="btn_print_ledger"
              >
                <Printer className="w-4 h-4" />
                대장 인쇄
              </button>
              <button
                onClick={() => {
                  const dayStr = selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`;
                  const monthStr = selectedMonth < 10 ? `0${selectedMonth}` : `${selectedMonth}`;
                  const fullDate = `${selectedYear}-${monthStr}-${dayStr}`;
                  handleDateChange(fullDate);
                  setModalFactory(selectedFactory);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
                id="btn_open_data_modal"
              >
                <Plus className="w-4 h-4" />
                새 데이터 입력
              </button>

              {/* Table Color Guide Legend */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-slate-500">결로지수 범례:</span>
                <span className="flex items-center gap-1 bg-[#d1fae5] text-[#065f46] px-2 py-0.5 rounded border border-[#a7f3d0]">
                  0~60 안전
                </span>
                <span className="flex items-center gap-1 bg-[#fef3c7] text-[#92400e] px-2 py-0.5 rounded border border-[#fde68a]">
                  61~80 주의
                </span>
                <span className="flex items-center gap-1 bg-[#ffe4e6] text-[#9f1239] px-2 py-0.5 rounded border border-[#fecdd3]">
                  81~100 위험
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable Ledger Wrapper */}

          {/* Scrollable Ledger Wrapper */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-inner print:hidden" id="ledger_table_wrapper">
            {renderTable(fixedDays, false)}
          </div>
          


          {/* User Instruction block inside Table */}
          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono print:hidden">
            <span className="hidden sm:inline">Copyright © (주)대성스틸 Smart Factory. All rights reserved.</span>
          </div>
        </section>

      </main>

      {/* New Data Registration Modal with Animation */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto print:hidden" id="entry_modal_overlay">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden z-10 relative"
              id="entry_modal_body"
            >
              {/* Header */}
              <div className="bg-slate-950 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-base md:text-lg">측정 데이터 신규 등록</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                  {/* 0. Factory Select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Factory className="w-4 h-4 text-blue-600" />
                      공장 선택 (Factory Select)
                    </label>
                    <select
                      value={modalFactory}
                      onChange={(e) => setModalFactory(e.target.value as '평택포승공장' | '아산인주공장')}
                      className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-800 transition-all font-mono appearance-none"
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23475569%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%276 9 12 15 18 9%27%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.2em 1.2em' }}
                    >
                      <option value="평택포승공장">평택포승공장</option>
                      <option value="아산인주공장">아산인주공장</option>
                    </select>
                  </div>
                  {/* 1. Date Select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      측정 일자 선택 (Date Select)
                    </label>
                    <input
                      type="date" required
                      
                      value={formData.date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-800 transition-all font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10px] text-slate-400">
                      * 기존 대장에 데이터가 존재하는 일자를 선택하시면 해당 데이터가 자동으로 로드되어 수정하실 수 있습니다.
                    </p>
                  </div>
                </div>

                {/* 2. AM Group */}
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50 space-y-3">
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse"></span>
                    오전 (AM) 측정 항목
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">대기온도 (℃)</label>
                      <input
                        type="number"
                        step="0.1"
                        
                        value={formData.amAirTemp}
                        onChange={(e) => setFormData(prev => ({ ...prev, amAirTemp: e.target.value }))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">표면온도 (℃)</label>
                      <input
                        type="number"
                        step="0.1"
                        
                        value={formData.amSurfaceTemp}
                        onChange={(e) => setFormData(prev => ({ ...prev, amSurfaceTemp: e.target.value }))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">상대습도 (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        
                        value={formData.amHumidity}
                        onChange={(e) => setFormData(prev => ({ ...prev, amHumidity: e.target.value }))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. PM Group */}
                <div className="bg-amber-50/40 rounded-xl p-4 border border-amber-100/50 space-y-3">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse"></span>
                    오후 (PM) 측정 항목
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">대기온도 (℃)</label>
                      <input
                        type="number"
                        step="0.1"
                        
                        value={formData.pmAirTemp}
                        onChange={(e) => setFormData(prev => ({ ...prev, pmAirTemp: e.target.value }))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">표면온도 (℃)</label>
                      <input
                        type="number"
                        step="0.1"
                        
                        value={formData.pmSurfaceTemp}
                        onChange={(e) => setFormData(prev => ({ ...prev, pmSurfaceTemp: e.target.value }))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">상대습도 (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        
                        value={formData.pmHumidity}
                        onChange={(e) => setFormData(prev => ({ ...prev, pmHumidity: e.target.value }))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                  >
                    취소 (Cancel)
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        등록 중...
                      </>
                    ) : (
                      "데이터 등록 및 반영"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
