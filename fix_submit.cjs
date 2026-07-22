const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldSubmit = `      const payload = {
        sheetName: selectedFactory === '평택포승공장' ? 'Data' : 'Data2',
        date: formData.date,
        amAirTemp,
        amSurfaceTemp,
        amHumidity,
        amCondIndex: calculateLocalDewIndex(amAirTemp, amSurfaceTemp, amHumidity),
        pmAirTemp,
        pmSurfaceTemp,
        pmHumidity,
        pmCondIndex: calculateLocalDewIndex(pmAirTemp, pmSurfaceTemp, pmHumidity)
      };

      // POST to Google Apps Script API
      await fetch("https://script.google.com/macros/s/AKfycbwGRuza0OfCDR-sQA3l3yu_aCAIdJPtKWobL8PwGVOsRDGYCW3O-EGo5oNSeGJKILtU4g/exec", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      // Reload Data
      setIsLoadingData(true);
      const sheetName = selectedFactory === '평택포승공장' ? 'Data' : 'Data2';
      const newData = await fetchSpreadsheetData(sheetName, selectedYear, selectedMonth);
      setMockData(newData);
      
      // Update selectedDay if needed
      const dateObj = new Date(formData.date);
      const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(dateObj.getTime() + userTimezoneOffset);
      if (adjustedDate.getFullYear() === selectedYear && (adjustedDate.getMonth() + 1) === selectedMonth) {
        setSelectedDay(adjustedDate.getDate());
      }
      
      setIsLoadingData(false);
      alert("데이터가 성공적으로 등록되었습니다.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("데이터 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };`;

const newSubmit = `      const payload = {
        sheetName: selectedFactory === '평택포승공장' ? 'Data' : 'Data2',
        factory: selectedFactory,
        date: formData.date,
        amAirTemp,
        amSurfaceTemp,
        amHumidity,
        amCondIndex: calculateLocalDewIndex(amAirTemp, amSurfaceTemp, amHumidity),
        pmAirTemp,
        pmSurfaceTemp,
        pmHumidity,
        pmCondIndex: calculateLocalDewIndex(pmAirTemp, pmSurfaceTemp, pmHumidity)
      };

      const dateObj = new Date(formData.date);
      const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(dateObj.getTime() + userTimezoneOffset);
      const parsedDay = adjustedDate.getDate();

      // Optimistic Update
      if (adjustedDate.getFullYear() === selectedYear && (adjustedDate.getMonth() + 1) === selectedMonth) {
        setMockData(prev => {
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
        setMockData(newData);
      } catch (err) {
        console.error("Failed to refetch data:", err);
      }
      setIsLoadingData(false);
    }
  };`;

content = content.replace(oldSubmit, newSubmit);
fs.writeFileSync('src/App.tsx', content);
