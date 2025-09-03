export interface NotificationPayload {
  _id: string;
  title: string;
  message: string;
  userId: string;
  isRead: boolean;
  type:
    | 'REVENUE_EARNED'
    | 'COURSE_PURCHASED'
    | 'COURSE_APPROVED'
    | 'COURSE_DECLINED'
    | 'COURSE_ENABLED'
    | 'COURSE_DISABLED'
    | 'COURSE_CREATION'
    | 'COURSE_BLOCKED'
    | 'INTERVIEW_CREATION'
    | 'NEW_MESSAGE';
  relatedId?: string;
  courseTitle?: string;
  amount?: number;
}