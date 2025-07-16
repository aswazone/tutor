export interface ChatRoomDTO {
    id: string,
    name: string,
    type: string,
    participants:[string],
    unreadCount: number
}