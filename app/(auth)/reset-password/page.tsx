"use client";

import styles from "./page.module.css";
import { useState } from "react";
import { Message, MessageType } from "../models/message";
import { correctEmailFormat } from "@/app/utils/abc";
import FirebaseDatabase from "../services/firebase_database";

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
      {correctEmailFormat(email) ? (
        <button onClick={sendOtp} className={styles.sendOtpBtn}>
          Send OTP
        </button>
      ) : (
        <button disabled className={styles.sendOtpBtn}>
          Send OTP
        </button>
      )}
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
        We have sent you a password reset otp to your email account.
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
      ) : (
        <p></p>
      )}
      {userOtp.length >= 5 ? (
        <button onClick={verifyOtp} className={styles.verifyOtpBtn}>
          Verify OTP
        </button>
      ) : (
        <button disabled className={styles.verifyOtpBtn}>
          Verify OTP
        </button>
      )}
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
    await FirebaseDatabase.userPasswordReset(email, password);
  }

  return (
    <div className={styles.main}>
      <p className={styles.title}>Reset Password</p>
      <p className={styles.mediumText}>
        Your email has been verified! You can reset your password now.
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
      {password.length >= 10 ? (
        <button onClick={resetPassword} className={styles.resetPasswordBtn}>
          Reset Password
        </button>
      ) : (
        <button disabled className={styles.verifyOtpBtn}>
          Reset Password
        </button>
      )}
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
