import { exportAllData } from './db';
import { HABITS, DAYS_OF_WEEK, DAY_LABELS } from './data';

export async function generatePdf() {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);

  const data = await exportAllData();
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageW = doc.internal.pageSize.getWidth();
  let y = 20;

  // Cover
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Productivity Dashboard', pageW / 2, y, { align: 'center' });
  y += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('by GuidedBarakah', pageW / 2, y, { align: 'center' });
  y += 8;
  doc.setFontSize(10);
  doc.text(`Exported: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageW / 2, y, { align: 'center' });

  // Goals
  const goalsData = data.goals?.[0];
  if (goalsData?.goals?.some(g => g.text)) {
    doc.addPage();
    y = 20;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('My Goals', 14, y);
    y += 10;
    goalsData.goals.forEach((g, i) => {
      if (!g.text) return;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Goal ${i + 1}: ${g.text}`, 14, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      if (g.dunya) { doc.text(`Dunya: ${g.dunya}`, 18, y); y += 5; }
      if (g.akhirah) { doc.text(`Akhirah: ${g.akhirah}`, 18, y); y += 5; }
      y += 4;
    });
  }

  // Daily Pages Table
  const dailyPages = (data.dailyPages || []).sort((a, b) => a.id.localeCompare(b.id));
  if (dailyPages.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Daily Tracker Summary', 14, 20);

    const rows = dailyPages.map((page) => {
      const salahCount = Object.values(page.salah || {}).filter(s => s.done).length;
      return [
        page.date,
        page.niyyah?.slice(0, 40) || '-',
        `${salahCount}/5`,
        page.quran?.pages || '-',
        page.khushu || '-',
      ];
    });

    autoTable(doc, {
      startY: 28,
      head: [['Date', 'Niyyah', 'Salah', 'Quran Pages', 'Khushu']],
      body: rows,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [26, 83, 92] },
    });
  }

  // Habits Table
  const habits = (data.habits || []).sort((a, b) => a.id.localeCompare(b.id));
  if (habits.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Habit Tracker', 14, 20);

    habits.forEach((week, wi) => {
      const rows = HABITS.map((h) => {
        const hd = week.habits?.[h.id] || {};
        const days = DAYS_OF_WEEK.map(d => hd[d] ? 'Y' : '-');
        const done = days.filter(d => d === 'Y').length;
        return [h.label, ...days, `${done}/7`];
      });

      autoTable(doc, {
        startY: wi === 0 ? 28 : doc.lastAutoTable.finalY + 12,
        head: [['Habit', ...DAY_LABELS, 'Total']],
        body: rows,
        styles: { fontSize: 7, cellPadding: 1.5 },
        headStyles: { fillColor: [26, 83, 92] },
        columnStyles: { 0: { cellWidth: 40 } },
      });
    });
  }

  // Save
  const filename = `productivity-dashboard-${new Date().toISOString().split('T')[0]}.pdf`;

  if (navigator.share && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
    const blob = doc.output('blob');
    const file = new File([blob], filename, { type: 'application/pdf' });
    await navigator.share({ files: [file], title: 'My Productivity Dashboard Export' });
  } else {
    doc.save(filename);
  }
}
