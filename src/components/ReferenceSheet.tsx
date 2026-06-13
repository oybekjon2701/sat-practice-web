"use client";

interface Props {
  onClose: () => void;
}

const refData = {
  "2D_shapes": [
    {
      name: "Circle",
      formulas: ["A = πr²", "C = 2πr"],
      diagram: (
        <svg viewBox="0 0 100 90" className="w-20 h-18">
          <circle cx="50" cy="40" r="32" fill="none" stroke="#2563eb" strokeWidth="2" />
          <line x1="50" y1="40" x2="82" y2="40" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="66" y="36" fontSize="11" fill="#dc2626" fontFamily="serif" fontStyle="italic">r</text>
          <circle cx="50" cy="40" r="2" fill="#dc2626" />
        </svg>
      ),
    },
    {
      name: "Rectangle",
      formulas: ["A = lw"],
      diagram: (
        <svg viewBox="0 0 100 70" className="w-20 h-14">
          <rect x="12" y="10" width="76" height="45" fill="none" stroke="#2563eb" strokeWidth="2" />
          <line x1="12" y1="62" x2="88" y2="62" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="42" y="64" fontSize="11" fill="#dc2626" fontFamily="serif" fontStyle="italic">l</text>
          <line x1="94" y1="10" x2="94" y2="55" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="92" y="36" fontSize="11" fill="#059669" fontFamily="serif" fontStyle="italic" transform="rotate(90,93,36)">w</text>
        </svg>
      ),
    },
    {
      name: "Triangle",
      formulas: ["A = ½ bh"],
      diagram: (
        <svg viewBox="0 0 100 70" className="w-20 h-14">
          <polygon points="50,8 10,58 90,58" fill="none" stroke="#2563eb" strokeWidth="2" />
          <line x1="50" y1="58" x2="50" y2="8" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="54" y="36" fontSize="11" fill="#059669" fontFamily="serif" fontStyle="italic">h</text>
          <line x1="10" y1="64" x2="90" y2="64" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="42" y="66" fontSize="11" fill="#dc2626" fontFamily="serif" fontStyle="italic">b</text>
          <polygon points="46,54 50,58 54,54" fill="#059669" />
        </svg>
      ),
    },
  ],
  special_triangles: [
    {
      type: "30°-60°-90°",
      ratio: "x : x√3 : 2x",
      diagram: (
        <svg viewBox="0 0 100 70" className="w-20 h-14">
          <polygon points="10,58 90,58 10,10" fill="none" stroke="#2563eb" strokeWidth="2" />
          <text x="16" y="52" fontSize="10" fill="#dc2626" fontFamily="serif" fontStyle="italic">x</text>
          <text x="50" y="54" fontSize="10" fill="#059669" fontFamily="serif" fontStyle="italic">2x</text>
          <text x="18" y="28" fontSize="10" fill="#7c3aed" fontFamily="serif" fontStyle="italic">x√3</text>
          <text x="8" y="16" fontSize="8" fill="#6b7280">30°</text>
          <text x="72" y="54" fontSize="8" fill="#6b7280">60°</text>
          <polygon points="10,52 14,58 6,58" fill="#6b7280" />
        </svg>
      ),
    },
    {
      type: "45°-45°-90°",
      ratio: "s : s : s√2",
      diagram: (
        <svg viewBox="0 0 100 70" className="w-20 h-14">
          <polygon points="10,58 58,58 10,10" fill="none" stroke="#2563eb" strokeWidth="2" />
          <text x="16" y="52" fontSize="10" fill="#dc2626" fontFamily="serif" fontStyle="italic">s</text>
          <text x="38" y="52" fontSize="10" fill="#059669" fontFamily="serif" fontStyle="italic">s√2</text>
          <text x="16" y="28" fontSize="10" fill="#7c3aed" fontFamily="serif" fontStyle="italic">s</text>
          <text x="8" y="16" fontSize="8" fill="#6b7280">45°</text>
          <polygon points="10,52 14,58 6,58" fill="#6b7280" />
        </svg>
      ),
    },
  ],
  "3D_shapes": [
    {
      name: "Rectangular Prism",
      formula: "V = lwh",
      diagram: (
        <svg viewBox="0 0 100 80" className="w-20 h-16">
          <rect x="22" y="14" width="62" height="40" fill="none" stroke="#2563eb" strokeWidth="1.5" />
          <polygon points="22,14 10,26 10,66 22,54" fill="none" stroke="#2563eb" strokeWidth="1" />
          <polygon points="84,14 72,26 72,66 84,54" fill="none" stroke="#2563eb" strokeWidth="1" />
          <polygon points="10,26 22,14 84,14 72,26" fill="none" stroke="#2563eb" strokeWidth="1" />
          <polygon points="10,66 22,54 84,54 72,66" fill="none" stroke="#2563eb" strokeWidth="1" />
          <text x="46" y="78" fontSize="10" fill="#dc2626" fontFamily="serif" fontStyle="italic">l</text>
          <text x="86" y="42" fontSize="10" fill="#059669" fontFamily="serif" fontStyle="italic">w</text>
          <text x="6" y="20" fontSize="10" fill="#7c3aed" fontFamily="serif" fontStyle="italic">h</text>
        </svg>
      ),
    },
    {
      name: "Cylinder",
      formula: "V = πr²h",
      diagram: (
        <svg viewBox="0 0 100 80" className="w-20 h-16">
          <ellipse cx="50" cy="16" rx="36" ry="10" fill="none" stroke="#2563eb" strokeWidth="1.5" />
          <line x1="14" y1="16" x2="14" y2="62" stroke="#2563eb" strokeWidth="1.5" />
          <line x1="86" y1="16" x2="86" y2="62" stroke="#2563eb" strokeWidth="1.5" />
          <ellipse cx="50" cy="62" rx="36" ry="10" fill="none" stroke="#2563eb" strokeWidth="1.5" />
          <line x1="50" y1="6" x2="50" y2="16" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="52" y="12" fontSize="10" fill="#dc2626" fontFamily="serif" fontStyle="italic">r</text>
          <circle cx="50" cy="16" r="1.5" fill="#dc2626" />
          <line x1="8" y1="16" x2="8" y2="62" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="2" y="42" fontSize="10" fill="#059669" fontFamily="serif" fontStyle="italic" transform="rotate(90,4,42)">h</text>
        </svg>
      ),
    },
    {
      name: "Sphere",
      formula: "V = ⁴⁄₃ πr³",
      diagram: (
        <svg viewBox="0 0 100 80" className="w-20 h-16">
          <circle cx="50" cy="40" r="34" fill="none" stroke="#2563eb" strokeWidth="1.5" />
          <ellipse cx="50" cy="40" rx="34" ry="12" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="4 3" />
          <ellipse cx="50" cy="40" rx="12" ry="34" fill="none" stroke="#2563eb" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="50" y1="40" x2="84" y2="40" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="66" y="36" fontSize="10" fill="#dc2626" fontFamily="serif" fontStyle="italic">r</text>
          <circle cx="50" cy="40" r="2" fill="#dc2626" />
        </svg>
      ),
    },
    {
      name: "Cone",
      formula: "V = ⅓ πr²h",
      diagram: (
        <svg viewBox="0 0 100 80" className="w-20 h-16">
          <ellipse cx="50" cy="66" rx="38" ry="10" fill="none" stroke="#2563eb" strokeWidth="1.5" />
          <line x1="12" y1="66" x2="50" y2="8" stroke="#2563eb" strokeWidth="1.5" />
          <line x1="88" y1="66" x2="50" y2="8" stroke="#2563eb" strokeWidth="1.5" />
          <line x1="50" y1="8" x2="50" y2="66" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="52" y="42" fontSize="10" fill="#059669" fontFamily="serif" fontStyle="italic">h</text>
          <line x1="50" y1="66" x2="88" y2="66" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="64" y="64" fontSize="10" fill="#dc2626" fontFamily="serif" fontStyle="italic">r</text>
          <circle cx="50" cy="66" r="2" fill="#dc2626" />
        </svg>
      ),
    },
    {
      name: "Pyramid",
      formula: "V = ⅓ Bh",
      diagram: (
        <svg viewBox="0 0 100 80" className="w-20 h-16">
          <polygon points="50,8 12,64 88,64" fill="none" stroke="#2563eb" strokeWidth="1.5" />
          <line x1="12" y1="64" x2="50" y2="8" stroke="#2563eb" strokeWidth="1.5" />
          <line x1="88" y1="64" x2="50" y2="8" stroke="#2563eb" strokeWidth="1.5" />
          <line x1="12" y1="64" x2="88" y2="64" stroke="#2563eb" strokeWidth="1.5" />
          <line x1="50" y1="8" x2="50" y2="64" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="52" y="42" fontSize="10" fill="#059669" fontFamily="serif" fontStyle="italic">h</text>
          <line x1="12" y1="70" x2="88" y2="70" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="44" y="72" fontSize="10" fill="#dc2626" fontFamily="serif" fontStyle="italic">B</text>
        </svg>
      ),
    },
  ],
  constants: [
    "Degrees in a circle: 360°",
    "Radians in a circle: 2π",
    "Sum of triangle angles: 180°",
  ],
};

export default function ReferenceSheet({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-3 border-b border-sat-border sticky top-0 bg-white">
          <span className="text-sm font-semibold text-sat-gray">Math Reference Sheet</span>
          <button onClick={onClose} className="text-sat-gray hover:text-gray-800 cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-6 text-sm">
          <section>
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              2D Shapes
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {refData["2D_shapes"].map((s) => (
                <div key={s.name} className="border border-gray-200 rounded-lg p-3 flex flex-col items-center gap-2">
                  {s.diagram}
                  <span className="font-medium text-gray-800 text-xs">{s.name}</span>
                  <div className="font-mono text-[10px] text-gray-600 text-center leading-relaxed">
                    {s.formulas.map((f, i) => <div key={i}>{f}</div>)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Special Right Triangles
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {refData.special_triangles.map((t) => (
                <div key={t.type} className="border border-gray-200 rounded-lg p-3 flex flex-col items-center gap-2">
                  {t.diagram}
                  <span className="font-medium text-gray-800 text-xs">{t.type}</span>
                  <span className="font-mono text-[10px] text-gray-600">{t.ratio}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 border border-gray-200 rounded-lg p-3 flex items-center gap-3">
              <svg viewBox="0 0 60 44" className="w-12 h-9 shrink-0">
                <polygon points="8,38 50,38 8,6" fill="none" stroke="#2563eb" strokeWidth="1.5" />
                <text x="8" y="32" fontSize="9" fill="#dc2626" fontFamily="serif" fontStyle="italic">a</text>
                <text x="32" y="34" fontSize="9" fill="#059669" fontFamily="serif" fontStyle="italic">c</text>
                <text x="14" y="20" fontSize="9" fill="#7c3aed" fontFamily="serif" fontStyle="italic">b</text>
                <polygon points="8,32 12,38 4,38" fill="#6b7280" />
              </svg>
              <div>
                <span className="font-medium text-gray-800 text-xs">Pythagorean Theorem</span>
                <div className="font-mono text-[10px] text-gray-600">a² + b² = c²</div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              3D Shapes
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {refData["3D_shapes"].map((s) => (
                <div key={s.name} className="border border-gray-200 rounded-lg p-3 flex flex-col items-center gap-2">
                  {s.diagram}
                  <span className="font-medium text-gray-800 text-xs">{s.name}</span>
                  <span className="font-mono text-[10px] text-gray-600 text-center">{s.formula}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Constants
            </h3>
            <ul className="list-disc pl-5 space-y-1 font-mono text-xs text-gray-700">
              {refData.constants.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
