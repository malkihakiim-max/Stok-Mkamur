
import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem } from "../types";

export const getInventoryInsights = async (items: InventoryItem[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const lowStockItems = items.filter(i => i.quantity <= i.reorderLevel);
  const totalValue = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  const prompt = `
    Analisis data inventaris berikut ini:
    Total item: ${items.length}
    Total nilai: Rp${totalValue.toLocaleString('id-ID')}
    Item stok rendah: ${JSON.stringify(lowStockItems.map(i => ({ nama: i.name, jml: i.quantity, min: i.reorderLevel })))}
    
    Berikan 3 wawasan strategis singkat untuk manajer gudang dalam Bahasa Indonesia:
    1. Item mana yang butuh restok segera?
    2. Apakah ada risiko stok berlebih (overstock)?
    3. Saran tindakan untuk pemasok.
    Pastikan respon profesional dan dapat langsung ditindaklanjuti.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Kesalahan Gemini:", error);
    return "Gagal menghasilkan wawasan AI saat ini.";
  }
};
