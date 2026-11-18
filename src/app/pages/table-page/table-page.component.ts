import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CENTERS, CenterMeta, TABLES, TONE_RGB, TableConfig } from '../../data/mock-data';
import { CountUpDirective } from '../../shared/count-up.directive';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { SmartViewComponent } from '../../shared/smart-view/smart-view.component';
import { IconComponent, IconName } from '../../shared/icon/icon.component';
import { ProductFormComponent } from '../../shared/product-form/product-form.component';
import { ProductRow, ProductsService } from '../../data/products.service';

type ViewMode = 'smart' | 'table';

@Component({
  selector: 'app-table-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataTableComponent, SmartViewComponent, CountUpDirective, IconComponent, ProductFormComponent],
  styleUrl: './table-page.component.scss',
  template: `
    <div class="flex flex-col gap-6">
      <div class="reveal flex flex-wrap items-end justify-between gap-4" style="--i: 0">
        <div>
          <h2 class="text-2xl font-extrabold sm:text-3xl">{{ config.title }}</h2>
          <p class="mt-1 text-sm text-gray-400">{{ config.subtitle }}</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <span class="keycap inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-gray-300">
            <span class="size-1.5 animate-pulse rounded-full bg-emerald-400"></span>
            {{ rows().length }} سجل
          </span>
          @if (isProducts) {
            <button type="button" class="add-btn inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold" (click)="openForm(null)">
              <app-icon name="plus" [size]="17" />
              إضافة منتج
            </button>
          }
        </div>
      </div>

      <section class="grid grid-cols-2 gap-5 xl:grid-cols-4">
        @for (s of summary(); track s.key; let i = $index) {
          <article class="glass-card stat reveal p-5" [style.--i]="i + 1" [style.--tone]="s.rgb">
            <p class="flex items-center gap-2 text-sm text-gray-400"><i class="stat-dot"></i>{{ s.label }}</p>
            <p class="mt-2 text-3xl font-extrabold tracking-tight text-white" dir="ltr">
              <span [appCountUp]="s.value" [delay]="400 + i * 90">0</span>
            </p>
            @if (i > 0) {
              <div class="mt-3 flex items-center gap-3">
                <div class="inset-well h-1.5 flex-1 overflow-hidden rounded-full">
                  <div class="stat-fill h-full rounded-full" [style.width.%]="s.pct"></div>
                </div>
                <span class="text-xs text-gray-500" dir="ltr">{{ s.pct }}%</span>
              </div>
            } @else {
              <p class="mt-3 text-xs text-gray-500">كل السجلات</p>
            }
          </article>
        }
      </section>

      @if (config.layout) {
        <!-- toolbar: search + animated segmented view switch -->
        <div class="reveal flex flex-wrap items-center justify-between gap-3" style="--i: 5">
          @if (view() === 'smart') {
            <label class="inset-well search group flex h-11 w-full items-center gap-2.5 rounded-xl px-3.5 sm:w-80">
              <svg class="size-4 text-gray-500 transition-colors group-focus-within:text-[#f7931e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                placeholder="بحث..."
                class="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                (input)="query.set($any($event.target).value)"
              />
            </label>
          } @else {
            <span></span>
          }

          <div class="switch inset-well relative grid grid-cols-2 rounded-xl p-1" [attr.data-view]="view()" role="tablist">
            <span class="switch-thumb" aria-hidden="true"></span>
            <button type="button" role="tab" class="switch-btn" [class.on]="view() === 'smart'" (click)="view.set('smart')">
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="5" rx="2" />
                <rect x="13" y="12" width="8" height="9" rx="2" /><rect x="3" y="15" width="8" height="6" rx="2" />
              </svg>
              عرض ذكي
            </button>
            <button type="button" role="tab" class="switch-btn" [class.on]="view() === 'table'" (click)="view.set('table')">
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
              جدول
            </button>
          </div>
        </div>
      }

      <!-- center filter (only for configs with groupBy, e.g. services) -->
      @if (config.groupBy) {
        <div class="reveal -mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0" style="--i: 6" role="tablist" aria-label="تصفية حسب المركز">
          @for (t of tabs(); track t.value) {
            <button
              type="button"
              role="tab"
              class="center-tab"
              [class.on]="center() === t.value"
              [attr.aria-selected]="center() === t.value"
              [style.--tone]="t.rgb"
              (click)="center.set(t.value)"
            >
              <span class="center-ico"><app-icon [name]="t.icon" [size]="18" /></span>
              <span class="text-start">
                <span class="block text-sm font-bold">{{ t.label }}</span>
                @if (t.sub) {
                  <span class="block text-[11px] text-gray-500">{{ t.sub }}</span>
                }
              </span>
              <span class="center-count" dir="ltr">{{ t.count }}</span>
            </button>
          }
        </div>
      }

      @for (g of groups(); track g.value; let gi = $index) {
        <section class="flex flex-col gap-5">
          @if (g.meta) {
            <!-- center header -->
            <header class="center-head reveal" [style.--i]="7 + gi" [style.--tone]="g.meta.rgb">
              <div class="center-ico lg"><app-icon [name]="g.meta.icon" [size]="26" /></div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-baseline gap-x-3">
                  <h3 class="text-xl font-extrabold">{{ g.value }}</h3>
                  <span class="text-xs font-semibold tracking-wide text-gray-500" dir="ltr">{{ g.meta.en }}</span>
                </div>
                <p class="mt-1 text-sm text-gray-400">{{ g.meta.tagline }} · {{ g.meta.desc }}</p>
              </div>
              <div class="hidden text-end sm:block">
                <p class="text-2xl font-extrabold" style="color: color-mix(in srgb, rgb(var(--tone)) var(--tone-mix), #000)">{{ g.config.rows.length }}</p>
                <p class="text-[11px] text-gray-500">خدمة · من {{ g.min }} إلى {{ g.max }} ج.م</p>
              </div>
            </header>
          }

          @if (config.layout && view() === 'smart') {
            <app-smart-view [config]="g.config" [query]="query()" [editable]="isProducts" (edit)="openForm($event)" />
          } @else {
            <section class="glass-card reveal overflow-hidden" style="--i: 7">
              <app-data-table [config]="g.config" [searchable]="!config.groupBy" />
            </section>
          }
        </section>
      }

      @if (formOpen()) {
        <app-product-form [product]="editing()" (closed)="closeForm()" />
      }
    </div>
  `,
})
export class TablePageComponent {
  private readonly tableKey: string = inject(ActivatedRoute).snapshot.data['table'];
  protected readonly config: TableConfig = TABLES[this.tableKey];
  private readonly products = inject(ProductsService);

  /** Products are editable and live in ProductsService; every other table is static mock data. */
  protected readonly isProducts = this.tableKey === 'products';
  protected readonly rows = computed(() => (this.isProducts ? this.products.rows() : this.config.rows));

  protected readonly formOpen = signal(false);
  protected readonly editing = signal<ProductRow | null>(null);

  protected openForm(row: ProductRow | null): void {
    this.editing.set(row);
    this.formOpen.set(true);
  }

  protected closeForm(): void {
    this.formOpen.set(false);
    this.editing.set(null);
  }
  protected readonly view = signal<ViewMode>('smart');
  protected readonly query = signal('');

  /** Selected group value (e.g. a center) – 'all' shows every group. */
  protected readonly center = signal<string>('all');

  /** Rows of the active center (all rows when ungrouped / "all"). */
  private readonly activeRows = computed(() => {
    const rows = this.rows();
    const { groupBy } = this.config;
    const c = this.center();
    return groupBy && c !== 'all' ? rows.filter((r) => r[groupBy] === c) : rows;
  });

  protected readonly tabs = computed(() => {
    const rows = this.rows();
    const { groupBy } = this.config;
    if (!groupBy) return [];
    const values = [...new Set(rows.map((r) => String(r[groupBy])))];
    return [
      { value: 'all', label: 'كل المراكز', sub: '', icon: 'car' as IconName, rgb: '247 147 30', count: rows.length },
      ...values.map((v) => ({
        value: v,
        label: v,
        sub: CENTERS[v]?.tagline ?? '',
        icon: (CENTERS[v]?.icon ?? 'car') as IconName,
        rgb: CENTERS[v]?.rgb ?? '156 163 175',
        count: rows.filter((r) => r[groupBy] === v).length,
      })),
    ];
  });

  /** One entry per visible center, each with its own filtered TableConfig. */
  protected readonly groups = computed(() => {
    const { groupBy } = this.config;
    if (!groupBy) {
      return [{ value: '', meta: undefined as CenterMeta | undefined, config: { ...this.config, rows: this.rows() }, min: 0, max: 0 }];
    }
    const q = this.query().trim().toLowerCase();
    const selected = this.center();
    return this.tabs()
      .filter((t) => t.value !== 'all' && (selected === 'all' || selected === t.value))
      .map((t) => {
        const rows = this.rows().filter((r) => r[groupBy] === t.value);
        const prices = rows.map((r) => Number(r['price'])).filter((n) => !Number.isNaN(n));
        return {
          value: t.value,
          meta: CENTERS[t.value] as CenterMeta | undefined,
          config: { ...this.config, rows },
          min: Math.min(...prices).toLocaleString('en-US'),
          max: Math.max(...prices).toLocaleString('en-US'),
          matches: !q || rows.some((r) => Object.values(r).join(' ').toLowerCase().includes(q)),
        };
      })
      .filter((g) => this.view() === 'table' || g.matches)
      .map(({ matches: _m, ...g }) => g);
  });

  /** "Total" card + one card per status, derived from the (center-filtered) data. */
  protected readonly summary = computed(() => this.buildSummary(this.activeRows()));

  private buildSummary(rows: TableConfig['rows']) {
    const { columns, badges = {} } = this.config;
    const key = columns.find((c) => c.kind === 'badge')?.key;
    const scope = this.center();
    const cards = [{ key: 'الإجمالي|' + scope, label: 'الإجمالي', value: rows.length, rgb: '247 147 30', pct: 100 }];
    if (key) {
      for (const label of [...new Set(rows.map((r) => String(r[key])))].slice(0, 3)) {
        cards.push({
          key: label + '|' + scope,
          label,
          value: rows.filter((r) => r[key] === label).length,
          pct: Math.round((rows.filter((r) => r[key] === label).length / (rows.length || 1)) * 100),
          rgb: TONE_RGB[badges[label] ?? 'gray'],
        });
      }
    }
    return cards;
  }
}

