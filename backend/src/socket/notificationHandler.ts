// import { notificationService } from "@/dependencies/notification.di";
// import { AuthenticatedSocket } from "./socketHandler";

// export const setupNotificationHandlers = (socket: AuthenticatedSocket) => {
//   socket.on('getNotifications', async (userId: string) => {
//     // console.log('getNotifications-->', userId);
//     const notifications = await notificationService.getUserNotifications(userId);
//     // console.log('notifications', notifications);
//     socket.emit('notifications', notifications);
//   });

//   socket.on('markNotificationRead', async ({ userId, notificationId }) => {
//     await notificationService.markAsRead(userId, notificationId);
//     socket.emit('notificationRead', notificationId);
//   });

//   socket.on('markAllNotificationsRead', async (userId: string) => {
//     await notificationService.markAllRead(userId);
//     socket.emit('allNotificationsRead', userId);
//   });
// };