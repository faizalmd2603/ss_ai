import * as XLSX from "xlsx";
import type { ScreenshotAnalysis } from "../types/screenshot";

export class XlsxExporter {
  async export(records: ScreenshotAnalysis[]): Promise<Buffer> {
    const rows = records.map((record) => ({
      id: record.screenshot.id,
      filename: record.screenshot.metadata.originalFileName ?? "",
      sourceType: record.screenshot.sourceType,
      sourceRef: record.screenshot.sourceRef,
      storagePath: record.screenshot.storagePath ?? "",
      description: record.screenshot.metadata.description ?? "",
      tags: record.screenshot.metadata.tags?.join(", ") ?? "",
      ocrText: record.ocr.text ?? "",
      sourceName: record.source.sourceName ?? "",
      sourceUrl: record.source.sourceUrl ?? "",
      categories: record.tagging.categories.join(", "),
      labels: record.tagging.labels.join(", "),
      processedAt: record.processedAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Screenshots");

    return XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    }) as Buffer;
  }
}
