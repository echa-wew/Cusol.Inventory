import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Asset } from '../types';

export function generateMonthlyReport(assets: Asset[]) {
  const doc = new jsPDF();
  
  // Format the date using native Intl to avoid additional heavy date-fns locales if possible,
  // though we have date-fns. I'll use simple Intl.DateTimeFormat for Indonesian.
  const dateStr = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date());

  // Title
  doc.setFontSize(18);
  doc.text('Laporan Inventaris Aset IT', 14, 22);
  doc.setFontSize(11);
  doc.text(`Periode: ${dateStr}`, 14, 30);

  // Summary Stats
  const total = assets.length;
  const available = assets.filter(a => a.status === 'Tersedia').length;
  const inUse = assets.filter(a => a.status === 'Digunakan').length;
  const repair = assets.filter(a => a.status === 'Dalam Perbaikan').length;
  const poc = assets.filter(a => a.status === 'POC').length;

  doc.setFontSize(12);
  doc.text('Ringkasan Status:', 14, 40);

  autoTable(doc, {
    startY: 45,
    head: [['Total Aset', 'Tersedia', 'Digunakan', 'Diperbaiki', 'POC']],
    body: [[total, available, inUse, repair, poc]],
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] } // Indigo 600
  });

  // Detail Table
  doc.text('Daftar Detail Aset:', 14, (doc as any).lastAutoTable.finalY + 10);

  const tableData = assets.map(a => {
    let pocDateStr = '-';
    if (a.checkoutDate || a.returnDate) {
      pocDateStr = `${a.checkoutDate || '-'} s/d ${a.returnDate || 'Sekarang'}`;
    }
    return [
      a.serialNumber,
      a.name,
      a.category,
      a.status,
      a.location,
      a.assignedTo || '-',
      pocDateStr
    ];
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 15,
    head: [['SN', 'Nama Perangkat', 'Kategori', 'Status', 'Lokasi', 'Pengguna', 'Tgl Keluar/Kembali']],
    body: tableData,
    theme: 'striped',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [79, 70, 229] }
  });

  doc.save(`Laporan_Aset_IT_${dateStr.replace(' ', '_')}.pdf`);
}
