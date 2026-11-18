import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { CustomersService } from '../../customers/customers.service';
import {
  PAYMENT_LABELS,
  SECTION_LABELS,
  STATUS_LABELS,
  TIER_LABELS,
  Visit,
  VisitStatus,
} from '../../customers/customer.models';
import { formatDate, formatMoney, initials, relativeDays, toWhatsApp } from '../../customers/format';

type StatusFilter = 'all' | VisitStatus;

@Component({
  selector: 'app-customer-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.scss',
})
export class CustomerProfileComponent {
  private readonly service = inject(CustomersService);

  /** Bound from the `:id` route param (withComponentInputBinding). */
  readonly id = input.required<string>();

  protected readonly carFilter = signal<string>('all');
  protected readonly statusFilter = signal<StatusFilter>('all');

  protected readonly customer = computed(() => this.service.customerById(this.id()));
  protected readonly summary = computed(() => this.service.summaryFor(this.id()));
  protected readonly allVisits = computed(() => this.service.visitsFor(this.id()));
  protected readonly spend = computed(() => this.service.spendBySection(this.id()));
  protected readonly maxSpend = computed(() => Math.max(1, ...this.spend().map((s) => s.amount)));

  protected readonly completed = computed(() => this.allVisits().filter((v) => v.status === 'completed'));
  protected readonly avgTicket = computed(() => {
    const done = this.completed();
    return done.length ? Math.round(done.reduce((s, v) => s + v.total, 0) / done.length) : 0;
  });
  protected readonly avgRating = computed(() => {
    const rated = this.completed().filter((v) => v.rating);
    return rated.length ? rated.reduce((s, v) => s + (v.rating ?? 0), 0) / rated.length : 0;
  });

  protected readonly visits = computed(() => {
    const car = this.carFilter();
    const status = this.statusFilter();
    return this.allVisits().filter(
      (v) => (car === 'all' || v.carId === car) && (status === 'all' || v.status === status),
    );
  });

  protected readonly statusFilters: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: 'الكل' },
    { id: 'completed', label: STATUS_LABELS.completed },
    { id: 'in-progress', label: STATUS_LABELS['in-progress'] },
    { id: 'booked', label: STATUS_LABELS.booked },
    { id: 'cancelled', label: STATUS_LABELS.cancelled },
  ];

  protected readonly statusLabels = STATUS_LABELS;
  protected readonly tierLabels = TIER_LABELS;
  protected readonly paymentLabels = PAYMENT_LABELS;
  protected readonly sectionLabels = SECTION_LABELS;

  protected carName(carId: string): string {
    const c = this.customer()?.cars.find((x) => x.id === carId);
    return c ? `${c.make} ${c.model} ${c.year}` : '—';
  }

  protected carPlate(carId: string): string {
    return this.customer()?.cars.find((x) => x.id === carId)?.plate ?? '';
  }

  protected carVisitCount(carId: string): number {
    return this.allVisits().filter((v) => v.carId === carId && v.status === 'completed').length;
  }

  protected stars(rating: number | undefined): number[] {
    return Array.from({ length: rating ?? 0 }, (_, i) => i);
  }

  protected trackVisit = (_: number, v: Visit) => v.id;

  protected readonly formatDate = formatDate;
  protected readonly formatMoney = formatMoney;
  protected readonly initials = initials;
  protected readonly relativeDays = relativeDays;
  protected readonly toWhatsApp = toWhatsApp;
}
