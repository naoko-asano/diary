import { Notification } from "@/features/notifications/model";

export interface NotificationRepository {
  find: () => Promise<unknown>;
  store: (notification: Notification) => Promise<void>;
  remove: () => Promise<void>;
}
