
export type DateFormatType = 'dd-mm-yyyy' | 'mm-dd-yyyy' | 'yyyy-mm-dd';

export const formatDateTime = (
  dateString: string,
  dateFormat: DateFormatType = 'dd-mm-yyyy',
  timeFlag?: 'time',
  meridiemFlag?: 'meridiem'
): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let formattedDate = '';
  switch (dateFormat) {
    case 'dd-mm-yyyy':
      formattedDate = `${day}-${month}-${year}`;
      break;
    case 'mm-dd-yyyy':
      formattedDate = `${month}-${day}-${year}`;
      break;
    case 'yyyy-mm-dd':
      formattedDate = `${year}-${month}-${day}`;
      break;
    default:
      formattedDate = `${day}-${month}-${year}`;
  }

  // Show time only if 'time' flag is passed and time is valid in input string
  let formattedTime = '';
  if (timeFlag === 'time' && dateString.includes('T')) {
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    // const seconds = String(date.getSeconds()).padStart(2, '0');

    if (meridiemFlag === 'meridiem') {
      const hour12 = hours % 12 || 12;
      const ampm = hours >= 12 ? 'pm' : 'am';
      formattedTime = `${hour12}:${minutes} ${ampm}`;
      //   formattedTime = `${hour12}:${minutes}:${seconds} ${ampm}`;
    } else {
      formattedTime = `${String(hours).padStart(2, '0')}:${minutes}`;
    }
  }

  return [formattedDate, formattedTime].filter(Boolean).join(', ');
};


export function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}


export function getSuffixOnly(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return (s[(v - 20) % 10] || s[v] || s[0]);
}

