import firebase from "@/app/config/firebase_config";
import {
  getFirestore,
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import User from "../models/user";
import { Password } from "../models/password";

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

  static async doesUserExist(email: string, password: string) {
    const usersCollection = collection(db, "users");
    const emailSnap = query(usersCollection, where("email", "==", email));
    const querySnap = await getDocs(emailSnap);

    if (querySnap.size === 0) {
      console.log("No matching document found.");
      return;
    }

    const userDoc = querySnap.docs[0];
    const userPass = userDoc.get("password");

    return await Password.comparePassword(password, userPass);
  }

  static async resetUserPassword(email: string, password: string) {
    const usersCollection = collection(db, "users");
    const emailSnap = query(usersCollection, where("email", "==", email));
    const querySnap = await getDocs(emailSnap);

    if (querySnap.size === 0) {
      console.log("No matching document found.");
      return;
    }

    const userDoc = doc(db, "users", querySnap.docs[0].id);
    await updateDoc(userDoc, {
      password: password,
    });
  }
}
