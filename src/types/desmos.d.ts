declare module "desmos" {
  interface GraphingCalculatorOptions {
    keypad?: boolean;
    settingsMenu?: boolean;
    expressions?: boolean;
    border?: boolean;
    lockViewport?: boolean;
    images?: boolean;
    folders?: boolean;
    notes?: boolean;
    showGrid?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    xAxisNumbers?: boolean;
    yAxisNumbers?: boolean;
    polarNumbers?: boolean;
    expressionsTopbar?: boolean;
    zoomButtons?: boolean;
    invertedColors?: boolean;
    projectorMode?: boolean;
    degreeMode?: boolean;
    fontSize?: number;
    language?: string;
  }

  interface GraphingCalculatorInstance {
    setExpression(expression: Record<string, unknown>): void;
    setExpressions(expressions: Record<string, unknown>[]): void;
    getState(): Record<string, unknown>;
    setState(state: Record<string, unknown>): void;
    destroy(): void;
    screenshot(opts?: { width?: number; height?: number }): string;
  }

  type GraphingCalculator = (elt: HTMLElement, options?: GraphingCalculatorOptions) => GraphingCalculatorInstance;

  const Desmos: {
    GraphingCalculator: GraphingCalculator;
  };

  export default Desmos;
}
