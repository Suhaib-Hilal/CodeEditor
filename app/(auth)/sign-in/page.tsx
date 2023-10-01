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
      <div className={styles.leftPart}>
        <p className={styles.star}>✦</p>
        <p className={styles.title}>Sign in</p>
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
        <button className={styles.signInBtn} onClick={signIn}>
          Sign in
        </button>
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
          Don't have an account?
          <Link href="/sign-up" className={styles.bold}>
            {" "}
            Sign Up here
          </Link>
        </p>
      </div>
      <Image
        src="/table.jpg"
        width={400}
        height={400}
        alt="cube"
        className={styles.img}
      />
    </div>
  );
}
