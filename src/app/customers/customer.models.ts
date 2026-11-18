export type ServiceSection = 'care' | 'service' | 'protection' | 'accessories';

export type VisitStatus = 'completed' | 'in-progress' | 'booked' | 'cancelled';

export type CustomerTier = 'vip' | 'regular' | 'new';

export interface ServiceItem {
  id: string;
  name: string;
  section: ServiceSection;
  price: number;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  color: string;
}

export interface Visit {
  id: string;
  customerId: string;
  carId: string;
  /** ISO date-time of the visit (or of the booking for upcoming ones). */
  date: string;
  services: ServiceItem[];
  total: number;
  status: VisitStatus;
  /** How the visit was created. */
  source: 'booking' | 'walk-in';
  paymentMethod?: 'cash' | 'card' | 'wallet';
  technician: string;
  notes?: string;
  rating?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  joinedAt: string;
  tier: CustomerTier;
  area: string;
  notes?: string;
  cars: Car[];
}

export const SECTION_LABELS: Record<ServiceSection, string> = {
  care: 'الغسيل والتلميع',
  service: 'الميكانيكا والصيانة',
  protection: 'السمكرة والحماية',
  accessories: 'الإكسسوارات',
};

export const STATUS_LABELS: Record<VisitStatus, string> = {
  completed: 'مكتملة',
  'in-progress': 'قيد التنفيذ',
  booked: 'محجوزة',
  cancelled: 'ملغاة',
};

export const TIER_LABELS: Record<CustomerTier, string> = {
  vip: 'عميل VIP',
  regular: 'عميل منتظم',
  new: 'عميل جديد',
};

export const PAYMENT_LABELS = {
  cash: 'نقداً',
  card: 'بطاقة',
  wallet: 'محفظة إلكترونية',
} as const;
