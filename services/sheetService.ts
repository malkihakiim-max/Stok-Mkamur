
import { InventoryItem } from "../types";

export const fetchSheetData = async (url: string): Promise<InventoryItem[] | null> => {
  if (!url || !url.startsWith('http')) return null;

  try {
    let csvUrl = url.trim();
    
    // Konversi link Google Sheets biasa (/edit) menjadi link CSV (/pub)
    if (csvUrl.includes('docs.google.com/spreadsheets')) {
      if (csvUrl.includes('/edit')) {
        // Mengubah .../edit?usp=sharing menjadi .../pub?output=csv
        csvUrl = csvUrl.replace(/\/edit.*$/, '/pub?output=csv');
      } else if (!csvUrl.includes('output=csv')) {
        // Memastikan parameter output=csv ada
        csvUrl += (csvUrl.includes('?') ? '&' : '?') + 'output=csv';
      }
    }

    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      if (response.status === 404) throw new Error('Sheet tidak ditemukan. Pastikan URL benar.');
      if (response.status === 403) throw new Error('Akses ditolak. Pastikan Sheet sudah di "Publish to Web".');
      throw new Error(`Error: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    
    // Cek apakah response benar-benar CSV atau malah halaman login HTML (karena belum di-publish)
    if (csvText.includes('<!DOCTYPE html>') || csvText.includes('google-signin')) {
      throw new Error('Sheet belum di "Publish to Web". Ikuti panduan di menu Atur.');
    }
    
    const parseCSVRow = (text: string) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current);
      return result;
    };

    const rows = csvText.split('\n')
      .map(row => parseCSVRow(row.trim()))
      .filter(row => row.length > 1); // Buang baris kosong

    if (rows.length < 2) throw new Error('Sheet kosong atau format tidak sesuai.');

    const headers = rows[0].map(h => h.toLowerCase().trim());
    const findIndex = (keywords: string[]) => 
      headers.findIndex(h => keywords.some(k => h.includes(k.toLowerCase())));

    const idx = {
      name: findIndex(['nama', 'produk', 'item', 'barang']),
      sku: findIndex(['sku', 'kode', 'id']),
      category: findIndex(['kategori', 'jenis', 'group', 'category']),
      stock: findIndex(['stok', 'jumlah', 'qty', 'stock', 'kuantitas']),
      price: findIndex(['harga', 'price', 'nilai', 'cost']),
      supplier: findIndex(['pemasok', 'supplier', 'vendor']),
      email: findIndex(['email', 'kontak'])
    };

    const items: InventoryItem[] = rows.slice(1)
      .filter(row => row[idx.name] || row[idx.sku])
      .map((row, index) => {
        const rawStock = row[idx.stock] || "0";
        const rawPrice = row[idx.price] || "0";
        const cleanNumber = (val: string) => {
          if (!val) return 0;
          return parseFloat(val.replace(/[^0-9.,-]/g, '').replace(',', '.')) || 0;
        };

        return {
          id: (index + 1).toString(),
          name: row[idx.name]?.trim() || 'Produk Tanpa Nama',
          sku: row[idx.sku]?.trim() || `SKU-${index + 1}`,
          category: row[idx.category]?.trim() || 'Umum',
          quantity: Math.floor(cleanNumber(rawStock)),
          reorderLevel: 5,
          price: cleanNumber(rawPrice),
          supplier: row[idx.supplier]?.trim() || 'Pemasok Umum',
          supplierEmail: row[idx.email]?.trim() || 'admin@pemasok.com'
        };
      });

    return items;
  } catch (error: any) {
    console.error("Sheet Fetch Error:", error.message);
    throw error; // Lemparkan error agar bisa ditangkap UI
  }
};

export const updateSheetData = async (bridgeUrl: string, sku: string, newQuantity: number) => {
  if (!bridgeUrl || !bridgeUrl.startsWith('http')) return false;
  
  try {
    await fetch(bridgeUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku, newQuantity }),
    });
    return true;
  } catch (error) {
    console.error("Cloud Sync Error:", error);
    return false;
  }
};
