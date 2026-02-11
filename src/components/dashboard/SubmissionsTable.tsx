'use client';

import { formatDate } from '@/utils/helpers';
import { REQUEST_TYPE_LABELS } from '@/utils/constants';
import Badge from '@/components/ui/Badge';

interface Submission {
  id: string;
  name: string;
  phone: string;
  email: string;
  requestType: string;
  createdAt: string;
}

interface SubmissionsTableProps {
  submissions: Submission[];
}

export default function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  if (submissions.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-soft">
        <p className="text-neutral-500">No submissions found. Data will appear here once users submit the contact form.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="whitespace-nowrap px-6 py-4 font-semibold text-neutral-700">Name</th>
              <th className="whitespace-nowrap px-6 py-4 font-semibold text-neutral-700">Phone</th>
              <th className="whitespace-nowrap px-6 py-4 font-semibold text-neutral-700">Email</th>
              <th className="whitespace-nowrap px-6 py-4 font-semibold text-neutral-700">Type</th>
              <th className="whitespace-nowrap px-6 py-4 font-semibold text-neutral-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr
                key={sub.id}
                className="border-b border-neutral-100 transition-colors hover:bg-neutral-50"
              >
                <td className="whitespace-nowrap px-6 py-4 font-medium text-neutral-900">
                  {sub.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-neutral-600">{sub.phone}</td>
                <td className="whitespace-nowrap px-6 py-4 text-neutral-600">{sub.email}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Badge variant={sub.requestType === 'career' ? 'warning' : 'info'}>
                    {REQUEST_TYPE_LABELS[sub.requestType] || sub.requestType}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-neutral-500">
                  {formatDate(sub.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
