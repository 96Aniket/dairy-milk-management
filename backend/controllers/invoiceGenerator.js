const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (bill, items, customer) => {
  const doc = new PDFDocument();

  const filePath = path.join(
    __dirname,
    `../invoices/invoice_${bill.id}.pdf`
  );

  doc.pipe(fs.createWriteStream(filePath));

  // HEADER
  doc.fontSize(20).text("Dairy Milk Wholesale", { align: "center" });
  doc.moveDown();

  // CUSTOMER DETAILS
  doc.fontSize(12).text(`Customer: ${customer.name}`);
  doc.text(`Mobile: ${customer.mobile}`);
  doc.text(`Address: ${customer.address}`);
  doc.moveDown();

  // BILL DETAILS
  doc.text(`Bill ID: ${bill.id}`);
  doc.text(`Date: ${new Date().toLocaleString()}`);
  doc.moveDown();

  // TABLE HEADER
  doc.text("Product   |   Qty   |   Price   |   Total");
  doc.moveDown();

  // ITEMS
  items.forEach((item) => {
    doc.text(
      `${item.name}   |   ${item.quantity}   |   ${item.price}   |   ${
        item.quantity * item.price
      }`
    );
  });

  doc.moveDown();

  // TOTAL
  doc.fontSize(14).text(`Total Amount: ₹${bill.total_amount}`, {
    align: "right",
  });

  doc.end();

  return filePath;
};

module.exports = generateInvoice;