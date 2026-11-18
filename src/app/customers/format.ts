const LOCALE = 'ar-EG-u-nu-latn'; // Arabic text, Latin digits (matches the dashboard)

export const formatDate = (iso: string | undefined, withTime = false): string => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(withTime ? { hour: 'numeric', minute: '2-digit' } : {}),
  });
};

export const formatMoney = (n: number): string => n.toLocaleString('en-US');

export const initials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join(' ');

/** "منذ 12 يوم" / "بعد 5 أيام" style label. */
export const relativeDays = (iso: string | undefined): string => {
  if (!iso) return '—';
  const diff = Math.round((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (diff === 0) return 'اليوم';
  const abs = Math.abs(diff);
  const unit = abs === 1 ? 'يوم' : abs <= 10 ? 'أيام' : 'يوم';
  return diff < 0 ? `منذ ${abs} ${unit}` : `بعد ${abs} ${unit}`;
};

export const toWhatsApp = (phone: string): string => {
  const digits = phone.replace(/\D/g, '').replace(/^0/, '20');
  return `https://wa.me/${digits}`;
};
