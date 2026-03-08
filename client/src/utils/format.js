// Format angka jadi Rupiah
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format tanggal jadi "15 Jan 2025"
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

// Format tanggal untuk input type="date" — "2025-01-15"
export const toInputDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};