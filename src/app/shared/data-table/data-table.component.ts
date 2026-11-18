import { ChangeDetectionStrategy, Component, computed, ElementRef, input, signal, viewChild } from '@angular/core';
import { BadgeTone, TONE_RGB, TableConfig } from '../../data/mock-data';
import { CountUpDirective } from '../count-up.directive';
import { IconComponent, IconName } from '../icon/icon.component';

@Component({
  selector: 'app-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CountUpDirective, IconComponent],
  styleUrl: './data-table.component.scss',
  template: `
    @if (searchable()) {
      <div class="toolbar flex flex-wrap items-center gap-3 border-b border-white/[0.06] p-4">
        <label class="inset-well search group flex h-11 w-full items-center gap-2.5 rounded-xl px-3.5 sm:w-80">
          <svg class="size-4 text-gray-500 transition-colors group-focus-within:text-[#f7931e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder="بحث..."
            class="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            (input)="query.set($any($event.target).value)"
          />
        </label>

        @if (chips().length > 1) {
          <div class="flex flex-wrap items-center gap-2">
            @for (c of chips(); track c.label) {
              <button
                type="button"
                class="chip"
                [class.chip-on]="status() === c.value"
                [style.--tone]="c.rgb"
                (click)="status.set(c.value)"
              >
                {{ c.label }}
                <span class="chip-count" dir="ltr">{{ c.count }}</span>
              </button>
            }
          </div>
        }
      </div>
    }

    <!-- Phones: one card per row instead of a horizontally-scrolling table -->
    <ul class="divide-y divide-white/[0.05] sm:hidden">
      @for (r of rows(); track r) {
        <li class="flex flex-col gap-3 p-4">
          <div class="flex items-start justify-between gap-3">
            <span class="min-w-0 font-semibold text-white">{{ r[titleKey()] }}</span>
            <div class="flex shrink-0 items-center gap-2">
              @if (badgeKey(); as bk) {
                <span class="badge" [class.badge-live]="live(r[bk])" [style.--tone]="rgb(r[bk])">
                  <i class="badge-dot"></i>{{ r[bk] }}
                </span>
              }
              @if (hasDetails()) {
                <button type="button" class="eye" aria-label="عرض التفاصيل" title="عرض التفاصيل" (click)="open(r)">
                  <app-icon name="eye" [size]="16" />
                </button>
              }
            </div>
          </div>
          <dl class="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
            @for (c of detailCols(); track c.key) {
              <div class="min-w-0">
                <dt class="text-gray-500">{{ c.label }}</dt>
                <dd class="mt-0.5 truncate text-sm" [class]="c.kind === 'money' ? 'font-bold text-[#f7931e]' : 'text-gray-200'">
                  @if (c.kind === 'money') {
                    <span dir="ltr">{{ money(r[c.key]) }}</span> <span class="text-xs font-medium text-gray-500">ج.م</span>
                  } @else if (c.kind === 'mono') {
                    <span dir="ltr">{{ r[c.key] }}</span>
                  } @else {
                    {{ r[c.key] }}
                  }
                </dd>
              </div>
            }
          </dl>
        </li>
      } @empty {
        <li class="px-5 py-12 text-center text-gray-500">لا توجد نتائج</li>
      }
    </ul>

    <div class="hidden overflow-x-auto sm:block">
      <table class="grid-table w-full min-w-max text-sm">
        <thead>
          <tr class="head border-b border-white/[0.06] text-xs text-gray-400">
            @for (c of cols(); track c.key) {
              <th class="cell whitespace-nowrap text-start font-semibold">{{ c.label }}</th>
            }
            @if (hasDetails()) {
              <th class="cell w-14 whitespace-nowrap text-start font-semibold">
                <span class="sr-only">التفاصيل</span>
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (r of rows(); track r; let i = $index) {
            <tr class="row border-b border-white/[0.04] last:border-0" [style.--i]="i">
              @for (c of cols(); track c.key; let first = $first) {
                <td class="cell relative whitespace-nowrap align-middle">
                  @if (first) {
                    <span class="row-bar" aria-hidden="true"></span>
                  }
                  @switch (c.kind) {
                    @case ('badge') {
                      <span class="badge" [class.badge-live]="live(r[c.key])" [style.--tone]="rgb(r[c.key])">
                        <i class="badge-dot"></i>{{ r[c.key] }}
                      </span>
                    }
                    @case ('money') {
                      <span class="money inline-flex items-baseline gap-1 whitespace-nowrap font-semibold">
                        <span dir="ltr" [appCountUp]="+r[c.key]" [duration]="900" [delay]="350 + i * 50">0</span>
                        <span class="text-xs font-medium text-gray-500">ج.م</span>
                      </span>
                    }
                    @case ('mono') {
                      <span class="mono inline-block text-gray-300" dir="ltr">{{ r[c.key] }}</span>
                    }
                    @case ('strong') {
                      @if (c.avatar) {
                        <span class="inline-flex items-center gap-3">
                          <span class="avatar" aria-hidden="true">{{ initial(r[c.key]) }}</span>
                          <span class="font-semibold text-white">{{ r[c.key] }}</span>
                        </span>
                      } @else {
                        <span class="font-semibold text-white">{{ r[c.key] }}</span>
                      }
                    }
                    @default {
                      <span class="text-gray-300">{{ r[c.key] }}</span>
                    }
                  }
                </td>
              }
              @if (hasDetails()) {
                <td class="cell align-middle">
                  <button type="button" class="eye" aria-label="عرض التفاصيل" title="عرض التفاصيل" (click)="open(r)">
                    <app-icon name="eye" [size]="16" />
                  </button>
                </td>
              }
            </tr>
          } @empty {
            <tr>
              <td [attr.colspan]="cols().length + (hasDetails() ? 1 : 0)" class="px-5 py-12 text-center text-gray-500">
                لا توجد نتائج
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- full details of one row (native dialog → top layer, nothing can cover it) -->
    <dialog #dlg class="dd" dir="rtl" [attr.aria-label]="'تفاصيل ' + config().title" (close)="selected.set(null)" (click)="onBackdrop($event)">
      @if (selected(); as r) {
        <div class="dd-sheet glass-card relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden">
          <header class="dd-head flex items-center gap-4 px-5 py-5 sm:px-7">
            <span class="avatar dd-avatar" aria-hidden="true">{{ initial(r[titleKey()]) }}</span>
            <div class="min-w-0 flex-1">
              <h3 class="truncate text-xl font-extrabold">{{ r[titleKey()] }}</h3>
              <div class="mt-1.5 flex flex-wrap items-center gap-2">
                @if (idKey(); as ik) {
                  <span class="dd-chip" dir="ltr">{{ r[ik] }}</span>
                }
                <span class="text-xs text-gray-500">{{ config().title }}</span>
              </div>
            </div>
            @if (badgeKey(); as bk) {
              <span class="badge shrink-0" [class.badge-live]="live(r[bk])" [style.--tone]="rgb(r[bk])">
                <i class="badge-dot"></i>{{ r[bk] }}
              </span>
            }
            <button type="button" class="keycap grid size-9 shrink-0 place-items-center rounded-lg text-gray-300" aria-label="إغلاق" (click)="close()">
              <app-icon name="close" [size]="16" />
            </button>
          </header>

          <dl class="dd-list grid gap-1 overflow-y-auto px-3 py-4 sm:grid-cols-2 sm:px-4">
            @for (c of detailFields(); track c.key) {
              <div class="dd-row">
                <span class="dd-ico"><app-icon [name]="iconFor(c.key, r[c.key])" [size]="17" /></span>
                <div class="min-w-0">
                  <dt class="dd-label">{{ c.label }}</dt>
                  <dd class="dd-value">
                    @if (c.key === 'phone') {
                      <a class="dd-link" dir="ltr" [href]="'tel:' + r[c.key]">{{ show(c.key, r[c.key]) }}</a>
                    } @else if (c.kind === 'mono') {
                      <span dir="ltr">{{ show(c.key, r[c.key]) }}</span>
                    } @else {
                      {{ show(c.key, r[c.key]) }}
                    }
                  </dd>
                </div>
              </div>
            }
          </dl>

          @if (moneyCol(); as m) {
            <footer class="dd-total flex items-center justify-between gap-4 px-5 py-4 sm:px-7">
              <span class="flex items-center gap-2.5 text-sm font-semibold text-gray-400">
                <span class="dd-ico"><app-icon name="receipt" [size]="17" /></span>
                {{ m.label }}
              </span>
              <span class="dd-money inline-flex items-baseline gap-1.5">
                <span dir="ltr">{{ money(r[m.key]) }}</span>
                <span class="text-sm font-semibold text-gray-500">ج.م</span>
              </span>
            </footer>
          }
        </div>
      }
    </dialog>
  `,
})
export class DataTableComponent {
  readonly config = input.required<TableConfig>();
  readonly searchable = input(false);
  readonly limit = input<number>();

  protected readonly query = signal('');
  protected readonly status = signal('');

  private readonly dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
  protected readonly selected = signal<Record<string, string | number> | null>(null);

  /** Columns shown in the table; `detailOnly` fields live in the popup. */
  protected readonly cols = computed(() => this.config().columns.filter((c) => !c.detailOnly));
  protected readonly hasDetails = computed(() => this.config().columns.some((c) => c.detailOnly));

  /** Everything about the selected row except its title and status (those sit in the popup header). */
  protected readonly detailFields = computed(() =>
    this.config().columns.filter((c) => c.key !== this.titleKey() && c.kind !== 'badge' && c.kind !== 'money' && c.key !== this.idKey()),
  );
  /** The amount column becomes the popup's "total" footer. */
  protected readonly moneyCol = computed(() => this.config().columns.find((c) => c.kind === 'money'));
  /** A short reference code (e.g. #V-1048) shown as a chip in the popup header. */
  protected readonly idKey = computed(() => this.config().columns.find((c) => c.key === 'id')?.key);

  protected open(row: Record<string, string | number>): void {
    this.selected.set(row);
    this.dlg().nativeElement.showModal();
  }
  protected close(): void {
    this.dlg().nativeElement.close();
  }
  /** Clicks on the dimmed area around the sheet land on the <dialog> itself. */
  protected onBackdrop(e: MouseEvent): void {
    if (e.target === this.dlg().nativeElement) this.close();
  }

  /** Small icon for a field, picked from its key (payment: from its value). */
  protected iconFor(key: string, value: string | number): IconName {
    if (key === 'payment') {
      const pay: Record<string, IconName> = { 'نقدي': 'cash', 'فيزا': 'card', 'تحويل': 'transfer', 'محفظة': 'wallet' };
      return pay[String(value)] ?? 'wallet';
    }
    const map: Record<string, IconName> = {
      id: 'receipt',
      phone: 'phone',
      car: 'car',
      plate: 'car',
      service: 'wrench',
      center: 'shield',
      date: 'calendar',
      time: 'clock',
      tech: 'user',
      category: 'services',
      sku: 'receipt',
      stock: 'products',
      duration: 'clock',
    };
    return map[key] ?? 'note';
  }

  protected initial(v: string | number): string {
    return String(v).trim().charAt(0);
  }

  /** Display value for the popup (phone numbers get grouped). */
  protected show(key: string, v: string | number): string {
    const s = String(v);
    if (key === 'phone' && /^01\d{9}$/.test(s)) return `${s.slice(0, 4)} ${s.slice(4, 7)} ${s.slice(7)}`;
    return s;
  }

  protected readonly badgeKey = computed(() => this.config().columns.find((c) => c.kind === 'badge')?.key);

  // ----- phone card layout -----
  /** Card heading: the first "strong" column (e.g. customer / service name), else the first column. */
  protected readonly titleKey = computed(() => {
    const cols = this.config().columns;
    return (cols.find((c) => c.kind === 'strong') ?? cols[0]).key;
  });
  protected readonly detailCols = computed(() =>
    this.config().columns.filter((c) => c.key !== this.titleKey() && c.kind !== 'badge' && !c.detailOnly),
  );
  protected money(v: string | number): string {
    return (+v).toLocaleString('en-US');
  }

  protected readonly chips = computed(() => {
    const key = this.badgeKey();
    if (!key) return [];
    const rows = this.config().rows;
    const labels = [...new Set(rows.map((r) => String(r[key])))];
    return [
      { label: 'الكل', value: '', count: rows.length, rgb: TONE_RGB.gray },
      ...labels.map((l) => ({
        label: l,
        value: l,
        count: rows.filter((r) => r[key] === l).length,
        rgb: this.rgb(l),
      })),
    ];
  });

  protected readonly rows = computed(() => {
    const q = this.query().trim().toLowerCase();
    const key = this.badgeKey();
    const status = this.status();
    let rows = this.config().rows;
    if (key && status) rows = rows.filter((r) => r[key] === status);
    if (q) rows = rows.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(q)));
    const limit = this.limit();
    return limit ? rows.slice(0, limit) : rows;
  });

  private tone(value: string | number): BadgeTone {
    return this.config().badges?.[String(value)] ?? 'gray';
  }

  protected rgb(value: string | number): string {
    return TONE_RGB[this.tone(value)];
  }

  /** Amber/rose statuses pulse to draw attention. */
  protected live(value: string | number): boolean {
    return this.tone(value) === 'amber';
  }
}
