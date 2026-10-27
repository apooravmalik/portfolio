"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { Moon, Sun } from "lucide-react";

import { changeTheme } from "./theme-transition";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const sync = () => setDark(document.documentElement.dataset.theme === "dark");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => {
      observer.disconnect();
    };
  }, []);

  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    changeTheme({ x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 });
  }

  return (
    <button
      type="button"
      className="theme-button"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
    >
      <span className="theme-track" aria-hidden="true">
        <span className="theme-icon theme-icon-sun"><Sun size={12} strokeWidth={2.25} /></span>
        <span className="theme-icon theme-icon-moon"><Moon size={11} strokeWidth={2.25} /></span>
        <span className="theme-thumb" />
      </span>
    </button>
  );
}
