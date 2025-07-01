// hooks/useExportReport.ts
import { Transaction } from '@/pages/admin/Revenue';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { unparse } from 'papaparse';

export default function useExportReport(data: Transaction[]) {

  const exportToCSV = () => {
    const csvData = data.map(item => ({
      'Course Name': item.course,
      'Tutor Name': item.tutor,
      'Student': item.student,
      'Total Paid': typeof item.amount === 'number' ? `₹${item.amount}` : item.amount,
      'Admin Commission': typeof item.adminShare === 'number' ? `₹${item.adminShare}` : item.adminShare,
    }));

    // ✅ Calculate total admin revenue
    const totalAdminRevenue = data.reduce((sum, item) => sum + Number(item.adminShare || 0), 0);

    // ✅ Add total row
    csvData.push({
      'Course Name': '',
      'Tutor Name': '',
      'Student': '',
      'Total Paid': 'Total Revenue',
      'Admin Commission': `₹${totalAdminRevenue}`,
    });

    const csv = unparse(csvData);
    const csvWithBOM = '\uFEFF' + csv;

    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'AdminRevenueReport.csv');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Admin Revenue Report', 14, 20);

    const tableColumn = ["Course Name", "Tutor", "Students", "Total Paid", "Admin Share"];

    const tableRows = data.map(item => [
      item.course,
      item.tutor,
      item.student,
      `Rs.${item.amount}`,
      `Rs.${item.adminShare}`,
    ]);

    // ✅ Calculate total admin revenue
    const totalAdminRevenue = data.reduce((sum, item) => sum + Number(item.adminShare || 0), 0);

    // ✅ Add total row
    tableRows.push(['', '', '', 'Total Revenue', `Rs.${totalAdminRevenue}`]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save('AdminRevenueReport.pdf');
  };

  return {
    exportToCSV,
    exportToPDF
  };
}
