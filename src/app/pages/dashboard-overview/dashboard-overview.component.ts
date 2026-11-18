import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { IconComponent, IconName } from '../../shared/icon/icon.component';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { CountUpDirective } from '../../shared/count-up.directive';
import { performance, recentVisits, topServices, visitsConfig } from '../../data/mock-data';

const VB_W = 600;
const VB_H = 240;

type Metric = 'revenue' | 'visits';

/** Smallest "nice" axis step (1, 1.5, 2, 2.5, 3, 4, 5, 6, 8 × 10ⁿ) that is ≥ raw. */
function niceStep(raw: number): number {
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  return ([1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((m) => m * mag >= raw) ?? 10) * mag;
}

const compact = (v: number): string => (v >= 1000 ? `${+(v / 1000).toFixed(1)}k` : String(v));
function smoothPath(pts: [number, number][]): string {
  return pts
    .map(([x, y], i) => {
      if (i === 0) return `M${x.toFixed(1)},${y.toFixed(1)}`;
      const [px, py] = pts[i - 1];
      const cx = ((px + x) / 2).toFixed(1);
      return `C${cx},${py.toFixed(1)} ${cx},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

type Tone = 'brand' | 'emerald' | 'amber' | 'sky';

interface StatCard {
  title: string;
  value: number;
  suffix?: string;
  change: string;
  positive: boolean;
  hint: string;
  tone: Tone;
  icon: IconName;
}

@Component({
  selector: 'app-dashboard-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, DataTableComponent, CountUpDirective],
  templateUrl: './dashboard-overview.component.html',
  styleUrl: './dashboard-overview.component.scss',
})
export class DashboardOverviewComponent {
  protected readonly stats: StatCard[] = [
    {
      title: 'إجمالي الإيرادات',
      value: 128450,
      suffix: 'ج.م',
      change: '+12.5%',
      positive: true,
      hint: 'مقارنة بالشهر الماضي',
      tone: 'brand',
      icon: 'wallet',
    },
    {
      title: 'عدد الزيارات اليوم',
      value: 42,
      change: '+8.2%',
      positive: true,
      hint: '6 زيارات قيد التنفيذ',
      tone: 'brand',
      icon: 'car',
    },
    {
      title: 'العملاء الجدد',
      value: 17,
      change: '-3.1%',
      positive: false,
      hint: 'هذا الأسبوع',
      tone: 'brand',
      icon: 'user-plus',
    },
    {
      title: 'الحجوزات القادمة',
      value: 23,
      change: '+5.4%',
      positive: true,
      hint: 'خلال 7 أيام',
      tone: 'brand',
      icon: 'bookings',
    },
  ];

  // ----- Performance: one metric at a time, each on its own honest axis -----
  protected readonly metrics: { id: Metric; label: string; unit: string; rgb: string }[] = [
    { id: 'revenue', label: 'الإيرادات', unit: 'ج.م', rgb: '247 147 30' },
    { id: 'visits', label: 'الزيارات', unit: 'زيارة', rgb: '52 211 153' },
  ];
  protected readonly metric = signal<Metric>('revenue');
  protected readonly activeMetric = computed(() => this.metrics.find((m) => m.id === this.metric())!);

  protected readonly chart = computed(() => {
    const id = this.metric();
    const n = performance.length;
    const values = performance.map((p) => p[id]);
    const step = niceStep((Math.max(...values) * 1.08) / 4);
    const yMax = step * 4;

    const pts: [number, number][] = values.map((v, i) => [((i + 0.5) / n) * VB_W, VB_H - (v / yMax) * VB_H]);
    const line = smoothPath(pts);
    const area = `${line} L${pts[n - 1][0].toFixed(1)},${VB_H} L${pts[0][0].toFixed(1)},${VB_H} Z`;

    const last = values[n - 1];
    const prev = values[n - 2];
    return {
      line,
      area,
      ticks: [0, 1, 2, 3, 4].map((i) => ({ label: compact(step * i), pct: i * 25 })),
      cols: performance.map((p, i) => ({
        month: p.month,
        revenue: p.revenue.toLocaleString('en-US'),
        visits: p.visits.toLocaleString('en-US'),
        x: ((i + 0.5) / n) * 100,
        y: (values[i] / yMax) * 100,
        last: i === n - 1,
      })),
      current: last.toLocaleString('en-US'),
      delta: ((last - prev) / prev) * 100,
    };
  });
  // ----- Conversion gauge: segmented half-ring -----
  protected readonly conversion = 48;
  protected readonly ticks = (() => {
    const count = 21;
    const active = Math.round((this.conversion / 100) * count);
    return Array.from({ length: count }, (_, i) => {
      const a = Math.PI * (1 - i / (count - 1));
      const [c, s] = [Math.cos(a), Math.sin(a)];
      return {
        x1: 100 + 60 * c,
        y1: 100 - 60 * s,
        x2: 100 + 84 * c,
        y2: 100 - 84 * s,
        on: i < active,
        delay: 700 + i * 55,
      };
    });
  })();

  protected readonly months = performance.map((p) => p.month);
  protected readonly topServices = topServices;
  protected readonly visitsTable = {
    ...visitsConfig,
    columns: visitsConfig.columns.filter((c) => c.detailOnly || ['id', 'customer', 'car', 'service', 'date', 'total', 'status'].includes(c.key)),
    rows: recentVisits,
  };

  protected readonly funnel = [
    { label: 'زيارات الموقع', value: 100, tone: 'bg-[#ffc27a]' },
    { label: 'حجوزات', value: 64, tone: 'bg-[#f7931e]' },
    { label: 'زيارات مكتملة', value: 48, tone: 'bg-emerald-400' },
  ];
}
