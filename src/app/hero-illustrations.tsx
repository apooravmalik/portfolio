"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Lightbulb, Pause, Play } from "lucide-react";
import { changeTheme } from "./theme-transition";
import styles from "./hero.module.css";

const columns = 80;
const rows = 40;
const alphabet = "ilrtfxzvuncYUJCLQOZmwqpdbkhaoMW";

function donutFrame(tilt: number, turn: number) {
  const pixels = Array<string>(columns * rows).fill(" ");
  const depth = new Float64Array(columns * rows);
  const sinA = Math.sin(tilt), cosA = Math.cos(tilt);
  const sinB = Math.sin(turn), cosB = Math.cos(turn);

  for (let tube = 0; tube < Math.PI * 2; tube += 0.07) {
    const sinTube = Math.sin(tube), cosTube = Math.cos(tube);
    const radius = 1.8 + 0.72 * cosTube;
    for (let ring = 0; ring < Math.PI * 2; ring += 0.035) {
      const sinRing = Math.sin(ring), cosRing = Math.cos(ring);
      const x = radius * cosRing;
      const y = radius * sinRing * cosA - 0.72 * sinTube * sinA;
      const z = radius * sinRing * sinA + 0.72 * sinTube * cosA;
      const inverseZ = 1 / (7 + z);
      const screenX = Math.floor(columns / 2 + 100 * inverseZ * (x * cosB - y * sinB));
      const screenY = Math.floor(rows / 2 + 50 * inverseZ * (x * sinB + y * cosB));
      if (screenX < 0 || screenX >= columns || screenY < 0 || screenY >= rows) continue;
      const index = screenX + screenY * columns;
      if (inverseZ <= depth[index]) continue;
      depth[index] = inverseZ;
      const normalY = cosTube * sinRing * cosA - sinTube * sinA;
      const normalZ = cosTube * sinRing * sinA + sinTube * cosA;
      const light = (normalY * cosB + cosTube * cosRing * sinB - normalZ) / Math.SQRT2;
      const shade = Math.round((light + 1) / 2 * (alphabet.length - 1));
      pixels[index] = alphabet[Math.max(0, Math.min(alphabet.length - 1, shade))];
    }
  }

  return Array.from({ length: rows }, (_, row) =>
    pixels.slice(row * columns, (row + 1) * columns).join(""),
  ).join("\n");
}

const stillFrame = donutFrame(0.65, -0.35);
const bulbMessages = [
  "Click me",
  "Don’t do it.",
  "Seriously. Don’t.",
  "Is this how you treat a bulb?",
  "Easy on the bulb.",
  "It’s a dud.",
  "Expired bulb.",
  "You’re still here?",
  "Last warning.",
  "I’m gonna burst…",
  "BOOM!",
];

export function IdeaBulb() {
  const icon = useRef<HTMLSpanElement>(null);
  const clicks = useRef(0);
  const jump = useRef<Animation | null>(null);
  const reset = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismiss = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [burst, setBurst] = useState(false);
  const [message, setMessage] = useState<string | null>(bulbMessages[0]);

  useEffect(() => {
    dismiss.current = setTimeout(() => setMessage(null), 2600);
    return () => {
      jump.current?.cancel();
      if (reset.current !== null) clearTimeout(reset.current);
      if (dismiss.current !== null) clearTimeout(dismiss.current);
    };
  }, []);

  function activate() {
    if (reset.current !== null) return;
    jump.current?.cancel();
    const count = ++clicks.current;
    setMessage(bulbMessages[count]);
    if (dismiss.current !== null) clearTimeout(dismiss.current);
    dismiss.current = setTimeout(() => setMessage(null), 2600);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (count === 10) {
      clicks.current = 0;
      setBurst(true);
      reset.current = setTimeout(() => {
        setBurst(false);
        reset.current = null;
      }, 760);
      if (document.documentElement.dataset.theme !== "dark" && icon.current) {
        const bounds = icon.current.getBoundingClientRect();
        changeTheme({ x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 }, "dark");
      }
    } else if (!reducedMotion && icon.current) {
      jump.current = icon.current.animate(
        [
          { transform: "translateY(0) scale(1)" },
          { transform: "translateY(-0.35em) scale(1.08)", offset: 0.38 },
          { transform: "translateY(0) scale(1.12, 0.9)", offset: 0.8 },
          { transform: "translateY(0) scale(1)" },
        ],
        { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
    }
  }

  return (
    <span className={styles.ideaLetter}>
      ı
      <button
        type="button"
        className={styles.ideaButton}
        aria-label="Light up an idea"
        aria-describedby="bulb-message"
        aria-description="Click to make the bulb jump. Ten clicks trigger a surprise."
        data-burst={burst}
        onClick={activate}
      >
        <span ref={icon} className={styles.bulbIcon} aria-hidden="true">
          <Lightbulb />
        </span>
        {burst && (
          <span className={styles.burst} aria-hidden="true">
            {Array.from({ length: 8 }, (_, index) => (
              <i key={index} style={{
                "--dx": `${Math.cos(index * Math.PI / 4) * 0.8}em`,
                "--dy": `${Math.sin(index * Math.PI / 4) * 0.8}em`,
                "--angle": `${index * 45}deg`,
              } as CSSProperties} />
            ))}
          </span>
        )}
      </button>
      <span id="bulb-message" className={styles.bulbMessage} data-visible={message !== null} role="status" aria-atomic="true">
        {message ?? bulbMessages[0]}
      </span>
    </span>
  );
}

export function AsciiDonut() {
  const art = useRef<HTMLPreElement>(null);
  const rotation = useRef({ tilt: 0.65, turn: -0.35 });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = art.current;
    if (!element) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last = 0;
    let visible = false;

    function animate(time: number) {
      if (reducedMotion.matches || document.hidden) return;
      if (time - last >= 50) {
        rotation.current.tilt += 0.012;
        rotation.current.turn += 0.008;
        element!.textContent = donutFrame(rotation.current.tilt, rotation.current.turn);
        last = time;
      }
      frame = requestAnimationFrame(animate);
    }

    function sync() {
      cancelAnimationFrame(frame);
      if (!paused && !reducedMotion.matches && visible && !document.hidden) {
        frame = requestAnimationFrame(animate);
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    reducedMotion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      reducedMotion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [paused]);

  return (
    <figure className={styles.donut}>
      <div role="img" aria-label="A three-dimensional donut drawn in orange alphabet letters">
        <pre ref={art} className={styles.ascii} aria-hidden="true">{stillFrame}</pre>
      </div>
      <figcaption className={styles.caption}>
        <span>A small experiment in perspective.</span>
        <button
          type="button"
          className={styles.motionButton}
          aria-label={paused ? "Play donut animation" : "Pause donut animation"}
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </figcaption>
    </figure>
  );
}
