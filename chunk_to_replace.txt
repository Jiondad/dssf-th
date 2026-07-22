<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-3 mb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="h-5 w-1 bg-blue-600 rounded-full inline-block"></span>
                {selectedMonth}월 온습도 및 결로지수 분석 그래프 (Line Chart)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 print:hidden">X축은 1일부터 31일까지의 일자이며, 각 선을 클릭하여 가시성을 제어할 수 있습니다.</p>
            </div>

            {/* Quick Chart actions */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <button 
                onClick={() => setAllLines(true)} 
                className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                id="btn_chart_all_on"
              >
                전체 켜기
              </button>
              <button 
                onClick={() => setAllLines(false)} 
                className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                id="btn_chart_all_off"
              >
                전체 끄기
              </button>
            </div>
          </div>

          <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">차트 범례 필터링 (클릭하여 켜기/끄기)</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
              
              {/* Air Temp toggles */}
              <button 
                onClick={() => toggleLine('오전 대기온도')}
                className={`flex items-center gap-2 p-1.5 xl:p-2 rounded-lg text-xs xl:text-sm font-medium border transition-all whitespace-nowrap overflow-hidden ${
                  visibleLines['오전 대기온도'] 
                    ? 'bg-white text-slate-900 border-blue-400 shadow-xs' 
                    : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
                }`}
                id="toggle_am_air"
              >
                <span className="w-2.5 h-1.5 rounded-full bg-[#60a5fa] shrink-0"></span>
                <span className="flex-1 text-left truncate">오전 대기온도 (℃)</span>
              </button>
              <button 
                onClick={() => toggleLine('오후 대기온도')}
                className={`flex items-center gap-2 p-1.5 xl:p-2 rounded-lg text-xs xl:text-sm font-medium border transition-all whitespace-nowrap overflow-hidden ${
                  visibleLines['오후 대기온도'] 
                    ? 'bg-white text-slate-900 border-blue-600 shadow-xs' 
                    : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
                }`}
                id="toggle_pm_air"
              >
                <span className="w-2.5 h-1.5 rounded-full bg-[#2563eb] shrink-0"></span>
                <span className="flex-1 text-left truncate">오후 대기온도 (℃)</span>
              </button>

              {/* Surface Temp toggles */}
              <button 
                onClick={() => toggleLine('오전 표면온도')}
                className={`flex items-center gap-2 p-1.5 xl:p-2 rounded-lg text-xs xl:text-sm font-medium border transition-all whitespace-nowrap overflow-hidden ${
                  visibleLines['오전 표면온도'] 
                    ? 'bg-white text-slate-900 border-teal-400 shadow-xs' 
                    : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
                }`}
                id="toggle_am_surface"
              >
                <span className="w-2.5 h-1.5 rounded-full bg-[#2dd4bf] shrink-0"></span>
                <span className="flex-1 text-left truncate">오전 표면온도 (℃)</span>
              </button>
              <button 
                onClick={() => toggleLine('오후 표면온도')}
                className={`flex items-center gap-2 p-1.5 xl:p-2 rounded-lg text-xs xl:text-sm font-medium border transition-all whitespace-nowrap overflow-hidden ${
                  visibleLines['오후 표면온도'] 
                    ? 'bg-white text-slate-900 border-teal-700 shadow-xs' 
                    : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
                }`}
                id="toggle_pm_surface"
              >
                <span className="w-2.5 h-1.5 rounded-full bg-[#0f766e] shrink-0"></span>
                <span className="flex-1 text-left truncate">오후 표면온도 (℃)</span>
              </button>

              {/* Humidity toggles */}
              <button 
                onClick={() => toggleLine('오전 상대습도')}
                className={`flex items-center gap-2 p-1.5 xl:p-2 rounded-lg text-xs xl:text-sm font-medium border transition-all whitespace-nowrap overflow-hidden ${
                  visibleLines['오전 상대습도'] 
                    ? 'bg-white text-slate-900 border-violet-400 shadow-xs' 
                    : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
                }`}
                id="toggle_am_humidity"
              >
                <span className="w-2.5 h-1.5 rounded-full bg-[#a78bfa] shrink-0"></span>
                <span className="flex-1 text-left truncate">오전 상대습도 (%)</span>
              </button>
              <button 
                onClick={() => toggleLine('오후 상대습도')}
                className={`flex items-center gap-2 p-1.5 xl:p-2 rounded-lg text-xs xl:text-sm font-medium border transition-all whitespace-nowrap overflow-hidden ${
                  visibleLines['오후 상대습도'] 
                    ? 'bg-white text-slate-900 border-violet-700 shadow-xs' 
                    : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
                }`}
                id="toggle_pm_humidity"
              >
                <span className="w-2.5 h-1.5 rounded-full bg-[#6d28d9] shrink-0"></span>
                <span className="flex-1 text-left truncate">오후 상대습도 (%)</span>
              </button>

              {/* Dew Index toggles */}
              <button 
                onClick={() => toggleLine('오전 결로지수')}
                className={`flex items-center gap-2 p-1.5 xl:p-2 rounded-lg text-xs xl:text-sm font-medium border transition-all whitespace-nowrap overflow-hidden ${
                  visibleLines['오전 결로지수'] 
                    ? 'bg-white text-slate-900 border-amber-500 shadow-xs' 
                    : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
                }`}
                id="toggle_am_dew"
              >
                <span className="w-2.5 h-1.5 rounded-full bg-[#fb923c] shrink-0"></span>
                <span className="flex-1 text-left truncate">오전 결로지수 (Pt)</span>
              </button>
              <button 
                onClick={() => toggleLine('오후 결로지수')}
                className={`flex items-center gap-2 p-1.5 xl:p-2 rounded-lg text-xs xl:text-sm font-medium border transition-all whitespace-nowrap overflow-hidden ${
                  visibleLines['오후 결로지수'] 
                    ? 'bg-white text-slate-900 border-rose-600 shadow-xs' 
                    : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
                }`}
                id="toggle_pm_dew"
              >
                <span className="w-2.5 h-1.5 rounded-full bg-[#e11d48] shrink-0"></span>
                <span className="flex-1 text-left truncate">오후 결로지수 (Pt)</span>
              </button>
            </div>
          </div>

          