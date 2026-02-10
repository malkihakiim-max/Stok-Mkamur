
import { InventoryItem, UserRole } from "../types";

export const sendSlackNotification = async (item: InventoryItem, user: string, role: UserRole) => {
  const isCritical = item.quantity <= item.reorderLevel * 0.5;
  const statusLabel = isCritical ? "🚨 KRITIS" : "⚠️ RENDAH";
  
  const message = {
    text: `*Peringatan Stok ${statusLabel}*`,
    attachments: [
      {
        color: isCritical ? "#ef4444" : "#f59e0b",
        fields: [
          { title: "Produk", value: item.name, short: true },
          { title: "SKU", value: item.sku, short: true },
          { title: "Sisa Stok", value: `${item.quantity} unit`, short: true },
          { title: "Batas Minimum", value: `${item.reorderLevel} unit`, short: true },
          { title: "Diperbarui Oleh", value: `${user} (${role})`, short: false }
        ],
        footer: "Sistem Notifikasi Stok Makmur"
      }
    ]
  };

  // Dalam implementasi nyata, kita akan menggunakan fetch ke Slack Webhook URL
  // const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
  // await fetch(SLACK_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(message) });

  console.log("Mengirim Pesan ke Slack:", message);
  return true;
};
