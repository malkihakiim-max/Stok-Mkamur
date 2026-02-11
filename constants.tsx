
import React from 'react';

export const INITIAL_DATA: any[] = [
  { id: '1', sku: 'LAP-001', name: 'MacBook Pro 14"', category: 'Elektronik', quantity: 12, reorderLevel: 5, price: 30000000, supplier: 'Apple Inc.', supplierEmail: 'sales@apple.com', location: 'Rak A1', condition: 'Baru', responsiblePerson: 'Budi' },
  { id: '2', sku: 'PHN-002', name: 'iPhone 15 Pro', category: 'Elektronik', quantity: 3, reorderLevel: 10, price: 20000000, supplier: 'Apple Inc.', supplierEmail: 'sales@apple.com', location: 'Rak A2', condition: 'Baru', responsiblePerson: 'Siti' },
  { id: '3', sku: 'MON-003', name: 'Studio Display', category: 'Periferal', quantity: 1, reorderLevel: 4, price: 25000000, supplier: 'Apple Inc.', supplierEmail: 'sales@apple.com', location: 'Rak B1', condition: 'Bekas/Display', responsiblePerson: 'Budi' },
  { id: '4', sku: 'MOU-004', name: 'Magic Mouse', category: 'Periferal', quantity: 25, reorderLevel: 10, price: 1200000, supplier: 'Logitech', supplierEmail: 'b2b@logitech.com', location: 'Laci C3', condition: 'Baru', responsiblePerson: 'Agus' },
  { id: '5', sku: 'KBD-005', name: 'Mechanical Keyboard', category: 'Periferal', quantity: 8, reorderLevel: 15, price: 2000000, supplier: 'Keychron', supplierEmail: 'support@keychron.com', location: 'Rak B2', condition: 'Baru', responsiblePerson: 'Agus' },
];

export const Icons = {
  Warehouse: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  History: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};
