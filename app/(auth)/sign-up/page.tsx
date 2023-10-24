"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { useState } from "react";
import FirebaseAuth from "../services/_auth_service";
import { AuthError, isAuthError } from "@/app/errors/auth_error";
import FirebaseDatabase from "../services/firebase_database";
import User from "../models/user";
import { UserCredential } from "firebase/auth";
import { Password } from "../models/password";
import { Message, MessageType } from "../models/message";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<Message>();
  const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

  function correctEmailFormat() {
    if (!email) return false;
    return email.match(emailRegex);
  }

  async function firebaseAuthSignUp() {
    const res = await FirebaseAuth.signUpWithEmailAndPassword(email, password);
    if (isAuthError(res)) {
      setMsg({
        content: (res as AuthError).message,
        type: MessageType.ERROR_MESSAGE,
      });
      return "FAILED";
    }
    setMsg(undefined);
    return res;
  }

  async function signUp() {
    const res = await firebaseAuthSignUp();
    if (res === "FAILED") return;
    if (!correctEmailFormat()) return;

    const user = new User(
      (res as UserCredential).user.uid,
      email,
      await Password.hashPassword(password)
    );
    await FirebaseDatabase.addUser(user);
  }

  return (
    <main className={styles.main}>
      <div className={styles.rightPart}>
        <div className={styles.signInPart}>
          <p className={styles.title}>Create an account</p>
            <input
              type="email"
              placeholder="Email"
              className={styles.textField}
              value={email}
              onChange={(e) => {
                setEmail(e.currentTarget.value);
              }}
            />
          <input
            type="password"
            placeholder="Password"
            className={styles.textField}
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value);
            }}
          />
          {correctEmailFormat() ? (
          <button onClick={signUp} className={styles.createAccountBtn}>
            Create account
          </button>
        ) : (
          <button disabled className={styles.createAccountBtn}>
            Create account
          </button>
        )}
          {msg && (
            <p
              className={
                msg.type == MessageType.ERROR_MESSAGE
                  ? styles.errorMsg
                  : styles.successMsg
              }
            >
              {msg.content}
            </p>
          )}
          <p className={styles.smallText}>
            Already have an account?
            <span className={styles.bold}>
              <Link href="/sign-in"> Sign in</Link>
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
