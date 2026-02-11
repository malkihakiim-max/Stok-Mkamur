
import { GoogleGenAI } from "@google/genai";
import { InventoryItem } from "../types";

/**
 * Service to interact with Gemini for inventory insights.
 * Uses process.env.API_KEY which can be configured in Netlify Environment Variables.
 */
export const getInventoryInsights = async (items: InventoryItem[]) => {
  // Initialize GenAI with the API key from environment variables
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
    // Using the generateContent method as required by the latest @google/genai guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    
    // Access the generated text directly via the .text property
    return response.text;
  } catch (error) {
    console.error("Kesalahan Gemini:", error);
    return "Gagal menghasilkan wawasan AI saat ini. Periksa konfigurasi API Key di Netlify.";
  }
};
