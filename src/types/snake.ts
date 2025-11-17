export type StringToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? T extends Uppercase<T>
    ? `_${Lowercase<T>}${StringToSnakeCase<U>}`
    : `${T}${StringToSnakeCase<U>}`
  : S;

export type ToSnakeCase<T> = {
  [Key in keyof T as StringToSnakeCase<Key & string>]: T[Key] extends Array<infer G>
    ? Array<ToSnakeCase<G>>
    : T[Key] extends object
      ? ToSnakeCase<T[Key]>
      : T[Key];
};
