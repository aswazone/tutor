import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import { useSocket } from "@/components/hooks/useSocket";
import { NotificationPayload } from "@/types/notification.type";
import axiosInstance from "@/config/axios.config";




export const useSocketNotifications = (serverUrl: string) => {
  const { user } = useAuth();
  const { on, off } = useSocket(serverUrl, user?._id);
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [unReadCount, setUnreadCount] = useState(0);
  const getAllNotifications = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  const getUnreadCount = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/notifications/unread-count');
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }

  useEffect(()=>{
    getUnreadCount();
    getAllNotifications();
  },[])

  useEffect(() => {

    const handleNewNotification = (notification: NotificationPayload) => {
      const type = notification.type;

      console.log('reaching here');
      if (!type) {
        console.warn("[Socket] No type in notification", notification);
        return;
      }
      getAllNotifications();
      getUnreadCount();

      const linkTo = (url: string) => () => (window.location.href = url);

      switch (type) {
        case "REVENUE_EARNED":
          toast.success("💰 Revenue Earned!", {
            description: notification.message,
            action: {
              label: "View Wallet",
              onClick: linkTo(
                user?.role === "ADMIN"
                  ? "/admin/wallet"
                  : "/instructor/wallet"
              ),
            },
          });
          break;

        case "COURSE_PURCHASED":
          toast.success("🎉 Course Purchased!", {
            description: notification.message,
            action: { label: "Start Learning", onClick: linkTo("/my-courses") },
          });

          break; //tutor only

        case "COURSE_APPROVED":
          toast.success("✅ Course Approved!", {
            description: notification.message,
            action: {
              label: "View Course",
              onClick: linkTo(`/profile?notificationId=${notification.relatedId}`),
            },
          });
          break; //tutor only(if drafted)

        case "COURSE_DECLINED":
          toast.error("❌ Course Declined", {
            description: notification.message,
            action: {
              label: "View Course",
              onClick: linkTo(`/profile?notificationId=${notification.relatedId}`),
            },
          });
          break; //tutor only

				case "COURSE_ENABLED":
					toast.success(notification.title, {
						description: notification.message,
						duration: 5000,
						action: {
							label: "View Course",
							onClick: () => {
								if (notification.relatedId) {
									const coursePath =
										user?.role === "TUTOR"
											? `profile?notificationId=${notification.relatedId}`
											: `/instructor/courses/${notification.relatedId}`;
									window.location.href = coursePath;
								}
							},
						},
					});
          
					break; //user

        case "COURSE_DISABLED":
          toast.error(notification.title, {
            description: notification.message,
            duration: 5000,
            action: {
              label: "View Course",
              onClick: () => {
                if (notification.relatedId) {
                  const coursePath =
                    user?.role === "TUTOR"
                      ? `profile?notificationId=${notification.relatedId}`
                      : `/instructor/courses/${notification.relatedId}`;
                  window.location.href = coursePath;
                }
              },
            },
          });
          break; //user

        case "COURSE_BLOCKED":
          toast.warning("⚠ Course Disabled", {
            description: notification.message,
            duration: 8000,
            action: {
              label: "View Course",
              onClick: () => {
                if (notification.relatedId) {
                  const coursePath =
                    user?.role === "TUTOR"
                    ? `/profile?notificationId=${notification.relatedId}`
                    : `/my-courses?notificationId=${notification.relatedId}`;
                  window.location.href = coursePath;
                }
              },
            },
          });
          break; //user and tutor

        case 'INTERVIEW_CREATION':
          toast.success(notification.title, {
            description: notification.message,
            duration: 5000,
            action: {
              label: "Try Now",
              onClick: () => {
                if (notification.relatedId) {
                  const interviewPath = `/interviews/${notification.relatedId}`;
                  window.location.href = interviewPath;
                }
              },
            },
          });
          break; //user

        case "NEW_MESSAGE":
          toast.info("💬 New Message", {
            description: notification.message,
            action: { label: "View Chat", onClick: linkTo("/chat") },
          });
          break;

        // case "TUTOR_APPROVED":
        //   toast.success("🎉 Instructor Approved!", {
        //     description: notification.message,
        //   });
        //   break;

        // case "TUTOR_DECLINED":
        //   toast.error("❌ Instructor Declined", {
        //     description: notification.message,
        //     action: { label: "Reapply", onClick: linkTo("/instructor/apply") },
        //   });
        //   break;

        default:
          toast.info("🔔 New Notification", {
            description: notification.message,
          });
      }
    };

    on("newNotification", handleNewNotification);
    return () => {
      off("newNotification", handleNewNotification);
    };
  }, [user?.id, user?.role, on, off]);


  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await axiosInstance.patch(`/api/v1/notifications/read/${notificationId}`);
      if(response){
        getAllNotifications();
        getUnreadCount();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await axiosInstance.patch(`/api/v1/notifications/read-all`);
      if(response){
        getAllNotifications();
        getUnreadCount();
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const response = await axiosInstance.delete(`/api/v1/notifications/${notificationId}`);
      if(response){
        getAllNotifications();
        getUnreadCount();
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return { 
    notifications, 
    unReadCount, 
    handleMarkAsRead, 
    handleMarkAllAsRead, 
    handleDeleteNotification 
  };
};
