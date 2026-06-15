import { ReactNode } from "react";
import Link from "next/link";

interface DashboardCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
}

export default function DashboardCard({ icon, title, description, href }: DashboardCardProps) {
  const content = (
    <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer h-full">
      <div className="w-10 h-10 rounded-xl bg-sat-orange/10 flex items-center justify-center mb-4 text-sat-orange group-hover:bg-sat-orange/15 transition-colors">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
