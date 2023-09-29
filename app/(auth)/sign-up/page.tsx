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

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function signUp() {
    const res = await FirebaseAuth.signUpWithEmailAndPassword(email, password);
    if (isAuthError(res)) {
      setErrorMsg((res as AuthError).message);
      return;
    }
    setErrorMsg("");
    const user = new User(
      (res as UserCredential).user.uid,
      username,
      email,
      await Password.hashPassword(password),
    );
    await FirebaseDatabase.addUser(user);
  }

  return (
    <main className={styles.main}>
      <Image
        src="/table.jpg"
        width={400}
        height={400}
        alt="img"
        className={styles.img}
      />
      <div className={styles.rightPart}>
        <p className={styles.star}>✦</p>
        <div className={styles.signInPart}>
          <p className={styles.title}>Sign up for an account</p>
          <div className={styles.signUpOptions}>
            <div className={styles.signUpOption}>Sign up with Apple</div>
            <div className={styles.signUpOption}>Sign up with Google</div>
          </div>
          <input
            type="text"
            placeholder="Username"
            className={styles.textField}
            value={username}
            onChange={(e) => {
              setUsername(e.currentTarget.value);
            }}
          />
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
          <button className={styles.createAccountBtn} onClick={signUp}>
            Create account
          </button>
          <p className={styles.errorMsg}>{errorMsg}</p>
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
