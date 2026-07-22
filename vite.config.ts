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
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-inner" id="ledger_table_wrapper">
            <table className="w-full text-[10px] xl:text-xs text-center border-collapse table-fixed min-w-[800px]">
              <thead>
                <tr className="bg-slate-900 text-white font-sans text-center">
                  <th className="sticky left-0 bg-slate-900 border border-slate-700 p-1 xl:p-1.5 z-20 font-bold w-[35px] xl:w-[45px] break-keep">구분</th>
                  <th className="sticky left-[35px] xl:left-[45px] bg-slate-900 border border-slate-700 p-1 xl:p-1.5 z-20 font-bold w-[80px] xl:w-[115px] break-keep">측정 항목</th>
                  {mockData.map((item) => (
                    <th 
                      key={item.day}
                      onClick={() => setSelectedDay(item.day)}
                      className={`border border-slate-700 p-1 xl:p-1.5 font-bold font-mono cursor-pointer transition-all hover:bg-blue-800 ${
                        item.day === selectedDay ? "bg-blue-600 text-white" : "bg-slate-800/85"
                      }`}
                      title={`${item.day}일 정밀조회`}
                    >
                      {item.day}일
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
                  <td className="sticky left-[35px] xl:left-[45px] bg-slate-50 border border-slate-200 p-1 xl:p-1.5 font-semibold text-slate-700 text-left z-10 shadow-xs">
                    대기온도 (℃)
                  </td>
                  {mockData.map((item) => (
                    <td 
                      key={item.day} 
                      onClick={() => setSelectedDay(item.day)}
                      className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-colors ${
                        item.day === selectedDay ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
                      }`}
                    >
                      {item.am.airTemp.toFixed(1)}
                    </td>
                  ))}
                </tr>

                {/* 표면온도 */}
                <tr className="hover:bg-slate-50 transition-colors text-center">
                  <td className="sticky left-[35px] xl:left-[45px] bg-slate-50 border border-slate-200 p-1 xl:p-1.5 font-semibold text-slate-700 text-left z-10 shadow-xs">
                    코일표면온도 (℃)
                  </td>
                  {mockData.map((item) => (
                    <td 
                      key={item.day} 
                      onClick={() => setSelectedDay(item.day)}
                      className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-colors ${
                        item.day === selectedDay ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
                      }`}
                    >
                      {item.am.surfaceTemp.toFixed(1)}
                    </td>
                  ))}
                </tr>

                {/* 상대습도 */}
                <tr className="hover:bg-slate-50 transition-colors text-center">
                  <td className="sticky left-[35px] xl:left-[45px] bg-slate-50 border border-slate-200 p-1 xl:p-1.5 font-semibold text-slate-700 text-left z-10 shadow-xs">
                    상대습도 (%)
                  </td>
                  {mockData.map((item) => (
                    <td 
                      key={item.day} 
                      onClick={() => setSelectedDay(item.day)}
                      className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-colors ${
                        item.day === selectedDay ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
                      }`}
                    >
                      {item.am.humidity}
                    </td>
                  ))}
                </tr>

                {/* 결로지수 */}
                <tr className="hover:bg-slate-50 transition-colors text-center">
                  <td className="sticky left-[35px] xl:left-[45px] bg-slate-50 border border-slate-200 p-1 xl:p-1.5 font-bold text-slate-800 text-left z-10 shadow-xs">
                    결로지수 (Pt)
                  </td>
                  {mockData.map((item) => {
                    const indexVal = item.am.dewIndex;
                    let cellColor = "bg-[#d1fae5] text-[#065f46]"; // Safe
                    if (indexVal > 80) cellColor = "bg-[#ffe4e6] text-[#9f1239] font-black animate-pulse"; // Danger
                    else if (indexVal > 60) cellColor = "bg-[#fef3c7] text-[#92400e] font-bold"; // Caution

                    return (
                      <td 
                        key={item.day} 
                        onClick={() => setSelectedDay(item.day)}
                        className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer font-semibold transition-all hover:opacity-80 ${cellColor} ${
                          item.day === selectedDay ? "ring-2 ring-blue-500 ring-offset-1 z-10" : ""
                        }`}
                        title={`${item.day}일 오전 결로지수: ${indexVal} Pt`}
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
                  <td colSpan={mockData.length > 0 ? mockData.length : 31} className="p-0"></td>
                </tr>


                {/* 2. 오후 Group */}
                
                {/* 대기온도 */}
                <tr className="hover:bg-slate-50 transition-colors text-center">
                  <td className="sticky left-0 bg-slate-100 font-bold border border-slate-200 p-1 xl:p-1.5 text-slate-700 z-10 text-center shadow-xs" rowSpan={4}>
                    오후<br/><span className="text-[10px] font-mono text-slate-500 font-normal">(PM)</span>
                  </td>
                  <td className="sticky left-[35px] xl:left-[45px] bg-slate-50 border border-slate-200 p-1 xl:p-1.5 font-semibold text-slate-700 text-left z-10 shadow-xs">
                    대기온도 (℃)
                  </td>
                  {mockData.map((item) => (
                    <td 
                      key={item.day} 
                      onClick={() => setSelectedDay(item.day)}
                      className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-colors ${
                        item.day === selectedDay ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
                      }`}
                    >
                      {item.pm.airTemp.toFixed(1)}
                    </td>
                  ))}
                </tr>

                {/* 표면온도 */}
                <tr className="hover:bg-slate-50 transition-colors text-center">
                  <td className="sticky left-[35px] xl:left-[45px] bg-slate-50 border border-slate-200 p-1 xl:p-1.5 font-semibold text-slate-700 text-left z-10 shadow-xs">
                    코일표면온도 (℃)
                  </td>
                  {mockData.map((item) => (
                    <td 
                      key={item.day} 
                      onClick={() => setSelectedDay(item.day)}
                      className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-colors ${
                        item.day === selectedDay ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
                      }`}
                    >
                      {item.pm.surfaceTemp.toFixed(1)}
                    </td>
                  ))}
                </tr>

                {/* 상대습도 */}
                <tr className="hover:bg-slate-50 transition-colors text-center">
                  <td className="sticky left-[35px] xl:left-[45px] bg-slate-50 border border-slate-200 p-1 xl:p-1.5 font-semibold text-slate-700 text-left z-10 shadow-xs">
                    상대습도 (%)
                  </td>
                  {mockData.map((item) => (
                    <td 
                      key={item.day} 
                      onClick={() => setSelectedDay(item.day)}
                      className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer transition-colors ${
                        item.day === selectedDay ? "bg-blue-50/70 font-semibold border-2 border-blue-400" : ""
                      }`}
                    >
                      {item.pm.humidity}
                    </td>
                  ))}
                </tr>

                {/* 결로지수 */}
                <tr className="hover:bg-slate-50 transition-colors text-center">
                  <td className="sticky left-[35px] xl:left-[45px] bg-slate-50 border border-slate-200 p-1 xl:p-1.5 font-bold text-slate-800 text-left z-10 shadow-xs">
                    결로지수 (Pt)
                  </td>
                  {mockData.map((item) => {
                    const indexVal = item.pm.dewIndex;
                    let cellColor = "bg-[#d1fae5] text-[#065f46]"; // Safe
                    if (indexVal > 80) cellColor = "bg-[#ffe4e6] text-[#9f1239] font-black animate-pulse"; // Danger
                    else if (indexVal > 60) cellColor = "bg-[#fef3c7] text-[#92400e] font-bold"; // Caution

                    return (
                      <td 
                        key={item.day} 
                        onClick={() => setSelectedDay(item.day)}
                        className={`border border-slate-200 p-1 xl:p-1.5 font-mono cursor-pointer font-semibold transition-all hover:opacity-80 ${cellColor} ${
                          item.day === selectedDay ? "ring-2 ring-blue-500 ring-offset-1 z-10" : ""
                        }`}
                        title={`${item.day}일 오후 결로지수: ${indexVal} Pt`}
                      >
                        {indexVal}
                      </td>
                    );
                  })}
                </tr>

              </tbody>
            </table>
          </div>

          {/* User Instruction block inside Table */}
          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>※ 좌우로 스크롤하여 전체 {mockData.length}일 대장을 확인하실 수 있습니다.</span>
            <span className="hidden sm:inline">Copyright © (주)대성스틸 Smart Factory. All rights reserved.</span>
          </div>
        </section>

      </main>

      {/* New Data Registration Modal with Animation */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" id="entry_modal_overlay">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Box */}
