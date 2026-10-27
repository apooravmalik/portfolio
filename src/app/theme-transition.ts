type Theme = "light" | "dark";

let request = 0;
let pendingTheme: Theme | null = null;
let activeTransition: ViewTransition | null = null;
let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

function clearFallback() {
  if (fallbackTimer !== null) {
    clearTimeout(fallbackTimer);
    fallbackTimer = null;
  }
}

export function changeTheme(origin: { x: number; y: number }, theme?: Theme) {
  const root = document.documentElement;
  const current = pendingTheme ?? (root.dataset.theme === "dark" ? "dark" : "light");
  const next: Theme = theme ?? (current === "dark" ? "light" : "dark");
  const id = ++request;
  pendingTheme = next;
  clearFallback();
  activeTransition?.skipTransition();
  activeTransition = null;

  const commit = () => {
    // An older snapshot callback must never overwrite a newer click.
    if (request !== id) return;
    clearFallback();
    root.dataset.theme = next;
    pendingTheme = null;
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {
      // Switching still works when browser storage is unavailable.
    }
  };

  if (
    typeof document.startViewTransition !== "function" ||
    document.hidden ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    commit();
    return;
  }

  const { x, y } = origin;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  try {
    const transition = document.startViewTransition(commit);
    activeTransition = transition;
    const recover = () => {
      if (request !== id) return;
      transition.skipTransition();
      commit();
    };

    // Snapshot capture can stall in embedded, background, or busy browsers.
    // The visual enhancement must never prevent the theme from changing.
    fallbackTimer = setTimeout(recover, 180);
    transition.ready.then(() => {
      if (request !== id) {
        transition.skipTransition();
        return;
      }
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 620, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    }).catch(recover);
    transition.finished.then(() => {
      if (request !== id) return;
      commit();
      activeTransition = null;
    }).catch(recover);
  } catch {
    // Some browsers expose the API but cannot start a transition.
    commit();
  }
}
