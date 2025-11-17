import { ToSnakeCase } from "@/types/snake";

function stringToSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function toSnakeCase<T>(obj: T): ToSnakeCase<T> {
  if (Array.isArray(obj)) return obj.map((item) => toSnakeCase(item)) as ToSnakeCase<T>;
  else if (obj !== null && typeof obj === "object")
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = stringToSnakeCase(key);
      acc[camelKey] = toSnakeCase(obj[key]);
      return acc;
    }, {}) as ToSnakeCase<T>;
  return obj as ToSnakeCase<T>;
}
