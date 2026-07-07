type ChunkTextInput = {
  text: string;
  chunkSize?: number;
  overlap?: number;
};

export const chunkService = {
  splitTextIntoChunks({
    text,
    chunkSize = 1000,
    overlap = 150,
  }: ChunkTextInput) {
    const cleanText = text.replace(/\s+/g, " ").trim();

    if (!cleanText) {
      return [];
    }

    const chunks: string[] = [];
    let start = 0;

    while (start < cleanText.length) {
      const end = start + chunkSize;
      const chunk = cleanText.slice(start, end).trim();

      if (chunk) {
        chunks.push(chunk);
      }

      start += chunkSize - overlap;
    }

    return chunks;
  },
};
