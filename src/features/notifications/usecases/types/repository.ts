export interface NotificationRepository {
  find: (name: string) => Promise<object | null>;
  store: (params: StoreParams) => Promise<void>;
  remove: (name: string) => Promise<void>;
}

interface StoreParams {
  name: string;
  value: string;
  httpOnly?: boolean;
  maxAge?: number;
}
