import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // Create a new PDF document
    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    // Collect data into a buffer
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    
    // Create a promise to wait for the PDF to be fully generated
    const pdfPromise = new Promise<Buffer>((resolve) => {
      doc.on("end", () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });
    });

    // Add styling and text to the PDF
    doc.fontSize(20).font("Helvetica-Bold").text("Tailored Resume", { align: "center" });
    doc.moveDown(2);
    
    doc.fontSize(12).font("Helvetica").text(text, {
      align: "left",
      lineGap: 4
    });

    // Finalize the PDF
    doc.end();

    // Wait for PDF generation
    const pdfBuffer = await pdfPromise;

    // Return the generated PDF as a response
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="tailored-resume.pdf"',
      },
    });

  } catch (error: any) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate PDF", details: error.message }, { status: 500 });
  }
}
