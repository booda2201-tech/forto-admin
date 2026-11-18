import { Customer, ServiceItem, Visit, VisitStatus } from './customer.models';

/* ------------------------------------------------------------------ */
/* Service catalogue (mirrors the three Forto divisions)               */
/* ------------------------------------------------------------------ */
export const SERVICES: Record<string, ServiceItem> = {
  fullWash: { id: 'fullWash', name: 'غسيل كيميائي كامل', section: 'care', price: 450 },
  engineWash: { id: 'engineWash', name: 'غسيل محرك', section: 'care', price: 200 },
  polish: { id: 'polish', name: 'تلميع وإزالة الخدوش', section: 'care', price: 1800 },
  tarRemoval: { id: 'tarRemoval', name: 'إزالة الأسمنت والقطران', section: 'care', price: 350 },
  interior: { id: 'interior', name: 'تنظيف وتعقيم الداخلية', section: 'care', price: 600 },
  engineCheck: { id: 'engineCheck', name: 'فحص وصيانة المحرك', section: 'service', price: 900 },
  oilChange: { id: 'oilChange', name: 'تغيير زيت وفلاتر', section: 'service', price: 1100 },
  suspension: { id: 'suspension', name: 'العفشة ونظام التعليق', section: 'service', price: 2400 },
  brakes: { id: 'brakes', name: 'صيانة الفرامل', section: 'service', price: 1300 },
  bodywork: { id: 'bodywork', name: 'سمكرة ودهان (دوكو)', section: 'protection', price: 6500 },
  ceramic: { id: 'ceramic', name: 'نانو سيراميك', section: 'protection', price: 8500 },
  ppf: { id: 'ppf', name: 'حماية الدهان PPF', section: 'protection', price: 14000 },
  mats: { id: 'mats', name: 'دواسات وإكسسوارات', section: 'accessories', price: 750 },
};

/* ------------------------------------------------------------------ */
/* Customers                                                           */
/* ------------------------------------------------------------------ */
const iso = (y: number, m: number, d: number) => new Date(y, m - 1, d).toISOString();

export const CUSTOMERS: Customer[] = [
  {
    id: 'c-1001',
    name: 'أحمد محمود السيد',
    phone: '0100 123 4567',
    joinedAt: iso(2024, 2, 11),
    tier: 'vip',
    area: 'الهرم',
    notes: 'يفضّل المواعيد الصباحية. حساس تجاه روائح التعطير القوية.',
    cars: [
      { id: 'car-1', make: 'تويوتا', model: 'كورولا', year: 2022, plate: 'ن ص ر 4821', color: 'أبيض لؤلؤي' },
      { id: 'car-2', make: 'مرسيدس', model: 'C200', year: 2020, plate: 'ق ع م 1957', color: 'أسود' },
    ],
  },
  {
    id: 'c-1002',
    name: 'منى عبدالرحمن',
    phone: '0111 987 6543',
    joinedAt: iso(2024, 8, 3),
    tier: 'regular',
    area: 'فيصل',
    cars: [{ id: 'car-3', make: 'هيونداي', model: 'إلنترا', year: 2021, plate: 'ه ب د 3306', color: 'رمادي' }],
  },
  {
    id: 'c-1003',
    name: 'كريم حسام الدين',
    phone: '0122 456 7890',
    joinedAt: iso(2023, 11, 20),
    tier: 'vip',
    area: 'الشيخ زايد',
    notes: 'عميل شركات - يطلب فاتورة ضريبية دائماً.',
    cars: [
      { id: 'car-4', make: 'بي إم دبليو', model: 'X5', year: 2023, plate: 'و ل ك 7712', color: 'أزرق داكن' },
      { id: 'car-5', make: 'كيا', model: 'سبورتاج', year: 2022, plate: 'س م ح 5590', color: 'فضي' },
    ],
  },
  {
    id: 'c-1004',
    name: 'سارة إبراهيم',
    phone: '0155 321 6549',
    joinedAt: iso(2025, 5, 14),
    tier: 'regular',
    area: 'المهندسين',
    cars: [{ id: 'car-6', make: 'نيسان', model: 'صني', year: 2019, plate: 'ع ج ز 2048', color: 'أحمر' }],
  },
  {
    id: 'c-1005',
    name: 'محمد عادل فتحي',
    phone: '0109 765 4321',
    joinedAt: iso(2026, 9, 28),
    tier: 'new',
    area: 'الجيزة',
    cars: [{ id: 'car-7', make: 'شيفروليه', model: 'أوبترا', year: 2018, plate: 'ح ط ن 8834', color: 'أبيض' }],
  },
  {
    id: 'c-1006',
    name: 'ياسمين طارق',
    phone: '0128 112 2334',
    joinedAt: iso(2025, 1, 9),
    tier: 'regular',
    area: 'الدقي',
    cars: [{ id: 'car-8', make: 'ميني', model: 'كوبر', year: 2021, plate: 'ص ف ل 6671', color: 'أخضر بريطاني' }],
  },
  {
    id: 'c-1007',
    name: 'عمر خالد الشافعي',
    phone: '0101 556 7788',
    joinedAt: iso(2026, 10, 21),
    tier: 'new',
    area: 'أكتوبر',
    notes: 'تعرّف على المركز عن طريق إنستجرام.',
    cars: [{ id: 'car-9', make: 'جيتور', model: 'X70', year: 2024, plate: 'ب د ق 1120', color: 'رمادي جرافيت' }],
  },
  {
    id: 'c-1008',
    name: 'هبة مصطفى',
    phone: '0112 889 9001',
    joinedAt: iso(2024, 4, 2),
    tier: 'vip',
    area: 'الهرم',
    cars: [
      { id: 'car-10', make: 'لكزس', model: 'ES350', year: 2021, plate: 'ك م ي 9087', color: 'أبيض' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Visits – compact tuples expanded below                              */
/*  [customer, car, [services], daysAgo (negative = upcoming),          */
/*   status, source, technician, notes?, rating?]                       */
/* ------------------------------------------------------------------ */
type Row = [
  string,
  string,
  string[],
  number,
  VisitStatus,
  'booking' | 'walk-in',
  string,
  string?,
  number?,
];

const TECHS = ['م. حسام', 'م. إبراهيم', 'م. وليد', 'م. أيمن'];

const ROWS: Row[] = [
  // أحمد محمود (VIP)
  ['c-1001', 'car-1', ['fullWash', 'interior'], 410, 'completed', 'walk-in', TECHS[0], undefined, 5],
  ['c-1001', 'car-2', ['fullWash', 'polish'], 360, 'completed', 'booking', TECHS[1], 'خدوش خفيفة على الباب الأيمن.', 5],
  ['c-1001', 'car-1', ['oilChange', 'engineCheck'], 300, 'completed', 'booking', TECHS[2], undefined, 4],
  ['c-1001', 'car-2', ['ceramic'], 240, 'completed', 'booking', TECHS[1], 'طبقتين نانو سيراميك - ضمان سنتين.', 5],
  ['c-1001', 'car-1', ['fullWash', 'tarRemoval'], 150, 'completed', 'walk-in', TECHS[0], undefined, 5],
  ['c-1001', 'car-2', ['brakes', 'oilChange'], 70, 'completed', 'booking', TECHS[3], 'تم تغيير تيل الفرامل الأمامي.', 4],
  ['c-1001', 'car-1', ['fullWash', 'interior', 'mats'], 12, 'completed', 'booking', TECHS[0], undefined, 5],
  ['c-1001', 'car-2', ['polish'], -5, 'booked', 'booking', TECHS[1], 'تلميع كامل قبل مناسبة عائلية.'],

  // منى
  ['c-1002', 'car-3', ['fullWash'], 200, 'completed', 'walk-in', TECHS[3], undefined, 4],
  ['c-1002', 'car-3', ['oilChange'], 120, 'completed', 'booking', TECHS[2], undefined, 5],
  ['c-1002', 'car-3', ['fullWash', 'interior'], 35, 'completed', 'walk-in', TECHS[0], undefined, 4],
  ['c-1002', 'car-3', ['suspension'], 0, 'in-progress', 'booking', TECHS[2], 'صوت طرق في العفشة الأمامية.'],

  // كريم (VIP - شركات)
  ['c-1003', 'car-4', ['ppf'], 330, 'completed', 'booking', TECHS[1], 'PPF كامل للمقدمة والكبوت.', 5],
  ['c-1003', 'car-4', ['fullWash', 'engineWash'], 280, 'completed', 'walk-in', TECHS[0], undefined, 5],
  ['c-1003', 'car-5', ['bodywork'], 220, 'completed', 'booking', TECHS[1], 'حادث بسيط - رفرف أمامي وصدّام.', 4],
  ['c-1003', 'car-5', ['polish', 'ceramic'], 170, 'completed', 'booking', TECHS[1], undefined, 5],
  ['c-1003', 'car-4', ['oilChange', 'brakes'], 95, 'completed', 'booking', TECHS[3], undefined, 5],
  ['c-1003', 'car-4', ['fullWash', 'interior'], 20, 'completed', 'walk-in', TECHS[0], undefined, 5],
  ['c-1003', 'car-5', ['engineCheck'], -2, 'booked', 'booking', TECHS[2]],

  // سارة
  ['c-1004', 'car-6', ['fullWash'], 160, 'completed', 'walk-in', TECHS[3], undefined, 4],
  ['c-1004', 'car-6', ['engineCheck', 'oilChange'], 80, 'completed', 'booking', TECHS[2], 'تم اكتشاف تسريب بسيط في حلقة الزيت.', 4],
  ['c-1004', 'car-6', ['bodywork'], 45, 'cancelled', 'booking', TECHS[1], 'ألغت الحجز لتأجيل السفر.'],

  // محمد عادل (جديد)
  ['c-1005', 'car-7', ['fullWash', 'tarRemoval'], 49, 'completed', 'walk-in', TECHS[0], 'أول زيارة للمركز.', 5],
  ['c-1005', 'car-7', ['oilChange'], 8, 'completed', 'booking', TECHS[2], undefined, 4],

  // ياسمين
  ['c-1006', 'car-8', ['polish', 'fullWash'], 260, 'completed', 'booking', TECHS[1], undefined, 5],
  ['c-1006', 'car-8', ['ceramic'], 190, 'completed', 'booking', TECHS[1], undefined, 5],
  ['c-1006', 'car-8', ['fullWash', 'interior'], 55, 'completed', 'walk-in', TECHS[0], undefined, 4],
  ['c-1006', 'car-8', ['mats'], 15, 'completed', 'walk-in', TECHS[3], 'دواسات مخصوصة للميني كوبر.', 5],

  // عمر (جديد)
  ['c-1007', 'car-9', ['fullWash'], 27, 'completed', 'walk-in', TECHS[0], undefined, 5],
  ['c-1007', 'car-9', ['ceramic', 'polish'], -3, 'booked', 'booking', TECHS[1], 'سيارة جديدة - حماية قبل الاستخدام.'],

  // هبة (VIP)
  ['c-1008', 'car-10', ['ceramic'], 500, 'completed', 'booking', TECHS[1], undefined, 5],
  ['c-1008', 'car-10', ['fullWash', 'interior'], 380, 'completed', 'walk-in', TECHS[0], undefined, 5],
  ['c-1008', 'car-10', ['oilChange', 'engineCheck'], 260, 'completed', 'booking', TECHS[2], undefined, 5],
  ['c-1008', 'car-10', ['fullWash', 'engineWash'], 130, 'completed', 'walk-in', TECHS[0], undefined, 4],
  ['c-1008', 'car-10', ['suspension', 'brakes'], 40, 'completed', 'booking', TECHS[3], 'تغيير مساعدين أماميين.', 5],
  ['c-1008', 'car-10', ['fullWash'], 4, 'completed', 'walk-in', TECHS[0], undefined, 5],
];

const PAYMENTS = ['cash', 'card', 'wallet'] as const;

export function buildVisits(now = new Date()): Visit[] {
  return ROWS.map(([customerId, carId, svcKeys, daysAgo, status, source, technician, notes, rating], i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(9 + ((i * 3) % 9), (i * 15) % 60, 0, 0);

    const services = svcKeys.map((k) => SERVICES[k]);
    const total = services.reduce((sum, s) => sum + s.price, 0);

    return {
      id: `v-${String(i + 1).padStart(4, '0')}`,
      customerId,
      carId,
      date: date.toISOString(),
      services,
      total,
      status,
      source,
      paymentMethod: status === 'completed' ? PAYMENTS[i % PAYMENTS.length] : undefined,
      technician,
      notes,
      rating: status === 'completed' ? rating : undefined,
    } satisfies Visit;
  });
}
