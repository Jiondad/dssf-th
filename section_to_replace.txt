   850	        {/* Upper Info Alert or Quick Stats */}
   851	        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 transition-opacity duration-300 ${isLoadingData ? 'opacity-30' : 'opacity-100'}`}>
   852	          <div className="lg:col-span-8 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3.5 shadow-xs">
   853	            <Info className="w-5.5 h-5.5 text-blue-600 shrink-0 mt-0.5" />
   854	            <div className="text-sm text-blue-900 leading-relaxed">
   855	              <span className="font-semibold block text-blue-950 text-base mb-0.5">실시간 대시보드 인터랙션 안내</span>
   856	              차트의 특정 일자를 <strong className="text-blue-700">클릭</strong>하거나 하단 데이터 표의 날짜를 누르시면 해당 날짜의 오전/오후 정밀 데이터를 카드로 조회할 수 있습니다. 슬라이더 또는 시뮬레이터 재생 버튼을 사용해 온습도 추이를 동적으로 분석할 수 있습니다.
   857	            </div>
   858	          </div>
   859	          
   860	          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
   861	            <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
   862	              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
   863	                <Calendar className="w-3.5 h-3.5 text-slate-400" />
   864	                {selectedMonth}월 종합 지표 통계
   865	              </span>
   866	              <span className="text-[10px] font-mono text-slate-400">Total 31 Days</span>
   867	            </div>
   868	            <div className="grid grid-cols-3 gap-2 text-center">
   869	              <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100">
   870	                <span className="text-[10px] text-emerald-800 block font-semibold">안전 일수</span>
   871	                <span className="text-lg font-bold text-emerald-600 font-mono">{monthlyStats.safeCount}일</span>
   872	              </div>
   873	              <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
   874	                <span className="text-[10px] text-amber-800 block font-semibold">주의 일수</span>
   875	                <span className="text-lg font-bold text-amber-500 font-mono">{monthlyStats.cautionCount}일</span>
   876	              </div>
   877	              <div className="bg-rose-50 rounded-lg p-2 border border-rose-100">
   878	                <span className="text-[10px] text-rose-800 block font-semibold">위험 일수</span>
   879	                <span className="text-lg font-bold text-rose-600 font-mono">{monthlyStats.dangerCount}일</span>
   880	              </div>
   881	            </div>
   882	          </div>
   883	        </div>
   884	
   885	        {/* 1. 요약 대시보드 카드 뷰 Section */}
   886	        <section className="space-y-4 print:hidden" id="summary_cards_section">
   887	          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
   888	            <div>
   889	              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
   890	                <span className="h-5 w-1 bg-blue-600 rounded-full inline-block"></span>
   891	                실시간 환경 모니터링 현황 ({selectedMonth}월 {selectedDay}일)
   892	              </h2>
   893	              <p className="text-xs text-slate-500 mt-0.5 print:hidden">선택된 일자의 오전(AM) 및 오후(PM) {selectedFactory} 환경 측정치 요약입니다.</p>
   894	            </div>
   895	            
   896	            {/* Quick Slider control for days */}
   897	            <div className="w-full sm:w-auto flex items-center gap-2.5 bg-white p-2 rounded-xl border border-slate-200">
   898	              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">일자 선택:</span>
   899	              <input 
   900	                type="range" 
   901	                min={1} 
   902	                max={31} 
   903	                value={selectedDay}
   904	                onChange={(e) => setSelectedDay(parseInt(e.target.value))}
   905	                className="w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
   906	              />
   907	              <span className="text-xs font-bold text-blue-600 font-mono min-w-8 text-center">{selectedDay}일</span>
   908	            </div>
   909	          </div>
   910	
   911	          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
   912	            
   913	            {/* Card 1: 대기온도 */}
   914	            <motion.div 
   915	              layoutId="card_air_temp"
   916	              className="bg-blue-50/50 rounded-2xl border border-blue-100 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
   917	              id="card_air_temp"
   918	            >
   919	              <div className="flex justify-between items-start mb-3">
   920	                <div>
   921	                  <span className="text-base text-slate-800 font-extrabold tracking-tight block">대기 온도</span>
   922	                  <h3 className="text-sm font-medium text-slate-500 mt-0.5 uppercase tracking-wide">Air Temperature</h3>
   923	                </div>
   924	                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
   925	                  <Thermometer className="w-6 h-6" />
   926	                </div>
   927	              </div>
   928	
   929	              <div className="grid grid-cols-2 gap-4 divide-x divide-slate-100 mt-4">
   930	                <div className="flex flex-col justify-center">
   931	                  <span className="text-[11px] text-slate-400 font-semibold block uppercase">오전 (AM)</span>
   932	                  <div className="flex items-baseline gap-1 mt-1">
   933	                    <span className="text-2xl font-bold font-mono text-slate-800">{currentRecord.am.airTemp !== null ? currentRecord.am.airTemp : "-"}</span>
   934	                    <span className="text-xs text-slate-500 font-bold">℃</span>
   935	                  </div>
   936	                </div>
   937	                <div className="pl-4 flex flex-col justify-center">
   938	                  <span className="text-[11px] text-slate-400 font-semibold block uppercase">오후 (PM)</span>
   939	                  <div className="flex items-baseline gap-1 mt-1">
   940	                    <span className="text-2xl font-bold font-mono text-slate-800">{currentRecord.pm.airTemp !== null ? currentRecord.pm.airTemp : "-"}</span>
   941	                    <span className="text-xs text-slate-500 font-bold">℃</span>
   942	                  </div>
   943	                </div>
   944	              </div>
   945	
   946	              {/* Technical Indicator */}
   947	              <div className="mt-4 pt-3.5 border-t border-slate-50 flex justify-between items-center text-xs text-slate-500">
   948	                <span className="flex items-center gap-1">
   949	                  <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
   950	                  일교차: {currentRecord.pm.airTemp !== null && currentRecord.am.airTemp !== null ? Math.round((currentRecord.pm.airTemp - currentRecord.am.airTemp) * 10) / 10 + "℃" : "-"}
   951	                </span>
   952	                <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
   953	                  Target: 18~28℃
   954	                </span>
   955	              </div>
   956	            </motion.div>
   957	
   958	            {/* Card 2: 코일표면온도 */}
   959	            <motion.div 
   960	              layoutId="card_surface_temp"
   961	              className="bg-teal-50/50 rounded-2xl border border-teal-100 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
   962	              id="card_surface_temp"
   963	            >
   964	              <div className="flex justify-between items-start mb-3">
   965	                <div>
   966	                  <span className="text-base text-slate-800 font-extrabold tracking-tight block">코일 표면 온도</span>
   967	                  <h3 className="text-sm font-medium text-slate-500 mt-0.5 uppercase tracking-wide">Surface Temp</h3>
   968	                </div>
   969	                <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
   970	                  <Layers className="w-6 h-6" />
   971	                </div>
   972	              </div>
   973	
   974	              <div className="grid grid-cols-2 gap-4 divide-x divide-slate-100 mt-4">
   975	                <div className="flex flex-col justify-center">
   976	                  <span className="text-[11px] text-slate-400 font-semibold block uppercase">오전 (AM)</span>
   977	                  <div className="flex items-baseline gap-1 mt-1">
   978	                    <span className="text-2xl font-bold font-mono text-slate-800">{currentRecord.am.surfaceTemp !== null ? currentRecord.am.surfaceTemp : "-"}</span>
   979	                    <span className="text-xs text-slate-500 font-bold">℃</span>
   980	                  </div>
   981	                </div>
   982	                <div className="pl-4 flex flex-col justify-center">
   983	                  <span className="text-[11px] text-slate-400 font-semibold block uppercase">오후 (PM)</span>
   984	                  <div className="flex items-baseline gap-1 mt-1">
   985	                    <span className="text-2xl font-bold font-mono text-slate-800">{currentRecord.pm.surfaceTemp !== null ? currentRecord.pm.surfaceTemp : "-"}</span>
   986	                    <span className="text-xs text-slate-500 font-bold">℃</span>
   987	                  </div>
   988	                </div>
   989	              </div>
   990	
   991	              {/* Technical Indicator */}
   992	              <div className="mt-4 pt-3.5 border-t border-slate-50 flex justify-between items-center text-xs text-slate-500">
   993	                <span className="flex items-center gap-1.5 text-slate-600 font-medium whitespace-nowrap">
   994	                  <ArrowRight className="w-3.5 h-3.5 text-teal-500 shrink-0" />
   995	                  <span>대기대비차: 오전 {currentRecord.am.airTemp !== null && currentRecord.am.surfaceTemp !== null ? Math.round((currentRecord.am.airTemp - currentRecord.am.surfaceTemp) * 10) / 10 + "℃" : "-"} <span className="text-slate-300 mx-1">|</span> 오후 {currentRecord.pm.airTemp !== null && currentRecord.pm.surfaceTemp !== null ? Math.round((currentRecord.pm.airTemp - currentRecord.pm.surfaceTemp) * 10) / 10 + "℃" : "-"}</span>
   996	                </span>
   997	                <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] shrink-0">
   998	                  
   999	                </span>
  1000	              </div>
  1001	            </motion.div>
  1002	
  1003	            {/* Card 3: 상대습도 */}
  1004	            <motion.div 
  1005	              layoutId="card_humidity"
  1006	              className="bg-violet-50/50 rounded-2xl border border-violet-100 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
  1007	              id="card_humidity"
  1008	            >
  1009	              <div className="flex justify-between items-start mb-3">
  1010	                <div>
  1011	                  <span className="text-base text-slate-800 font-extrabold tracking-tight block">상대 습도</span>
  1012	                  <h3 className="text-sm font-medium text-slate-500 mt-0.5 uppercase tracking-wide">Relative Humidity</h3>
  1013	                </div>
  1014	                <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
  1015	                  <Droplets className="w-6 h-6" />
  1016	                </div>
  1017	              </div>
  1018	
  1019	              <div className="grid grid-cols-2 gap-4 divide-x divide-slate-100 mt-4">
  1020	                <div className="flex flex-col justify-center">
  1021	                  <span className="text-[11px] text-slate-400 font-semibold block uppercase">오전 (AM)</span>
  1022	                  <div className="flex items-baseline gap-1 mt-1">
  1023	                    <span className="text-2xl font-bold font-mono text-slate-800">{currentRecord.am.humidity !== null ? currentRecord.am.humidity : "-"}</span>
  1024	                    <span className="text-xs text-slate-500 font-bold">%</span>
  1025	                  </div>
  1026	                </div>
  1027	                <div className="pl-4 flex flex-col justify-center">
  1028	                  <span className="text-[11px] text-slate-400 font-semibold block uppercase">오후 (PM)</span>
  1029	                  <div className="flex items-baseline gap-1 mt-1">
  1030	                    <span className="text-2xl font-bold font-mono text-slate-800">{currentRecord.pm.humidity !== null ? currentRecord.pm.humidity : "-"}</span>
  1031	                    <span className="text-xs text-slate-500 font-bold">%</span>
  1032	                  </div>
  1033	                </div>
  1034	              </div>
  1035	
  1036	              {/* Technical Indicator */}
  1037	              <div className="mt-4 pt-3.5 border-t border-slate-50 flex justify-between items-center text-xs text-slate-500">
  1038	                <span className="flex items-center gap-1">
  1039	                  <TrendingDown className="w-3.5 h-3.5 text-violet-500" />
  1040	                  일교차: {currentRecord.am.humidity !== null && currentRecord.pm.humidity !== null ? (currentRecord.am.humidity - currentRecord.pm.humidity) + "%" : "-"}
  1041	                </span>
  1042	                <span className="font-mono bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
  1043	                  Target: &lt;65%
  1044	                </span>
  1045	              </div>
  1046	            </motion.div>
  1047	
  1048	            {/* Card 4: 결로지수 (Condensation Index) - DYNAMIC COLORS BASED ON CONDENSATION STATUS */}
  1049	            <motion.div 
  1050	              layoutId="card_dew_index"
  1051	              animate={{ backgroundColor: condensationStatus.bgColor.includes('emerald') ? '#d1fae5' : condensationStatus.bgColor.includes('amber') ? '#fef3c7' : '#ffe4e6' }}
  1052	              transition={{ duration: 0.3 }}
  1053	              className={`rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all relative z-10 overflow-visible flex flex-col justify-between ${condensationStatus.borderColor}`}
  1054	              id="card_dew_index"
  1055	            >
  1056	              <div>
  1057	                <div className="flex justify-between items-start mb-2">
  1058	                  <div>
  1059	                    <span className="text-base text-slate-800 font-extrabold tracking-tight block">결로 위험 지수</span>
  1060	                    <h3 className="text-sm font-medium text-slate-500 mt-0.5 uppercase tracking-wide">Condensation Index</h3>
  1061	                  </div>
  1062	                  <div className="relative group p-2 rounded-xl bg-white/80 cursor-help">
  1063	                    <AlertTriangle className="w-6 h-6 text-slate-900 transition-transform group-hover:scale-110" />
  1064	                    
  1065	                    {/* Tooltip Content */}
  1066	                    <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-slate-900 text-white p-4 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 transform origin-top-right scale-95 group-hover:scale-100">
  1067	                      <h4 className="font-bold text-sm mb-3 text-blue-300 border-b border-slate-700 pb-2">결로지수 산출 및 환산 원리</h4>
  1068	                      <div className="space-y-3 text-xs">
  1069	                        <div>
  1070	                          <p className="font-semibold text-slate-300">1단계 (이슬점 약식 계산)</p>
  1071	                          <p className="font-mono text-[11px] bg-slate-800 text-slate-200 p-1.5 rounded mt-1 border border-slate-700">T_dew ≈ T_air - ((100 - H) / 5)</p>
  1072	                        </div>
  1073	                        <div>
  1074	                          <p className="font-semibold text-slate-300">2단계 (마진 산출)</p>
  1075	                          <p className="font-mono text-[11px] bg-slate-800 text-slate-200 p-1.5 rounded mt-1 border border-slate-700">Margin = T_surface - T_dew</p>
  1076	                        </div>
  1077	                        <div>
  1078	                          <p className="font-semibold text-slate-300 mb-1">3단계 (지수 환산 기준)</p>
  1079	                          <ul className="space-y-1.5 text-[11px] bg-slate-800 p-2 rounded border border-slate-700">
  1080	                            <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"></span> <span className="text-emerald-100 font-medium">0~60 (안전)</span> <span className="text-slate-400 ml-auto">Margin &gt; 5℃</span></li>
  1081	                            <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.5)]"></span> <span className="text-amber-100 font-medium">61~80 (주의)</span> <span className="text-slate-400 ml-auto">0 &lt; Margin ≤ 5℃</span></li>
  1082	                            <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_4px_rgba(225,29,72,0.5)]"></span> <span className="text-rose-100 font-medium">81~100 (위험)</span> <span className="text-slate-400 ml-auto">Margin ≤ 0℃</span></li>
  1083	                          </ul>
  1084	                        </div>
  1085	                      </div>
  1086	                    </div>
  1087	                  </div>
  1088	                </div>
  1089	
  1090	                <div className="grid grid-cols-2 gap-4 divide-x divide-slate-200 mt-2">
  1091	                  <div className="flex flex-col justify-center">
  1092	                    <span className="text-[11px] text-slate-600 font-semibold block uppercase">오전 (AM)</span>
  1093	                    <div className="flex items-baseline gap-1 mt-0.5">
  1094	                      <span className="text-2xl font-black font-mono text-slate-900">{currentRecord.am.dewIndex !== null ? currentRecord.am.dewIndex : "-"}</span>
  1095	                      <span className="text-xs text-slate-600 font-bold">Pt</span>
  1096	                    </div>
  1097	                  </div>
  1098	                  <div className="pl-4 flex flex-col justify-center">
  1099	                    <span className="text-[11px] text-slate-600 font-semibold block uppercase">오후 (PM)</span>
  1100	                    <div className="flex items-baseline gap-1 mt-0.5">
