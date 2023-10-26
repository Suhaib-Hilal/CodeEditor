"use client";

import styles from "./page.module.css";
import { useState } from "react";
import { Message, MessageType } from "../models/message";
import { correctEmailFormat } from "@/app/utils/abc";
import FirebaseDatabase from "../services/firebase_database";
import GlowableButton from "@/app/components/buttons/glowable_button/glowable_button";

function SendOtpPageDesign({
  email,
  updateEmail,
  updateMsg,
  updateSecretOtp,
}: {
  email: string;
  updateEmail: Function;
  updateMsg: Function;
  updateSecretOtp: Function;
}) {
  async function sendOtp() {
    const res = await fetch("/api/verification", {
      method: "POST",
      body: JSON.stringify({ email: email }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const data = await res.json();
    console.log(data);
    if (res.status != 200) {
      updateMsg({ content: data.error, type: MessageType.ERROR_MESSAGE });
      return;
    }
    updateSecretOtp(data);
    updateMsg({ content: "OTP Sent", type: MessageType.SUCCESS_MESSAGE });
  }

  return (
    <div className={styles.main}>
      <p className={styles.title}>Forgot Password</p>
      <p className={styles.mediumText}>We'll email you a password reset otp.</p>
      <input
        type="email"
        placeholder="email@example.com"
        className={styles.textField}
        value={email}
        onChange={(e) => {
          updateEmail(e.currentTarget.value);
        }}
      />
      <GlowableButton
        text="Send OTP"
        disabled={correctEmailFormat(email) ? false : true}
        onClick={sendOtp}
        padding="6px 18px"
        width="94%"
        borderRadius="4px"
      />
    </div>
  );
}

function VerifyOtpPageDesign({
  userOtp,
  updateUserOtp,
  secretOtp,
  msg,
  updateMsg,
}: {
  userOtp: string;
  updateUserOtp: Function;
  secretOtp: string;
  msg: Message;
  updateMsg: Function;
}) {
  async function verifyOtp() {
    if (userOtp === secretOtp) {
      updateMsg({
        content: "Email Verified!",
        type: MessageType.SUCCESS_MESSAGE,
      });
    } else {
      updateMsg({
        content: "Verification Failed!",
        type: MessageType.ERROR_MESSAGE,
      });
    }
  }

  return (
    <div className={styles.main}>
      <p className={styles.title}>Verify OTP</p>
      <p className={styles.mediumText}>
        We have sent you a password reset otp to your <br></br> email account.
      </p>
      <input
        type="text"
        placeholder="- - -  - - -"
        className={styles.otpTextField}
        value={userOtp}
        onChange={(e) => {
          updateUserOtp(e.currentTarget.value);
        }}
      />
      {msg?.content == "Verification Failed!" ? (
        <p className={styles.error}>Verification Failed!</p>
      ) : ""}
      <GlowableButton
        text="Verify OTP"
        disabled={userOtp.length >= 5 ? false : true}
        onClick={verifyOtp}
        padding="6px 18px"
        width="90%"
        borderRadius="4px"
      />
    </div>
  );
}

function PasswordResetPageDesign({
  email,
  password,
  updatePassword,
}: {
  email: string;
  password: string;
  updatePassword: Function;
}) {
  async function resetPassword() {
    await FirebaseDatabase.resetUserPassword(email, password);
  }

  return (
    <div className={styles.main}>
      <p className={styles.title}>Reset Password</p>
      <p className={styles.mediumText}>
        Your email has been verified! You can reset your<br></br>password now.
      </p>
      <input
        type="password"
        placeholder="Enter new password"
        className={styles.textField}
        value={password}
        onChange={(e) => {
          updatePassword(e.currentTarget.value);
        }}
      />
      <GlowableButton
        text="Reset password"
        disabled={password.length >= 10 ? false : true}
        onClick={resetPassword}
        padding="6px 18px"
        width="94%"
        borderRadius="4px"
      />
    </div>
  );
}

export default function ResetPassword() {
  const [userEmail, setUserEmail] = useState("");
  const [msg, setMsg] = useState<Message>();
  const [userOtp, setUserOtp] = useState("");
  const [secretOtp, setSecretOtp] = useState("");
  const [password, setPassword] = useState("");

  const updateEmail = (newEmail: string) => {
    setUserEmail(newEmail);
  };
  const updateMsg = (newMsg: Message) => {
    setMsg(newMsg);
  };
  const updateSecretOtp = (newSecretOtp: string) => {
    setSecretOtp(newSecretOtp);
  };
  const updateUserOtp = (newUserOtp: string) => {
    setUserOtp(newUserOtp);
  };
  const updatePassword = (newPassword: string) => {
    setPassword(newPassword);
  };

  return (
    <div className={styles.body}>
      {(() => {
        if (
          msg?.content == "OTP Sent" ||
          msg?.content == "Verification Failed!"
        ) {
          return (
            <VerifyOtpPageDesign
              userOtp={userOtp}
              updateUserOtp={updateUserOtp}
              secretOtp={secretOtp}
              msg={msg}
              updateMsg={updateMsg}
            />
          );
        } else if (msg?.content == "Email Verified!") {
          return (
            <PasswordResetPageDesign
              email={userEmail}
              password={password}
              updatePassword={updatePassword}
            />
          );
        } else {
          return (
            <SendOtpPageDesign
              email={userEmail}
              updateEmail={updateEmail}
              updateMsg={updateMsg}
              updateSecretOtp={updateSecretOtp}
            />
          );
        }
      })()}
    </div>
  );
}
