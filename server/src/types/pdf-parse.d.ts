declare module "pdf-parse" {
  type PDFParseResult = {
    numpages: number;
    numrender: number;
    info: Record<string, unknown>;
    metadata: unknown;
    text: string;
    version: string;
  };

  function pdfParse(dataBuffer: Buffer): Promise<PDFParseResult>;

  export default pdfParse;
}
