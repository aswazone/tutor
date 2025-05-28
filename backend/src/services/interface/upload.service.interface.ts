export interface IUploadService {
    getPresignedUrl(fileName: string, fileType: string): Promise<{ url: string; key: string }>
}
