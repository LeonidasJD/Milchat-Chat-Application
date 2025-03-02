export interface SingleUser {
  id: string;
  email: string;
  name: string;
  isOnline: boolean;
}

export type UsersList = SingleUser[];
