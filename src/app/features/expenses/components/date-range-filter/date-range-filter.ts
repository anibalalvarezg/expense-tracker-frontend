import { Component, input, output, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChipComponent } from '../../../../shared/components/chip/chip';
import { InputDirective } from '../../../../shared/directives/input.directive';

export type DatePreset = 'today' | 'mtd' | '1m' | 'ytd' | '1y' | null;

@Component({
  selector: 'app-date-range-filter',
  standalone: true,
  imports: [FormsModule, ChipComponent, InputDirective],
  templateUrl: './date-range-filter.html'
})
export class DateRangeFilterComponent {
  filterFrom = input.required<string>();
  filterTo = input.required<string>();

  filterFromChange = output<string>();
  filterToChange = output<string>();
  cleared = output<void>();

  readonly presets: { key: DatePreset; label: string }[] = [
    { key: 'today', label: 'Hoy' },
    { key: 'mtd',   label: 'MTD' },
    { key: '1m',    label: '1 mes' },
    { key: 'ytd',   label: 'YTD' },
    { key: '1y',    label: '1 año' },
  ];

  activePreset = computed<DatePreset>(() => {
    const from = this.filterFrom();
    const to = this.filterTo();
    for (const preset of this.presets) {
      const { from: pFrom, to: pTo } = this.presetDates(preset.key!);
      if (from === pFrom && to === pTo) return preset.key;
    }
    return null;
  });

  applyPreset(key: DatePreset) {
    if (!key) return;
    const { from, to } = this.presetDates(key);
    this.filterFromChange.emit(from);
    this.filterToChange.emit(to);
  }

  onFromChange(value: string) {
    this.filterFromChange.emit(value);
  }

  onToChange(value: string) {
    this.filterToChange.emit(value);
  }

  private presetDates(key: DatePreset): { from: string; to: string } {
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    const todayStr = fmt(today);

    switch (key) {
      case 'today':
        return { from: todayStr, to: todayStr };
      case 'mtd': {
        const first = new Date(today.getFullYear(), today.getMonth(), 1);
        return { from: fmt(first), to: todayStr };
      }
      case '1m': {
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return { from: fmt(oneMonthAgo), to: todayStr };
      }
      case 'ytd': {
        const jan1 = new Date(today.getFullYear(), 0, 1);
        return { from: fmt(jan1), to: todayStr };
      }
      case '1y': {
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return { from: fmt(oneYearAgo), to: todayStr };
      }
      default:
        return { from: '', to: '' };
    }
  }
}
