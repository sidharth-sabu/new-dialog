export type VariantKey = 'main' | 'empty_state_01' | 'empty_state_02' | 'empty_state_03'

export interface Variant {
  key: VariantKey
  label: string
  description: string
}

export const VARIANTS: Variant[] = [
  { key: 'main', label: 'Main', description: 'Original static action list' },
  { key: 'empty_state_01', label: 'Empty State 01', description: 'Grouped by category with headers' },
  { key: 'empty_state_02', label: 'Empty State 02', description: 'Flat randomized list' },
  { key: 'empty_state_03', label: 'Empty State 03', description: 'Flat list with load more' },
]
