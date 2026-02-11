import { MonthlyData } from '@/types';

interface SimpleChartProps {
  title: string;
  data: MonthlyData[];
  color?: string;
}

/**
 * A lightweight bar chart rendered with pure CSS / divs.
 * No external charting library needed.
 */
export default function SimpleChart({ title, data, color = 'bg-primary-500' }: SimpleChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="rounded-2xl bg-white p-6 shadow-soft">
      <h3 className="mb-6 text-lg font-bold text-neutral-900">{title}</h3>
      <div className="flex items-end gap-3" style={{ height: 180 }}>
        {data.map((item) => {
          const heightPercent = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          return (
            <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-medium text-neutral-500">
                {item.value.toLocaleString()}
              </span>
              <div
                className={`w-full rounded-t-lg ${color} transition-all duration-500`}
                style={{ height: `${heightPercent}%`, minHeight: 4 }}
              />
              <span className="text-xs font-medium text-neutral-600">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
