/**
 * Convierte recursivamente valores Decimal de Prisma a Number.
 * Necesario porque Next.js no puede serializar objetos Decimal
 * de Server Components a Client Components.
 */
export function serializeDecimal<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return Number(obj) as unknown as T;
  if (typeof obj !== "object") return obj;
  if (obj instanceof Date) return obj;

  if (Array.isArray(obj)) return obj.map(serializeDecimal) as unknown as T;

  // Detecta instancias de Decimal: tienen toString() y constructor.name "Decimal"
  // También detecta objetos mockeados que se comportan como Decimal
  const asAny = obj as Record<string, unknown>;
  const proto = Object.getPrototypeOf(obj);
  const isDecimal =
    proto !== null &&
    proto !== Object.prototype &&
    typeof asAny.toString === "function" &&
    (asAny.constructor?.name === "Decimal" ||
     asAny.constructor?.name === "Decimal2" ||
     typeof asAny.s === "number"); // Prisma Decimal internal sign field

  if (isDecimal) {
    const num = Number(asAny.toString());
    return (Number.isNaN(num) ? 0 : num) as unknown as T;
  }

  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj as object)) {
    result[key] = serializeDecimal((obj as Record<string, unknown>)[key]);
  }
  return result as T;
}
