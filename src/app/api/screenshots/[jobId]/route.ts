import { NextRequest } from "next/server";
import { getServerRuntime } from "@/server/runtime";
import { XlsxExporter } from "@/server/exports/xlsxExporter";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const { jobId } = await params;
    const { repository } = await getServerRuntime();

    const record = await repository.findById(jobId);

    if (!record) {
      return new Response(JSON.stringify({ error: "Screenshot record not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const exporter = new XlsxExporter();
    const buffer = await exporter.export([record]);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="screenshot-${jobId}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("[GET /api/screenshots/[jobId]/export/xlsx]", error);

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
