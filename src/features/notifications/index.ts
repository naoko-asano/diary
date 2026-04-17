"use server";

import { notificationRepository } from "@/features/notifications/infrastructure/repository";

import { Notification } from "./model";
import {
  popNotification as sourcePopNotification,
  storeNotification as sourceStoreNotification,
} from "./usecases";

export async function storeNotification(notification: Notification) {
  return await sourceStoreNotification(notification, notificationRepository);
}

export async function popNotification() {
  return await sourcePopNotification(notificationRepository);
}
