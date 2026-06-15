import { ReactNode } from "react";
import Link from "next/link";

interface PracticeCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
  progress?: number;
}

export default function PracticeCard({ icon, title, description, href, progress }: PracticeCardProps) {
  const content = (
    <div className="group bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all cursor-pointer flex flex-col min-w-0">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 text-sat-teal group-hover:bg-teal-100 transition-colors">
          {icon}
        </div>
        <h3 className="font-semibold text-slate-800 text-sm truncate">{title}</h3>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{description}</p>
      {progress !== undefined && (
        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-400 font-medium">Progress</span>
            <span className="text-sat-teal font-semibold">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-sat-teal rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
