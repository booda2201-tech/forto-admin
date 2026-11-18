import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { ProductRow, ProductsService, productStatus } from '../../data/products.service';
import { TONE_RGB } from '../../data/mock-data';
import { IconComponent } from '../icon/icon.component';

const MAX_SIDE = 720; // uploaded photos are downscaled so they stay small in storage
const MAX_FILE = 10 * 1024 * 1024;

type Errors = Partial<Record<'name' | 'sku' | 'category' | 'price' | 'stock', string>>;

/** Add / edit sheet for a product. Talks to ProductsService directly and emits `closed` when done. */
@Component({
  selector: 'app-product-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  styleUrl: './product-form.component.scss',
  template: `
    <!-- native <dialog>: lives in the browser's top layer, so nothing (tab bar, sidebar) can cover it -->
    <dialog #dlg class="pf" dir="rtl" [attr.aria-label]="heading()" (cancel)="close()" (click)="onBackdrop($event)">
      <form class="pf-sheet glass-card relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden" (submit)="save($event)" novalidate>
        <header class="flex items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-4 sm:px-6">
          <div>
            <h3 class="text-lg font-extrabold">{{ heading() }}</h3>
            <p class="mt-0.5 text-xs text-gray-500">
              {{ product() ? 'عدّل بيانات المنتج وسيتحدّث المخزون فوراً' : 'أدخل بيانات المنتج وصورته ليظهر في قائمة المنتجات' }}
            </p>
          </div>
          <button type="button" class="keycap grid size-9 shrink-0 place-items-center rounded-lg text-gray-300" aria-label="إغلاق" (click)="close()">
            <app-icon name="close" [size]="16" />
          </button>
        </header>

        <div class="grid gap-6 overflow-y-auto p-5 sm:grid-cols-[11.5rem_minmax(0,1fr)] sm:p-6">
          <!-- photo -->
          <div>
            <label class="drop inset-well group relative grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-2xl">
              @if (image()) {
                <img [src]="image()" alt="" class="size-full object-cover" />
                <span class="drop-hint absolute inset-x-0 bottom-0 py-2 text-center text-xs font-semibold">تغيير الصورة</span>
              } @else {
                <span class="flex flex-col items-center gap-2 px-3 text-center text-xs text-gray-500">
                  <app-icon name="image" [size]="28" />
                  ارفع صورة المنتج
                  <span class="text-[10px] text-gray-600">JPG أو PNG</span>
                </span>
              }
              <input type="file" accept="image/*" class="sr-only" (change)="onFile($event)" />
            </label>
            @if (image()) {
              <button type="button" class="mt-2 text-xs text-gray-500 transition-colors hover:text-rose-400" (click)="image.set('')">إزالة الصورة</button>
            }
            @if (imageError()) {
              <p class="mt-2 text-xs text-rose-400">{{ imageError() }}</p>
            }
          </div>

          <!-- fields -->
          <div class="grid grid-cols-2 gap-x-4 gap-y-4">
            <label class="col-span-2 block">
              <span class="lbl">اسم المنتج <b class="text-rose-400">*</b></span>
              <input name="name" class="field inset-well" [class.bad]="errors().name" placeholder="مثال: شامبو غسيل مركز 5 لتر" [value]="name()" (input)="name.set($any($event.target).value); clear('name')" />
              @if (errors().name) {
                <span class="err">{{ errors().name }}</span>
              }
            </label>

            <label class="block">
              <span class="lbl">التصنيف <b class="text-rose-400">*</b></span>
              <input name="category" list="product-cats" class="field inset-well" [class.bad]="errors().category" placeholder="مثال: زيوت" [value]="category()" (input)="category.set($any($event.target).value); clear('category')" />
              <datalist id="product-cats">
                @for (c of categories(); track c) {
                  <option [value]="c"></option>
                }
              </datalist>
              @if (errors().category) {
                <span class="err">{{ errors().category }}</span>
              }
            </label>

            <label class="block">
              <span class="lbl">الكود (SKU)</span>
              <input name="sku" dir="ltr" class="field inset-well text-start" [class.bad]="errors().sku" [placeholder]="suggestedSku" [value]="sku()" (input)="sku.set($any($event.target).value); clear('sku')" />
              @if (errors().sku) {
                <span class="err">{{ errors().sku }}</span>
              }
            </label>

            <label class="block">
              <span class="lbl">السعر (ج.م) <b class="text-rose-400">*</b></span>
              <input name="price" type="number" min="0" step="any" inputmode="decimal" dir="ltr" class="field inset-well text-start" [class.bad]="errors().price" placeholder="0" [value]="price()" (input)="price.set($any($event.target).value); clear('price')" />
              @if (errors().price) {
                <span class="err">{{ errors().price }}</span>
              }
            </label>

            <label class="block">
              <span class="lbl">الكمية بالمخزون <b class="text-rose-400">*</b></span>
              <input name="stock" type="number" min="0" step="1" inputmode="numeric" dir="ltr" class="field inset-well text-start" [class.bad]="errors().stock" placeholder="0" [value]="stock()" (input)="stock.set($any($event.target).value); clear('stock')" />
              @if (errors().stock) {
                <span class="err">{{ errors().stock }}</span>
              }
            </label>

            <div class="col-span-2 flex items-center justify-between rounded-xl px-4 py-3 text-sm status-box">
              <span class="text-gray-400">الحالة (تلقائية حسب المخزون)</span>
              <span class="badge" [style.--tone]="statusTone().rgb"><i class="badge-dot"></i>{{ statusTone().label }}</span>
            </div>
          </div>
        </div>

        <footer class="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] px-5 py-4 sm:px-6">
          <div>
            @if (product()) {
              @if (!confirming()) {
                <button type="button" class="danger inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold" (click)="confirming.set(true)">
                  <app-icon name="trash" [size]="16" /> حذف المنتج
                </button>
              } @else {
                <span class="flex items-center gap-2 text-sm">
                  <span class="text-gray-400">متأكد من الحذف؟</span>
                  <button type="button" class="danger danger-on rounded-xl px-3.5 py-2 text-sm font-bold" (click)="remove()">نعم، احذف</button>
                  <button type="button" class="px-2 py-2 text-sm text-gray-500 hover:text-white" (click)="confirming.set(false)">تراجع</button>
                </span>
              }
            }
          </div>
          <div class="flex items-center gap-2">
            <button type="button" class="keycap rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-300" (click)="close()">إلغاء</button>
            <button type="submit" class="save-btn inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold">
              {{ product() ? 'حفظ التعديلات' : 'إضافة المنتج' }}
            </button>
          </div>
        </footer>
      </form>
    </dialog>
  `,
})
export class ProductFormComponent implements OnInit, AfterViewInit {
  /** The row being edited, or null when adding a new product. */
  readonly product = input<ProductRow | null>(null);
  readonly closed = output<void>();

  private readonly store = inject(ProductsService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  protected readonly categories = this.store.categories;
  protected readonly suggestedSku = this.store.nextSku();

  protected readonly name = signal('');
  protected readonly sku = signal('');
  protected readonly category = signal('');
  protected readonly price = signal('');
  protected readonly stock = signal('');
  protected readonly image = signal('');
  protected readonly imageError = signal('');
  protected readonly errors = signal<Errors>({});
  protected readonly confirming = signal(false);

  protected readonly heading = computed(() => (this.product() ? 'تعديل منتج' : 'إضافة منتج جديد'));

  protected readonly statusTone = computed(() => {
    const n = Math.max(0, Math.floor(Number(this.stock()) || 0));
    const label = productStatus(n);
    const tone = label === 'نفد' ? 'rose' : label === 'كمية قليلة' ? 'amber' : 'emerald';
    return { label, rgb: TONE_RGB[tone] };
  });

  ngOnInit(): void {
    const p = this.product();
    if (p) {
      this.name.set(String(p['name']));
      this.sku.set(String(p['sku']));
      this.category.set(String(p['category']));
      this.price.set(String(p['price']));
      this.stock.set(String(p['stock']));
      this.image.set(p['image'] ? String(p['image']) : '');
    }
  }

  ngAfterViewInit(): void {
    this.dlg().nativeElement.showModal();
    this.host.nativeElement.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
  }

  /** Clicks on the dimmed area around the sheet land on the <dialog> itself. */
  protected onBackdrop(e: MouseEvent): void {
    if (e.target === this.dlg().nativeElement) this.close();
  }

  /** Drops a field's error message as soon as the user edits it. */
  protected clear(key: keyof Errors): void {
    if (this.errors()[key]) this.errors.update((e) => ({ ...e, [key]: undefined }));
  }

  protected close(): void {
    this.closed.emit();
  }

  protected save(e: Event): void {
    e.preventDefault();
    const errors: Errors = {};
    const name = this.name().trim();
    const category = this.category().trim();
    const sku = this.sku().trim() || this.suggestedSku;
    const price = Number(this.price());
    const stock = Number(this.stock());
    const original = this.product() ? String(this.product()!['sku']) : undefined;

    if (!name) errors.name = 'اكتب اسم المنتج';
    if (!category) errors.category = 'اختر أو اكتب التصنيف';
    if (this.price() === '' || Number.isNaN(price) || price < 0) errors.price = 'أدخل سعراً صحيحاً';
    if (this.stock() === '' || Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) errors.stock = 'أدخل كمية صحيحة (رقم صحيح)';
    if (this.store.skuTaken(sku, original)) errors.sku = 'هذا الكود مستخدم لمنتج آخر';

    this.errors.set(errors);
    if (Object.keys(errors).length) return;

    const input = { name, sku, category, price, stock, image: this.image() };
    if (original) this.store.update(original, input);
    else this.store.add(input);
    this.close();
  }

  protected remove(): void {
    const p = this.product();
    if (p) this.store.remove(String(p['sku']));
    this.close();
  }

  protected onFile(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    this.imageError.set('');
    if (!file.type.startsWith('image/')) return void this.imageError.set('الملف لازم يكون صورة');
    if (file.size > MAX_FILE) return void this.imageError.set('الصورة أكبر من 10 ميجا');

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * k);
        canvas.height = Math.round(img.height * k);
        canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
        this.image.set(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => this.imageError.set('تعذّر قراءة الصورة');
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }
}

