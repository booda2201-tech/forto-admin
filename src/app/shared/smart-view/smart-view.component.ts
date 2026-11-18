import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TONE_RGB, TableConfig } from '../../data/mock-data';
import { CountUpDirective } from '../count-up.directive';
import { IconComponent, IconName } from '../icon/icon.component';

type Row = Record<string, string | number>;

/** Category → icon for the service cards (one restrained brand accent for all). */
const BRAND = '247 147 30';
const CATEGORY: Record<string, { icon: IconName; rgb: string }> = {
  غسيل: { icon: 'droplets', rgb: BRAND },
  تلميع: { icon: 'services', rgb: BRAND },
  حماية: { icon: 'shield', rgb: BRAND },
  تنظيف: { icon: 'brush', rgb: BRAND },
  صيانة: { icon: 'wrench', rgb: BRAND },
};
const FALLBACK = { icon: 'car' as IconName, rgb: BRAND };

const RING_LEN = 2 * Math.PI * 26;
const MAX_STOCK = 60;

const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

/** "10:00 ص" / "02:30 م" → 24h "HH:mm" so rows sort chronologically. */
function time24(t: string): string {
  const m = /(\d+):(\d+)\s*(ص|م)?/.exec(t);
  if (!m) return '00:00';
  const h = (+m[1] % 12) + (m[3] === 'م' ? 12 : 0);
  return String(h).padStart(2, '0') + ':' + m[2];
}
function sortKey(r: Record<string, string | number>): string {
  return String(r['date']) + ' ' + time24(String(r['time'] ?? ''));
}

/**
 * Creative presentations of a TableConfig: bento cards, product cards with stock rings,
 * a day-grouped timeline and a status kanban board.
 */
@Component({
  selector: 'app-smart-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CountUpDirective, IconComponent],
  styleUrl: './smart-view.component.scss',
  template: `
    @switch (config().layout) {
      <!-- ============ Services: bento cards ============ -->
      @case ('cards') {
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          @for (r of rows(); track r; let i = $index) {
            <article
              class="glass-card card reveal group relative flex flex-col gap-5 overflow-hidden p-5"
              [class.card-top]="r === topRow()"
              [style.--i]="i"
              [style.--tone]="cat(r).rgb"
            >
              <div class="card-orb" aria-hidden="true"></div>

              @if (r['image']) {
                <!-- photo banner: tinted with the category colour, tile overlaps its bottom edge -->
                <div class="relative -mx-5 -mt-5 h-40 overflow-hidden">
                  <img
                    [src]="r['image']"
                    [style.object-position]="r['imgPos'] || 'center'"
                    alt=""
                    loading="lazy"
                    class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <span class="absolute inset-0 bg-gradient-to-t from-[var(--card-b)] via-[color-mix(in_srgb,var(--card-b)_25%,transparent)] to-black/25"></span>
                  <span class="absolute inset-0 mix-blend-soft-light" style="background: rgb(var(--tone) / 0.45)"></span>
                  <span class="badge absolute start-3 top-3 backdrop-blur-md" style="background: rgb(0 0 0 / 0.55)" [style.--tone]="rgb(r['status'])">
                    <i class="badge-dot"></i>{{ r['status'] }}
                  </span>
                </div>
                <div class="relative -mt-14 flex items-start justify-between gap-3">
                  <div class="tile grid size-14 place-items-center rounded-2xl backdrop-blur-md"><app-icon [name]="cat(r).icon" [size]="26" /></div>
                </div>
              } @else {
                <div class="relative flex items-start justify-between gap-3">
                  <div class="tile grid size-14 place-items-center rounded-2xl "><app-icon [name]="cat(r).icon" [size]="26" /></div>
                  <span class="badge" [style.--tone]="rgb(r['status'])"><i class="badge-dot"></i>{{ r['status'] }}</span>
                </div>
              }

              <div class="relative">
                <p class="text-xs font-semibold tracking-wide" style="color: color-mix(in srgb, rgb(var(--tone)) var(--tone-mix), #000)">{{ r['category'] }}</p>
                <h3 class="mt-1 text-lg font-bold leading-snug">{{ r['name'] }}</h3>
              </div>

              <div class="relative mt-auto flex items-end justify-between border-t border-white/[0.06] pt-4">
                <span class="chip-time inline-flex items-center gap-1.5 text-xs text-gray-400">
                  <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
                  </svg>
                  {{ r['duration'] }}
                </span>
                <p class="price flex items-baseline gap-1">
                  <span class="text-2xl font-extrabold" dir="ltr" [appCountUp]="+r['price']" [duration]="1000" [delay]="400 + i * 70">0</span>
                  <span class="text-xs text-gray-500">ج.م</span>
                </p>
              </div>

              @if (r === topRow()) {
                <span class="ribbon">الأعلى سعراً</span>
              }
            </article>
          } @empty {
            <p class="col-span-full py-16 text-center text-gray-500">لا توجد نتائج</p>
          }
        </div>
      }

      <!-- ============ Products: stock rings ============ -->
      @case ('products') {
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          @for (r of rows(); track r; let i = $index) {
            <article
              class="glass-card card reveal group relative flex flex-col gap-4 overflow-hidden p-5"
              [class.card-out]="+r['stock'] === 0"
              [class.has-img]="r['image']"
              [style.--i]="i"
              [style.--tone]="rgb(r['status'])"
            >
              <div class="card-orb" aria-hidden="true"></div>

              @if (editable()) {
                <button type="button" class="edit-btn absolute end-3 top-3 z-10 grid size-9 place-items-center rounded-xl" aria-label="تعديل المنتج" (click)="edit.emit(r)">
                  <app-icon name="edit" [size]="15" />
                </button>
              }

              @if (r['image']) {
                <!-- product photo: tinted with the stock colour, stock ring overlaps its bottom edge -->
                <div class="relative -mx-5 -mt-5 h-40 overflow-hidden">
                  <img
                    [src]="r['image']"
                    alt=""
                    loading="lazy"
                    class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <span class="absolute inset-0 bg-gradient-to-t from-[var(--card-b)] via-[color-mix(in_srgb,var(--card-b)_20%,transparent)] to-black/20"></span>
                  <span class="absolute inset-0 mix-blend-soft-light" style="background: rgb(var(--tone) / 0.35)"></span>
                </div>
              }

              <div class="relative flex gap-4" [class.items-center]="!r['image']" [class.items-end]="r['image']" [class.-mt-10]="r['image']">
                <div class="relative size-16 shrink-0" [class.ring-bg]="r['image']">
                  <svg viewBox="0 0 64 64" class="size-full -rotate-90">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="rgb(255 255 255 / 0.07)" stroke-width="6" />
                    <circle
                      class="ring"
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke="rgb(var(--tone))"
                      stroke-width="6"
                      stroke-linecap="round"
                      [attr.stroke-dasharray]="ring(r['stock']) + ' ' + ringLen"
                      [style.--len]="ringLen"
                      [style.animation-delay]="500 + i * 80 + 'ms'"
                    />
                  </svg>
                  <span class="absolute inset-0 grid place-items-center text-sm font-extrabold" dir="ltr">
                    <span [appCountUp]="+r['stock']" [duration]="900" [delay]="500 + i * 80">0</span>
                  </span>
                </div>
                <div class="min-w-0">
                  <h3 class="font-bold leading-snug">{{ r['name'] }}</h3>
                  <p class="mt-1 text-xs text-gray-500">
                    <span dir="ltr" class="inline-block">{{ r['sku'] }}</span> · {{ r['category'] }}
                  </p>
                </div>
              </div>

              <div class="relative mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4">
                <span class="badge" [class.badge-live]="+r['stock'] > 0 && +r['stock'] < 10" [style.--tone]="rgb(r['status'])">
                  <i class="badge-dot"></i>{{ r['status'] }}
                </span>
                <p class="price flex items-baseline gap-1">
                  <span class="text-xl font-extrabold" dir="ltr" [appCountUp]="+r['price']" [duration]="1000" [delay]="400 + i * 70">0</span>
                  <span class="text-xs text-gray-500">ج.م</span>
                </p>
              </div>

              @if (+r['stock'] === 0) {
                <span class="ribbon ribbon-out">نفد</span>
              }
            </article>
          } @empty {
            <p class="col-span-full py-16 text-center text-gray-500">لا توجد نتائج</p>
          }
        </div>
      }

      <!-- ============ Visits: day ledger ============ -->
      @case ('timeline') {
        <div class="flex flex-col gap-8">
          @for (g of groups(); track g.date; let gi = $index) {
            <section class="reveal" [style.--i]="gi">
              <div class="mb-3 flex items-center gap-3 px-1">
                <span class="day-chip keycap rounded-full px-4 py-1.5 text-sm font-bold">{{ g.label }}</span>
                <span class="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent"></span>
                <span class="text-xs text-gray-500">{{ count(g.rows.length) }}</span>
                <span class="inline-flex items-baseline gap-1 text-xs text-gray-500">
                  الإيراد
                  <b class="text-sm font-bold text-gray-300" dir="ltr">{{ g.total.toLocaleString('en-US') }}</b>
                  ج.م
                </span>
              </div>

              <div class="glass-card overflow-hidden">
                <div class="v-head hidden grid-cols-1 gap-x-4 border-b border-white/[0.06] px-5 py-2.5 text-[11px] font-semibold tracking-wide text-gray-500 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1.3fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)_7rem_5.5rem] xl:grid">
                  <span>العميل</span><span>الخدمة</span><span>السيارة</span><span>الوقت · الفني</span><span>الدفع</span><span>الحالة</span><span>الإجمالي</span>
                </div>
                @for (r of g.rows; track r; let i = $index) {
                  <div
                    class="v-row grid grid-cols-2 items-center gap-x-4 gap-y-3 border-b border-white/[0.05] px-5 py-4 last:border-0 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1.3fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)_7rem_5.5rem]"
                    [class.k-cancelled]="cancelled(r['status'])"
                    [style.--i]="gi + i"
                    [style.--tone]="rgb(r['status'])"
                  >
                    <div class="col-span-2 flex min-w-0 items-center gap-3 lg:col-span-1">
                      <span class="k-avatar grid size-10 shrink-0 place-items-center rounded-full text-sm font-extrabold">{{ initial(r['customer']) }}</span>
                      <div class="min-w-0">
                        <p class="flex items-center gap-2">
                          <span class="truncate font-bold" [class.line-through]="cancelled(r['status'])">{{ r['customer'] }}</span>
                          <span class="shrink-0 text-[11px] text-gray-600" dir="ltr">{{ r['id'] }}</span>
                        </p>
                        <p class="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500" dir="ltr">
                          <app-icon name="phone" [size]="11" />{{ phone(r['phone']) }}
                        </p>
                      </div>
                    </div>
                    <div class="min-w-0">
                      <p class="truncate text-sm font-semibold text-gray-100">{{ r['service'] }}</p>
                      <p class="mt-0.5 truncate text-xs text-gray-500">{{ r['center'] }}</p>
                    </div>
                    <div class="min-w-0">
                      <p class="truncate text-sm text-gray-300">{{ r['car'] }}</p>
                      <span class="plate mt-1 inline-block rounded-md px-2 py-0.5 text-[11px] text-gray-400">{{ r['plate'] }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="flex items-center gap-1.5 text-sm font-semibold text-gray-200">
                        <app-icon name="clock" [size]="13" class="text-gray-500" />{{ r['time'] }}
                      </p>
                      <p class="mt-0.5 flex items-center gap-1.5 truncate text-xs text-gray-500">
                        <app-icon name="user" [size]="12" />{{ r['tech'] }}
                      </p>
                    </div>
                    <p class="flex items-center gap-1.5 text-sm text-gray-300">
                      @if (r['payment'] !== '—') {
                        <app-icon [name]="payIcon(r['payment'])" [size]="15" class="text-gray-500" />
                      }
                      {{ r['payment'] }}
                    </p>
                    <span class="badge justify-self-start" [class.badge-live]="live(r['status'])">
                      <i class="badge-dot"></i>{{ r['status'] }}
                    </span>
                    <p class="price flex items-baseline justify-self-end gap-1 xl:justify-self-start">
                      <span class="text-lg font-extrabold" dir="ltr" [appCountUp]="+r['total']" [duration]="900" [delay]="500 + gi * 150 + i * 70">0</span>
                      <span class="text-xs text-gray-500">ج.م</span>
                    </p>
                  </div>
                } @empty {
                  <p class="py-10 text-center text-gray-500">لا توجد نتائج</p>
                }
              </div>
            </section>
          } @empty {
            <p class="py-16 text-center text-gray-500">لا توجد نتائج</p>
          }
        </div>
      }

      <!-- ============ Bookings: kanban ============ -->
      @case ('kanban') {
        <div class="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
          @for (col of columns(); track col.label; let ci = $index) {
            <section class="lane reveal flex flex-col gap-3 rounded-2xl p-3" [style.--i]="ci" [style.--tone]="col.rgb">
              <header class="flex items-center justify-between px-2 pb-1 pt-1.5">
                <span class="flex items-center gap-2.5 font-bold">
                  <i class="lane-dot" [class.badge-live]="col.live"></i>
                  {{ col.label }}
                </span>
                <span class="count rounded-full px-2.5 py-0.5 text-xs font-bold" dir="ltr">{{ col.rows.length }}</span>
              </header>

              @for (r of col.rows; track r; let i = $index) {
                <article class="glass-card k-card relative overflow-hidden p-4" [class.k-cancelled]="col.cancelled" [style.--i]="i">
                  <div class="flex items-center gap-3">
                    <span class="k-avatar grid size-10 shrink-0 place-items-center rounded-full text-sm font-extrabold">{{ initial(r['customer']) }}</span>
                    <div class="min-w-0 flex-1">
                      <p class="truncate font-bold" [class.line-through]="col.cancelled">{{ r['customer'] }}</p>
                      <p class="truncate text-sm text-gray-400">{{ r['service'] }}</p>
                    </div>
                    <span class="self-start text-[11px] text-gray-600" dir="ltr">{{ r['id'] }}</span>
                  </div>
                  <div class="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs">
                    <span class="time inline-flex items-center gap-1.5 font-extrabold">
                      <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
                      </svg>
                      {{ r['time'] }}
                    </span>
                    <span class="inline-flex items-center gap-1.5 text-gray-400">
                      <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                        <rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" />
                      </svg>
                      {{ day(r['date']) }}
                    </span>
                  </div>
                </article>
              } @empty {
                <div class="empty rounded-2xl px-4 py-10 text-center text-sm text-gray-600">لا حجوزات</div>
              }
            </section>
          }
        </div>
      }
    }
  `,
})
export class SmartViewComponent {
  readonly config = input.required<TableConfig>();
  readonly query = input('');
  /** Shows an edit button on product cards. */
  readonly editable = input(false);
  readonly edit = output<Row>();

  protected readonly ringLen = RING_LEN;

  protected readonly rows = computed<Row[]>(() => {
    const q = this.query().trim().toLowerCase();
    const rows = this.config().rows;
    return q ? rows.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(q))) : rows;
  });

  /** Most expensive row gets the featured treatment. */
  protected readonly topRow = computed(() =>
    this.rows().reduce<Row | null>((best, r) => (!best || +r['price'] > +best['price'] ? r : best), null),
  );

  protected readonly groups = computed(() => {
    const map = new Map<string, Row[]>();
    for (const r of this.rows()) {
      const d = String(r['date']);
      map.set(d, [...(map.get(d) ?? []), r]);
    }
    return [...map.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, rows]) => ({
        date,
        rows,
        label: this.day(date),
        total: rows.filter((r) => !this.cancelled(r['status'])).reduce((s, r) => s + +r['total'], 0),
      }));
  });

  protected readonly columns = computed(() => {
    const badges = this.config().badges ?? {};
    return Object.keys(badges).map((label) => ({
      label,
      rgb: TONE_RGB[badges[label]],
      live: badges[label] === 'amber',
      cancelled: badges[label] === 'rose',
      rows: this.rows()
        .filter((r) => r['status'] === label)
        .sort((a, b) => sortKey(a).localeCompare(sortKey(b))),
    }));
  });

  protected initial(name: string | number): string {
    return String(name).trim().charAt(0);
  }

  /** Friendly day label: اليوم / غداً / "الخميس 19 نوفمبر". */
  protected day(date: string | number): string {
    const d = new Date(String(date) + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return String(date);
    const today = new Date();
    const diff = Math.round((d.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / 86_400_000);
    if (diff === 0) return 'اليوم';
    if (diff === -1) return 'أمس';
    if (diff === -2) return 'أول أمس';
    if (diff === 1) return 'غداً';
    if (diff === 2) return 'بعد غد';
    return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()];
  }

  protected cat(r: Row) {
    return CATEGORY[String(r['category'])] ?? FALLBACK;
  }

  protected rgb(status: string | number): string {
    return TONE_RGB[this.config().badges?.[String(status)] ?? 'gray'];
  }

  protected payIcon(method: string | number): IconName {
    const m = String(method);
    return m === 'فيزا' ? 'card' : m === 'تحويل' ? 'transfer' : m === 'محفظة' ? 'wallet' : 'cash';
  }

  /** 01012345678 → 0101 234 5678 */
  protected phone(p: string | number): string {
    const s = String(p);
    return /^\d{11}$/.test(s) ? s.slice(0, 4) + ' ' + s.slice(4, 7) + ' ' + s.slice(7) : s;
  }

  protected cancelled(status: string | number): boolean {
    return this.config().badges?.[String(status)] === 'rose';
  }

  protected count(n: number): string {
    return n === 1 ? 'زيارة واحدة' : n === 2 ? 'زيارتان' : n + ' زيارات';
  }

  protected live(status: string | number): boolean {
    return this.config().badges?.[String(status)] === 'amber';
  }

  protected ring(stock: string | number): number {
    return Math.max(0.04, Math.min(+stock / MAX_STOCK, 1)) * RING_LEN * (+stock === 0 ? 0 : 1);
  }
}

