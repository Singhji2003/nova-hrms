export function exportToCSV(filename, dataArray) {
  if (!dataArray || !dataArray.length) {
    alert('No data available to export!');
    return;
  }

  const headers = Object.keys(dataArray[0]).filter(k => !k.startsWith('_') && k !== '__v');
  const csvRows = [];

  // Add Header Row
  csvRows.push(headers.join(','));

  // Add Data Rows
  for (const row of dataArray) {
    const values = headers.map(header => {
      const val = row[header];
      if (typeof val === 'object' && val !== null) {
        return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      }
      const escaped = ('' + (val ?? '')).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
