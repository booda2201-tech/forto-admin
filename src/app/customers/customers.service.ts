import { Injectable, computed, signal } from '@angular/core';
import { CUSTOMERS, buildVisits } from './customers.data';
import { Customer, SECTION_LABELS, ServiceSection, Visit } from './customer.models';

export interface CustomerSummary {
  customer: Customer;
  visitsCount: number;
  totalSpent: number;
  lastVisit?: string;
  upcoming?: string;
}

/**
 * In-memory customers store. Swap the signals' sources for HTTP calls later;
 * the components only depend on the public API below.
 */
@Injectable({ providedIn: 'root' })
export class CustomersService {
  private readonly customers = signal<Customer[]>(CUSTOMERS);
  private readonly visits = signal<Visit[]>(buildVisits());

  readonly allCustomers = this.customers.asReadonly();

  readonly summaries = computed<CustomerSummary[]>(() =>
    this.customers().map((customer) => this.summarize(customer, this.visits())),
  );

  customerById(id: string | undefined): Customer | undefined {
    return this.customers().find((c) => c.id === id);
  }

  /** Newest first. */
  visitsFor(customerId: string): Visit[] {
    return this.visits()
      .filter((v) => v.customerId === customerId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  summaryFor(customerId: string): CustomerSummary | undefined {
    return this.summaries().find((s) => s.customer.id === customerId);
  }

  /** Revenue per division for a customer (completed visits only). */
  spendBySection(customerId: string): { section: ServiceSection; label: string; amount: number }[] {
    const totals = new Map<ServiceSection, number>();
    for (const v of this.visitsFor(customerId)) {
      if (v.status !== 'completed') continue;
      for (const s of v.services) totals.set(s.section, (totals.get(s.section) ?? 0) + s.price);
    }
    return [...totals.entries()]
      .map(([section, amount]) => ({ section, label: SECTION_LABELS[section], amount }))
      .sort((a, b) => b.amount - a.amount);
  }

  private summarize(customer: Customer, visits: Visit[]): CustomerSummary {
    const mine = visits.filter((v) => v.customerId === customer.id);
    const done = mine.filter((v) => v.status === 'completed' || v.status === 'in-progress');
    const sorted = [...done].sort((a, b) => b.date.localeCompare(a.date));
    const upcoming = mine
      .filter((v) => v.status === 'booked')
      .sort((a, b) => a.date.localeCompare(b.date))[0];

    return {
      customer,
      visitsCount: done.length,
      totalSpent: mine.filter((v) => v.status === 'completed').reduce((s, v) => s + v.total, 0),
      lastVisit: sorted[0]?.date,
      upcoming: upcoming?.date,
    };
  }
}
