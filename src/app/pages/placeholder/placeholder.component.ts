import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="glass-card grid min-h-[60vh] place-items-center p-10 text-center">
      <div>
        <h2 class="text-2xl font-bold">{{ heading }}</h2>
        <p class="mt-2 text-gray-400">هذه الصفحة قيد التطوير وستتوفر قريباً.</p>
      </div>
    </section>
  `,
})
export class PlaceholderComponent {
  protected readonly heading: string = inject(ActivatedRoute).snapshot.data['heading'] ?? '';
}
