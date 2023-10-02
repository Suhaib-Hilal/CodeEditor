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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<Message>();
  const [otpText, setOtpText] = useState("");
  const [expectedOtp, setExpectedOtp] = useState("");

  async function usernameIsFine(): Promise<boolean> {
    const usernameExists = await FirebaseDatabase.doesUsernameExist(username);
    if (usernameExists) {
      setMsg({
        content: "Username already taken",
        type: MessageType.ERROR_MESSAGE,
      });
    } else if (username === "") {
      setMsg({
        content: "Username must not be empty!",
        type: MessageType.ERROR_MESSAGE,
      });
    }
    return false;
  }

  function otpIsCorrect(): boolean {
    if (otpText === expectedOtp) {
      setMsg({
        content: "You are all set!",
        type: MessageType.SUCCESS_MESSAGE,
      });
      return true;
    }
    return false;
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
    
    if (!((await usernameIsFine()) && otpIsCorrect())) return;

    const user = new User(
      (res as UserCredential).user.uid,
      username,
      email,
      await Password.hashPassword(password)
    );
    await FirebaseDatabase.addUser(user);
  }

  async function sendOtp() {
    const res = await fetch("/api/verification", {
      method: "POST",
      body: JSON.stringify({ email: email }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const data = await res.json();
    if (res.status != 200) {
      setMsg({ content: data.error, type: MessageType.ERROR_MESSAGE });
      return;
    }
    setMsg({ content: "OTP Sent", type: MessageType.SUCCESS_MESSAGE });
    setExpectedOtp(data);
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
          <input
            type="text"
            placeholder="Username"
            className={styles.textField}
            value={username}
            onChange={(e) => {
              setUsername(e.currentTarget.value);
            }}
          />
          <div className={styles.row}>
            <input
              type="email"
              placeholder="Email"
              className={styles.emailTextField}
              value={email}
              onChange={(e) => {
                setEmail(e.currentTarget.value);
              }}
            />
            <button className={styles.sendOtpBtn} onClick={sendOtp}>
              Send OTP
            </button>
          </div>
          <input
            placeholder="- - -  - - -"
            className={styles.otpTextField}
            value={otpText}
            onChange={(e) => {
              setOtpText(e.currentTarget.value);
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
