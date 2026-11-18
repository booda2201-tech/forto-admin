import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { CustomersService } from '../../customers/customers.service';
import { TABLES } from '../../data/mock-data';
import { ProductsService } from '../../data/products.service';
import { IconComponent, IconName } from '../icon/icon.component';

interface PaletteItem {
  group: string;
  icon: IconName;
  title: string;
  hint: string;
  route: string;
  /** Lower-cased haystack used for matching. */
  haystack: string;
}

const PAGES: { icon: IconName; title: string; hint: string; route: string }[] = [
  { icon: 'dashboard', title: 'نظرة عامة', hint: 'مؤشرات الأداء', route: '/overview' },
  { icon: 'services', title: 'الخدمات والأسعار', hint: 'قائمة الخدمات', route: '/services' },
  { icon: 'customers', title: 'العملاء والسيارات', hint: 'بيانات العملاء', route: '/customers' },
  { icon: 'visits', title: 'سجل الزيارات', hint: 'آخر الزيارات', route: '/visits' },
  { icon: 'bookings', title: 'الحجوزات', hint: 'الحجوزات القادمة', route: '/bookings' },
  { icon: 'products', title: 'المنتجات والإكسسوارات', hint: 'المخزون والأسعار', route: '/products' },
];

const MAX_PER_GROUP = 5;

/** Ctrl/⌘+K command palette: search pages, customers (by name/phone/plate), services and products. */
@Component({
  selector: 'app-command-palette',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  styleUrl: './command-palette.component.scss',
  host: { '(document:keydown.escape)': 'close()' },
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-[70]" dir="rtl" role="dialog" aria-modal="true" aria-label="بحث سريع">
        <button type="button" class="backdrop absolute inset-0 cursor-default" aria-label="إغلاق" (click)="close()"></button>

        <div class="panel-wrap pointer-events-none relative mx-auto mt-[10vh] w-[min(42rem,92vw)]">
          <div class="panel pointer-events-auto">
            <div class="panel-inner overflow-hidden rounded-[1.25rem]">
              <label class="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4">
                <svg class="size-5 shrink-0 text-[#f7931e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  #field
                  type="text"
                  autocomplete="off"
                  spellcheck="false"
                  aria-label="بحث سريع"
                  placeholder="ابحث عن صفحة أو عميل أو رقم هاتف أو لوحة سيارة..."
                  class="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-gray-500"
                  [value]="query()"
                  (input)="onInput($any($event.target).value)"
                  (keydown)="onKey($event)"
                />
                <kbd class="kbd">Esc</kbd>
              </label>

              <div class="results max-h-[min(24rem,52vh)] overflow-y-auto p-2" role="listbox">
                @for (g of groups(); track g.label) {
                  <p class="group-label px-3 pb-1.5 pt-3 text-[11px] font-bold tracking-wider text-gray-500">{{ g.label }}</p>
                  @for (r of g.items; track r.item.route + r.item.title) {
                    <button
                      type="button"
                      role="option"
                      class="result flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start"
                      [class.on]="r.index === active()"
                      [attr.aria-selected]="r.index === active()"
                      [style.--i]="r.index"
                      (mouseenter)="active.set(r.index)"
                      (click)="go(r.item)"
                    >
                      <span class="icon grid size-9 shrink-0 place-items-center rounded-lg text-base"><app-icon [name]="r.item.icon" [size]="18" /></span>
                      <span class="min-w-0 flex-1">
                        <span class="block truncate text-sm font-semibold">{{ r.item.title }}</span>
                        <span class="block truncate text-xs text-gray-500">{{ r.item.hint }}</span>
                      </span>
                      <span class="enter hidden items-center gap-1 text-xs text-gray-500 md:flex">فتح <kbd class="kbd">↵</kbd></span>
                    </button>
                  }
                } @empty {
                  <div class="px-4 py-12 text-center">
                    <app-icon name="search" [size]="30" class="mx-auto text-gray-600" />
                    <p class="mt-3 text-sm text-gray-400">لا توجد نتائج لـ «{{ query() }}»</p>
                  </div>
                }
              </div>

              <footer class="hidden items-center justify-between border-t border-white/[0.07] px-5 py-3 text-xs text-gray-500 md:flex">
                <span class="flex items-center gap-4">
                  <span class="flex items-center gap-1.5"><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> تنقّل</span>
                  <span class="flex items-center gap-1.5"><kbd class="kbd">↵</kbd> فتح</span>
                  <span class="flex items-center gap-1.5"><kbd class="kbd">Esc</kbd> إغلاق</span>
                </span>
                <span>{{ total() }} نتيجة</span>
              </footer>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class CommandPaletteComponent {
  readonly open = model(false);

  private readonly router = inject(Router);
  private readonly customers = inject(CustomersService);
  private readonly products = inject(ProductsService);
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');

  protected readonly query = signal('');
  protected readonly active = signal(0);

  /** Everything searchable, built once from the data sources. */
  private readonly catalog = computed<PaletteItem[]>(() => {
    const items: PaletteItem[] = PAGES.map((p) => ({ group: 'الصفحات', ...p, haystack: `${p.title} ${p.hint}`.toLowerCase() }));

    for (const c of this.customers.allCustomers()) {
      const cars = c.cars.map((car) => `${car.make} ${car.model} ${car.plate}`).join(' · ');
      items.push({
        group: 'العملاء',
        icon: 'user',
        title: c.name,
        hint: `${c.phone} · ${cars}`,
        route: `/customers/${c.id}`,
        haystack: `${c.name} ${c.phone} ${cars} ${c.area}`.toLowerCase(),
      });
    }

    const add = (table: string, group: string, icon: IconName, route: string, hint: (r: Record<string, string | number>) => string) => {
      for (const r of table === 'products' ? this.products.rows() : TABLES[table].rows) {
        items.push({ group, icon, title: String(r['name']), hint: hint(r), route, haystack: `${r['name']} ${hint(r)}`.toLowerCase() });
      }
    };
    add('services', 'الخدمات', 'services', '/services', (r) => `${r['category']} · ${r['price']} ج.م`);
    add('products', 'المنتجات', 'products', '/products', (r) => `${r['sku']} · ${r['price']} ج.م`);

    return items;
  });

  protected readonly groups = computed(() => {
    const q = this.query().trim().toLowerCase();
    const matches = this.catalog().filter((i) => !q || i.haystack.includes(q));
    const byGroup = new Map<string, PaletteItem[]>();
    for (const m of matches) {
      const list = byGroup.get(m.group) ?? [];
      if (list.length < MAX_PER_GROUP) byGroup.set(m.group, [...list, m]);
    }
    let index = 0;
    return [...byGroup.entries()].map(([label, items]) => ({
      label,
      items: items.map((item) => ({ item, index: index++ })),
    }));
  });

  protected readonly flat = computed(() => this.groups().flatMap((g) => g.items.map((r) => r.item)));
  protected readonly total = computed(() => this.flat().length);

  constructor() {
    // reset + focus every time the palette opens
    effect(() => {
      if (this.open()) {
        this.query.set('');
        this.active.set(0);
        setTimeout(() => this.field()?.nativeElement.focus(), 30);
      }
    });
  }

  protected close(): void {
    if (this.open()) this.open.set(false);
  }

  protected onInput(value: string): void {
    this.query.set(value);
    this.active.set(0);
  }

  protected onKey(e: KeyboardEvent): void {
    const n = this.total();
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!n) return;
      this.active.update((a) => (e.key === 'ArrowDown' ? (a + 1) % n : (a - 1 + n) % n));
      queueMicrotask(() => document.querySelector('.result.on')?.scrollIntoView({ block: 'nearest' }));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = this.flat()[this.active()];
      if (item) this.go(item);
    }
  }

  protected go(item: PaletteItem): void {
    this.close();
    void this.router.navigateByUrl(item.route);
  }
}
