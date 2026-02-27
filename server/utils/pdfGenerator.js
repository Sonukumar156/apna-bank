const PDFDocument = require('pdfkit');

exports.generateReceiptPDF = (transaction, user) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Header - Logo Area
            doc.rect(0, 0, 612, 120).fill('#0f172a');
            doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold').text('APNA SOCIETY', 50, 45);
            doc.fontSize(10).font('Helvetica').text('Official Payment Receipt', 50, 75);

            // Receipt Info
            doc.fillColor('#334155').fontSize(10).font('Helvetica-Bold').text('RECEIPT NO:', 400, 150);
            doc.font('Helvetica').text(transaction.transactionId, 500, 150);

            doc.font('Helvetica-Bold').text('DATE:', 400, 165);
            doc.font('Helvetica').text(new Date().toLocaleDateString('en-IN'), 500, 165);

            // Bill To
            doc.fillColor('#0f172a').fontSize(14).font('Helvetica-Bold').text('Bill To:', 50, 150);
            doc.fontSize(12).text(user.name, 50, 170);
            doc.fontSize(10).font('Helvetica').fillColor('#64748b').text(`Email: ${user.email}`, 50, 185);
            doc.text(`Mobile: ${user.mobile}`, 50, 200);
            doc.text(`Member ID: ${user.regNo}`, 50, 215);

            // Table Header
            doc.rect(50, 260, 512, 30).fill('#f8fafc');
            doc.fillColor('#475569').fontSize(10).font('Helvetica-Bold').text('DESCRIPTION', 65, 272);
            doc.text('AMOUNT', 500, 272, { align: 'right' });

            // Table Content
            doc.fillColor('#0f172a').fontSize(11).font('Helvetica').text(transaction.type, 65, 310);
            doc.fontSize(10).fillColor('#64748b').text(transaction.description || 'No description provided', 65, 325);
            doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text(`Rs. ${transaction.amount.toLocaleString()}`, 400, 310, { align: 'right', width: 150 });

            // Line
            doc.moveTo(50, 360).lineTo(562, 360).stroke('#e2e8f0');

            // Total Section
            doc.fontSize(12).font('Helvetica-Bold').text('TOTAL AMOUNT PAID', 300, 380);
            doc.fillColor('#2563eb').fontSize(18).text(`Rs. ${transaction.amount.toLocaleString()}`, 400, 400, { align: 'right', width: 150 });

            // Footer
            doc.fillColor('#94a3b8').fontSize(9).font('Helvetica-Oblique').text('This is a computer generated receipt and does not require a physical signature.', 50, 700, { align: 'center' });
            doc.text('© 2026 APNA SOCIETY Management System', 50, 715, { align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};
