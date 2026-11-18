import { DestroyRef, Directive, ElementRef, inject, input, OnInit } from '@angular/core';

/** Animates a number from 0 to `appCountUp` (ease-out) and writes it into the host element. */
@Directive({ selector: '[appCountUp]' })
export class CountUpDirective implements OnInit {
  readonly appCountUp = input.required<number>();
  readonly decimals = input(0);
  readonly duration = input(1400);
  /** ms to wait before starting (lets the reveal animation play first). */
  readonly delay = input(0);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const target = this.appCountUp();
    const decimals = this.decimals();
    const duration = this.duration();
    const format = (v: number) =>
      v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

    this.el.textContent = format(0);

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.el.textContent = format(target);
      return;
    }

    let raf = 0;
    const timer = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        this.el.textContent = format(target * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, this.delay());

    this.destroyRef.onDestroy(() => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    });
  }
}
