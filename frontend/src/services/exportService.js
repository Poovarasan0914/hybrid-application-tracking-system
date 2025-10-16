import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportService = {
  // Export applications to PDF
  exportToPDF: (applications, title = 'Applications Report') => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(title, 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

    const tableData = applications.map(app => [
      app.jobId?.title || 'N/A',
      app.applicantId?.username || 'N/A',
      app.applicantId?.email || 'N/A',
      app.status,
      new Date(app.submittedAt).toLocaleDateString(),
      app.jobId?.department || 'N/A'
    ]);

    doc.autoTable({
      head: [['Job Title', 'Applicant', 'Email', 'Status', 'Applied Date', 'Department']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save(`${title.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
  },

  // Export applications to Excel
  exportToExcel: (applications, filename = 'applications') => {
    const data = applications.map(app => ({
      'Job Title': app.jobId?.title || 'N/A',
      'Applicant Name': app.applicantId?.username || 'N/A',
      'Email': app.applicantId?.email || 'N/A',
      'Status': app.status,
      'Applied Date': new Date(app.submittedAt).toLocaleDateString(),
      'Department': app.jobId?.department || 'N/A',
      'Job Type': app.jobId?.type || 'N/A',
      'Role Category': app.jobId?.roleCategory || 'N/A',
      'Notes Count': app.notes?.length || 0
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applications');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${filename}_${Date.now()}.xlsx`);
  },

  // Export single application details to PDF
  exportApplicationToPDF: (application, progressTimeline) => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Application Details', 20, 20);
    
    let yPos = 40;
    doc.setFontSize(12);
    doc.text(`Job: ${application.job?.title}`, 20, yPos);
    yPos += 10;
    doc.text(`Applicant: ${application.applicant?.username}`, 20, yPos);
    yPos += 10;
    doc.text(`Email: ${application.applicant?.email}`, 20, yPos);
    yPos += 10;
    doc.text(`Status: ${application.status}`, 20, yPos);
    yPos += 10;
    doc.text(`Applied: ${new Date(application.submittedAt).toLocaleString()}`, 20, yPos);
    yPos += 20;

    if (progressTimeline?.length > 0) {
      doc.setFontSize(14);
      doc.text('Progress Timeline', 20, yPos);
      yPos += 10;

      const timelineData = progressTimeline.map(event => [
        new Date(event.timestamp).toLocaleString(),
        event.title,
        event.description,
        event.user
      ]);

      doc.autoTable({
        head: [['Date', 'Event', 'Description', 'User']],
        body: timelineData,
        startY: yPos,
        styles: { fontSize: 8 }
      });
    }

    doc.save(`application_${application.id}_${Date.now()}.pdf`);
  }
};