"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
}

type Tab = "area" | "volume" | "triangles" | "constants";

interface ShapeEntry {
  name: string;
  formulas: string[];
  diagram: React.ReactNode;
}

const areaData: ShapeEntry[] = [
  {
    name: "Circle",
    formulas: ["A = \u03c0r\u00b2", "C = 2\u03c0r"],
    diagram: (
      <svg viewBox="0 0 80 70" className="w-16 h-14">
        <circle cx="40" cy="33" r="26" fill="none" stroke="#2563eb" strokeWidth="1.5" />
        <line x1="40" y1="33" x2="66" y2="33" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="52" y="30" fontSize="9" fill="#dc2626" fontFamily="serif" fontStyle="italic">r</text>
        <circle cx="40" cy="33" r="1.5" fill="#dc2626" />
      </svg>
    ),
  },
  {
    name: "Rectangle",
    formulas: ["A = lw", "P = 2l + 2w"],
    diagram: (
      <svg viewBox="0 0 80 55" className="w-16 h-11">
        <rect x="10" y="8" width="60" height="35" fill="none" stroke="#2563eb" strokeWidth="1.5" />
        <line x1="10" y1="48" x2="70" y2="48" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="32" y="50" fontSize="9" fill="#dc2626" fontFamily="serif" fontStyle="italic">l</text>
        <line x1="74" y1="8" x2="74" y2="43" stroke="#059669" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="72" y="30" fontSize="9" fill="#059669" fontFamily="serif" fontStyle="italic" transform="rotate(90,73,30)">w</text>
      </svg>
    ),
  },
  {
    name: "Triangle",
    formulas: ["A = \u00bdbh"],
    diagram: (
      <svg viewBox="0 0 80 55" className="w-16 h-11">
        <polygon points="40,6 8,46 72,46" fill="none" stroke="#2563eb" strokeWidth="1.5" />
        <line x1="40" y1="46" x2="40" y2="6" stroke="#059669" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="43" y="30" fontSize="9" fill="#059669" fontFamily="serif" fontStyle="italic">h</text>
        <line x1="8" y1="50" x2="72" y2="50" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="32" y="52" fontSize="9" fill="#dc2626" fontFamily="serif" fontStyle="italic">b</text>
        <polygon points="37,42 40,46 43,42" fill="#059669" />
      </svg>
    ),
  },
];

const volumeData: ShapeEntry[] = [
  {
    name: "Rectangular Prism",
    formulas: ["V = lwh"],
    diagram: (
      <svg viewBox="0 0 80 65" className="w-16 h-13">
        <rect x="18" y="12" width="50" height="32" fill="none" stroke="#2563eb" strokeWidth="1.2" />
        <polygon points="18,12 8,22 8,54 18,44" fill="none" stroke="#2563eb" strokeWidth="0.8" />
        <polygon points="68,12 58,22 58,54 68,44" fill="none" stroke="#2563eb" strokeWidth="0.8" />
        <polygon points="8,22 18,12 68,12 58,22" fill="none" stroke="#2563eb" strokeWidth="0.8" />
        <polygon points="8,54 18,44 68,44 58,54" fill="none" stroke="#2563eb" strokeWidth="0.8" />
        <text x="36" y="62" fontSize="8" fill="#dc2626" fontFamily="serif" fontStyle="italic">l</text>
        <text x="70" y="34" fontSize="8" fill="#059669" fontFamily="serif" fontStyle="italic">w</text>
        <text x="4" y="18" fontSize="8" fill="#7c3aed" fontFamily="serif" fontStyle="italic">h</text>
      </svg>
    ),
  },
  {
    name: "Cylinder",
    formulas: ["V = \u03c0r\u00b2h"],
    diagram: (
      <svg viewBox="0 0 80 65" className="w-16 h-13">
        <ellipse cx="40" cy="14" rx="28" ry="8" fill="none" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="12" y1="14" x2="12" y2="50" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="68" y1="14" x2="68" y2="50" stroke="#2563eb" strokeWidth="1.2" />
        <ellipse cx="40" cy="50" rx="28" ry="8" fill="none" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="40" y1="6" x2="40" y2="14" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="42" y="11" fontSize="8" fill="#dc2626" fontFamily="serif" fontStyle="italic">r</text>
        <circle cx="40" cy="14" r="1.2" fill="#dc2626" />
        <line x1="6" y1="14" x2="6" y2="50" stroke="#059669" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="2" y="35" fontSize="8" fill="#059669" fontFamily="serif" fontStyle="italic" transform="rotate(90,3,35)">h</text>
      </svg>
    ),
  },
  {
    name: "Sphere",
    formulas: ["V = \u2074\u2044\u2083 \u03c0r\u00b3"],
    diagram: (
      <svg viewBox="0 0 80 65" className="w-16 h-13">
        <circle cx="40" cy="33" r="26" fill="none" stroke="#2563eb" strokeWidth="1.2" />
        <ellipse cx="40" cy="33" rx="26" ry="10" fill="none" stroke="#2563eb" strokeWidth="0.8" strokeDasharray="4 3" />
        <line x1="40" y1="33" x2="66" y2="33" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="52" y="30" fontSize="8" fill="#dc2626" fontFamily="serif" fontStyle="italic">r</text>
        <circle cx="40" cy="33" r="1.5" fill="#dc2626" />
      </svg>
    ),
  },
  {
    name: "Cone",
    formulas: ["V = \u2153 \u03c0r\u00b2h"],
    diagram: (
      <svg viewBox="0 0 80 65" className="w-16 h-13">
        <ellipse cx="40" cy="52" rx="30" ry="8" fill="none" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="10" y1="52" x2="40" y2="8" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="70" y1="52" x2="40" y2="8" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="40" y1="8" x2="40" y2="52" stroke="#059669" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="42" y="34" fontSize="8" fill="#059669" fontFamily="serif" fontStyle="italic">h</text>
        <line x1="40" y1="52" x2="70" y2="52" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="54" y="50" fontSize="8" fill="#dc2626" fontFamily="serif" fontStyle="italic">r</text>
        <circle cx="40" cy="52" r="1.2" fill="#dc2626" />
      </svg>
    ),
  },
  {
    name: "Pyramid",
    formulas: ["V = \u2153 Bh"],
    diagram: (
      <svg viewBox="0 0 80 65" className="w-16 h-13">
        <polygon points="40,8 10,50 70,50" fill="none" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="10" y1="50" x2="40" y2="8" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="70" y1="50" x2="40" y2="8" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="10" y1="50" x2="70" y2="50" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="40" y1="8" x2="40" y2="50" stroke="#059669" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="42" y="34" fontSize="8" fill="#059669" fontFamily="serif" fontStyle="italic">h</text>
        <line x1="10" y1="56" x2="70" y2="56" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="36" y="58" fontSize="8" fill="#dc2626" fontFamily="serif" fontStyle="italic">B</text>
      </svg>
    ),
  },
];

const triangleData = [
  {
    name: "30\u00b0-60\u00b0-90\u00b0",
    ratios: "x : x\u221a3 : 2x",
    diagram: (
      <svg viewBox="0 0 80 60" className="w-16 h-12">
        <polygon points="8,48 72,48 8,8" fill="none" stroke="#2563eb" strokeWidth="1.5" />
        <text x="14" y="44" fontSize="8" fill="#dc2626" fontFamily="serif" fontStyle="italic">x</text>
        <text x="40" y="45" fontSize="8" fill="#059669" fontFamily="serif" fontStyle="italic">2x</text>
        <text x="14" y="24" fontSize="8" fill="#7c3aed" fontFamily="serif" fontStyle="italic">x\u221a3</text>
        <text x="6" y="14" fontSize="7" fill="#6b7280">30\u00b0</text>
        <text x="58" y="45" fontSize="7" fill="#6b7280">60\u00b0</text>
        <polygon points="8,42 12,48 4,48" fill="#6b7280" />
      </svg>
    ),
  },
  {
    name: "45\u00b0-45\u00b0-90\u00b0",
    ratios: "s : s : s\u221a2",
    diagram: (
      <svg viewBox="0 0 80 60" className="w-16 h-12">
        <polygon points="8,48 48,48 8,8" fill="none" stroke="#2563eb" strokeWidth="1.5" />
        <text x="14" y="44" fontSize="8" fill="#dc2626" fontFamily="serif" fontStyle="italic">s</text>
        <text x="30" y="44" fontSize="8" fill="#059669" fontFamily="serif" fontStyle="italic">s\u221a2</text>
        <text x="14" y="24" fontSize="8" fill="#7c3aed" fontFamily="serif" fontStyle="italic">s</text>
        <text x="6" y="14" fontSize="7" fill="#6b7280">45\u00b0</text>
        <polygon points="8,42 12,48 4,48" fill="#6b7280" />
      </svg>
    ),
  },
  {
    name: "Pythagorean Theorem",
    formulas: ["a\u00b2 + b\u00b2 = c\u00b2"],
    diagram: (
      <svg viewBox="0 0 60 44" className="w-12 h-9">
        <polygon points="8,38 50,38 8,6" fill="none" stroke="#2563eb" strokeWidth="1.5" />
        <text x="8" y="32" fontSize="8" fill="#dc2626" fontFamily="serif" fontStyle="italic">a</text>
        <text x="32" y="33" fontSize="8" fill="#059669" fontFamily="serif" fontStyle="italic">c</text>
        <text x="14" y="20" fontSize="8" fill="#7c3aed" fontFamily="serif" fontStyle="italic">b</text>
        <polygon points="8,32 12,38 4,38" fill="#6b7280" />
      </svg>
    ),
  },
];

const constantsData = [
  { label: "Sum of interior angles of a triangle", value: "180\u00b0" },
  { label: "Degrees in a circle", value: "360\u00b0" },
  { label: "Value of \u03c0", value: "\u03c0 \u2248 3.14159..." },
  { label: "Radians in a circle", value: "2\u03c0" },
];

const TAB_LABELS: { key: Tab; label: string }[] = [
  { key: "area", label: "Area & Perimeter" },
  { key: "volume", label: "Volume" },
  { key: "triangles", label: "Triangles" },
  { key: "constants", label: "Constants" },
];

export default function ReferenceSheet({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>("area");

  return (
    <div className="w-[420px] border-l border-gray-200 bg-white flex flex-col shrink-0 h-full" style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200">
        <span className="text-[13px] font-bold text-gray-800">Math Reference Sheet</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 cursor-pointer p-0.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex border-b border-gray-200 text-[11px]">
        {TAB_LABELS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 font-medium cursor-pointer transition-colors ${
              tab === t.key
                ? "text-primary border-b-2 border-primary bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {tab === "area" && (
          <div className="grid grid-cols-2 gap-3">
            {areaData.map((s) => (
              <div key={s.name} className="border border-gray-200 rounded-lg p-3 flex flex-col items-center gap-1.5">
                {s.diagram}
                <span className="font-semibold text-gray-800 text-[11px]">{s.name}</span>
                <div className="text-[11px] text-gray-600 text-center leading-relaxed font-mono">
                  {s.formulas.map((f, i) => <div key={i}>{f}</div>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "volume" && (
          <div className="grid grid-cols-2 gap-3">
            {volumeData.map((s) => (
              <div key={s.name} className="border border-gray-200 rounded-lg p-3 flex flex-col items-center gap-1.5">
                {s.diagram}
                <span className="font-semibold text-gray-800 text-[11px]">{s.name}</span>
                <div className="text-[11px] text-gray-600 text-center font-mono">
                  {s.formulas.map((f, i) => <div key={i}>{f}</div>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "triangles" && (
          <div className="space-y-3">
            {triangleData.map((t) => (
              <div key={t.name} className="border border-gray-200 rounded-lg p-3 flex items-center gap-3">
                {t.diagram}
                <div>
                  <span className="font-semibold text-gray-800 text-[11px] block mb-0.5">{t.name}</span>
                  {(t as any).ratios ? (
                    <span className="text-[11px] text-gray-600 font-mono">{(t as any).ratios}</span>
                  ) : (
                    <div className="text-[11px] text-gray-600 font-mono">{(t as any).formulas?.join(", ")}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "constants" && (
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
            {constantsData.map((c, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[12px] text-gray-700">{c.label}</span>
                <span className="text-[12px] font-mono font-bold text-primary">{c.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
