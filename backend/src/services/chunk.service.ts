/**
 * Splits text into chunks suitable for LLM processing
 * while preserving sentence boundaries and enforcing
 * strict limits to avoid LLM rate-limit issues.
 */
export const chunkText = (
    text: string,
    options?: {
      maxChunkSize?: number;
      maxChunks?: number;
    }
  ): string[] => {
    if (!text || text.length === 0) return [];
  
    const MAX_CHUNK_SIZE = options?.maxChunkSize ?? 1800; // safer than 2000
    const MAX_CHUNKS = options?.maxChunks ?? 2; // 🔒 CRITICAL limit
  
    const chunks: string[] = [];
    let currentChunk = "";
  
    // Split text into sentences (simple but effective heuristic)
    const sentences = text.split(/(?<=[.!?])\s+/);
  
    for (const sentence of sentences) {
      // Stop early if we already reached max chunks
      if (chunks.length >= MAX_CHUNKS) {
        break;
      }
  
      // Force-split extremely long sentences
      if (sentence.length > MAX_CHUNK_SIZE) {
        if (currentChunk.trim().length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = "";
        }
  
        for (
          let i = 0;
          i < sentence.length && chunks.length < MAX_CHUNKS;
          i += MAX_CHUNK_SIZE
        ) {
          chunks.push(sentence.slice(i, i + MAX_CHUNK_SIZE).trim());
        }
  
        continue;
      }
  
      // Check if adding this sentence exceeds chunk size
      if ((currentChunk + sentence).length > MAX_CHUNK_SIZE) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence + " ";
      } else {
        currentChunk += sentence + " ";
      }
    }
  
    // Push remaining chunk if allowed
    if (
      currentChunk.trim().length > 0 &&
      chunks.length < MAX_CHUNKS
    ) {
      chunks.push(currentChunk.trim());
    }
  
    return chunks;
  };