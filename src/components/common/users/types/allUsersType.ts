export interface SingleUser {
  id: string;
  email: string;
  name: string;
  isOnline: boolean;
  status: string;
}

export type UsersList = SingleUser[];
