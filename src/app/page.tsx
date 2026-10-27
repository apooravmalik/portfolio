"use client";

import { useEffect, useState } from "react";
import { IdeaBulb, AsciiDonut } from "./hero-illustrations";
import heroStyles from "./hero.module.css";
import { ThemeToggle } from "./theme-toggle";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Code2,
  Command,
  Database,
  Github,
  Layers3,
  Linkedin,
  Menu,
  Send,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";

const profile = {
  github: "https://github.com/apooravmalik",
  linkedin: "https://www.linkedin.com/in/apoorav-malik/",
  twitter: "https://x.com/iamapoorav",
};

const projects = [
  {
    name: "InsightDuck",
    category: "FULL-STACK · AI & DATA",
    description:
      "An AI-powered workspace to clean, profile, and make sense of your data. From messy CSVs to clarity.",
    tags: ["React", "JavaScript", "AI"],
    slug: "InsightDuck",
    preview: "insight",
    live: "https://insight-duck.vercel.app",
  },
  {
    name: "AutoPM",
    category: "AUTOMATION · DEVELOPER TOOLS",
    description:
      "Project management, right in Telegram. Turn conversations into tasks and keep work moving.",
    tags: ["Python", "Telegram", "Automation"],
    slug: "AutoPM",
    preview: "autopm",
    live: null,
  },
  {
    name: "Session Ledger",
    category: "OPEN SOURCE · AI TOOLING",
    description:
      "A local-first memory layer that helps coding agents pick up where they left off.",
    tags: ["Node.js", "SQLite", "MCP"],
    slug: "session-ledger",
    preview: "ledger",
    live: null,
  },
];

function Star({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M50 5v90M5 50h90M18.18 18.18l63.64 63.64M18.18 81.82l63.64-63.64"
        stroke="currentColor"
        strokeWidth="13"
      />
    </svg>
  );
}

function ProjectPreview({ type }: { type: string }) {
  if (type === "insight")
    return (
      <div className="project-preview preview-insight" aria-hidden="true">
        <div className="analytics-window">
          <div className="window-top">
            <span className="duck-mark">◒</span>
            <b>InsightDuck</b>
            <span className="window-top-right">
              Workspace <ChevronRight size={8} />
            </span>
          </div>
          <div className="analytics-content">
            <div className="analytics-sidebar">
              <span className="sidebar-square active" />
              <span className="sidebar-square" />
              <span className="sidebar-square" />
              <span className="sidebar-square" />
            </div>
            <div className="analytics-main">
              <div className="mini-eyebrow">YOUR DATA, A LITTLE CLEARER</div>
              <div className="mini-title">
                A little clarity. A lot of insight.
              </div>
              <div className="stat-grid">
                <div>
                  <span>Rows analyzed</span>
                  <b>
                    24,892 <em>CSV imported</em>
                  </b>
                </div>
                <div>
                  <span>Data quality</span>
                  <b>
                    98.2% <em>↗ Cleaned</em>
                  </b>
                </div>
              </div>
              <div className="chart-title">
                Data distribution <span>Explore dataset⌄</span>
              </div>
              <div className="bar-chart">
                {[
                  32, 48, 38, 59, 44, 70, 57, 79, 63, 88, 74, 97, 81, 110, 96,
                  121, 106, 132, 114, 148, 128, 155,
                ].map((height, i) => (
                  <i key={i} style={{ height: `${height / 1.9}px` }} />
                ))}
              </div>
              <div className="chart-axis">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>
        <span className="preview-caption">LESS NOISE. MORE INSIGHT.</span>
      </div>
    );
  if (type === "autopm")
    return (
      <div className="project-preview preview-autopm" aria-hidden="true">
        <div className="telegram-window">
          <div className="telegram-header">
            <div className="bot-avatar">
              <Send size={15} />
            </div>
            <div>
              <b>AutoPM</b>
              <span>your project sidekick</span>
            </div>
            <span className="bot-badge">BOT</span>
          </div>
          <div className="chat-message outgoing">
            /create_task Ship something great
            <span>
              10:42 <Check size={8} />
            </span>
          </div>
          <div className="chat-message incoming">
            <div className="task-created">
              <span>✦</span> Task created. Let’s make it happen.
            </div>
            <div className="chat-task">
              <span className="task-checkbox">
                <Check size={9} />
              </span>
              Ship something great <span className="task-status">To do</span>
            </div>
            <span className="chat-time">10:42</span>
          </div>
          <div className="telegram-input">
            One less thing to keep in your head.
            <Send size={11} />
          </div>
        </div>
        <span className="preview-caption">FROM “LET’S DO IT” TO DONE.</span>
      </div>
    );
  return (
    <div className="project-preview preview-ledger" aria-hidden="true">
      <div className="terminal-window">
        <div className="terminal-top">
          <span className="traffic-lights">
            <i />
            <i />
            <i />
          </span>
          <span>session-ledger — zsh</span>
          <Terminal size={10} />
        </div>
        <div className="terminal-body">
          <p>
            <span className="terminal-prompt">~</span> ledger recent
          </p>
          <p className="terminal-muted">
            Your context, right where you left it.
          </p>
          <div className="terminal-divider" />
          <p>
            <span className="terminal-green">✓</span> Repository connected
          </p>
          <p>
            <span className="terminal-green">✓</span> Session context restored
          </p>
          <p>
            <span className="terminal-green">✓</span> Ready for what’s next
          </p>
          <p className="terminal-bottom">
            <span className="terminal-prompt">❯</span> build something good
            <span className="terminal-cursor" />
          </p>
        </div>
      </div>
      <span className="preview-caption">GOOD WORK DESERVES A MEMORY.</span>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [projectFilter, setProjectFilter] = useState("All work");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      projectFilter === "All work" ||
      (projectFilter === "Web development"
        ? project.preview === "insight"
        : project.preview !== "insight"),
  );

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header shell">
        <a href="#" className="wordmark" aria-label="Apoorav Malik home">
          am<span>.</span>
        </a>
        <nav
          className={`desktop-nav ${menuOpen ? "menu-open" : ""}`}
          aria-label="Main navigation"
        >
          {[
            ["work", "Work"],
            ["about", "About"],
            ["playground", "Playground"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={activeSection === id ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            className="nav-contact"
            href="#contact"
            onClick={() => setMenuOpen(false)}
          >
            Let’s talk <ArrowUpRight size={14} />
          </a>
        </nav>
        <div className="header-actions">
          <span className="header-divider" />
          <ThemeToggle />
          <button
            className="menu-button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main id="main">
        <section
          className={`shell ${heroStyles.hero}`}
          aria-labelledby="hero-title"
        >
          <div className={heroStyles.copy}>
            <h1 id="hero-title" className={heroStyles.title} aria-label="I turn ideas into things.">
              <span>I turn <IdeaBulb />deas</span>{" "}
              <span>into things.</span>
            </h1>
            <p className={heroStyles.description}>
              I’m Apoorav, a full-stack developer.
              <br />
              Web apps, data tools, and experiments with AI.
            </p>
            <div className={heroStyles.actions}>
              <a className="button button-primary" href="#work">
                Explore my work <ArrowDownRight size={17} />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
              >
                <Github size={17} /> GitHub <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
          <AsciiDonut />
          <div className={heroStyles.footer}>
            <span>Code, with a curious streak.</span>
            <a className={heroStyles.scrollLink} href="#work">
              Take a look around <ArrowDown size={14} />
            </a>
          </div>
        </section>

        <section
          className="work-section shell"
          id="work"
          aria-labelledby="work-heading"
        >
          <div className="section-heading">
            <div>
              <span className="section-index">01 / SELECTED WORK</span>
              <h2 id="work-heading">
                Ideas, brought to life<span className="accent">.</span>
              </h2>
            </div>
            <a
              className="text-link"
              href={`${profile.github}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
            >
              All projects <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="project-filters" aria-label="Filter projects">
            {["All work", "Web development", "AI & tools"].map((filter) => (
              <button
                key={filter}
                onClick={() => setProjectFilter(filter)}
                aria-pressed={projectFilter === filter}
                className={projectFilter === filter ? "selected" : ""}
              >
                {filter}
                {filter === "All work" && <span>03</span>}
              </button>
            ))}
          </div>
          <div className="project-grid">
            {filteredProjects.map((project) => (
              <article className="project-card" key={project.slug}>
                <a
                  className="project-image-link"
                  href={`${profile.github}/${project.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.name} on GitHub`}
                >
                  <ProjectPreview type={project.preview} />
                  <span className="preview-open">
                    <ArrowUpRight size={18} />
                  </span>
                </a>
                <div className="project-meta">
                  <span>{project.category}</span>
                  <span>0{projects.indexOf(project) + 1}</span>
                </div>
                <div className="project-title-row">
                  <h3>
                    <a
                      href={`${profile.github}/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.name}
                    </a>
                  </h3>
                  <a
                    className="project-arrow"
                    href={`${profile.github}/${project.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Explore ${project.name}`}
                  >
                    <ArrowUpRight size={20} />
                  </a>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-bottom">
                  <div className="tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  {project.live && (
                    <a
                      className="live-link"
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${project.name} live site`}
                    >
                      <span /> Live <ArrowUpRight size={10} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
          <div className="work-footnote">
            <span>Built with curiosity. Shipped with care.</span>
            <Github size={13} />
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              More experiments live on GitHub <ArrowRight size={12} />
            </a>
          </div>
        </section>

        <section
          className="about-section"
          id="about"
          aria-labelledby="about-heading"
        >
          <div className="shell about-grid">
            <div className="about-label">
              <span className="section-index">
                02 / THE HUMAN BEHIND THE CODE
              </span>
              <h2 id="about-heading">
                A little about
                <br />
                <span className="serif">how I think.</span>
              </h2>
              <div className="about-signature">
                Apoorav<span className="accent">↗</span>
              </div>
            </div>
            <div className="about-copy">
              <p className="about-lead">
                I like making complex things
                <br className="desktop-break" /> feel a little simpler.
              </p>
              <p>
                For me, development starts with curiosity: understanding a
                problem, asking better questions, and building something that
                helps. That takes me from full-stack applications to data and
                the possibilities of AI.
              </p>
              <p>
                I’m happiest when I’m learning by doing. A new tool, a side
                project, an idea that won’t leave my head — there’s usually
                something in the works.
              </p>
              <div className="skill-heading">A FEW TOOLS I REACH FOR</div>
              <div className="skills">
                <span>
                  <Command size={14} />
                  Next.js
                </span>
                <span>
                  <Code2 size={14} />
                  React
                </span>
                <span>
                  <Terminal size={14} />
                  Python
                </span>
                <span>
                  <Layers3 size={14} />
                  Node.js
                </span>
                <span>
                  <Database size={14} />
                  Supabase
                </span>
                <span>
                  <Sparkles size={14} />
                  AI / ML
                </span>
              </div>
              <a
                className="text-link about-link"
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                More about my journey <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>

        <section
          className="playground-section shell"
          id="playground"
          aria-labelledby="playground-heading"
        >
          <div className="section-heading">
            <div>
              <span className="section-index">03 / THE PLAYGROUND</span>
              <h2 id="playground-heading">
                Room to experiment<span className="accent">.</span>
              </h2>
            </div>
            <p className="section-aside">
              Small ideas. New territory.
              <br />
              Learning out in the open.
            </p>
          </div>
          <div className="experiment-list">
            {[
              {
                name: "Text Summarization",
                type: "MACHINE LEARNING",
                text: "Exploring how a lot of words can say a little more.",
                repo: "Text-Summarization",
                icon: <Sparkles size={21} />,
              },
              {
                name: "Wallpaper Mosaic",
                type: "WEB EXPERIMENT",
                text: "A newsletter for wallpapers and the people who make them.",
                repo: "WallpaperMosaic",
                icon: <Layers3 size={21} />,
              },
              {
                name: "ChatApp",
                type: "REAL-TIME WEB",
                text: "Bringing people together, one message at a time.",
                repo: "ChatApp",
                icon: <Send size={21} />,
              },
            ].map((item, i) => (
              <a
                href={`${profile.github}/${item.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="experiment-row"
                key={item.repo}
              >
                <span className="experiment-number">0{i + 1}</span>
                <span className="experiment-icon">{item.icon}</span>
                <div className="experiment-copy">
                  <h3>{item.name}</h3>
                  <p>{item.text}</p>
                </div>
                <span className="experiment-type">{item.type}</span>
                <ArrowUpRight className="experiment-arrow" size={21} />
              </a>
            ))}
          </div>
        </section>

        <section
          className="contact-section shell"
          id="contact"
          aria-labelledby="contact-heading"
        >
          <div className="contact-panel">
            <div>
              <span className="section-index">
                <span className="status-dot" /> GOOD THINGS START WITH A
                CONVERSATION
              </span>
              <h2 id="contact-heading">
                Have something
                <br />
                <span className="serif">in mind?</span>
                <Star className="contact-star" />
              </h2>
              <p>
                A project, a collaboration, or just a hello.
                <br />
                My corner of the internet is always open.
              </p>
              <a
                className="button button-primary"
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                Let’s talk <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="contact-socials">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={18} />
                GitHub
                <ArrowUpRight size={16} />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={18} />
                LinkedIn
                <ArrowUpRight size={16} />
              </a>
              <a
                href={profile.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="x-icon">𝕏</span>Twitter / X
                <ArrowUpRight size={16} />
              </a>
              <span>LET’S MAKE SOMETHING GOOD.</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer shell">
        <a href="#" className="wordmark" aria-label="Back to top">
          am<span>.</span>
        </a>
        <p>
          © {new Date().getFullYear()} Apoorav Malik
          <span>Built with intention. And Next.js.</span>
        </p>
        <a href="#" className="back-top">
          Back to top <ArrowUpRight size={14} />
        </a>
      </footer>
    </>
  );
}
