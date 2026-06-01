export type VaultItemCategory =
  | "animations"
  | "resources"
  | "products"
  | "accessories";

export type VaultCategory = "all" | VaultItemCategory;

export type VaultItem = {
  id: string;
  title: string;
  description: string;
  category: VaultItemCategory;
  tags: string[];
  color: string;
  readTime: string;
  link: string;
  /** Local path under /public for product & accessory cards */
  image?: string;
};

export const VAULT_TAB_CATEGORIES: VaultCategory[] = [
  "all",
  "animations",
  "resources",
  "products",
  "accessories",
];

export const VAULT_ITEM_CATEGORIES: VaultItemCategory[] = [
  "animations",
  "resources",
  "products",
  "accessories",
];
