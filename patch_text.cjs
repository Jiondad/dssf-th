const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldUseEffect = `  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoadingData(true);
      
      // Determine the simulated sheet name based on the factory
      const sheetName = selectedFactory === '평택포승공장' ? 'Data' : 'Data2';
      
      const newData = await fetchSpreadsheetData(sheetName, selectedYear, selectedMonth);
      if (isMounted) {
        setSheetData(newData);
        
        // Ensure selectedDay is within the valid range of the new data
        setSelectedDay(prev => {
          const maxDay = newData.length > 0 ? Math.max(...newData.map(d => d.day)) : 1;
          const minDay = newData.length > 0 ? Math.min(...newData.map(d => d.day)) : 1;
          if (prev > maxDay) return maxDay;
          if (prev < minDay) return minDay;
          return prev;
        });

        setIsLoadingData(false);
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, [selectedYear, selectedMonth, selectedFactory]);`;

const newUseEffect = `  useEffect(() => {
    let isMounted = true;
    let timer: ReturnType<typeof setInterval>;

    const loadData = async (isBackground = false) => {
      if (!isBackground) {
        setIsLoadingData(true);
      }
      
      try {
        // Determine the simulated sheet name based on the factory
        const sheetName = selectedFactory === '평택포승공장' ? 'Data' : 'Data2';
        
        const newData = await fetchSpreadsheetData(sheetName, selectedYear, selectedMonth);
        
        if (isMounted) {
          setSheetData(newData);
          
          // Ensure selectedDay is within the valid range of the new data
          if (!isBackground) {
            setSelectedDay(prev => {
              const maxDay = newData.length > 0 ? Math.max(...newData.map(d => d.day)) : 1;
              const minDay = newData.length > 0 ? Math.min(...newData.map(d => d.day)) : 1;
              if (prev > maxDay) return maxDay;
              if (prev < minDay) return minDay;
              return prev;
            });
            setIsLoadingData(false);
          }
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        if (isMounted && !isBackground) {
          setIsLoadingData(false);
        }
      }
    };
    
    // Initial load
    loadData();
    
    // Auto-polling every 10 minutes (600,000 ms)
    timer = setInterval(() => {
      loadData(true); // silent background load
    }, 600000);
    
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [selectedYear, selectedMonth, selectedFactory]);`;

content = content.replace(oldUseEffect, newUseEffect);
fs.writeFileSync('src/App.tsx', content);
console.log("Patched polling");
