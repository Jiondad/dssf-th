  1102	        
  1103	{/* 2. 월간 그래프 Section */}
  1104	        <section className="bg-white rounded-2xl border border-slate-200 p-3 md:p-4 shadow-xs print:hidden" id="monthly_chart_section">
  1105	          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-3 mb-3">
  1106	            <div>
  1107	              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
  1108	                <span className="h-5 w-1 bg-blue-600 rounded-full inline-block"></span>
  1109	                {selectedMonth}월 온습도 및 결로지수 분석 그래프 (Line Chart)
  1110	              </h2>
  1111	              <p className="text-xs text-slate-500 mt-0.5 print:hidden">X축은 1일부터 31일까지의 일자이며, 각 선을 클릭하여 가시성을 제어할 수 있습니다.</p>
  1112	            </div>
  1113	
  1114	            {/* Quick Chart actions */}
  1115	            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
  1116	              <button 
  1117	                onClick={() => setAllLines(true)} 
  1118	                className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
  1119	                id="btn_chart_all_on"
  1120	              >
  1121	                전체 켜기
  1122	              </button>
  1123	              <button 
  1124	                onClick={() => setAllLines(false)} 
  1125	                className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
  1126	                id="btn_chart_all_off"
  1127	              >
  1128	                전체 끄기
  1129	              </button>
  1130	            </div>
  1131	          </div>
  1132	
  1133	          <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
  1134	            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">차트 범례 필터링 (클릭하여 켜기/끄기)</span>
  1135	            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
  1136	              
  1137	              {/* Air Temp toggles */}
  1138	              <button 
  1139	                onClick={() => toggleLine('오전 대기온도')}
  1140	                className={`flex items-center gap-2 p-1.5 xl:p-2 rounded-lg text-xs xl:text-sm font-medium border transition-all whitespace-nowrap overflow-hidden ${
  1141	                  visibleLines['오전 대기온도'] 
  1142	                    ? 'bg-white text-slate-900 border-blue-400 shadow-xs' 
  1143	                    : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
  1144	                }`}
  1145	                id="toggle_am_air"
  1146	              >
  1147	                <span className="w-2.5 h-1.5 rounded-full bg-[#60a5fa] shrink-0"></span>
  1148	                <span className="flex-1 text-left truncate">오전 대기온도 (℃)</span>
  1149	              </button>
  1150	              <button 
  1151	                onClick={() => toggleLine('오후 대기온도')}
  1152	                className={`flex items-center gap-2 p-1.5 xl:p-2 rounded-lg text-xs xl:text-sm font-medium border transition-all whitespace-nowrap overflow-hidden ${
  1153	                  visibleLines['오후 대기온도'] 
  1154	                    ? 'bg-white text-slate-900 border-blue-600 shadow-xs' 
  1155	                    : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
  1156	                }`}
  1157	                id="toggle_pm_air"
  1158	              >
  1159	                <span className="w-2.5 h-1.5 rounded-full bg-[#2563eb] shrink-0"></span>
  1160	                <span className="flex-1 text-left truncate">오후 대기온도 (℃)</span>
  1161	              </button>
  1162	
  1163	              {/* Surface Temp toggles */}
  1164	              <button 
  1165	                onClick={() => toggleLine('오전 표면온도')}
  1166	                className={`flex items-center gap-2 p-1.5 xl:p-2 rounded-lg text-xs xl:text-sm font-medium border transition-all whitespace-nowrap overflow-hidden ${
  1167	                  visibleLines['오전 표면온도'] 
  1168	                    ? 'bg-white text-slate-900 border-teal-400 shadow-xs' 
  1169	                    : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
  1170	                }`}
  1171	                id="toggle_am_surface"
  1172	              >
  1173	                <span className="w-2.5 h-1.5 rounded-full bg-[#2dd4bf] shrink-0"></span>
  1174	                <span className="flex-1 text-left truncate">오전 표면온도 (℃)</span>
  1175	              </button>
  1176	              <button 
  1177	                onClick={() => toggleLine('오후 표면온도')}
  1178	                className={`flex items-center gap-2 p-1.5 xl:p-2 rounded-lg text-xs xl:text-sm font-medium border transition-all whitespace-nowrap overflow-hidden ${
  1179	                  visibleLines['오후 표면온도'] 
  1180	                    ? 'bg-white text-slate-900 border-teal-700 shadow-xs' 
  1181	                    : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
  1182	                }`}
  1183	                id="toggle_pm_surface"
  1184	              >
  1185	                <span className="w-2.5 h-1.5 rounded-full bg-[#0f766e] shrink-0"></span>
  1186	                <span className="flex-1 text-left truncate">오후 표면온도 (℃)</span>
  1187	              </button>
  1188	
  1189	              {/* Humidity toggles */}
  1190	              <button 
  1191	                onClick={() => toggleLine('오전 상대습도')}
  1192	                className={`flex items-center gap-2 p-1.5 xl:p-2 rounded-lg text-xs xl:text-sm font-medium border transition-all whitespace-nowrap overflow-hidden ${
  1193	                  visibleLines['오전 상대습도'] 
  1194	                    ? 'bg-white text-slate-900 border-violet-400 shadow-xs' 
  1195	                    : 'bg-slate-100/50 text-slate-400 border-slate-200 hover:bg-slate-100'
  1196	                }`}
  1197	                id="toggle_am_humidity"
  1198	              >
  1199	                <span className="w-2.5 h-1.5 rounded-full bg-[#a78bfa] shrink-0"></span>
  1200	                <span className="flex-1 text-left truncate">오전 상대습도 (%)</span>
  1201	              </button>
  1202	              <button 
  1203	                onClick={() => toggleLine('오후 상대습도')}
  1204	                className={`flex items-center gap-2 p-1.5 xl:p-2 rounded-lg text-xs xl:text-sm font-medium border transition-all whitespace-nowrap overflow-hidden ${
