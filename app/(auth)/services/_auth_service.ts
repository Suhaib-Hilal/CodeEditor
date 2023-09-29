import {
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import firebase from "../../config/firebase_config";
import { AuthError } from "../../errors/auth_error";

export default class FirebaseAuth {
  static authInstance = getAuth(firebase);

  static async signUpWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<UserCredential | AuthError> {
    try {
      return await createUserWithEmailAndPassword(
        FirebaseAuth.authInstance,
        email,
        password
      );
    } catch (error) {
      return error as AuthError;
    }
  }

  static async signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<UserCredential | AuthError> {
    try {
      return await signInWithEmailAndPassword(
        FirebaseAuth.authInstance,
        email,
        password
      );
    } catch (error) {
      return error as AuthError;
    }
  }
}
