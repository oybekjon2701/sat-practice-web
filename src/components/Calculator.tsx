"use client";

import { useRef, useEffect, useCallback, useState } from "react";

export default function Calculator({ onClose }: { onClose: () => void }) {
  const [pos, setPos] = useState({ x: 30, y: 60 });
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState<"graphing" | "scientific">("graphing");
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const onDragStart = useCallback((clientX: number, clientY: number) => {
    dragRef.current.startX = clientX;
    dragRef.current.startY = clientY;
    dragRef.current.startPosX = pos.x;
    dragRef.current.startPosY = pos.y;
    setDragging(true);
  }, [pos]);

  const onDragMove = useCallback((clientX: number, clientY: number) => {
    if (!dragging) return;
    const dx = clientX - dragRef.current.startX;
    const dy = clientY - dragRef.current.startY;
    setPos({
      x: dragRef.current.startPosX + dx,
      y: Math.max(0, dragRef.current.startPosY + dy),
    });
  }, [dragging]);

  const onDragEnd = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => { e.preventDefault(); onDragMove(e.clientX, e.clientY); };
    const handleMouseUp = () => onDragEnd();
    const handleTouchMove = (e: TouchEvent) => { if (e.touches.length === 1) onDragMove(e.touches[0].clientX, e.touches[0].clientY); };
    const handleTouchEnd = () => onDragEnd();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging, onDragMove, onDragEnd]);

  const desmosRef = useRef<any>(null);
  const [desmosLoaded, setDesmosLoaded] = useState(false);

  useEffect(() => {
    import("desmos").then((mod) => {
      desmosRef.current = mod.default;
      setDesmosLoaded(true);
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/40">
      <div
        ref={panelRef}
        className="absolute bg-white rounded-xl shadow-2xl w-[740px] overflow-hidden flex flex-col"
        style={{ left: pos.x, top: pos.y }}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-sat-border shrink-0">
          <div className="flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5 text-sat-gray cursor-move"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              onMouseDown={(e) => { e.stopPropagation(); onDragStart(e.clientX, e.clientY); }}
              onTouchStart={(e) => { e.stopPropagation(); const t = e.touches[0]; onDragStart(t.clientX, t.clientY); }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span className="text-xs font-medium text-sat-gray ml-1">Calculator</span>
          </div>
          <button onClick={onClose} className="text-sat-gray hover:text-gray-800 cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-200 px-4">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setMode("graphing")}
            className={`px-4 py-2 text-xs font-medium cursor-pointer border-b-2 transition-colors ${mode === "graphing" ? "border-[#0033aa] text-[#0033aa]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Graphing
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setMode("scientific")}
            className={`px-4 py-2 text-xs font-medium cursor-pointer border-b-2 transition-colors ${mode === "scientific" ? "border-[#0033aa] text-[#0033aa]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Scientific
          </button>
        </div>

        <div className="flex-1 min-h-0">
          {desmosLoaded && mode === "graphing" && <GraphingTab desmos={desmosRef.current} />}
          {desmosLoaded && mode === "scientific" && <ScientificTab desmos={desmosRef.current} />}
        </div>
      </div>
    </div>
  );
}

function GraphingTab({ desmos }: { desmos: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const calcRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || calcRef.current) return;
    const el = containerRef.current;

    const calculator = desmos.GraphingCalculator(el, {
      keypad: true,
      settingsMenu: false,
      expressions: true,
      border: false,
      lockViewport: false,
      images: false,
      folders: false,
      notes: false,
      showGrid: true,
      showXAxis: true,
      showYAxis: true,
      xAxisNumbers: true,
      yAxisNumbers: true,
      polarNumbers: false,
      expressionsTopbar: false,
      zoomButtons: true,
      invertedColors: false,
      projectorMode: false,
      degreeMode: false,
    });

    const style = document.createElement("style");
    style.id = "desmos-column-layout";
    style.textContent = `
      #desmos-graph-container .dcg-graph-container {
        flex-direction: column !important;
      }
      #desmos-graph-container .dcg-expressions {
        order: 2 !important;
        width: 100% !important;
        max-height: 160px !important;
      }
      #desmos-graph-container .dcg-graph-inner {
        order: 1 !important;
        width: 100% !important;
        flex: 1 !important;
        min-height: 300px !important;
      }
    `;
    el.id = "desmos-graph-container";
    el.appendChild(style);

    calcRef.current = calculator;

    return () => {
      if (calcRef.current) {
        calcRef.current.destroy();
        calcRef.current = null;
      }
    };
  }, [desmos]);

  return <div ref={containerRef} className="w-full h-[520px]" />;
}

function ScientificTab({ desmos }: { desmos: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const calcRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || calcRef.current) return;
    const el = containerRef.current;

    const calculator = desmos.ScientificCalculator(el, {
      keypad: true,
      settingsMenu: false,
      border: false,
      expressions: false,
      invertedColors: false,
      projectorMode: false,
    });

    calcRef.current = calculator;

    return () => {
      if (calcRef.current) {
        calcRef.current.destroy();
        calcRef.current = null;
      }
    };
  }, [desmos]);

  return <div ref={containerRef} className="w-full h-[520px]" />;
}
