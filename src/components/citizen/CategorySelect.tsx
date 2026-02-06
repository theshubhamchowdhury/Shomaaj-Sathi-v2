import { ComplaintCategory, COMPLAINT_CATEGORIES } from '@/types';
import { cn } from '@/lib/utils';

interface CategorySelectProps {
  value: ComplaintCategory | null;
  onChange: (category: ComplaintCategory) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {COMPLAINT_CATEGORIES.map((category) => (
        <button
          key={category.value}
          type="button"
          onClick={() => onChange(category.value)}
          className={cn(
            'flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left touch-target',
            value === category.value
              ? 'border-primary bg-secondary'
              : 'border-border bg-card hover:border-primary/50'
          )}
        >
          <span className="text-2xl">{category.icon}</span>
          <span className="font-medium text-sm">{category.label}</span>
        </button>
      ))}
    </div>
  );
}
