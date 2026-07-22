const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add FACTORY_SHEET_MAP
const importStatement = `import { DailyRecord, SensorKey } from "./types";`;
const factoryMapStatement = `\nconst FACTORY_SHEET_MAP = { '평택포승공장': 'Data', '아산인주공장': 'Data2' } as const;\n`;
content = content.replace(importStatement, importStatement + factoryMapStatement);

// 2. Replace selectedFactory === '평택포승공장' ? 'Data' : 'Data2' in loadData
content = content.replace(
  `const sheetName = selectedFactory === '평택포승공장' ? 'Data' : 'Data2';`,
  `const sheetName = FACTORY_SHEET_MAP[selectedFactory];`
);

// 3. handleFormSubmit modifications
const oldHandleFormSubmitStart = `      const payload = {
        sheetName: modalFactory === '평택포승공장' ? 'Data' : 'Data2',`;
const newHandleFormSubmitStart = `      const payload = {
        sheetName: FACTORY_SHEET_MAP[modalFactory],`;
content = content.replace(oldHandleFormSubmitStart, newHandleFormSubmitStart);

// We need to replace from optimistic update to the end of handleFormSubmit
const oldUpdateBlock = `      // Optimistic Update
      if (modalFactory === selectedFactory && adjustedDate.getFullYear() === selectedYear && (adjustedDate.getMonth() + 1) === selectedMonth) {
        setSheetData(prev => {
          const newData = [...prev];
          const existingIdx = newData.findIndex(r => r.day === parsedDay);
          const updatedRecord = {
            day: parsedDay,
            am: {
              airTemp: payload.amAirTemp,
              surfaceTemp: payload.amSurfaceTemp,
              humidity: payload.amHumidity,
              dewIndex: payload.amCondIndex
            },
            pm: {
              airTemp: payload.pmAirTemp,
              surfaceTemp: payload.pmSurfaceTemp,
              humidity: payload.pmHumidity,
              dewIndex: payload.pmCondIndex
            }
          };
          
          if (existingIdx !== -1) {
            newData[existingIdx] = updatedRecord;
          } else {
            newData.push(updatedRecord);
            newData.sort((a, b) => a.day - b.day);
          }
          return newData;
        });
        setSelectedDay(parsedDay);
      }

      // POST to Google Apps Script API
      await fetch("https://script.google.com/macros/s/AKfycbwGRuza0OfCDR-sQA3l3yu_aCAIdJPtKWobL8PwGVOsRDGYCW3O-EGo5oNSeGJKILtU4g/exec", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      alert("데이터가 성공적으로 등록되었습니다.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("데이터 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
      // Data Refetch for 100% Sync
      setIsLoadingData(true);
      try {
        const sheetName = selectedFactory === '평택포승공장' ? 'Data' : 'Data2';
        const newData = await fetchSpreadsheetData(sheetName, selectedYear, selectedMonth);
        setSheetData(newData);
      } catch (err) {
        console.error("Failed to refetch data:", err);
      }
      setIsLoadingData(false);
    }`;

const newUpdateBlock = `      // POST to Google Apps Script API
      const response = await fetch("https://script.google.com/macros/s/AKfycbwGRuza0OfCDR-sQA3l3yu_aCAIdJPtKWobL8PwGVOsRDGYCW3O-EGo5oNSeGJKILtU4g/exec", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }

      // Local State Update on Success
      if (modalFactory === selectedFactory && adjustedDate.getFullYear() === selectedYear && (adjustedDate.getMonth() + 1) === selectedMonth) {
        setSheetData(prev => {
          const newData = [...prev];
          const existingIdx = newData.findIndex(r => r.day === parsedDay);
          const updatedRecord = {
            day: parsedDay,
            am: {
              airTemp: payload.amAirTemp,
              surfaceTemp: payload.amSurfaceTemp,
              humidity: payload.amHumidity,
              dewIndex: payload.amCondIndex
            },
            pm: {
              airTemp: payload.pmAirTemp,
              surfaceTemp: payload.pmSurfaceTemp,
              humidity: payload.pmHumidity,
              dewIndex: payload.pmCondIndex
            }
          };
          
          if (existingIdx !== -1) {
            newData[existingIdx] = updatedRecord;
          } else {
            newData.push(updatedRecord);
            newData.sort((a, b) => a.day - b.day);
          }
          return newData;
        });
        setSelectedDay(parsedDay);
      }

      alert("데이터가 성공적으로 등록되었습니다.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("데이터 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }`;

if (content.includes(oldUpdateBlock)) {
  content = content.replace(oldUpdateBlock, newUpdateBlock);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Patched App.tsx successfully!");
} else {
  console.log("Could not find the target block to replace.");
}
