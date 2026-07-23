import React, { useState, useMemo, useEffect } from "react";
import {
  Layers, Factory, RotateCcw, Play, Pause, ChevronDown, FileSpreadsheet, Printer, Plus, Calendar, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { fetchSpreadsheetData } from "./data";
import { DailyRecord } from "./types";

import SummaryCards from "./components/SummaryCards";
import MonthlyChart from "./components/MonthlyChart";
import LedgerTable from "./components/LedgerTable";
import EntryModal from "./components/EntryModal";

const FACTORY_SHEET_MAP = { '평택포승공장': 'Data', '아산인주공장': 'Data2' } as const;

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
        const sheetName = FACTORY_SHEET_MAP[selectedFactory];
        const newData = await fetchSpreadsheetData(sheetName, selectedYear, selectedMonth);
            
        if (isMounted) {
          setSheetData(newData);
              
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
       
    loadData();
       
    timer = setInterval(() => {
      loadData(true);
    }, 600000);
       
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [selectedYear, selectedMonth, selectedFactory]);

  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalFactory, setModalFactory] = useState<'평택포승공장' | '아산인주공장'>('평택포승공장');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
    amAirTemp: "",
    amSurfaceTemp: "",
    amHumidity: "",
    pmAirTemp: "",
    pmSurfaceTemp: "",
    pmHumidity: "",
  });

  const handleDateChange = (dateVal: string) => {
    setFormData(prev => {
      const updated = { ...prev, date: dateVal };
      const dateObj = new Date(dateVal);
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
      return {
        ...updated,
        amAirTemp: "",
        amSurfaceTemp: "",
        amHumidity: "",
        pmAirTemp: "",
        pmSurfaceTemp: "",
        pmHumidity: "",
      };
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
        if (diff <= 0) {
          return Math.max(81, Math.min(100, Math.round(90 - (diff * 10))));
        } else if (diff <= 3) {
          return Math.max(61, Math.min(80, Math.round(80 - (diff / 3) * 19)));
        } else {
          return Math.max(15, Math.min(60, Math.round(60 - (diff - 3) * 5)));
        }
      };

      const amAirTemp = formData.amAirTemp === "" ? null : Number(formData.amAirTemp);
      const amSurfaceTemp = formData.amSurfaceTemp === "" ? null : Number(formData.amSurfaceTemp);
      const amHumidity = formData.amHumidity === "" ? null : Number(formData.amHumidity);
      const pmAirTemp = formData.pmAirTemp === "" ? null : Number(formData.pmAirTemp);
      const pmSurfaceTemp = formData.pmSurfaceTemp === "" ? null : Number(formData.pmSurfaceTemp);
      const pmHumidity = formData.pmHumidity === "" ? null : Number(formData.pmHumidity);

      const payload = {
        sheetName: FACTORY_SHEET_MAP[modalFactory],
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

      const response = await fetch("https://script.google.com/macros/s/AKfycbwGRuza0OfCDR-sQA3l3yu_aCAIdJPtKWobL8PwGVOsRDGYCW3O-EGo5oNSeGJKILtU4g/exec", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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

      alert("데이터가 성공적으로 등록되었습니다.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("데이터 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fixedDays = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

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
        <h2 className="text-[22px] font-bold text-center text-slate-900 tracking-tight mt-[30px] underline underline-offset-8">온습도 및 결로지수 관리대장 ({selectedYear}년 {selectedMonth}월 {selectedFactory})</h2>
        
        
        <div className="flex justify-between items-end mb-1 px-1 mt-[20px]">
          <div className="text-[11px] font-bold text-slate-700">
            {selectedMonth}월 종합 지표: 안전 {monthlyStats.safeCount}일 | 주의 {monthlyStats.cautionCount}일 | 위험 {monthlyStats.dangerCount}일
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-bold">
            <span className="text-slate-500">결로지수 범례:</span>
            <span className="flex items-center gap-1 bg-[#d1fae5] text-[#065f46] px-1.5 py-0.5 rounded border border-[#a7f3d0]">
              0~60 안전
            </span>
            <span className="flex items-center gap-1 bg-[#fef3c7] text-[#92400e] px-1.5 py-0.5 rounded border border-[#fde68a]">
              61~80 주의
            </span>
            <span className="flex items-center gap-1 bg-[#ffe4e6] text-[#9f1239] px-1.5 py-0.5 rounded border border-[#fecdd3]">
              81~100 위험
            </span>
          </div>
        </div>
        <div className="mt-0">
          <LedgerTable daysToRender={fixedDays.slice(0, 16)} isPrint={true} sheetData={sheetData} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
        </div>
        <div className="pt-3">
          <LedgerTable daysToRender={fixedDays.slice(16, 31)} isPrint={true} sheetData={sheetData} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
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
                  <span className="ml-auto">Margin &gt; 3℃</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> 
                  <span className="font-semibold text-amber-700">61~80 (주의)</span> 
                  <span className="ml-auto">0 &lt; Margin ≤ 3℃</span>
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

        <SummaryCards 
          selectedMonth={selectedMonth}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          selectedFactory={selectedFactory}
          isLoadingData={isLoadingData}
          sheetData={sheetData}
        />
        
<MonthlyChart 
          selectedMonth={selectedMonth}
          sheetData={sheetData}
          fixedDays={fixedDays}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />

        {/* 3. 월간 데이터 표 Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-3 md:p-4 shadow-xs overflow-hidden" id="monthly_table_section">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-slate-100 pb-3 mb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5.5 h-5.5 text-blue-600 print:hidden" />
                {selectedMonth}월 온습도 및 결로지수 현황 (Monthly Excel Ledger)
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
            <LedgerTable daysToRender={fixedDays} isPrint={false} sheetData={sheetData} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
          </div>
          


          {/* User Instruction block inside Table */}
          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono print:hidden">
            <span className="hidden sm:inline">Copyright © (주)대성스틸 Smart Factory. All rights reserved.</span>
          </div>
        </section>

      </main>

      <EntryModal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalFactory={modalFactory}
        setModalFactory={setModalFactory}
        isSubmitting={isSubmitting}
        formData={formData}
        setFormData={setFormData}
        handleDateChange={handleDateChange}
        handleFormSubmit={handleFormSubmit}
      />
    </div>
  );
}
