import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Thermometer, Layers, Droplets, AlertTriangle, Calendar, TrendingUp, TrendingDown, CheckCircle2
} from 'lucide-react';
import { DailyRecord } from '../types';
import { getCondensationStatus } from '../data';

interface SummaryCardsProps {
  selectedMonth: number;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  selectedFactory: string;
  isLoadingData: boolean;
  sheetData: DailyRecord[];
  daysInMonth: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  selectedMonth, selectedDay, setSelectedDay, selectedFactory, isLoadingData, sheetData, daysInMonth
}) => {
  const currentRecord = useMemo(() => {
    const found = sheetData.find(r => r.day === selectedDay);
    if (found) return found;
    return {
      day: selectedDay,
      am: { airTemp: null, surfaceTemp: null, humidity: null, dewIndex: null },
      pm: { airTemp: null, surfaceTemp: null, humidity: null, dewIndex: null }
    };
  }, [sheetData, selectedDay]);

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
    <>
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
                     type="range" min={1} max={daysInMonth} value={selectedDay}
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
                       Target: &gt; 이슬점(T_dew)
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
                                 <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"></span> <span className="text-emerald-100 font-medium">0~60 (안전)</span> <span className="text-slate-400 ml-auto">Margin &gt; 3℃</span></li>
                                 <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.5)]"></span> <span className="text-amber-100 font-medium">61~80 (주의)</span> <span className="text-slate-400 ml-auto">0 &lt; Margin ≤ 3℃</span></li>
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
                       {maxDewIndexToday > 60 ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
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
    </>
  );
};
export default SummaryCards;
