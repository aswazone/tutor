import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Button, buttonVariants } from "../ui/button";
import { Bell, CheckCheck, Trash } from "lucide-react";
import { env } from "@/config/env.config";
import { useSocketNotifications } from "@/hooks/useNotifications";
import { NotificationPayload } from "@/types/notification.type";

const NotificationButton = () => {
  const  { 
    notifications,
    unReadCount, 
    handleDeleteNotification,
    handleMarkAllAsRead,
    handleMarkAsRead
   } = useSocketNotifications(env.API_URL);

   const notificationType = (type: NotificationPayload['type']) => {
     switch (type) {
       case 'REVENUE_EARNED':
         return 'Revenue Earned';
       case 'COURSE_PURCHASED':
         return 'Course Purchased';
       case 'COURSE_APPROVED':
         return 'Check Now';
       case 'COURSE_DECLINED':
         return 'Course Declined';
       case 'COURSE_ENABLED':
         return 'Check Now';
       case 'COURSE_DISABLED':
         return 'Ask Tutor';
       case 'COURSE_CREATION':
         return 'Check Now';
       case 'COURSE_BLOCKED':
         return 'Ask Tutor';
       case 'INTERVIEW_CREATION':
         return 'Try Now';
       case 'NEW_MESSAGE':
         return 'Check it';
     }
   }

   const notificationLink = (type: NotificationPayload['type'], relatedId: string) => {
     switch (type) {
       case 'COURSE_APPROVED':
         return `/profile`;
       case 'COURSE_DECLINED':
         return `/course/${relatedId}`;
       case 'COURSE_ENABLED':
         return `/course/${relatedId}`;
       case 'COURSE_DISABLED':
         return `/chat`;
       case 'COURSE_CREATION':
         return `/courses`;
       case 'COURSE_BLOCKED':
         return `/chat`;
       case 'INTERVIEW_CREATION':
         return `/interview/${relatedId}`;
     }
   }

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger>
        <div className="relative cursor-pointer">
          <span className={buttonVariants({ variant: "ghost" })}>
            <Bell className="w-5 h-5" />
          </span>

          {unReadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unReadCount}
            </span>
          )}
        </div>
      </HoverCardTrigger>

      <HoverCardContent className="w-80 p-0">
        <div className="flex flex-col divide-y divide-border">
          <div className="flex items-center justify-between p-4">
            <h4 className="font-semibold">Notifications</h4>
            <Button
              disabled={notifications.length === 0}
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-primary"
              onClick={() => handleMarkAllAsRead()}
            >
              Mark all as read
            </Button>
          </div>

          <div className="flex flex-col divide-y divide-border max-h-[300px] overflow-auto">
            {notifications.length > 0 ? (
              notifications.map((notification, i) => (
                <div
                  key={i}
                  className={`flex gap-4 p-4 hover:bg-accent/50 cursor-pointer transition-colors ${
                    !notification.isRead ? "bg-accent/20" : ""
                  }`}
                >
                  <div
                    className={`mt-1 h-2 w-2 flex-none rounded-full ${
                      !notification.isRead ? "bg-sky-500" : "bg-transparent"
                    }`}
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {!notification.isRead && <div className="p-1 rounded-full border"  onClick={() => handleMarkAsRead(notification._id)}>
                          <CheckCheck className="h-4 w-4 text-muted-foreground hover:text-primary"/>
                        </div>}
                        <div className="p-1 rounded-full border"  onClick={() => handleDeleteNotification(notification._id)}>
                          <Trash className="h-4 w-4 text-red-500 hover:text-primary"/>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <div>
                      <a href={notificationLink(notification.type, notification.relatedId as string)} className="bg-muted px-2 py-1 text-xs rounded hover:text-sky-500">{notificationType(notification.type)}</a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center p-4">
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default NotificationButton;
