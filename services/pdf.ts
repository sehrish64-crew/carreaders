import PDFDocument from "pdfkit";

export async function buildAnalysisPdf(
  analysis: {
    id: string;
    conditionScore: number;
    riskLevel: string;
    analysisStatus: string;
    createdAt: Date;
    analysisPdfUrl?: string | null;
  },
  vehicleName: string,
  imageUrls: string[],
  issues: Array<{
    title: string;
    severity: string;
    confidence: number;
    repairEstimate: string;
    riskLevel: string;
    hidden: boolean;
  }>,
  summary?: string,
) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks: Uint8Array[] = [];

  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  doc.on("error", (error: Error) => {
    throw error;
  });

  doc.fontSize(20).fillColor("#0f172a").text("Car Readers", { align: "left" });
  doc.moveDown(0.5);
  doc.fontSize(14).fillColor("#475569").text("AI Vehicle Diagnostics & Inspection Summary", { align: "left" });
  doc.moveDown(1);

  doc.fontSize(16).fillColor("#0f172a").text(`Analysis ID: ${analysis.id}`);
  doc.fontSize(12).fillColor("#64748b").text(`Generated: ${analysis.createdAt.toISOString().split("T")[0]}`);
  doc.moveDown(1);

  doc.fillColor("#0f172a").fontSize(14).text("Vehicle Information", { underline: true });
  doc.fontSize(12).fillColor("#334155").text(`Vehicle: ${vehicleName}`);
  doc.text(`Status: ${analysis.analysisStatus}`);
  doc.text(`Condition Score: ${analysis.conditionScore}%`);
  doc.text(`Risk Level: ${analysis.riskLevel}`);
  doc.moveDown(1);

  if (summary) {
    doc.fillColor("#0f172a").fontSize(14).text("Diagnostics Summary", { underline: true });
    doc.fontSize(11).fillColor("#334155").text(summary, { lineGap: 4 });
    doc.moveDown(1);
  }

  doc.fillColor("#0f172a").fontSize(14).text("Captured Images", { underline: true });
  doc.moveDown(0.5);

  for (const imageUrl of imageUrls.slice(0, 4)) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) continue;
      const buffer = Buffer.from(await response.arrayBuffer());
      const x = doc.x;
      const y = doc.y;
      doc.image(buffer, {
        fit: [250, 150],
        align: "center",
        valign: "center",
      });
      doc.moveDown(0.5);
    } catch {
      continue;
    }
  }

  doc.addPage();
  doc.fillColor("#0f172a").fontSize(14).text("AI Vehicle Findings", { underline: true });
  doc.moveDown(0.5);

  issues.forEach((issue, index) => {
    const marker = issue.hidden ? "(locked)" : "";
    doc.fontSize(12).fillColor(issue.hidden ? "#94a3b8" : "#0f172a").text(`${index + 1}. ${issue.title} ${marker}`);
    doc.fontSize(10).fillColor("#334155").text(`Severity: ${issue.severity} | Risk: ${issue.riskLevel} | Confidence: ${issue.confidence}% | Estimate: ${issue.repairEstimate}`, {
      indent: 18,
      lineGap: 2,
    });
    doc.moveDown(0.5);
  });

  doc.addPage();
  doc.fillColor("#0f172a").fontSize(14).text("Repair & Risk Breakdown", { underline: true });
  doc.moveDown(0.5);

  issues.forEach((issue, index) => {
    if (issue.hidden) {
      doc.fontSize(11).fillColor("#94a3b8").text(`${index + 1}. Hidden details available for paid subscribers.`, {
        indent: 12,
      });
      doc.moveDown(0.25);
      return;
    }

    doc.fontSize(12).fillColor("#0f172a").text(`${index + 1}. ${issue.title}`);
    doc.fontSize(11).fillColor("#334155").text(`Repair Estimate: ${issue.repairEstimate}`);
    doc.text(`Severity: ${issue.severity} | Risk Level: ${issue.riskLevel} | Confidence: ${issue.confidence}%`);
    doc.moveDown(0.5);
  });

  doc.addPage();
  doc.fillColor("#0f172a").fontSize(14).text("Vehicle Health Summary", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor("#334155").text(
    "This document includes premium AI Vehicle Diagnostics and AI Analysis Results for the vehicle. Hidden insights remain protected until unlock.",
    {
      lineGap: 4,
    },
  );

  doc.end();

  const result = await new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  return result;
}
