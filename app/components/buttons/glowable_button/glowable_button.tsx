import { MouseEventHandler } from "react";
import styles from "./style.module.css";

export default function GlowableButton({
  text,
  onClick,
  disabled = false,
  glow = true,
  width,
  padding,
  borderRadius,
}: {
  text: string;
  disabled?: boolean;
  glow?: boolean;
  width?: string;
  borderRadius?: string;
  padding?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${styles.glowableBtn} ${
        glow && !disabled ? styles.glow : ""
      }`}
      style={{
        width: width ? width : "fit-content",
        borderRadius: borderRadius ? borderRadius : "none",
        padding: padding ? padding : "none",
      }}
    >
      {text}
    </button>
  );
}
