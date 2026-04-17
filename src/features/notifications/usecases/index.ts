import {
  assertNotification,
  Notification,
} from "@/features/notifications/model";

import { NotificationRepository } from "./types/repository";

export function storeNotification(
  notification: Notification,
  repository: NotificationRepository,
) {
  return repository.store(notification);
}

export async function popNotification(repository: NotificationRepository) {
  const notification = await getValidNotification(repository);
  if (!notification) return null;
  await repository.remove();
  return notification;
}

async function getValidNotification(repository: NotificationRepository) {
  const notification = await repository.find();
  if (!notification) return null;
  try {
    assertNotification(notification);
    return notification;
  } catch {
    await repository.remove();
    return null;
  }
}
