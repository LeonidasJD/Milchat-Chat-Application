export interface SingleUser {
  id: string;
  email: string;
  name: string;
  isOnline: boolean;
  status?: string; // "connected" or "disconnected"
}

export type UsersList = SingleUser[];
