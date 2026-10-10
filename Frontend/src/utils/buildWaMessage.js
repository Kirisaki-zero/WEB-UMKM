import { formatRupiah } from './formatRupiah.js';

export function buildWaMessage({ orderCode, customerName, phone, deliveryMethod, address, note, items, total }) {
  const itemList = items
    .map(item => `• ${item.name} (${item.qty}x) : ${formatRupiah(item.price * item.qty)}`)
    .join('\n');

  const methodText = deliveryMethod === 'pickup' ? 'Ambil di Toko' : 'Kirim ke Alamat';
  const addressLine = deliveryMethod === 'delivery' && address ? `Alamat: ${address}\n` : '';
  const noteLine = note ? `Catatan: ${note}\n` : '';

  return (
`Halo, saya ingin mengonfirmasi pesanan dari website:

Kode Pesanan: ${orderCode}
Nama Pemesan: ${customerName}
Nomor WhatsApp: ${phone}
Metode: ${methodText}
${addressLine}${noteLine}
Rincian Pesanan:
${itemList}

Total Pembayaran: ${formatRupiah(total)}

Mohon konfirmasi ketersediaan dan nomor rekening atau metode pembayarannya. Terima kasih.`
  );
}
