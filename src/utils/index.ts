import {
  compressSync,
  decompressSync,
  strToU8,
  strFromU8,
} from 'fflate';

export function compressTextBrotli(input: string): string {
  const inputBytes = strToU8(input);
  const compressed = compressSync(inputBytes, { level: 9 });
  return btoa(String.fromCharCode(...compressed));
}

export function decompressTextBrotli(encoded: string): string {
  const compressedBytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
  const decompressed = decompressSync(compressedBytes);
  return strFromU8(decompressed);
}