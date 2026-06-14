import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PracticeCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
  progress?: number;
}

export default function PracticeCard({ icon, title, description, href, progress }: PracticeCardProps) {
  const content = (
    <div className="group bg-white rounded-xl shadow-md border border-slate-200 p-8 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
      <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-5 text-[#0d9488] group-hover:bg-teal-100 transition-colors">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-800 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-auto">{description}</p>
      {progress !== undefined && (
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Progress</span>
            <span className="text-[#0d9488] font-semibold">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0d9488] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      <div className="flex items-center gap-1.5 mt-4 text-sm font-medium text-[#0d9488] opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Get started</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
