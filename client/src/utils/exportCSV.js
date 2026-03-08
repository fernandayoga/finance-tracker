export const exportToCSV = (transactions) => {
  if (!transactions.length) return;

  const headers = ['Date', 'Type', 'Category', 'Amount', 'Note'];

  const rows = transactions.map((tx) => [
    new Date(tx.date).toLocaleDateString('id-ID'),
    tx.type,
    tx.category?.name || '',
    tx.amount,
    tx.note || '',
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((val) => `"${val}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href     = url;
  link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();

  URL.revokeObjectURL(url);
};