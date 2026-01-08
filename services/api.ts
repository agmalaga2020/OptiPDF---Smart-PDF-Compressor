import axios from 'axios';
import { CompressionConfig, CompressionResult } from '../types';

const API_BASE_URL = 'http://localhost:8000';

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    await axios.get(`${API_BASE_URL}/health`, { timeout: 2000 });
    return true;
  } catch (error) {
    return false;
  }
};

export const compressPdf = async (
  file: File,
  config: CompressionConfig,
  onUploadProgress: (progress: number) => void
): Promise<CompressionResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('quality', config.quality.toString());

  try {
    const response = await axios.post(`${API_BASE_URL}/compress-pdf/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob', // Important for handling binary PDF response
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percentCompleted);
        }
      },
    });

    // Create a local URL for the received blob
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    
    // Get headers for metadata if available, otherwise calculate from blob
    const compressedSize = blob.size;
    
    return {
      originalSize: file.size,
      compressedSize: compressedSize,
      downloadUrl,
      fileName: `compressed_${file.name}`,
    };
  } catch (error: any) {
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Could not connect to the backend server. Is Python running on port 8000?');
    }
    const message = error.response?.data?.detail || error.message || 'Compression failed';
    throw new Error(message);
  }
};