import { Router } from "express";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { prisma } from "../lib/prisma.js";
import { serializeRecord } from "../utils/serialize.js";

export const exportRouter = Router();

async function loadComplianceRows() {
  const rows = await prisma.compliance.findMany({ orderBy: { dueDate: "asc" } });
  return serializeRecord(rows) as unknown as Array<{
    title: string;
    category: string;
    owner: string;
    dueDate: string;
    status: string;
    priority: string;
  }>;
}

exportRouter.get("/csv", async (_req, res) => {
  const rows = await loadComplianceRows();
  const header = ["Title", "Category", "Owner", "Due Date", "Status", "Priority"];
  const csvLines = [header.join(",")];

  for (const row of rows) {
    const cells = [row.title, row.category, row.owner, row.dueDate.slice(0, 10), row.status, row.priority];
    csvLines.push(cells.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","));
  }

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=compliance-report.csv");
  res.send(csvLines.join("\n"));
});

exportRouter.get("/xlsx", async (_req, res) => {
  const rows = await loadComplianceRows();
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Compliance Report");

  sheet.columns = [
    { header: "Title", key: "title", width: 32 },
    { header: "Category", key: "category", width: 18 },
    { header: "Owner", key: "owner", width: 20 },
    { header: "Due Date", key: "dueDate", width: 14 },
    { header: "Status", key: "status", width: 14 },
    { header: "Priority", key: "priority", width: 12 }
  ];

  sheet.getRow(1).font = { bold: true };

  for (const row of rows) {
    sheet.addRow({ ...row, dueDate: row.dueDate.slice(0, 10) });
  }

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=compliance-report.xlsx");
  await workbook.xlsx.write(res);
  res.end();
});

exportRouter.get("/pdf", async (_req, res) => {
  const rows = await loadComplianceRows();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=compliance-report.pdf");

  const doc = new PDFDocument({ margin: 40, size: "A4" });
  doc.pipe(res);

  doc.fontSize(18).text("Compliance Report", { align: "left" });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor("#555555").text(`Generated ${new Date().toLocaleDateString()}`);
  doc.moveDown(1);
  doc.fillColor("#000000");

  const colX = [40, 220, 340, 420, 480];
  const headers = ["Title", "Owner", "Due Date", "Status", "Priority"];
  doc.fontSize(10).font("Helvetica-Bold");
  headers.forEach((label, index) => doc.text(label, colX[index], doc.y, { continued: index < headers.length - 1 }));
  doc.moveDown(0.5);
  doc.font("Helvetica");

  for (const row of rows) {
    const y = doc.y;
    doc.text(row.title.slice(0, 28), colX[0], y, { width: 170 });
    doc.text(row.owner.slice(0, 18), colX[1], y, { width: 110 });
    doc.text(row.dueDate.slice(0, 10), colX[2], y, { width: 70 });
    doc.text(row.status, colX[3], y, { width: 55 });
    doc.text(row.priority, colX[4], y, { width: 60 });
    doc.moveDown(1);
  }

  doc.end();
});
