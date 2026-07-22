const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const strToRemove = `<p className="text-xs text-slate-400 text-center mt-3 font-mono">
            * 차트상의 수직 파선은 현재 선택되어 상단 카드로 시각화 중인 일자({selectedDay}일)를 표시합니다.
          </p>`;

if (content.includes(strToRemove)) {
    content = content.replace(strToRemove, '');
    fs.writeFileSync('src/App.tsx', content);
    console.log("Removed annotation");
} else {
    console.log("Annotation not found!");
}
