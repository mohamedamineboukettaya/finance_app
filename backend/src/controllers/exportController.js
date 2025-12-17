import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';

const prisma = new PrismaClient();

export const exportTransactionsPDF = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // Build filter
    const where = {
      userId: req.user.id
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Get summary
    const incomeResult = await prisma.transaction.aggregate({
      where: { ...where, type: 'income' },
      _sum: { amount: true }
    });

    const expenseResult = await prisma.transaction.aggregate({
      where: { ...where, type: 'expense' },
      _sum: { amount: true }
    });

    const totalIncome = Number(incomeResult._sum.amount || 0);
    const totalExpenses = Number(expenseResult._sum.amount || 0);
    const balance = totalIncome - totalExpenses;

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=transactions-${Date.now()}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add content to PDF
    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('SereniCash', { align: 'center' });
    doc.fontSize(16).font('Helvetica').text('Transaction Report', { align: 'center' });
    doc.moveDown();

    // User info
    doc.fontSize(12).text(`User: ${req.user.name || req.user.email}`);
    doc.text(`Generated: ${new Date().toLocaleString()}`);
    
    if (startDate || endDate) {
      const dateRange = `${startDate ? new Date(startDate).toLocaleDateString() : 'Beginning'} - ${endDate ? new Date(endDate).toLocaleDateString() : 'Now'}`;
      doc.text(`Period: ${dateRange}`);
    }
    
    doc.moveDown();

    // Summary Section
    doc.fontSize(16).font('Helvetica-Bold').text('Financial Summary');
    doc.moveDown(0.5);

    const summaryY = doc.y;
    
    // Income box
    doc.rect(50, summaryY, 150, 80).fillAndStroke('#d4edda', '#28a745');
    doc.fillColor('#000').fontSize(12).text('Total Income', 60, summaryY + 15);
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#28a745').text(`$${totalIncome.toFixed(2)}`, 60, summaryY + 40);

    // Expense box
    doc.rect(220, summaryY, 150, 80).fillAndStroke('#f8d7da', '#dc3545');
    doc.fillColor('#000').fontSize(12).font('Helvetica').text('Total Expenses', 230, summaryY + 15);
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#dc3545').text(`$${totalExpenses.toFixed(2)}`, 230, summaryY + 40);

    // Balance box
    doc.rect(390, summaryY, 150, 80).fillAndStroke('#d1ecf1', '#17a2b8');
    doc.fillColor('#000').fontSize(12).font('Helvetica').text('Balance', 400, summaryY + 15);
    doc.fontSize(20).font('Helvetica-Bold').fillColor(balance >= 0 ? '#17a2b8' : '#dc3545').text(`$${balance.toFixed(2)}`, 400, summaryY + 40);

    doc.y = summaryY + 100;
    doc.moveDown(2);

    // Transactions Section
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#000').text('Transaction Details');
    doc.moveDown();

    if (transactions.length === 0) {
      doc.fontSize(12).font('Helvetica').text('No transactions found for this period.');
    } else {
      // Table header
      const tableTop = doc.y;
      doc.fontSize(10).font('Helvetica-Bold');
      
      doc.text('Date', 50, tableTop);
      doc.text('Type', 120, tableTop);
      doc.text('Category', 180, tableTop);
      doc.text('Description', 280, tableTop);
      doc.text('Amount', 480, tableTop);

      doc.moveTo(50, tableTop + 15).lineTo(540, tableTop + 15).stroke();

      doc.moveDown();

      // Table rows
      doc.font('Helvetica').fontSize(9);
      
      transactions.forEach((transaction, i) => {
        const y = doc.y;

        // Check if we need a new page
        if (y > 700) {
          doc.addPage();
          doc.y = 50;
        }

        const currentY = doc.y;

        doc.text(new Date(transaction.date).toLocaleDateString(), 50, currentY);
        
        doc.fillColor(transaction.type === 'income' ? '#28a745' : '#dc3545')
           .text(transaction.type.toUpperCase(), 120, currentY);
        
        doc.fillColor('#000')
           .text(transaction.category?.name || 'None', 180, currentY, { width: 90 });
        
        doc.text(transaction.description || '-', 280, currentY, { width: 190 });
        
        doc.fillColor(transaction.type === 'income' ? '#28a745' : '#dc3545')
           .text(`${transaction.type === 'income' ? '+' : '-'}$${Number(transaction.amount).toFixed(2)}`, 480, currentY);

        doc.fillColor('#000');
        doc.moveDown(0.8);

        // Draw separator line
        if (i < transactions.length - 1) {
          doc.moveTo(50, doc.y).lineTo(540, doc.y).strokeOpacity(0.2).stroke().strokeOpacity(1);
          doc.moveDown(0.3);
        }
      });
    }

    // Footer
    doc.fontSize(8).fillColor('#666').text(
      'Generated by SereniCash - Your Personal Budget Manager',
      50,
      doc.page.height - 50,
      { align: 'center' }
    );

    // Finalize PDF
    doc.end();

  } catch (error) {
    next(error);
  }
};