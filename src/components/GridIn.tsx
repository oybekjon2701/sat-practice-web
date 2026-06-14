"use client";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function GridIn({ value, onChange }: Props) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9./\-]/g, "");
            onChange(v);
          }}
          placeholder="Enter answer"
          className="w-32 text-center text-base border border-black px-3 py-2 text-black"
          style={{ fontFamily: "Arial, sans-serif" }}
        />
        <span className="text-xs text-black" style={{ fontFamily: "Arial, sans-serif" }}>
          fraction (3/5), decimal (0.75), or integer
        </span>
      </div>
    </div>
  );
}