"use client";
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
import GlowableButton from "@/app/components/buttons/glowable_button/glowable_button";
import { correctEmailFormat } from "@/app/utils/abc";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<Message>();

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
    if (!correctEmailFormat(email)) return;

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
          <GlowableButton
            text="Create account"
            disabled={
              correctEmailFormat(email) && password.length >= 10 ? false : true
            }
            onClick={signUp}
            glow={false}
            padding="6px 18px"
            width="82%"
            borderRadius="4px"
          />
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
