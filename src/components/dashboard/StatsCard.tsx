import { cn } from '@/utils/helpers';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  className?: string;
}

export default function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white p-6 shadow-soft transition-shadow hover:shadow-card',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-neutral-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <p className="mt-1 text-sm font-medium text-green-600">{trend}</p>
          )}
        </div>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
          {icon}
        </div>
      </div>
    </div>
  );
}
