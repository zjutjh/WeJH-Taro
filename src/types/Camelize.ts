export type stringToCamelCase<S extends string> =
  S extends `${infer T}_${infer U}` ?
    U extends "" ? `${T}_` : `${T}${stringToCamelCase<Capitalize<U>>}`
    : S;

export type toCamelCase<T> = {
  [Key in keyof T as stringToCamelCase<Key & string>]: T[Key] extends Array<infer G>
    ? Array<toCamelCase<G>>
    : T[Key] extends object
      ? toCamelCase<T[Key]>
      : T[Key]
};
