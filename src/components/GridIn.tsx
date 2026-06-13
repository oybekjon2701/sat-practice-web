"use client";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function GridIn({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9./\-]/g, "");
            onChange(v);
          }}
          placeholder="Enter answer"
          className="w-32 text-center text-lg font-mono border-2 border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20"
        />
        <span className="text-xs text-gray-400">
          fraction (3/5), decimal (0.75), or integer
        </span>
      </div>
    </div>
  );
}