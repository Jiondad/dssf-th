import React, { memo } from 'react';
import { DailyRecord } from '../types';

interface LedgerTableProps {
  daysToRender: number[];
  isPrint: boolean;
  sheetData: DailyRecord[];
  selectedDay: number;
  setSelectedDay: (day: number) => void;
}

const LedgerTable: React.FC<LedgerTableProps> = memo(({
  daysToRender, isPrint, sheetData, selectedDay, setSelectedDay
}) => {
  return (
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
                        (day === selectedDay && !isPrint) ? "bg-blue-600 text-white" : "bg-slate-800/85"
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
                        (day === selectedDay && !isPrint) ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
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
                        (day === selectedDay && !isPrint) ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
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
                        (day === selectedDay && !isPrint) ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
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
                        <td key={day} onClick={() => setSelectedDay(day)} className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-all ${(day === selectedDay && !isPrint) ? "ring-2 ring-blue-500 ring-offset-1 z-10" : ""}`}>
                          -
                        </td>
                      );
                    }
                    const indexVal = item.am.dewIndex;
                    if (indexVal === null || indexVal === undefined ) {
                      return (
                        <td key={day} onClick={() => setSelectedDay(day)} className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-all ${(day === selectedDay && !isPrint) ? "ring-2 ring-blue-500 ring-offset-1 z-10" : ""}`}>
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
                          (day === selectedDay && !isPrint) ? "ring-2 ring-blue-500 ring-offset-1 z-10" : ""
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
                        (day === selectedDay && !isPrint) ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
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
                        (day === selectedDay && !isPrint) ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
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
                        (day === selectedDay && !isPrint) ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
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
                        <td key={day} onClick={() => setSelectedDay(day)} className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-all ${(day === selectedDay && !isPrint) ? "ring-2 ring-blue-500 ring-offset-1 z-10" : ""}`}>
                          -
                        </td>
                      );
                    }
                    const indexVal = item.pm.dewIndex;
                    if (indexVal === null || indexVal === undefined ) {
                      return (
                        <td key={day} onClick={() => setSelectedDay(day)} className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-all ${(day === selectedDay && !isPrint) ? "ring-2 ring-blue-500 ring-offset-1 z-10" : ""}`}>
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
                          (day === selectedDay && !isPrint) ? "ring-2 ring-blue-500 ring-offset-1 z-10" : ""
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
});

export default LedgerTable;
