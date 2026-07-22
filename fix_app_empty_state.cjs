
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
        <h2 className="text-[22px] font-bold text-center text-slate-900 tracking-tight mt-[50px]">{selectedMonth}월 온습도 및 결로지수 관리 대장 - {selectedFactory}</h2>
        
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
