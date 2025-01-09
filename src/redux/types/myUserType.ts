export interface MyUser {
  displayName: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
  phoneNumber: string;
  photoURL: string;
  uid: string;
}
