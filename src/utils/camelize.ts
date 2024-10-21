import { ToCamelCase } from "@/types/Camelize";

function stringToCamelCase(str:string): string {
  return str.replace(/_([a-z])/g, (_match, letter) => {
    return letter.toUpperCase();
  });
}

export function toCamelCase<T>(obj: T): ToCamelCase<T> {
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item)) as ToCamelCase<T>;
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = stringToCamelCase(key);
      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {}) as ToCamelCase<T>;
  }
  return obj as ToCamelCase<T>;
}
