export interface CompressionResult {
  originalSize: number;
  compressedSize: number;
  downloadUrl: string; // Blob URL or API URL
  fileName: string;
}

export interface CompressionError {
  message: string;
  code?: string;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  COMPRESSING = 'COMPRESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface CompressionConfig {
  quality: number; // 1-100
}