import { Injectable, computed, effect, signal } from '@angular/core';
import { TABLES } from './mock-data';

export type ProductRow = Record<string, string | number>;

export interface ProductInput {
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

const KEY = 'forto.products';
export const LOW_STOCK = 10;

/** Stock level → the status label used by the badges / colours of the products table. */
export function productStatus(stock: number): string {
  return stock <= 0 ? 'نفد' : stock < LOW_STOCK ? 'كمية قليلة' : 'متوفر';
}

/**
 * Single source of truth for the product catalogue. Seeded from the mock data, then every
 * add / edit / delete is persisted in localStorage so it survives a refresh.
 */
@Injectable({ providedIn: 'root' })
export class ProductsService {
  readonly rows = signal<ProductRow[]>(this.load());

  readonly categories = computed(() => [...new Set(this.rows().map((r) => String(r['category'])))].filter(Boolean));

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(this.rows()));
      } catch {
        // storage full (large photos) – the catalogue still works for this session
      }
    });
  }

  skuTaken(sku: string, except?: string): boolean {
    const s = sku.trim().toLowerCase();
    return this.rows().some((r) => String(r['sku']).toLowerCase() === s && String(r['sku']) !== except);
  }

  /** PR-001, PR-002 … continuing after the highest existing PR- number. */
  nextSku(): string {
    const max = this.rows().reduce((m, r) => {
      const n = /^PR-(\d+)$/.exec(String(r['sku']));
      return n ? Math.max(m, +n[1]) : m;
    }, 0);
    return 'PR-' + String(max + 1).padStart(3, '0');
  }

  add(input: ProductInput): void {
    this.rows.update((rows) => [this.toRow(input), ...rows]);
  }

  update(originalSku: string, input: ProductInput): void {
    this.rows.update((rows) => rows.map((r) => (String(r['sku']) === originalSku ? this.toRow(input) : r)));
  }

  remove(sku: string): void {
    this.rows.update((rows) => rows.filter((r) => String(r['sku']) !== sku));
  }

  private toRow(i: ProductInput): ProductRow {
    const row: ProductRow = {
      name: i.name,
      sku: i.sku,
      ...(i.image ? { image: i.image } : {}),
      category: i.category,
      price: i.price,
      stock: i.stock,
      status: productStatus(i.stock),
    };
    return row;
  }

  private load(): ProductRow[] {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // corrupted storage → fall back to the seed data
    }
    return TABLES['products'].rows;
  }
}
