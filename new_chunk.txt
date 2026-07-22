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

          
