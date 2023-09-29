import firebase from "@/app/config/firebase_config";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import User from "../models/user";

const db = getFirestore(firebase);

export default class FirebaseDatabase {
  static async addUser(user: User) {
    await setDoc(doc(db, "users", user.id), user.toMap());
  }
}
