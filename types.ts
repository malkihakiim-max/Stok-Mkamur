
export enum UserRole {
  MANAGER = 'MANAGER',
  WAREHOUSE = 'WAREHOUSE'
}

export enum StockStatus {
  HEALTHY = 'HEALTHY',
  LOW = 'LOW',
  CRITICAL = 'CRITICAL'
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  price: number;
  supplier: string;
  supplierEmail: string;
  lastRestocked?: string;
}

export interface StockLog {
  id: string;
  itemId: string;
  itemName: string;
  change: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  timestamp: string;
  user: string;
  role: UserRole;
}

export interface AppState {
  currentUser: UserRole;
  items: InventoryItem[];
  logs: StockLog[];
  isLoading: boolean;
}
