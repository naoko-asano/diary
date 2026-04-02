"use server";

import { cookieRepository } from "@/infrastructure/cookie";

import { Notification } from "./model";
import {
  popNotification as sourcePopNotification,
  storeNotification as sourceStoreNotification,
} from "./usecases";

export async function storeNotification(notification: Notification) {
  return await sourceStoreNotification(notification, cookieRepository);
}

export async function popNotification() {
  return await sourcePopNotification(cookieRepository);
}
