export function getValueByPath<T extends object, P extends string>(
  obj: T,
  path: P
): unknown {
  const keys = path.split('.') as (keyof T)[];
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key as string];
  }

  return current;
}
