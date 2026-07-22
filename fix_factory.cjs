const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add modalFactory state
content = content.replace(
  'const [isModalOpen, setIsModalOpen] = useState<boolean>(false);',
  `const [isModalOpen, setIsModalOpen] = useState<boolean>(false);\n  const [modalFactory, setModalFactory] = useState<'평택포승공장' | '아산인주공장'>('평택포승공장');`
);

// 2. Set modalFactory when opening modal
content = content.replace(
  'setIsModalOpen(true);',
  'setModalFactory(selectedFactory);\n                  setIsModalOpen(true);'
);

// 3. Update payload and selectedFactory in handleFormSubmit
content = content.replace(
  `sheetName: selectedFactory === '평택포승공장' ? 'Data' : 'Data2',`,
  `sheetName: modalFactory === '평택포승공장' ? 'Data' : 'Data2',`
);
content = content.replace(
  `factory: selectedFactory,`,
  `factory: modalFactory,`
);

// 4. Update the optimistic update block to ONLY update if modalFactory === selectedFactory
// Actually, it's easier to just fetch new data for selectedFactory, but the requirement specifically says to map the sheetName and factory to the backend. It doesn't say what to do with optimistic update if factory is different, but checking if modalFactory === selectedFactory is safest.
// "2. 상태 연동 및 Payload 수정: 폼 제출 시(POST), 모달 안에서 최종적으로 선택된 공장이 '아산인주공장'이면 sheetName: 'Data2', '평택포승공장'이면 sheetName: 'Data'로 매핑하고, factory 파라미터에도 정확한 한글 공장 명칭을 담아서 백엔드로 전송하게 해줘."

// 5. Add factory selector in modal UI
const formStart = '<form onSubmit={handleFormSubmit} className="p-6 space-y-4">';
const factorySelector = `<form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                {/* 0. Factory Select */}
                <div className="space-y-1.5 mb-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Factory className="w-4 h-4 text-blue-600" />
                    공장 선택 (Factory Select)
                  </label>
                  <select
                    value={modalFactory}
                    onChange={(e) => setModalFactory(e.target.value as '평택포승공장' | '아산인주공장')}
                    className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-800 transition-all font-mono appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23475569%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%276 9 12 15 18 9%27%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.2em 1.2em' }}
                  >
                    <option value="평택포승공장">평택포승공장</option>
                    <option value="아산인주공장">아산인주공장</option>
                  </select>
                </div>`;

content = content.replace(formStart, factorySelector);

// 6. Optimistic update check: Only update if modalFactory === selectedFactory
content = content.replace(
  'if (adjustedDate.getFullYear() === selectedYear && (adjustedDate.getMonth() + 1) === selectedMonth) {',
  'if (modalFactory === selectedFactory && adjustedDate.getFullYear() === selectedYear && (adjustedDate.getMonth() + 1) === selectedMonth) {'
);

fs.writeFileSync('src/App.tsx', content);
