export type StringToCamelCase<S extends string> =
  S extends `${infer T}_${infer U}` ?
    U extends "" ? `${T}_` : `${T}${StringToCamelCase<Capitalize<U>>}`
    : S;

export type ToCamelCase<T> = {
  [Key in keyof T as StringToCamelCase<Key & string>]: T[Key] extends Array<infer G>
    ? Array<ToCamelCase<G>>
    : T[Key] extends object
      ? ToCamelCase<T[Key]>
      : T[Key]
};
