import axiosInstance from '../config/axios.config';

export interface UploadResponse {
  url: string;
  key: string;
}

class UploadService {
  async getPresignedUrl(fileName: string, fileType: string, folder?: string): Promise<UploadResponse> {
    try {
      const params: Record<string, string> = {
        fileName,
        fileType
      };
      if (folder) {
        params.folder = folder;
      }

      const response = await axiosInstance.get('/api/v1/upload/presigned-url', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting presigned URL:', error);
      throw error;
    }
  }

  async uploadFileWithPresignedUrl(url: string, file: File): Promise<void> {
    try {
      await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async uploadFile(file: File, folder?: string): Promise<string> {
    try {
      if (!file) {
        throw new Error('File is required');
      }

      // 1. Get presigned URL
      const { url, key } = await this.getPresignedUrl(file.name, file.type, folder);
      
      // 2. Upload file directly to S3 using fetch (since axios doesn't handle binary uploads well)
      await this.uploadFileWithPresignedUrl(url, file);
      
      // 3. Return the S3 object key
      return key;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  }
}

export const uploadService = new UploadService();
