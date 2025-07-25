import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Button, buttonVariants } from "../ui/button";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { env } from "@/config/env.config";
import { Notification } from "@/types/notification.type";

const NotificationButton = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { emit, on, off } = useSocket(env.API_URL, user?._id);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0Some of the I just checked on some of my task so due to I can't complete my own data and also related to that some of the areas in my. Prosthetic is still crashing. I want to recover all that, so I'm expecting. It's not a good review. Rajasthan CMS. Monolithic and.);

  console.log(notifications)

  useEffect(() => {
    if (!user) return;

    emit("getNotifications", user._id);

    const handleNewNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleExistingNotifications = (existing: Notification[]) => {
      setNotifications(existing);
      const unread = existing.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    };

    on("newNotification", handleNewNotification);
    on("notifications", handleExistingNotifications);

    return () => {
      off("newNotification", handleNewNotification);
      off("notifications", handleExistingNotifications);
    };
  }, [user?._id]); // Keep deps minimal to avoid resubscription issues

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger>
        <div className="relative cursor-pointer">
          <span className={buttonVariants({ variant: "ghost" })}>
            <Bell className="w-5 h-5" />
          </span>

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount}
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
              onClick={() => {
                emit("markAllNotificationsRead", user?._id);
                setNotifications((prev) =>
                  prev.map((n) => ({ ...n, isRead: true }))
                );
                setUnreadCount(0);
              }}
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
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
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
