import React from "react";
import "./Input.css";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./Input.module.css";

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.inputWrapper}>

        {icon && (
          <span className={styles.icon}>
            {icon}
          </span>
        )}

        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={styles.input}
        />

        {type === "password" && (
          <button
            type="button"
            className={styles.eye}
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>

      {error && (
        <span className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;