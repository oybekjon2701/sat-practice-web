"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Tab = "basic" | "graphing";

export default function Calculator({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("graphing");
  const [pos, setPos] = useState({ x: 100, y: 80 });
  const [dragging, setDragging] = useState(false);
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

  return (
    <div className="fixed inset-0 z-50 bg-black/40">
      <div
        ref={panelRef}
        className="absolute bg-white rounded-xl shadow-2xl w-[720px] max-h-[90vh] overflow-hidden flex flex-col"
        style={{ left: pos.x, top: pos.y }}
      >
        <div
          className="flex items-center justify-between px-4 py-2 border-b border-sat-border shrink-0 cursor-move select-none"
          onMouseDown={(e) => onDragStart(e.clientX, e.clientY)}
          onTouchStart={(e) => { const t = e.touches[0]; onDragStart(t.clientX, t.clientY); }}
        >
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-sat-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span className="text-xs font-medium text-sat-gray ml-1">Calculator</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab("graphing")}
              className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                tab === "graphing" ? "bg-sat-accent text-white" : "text-sat-gray hover:bg-sat-light"
              }`}
            >
              Graphing
            </button>
            <button
              onClick={() => setTab("basic")}
              className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                tab === "basic" ? "bg-sat-accent text-white" : "text-sat-gray hover:bg-sat-light"
              }`}
            >
              Basic
            </button>
            <button onClick={onClose} className="text-sat-gray hover:text-gray-800 cursor-pointer ml-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {tab === "graphing" ? <GraphingTab /> : <BasicTab />}
      </div>
    </div>
  );
}

function GraphingTab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const calcRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || calcRef.current) return;

    let destroyed = false;

    async function init() {
      try {
        const Desmos = (await import("desmos")).default;
        if (destroyed || !containerRef.current) return;

        const calculator = Desmos.GraphingCalculator(containerRef.current, {
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

        calcRef.current = calculator;
      } catch (err) {
        console.error("Failed to load Desmos:", err);
      }
    }

    init();

    return () => {
      destroyed = true;
      if (calcRef.current) {
        calcRef.current.destroy();
        calcRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-[600px]" />;
}

function BasicTab() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [reset, setReset] = useState(false);
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("deg");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "Escape") return;

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        input(e.key);
        return;
      }

      if (e.key === ".") {
        e.preventDefault();
        decimal();
        return;
      }

      if (e.key === "+") {
        e.preventDefault();
        setOperator("+");
        return;
      }
      if (e.key === "-") {
        e.preventDefault();
        setOperator("-");
        return;
      }
      if (e.key === "*") {
        e.preventDefault();
        setOperator("×");
        return;
      }
      if (e.key === "/") {
        e.preventDefault();
        setOperator("÷");
        return;
      }
      if (e.key === "^") {
        e.preventDefault();
        setOperator("^");
        return;
      }

      if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        equals();
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        if (display.length > 1) {
          setDisplay(display.slice(0, -1));
        } else {
          setDisplay("0");
        }
        return;
      }

      if (e.key.toLowerCase() === "c") {
        e.preventDefault();
        clear();
        return;
      }

      if (e.key === "%") {
        e.preventDefault();
        percent();
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  function toRad(v: number) { return angleMode === "deg" ? (v * Math.PI) / 180 : v; }

  function input(n: string) {
    if (reset) {
      setDisplay(n);
      setReset(false);
    } else {
      setDisplay(display === "0" ? n : display + n);
    }
  }

  function decimal() {
    if (reset) {
      setDisplay("0.");
      setReset(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }

  function unaryOp(fn: (v: number) => number) {
    const v = parseFloat(display);
    try {
      const result = fn(v);
      setDisplay(Number.isFinite(result) ? String(result) : "Error");
    } catch {
      setDisplay("Error");
    }
    setReset(true);
    setPrev(null);
    setOp(null);
  }

  function constOp(val: number) {
    if (reset) {
      setDisplay(String(val));
      setReset(false);
    } else {
      setDisplay(display + String(val));
    }
  }

  function setOperator(nextOp: string) {
    const num = parseFloat(display);
    if (prev !== null && op) {
      let result: number;
      switch (op) {
        case "+": result = prev + num; break;
        case "-": result = prev - num; break;
        case "×": result = prev * num; break;
        case "÷": result = prev / num; break;
        case "^": result = Math.pow(prev, num); break;
        default: result = num;
      }
      setDisplay(String(result));
      setPrev(result);
    } else {
      setPrev(num);
    }
    setOp(nextOp);
    setReset(true);
  }

  function equals() {
    const num = parseFloat(display);
    if (prev !== null && op) {
      let result: number;
      switch (op) {
        case "+": result = prev + num; break;
        case "-": result = prev - num; break;
        case "×": result = prev * num; break;
        case "÷": result = prev / num; break;
        case "^": result = Math.pow(prev, num); break;
        default: result = num;
      }
      setDisplay(Number.isFinite(result) ? String(result) : "Error");
      setPrev(null);
      setOp(null);
      setReset(true);
    }
  }

  function clear() {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setReset(false);
  }

  function negate() { unaryOp((v) => -v); }

  function percent() { unaryOp((v) => v / 100); }

  const btn = "h-10 rounded-lg text-sm font-medium border border-sat-border hover:bg-sat-light transition-colors active:bg-gray-200 cursor-pointer";
  const opBtn = "h-10 rounded-lg text-sm font-medium bg-sat-accent text-white hover:bg-blue-700 transition-colors active:bg-blue-800 cursor-pointer";
  const sciBtn = "h-10 rounded-lg text-xs font-medium bg-sat-light border border-sat-border hover:bg-gray-200 transition-colors active:bg-gray-300 cursor-pointer";

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-1">
        <button
          onClick={() => setAngleMode(angleMode === "deg" ? "rad" : "deg")}
          className="text-[10px] text-sat-gray px-1.5 py-0.5 rounded border border-sat-border hover:bg-sat-light cursor-pointer"
        >
          {angleMode.toUpperCase()}
        </button>
      </div>
      <div className="h-11 bg-sat-light rounded-lg flex items-center justify-end px-3 text-xl font-mono font-bold mb-2 overflow-hidden">
        <span className="truncate">{display}</span>
      </div>

      <div className="grid grid-cols-5 gap-1 mb-1.5">
        <button onClick={() => unaryOp((v) => Math.sin(toRad(v)))} className={sciBtn}>sin</button>
        <button onClick={() => unaryOp((v) => Math.cos(toRad(v)))} className={sciBtn}>cos</button>
        <button onClick={() => unaryOp((v) => Math.tan(toRad(v)))} className={sciBtn}>tan</button>
        <button onClick={() => unaryOp(Math.asin)} className={sciBtn}>asin</button>
        <button onClick={() => unaryOp(Math.acos)} className={sciBtn}>acos</button>
        <button onClick={() => unaryOp(Math.atan)} className={sciBtn}>atan</button>
        <button onClick={() => unaryOp(Math.log)} className={sciBtn}>ln</button>
        <button onClick={() => unaryOp(Math.log10)} className={sciBtn}>log</button>
        <button onClick={() => unaryOp(Math.sqrt)} className={sciBtn}>√</button>
        <button onClick={() => unaryOp((v) => v * v * v)} className={sciBtn}>x³</button>
        <button onClick={() => unaryOp((v) => Math.cbrt(v))} className={sciBtn}>³√x</button>
        <button onClick={() => unaryOp((v) => v * v)} className={sciBtn}>x²</button>
        <button onClick={() => unaryOp((v) => 1 / v)} className={sciBtn}>1/x</button>
        <button onClick={() => unaryOp(Math.abs)} className={sciBtn}>|x|</button>
        <button onClick={() => unaryOp((v) => { let r = 1; for (let i = 2; i <= v; i++) r *= i; return r; })} className={sciBtn}>n!</button>
        <button onClick={() => unaryOp((v) => Math.pow(10, v))} className={sciBtn}>10ˣ</button>
        <button onClick={() => constOp(Math.PI)} className={sciBtn}>π</button>
        <button onClick={() => constOp(Math.E)} className={sciBtn}>e</button>
      </div>

      <div className="grid grid-cols-4 gap-1">
        <button onClick={clear} className={`${btn} text-sat-red font-bold`}>AC</button>
        <button onClick={negate} className={btn}>±</button>
        <button onClick={percent} className={btn}>%</button>
        <button onClick={() => setOperator("÷")} className={opBtn}>÷</button>
        {["7","8","9"].map((n) => (
          <button key={n} onClick={() => input(n)} className={btn}>{n}</button>
        ))}
        <button onClick={() => setOperator("×")} className={opBtn}>×</button>
        {["4","5","6"].map((n) => (
          <button key={n} onClick={() => input(n)} className={btn}>{n}</button>
        ))}
        <button onClick={() => setOperator("-")} className={opBtn}>−</button>
        {["1","2","3"].map((n) => (
          <button key={n} onClick={() => input(n)} className={btn}>{n}</button>
        ))}
        <button onClick={() => setOperator("+")} className={opBtn}>+</button>
        <button onClick={() => input("0")} className={`${btn} col-span-2`}>0</button>
        <button onClick={decimal} className={btn}>.</button>
        <button onClick={equals} className={opBtn}>=</button>
        <button onClick={() => setOperator("^")} className={btn}>x^y</button>
      </div>
    </div>
  );
}
