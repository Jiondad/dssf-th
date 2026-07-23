const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const stateRegex = /const \[isSubmitting, setIsSubmitting\] = useState<boolean>\(false\);/;
app = app.replace(stateRegex, "const [isSubmitting, setIsSubmitting] = useState<boolean>(false);\n  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);\n\n  const showToast = (message: string, type: 'success' | 'error' = 'success') => {\n    setToast({ message, type });\n    setTimeout(() => setToast(null), 3000);\n  };");

app = app.replace('alert("데이터가 성공적으로 등록되었습니다.");', 'showToast("데이터가 성공적으로 등록되었습니다.", "success");');
app = app.replace('alert("데이터 전송 중 오류가 발생했습니다.");', 'showToast("데이터 전송 중 오류가 발생했습니다.", "error");');

const toastJSX = `
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={\`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-xl border flex items-center gap-3 \${
              toast.type === 'success' 
                ? 'bg-white border-emerald-200 text-emerald-800' 
                : 'bg-white border-rose-200 text-rose-800'
            }\`}
          >
            {toast.type === 'success' ? (
              <div className="bg-emerald-100 p-1 rounded-full"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
            ) : (
              <div className="bg-rose-100 p-1 rounded-full"><AlertTriangle className="w-5 h-5 text-rose-600" /></div>
            )}
            <span className="font-semibold text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;

app = app.replace('    </div>\n  );\n}', toastJSX);

fs.writeFileSync('src/App.tsx', app);
console.log("App.tsx toast modified");
