import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine
} from 'recharts';
import { DailyRecord } from '../types';

const getDewColor = (value: number) => {
  if (value <= 60) return '#10b981'; 
  if (value <= 80) return '#f59e0b'; 
  return '#ef4444'; 
};

const CustomDewDot = (props: any) => {
  const { cx, cy, value } = props;
  if (!cx || !cy || value === undefined) return null;
  const color = getDewColor(value);
  return <circle cx={cx} cy={cy} r={4} fill={color} stroke="#fff" strokeWidth={1} />;
};

const CustomDewActiveDot = (props: any) => {
  const { cx, cy, value } = props;
  if (!cx || !cy || value === undefined) return null;
  const color = getDewColor(value);
  return <circle cx={cx} cy={cy} r={8} fill={color} stroke="#fff" strokeWidth={2} style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' }} />;
};

interface MonthlyChartProps {
  selectedMonth: number;
  sheetData: DailyRecord[];
  dynamicDays: number[];
  selectedDay: number;
  setSelectedDay: (day: number) => void;
}

const MonthlyChart: React.FC<MonthlyChartProps> = ({ selectedMonth, sheetData, dynamicDays, selectedDay, setSelectedDay }) => {
  const [visibleLines, setVisibleLines] = useState<Record<string, boolean>>({
    '오전 대기온도': true, '오후 대기온도': true,
    '오전 표면온도': true, '오후 표면온도': true,
    '오전 상대습도': false, '오후 상대습도': false,
    '오전 결로지수': true, '오후 결로지수': true,
  });

  const toggleLine = (dataKey: string) => {
    setVisibleLines(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
  };

  const setAllLines = (visible: boolean) => {
    setVisibleLines(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => updated[key] = visible);
      return updated;
    });
  };

  const chartData = useMemo(() => {
    return dynamicDays.map(day => {
      const record = sheetData.find(r => r.day === day);
      if (!record) {
        return {
          name: `${day}일`, day: day,
          '오전 대기온도': null, '오후 대기온도': null,
          '오전 표면온도': null, '오후 표면온도': null,
          '오전 상대습도': null, '오후 상대습도': null,
          '오전 결로지수': null, '오후 결로지수': null,
        };
      }
      return {
        name: `${record.day}일`, day: record.day,
        '오전 대기온도': record.am.airTemp, '오후 대기온도': record.pm.airTemp,
        '오전 표면온도': record.am.surfaceTemp, '오후 표면온도': record.pm.surfaceTemp,
        '오전 상대습도': record.am.humidity, '오후 상대습도': record.pm.humidity,
        '오전 결로지수': record.am.dewIndex, '오후 결로지수': record.pm.dewIndex,
      };
    });
  }, [sheetData, dynamicDays]);

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

    const getOffset = (val: number, min: number, max: number) => {
      return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
    };

    return {
      am60: getOffset(60, amDewMin, amDewMax), am80: getOffset(80, amDewMin, amDewMax),
      pm60: getOffset(60, pmDewMin, pmDewMax), pm80: getOffset(80, pmDewMin, pmDewMax),
    };
  }, [chartData]);

  const yAxisDomain = useMemo(() => {
    let minT = 100, maxT = -100;
    chartData.forEach(d => {
      const temps = [d['오전 대기온도'], d['오후 대기온도'], d['오전 표면온도'], d['오후 표면온도']].filter(v => v !== null) as number[];
      temps.forEach(t => {
        if (t < minT) minT = t;
        if (t > maxT) maxT = t;
      });
    });
    if (minT === 100) return [0, 40];
    return [Math.floor(minT - 5), Math.ceil(maxT + 5)];
  }, [chartData]);

  return (
    <>
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
    </>
  );
};
export default MonthlyChart;
