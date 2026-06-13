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

const FUNCS: Record<string, (x: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  log: Math.log10,
  ln: Math.log,
  sqrt: Math.sqrt,
  abs: Math.abs,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  exp: Math.exp,
};

function splitOnEquals(expr: string): { lhs: string; rhs: string } | null {
  const idx = expr.indexOf("=");
  if (idx === -1) return null;
  return { lhs: expr.substring(0, idx).trim(), rhs: expr.substring(idx + 1).trim() };
}

function splitOnIneq(expr: string): { lhs: string; rhs: string; op: string } | null {
  const m = expr.match(/^(.+?)\s*([><]=?)\s*(.+)$/);
  if (!m) return null;
  return { lhs: m[1].trim(), rhs: m[3].trim(), op: m[2] };
}

function hasY(expr: string): boolean {
  return /(?<![a-zA-Z])y(?![a-zA-Z])/.test(expr);
}

class Parser {
  private tokens: string[] = [];
  private pos = 0;

  constructor(expr: string, private x: number, private y: number = 0) {
    const s = expr
      .replace(/\s+/g, "")
      .replace(/π/g, "pi")
      .replace(/×/g, "*")
      .replace(/÷/g, "/");
    const chars: string[] = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/^[a-zA-Z_]$/.test(c)) {
        let word = "";
        while (i < s.length && /^[a-zA-Z0-9_]$/.test(s[i])) { word += s[i]; i++; }
        chars.push(word);
      } else if (/^[0-9.]$/.test(c)) {
        let num = "";
        while (i < s.length && /^[0-9.]$/.test(s[i])) { num += s[i]; i++; }
        chars.push(num);
      } else {
        chars.push(c);
        i++;
      }
    }
    this.tokens = chars;
  }

  peek(): string { return this.tokens[this.pos] || ""; }
  next(): string { return this.tokens[this.pos++] || ""; }

  parse(): number {
    const val = this.expr();
    return val;
  }

  private expr(): number {
    let left = this.term();
    while (this.peek() === "+" || this.peek() === "-") {
      const op = this.next();
      const right = this.term();
      left = op === "+" ? left + right : left - right;
    }
    return left;
  }

  private term(): number {
    let left = this.power();
    while (true) {
      const p = this.peek();
      if (!p) break;
      if (p === "+" || p === "-" || p === "^" || p === ")") break;
      if (p === "*") { this.next(); left = left * this.power(); continue; }
      if (p === "/") { this.next(); left = left / this.power(); continue; }
      const right = this.power();
      left = left * right;
    }
    return left;
  }

  private power(): number {
    let left = this.unary();
    if (this.peek() === "^") {
      this.next();
      const right = this.power();
      left = Math.pow(left, right);
    }
    return left;
  }

  private unary(): number {
    if (this.peek() === "-") {
      this.next();
      return -this.unary();
    }
    if (this.peek() === "+") {
      this.next();
      return this.unary();
    }
    return this.call();
  }

  private call(): number {
    const name = this.peek();
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
      if (name === "pi") { this.next(); return Math.PI; }
      if (name === "e") { this.next(); return Math.E; }
      if (name in FUNCS) {
        this.next();
        if (this.peek() === "(") {
          this.next();
          const arg = this.expr();
          this.next();
          return FUNCS[name](arg);
        }
        return FUNCS[name](this.unary());
      }
    }
    return this.atom();
  }

  private atom(): number {
    if (this.peek() === "(") {
      this.next();
      const val = this.expr();
      this.next();
      return val;
    }
    if (this.peek() === "x") {
      this.next();
      return this.x;
    }
    if (this.peek() === "y") {
      this.next();
      return this.y;
    }
    const num = this.next();
    const n = parseFloat(num);
    if (!isNaN(n)) return n;
    return 0;
  }
}

function evalMath(expr: string, x: number, y: number = 0): number | null {
  try {
    const parser = new Parser(expr, x, y);
    const result = parser.parse();
    if (typeof result === "number" && !Number.isNaN(result) && Number.isFinite(result)) {
      return result;
    }
    return null;
  } catch {
    return null;
  }
}

function GraphingTab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [exprs, setExprs] = useState<string[]>(["x^2"]);
  const [colors] = useState<string[]>(["#1a73e8", "#1e8e3e", "#d93025", "#f9ab00", "#9334e6"]);
  const [showExprInput, setShowExprInput] = useState(true);
  const [view, setView] = useState({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
  const panRef = useRef({ dragging: false, startX: 0, startY: 0, startView: { xMin: 0, xMax: 0, yMin: 0, yMax: 0 } });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const { xMin, xMax, yMin, yMax } = view;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = "#e8eaed";
    ctx.lineWidth = 0.5;

    const xStep = 10 ** Math.floor(Math.log10((xMax - xMin) / 5));
    const yStep = 10 ** Math.floor(Math.log10((yMax - yMin) / 5));

    for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
      const px = ((x - xMin) / (xMax - xMin)) * w;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h);
      ctx.stroke();
    }
    for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
      const py = h - ((y - yMin) / (yMax - yMin)) * h;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(w, py);
      ctx.stroke();
    }

    const x0 = ((-xMin) / (xMax - xMin)) * w;
    const y0 = h - ((-yMin) / (yMax - yMin)) * h;

    ctx.strokeStyle = "#5f6368";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x0, 0);
    ctx.lineTo(x0, h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, y0);
    ctx.lineTo(w, y0);
    ctx.stroke();

    ctx.fillStyle = "#5f6368";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
      if (Math.abs(x) < xStep * 0.01) continue;
      const px = ((x - xMin) / (xMax - xMin)) * w;
      ctx.fillText(x % 1 === 0 ? String(x) : x.toFixed(1), px, y0 + 14);
    }
    ctx.textAlign = "right";
    for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
      if (Math.abs(y) < yStep * 0.01) continue;
      const py = h - ((y - yMin) / (yMax - yMin)) * h;
      ctx.fillText(y % 1 === 0 ? String(y) : y.toFixed(1), x0 - 4, py + 4);
    }
    ctx.textAlign = "center";
    ctx.fillText("O", x0 - 8, y0 + 14);

    exprs.forEach((expr, i) => {
      if (!expr.trim()) return;
      const color = colors[i % colors.length];
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2;

      const eq = splitOnEquals(expr);
      const ineq = splitOnIneq(expr);
      const isImplicit = hasY(expr);

      let func: (x: number, y: number) => number | null;
      if (ineq) {
        func = (x, y) => {
          const lhs = evalMath(ineq.lhs, x, y);
          const rhs = evalMath(ineq.rhs, x, y);
          return (lhs !== null && rhs !== null) ? lhs - rhs : null;
        };
      } else if (eq) {
        func = (x, y) => {
          const lhs = evalMath(eq.lhs, x, y);
          const rhs = evalMath(eq.rhs, x, y);
          return (lhs !== null && rhs !== null) ? lhs - rhs : null;
        };
      } else {
        func = (x, y) => evalMath(expr, x, y);
      }

      if (!isImplicit && !ineq) {
        ctx.beginPath();
        let started = false;
        for (let px = 0; px <= w; px += 0.5) {
          const xVal = xMin + (px / w) * (xMax - xMin);
          const yVal = func(xVal, 0);
          if (yVal === null) { started = false; continue; }
          const py = h - ((yVal - yMin) / (yMax - yMin)) * h;
          if (py < -1000 || py > h + 1000) { started = false; continue; }
          if (!started) { ctx.moveTo(px, py); started = true; }
          else { ctx.lineTo(px, py); }
        }
        ctx.stroke();
        return;
      }

      const gridStep = 3;
      const cols = Math.ceil(w / gridStep);
      const rows = Math.ceil(h / gridStep);
      const values: (number | null)[][] = [];

      for (let gx = 0; gx < cols; gx++) {
        values[gx] = [];
        for (let gy = 0; gy < rows; gy++) {
          const xVal = xMin + (gx * gridStep / w) * (xMax - xMin);
          const yVal = yMin + ((h - gy * gridStep) / h) * (yMax - yMin);
          values[gx][gy] = func(xVal, yVal);
        }
      }

      if (ineq) {
        ctx.globalAlpha = 0.15;
        for (let gx = 0; gx < cols; gx++) {
          for (let gy = 0; gy < rows; gy++) {
            const v = values[gx][gy];
            if (v === null) continue;
            const px = gx * gridStep;
            const py = gy * gridStep;
            const shade = ineq.op === ">" || ineq.op === ">=" ? v >= 0 : v <= 0;
            if (shade) {
              ctx.fillRect(px, py, gridStep, gridStep);
            }
          }
        }
        ctx.globalAlpha = 1;
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.6;
      }

      ctx.beginPath();
      for (let gx = 0; gx < cols - 1; gx++) {
        for (let gy = 0; gy < rows - 1; gy++) {
          const v00 = values[gx][gy];
          const v10 = values[gx + 1][gy];
          const v01 = values[gx][gy + 1];
          const v11 = values[gx + 1][gy + 1];
          if (v00 === null || v10 === null || v01 === null || v11 === null) continue;

          const edges: { x: number; y: number }[] = [];

          const sign00 = v00 >= 0;
          const sign10 = v10 >= 0;
          const sign01 = v01 >= 0;
          const sign11 = v11 >= 0;

          if (sign00 !== sign10) {
            const t = v00 / (v00 - v10);
            edges.push({ x: (gx + t) * gridStep, y: gy * gridStep });
          }
          if (sign10 !== sign11) {
            const t = v10 / (v10 - v11);
            edges.push({ x: (gx + 1) * gridStep, y: (gy + t) * gridStep });
          }
          if (sign01 !== sign11) {
            const t = v01 / (v01 - v11);
            edges.push({ x: (gx + t) * gridStep, y: (gy + 1) * gridStep });
          }
          if (sign00 !== sign01) {
            const t = v00 / (v00 - v01);
            edges.push({ x: gx * gridStep, y: (gy + t) * gridStep });
          }

          if (edges.length >= 2) {
            ctx.moveTo(edges[0].x, edges[0].y);
            ctx.lineTo(edges[1].x, edges[1].y);
          }
        }
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    });
  }, [exprs, view, colors]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  function zoom(factor: number) {
    const cx = (view.xMin + view.xMax) / 2;
    const cy = (view.yMin + view.yMax) / 2;
    const rx = (view.xMax - view.xMin) / 2;
    const ry = (view.yMax - view.yMin) / 2;
    setView({
      xMin: cx - rx * factor,
      xMax: cx + rx * factor,
      yMin: cy - ry * factor,
      yMax: cy + ry * factor,
    });
  }

  function addExpr() {
    setExprs([...exprs, ""]);
  }

  function updateExpr(idx: number, val: string) {
    const next = [...exprs];
    next[idx] = val;
    setExprs(next);
  }

  function removeExpr(idx: number) {
    setExprs(exprs.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 relative min-h-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => {
            panRef.current.dragging = true;
            panRef.current.startX = e.clientX;
            panRef.current.startY = e.clientY;
            panRef.current.startView = { ...view };
          }}
          onMouseMove={(e) => {
            if (!panRef.current.dragging) return;
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            const dx = e.clientX - panRef.current.startX;
            const dy = e.clientY - panRef.current.startY;
            const xRange = panRef.current.startView.xMax - panRef.current.startView.xMin;
            const yRange = panRef.current.startView.yMax - panRef.current.startView.yMin;
            setView({
              xMin: panRef.current.startView.xMin - (dx / rect.width) * xRange,
              xMax: panRef.current.startView.xMax - (dx / rect.width) * xRange,
              yMin: panRef.current.startView.yMin + (dy / rect.height) * yRange,
              yMax: panRef.current.startView.yMax + (dy / rect.height) * yRange,
            });
          }}
          onMouseUp={() => { panRef.current.dragging = false; }}
          onMouseLeave={() => { panRef.current.dragging = false; }}
          onWheel={(e) => {
            e.preventDefault();
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            const xPct = mx / rect.width;
            const yPct = my / rect.height;
            const xMid = view.xMin + xPct * (view.xMax - view.xMin);
            const yMid = view.yMin + (1 - yPct) * (view.yMax - view.yMin);
            const factor = e.deltaY > 0 ? 1.15 : 0.85;
            const rx = (view.xMax - view.xMin) / 2 * factor;
            const ry = (view.yMax - view.yMin) / 2 * factor;
            setView({
              xMin: xMid - rx,
              xMax: xMid + rx,
              yMin: yMid - ry,
              yMax: yMid + ry,
            });
          }}
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <button onClick={() => zoom(0.8)} className="w-8 h-8 bg-white border border-sat-border rounded-md text-sm font-bold hover:bg-sat-light cursor-pointer shadow-sm" title="Zoom in">+</button>
          <button onClick={() => zoom(1.25)} className="w-8 h-8 bg-white border border-sat-border rounded-md text-sm font-bold hover:bg-sat-light cursor-pointer shadow-sm" title="Zoom out">−</button>
          <button onClick={() => setView({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 })} className="w-8 h-8 bg-white border border-sat-border rounded-md text-xs hover:bg-sat-light cursor-pointer shadow-sm" title="Reset view">R</button>
        </div>
      </div>

      <div className="flex gap-0.5 px-3 pt-1 pb-0.5">
        <button onClick={() => { const el = document.activeElement as HTMLInputElement; const idx = el?.dataset?.exprIdx != null ? Number(el.dataset.exprIdx) : exprs.length - 1; const cur = exprs[idx] || ''; const selStart = el?.selectionStart ?? cur.length; const next = cur.slice(0, selStart) + '>' + cur.slice(selStart); updateExpr(idx, next); setTimeout(() => { const inp = document.querySelector(`[data-expr-idx="${idx}"]`) as HTMLInputElement; if(inp) { const pos = selStart + 1; inp.setSelectionRange(pos, pos); inp.focus(); } }); }} className="px-1.5 py-0.5 text-sm font-mono bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 cursor-pointer">&gt;</button>
        <button onClick={() => { const el = document.activeElement as HTMLInputElement; const idx = el?.dataset?.exprIdx != null ? Number(el.dataset.exprIdx) : exprs.length - 1; const cur = exprs[idx] || ''; const selStart = el?.selectionStart ?? cur.length; const next = cur.slice(0, selStart) + '<' + cur.slice(selStart); updateExpr(idx, next); setTimeout(() => { const inp = document.querySelector(`[data-expr-idx="${idx}"]`) as HTMLInputElement; if(inp) { const pos = selStart + 1; inp.setSelectionRange(pos, pos); inp.focus(); } }); }} className="px-1.5 py-0.5 text-sm font-mono bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 cursor-pointer">&lt;</button>
        <button onClick={() => { const el = document.activeElement as HTMLInputElement; const idx = el?.dataset?.exprIdx != null ? Number(el.dataset.exprIdx) : exprs.length - 1; const cur = exprs[idx] || ''; const selStart = el?.selectionStart ?? cur.length; const next = cur.slice(0, selStart) + '>=' + cur.slice(selStart); updateExpr(idx, next); setTimeout(() => { const inp = document.querySelector(`[data-expr-idx="${idx}"]`) as HTMLInputElement; if(inp) { const pos = selStart + 2; inp.setSelectionRange(pos, pos); inp.focus(); } }); }} className="px-1.5 py-0.5 text-sm font-mono bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 cursor-pointer">≥</button>
        <button onClick={() => { const el = document.activeElement as HTMLInputElement; const idx = el?.dataset?.exprIdx != null ? Number(el.dataset.exprIdx) : exprs.length - 1; const cur = exprs[idx] || ''; const selStart = el?.selectionStart ?? cur.length; const next = cur.slice(0, selStart) + '<=' + cur.slice(selStart); updateExpr(idx, next); setTimeout(() => { const inp = document.querySelector(`[data-expr-idx="${idx}"]`) as HTMLInputElement; if(inp) { const pos = selStart + 2; inp.setSelectionRange(pos, pos); inp.focus(); } }); }} className="px-1.5 py-0.5 text-sm font-mono bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 cursor-pointer">≤</button>
        <span className="text-gray-400 text-xs self-center ml-1">inequality</span>
      </div>
      <div className="border-t border-sat-border p-3 space-y-1.5 max-h-[200px] overflow-y-auto">
        {exprs.map((expr, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
            <input
              data-expr-input
              data-expr-idx={i}
              value={expr}
              onChange={(e) => updateExpr(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") draw(); }}
              placeholder={`f${i + 1}(x) = `}
              className="flex-1 text-xs font-mono border border-sat-border rounded px-2 py-1 outline-none focus:border-sat-accent"
            />
            {exprs.length > 1 && (
              <button onClick={() => removeExpr(i)} className="text-sat-gray hover:text-sat-red text-xs cursor-pointer">✕</button>
            )}
          </div>
        ))}
        <button
          onClick={addExpr}
          className="text-xs text-sat-accent hover:text-blue-700 cursor-pointer"
        >
          + Add function
        </button>
      </div>
    </div>
  );
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
