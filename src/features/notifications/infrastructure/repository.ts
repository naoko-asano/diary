import { Notification } from "@/features/notifications/model";
import { deleteCookie, getCookie, setCookie } from "@/infrastructure/cookie";

const NAME = "notification";

async function find(): Promise<unknown> {
  const value = (await getCookie(NAME))?.value;
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    await remove();
    return null;
  }
}

async function store(notification: Notification) {
  await setCookie({
    name: NAME,
    value: JSON.stringify(notification),
  });
}

async function remove() {
  await deleteCookie(NAME);
}

export const notificationRepository = {
  find,
  store,
  remove,
};
