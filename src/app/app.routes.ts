import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

/** Data-table page backed by `TABLES[path]` in data/mock-data.ts. */
const tablePage = (path: string, heading: string) => ({
  path,
  title: `${heading} | Forto Car Care`,
  data: { table: path },
  loadComponent: () =>
    import('./pages/table-page/table-page.component').then((m) => m.TablePageComponent),
});

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        title: 'نظرة عامة | Forto Car Care',
        loadComponent: () =>
          import('./pages/dashboard-overview/dashboard-overview.component').then(
            (m) => m.DashboardOverviewComponent,
          ),
      },
      {
        path: 'customers',
        title: 'العملاء والسيارات | Forto Car Care',
        loadComponent: () =>
          import('./pages/customers-list/customers-list.component').then(
            (m) => m.CustomersListComponent,
          ),
      },
      {
        path: 'customers/:id',
        title: 'ملف العميل | Forto Car Care',
        loadComponent: () =>
          import('./pages/customer-profile/customer-profile.component').then(
            (m) => m.CustomerProfileComponent,
          ),
      },
      tablePage('services', 'الخدمات والأسعار'),
      tablePage('visits', 'سجل الزيارات'),
      tablePage('bookings', 'الحجوزات'),
      tablePage('products', 'المنتجات والإكسسوارات'),
    ],
  },
  { path: '**', redirectTo: 'overview' },
];
