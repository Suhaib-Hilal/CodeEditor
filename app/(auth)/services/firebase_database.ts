import firebase from "@/app/config/firebase_config";
import {
  getFirestore,
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import User from "../models/user";

const db = getFirestore(firebase);

export default class FirebaseDatabase {
  static async addUser(user: User) {
    await setDoc(doc(db, "users", user.id), user.toMap());
  }

  static async doesUsernameExist(username: string) {
    const usersCollection = collection(db, "users");
    const usernameQuery = query(
      usersCollection,
      where("username", "==", username)
    );
    const querySnap = await getDocs(usernameQuery);
    return !querySnap.empty;
  }
}
