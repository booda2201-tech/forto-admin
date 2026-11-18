import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, computed, effect, inject, signal } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommandPaletteComponent } from '../../shared/command-palette/command-palette.component';
import { IconComponent, IconName } from '../../shared/icon/icon.component';
import { ThemeService } from '../../shared/theme.service';

const RAIL_KEY = 'forto.sidebar-collapsed';

interface NavItem {
  label: string;
  /** Short label for the phone/tablet tab bar. */
  short: string;
  path: string;
  icon: IconName;
  /** Small live counter shown next to the label. */
  badge?: number;
  /** Pinned to the phone/tablet tab bar; the rest live under المزيد. */
  tab?: boolean;
}

const CLOCK_FMT = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});
const DATE_FMT = new Intl.DateTimeFormat('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });

@Component({
  selector: 'app-admin-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent, CommandPaletteComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  protected readonly navItems: NavItem[] = [
    { label: 'نظرة عامة', short: 'الرئيسية', path: '/overview', icon: 'dashboard', tab: true },
    { label: 'الخدمات والأسعار', short: 'الخدمات', path: '/services', icon: 'services' },
    { label: 'العملاء والسيارات', short: 'العملاء', path: '/customers', icon: 'customers' },
    { label: 'سجل الزيارات', short: 'الزيارات', path: '/visits', icon: 'visits', badge: 3, tab: true },
    { label: 'الحجوزات', short: 'الحجوزات', path: '/bookings', icon: 'bookings', badge: 4, tab: true },
    { label: 'المنتجات والإكسسوارات', short: 'المنتجات', path: '/products', icon: 'products' },
  ];

  protected readonly tabItems = this.navItems.filter((n) => n.tab);
  protected readonly moreItems = this.navItems.filter((n) => !n.tab);
  protected readonly theme = inject(ThemeService);
  protected readonly accountOpen = signal(false);
  /**
   * Desktop: slim icon rail that expands over the content on hover (default, saves space).
   * Toggling pins the full-width sidebar instead. Remembered across reloads.
   */
  protected readonly collapsed = signal(localStorage.getItem(RAIL_KEY) !== '0');
  protected readonly paletteOpen = signal(false);
  /** Index of the nav item matching the current URL (-1 = none); drives the gliding pill. */
  protected readonly activeIndex = signal(-1);
  /** Active tab-bar slot: a pinned page, the المزيد slot (last) for everything else, -1 = none. */
  protected readonly tabIndex = computed(() => {
    const i = this.activeIndex();
    if (i < 0) return -1;
    const t = this.tabItems.indexOf(this.navItems[i]);
    return t < 0 ? this.tabItems.length : t;
  });
  /** 0–100: how far through the current minute we are (clock card progress bar). */
  protected readonly secondsPct = computed(() => (Number(this.clock().slice(6, 8)) / 60) * 100);
  /** True while the route skeleton is on screen. */
  protected readonly loading = signal(true);
  protected readonly clock = signal(this.now());
  protected readonly date = signal(DATE_FMT.format(new Date()));

  constructor() {
    const router = inject(Router);
    const destroyRef = inject(DestroyRef);

    effect(() => localStorage.setItem(RAIL_KEY, this.collapsed() ? '1' : '0'));

    let skeletonTimer: ReturnType<typeof setTimeout> | undefined;
    const sub = router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        clearTimeout(skeletonTimer);
        this.loading.set(true);
      } else if (e instanceof NavigationEnd) {
        this.activeIndex.set(this.navItems.findIndex((n) => e.urlAfterRedirects.startsWith(n.path)));
        this.accountOpen.set(false);
        clearTimeout(skeletonTimer);
        skeletonTimer = setTimeout(() => this.loading.set(false), 750);
      }
    });

    const tick = setInterval(() => {
      this.clock.set(this.now());
      this.date.set(DATE_FMT.format(new Date()));
    }, 1000);

    destroyRef.onDestroy(() => {
      sub.unsubscribe();
      clearInterval(tick);
      clearTimeout(skeletonTimer);
    });
  }

  /** Ctrl/⌘+K or "/" → command palette · Ctrl/⌘+B → collapse the sidebar. */
  @HostListener('document:keydown', ['$event'])
  protected onKey(e: KeyboardEvent): void {
    const target = e.target as HTMLElement | null;
    const typing = target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
    const mod = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();
    if (mod && key === 'k') {
      e.preventDefault();
      this.paletteOpen.update((v) => !v);
    } else if (mod && key === 'b') {
      e.preventDefault();
      this.toggleRail();
    } else if (e.key === '/' && !typing) {
      e.preventDefault();
      this.paletteOpen.set(true);
    }
  }

  protected toggleRail(): void {
    this.collapsed.update((v) => !v);
  }

  private spotCard: HTMLElement | null = null;
  private spotFrame = 0;

  /** Feeds the cursor position to the card under the pointer (see `.glass-card` spotlight). */
  @HostListener('document:pointermove', ['$event'])
  protected onPointerMove(e: PointerEvent): void {
    if (e.pointerType === 'touch') return;
    cancelAnimationFrame(this.spotFrame);
    this.spotFrame = requestAnimationFrame(() => {
      const card = (e.target as HTMLElement | null)?.closest?.<HTMLElement>('.glass-card') ?? null;
      if (card !== this.spotCard) {
        this.spotCard?.style.setProperty('--spot', '0');
        card?.style.setProperty('--spot', '1');
        this.spotCard = card;
      }
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
    });
  }

  protected logout(): void {
    // TODO: wire to the auth service once available.
    console.info('logout requested');
  }

  private now(): string {
    return CLOCK_FMT.format(new Date());
  }
}
