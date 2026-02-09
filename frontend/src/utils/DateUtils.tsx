export interface AcademicYear {
    label: string;
    start: Date;
    end: Date;
  }
  
  export interface MonthData {
    month: string;
    monthIndex: number;
    days: { day: string; date: string; isSunday: boolean }[];
  }
  
  export const getAcademicYears = (): AcademicYear[] => {
    const currentYear = new Date().getFullYear();
    const startYear = 2022;
    const years: AcademicYear[] = [];
  
    for (let year = startYear; year <= currentYear; year++) {
      const start = new Date(year, 3, 1); // April
      const end = new Date(year + 1, 2, 31); // March
      years.push({
        label: `${year}-${year + 1}`,
        start,
        end,
      });
    }
  
    return years;
  };
  
  export const getMonthDays = (year: number, month: number): MonthData => {
    const date = new Date(year, month, 1);
    const monthName = date.toLocaleString('default', { month: 'long' });
    const days: { day: string; date: string; isSunday: boolean }[] = [];
  
    while (date.getMonth() === month) {
      const day = date.toLocaleString('default', { weekday: 'short' });
      const isSunday = date.getDay() === 0;
      days.push({
        day,
        date: formatDate(date),
        isSunday,
      });
      date.setDate(date.getDate() + 1);
    }
  
    return {
      month: monthName,
      monthIndex: month,
      days,
    };
  };
  
  export const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  export const getCurrentAcademicYear = (): AcademicYear => {
    const today = new Date();
    const year = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
    return {
      label: `${year}-${year + 1}`,
      start: new Date(year, 3, 1),
      end: new Date(year + 1, 2, 31),
    };
  };
  