/**
 * Animation math — value interpolation for spring `from`/`to` targets.
 */

/**
 * A bag of animatable values — the shape `from`/`to` take on every spring
 * component. Values are plain numbers, or strings carrying a CSS unit or
 * transform function (`"10px"`, `"45deg"`, `"translate(10px)"`).
 */
export type SpringValues = Record<string, string | number>;

/**
 * Maps a value from one range to another, clamped to the source range.
 */
export const transformRange = (
  value: number,
  min: number,
  max: number,
  newMin: number,
  newMax: number,
) => {
  const normalized = (Math.min(Math.max(value, min), max) - min) / (max - min);
  return newMin + normalized * (newMax - newMin);
};

/** Linear interpolation between `start` and `end` at factor `t` (0-1). */
export const lerp = (start: number, end: number, t: number): number => {
  return start * (1 - t) + end * t;
};

/**
 * Interpolates between two value bags (numeric or unit-carrying strings such
 * as `'10px'` or `'rotate(45deg)'`) at `progress` (0-1), preserving units.
 */
export const interpolate = (
  start: SpringValues,
  end: SpringValues,
  progress: number,
): SpringValues => {
  const result: SpringValues = {};

  const extractNumber = (
    value: unknown,
  ): { number: number; unit: string | null } => {
    if (typeof value === "number") return { number: value, unit: null };
    if (typeof value === "string") {
      // Handle CSS transform functions like translate(10px) or rotate(45deg)
      const functionMatch = value.match(/^([a-zA-Z]+)\(([-0-9.]+)([^)]*)\)$/);
      if (functionMatch) {
        return {
          number: parseFloat(functionMatch[2]),
          unit: `${functionMatch[1]}(${functionMatch[3]})`,
        };
      }
      // Handle regular values with units like 45deg or 100px
      const match = value.match(/([-0-9.]+)([^0-9.]+)/);
      if (match) {
        return {
          number: parseFloat(match[1]),
          unit: match[2],
        };
      }
    }
    return { number: 0, unit: null };
  };

  for (const key in start) {
    const startVal = extractNumber(start[key]);
    const endVal = extractNumber(end[key]);

    if (startVal.unit !== null || endVal.unit !== null) {
      const unit = startVal.unit || endVal.unit;
      if (unit?.includes("(")) {
        // Check if it's any CSS transform function
        result[key] =
          `${unit.split("(")[0]}(${lerp(startVal.number, endVal.number, progress)}${unit.split(")")[0].slice(unit.split("(")[0].length)})`;
      } else {
        result[key] =
          `${lerp(startVal.number, endVal.number, progress)}${unit}`;
      }
    } else {
      result[key] = lerp(startVal.number, endVal.number, progress);
    }
  }

  return result;
};
