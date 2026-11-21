export type UsedByProduct = {
  name: string
  url: string
}

/**
 * Products using a component, keyed by registry item name (the `name` passed
 * to `<DocDependencies>`). Shown in the given order.
 */
export const USED_BY: Record<string, UsedByProduct[]> = {}

export function getUsedBy(name: string): UsedByProduct[] {
  return USED_BY[name] ?? []
}
