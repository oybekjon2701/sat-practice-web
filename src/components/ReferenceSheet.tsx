"use client";

interface Props {
  onClose: () => void;
}

const areaData = [
  {
    name: "Circle",
    formulas: ["A = \u03c0r\u00b2", "C = 2\u03c0r"],
    diagram: (
      <svg viewBox="0 0 100 85" className="w-20 h-17">
        <circle cx="50" cy="42" r="32" fill="none" stroke="#2563eb" strokeWidth="1.5" />
        <line x1="50" y1="42" x2="82" y2="42" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="64" y="38" fontSize="11" fill="#dc2626" fontFamily="serif" fontStyle="italic">r</text>
        <circle cx="50" cy="42" r="2" fill="#dc2626" />
      </svg>
    ),
  },
  {
    name: "Rectangle",
    formulas: ["A = lw", "P = 2l + 2w"],
    diagram: (
      <svg viewBox="0 0 100 65" className="w-20 h-13">
        <rect x="12" y="10" width="76" height="40" fill="none" stroke="#2563eb" strokeWidth="1.5" />
        <line x1="12" y1="56" x2="88" y2="56" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="42" y="58" fontSize="11" fill="#dc2626" fontFamily="serif" fontStyle="italic">l</text>
        <line x1="92" y1="10" x2="92" y2="50" stroke="#059669" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="88" y="34" fontSize="11" fill="#059669" fontFamily="serif" fontStyle="italic" transform="rotate(90,90,34)">w</text>
      </svg>
    ),
  },
  {
    name: "Triangle",
    formulas: ["A = \u00bd bh"],
    diagram: (
      <svg viewBox="0 0 100 65" className="w-20 h-13">
        <polygon points="50,8 10,52 90,52" fill="none" stroke="#2563eb" strokeWidth="1.5" />
        <line x1="50" y1="52" x2="50" y2="8" stroke="#059669" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="36" y="30" fontSize="11" fill="#059669" fontFamily="serif" fontStyle="italic">h</text>
        <line x1="10" y1="58" x2="90" y2="58" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="42" y="28" fontSize="11" fill="#dc2626" fontFamily="serif" fontStyle="italic">b</text>
        <polygon points="46,48 50,52 54,48" fill="#059669" />
      </svg>
    ),
  },
];

const volumeData = [
  {
    name: "Rectangular Prism",
    formulas: ["V = lwh"],
    diagram: (
      <svg viewBox="0 0 100 75" className="w-20 h-15">
        <rect x="22" y="14" width="58" height="38" fill="none" stroke="#2563eb" strokeWidth="1.2" />
        <polygon points="22,14 10,24 10,62 22,52" fill="none" stroke="#2563eb" strokeWidth="1" />
        <polygon points="80,14 68,24 68,62 80,52" fill="none" stroke="#2563eb" strokeWidth="1" />
        <polygon points="10,24 22,14 80,14 68,24" fill="none" stroke="#2563eb" strokeWidth="1" />
        <polygon points="10,62 22,52 80,52 68,62" fill="none" stroke="#2563eb" strokeWidth="1" />
        <text x="44" y="72" fontSize="10" fill="#dc2626" fontFamily="serif" fontStyle="italic">l</text>
        <text x="82" y="40" fontSize="10" fill="#059669" fontFamily="serif" fontStyle="italic">w</text>
        <text x="4" y="22" fontSize="10" fill="#7c3aed" fontFamily="serif" fontStyle="italic">h</text>
      </svg>
    ),
  },
  {
    name: "Cylinder",
    formulas: ["V = \u03c0r\u00b2h"],
    diagram: (
      <svg viewBox="0 0 100 75" className="w-20 h-15">
        <ellipse cx="50" cy="16" rx="34" ry="10" fill="none" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="16" y1="16" x2="16" y2="56" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="84" y1="16" x2="84" y2="56" stroke="#2563eb" strokeWidth="1.2" />
        <ellipse cx="50" cy="56" rx="34" ry="10" fill="none" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="50" y1="6" x2="50" y2="16" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="52" y="12" fontSize="10" fill="#dc2626" fontFamily="serif" fontStyle="italic">r</text>
        <circle cx="50" cy="16" r="1.5" fill="#dc2626" />
        <line x1="8" y1="16" x2="8" y2="56" stroke="#059669" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="3" y="40" fontSize="10" fill="#059669" fontFamily="serif" fontStyle="italic" transform="rotate(90,4,40)">h</text>
      </svg>
    ),
  },
  {
    name: "Sphere",
    formulas: ["V = \u2074\u2044\u2083 \u03c0r\u00b3"],
    diagram: (
      <svg viewBox="0 0 100 75" className="w-20 h-15">
        <circle cx="50" cy="38" r="30" fill="none" stroke="#2563eb" strokeWidth="1.2" />
        <ellipse cx="50" cy="38" rx="30" ry="12" fill="none" stroke="#2563eb" strokeWidth="0.8" strokeDasharray="4 3" />
        <line x1="50" y1="38" x2="80" y2="38" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="64" y="35" fontSize="10" fill="#dc2626" fontFamily="serif" fontStyle="italic">r</text>
        <circle cx="50" cy="38" r="2" fill="#dc2626" />
      </svg>
    ),
  },
  {
    name: "Cone",
    formulas: ["V = \u2153 \u03c0r\u00b2h"],
    diagram: (
      <svg viewBox="0 0 100 75" className="w-20 h-15">
        <ellipse cx="50" cy="60" rx="34" ry="10" fill="none" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="16" y1="60" x2="50" y2="8" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="84" y1="60" x2="50" y2="8" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="50" y1="8" x2="50" y2="60" stroke="#059669" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="52" y="38" fontSize="10" fill="#059669" fontFamily="serif" fontStyle="italic">h</text>
        <line x1="50" y1="60" x2="84" y2="60" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="66" y="58" fontSize="10" fill="#dc2626" fontFamily="serif" fontStyle="italic">r</text>
        <circle cx="50" cy="60" r="1.5" fill="#dc2626" />
      </svg>
    ),
  },
  {
    name: "Pyramid",
    formulas: ["V = \u2153 Bh"],
    diagram: (
      <svg viewBox="0 0 100 75" className="w-20 h-15">
        <polygon points="50,8 12,56 88,56" fill="none" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="12" y1="56" x2="50" y2="8" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="88" y1="56" x2="50" y2="8" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="12" y1="56" x2="88" y2="56" stroke="#2563eb" strokeWidth="1.2" />
        <line x1="50" y1="8" x2="50" y2="56" stroke="#059669" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="52" y="36" fontSize="10" fill="#059669" fontFamily="serif" fontStyle="italic">h</text>
        <line x1="12" y1="62" x2="88" y2="62" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="44" y="64" fontSize="10" fill="#dc2626" fontFamily="serif" fontStyle="italic">B</text>
      </svg>
    ),
  },
];

const triangleData = [
  {
    name: "30\u00b0-60\u00b0-90\u00b0",
    ratios: "x : x\u221a3 : 2x",
    diagram: (
      <svg viewBox="0 0 140 100" className="w-28 h-20">
        <polygon points="10,85 130,85 10,10" fill="none" stroke="#2563eb" strokeWidth="1.5" />
        <text x="20" y="50" fontSize="13" fill="#dc2626" fontFamily="serif" fontStyle="italic" transform="rotate(-90,20,50)">x</text>
        <text x="65" y="78" fontSize="13" fill="#059669" fontFamily="serif" fontStyle="italic">
          <tspan fontStyle="italic">x</tspan>
          <tspan fontFamily="Arial,sans-serif" fontStyle="normal">{'\u221a'}</tspan>
          <tspan fontStyle="italic">3</tspan>
        </text>
        <text x="58" y="44" fontSize="13" fill="#7c3aed" fontFamily="serif" fontStyle="italic" transform="rotate(-52,58,44)">2x</text>
        <text x="8" y="20" fontSize="11" fill="#6b7280">{'30\u00b0'}</text>
        <text x="108" y="82" fontSize="11" fill="#6b7280">{'60\u00b0'}</text>
        <polygon points="10,77 16,85 4,85" fill="#6b7280" />
      </svg>
    ),
  },
  {
    name: "45\u00b0-45\u00b0-90\u00b0",
    ratios: "s : s : s\u221a2",
    diagram: (
      <svg viewBox="0 0 140 100" className="w-28 h-20">
        <polygon points="10,85 85,85 10,10" fill="none" stroke="#2563eb" strokeWidth="1.5" />
        <text x="22" y="50" fontSize="13" fill="#dc2626" fontFamily="serif" fontStyle="italic" transform="rotate(-90,22,50)">s</text>
        <text x="48" y="78" fontSize="13" fill="#059669" fontFamily="serif" fontStyle="italic">s</text>
        <text x="44" y="44" fontSize="13" fill="#7c3aed" fontFamily="serif" fontStyle="italic" transform="rotate(-45,44,44)">
          <tspan fontStyle="italic">s</tspan>
          <tspan fontFamily="Arial,sans-serif" fontStyle="normal">{'\u221a'}</tspan>
          <tspan fontStyle="italic">2</tspan>
        </text>
        <text x="8" y="22" fontSize="11" fill="#6b7280">{'45\u00b0'}</text>
        <text x="70" y="82" fontSize="11" fill="#6b7280">{'45\u00b0'}</text>
        <polygon points="10,77 16,85 4,85" fill="#6b7280" />
      </svg>
    ),
  },
  {
    name: "Pythagorean Theorem",
    formulas: ["a\u00b2 + b\u00b2 = c\u00b2"],
    diagram: (
      <svg viewBox="0 0 100 65" className="w-20 h-13">
        <polygon points="12,52 85,52 12,6" fill="none" stroke="#2563eb" strokeWidth="1.5" />
        <text x="18" y="46" fontSize="12" fill="#dc2626" fontFamily="serif" fontStyle="italic" transform="rotate(-90,18,46)">a</text>
        <text x="55" y="40" fontSize="12" fill="#059669" fontFamily="serif" fontStyle="italic" transform="rotate(-39,55,40)">c</text>
        <text x="48" y="58" fontSize="12" fill="#7c3aed" fontFamily="serif" fontStyle="italic">b</text>
        <polygon points="12,44 18,52 6,52" fill="#6b7280" />
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

export default function ReferenceSheet({ onClose }: Props) {
  return (
    <div className="w-[520px] border-l border-gray-200 bg-white flex flex-col shrink-0 h-full" style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
        <span className="text-[15px] font-bold text-gray-800">Math Reference Sheet</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 cursor-pointer p-0.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

        <section>
          <h2 className="text-[14px] font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Area & Perimeter
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {areaData.map((s) => (
              <div key={s.name} className="border border-gray-200 rounded-lg p-3 flex flex-col items-center gap-2">
                {s.diagram}
                <span className="font-semibold text-gray-800 text-[13px]">{s.name}</span>
                <div className="text-[13px] text-gray-600 text-center leading-relaxed font-mono">
                  {s.formulas.map((f, i) => <div key={i}>{f}</div>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[14px] font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Volume
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {volumeData.map((s) => (
              <div key={s.name} className="border border-gray-200 rounded-lg p-3 flex flex-col items-center gap-2">
                {s.diagram}
                <span className="font-semibold text-gray-800 text-[13px]">{s.name}</span>
                <div className="text-[13px] text-gray-600 text-center font-mono">
                  {s.formulas.map((f, i) => <div key={i}>{f}</div>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[14px] font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Special Right Triangles & Pythagorean Theorem
          </h2>
          <div className="space-y-3">
            {triangleData.map((t) => (
              <div key={t.name} className="border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                {t.diagram}
                <div>
                  <span className="font-semibold text-gray-800 text-[13px] block mb-1">{t.name}</span>
                  {(t as any).ratios ? (
                    <span className="text-[13px] text-gray-600 font-mono">{(t as any).ratios}</span>
                  ) : (
                    <div className="text-[13px] text-gray-600 font-mono">{(t as any).formulas?.join(", ")}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[14px] font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Constants
          </h2>
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
            {constantsData.map((c, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <span className="text-[13px] text-gray-700">{c.label}</span>
                <span className="text-[13px] font-mono font-bold text-[#0033aa]">{c.value}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
