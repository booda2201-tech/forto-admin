import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  LucidePhone,
  LucideArrowRight,
  LucideCalendarDays,
  LucideClock,
  LucideMessageCircle,
  LucideStar,
  LucideStickyNote,
  LucideWrench,
  LucideCrown,
  LucideReceipt,
  LucideChevronLeft,
  LucideCircleCheck,
  LucideHourglass,
  LucideBan,
  LucideCalendarClock,
  LucideArrowUpRight,
  LucideBell,
  LucideCalendarCheck,
  LucideCar,
  LucideClipboardList,
  LucideLayoutDashboard,
  LucideLogOut,
  LucideMenu,
  LucideSearch,
  LucideShoppingBag,
  LucideSparkles,
  LucideTrendingDown,
  LucideTrendingUp,
  LucideUserPlus,
  LucideUsers,
  LucideWallet,
  LucideX,
  LucideDroplets,
  LucideShieldCheck,
  LucideSprayCan,
  LucideUser,
  LucideBrush,
  LucideBanknote,
  LucideCreditCard,
  LucideArrowLeftRight,
  LucideSun,
  LucideMoon,
  LucidePlus,
  LucideEye,
  LucidePencil,
  LucideImagePlus,
  LucideTrash2,
} from '@lucide/angular';

export type IconName =
  | 'dashboard'
  | 'services'
  | 'customers'
  | 'visits'
  | 'bookings'
  | 'products'
  | 'bell'
  | 'logout'
  | 'menu'
  | 'close'
  | 'search'
  | 'wallet'
  | 'car'
  | 'user-plus'
  | 'trend-up'
  | 'trend-down'
  | 'arrow-up-right'
  | 'phone'
  | 'back'
  | 'calendar'
  | 'clock'
  | 'chat'
  | 'star'
  | 'note'
  | 'wrench'
  | 'crown'
  | 'receipt'
  | 'chevron'
  | 'check'
  | 'hourglass'
  | 'ban'
  | 'calendar-clock'
  | 'droplets'
  | 'shield'
  | 'spray'
  | 'user'
  | 'brush'
  | 'cash'
  | 'card'
  | 'transfer'
  | 'sun'
  | 'moon'
  | 'plus'
  | 'eye'
  | 'edit'
  | 'image'
  | 'trash';

/** Thin switch-based wrapper so icons can be chosen by name from data. */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LucidePhone,
    LucideArrowRight,
    LucideCalendarDays,
    LucideClock,
    LucideMessageCircle,
    LucideStar,
    LucideStickyNote,
    LucideWrench,
    LucideCrown,
    LucideReceipt,
    LucideChevronLeft,
    LucideCircleCheck,
    LucideHourglass,
    LucideBan,
    LucideCalendarClock,
    LucideArrowUpRight,
    LucideBell,
    LucideCalendarCheck,
    LucideCar,
    LucideClipboardList,
    LucideLayoutDashboard,
    LucideLogOut,
    LucideMenu,
    LucideSearch,
    LucideShoppingBag,
    LucideSparkles,
    LucideTrendingDown,
    LucideTrendingUp,
    LucideUserPlus,
    LucideUsers,
    LucideWallet,
    LucideX,
    LucideDroplets,
    LucideShieldCheck,
    LucideSprayCan,
    LucideUser,
    LucideBrush,
    LucideBanknote,
    LucideCreditCard,
    LucideArrowLeftRight,
    LucideSun,
    LucideMoon,
    LucidePlus,
    LucideEye,
    LucidePencil,
    LucideImagePlus,
    LucideTrash2,
  ],
  host: { class: 'inline-flex shrink-0' },
  template: `
    @switch (name()) {
      @case ('dashboard') { <svg lucideLayoutDashboard [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('services') { <svg lucideSparkles [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('customers') { <svg lucideUsers [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('visits') { <svg lucideClipboardList [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('bookings') { <svg lucideCalendarCheck [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('products') { <svg lucideShoppingBag [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('bell') { <svg lucideBell [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('logout') { <svg lucideLogOut [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('menu') { <svg lucideMenu [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('close') { <svg lucideX [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('search') { <svg lucideSearch [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('wallet') { <svg lucideWallet [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('car') { <svg lucideCar [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('user-plus') { <svg lucideUserPlus [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('trend-up') { <svg lucideTrendingUp [size]="size()" [strokeWidth]="2"></svg> }
      @case ('trend-down') { <svg lucideTrendingDown [size]="size()" [strokeWidth]="2"></svg> }
      @case ('arrow-up-right') { <svg lucideArrowUpRight [size]="size()" [strokeWidth]="2"></svg> }
      @case ('phone') { <svg lucidePhone [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('back') { <svg lucideArrowRight [size]="size()" [strokeWidth]="2"></svg> }
      @case ('calendar') { <svg lucideCalendarDays [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('clock') { <svg lucideClock [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('chat') { <svg lucideMessageCircle [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('star') { <svg lucideStar [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('note') { <svg lucideStickyNote [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('wrench') { <svg lucideWrench [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('crown') { <svg lucideCrown [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('receipt') { <svg lucideReceipt [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('chevron') { <svg lucideChevronLeft [size]="size()" [strokeWidth]="2"></svg> }
      @case ('check') { <svg lucideCircleCheck [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('hourglass') { <svg lucideHourglass [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('ban') { <svg lucideBan [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('calendar-clock') { <svg lucideCalendarClock [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('droplets') { <svg lucideDroplets [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('shield') { <svg lucideShieldCheck [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('spray') { <svg lucideSprayCan [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('user') { <svg lucideUser [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('brush') { <svg lucideBrush [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('cash') { <svg lucideBanknote [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('card') { <svg lucideCreditCard [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('transfer') { <svg lucideArrowLeftRight [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('plus') { <svg lucidePlus [size]="size()" [strokeWidth]="2"></svg> }
      @case ('eye') { <svg lucideEye [size]="size()" [strokeWidth]="1.9"></svg> }
      @case ('edit') { <svg lucidePencil [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('image') { <svg lucideImagePlus [size]="size()" [strokeWidth]="1.6"></svg> }
      @case ('trash') { <svg lucideTrash2 [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('sun') { <svg lucideSun [size]="size()" [strokeWidth]="1.8"></svg> }
      @case ('moon') { <svg lucideMoon [size]="size()" [strokeWidth]="1.8"></svg> }
    }
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input<number>(20);
}

