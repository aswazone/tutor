import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Button, buttonVariants } from "../ui/button";
import { Bell, CheckCheck, Trash } from "lucide-react";
import { env } from "@/config/env.config";
import { useSocketNotifications } from "@/hooks/useNotifications";

const NotificationButton = () => {
  const  { 
    notifications,
    unReadCount, 
    handleDeleteNotification,
    handleMarkAllAsRead,
    handleMarkAsRead
   } = useSocketNotifications(env.API_URL);

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
