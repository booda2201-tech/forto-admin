import type { IconName } from '../shared/icon/icon.component';
export type CellKind = 'text' | 'strong' | 'mono' | 'money' | 'badge';
export type BadgeTone = 'emerald' | 'amber' | 'sky' | 'rose' | 'gray';

/** RGB triplets (space separated) used for `rgb(var(--tone))` glows. */
export const TONE_RGB: Record<BadgeTone, string> = {
  emerald: '112 190 150',
  amber: '226 170 80',
  sky: '140 163 190',
  rose: '205 108 118',
  gray: '148 153 163',
};

export interface Column {
  key: string;
  label: string;
  kind?: CellKind;
  /** Not shown as a table column; only in the row's details popup (and hidden on phone cards). */
  detailOnly?: boolean;
  /** Render a coloured initial-avatar next to the value (for "strong" name columns). */
  avatar?: boolean;
}

export interface TableConfig {
  title: string;
  subtitle: string;
  columns: Column[];
  rows: Record<string, string | number>[];
  /** Creative (non-table) presentation used by the "smart" view. */
  layout?: 'cards' | 'products' | 'timeline' | 'kanban';
  /** Row field whose values split the data into filterable groups (see CENTERS). */
  groupBy?: string;
  /** Maps a badge cell value to its colour. */
  badges?: Record<string, BadgeTone>;
}

// ---------- Overview ----------
export const performance = [
  { month: 'يناير', revenue: 71000, visits: 610 },
  { month: 'فبراير', revenue: 78500, visits: 655 },
  { month: 'مارس', revenue: 84200, visits: 702 },
  { month: 'أبريل', revenue: 96800, visits: 780 },
  { month: 'مايو', revenue: 104300, visits: 834 },
  { month: 'يونيو', revenue: 115900, visits: 901 },
  { month: 'يوليو', revenue: 128450, visits: 968 },
];

export const topServices = [
  { name: 'غسيل خارجي وداخلي', count: 214, share: 100 },
  { name: 'تلميع ونانو سيراميك', count: 142, share: 66 },
  { name: 'تغيير زيت وفلتر', count: 118, share: 55 },
  { name: 'تنظيف مقاعد وسجاد', count: 87, share: 41 },
  { name: 'حماية PPF', count: 39, share: 18 },
];

// ---------- Services ----------
const services: TableConfig['rows'] = [
  // ----- فورتو كار كير: الغسيل والتلميع -----
  { name: 'غسيل خارجي', center: 'فورتو كار كير', image: 'brand/place-angle.jpg', imgPos: '50% 52%', category: 'غسيل', duration: '25 دقيقة', price: 120, status: 'متاحة' },
  { name: 'غسيل خارجي وداخلي', center: 'فورتو كار كير', image: 'brand/place-front.jpg', imgPos: '50% 45%', category: 'غسيل', duration: '50 دقيقة', price: 250, status: 'متاحة' },
  { name: 'غسيل كيميائي كامل', center: 'فورتو كار كير', image: 'brand/place-aerial.jpg', imgPos: '50% 45%', category: 'غسيل', duration: '90 دقيقة', price: 450, status: 'متاحة' },
  { name: 'غسيل محرك', center: 'فورتو كار كير', image: 'brand/detailing-coupe.jpg', imgPos: '50% 10%', category: 'غسيل', duration: '30 دقيقة', price: 180, status: 'متاحة' },
  { name: 'إزالة الأسمنت والقطران', center: 'فورتو كار كير', image: 'brand/detailing-coupe.jpg', imgPos: '85% 14%', category: 'تنظيف', duration: '60 دقيقة', price: 350, status: 'متاحة' },
  { name: 'تنظيف مقاعد وسجاد', center: 'فورتو كار كير', image: 'brand/place-angle.jpg', imgPos: '8% 52%', category: 'تنظيف', duration: '2 ساعة', price: 700, status: 'متاحة' },
  { name: 'تلميع بالشمع', center: 'فورتو كار كير', image: 'brand/detailing-coupe.jpg', imgPos: '50% 86%', category: 'تلميع', duration: '90 دقيقة', price: 600, status: 'متاحة' },
  { name: 'تلميع وإزالة الخدوش', center: 'فورتو كار كير', image: 'brand/detailing-coupe.jpg', imgPos: '12% 12%', category: 'تلميع', duration: '3 ساعات', price: 1800, status: 'متاحة' },
  { name: 'تلميع كشافات', center: 'فورتو كار كير', image: 'brand/detailing-coupe.jpg', imgPos: '90% 72%', category: 'تلميع', duration: '45 دقيقة', price: 300, status: 'موقوفة' },

  // ----- فورتو سيرفيس: الميكانيكا والصيانة -----
  { name: 'تغيير زيت وفلتر', center: 'فورتو سيرفيس', image: 'brand/workshop.jpg', imgPos: '50% 62%', category: 'صيانة', duration: '40 دقيقة', price: 450, status: 'متاحة' },
  { name: 'فحص كمبيوتر شامل', center: 'فورتو سيرفيس', image: 'brand/workshop.jpg', imgPos: '50% 14%', category: 'صيانة', duration: '30 دقيقة', price: 350, status: 'متاحة' },
  { name: 'فحص وصيانة المحرك', center: 'فورتو سيرفيس', image: 'brand/workshop.jpg', imgPos: '50% 52%', category: 'صيانة', duration: '2 ساعة', price: 900, status: 'متاحة' },
  { name: 'صيانة الفرامل', center: 'فورتو سيرفيس', image: 'brand/workshop.jpg', imgPos: '62% 84%', category: 'صيانة', duration: '2 ساعة', price: 1300, status: 'متاحة' },
  { name: 'العفشة ونظام التعليق', center: 'فورتو سيرفيس', image: 'brand/workshop.jpg', imgPos: '28% 48%', category: 'صيانة', duration: '4 ساعات', price: 2400, status: 'بحجز مسبق' },

  // ----- فورتو بروتكشن: السمكرة والحماية -----
  { name: 'عازل حراري للزجاج', center: 'فورتو بروتكشن', image: 'brand/paint-booth.jpg', imgPos: '50% 44%', category: 'حماية', duration: '3 ساعات', price: 1800, status: 'متاحة' },
  { name: 'نانو سيراميك', center: 'فورتو بروتكشن', image: 'brand/paint-booth.jpg', imgPos: '50% 62%', category: 'حماية', duration: '4 ساعات', price: 3500, status: 'متاحة' },
  { name: 'سمكرة ودهان (دوكو)', center: 'فورتو بروتكشن', image: 'brand/paint-booth.jpg', imgPos: '50% 24%', category: 'حماية', duration: '3 أيام', price: 6500, status: 'بحجز مسبق' },
  { name: 'حماية PPF كاملة', center: 'فورتو بروتكشن', image: 'brand/paint-booth.jpg', imgPos: '50% 72%', category: 'حماية', duration: '2 يوم', price: 18000, status: 'بحجز مسبق' },
];

// ---------- Customers ----------
const customers: TableConfig['rows'] = [
  { name: 'أحمد محمود', phone: '01012345678', car: 'تويوتا كورولا 2022', plate: 'ق ع س 4521', visits: 14, status: 'VIP' },
  { name: 'محمد السيد', phone: '01123456789', car: 'هيونداي إلنترا 2021', plate: 'أ ب ج 1837', visits: 9, status: 'نشط' },
  { name: 'سارة علي', phone: '01234567890', car: 'كيا سبورتاج 2023', plate: 'م ن ه 7720', visits: 6, status: 'نشط' },
  { name: 'خالد إبراهيم', phone: '01098765432', car: 'نيسان صني 2020', plate: 'ر ط ي 3094', visits: 3, status: 'جديد' },
  { name: 'منى حسن', phone: '01556677889', car: 'بي إم دبليو X3 2022', plate: 'ص ل ك 9916', visits: 17, status: 'VIP' },
  { name: 'يوسف عادل', phone: '01011223344', car: 'شيفروليه أوبترا 2019', plate: 'د ع ف 5603', visits: 2, status: 'جديد' },
  { name: 'نورهان فاروق', phone: '01177889900', car: 'ميتسوبيشي لانسر 2018', plate: 'ح ق و 2278', visits: 5, status: 'نشط' },
  { name: 'عمر حسام', phone: '01299887766', car: 'مرسيدس C200 2021', plate: 'ز س ش 6841', visits: 11, status: 'VIP' },
];

// ---------- Visits ----------
const visits: TableConfig['rows'] = [
  { id: '#V-1048', customer: 'أحمد محمود', phone: '01012345678', car: 'تويوتا كورولا', plate: 'ق ع س 4521', service: 'غسيل خارجي وداخلي', center: 'فورتو كار كير', date: '2026-11-17', time: '09:15 ص', tech: 'م. حسن', payment: 'نقدي', total: 250, status: 'قيد التنفيذ' },
  { id: '#V-1047', customer: 'منى حسن', phone: '01556677889', car: 'بي إم دبليو X3', plate: 'ص ل ك 9916', service: 'نانو سيراميك', center: 'فورتو بروتكشن', date: '2026-11-17', time: '10:40 ص', tech: 'م. طارق', payment: 'فيزا', total: 3500, status: 'قيد التنفيذ' },
  { id: '#V-1046', customer: 'محمد السيد', phone: '01123456789', car: 'هيونداي إلنترا', plate: 'أ ب ج 1837', service: 'تغيير زيت وفلتر', center: 'فورتو سيرفيس', date: '2026-11-17', time: '08:30 ص', tech: 'م. إسلام', payment: 'نقدي', total: 450, status: 'مكتملة' },
  { id: '#V-1045', customer: 'سارة علي', phone: '01234567890', car: 'كيا سبورتاج', plate: 'م ن ه 7720', service: 'تلميع بالشمع', center: 'فورتو كار كير', date: '2026-11-16', time: '01:20 م', tech: 'م. حسن', payment: 'فيزا', total: 600, status: 'مكتملة' },
  { id: '#V-1044', customer: 'عمر حسام', phone: '01299887766', car: 'مرسيدس C200', plate: 'ز س ش 6841', service: 'غسيل محرك', center: 'فورتو كار كير', date: '2026-11-16', time: '11:00 ص', tech: 'م. حسن', payment: 'محفظة', total: 180, status: 'مكتملة' },
  { id: '#V-1043', customer: 'خالد إبراهيم', phone: '01098765432', car: 'نيسان صني', plate: 'ر ط ي 3094', service: 'تنظيف مقاعد وسجاد', center: 'فورتو كار كير', date: '2026-11-15', time: '03:45 م', tech: 'م. مصطفى', payment: 'نقدي', total: 700, status: 'مكتملة' },
  { id: '#V-1042', customer: 'يوسف عادل', phone: '01011223344', car: 'شيفروليه أوبترا', plate: 'د ع ف 5603', service: 'غسيل خارجي', center: 'فورتو كار كير', date: '2026-11-15', time: '12:10 م', tech: '—', payment: '—', total: 120, status: 'ملغاة' },
  { id: '#V-1041', customer: 'نورهان فاروق', phone: '01177889900', car: 'ميتسوبيشي لانسر', plate: 'ح ق و 2278', service: 'تلميع كشافات', center: 'فورتو كار كير', date: '2026-11-14', time: '02:30 م', tech: 'م. مصطفى', payment: 'تحويل', total: 300, status: 'مكتملة' },
];

// ---------- Bookings ----------
const bookings: TableConfig['rows'] = [
  { id: '#B-512', customer: 'أحمد محمود', service: 'تلميع بالشمع', date: '2026-11-18', time: '10:00 ص', status: 'مؤكد' },
  { id: '#B-513', customer: 'سارة علي', service: 'غسيل خارجي وداخلي', date: '2026-11-18', time: '12:30 م', status: 'مؤكد' },
  { id: '#B-514', customer: 'عمر حسام', service: 'حماية PPF كاملة', date: '2026-11-19', time: '09:00 ص', status: 'بانتظار التأكيد' },
  { id: '#B-515', customer: 'منى حسن', service: 'تنظيف مقاعد وسجاد', date: '2026-11-19', time: '02:00 م', status: 'مؤكد' },
  { id: '#B-516', customer: 'خالد إبراهيم', service: 'تغيير زيت وفلتر', date: '2026-11-20', time: '11:00 ص', status: 'بانتظار التأكيد' },
  { id: '#B-517', customer: 'يوسف عادل', service: 'غسيل خارجي', date: '2026-11-20', time: '04:30 م', status: 'ملغي' },
  { id: '#B-518', customer: 'نورهان فاروق', service: 'نانو سيراميك', date: '2026-11-21', time: '10:00 ص', status: 'مؤكد' },
];

// ---------- Products ----------
const products: TableConfig['rows'] = [
  { name: 'شامبو غسيل مركز 5 لتر', sku: 'SH-005', image: 'products/forto-shampoo.jpg', category: 'مستلزمات', price: 340, stock: 42, status: 'متوفر' },
  { name: 'ملمع تابلوه سيليكون', sku: 'DP-120', image: 'products/forto-dash-polish.jpg', category: 'مستلزمات', price: 95, stock: 8, status: 'كمية قليلة' },
  { name: 'زيت محرك 5W-30 (4 لتر)', sku: 'OL-530', image: 'products/forto-engine-oil.jpg', category: 'زيوت', price: 780, stock: 27, status: 'متوفر' },
  { name: 'فلتر زيت أصلي', sku: 'FL-210', image: 'products/forto-oil-filter.jpg', category: 'قطع غيار', price: 150, stock: 0, status: 'نفد' },
  { name: 'إطار تويو 205/55 R16', sku: 'TY-1655', image: 'products/forto-tire.jpg', category: 'إطارات', price: 2900, stock: 12, status: 'متوفر' },
  { name: 'غطاء مقاعد جلد', sku: 'SC-310', image: 'products/forto-seat-cover.jpg', category: 'إكسسوارات', price: 1850, stock: 5, status: 'كمية قليلة' },
  { name: 'معطر سيارة فاخر', sku: 'AF-044', image: 'products/forto-air-freshener.jpg', category: 'إكسسوارات', price: 120, stock: 60, status: 'متوفر' },
  { name: 'كاميرا خلفية HD', sku: 'CM-700', image: 'products/forto-camera.jpg', category: 'إكسسوارات', price: 1100, stock: 14, status: 'متوفر' },
];

/** The three Forto centers (keyed by the Arabic label stored in row.center). */
export interface CenterMeta {
  en: string;
  tagline: string;
  desc: string;
  icon: IconName;
  rgb: string;
}
export const CENTERS: Record<string, CenterMeta> = {
  'فورتو كار كير': {
    en: 'Forto Car Care',
    tagline: 'الغسيل والتلميع',
    desc: 'عربيتك تطلع من عندنا نضيفة ولمّاعة، من المحرك للجنوط للداخلية.',
    icon: 'droplets',
    rgb: '247 147 30',
  },
  'فورتو سيرفيس': {
    en: 'Forto Service',
    tagline: 'الميكانيكا والصيانة',
    desc: 'بنكشف على عربيتك ونصلّحها على إيد فنيين متخصصين.',
    icon: 'wrench',
    rgb: '247 147 30',
  },
  'فورتو بروتكشن': {
    en: 'Forto Protection',
    tagline: 'السمكرة والحماية',
    desc: 'نرجّع دهان عربيتك زي الجديد، وبعدها نحميه بطبقة نانو سيراميك.',
    icon: 'shield',
    rgb: '247 147 30',
  },
};
export const TABLES: Record<string, TableConfig> = {
  services: {
    title: 'الخدمات والأسعار',
    subtitle: 'قائمة خدمات المركز وأسعارها الحالية',
    columns: [
      { key: 'name', label: 'الخدمة', kind: 'strong' },
      { key: 'center', label: 'المركز' },
      { key: 'category', label: 'التصنيف' },
      { key: 'duration', label: 'المدة' },
      { key: 'price', label: 'السعر', kind: 'money' },
      { key: 'status', label: 'الحالة', kind: 'badge' },
    ],
    rows: services,
    layout: 'cards',
    groupBy: 'center',
    badges: { 'متاحة': 'emerald', 'بحجز مسبق': 'sky', 'موقوفة': 'gray' },
  },
  customers: {
    title: 'العملاء والسيارات',
    subtitle: 'بيانات العملاء وسياراتهم',
    columns: [
      { key: 'name', label: 'العميل', kind: 'strong' },
      { key: 'phone', label: 'الهاتف', kind: 'mono' },
      { key: 'car', label: 'السيارة' },
      { key: 'plate', label: 'اللوحة' },
      { key: 'visits', label: 'الزيارات' },
      { key: 'status', label: 'الفئة', kind: 'badge' },
    ],
    rows: customers,
    badges: { VIP: 'amber', 'نشط': 'emerald', 'جديد': 'sky' },
  },
  visits: {
    title: 'سجل الزيارات',
    subtitle: 'آخر الزيارات المسجلة بالمركز',
    columns: [
      { key: 'id', label: 'الرقم', kind: 'mono' },
      { key: 'customer', label: 'العميل', kind: 'strong', avatar: true },
      { key: 'phone', label: 'الهاتف', kind: 'mono', detailOnly: true },
      { key: 'car', label: 'السيارة' },
      { key: 'plate', label: 'اللوحة', detailOnly: true },
      { key: 'service', label: 'الخدمة' },
      { key: 'center', label: 'المركز', detailOnly: true },
      { key: 'date', label: 'التاريخ', kind: 'mono' },
      { key: 'time', label: 'الوقت', detailOnly: true },
      { key: 'tech', label: 'الفني', detailOnly: true },
      { key: 'payment', label: 'الدفع', detailOnly: true },
      { key: 'total', label: 'الإجمالي', kind: 'money' },
      { key: 'status', label: 'الحالة', kind: 'badge' },
    ],
    rows: visits,
    layout: 'timeline',
    badges: { 'مكتملة': 'emerald', 'قيد التنفيذ': 'amber', 'ملغاة': 'rose' },
  },
  bookings: {
    title: 'الحجوزات',
    subtitle: 'الحجوزات القادمة وحالتها',
    columns: [
      { key: 'id', label: 'الرقم', kind: 'mono' },
      { key: 'customer', label: 'العميل', kind: 'strong' },
      { key: 'service', label: 'الخدمة' },
      { key: 'date', label: 'التاريخ', kind: 'mono' },
      { key: 'time', label: 'الوقت' },
      { key: 'status', label: 'الحالة', kind: 'badge' },
    ],
    rows: bookings,
    layout: 'kanban',
    badges: { 'مؤكد': 'emerald', 'بانتظار التأكيد': 'amber', 'ملغي': 'rose' },
  },
  products: {
    title: 'المنتجات والإكسسوارات',
    subtitle: 'المخزون والأسعار',
    columns: [
      { key: 'name', label: 'المنتج', kind: 'strong' },
      { key: 'sku', label: 'الكود', kind: 'mono' },
      { key: 'category', label: 'التصنيف' },
      { key: 'price', label: 'السعر', kind: 'money' },
      { key: 'stock', label: 'المخزون' },
      { key: 'status', label: 'الحالة', kind: 'badge' },
    ],
    rows: products,
    layout: 'products',
    badges: { 'متوفر': 'emerald', 'كمية قليلة': 'amber', 'نفد': 'rose' },
  },
};

export const recentVisits = visits.slice(0, 5);
export const visitsConfig = TABLES['visits'];
