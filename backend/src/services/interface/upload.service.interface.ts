export interface UploadServiceIF {
    getPresignedUrl(fileName: string, fileType: string): Promise<{ url: string; key: string }>
}
