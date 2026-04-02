import { assertNotification, Notification } from "../model";

import { NotificationRepository } from "./types/repository";

const NAME = "notification";

export function storeNotification(
  notification: Notification,
  repository: NotificationRepository,
) {
  return repository.store({
    name: NAME,
    value: JSON.stringify(notification),
    httpOnly: true,
    maxAge: 30,
  });
}

export async function popNotification(repository: NotificationRepository) {
  const notification = await findNotification(repository);
  if (!notification) return null;
  await removeNotification(repository);
  return notification;
}

async function findNotification(repository: NotificationRepository) {
  const notification = await repository.find(NAME);
  if (!notification) return null;
  assertNotification(notification);
  return notification;
}

async function removeNotification(repository: NotificationRepository) {
  return repository.remove(NAME);
}
