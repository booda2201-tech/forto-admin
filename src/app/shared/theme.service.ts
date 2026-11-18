import { Injectable, effect, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

const KEY = 'forto.theme';
const DURATION = 750;

/** Dark / light mode. The initial value is applied by an inline script in index.html (no flash). */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(localStorage.getItem(KEY) === 'light' ? 'light' : 'dark');

  private running = false;

  constructor() {
    effect(() => this.apply(this.theme()));
  }

  /**
   * Switches theme. Where supported, the new theme is revealed as a circle expanding from the
   * clicked element (View Transitions API); otherwise it swaps instantly.
   */
  toggle(event?: Event): void {
    if (this.running) return;
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduced) {
      this.theme.set(next);
      return;
    }

    // origin of the reveal = centre of the clicked control (falls back to the top-start corner)
    const el = (event?.currentTarget ?? event?.target) as HTMLElement | null;
    const r = el?.getBoundingClientRect();
    const x = r ? r.left + r.width / 2 : innerWidth;
    const y = r ? r.top + r.height / 2 : 0;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    this.running = true;
    root.classList.add('theme-vt');

    const vt = document.startViewTransition(async () => {
      this.theme.set(next);
      this.apply(next); // flip the CSS variables right away so the "new" snapshot is the new theme
      // let Angular render the toggle icon / labels before the new snapshot is taken
      // (the timeout keeps this from stalling if frames are throttled, e.g. an unfocused window)
      await new Promise<void>((res) => {
        const t = setTimeout(res, 120);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            clearTimeout(t);
            res();
          }),
        );
      });
    });

    vt.ready
      .then(() =>
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: DURATION, easing: 'cubic-bezier(0.65, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
        ),
      )
      .catch(() => undefined);

    const done = () => {
      root.classList.remove('theme-vt');
      this.running = false;
    };
    vt.finished.then(done, done);
    setTimeout(done, DURATION + 1500); // safety net
  }

  private apply(t: Theme): void {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(KEY, t);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'light' ? '#eef0f6' : '#0a0a0a');
  }
}
