"use client";

import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";
import { useState } from "react";
import FirebaseAuth from "../services/_auth_service";
import { AuthError, isAuthError } from "@/app/errors/auth_error";
import { Message, MessageType } from "../models/message";
import FirebaseDatabase from "../services/firebase_database";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<Message>();

  async function signIn() {
    setMsg(undefined);
    if (!(await FirebaseDatabase.doesUserExist(email, password))) {
      setMsg({
        content: "Invalid email or password",
        type: MessageType.ERROR_MESSAGE,
      });
      return;
    }
    setMsg({
      content: "Loggin you in...",
      type: MessageType.SUCCESS_MESSAGE,
    });
  }

  return (
    <div className={styles.main}>
      <p className={styles.title}>Log in to your account</p>
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
      <p className={styles.mediumText}>{msg?.content}</p>
      <button className={styles.signInBtn} onClick={signIn}>
        Log in
      </button>
      <p className={styles.mediumText}>
        <Link
          href="/reset-password"
          className={`${styles.pageLink} ${styles.forgotPassword}`}
        >
          {" "}
          Forgot password?
        </Link>
      </p>
      <p className={styles.smallText}>
        Don't have an account?
        <Link href="/sign-up" className={styles.pageLink}>
          {" "}
          Sign Up here
        </Link>
      </p>
    </div>
  );
}
