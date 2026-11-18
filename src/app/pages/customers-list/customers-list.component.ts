import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { CustomersService } from '../../customers/customers.service';
import { CustomerTier, TIER_LABELS } from '../../customers/customer.models';
import { formatDate, formatMoney, initials, relativeDays } from '../../customers/format';

type TierFilter = 'all' | CustomerTier;

@Component({
  selector: 'app-customers-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.scss',
})
export class CustomersListComponent {
  private readonly service = inject(CustomersService);

  protected readonly query = signal('');
  protected readonly tier = signal<TierFilter>('all');

  protected readonly tierLabels = TIER_LABELS;
  protected readonly filters: { id: TierFilter; label: string }[] = [
    { id: 'all', label: 'الكل' },
    { id: 'vip', label: 'VIP' },
    { id: 'regular', label: 'منتظم' },
    { id: 'new', label: 'جديد' },
  ];

  protected readonly rows = computed(() => {
    const q = this.query().trim().toLowerCase();
    const tier = this.tier();
    return this.service
      .summaries()
      .filter((s) => tier === 'all' || s.customer.tier === tier)
      .filter(
        (s) =>
          !q ||
          s.customer.name.toLowerCase().includes(q) ||
          s.customer.phone.replace(/\s/g, '').includes(q.replace(/\s/g, '')) ||
          s.customer.cars.some(
            (c) =>
              c.plate.replace(/\s/g, '').includes(q.replace(/\s/g, '')) ||
              `${c.make} ${c.model}`.toLowerCase().includes(q),
          ),
      )
      .sort((a, b) => (b.lastVisit ?? '').localeCompare(a.lastVisit ?? ''));
  });

  protected readonly totals = computed(() => {
    const all = this.service.summaries();
    return {
      customers: all.length,
      vip: all.filter((s) => s.customer.tier === 'vip').length,
      cars: all.reduce((n, s) => n + s.customer.cars.length, 0),
      spent: all.reduce((n, s) => n + s.totalSpent, 0),
    };
  });

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected readonly formatDate = formatDate;
  protected readonly formatMoney = formatMoney;
  protected readonly initials = initials;
  protected readonly relativeDays = relativeDays;
}
