import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import {
  Sun, Moon, Menu, X, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  LayoutDashboard, FileText, BarChart2, Sparkles, Settings, LogOut,
  Plus, Trash2, Eye, Download, Globe, Check, Star, Zap,
  User, Briefcase, GraduationCap, Code, Award, ArrowRight, ArrowUp, ArrowDown,
  Mail, Linkedin, Github, Bell, TrendingUp, Palette, Layers, Monitor,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { toast, Toaster } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

type View = "landing" | "login" | "signup" | "dashboard";
type DashTab = "home" | "portfolios" | "templates" | "analytics" | "ai" | "settings";
type TplId = "developer" | "designer" | "researcher" | "creative" | "minimal";

interface Edu { id: string; institution: string; degree: string; year: string; description: string }
interface Exp { id: string; company: string; position: string; duration: string; description: string }
interface Proj { id: string; name: string; description: string; tech: string; github: string; demo: string }
interface Cert { id: string; name: string; org: string; date: string; link: string }

interface PortfolioData {
  name: string; tagline: string; about: string; photo: string;
  education: Edu[]; experience: Exp[]; projects: Proj[];
  skills: Record<string, string[]>;
  certifications: Cert[]; achievements: string[];
  email: string; phone: string; linkedin: string; github: string; website: string;
  template: TplId; accentColor: string; fontChoice: string;
  published: boolean; publishedUrl: string;
}

interface Portfolio { id: string; title: string; data: PortfolioData; views: number; lastEdited: string }

// ─── Constants ───────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);

const TEMPLATES: Array<{ id: TplId; name: string; desc: string; color: string }> = [
  { id: "developer", name: "Developer", desc: "For software engineers", color: "#6366f1" },
  { id: "designer", name: "Designer", desc: "For UI/UX designers", color: "#ec4899" },
  { id: "researcher", name: "Researcher", desc: "For academic portfolios", color: "#10b981" },
  { id: "creative", name: "Creative", desc: "For photographers & artists", color: "#f59e0b" },
  { id: "minimal", name: "Minimal", desc: "Clean and elegant", color: "#71717a" },
];

const SKILL_CATS = ["Frontend", "Backend", "AI/ML", "Database", "Tools"];

const EMPTY_PORTFOLIO: PortfolioData = {
  name: "", tagline: "", about: "", photo: "",
  education: [], experience: [], projects: [],
  skills: { Frontend: [], Backend: [], "AI/ML": [], Database: [], Tools: [] },
  certifications: [], achievements: [],
  email: "", phone: "", linkedin: "", github: "", website: "",
  template: "developer", accentColor: "#6366f1", fontChoice: "sans",
  published: false, publishedUrl: "",
};

const ANALYTICS_DATA = [
  { date: "Jun 1", views: 12, visitors: 8 },
  { date: "Jun 5", views: 28, visitors: 19 },
  { date: "Jun 10", views: 45, visitors: 31 },
  { date: "Jun 14", views: 38, visitors: 27 },
  { date: "Jun 19", views: 72, visitors: 51 },
];

const DEMO_PORTFOLIOS: Portfolio[] = [
  {
    id: "demo1",
    title: "Alex Chen",
    views: 247,
    lastEdited: "2 days ago",
    data: {
      ...EMPTY_PORTFOLIO,
      name: "Alex Chen",
      tagline: "Full-Stack Developer · React & Node.js",
      about: "5+ years building scalable web applications. Passionate about clean code and great UX.",
      email: "alex@example.com",
      github: "github.com/alexchen",
      template: "developer",
      published: true,
      publishedUrl: "portfolioforge.app/alex-chen",
      skills: {
        Frontend: ["React", "TypeScript", "Next.js"],
        Backend: ["Node.js", "PostgreSQL"],
        "AI/ML": [],
        Database: ["MongoDB"],
        Tools: ["Git", "Docker"],
      },
    },
  },
];

// ─── Small UI ─────────────────────────────────────────────────────────────────

function Btn({
  children, onClick, variant = "primary", size = "md", className = "",
  type = "button", disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  const variants = {
    primary: "bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-600/25",
    secondary: "bg-secondary text-secondary-foreground hover:bg-muted border border-border",
    ghost: "hover:bg-accent text-foreground",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer ${sizes[size]} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

function Field({
  label, value, onChange, placeholder = "", type = "text",
  className = "", multiline = false, rows = 3,
}: {
  label?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; className?: string;
  multiline?: boolean; rows?: number;
}) {
  const cls =
    "w-full px-3 py-2 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-sm transition-all";
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${cls} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-card border border-border rounded-xl p-5 ${className}`}>{children}</div>;
}

function Badge({ children, color = "#6366f1" }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {children}
    </span>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none ${checked ? "bg-violet-600" : "bg-muted"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform duration-300 ${checked ? "translate-x-6" : ""}`}
      >
        {checked ? <Moon size={10} className="text-violet-600" /> : <Sun size={10} className="text-yellow-500" />}
      </span>
    </button>
  );
}

// ─── Portfolio Preview ────────────────────────────────────────────────────────

function PortfolioPreview({ data }: { data: PortfolioData }) {
  const tpl = TEMPLATES.find((t) => t.id === data.template) ?? TEMPLATES[0];
  const accent = data.accentColor || tpl.color;
  const fontFamily =
    data.fontChoice === "serif"
      ? "Georgia, 'Times New Roman', serif"
      : data.fontChoice === "mono"
      ? "'Courier New', monospace"
      : "DM Sans, sans-serif";

  const isDark = data.template === "developer";
  const bgColor = isDark ? "#0a0a14" : data.template === "designer" ? "#fff8fc" : data.template === "researcher" ? "#f8f7f2" : "#fffcf5";
  const textColor = isDark ? "#e8e4ff" : "#111118";

  return (
    <div
      className="h-full min-h-screen overflow-y-auto text-xs"
      style={{ backgroundColor: bgColor, color: textColor, fontFamily }}
    >
      {/* Header */}
      <div className="px-8 pt-10 pb-6" style={{ borderBottom: `2px solid ${accent}44` }}>
        <div className="flex items-center gap-4">
          {data.photo ? (
            <img src={data.photo} alt="profile" className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
              style={{ backgroundColor: accent }}
            >
              {data.name ? data.name[0].toUpperCase() : "?"}
            </div>
          )}
          <div>
            <h1
              className="text-base font-extrabold leading-tight"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              {data.name || "Your Name"}
            </h1>
            <p className="mt-0.5 opacity-60 text-xs">{data.tagline || "Your Professional Tagline"}</p>
            <div className="flex gap-3 mt-1.5">
              {data.email && <span className="opacity-50 text-xs">{data.email}</span>}
              {data.github && (
                <span className="text-xs" style={{ color: accent }}>GitHub</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      {data.about && (
        <div className="px-8 py-4">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-50">About</h2>
          <p className="leading-relaxed opacity-75 text-xs">{data.about}</p>
        </div>
      )}

      {/* Skills */}
      {SKILL_CATS.some((c) => (data.skills[c] || []).length > 0) && (
        <div className="px-8 py-4">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-50">Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {SKILL_CATS.flatMap((c) =>
              (data.skills[c] || []).map((s) => (
                <span
                  key={`${c}-${s}`}
                  className="px-2 py-0.5 rounded text-xs font-medium"
                  style={{ backgroundColor: `${accent}20`, color: accent }}
                >
                  {s}
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="px-8 py-4">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-50">Projects</h2>
          <div className="space-y-3">
            {data.projects.map((p) => (
              <div key={p.id} className="p-3 rounded-lg" style={{ backgroundColor: `${accent}12` }}>
                <div className="font-semibold text-xs" style={{ color: accent }}>{p.name || "Untitled Project"}</div>
                {p.description && <p className="mt-1 opacity-65 leading-relaxed text-xs">{p.description}</p>}
                {p.tech && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {p.tech.split(",").map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded text-xs opacity-55 border" style={{ borderColor: `${accent}30` }}>
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="px-8 py-4">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-50">Experience</h2>
          <div className="space-y-3">
            {data.experience.map((e) => (
              <div key={e.id}>
                <div className="font-semibold text-xs">{e.position}</div>
                <div className="opacity-55 text-xs mt-0.5">{e.company}{e.duration ? ` · ${e.duration}` : ""}</div>
                {e.description && <p className="mt-1 opacity-60 text-xs leading-relaxed">{e.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="px-8 py-4">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-50">Education</h2>
          {data.education.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="font-semibold text-xs">{e.institution}</div>
              <div className="opacity-55 text-xs">{e.degree}{e.year ? ` · ${e.year}` : ""}</div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div className="px-8 py-4">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-50">Certifications</h2>
          {data.certifications.map((c) => (
            <div key={c.id} className="mb-2">
              <div className="font-semibold text-xs">{c.name}</div>
              <div className="opacity-55 text-xs">{c.org}{c.date ? ` · ${c.date}` : ""}</div>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {data.achievements.length > 0 && (
        <div className="px-8 py-4">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-50">Achievements</h2>
          <ul className="space-y-1">
            {data.achievements.map((a, i) => (
              <li key={i} className="flex gap-2 text-xs opacity-75">
                <span style={{ color: accent }}>▸</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Contact */}
      {(data.email || data.phone || data.linkedin || data.github) && (
        <div className="px-8 py-4 pb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-50">Contact</h2>
          <div className="space-y-1">
            {data.email && <div className="opacity-65 text-xs">{data.email}</div>}
            {data.phone && <div className="opacity-65 text-xs">{data.phone}</div>}
            {data.linkedin && <div className="opacity-65 text-xs">{data.linkedin}</div>}
            {data.github && <div className="opacity-65 text-xs">{data.github}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Builder Steps ────────────────────────────────────────────────────────────

function Step1({ data, upd }: { data: PortfolioData; upd: (k: keyof PortfolioData, v: string) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Full Name" value={data.name} onChange={(v) => upd("name", v)} placeholder="Alex Chen" />
      <Field label="Tagline" value={data.tagline} onChange={(v) => upd("tagline", v)} placeholder="Full-Stack Developer · React & Node.js" />
      <Field label="About Me" value={data.about} onChange={(v) => upd("about", v)} placeholder="Tell the world about yourself..." multiline rows={4} />
      <Field label="Profile Photo URL" value={data.photo} onChange={(v) => upd("photo", v)} placeholder="https://..." type="url" />
      {data.photo && (
        <img src={data.photo} alt="preview" className="w-14 h-14 rounded-full object-cover border border-border" />
      )}
    </div>
  );
}

function Step2({ data, setData }: { data: PortfolioData; setData: (d: PortfolioData) => void }) {
  const add = () =>
    setData({ ...data, education: [...data.education, { id: uid(), institution: "", degree: "", year: "", description: "" }] });
  const remove = (id: string) =>
    setData({ ...data, education: data.education.filter((e) => e.id !== id) });
  const upd = (id: string, k: keyof Edu, v: string) =>
    setData({ ...data, education: data.education.map((e) => (e.id === id ? { ...e, [k]: v } : e)) });
  return (
    <div className="space-y-4">
      {data.education.map((edu) => (
        <Card key={edu.id} className="relative pt-8">
          <button onClick={() => remove(edu.id)} className="absolute top-3 right-3 text-muted-foreground hover:text-red-500">
            <Trash2 size={14} />
          </button>
          <div className="space-y-3">
            <Field label="Institution" value={edu.institution} onChange={(v) => upd(edu.id, "institution", v)} placeholder="MIT" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Degree" value={edu.degree} onChange={(v) => upd(edu.id, "degree", v)} placeholder="B.Sc. Computer Science" />
              <Field label="Year" value={edu.year} onChange={(v) => upd(edu.id, "year", v)} placeholder="2019 – 2023" />
            </div>
            <Field label="Description" value={edu.description} onChange={(v) => upd(edu.id, "description", v)} placeholder="Key achievements..." multiline rows={2} />
          </div>
        </Card>
      ))}
      <Btn variant="secondary" onClick={add}><Plus size={14} /> Add Education</Btn>
    </div>
  );
}

function Step3({ data, setData }: { data: PortfolioData; setData: (d: PortfolioData) => void }) {
  const add = () =>
    setData({ ...data, experience: [...data.experience, { id: uid(), company: "", position: "", duration: "", description: "" }] });
  const remove = (id: string) =>
    setData({ ...data, experience: data.experience.filter((e) => e.id !== id) });
  const upd = (id: string, k: keyof Exp, v: string) =>
    setData({ ...data, experience: data.experience.map((e) => (e.id === id ? { ...e, [k]: v } : e)) });
  return (
    <div className="space-y-4">
      {data.experience.map((exp) => (
        <Card key={exp.id} className="relative pt-8">
          <button onClick={() => remove(exp.id)} className="absolute top-3 right-3 text-muted-foreground hover:text-red-500">
            <Trash2 size={14} />
          </button>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Company" value={exp.company} onChange={(v) => upd(exp.id, "company", v)} placeholder="Google" />
              <Field label="Position" value={exp.position} onChange={(v) => upd(exp.id, "position", v)} placeholder="Senior Engineer" />
            </div>
            <Field label="Duration" value={exp.duration} onChange={(v) => upd(exp.id, "duration", v)} placeholder="Jan 2022 – Present" />
            <Field label="Description" value={exp.description} onChange={(v) => upd(exp.id, "description", v)} placeholder="What did you accomplish?" multiline rows={2} />
          </div>
        </Card>
      ))}
      <Btn variant="secondary" onClick={add}><Plus size={14} /> Add Experience</Btn>
    </div>
  );
}

function Step4({ data, setData }: { data: PortfolioData; setData: (d: PortfolioData) => void }) {
  const add = () =>
    setData({ ...data, projects: [...data.projects, { id: uid(), name: "", description: "", tech: "", github: "", demo: "" }] });
  const remove = (id: string) =>
    setData({ ...data, projects: data.projects.filter((p) => p.id !== id) });
  const upd = (id: string, k: keyof Proj, v: string) =>
    setData({ ...data, projects: data.projects.map((p) => (p.id === id ? { ...p, [k]: v } : p)) });
  const move = (id: string, dir: -1 | 1) => {
    const arr = [...data.projects];
    const i = arr.findIndex((p) => p.id === id);
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setData({ ...data, projects: arr });
  };
  return (
    <div className="space-y-4">
      {data.projects.map((proj, idx) => (
        <Card key={proj.id} className="relative pt-8">
          <div className="absolute top-3 right-3 flex gap-1">
            <button onClick={() => move(proj.id, -1)} disabled={idx === 0} className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-25">
              <ArrowUp size={13} />
            </button>
            <button onClick={() => move(proj.id, 1)} disabled={idx === data.projects.length - 1} className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-25">
              <ArrowDown size={13} />
            </button>
            <button onClick={() => remove(proj.id)} className="p-0.5 text-muted-foreground hover:text-red-500">
              <Trash2 size={13} />
            </button>
          </div>
          <div className="space-y-3">
            <Field label="Project Name" value={proj.name} onChange={(v) => upd(proj.id, "name", v)} placeholder="Portfolio Builder" />
            <Field label="Description" value={proj.description} onChange={(v) => upd(proj.id, "description", v)} placeholder="What does it do?" multiline rows={2} />
            <Field label="Technologies (comma-separated)" value={proj.tech} onChange={(v) => upd(proj.id, "tech", v)} placeholder="React, TypeScript, Node.js" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="GitHub URL" value={proj.github} onChange={(v) => upd(proj.id, "github", v)} placeholder="https://github.com/..." />
              <Field label="Demo URL" value={proj.demo} onChange={(v) => upd(proj.id, "demo", v)} placeholder="https://..." />
            </div>
          </div>
        </Card>
      ))}
      <Btn variant="secondary" onClick={add}><Plus size={14} /> Add Project</Btn>
    </div>
  );
}

function Step5({ data, setData }: { data: PortfolioData; setData: (d: PortfolioData) => void }) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const addSkill = (cat: string) => {
    const val = (inputs[cat] || "").trim();
    if (!val) return;
    const existing = data.skills[cat] || [];
    if (existing.includes(val)) return;
    setData({ ...data, skills: { ...data.skills, [cat]: [...existing, val] } });
    setInputs({ ...inputs, [cat]: "" });
  };
  const removeSkill = (cat: string, skill: string) =>
    setData({ ...data, skills: { ...data.skills, [cat]: (data.skills[cat] || []).filter((s) => s !== skill) } });
  return (
    <div className="space-y-5">
      {SKILL_CATS.map((cat) => (
        <div key={cat}>
          <h3 className="text-sm font-semibold mb-2">{cat}</h3>
          <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
            {(data.skills[cat] || []).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
              >
                {skill}
                <button onClick={() => removeSkill(cat, skill)} className="hover:text-red-500 leading-none"><X size={10} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={inputs[cat] || ""}
              onChange={(e) => setInputs({ ...inputs, [cat]: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && addSkill(cat)}
              placeholder={`Add ${cat} skill…`}
              className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
            <Btn size="sm" onClick={() => addSkill(cat)}><Plus size={12} /></Btn>
          </div>
        </div>
      ))}
    </div>
  );
}

function Step6({ data, setData }: { data: PortfolioData; setData: (d: PortfolioData) => void }) {
  const add = () =>
    setData({ ...data, certifications: [...data.certifications, { id: uid(), name: "", org: "", date: "", link: "" }] });
  const remove = (id: string) =>
    setData({ ...data, certifications: data.certifications.filter((c) => c.id !== id) });
  const upd = (id: string, k: keyof Cert, v: string) =>
    setData({ ...data, certifications: data.certifications.map((c) => (c.id === id ? { ...c, [k]: v } : c)) });
  return (
    <div className="space-y-4">
      {data.certifications.map((cert) => (
        <Card key={cert.id} className="relative pt-8">
          <button onClick={() => remove(cert.id)} className="absolute top-3 right-3 text-muted-foreground hover:text-red-500">
            <Trash2 size={14} />
          </button>
          <div className="space-y-3">
            <Field label="Certificate Name" value={cert.name} onChange={(v) => upd(cert.id, "name", v)} placeholder="AWS Solutions Architect" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Organization" value={cert.org} onChange={(v) => upd(cert.id, "org", v)} placeholder="Amazon Web Services" />
              <Field label="Date" value={cert.date} onChange={(v) => upd(cert.id, "date", v)} placeholder="March 2024" />
            </div>
            <Field label="Credential URL" value={cert.link} onChange={(v) => upd(cert.id, "link", v)} placeholder="https://..." />
          </div>
        </Card>
      ))}
      <Btn variant="secondary" onClick={add}><Plus size={14} /> Add Certification</Btn>
    </div>
  );
}

function Step7({ data, setData }: { data: PortfolioData; setData: (d: PortfolioData) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    if (!input.trim()) return;
    setData({ ...data, achievements: [...data.achievements, input.trim()] });
    setInput("");
  };
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {data.achievements.map((ach, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-card">
            <Award size={13} className="text-violet-500 flex-shrink-0" />
            <span className="flex-1 text-sm">{ach}</span>
            <button
              onClick={() => setData({ ...data, achievements: data.achievements.filter((_, idx) => idx !== i) })}
              className="text-muted-foreground hover:text-red-500"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="e.g. Won 1st place at HackMIT 2023"
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
        />
        <Btn onClick={add}><Plus size={14} /></Btn>
      </div>
    </div>
  );
}

function Step8({ data, upd }: { data: PortfolioData; upd: (k: keyof PortfolioData, v: string) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Email" value={data.email} onChange={(v) => upd("email", v)} placeholder="you@example.com" type="email" />
      <Field label="Phone" value={data.phone} onChange={(v) => upd("phone", v)} placeholder="+1 (555) 000-0000" />
      <Field label="LinkedIn" value={data.linkedin} onChange={(v) => upd("linkedin", v)} placeholder="https://linkedin.com/in/..." />
      <Field label="GitHub" value={data.github} onChange={(v) => upd("github", v)} placeholder="https://github.com/..." />
      <Field label="Personal Website" value={data.website} onChange={(v) => upd("website", v)} placeholder="https://..." />
    </div>
  );
}

// ─── Portfolio Builder ────────────────────────────────────────────────────────

const STEPS = [
  { label: "Basic Info", icon: User },
  { label: "Education", icon: GraduationCap },
  { label: "Experience", icon: Briefcase },
  { label: "Projects", icon: Code },
  { label: "Skills", icon: Zap },
  { label: "Certifications", icon: Award },
  { label: "Achievements", icon: Star },
  { label: "Contact", icon: Mail },
];

function PortfolioBuilder({
  data, setData, onClose, onSave,
}: {
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const [step, setStep] = useState(1);
  const [previewMobile, setPreviewMobile] = useState(false);

  const upd = (k: keyof PortfolioData, v: string) => setData({ ...data, [k]: v });

  const StepComponents: Record<number, React.ReactNode> = {
    1: <Step1 data={data} upd={upd} />,
    2: <Step2 data={data} setData={setData} />,
    3: <Step3 data={data} setData={setData} />,
    4: <Step4 data={data} setData={setData} />,
    5: <Step5 data={data} setData={setData} />,
    6: <Step6 data={data} setData={setData} />,
    7: <Step7 data={data} setData={setData} />,
    8: <Step8 data={data} upd={upd} />,
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left panel: editor */}
      <div className="w-[460px] flex-shrink-0 flex flex-col border-r border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-card/50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <Zap size={13} className="text-white" />
            </div>
            <span className="font-semibold text-sm">Portfolio Builder</span>
          </div>
          <div className="flex gap-2">
            <Btn size="sm" variant="secondary" onClick={onClose}><X size={13} /> Exit</Btn>
            <Btn size="sm" onClick={onSave}><Check size={13} /> Save</Btn>
          </div>
        </div>

        {/* Step nav */}
        <div className="px-5 py-3 border-b border-border bg-background">
          <div className="flex items-center gap-0.5">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const active = i + 1 === step;
              const done = i + 1 < step;
              return (
                <button
                  key={i}
                  onClick={() => setStep(i + 1)}
                  title={s.label}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg transition-all ${
                    active
                      ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600"
                      : done
                      ? "text-emerald-500"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {done ? <Check size={12} /> : <Icon size={12} />}
                  <span style={{ fontSize: 9 }} className="hidden sm:block">{s.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-2.5 h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-violet-600 rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <h2 className="text-base font-bold mb-4">{STEPS[step - 1].label}</h2>
          {StepComponents[step]}
        </div>

        {/* Navigation footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-card/30">
          <Btn variant="secondary" size="sm" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
            <ChevronLeft size={13} /> Prev
          </Btn>
          <span className="text-xs text-muted-foreground font-medium">{step} / 8</span>
          {step < 8 ? (
            <Btn size="sm" onClick={() => setStep((s) => Math.min(8, s + 1))}>
              Next <ChevronRight size={13} />
            </Btn>
          ) : (
            <Btn size="sm" onClick={onSave}><Check size={13} /> Finish</Btn>
          )}
        </div>
      </div>

      {/* Right panel: live preview */}
      <div className="flex-1 flex flex-col bg-muted/20 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-border bg-background/80 backdrop-blur-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Preview</span>
          <div className="flex items-center gap-3">
            {/* Mobile/Desktop toggle */}
            <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setPreviewMobile(false)}
                className={`px-2.5 py-1.5 text-xs transition-all ${!previewMobile ? "bg-violet-600 text-white" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Monitor size={12} />
              </button>
              <button
                onClick={() => setPreviewMobile(true)}
                className={`px-2.5 py-1.5 text-xs transition-all ${previewMobile ? "bg-violet-600 text-white" : "text-muted-foreground hover:text-foreground"}`}
              >
                📱
              </button>
            </div>
            {/* Template dots */}
            <div className="flex gap-1.5">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setData({ ...data, template: t.id })}
                  title={t.name}
                  className={`w-4.5 h-4.5 rounded-full border-2 transition-all ${data.template === t.id ? "scale-125 border-foreground" : "border-transparent opacity-60 hover:opacity-100 hover:scale-110"}`}
                  style={{ backgroundColor: t.color, width: 18, height: 18 }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-start justify-center overflow-auto p-6">
          <div
            className={`rounded-2xl shadow-2xl border border-border overflow-hidden transition-all duration-300 ${previewMobile ? "w-72" : "w-full max-w-xl"}`}
            style={{ minHeight: 500 }}
          >
            <PortfolioPreview data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Sections ───────────────────────────────────────────────────────

function DashHome({
  portfolios,
  onNew,
  onEdit,
}: {
  portfolios: Portfolio[];
  onNew: () => void;
  onEdit: (id: string) => void;
}) {
  const stats = [
    { label: "Total Portfolios", value: portfolios.length, icon: FileText, color: "#6366f1" },
    { label: "Published", value: portfolios.filter((p) => p.data.published).length, icon: Globe, color: "#10b981" },
    { label: "Total Views", value: portfolios.reduce((a, p) => a + p.views, 0), icon: TrendingUp, color: "#f59e0b" },
    { label: "PDF Exports", value: 5, icon: Download, color: "#ec4899" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back! Here&apos;s your portfolio overview.</p>
        </div>
        <Btn onClick={onNew}><Plus size={14} /> New Portfolio</Btn>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${s.color}18` }}
              >
                <Icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </Card>
          );
        })}
      </div>

      <div>
        <h2 className="text-base font-semibold mb-3">Your Portfolios</h2>
        {portfolios.length === 0 ? (
          <Card className="text-center py-14">
            <FileText size={38} className="mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-1">No portfolios yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first professional portfolio in minutes</p>
            <Btn onClick={onNew}><Plus size={14} /> Create Portfolio</Btn>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolios.map((p) => {
              const tpl = TEMPLATES.find((t) => t.id === p.data.template) ?? TEMPLATES[0];
              return (
                <Card key={p.id} className="hover:border-violet-400/50 transition-all group cursor-pointer" >
                  <div
                    className="h-20 rounded-lg mb-3 flex items-center justify-center"
                    style={{ backgroundColor: `${tpl.color}12` }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: tpl.color }}
                    >
                      {p.title[0]}
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm">{p.title}</h3>
                  <div className="flex gap-1.5 mt-1.5">
                    <Badge color={tpl.color}>{tpl.name}</Badge>
                    {p.data.published && <Badge color="#10b981">Live</Badge>}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">{p.views} views</span>
                    <button
                      onClick={() => onEdit(p.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                    >
                      <Eye size={13} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function DashPortfolios({
  portfolios,
  onNew,
  onEdit,
  onDelete,
  onPublish,
}: {
  portfolios: Portfolio[];
  onNew: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Portfolios</h1>
        <Btn onClick={onNew}><Plus size={14} /> New Portfolio</Btn>
      </div>

      {portfolios.length === 0 ? (
        <Card className="text-center py-16">
          <FileText size={40} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No portfolios yet</h3>
          <p className="text-sm text-muted-foreground mb-5">Start by creating your first portfolio</p>
          <Btn onClick={onNew}><Plus size={14} /> Create Portfolio</Btn>
        </Card>
      ) : (
        <div className="space-y-3">
          {portfolios.map((p) => {
            const tpl = TEMPLATES.find((t) => t.id === p.data.template) ?? TEMPLATES[0];
            return (
              <Card key={p.id} className="flex items-center gap-4 hover:border-violet-400/40 transition-all">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: tpl.color }}
                >
                  {p.title[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm">{p.title}</h3>
                    <Badge color={tpl.color}>{tpl.name}</Badge>
                    {p.data.published && <Badge color="#10b981">Live</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {p.views} views · Edited {p.lastEdited}
                  </p>
                  {p.data.published && p.data.publishedUrl && (
                    <span className="text-xs text-violet-500">{p.data.publishedUrl}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Btn size="sm" variant="ghost" onClick={() => onEdit(p.id)}><Eye size={13} /></Btn>
                  <Btn size="sm" variant="ghost" onClick={() => onPublish(p.id)}>
                    <Globe size={13} /> {p.data.published ? "Unpublish" : "Publish"}
                  </Btn>
                  <Btn size="sm" variant="ghost" onClick={() => toast.success("PDF generated!")}><Download size={13} /></Btn>
                  <Btn size="sm" variant="ghost" onClick={() => onDelete(p.id)} className="hover:!text-red-500">
                    <Trash2 size={13} />
                  </Btn>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DashTemplates({
  selected,
  onSelect,
}: {
  selected: TplId;
  onSelect: (id: TplId) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Template Marketplace</h1>
        <p className="text-sm text-muted-foreground mt-1">Choose a template for your next portfolio</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TEMPLATES.map((t) => (
          <div
            key={t.id}
            onClick={() => { onSelect(t.id); toast.success(`Template "${t.name}" selected!`); }}
            className={`rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-[1.01] group ${
              selected === t.id
                ? "border-violet-500 shadow-lg shadow-violet-500/15"
                : "border-border hover:border-violet-400/50"
            }`}
          >
            {/* Thumbnail */}
            <div className="h-44 flex flex-col p-5 gap-2" style={{ backgroundColor: `${t.color}12` }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                <div className="space-y-1 flex-1">
                  <div className="h-2 rounded-full" style={{ backgroundColor: `${t.color}50`, width: "60%" }} />
                  <div className="h-1.5 rounded-full bg-current/15" style={{ width: "40%" }} />
                </div>
              </div>
              <div className="space-y-1.5 mt-1">
                {[80, 65, 50].map((w, i) => (
                  <div key={i} className="h-1.5 rounded-full bg-current/10" style={{ width: `${w}%` }} />
                ))}
              </div>
              <div className="flex gap-1.5 mt-1">
                {["React", "TS", "Node"].map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: `${t.color}80`, fontSize: 9 }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 bg-card border-t border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{t.name}</h3>
                {selected === t.id ? (
                  <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: t.color }}>
                    Active
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground group-hover:text-violet-500 transition-colors">Select →</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashAnalytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Views", value: "1,247", trend: "+12.3%", color: "#6366f1" },
          { label: "Unique Visitors", value: "891", trend: "+8.7%", color: "#10b981" },
          { label: "Avg. Time on Page", value: "2m 34s", trend: "+5.1%", color: "#f59e0b" },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">{s.value}</span>
              <span className="text-xs text-emerald-500 font-medium">{s.trend}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-sm font-semibold mb-4">Views & Visitors — June 2026</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={ANALYTICS_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Area type="monotone" dataKey="views" stroke="#6366f1" fill="url(#gViews)" strokeWidth={2} name="Views" />
            <Area type="monotone" dataKey="visitors" stroke="#10b981" fill="url(#gVisitors)" strokeWidth={2} strokeDasharray="5 4" name="Visitors" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {[
              { label: "Direct", pct: 45, color: "#6366f1" },
              { label: "LinkedIn", pct: 28, color: "#0077b5" },
              { label: "GitHub", pct: 15, color: "#333" },
              { label: "Other", pct: 12, color: "#9ca3af" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-medium">{s.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold mb-4">Device Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: "Desktop", pct: 62, color: "#6366f1" },
              { label: "Mobile", pct: 28, color: "#ec4899" },
              { label: "Tablet", pct: 10, color: "#10b981" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-medium">{s.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function DashAI({ data, setData }: { data: PortfolioData; setData: (d: PortfolioData) => void }) {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [level, setLevel] = useState("Mid-level");
  const [projName, setProjName] = useState("");
  const [projTech, setProjTech] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const generate = (type: string) => {
    setLoading(type);
    setTimeout(() => {
      let result = "";
      if (type === "about") {
        result = `${level} ${role || "Software Developer"} with deep expertise in ${skills || "modern web technologies"}. Passionate about building scalable, user-centric products that solve real problems. I thrive at the intersection of clean architecture and exceptional user experience, with a relentless focus on quality and continuous improvement.`;
      } else if (type === "project") {
        result = `${projName || "This project"} is a production-grade application built with ${projTech || "React and Node.js"}. It features a responsive, accessible interface, real-time data synchronization, and a robust API layer optimized for performance at scale. Designed with maintainability and developer experience as first-class priorities.`;
      } else if (type === "skills") {
        result = `Based on your profile as a ${role || "developer"}, consider adding: TypeScript, REST & GraphQL APIs, Git & CI/CD, Docker & Kubernetes, Testing (Jest/Playwright), System Design, Agile/Scrum.`;
      }
      setResults((prev) => ({ ...prev, [type]: result }));
      setLoading(null);
      toast.success("AI content ready!");
    }, 1600);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
          <Sparkles size={17} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Content Assistant</h1>
          <p className="text-sm text-muted-foreground">Generate polished professional content in seconds</p>
        </div>
      </div>

      {/* About generator */}
      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm"><User size={15} /> About Me Generator</h3>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <Field label="Your Role" value={role} onChange={setRole} placeholder="Frontend Developer" />
          <Field label="Key Skills" value={skills} onChange={setSkills} placeholder="React, TypeScript" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            >
              {["Junior", "Mid-level", "Senior", "Lead / Staff"].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
        <Btn onClick={() => generate("about")} disabled={loading === "about"}>
          <Sparkles size={13} /> {loading === "about" ? "Generating…" : "Generate About Me"}
        </Btn>
        {results.about && (
          <div className="mt-3 p-3.5 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/50">
            <p className="text-sm leading-relaxed">{results.about}</p>
            <Btn
              size="sm"
              className="mt-3"
              onClick={() => { setData({ ...data, about: results.about }); toast.success("About section updated!"); }}
            >
              <Check size={12} /> Apply to Portfolio
            </Btn>
          </div>
        )}
      </Card>

      {/* Project description */}
      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm"><Code size={15} /> Project Description Generator</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Project Name" value={projName} onChange={setProjName} placeholder="E-Commerce Platform" />
          <Field label="Technologies" value={projTech} onChange={setProjTech} placeholder="React, Stripe, PostgreSQL" />
        </div>
        <Btn onClick={() => generate("project")} disabled={loading === "project"}>
          <Sparkles size={13} /> {loading === "project" ? "Generating…" : "Generate Description"}
        </Btn>
        {results.project && (
          <div className="mt-3 p-3.5 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/50">
            <p className="text-sm leading-relaxed">{results.project}</p>
          </div>
        )}
      </Card>

      {/* Skill suggestions */}
      <Card>
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm"><Zap size={15} /> Skill Suggestions</h3>
        <Btn onClick={() => generate("skills")} disabled={loading === "skills"}>
          <Sparkles size={13} /> {loading === "skills" ? "Analyzing…" : "Suggest Skills"}
        </Btn>
        {results.skills && (
          <div className="mt-3 p-3.5 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/50">
            <p className="text-sm">{results.skills}</p>
          </div>
        )}
      </Card>
    </div>
  );
}

function DashSettings({
  darkMode,
  setDarkMode,
  data,
  setData,
}: {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
}) {
  const ACCENT_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];
  const FONT_OPTIONS = [
    { id: "sans", label: "Modern Sans", sample: "DM Sans" },
    { id: "serif", label: "Classic Serif", sample: "Georgia" },
    { id: "mono", label: "Technical Mono", sample: "Monospace" },
  ];

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Appearance */}
      <Card>
        <h3 className="font-semibold mb-4 text-sm">Appearance</h3>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium">{darkMode ? "Dark Mode" : "Light Mode"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Switch interface theme instantly</p>
          </div>
          <Toggle checked={darkMode} onChange={setDarkMode} />
        </div>
      </Card>

      {/* Portfolio customization */}
      <Card>
        <h3 className="font-semibold mb-5 text-sm">Portfolio Customization</h3>

        <div className="mb-5">
          <p className="text-sm font-medium mb-2.5">Accent Color</p>
          <div className="flex gap-2.5">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setData({ ...data, accentColor: c })}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  data.accentColor === c ? "border-foreground scale-110 shadow-sm" : "border-transparent hover:scale-105 hover:border-border"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2.5">Font Style</p>
          <div className="grid grid-cols-3 gap-2.5">
            {FONT_OPTIONS.map((f) => (
              <button
                key={f.id}
                onClick={() => setData({ ...data, fontChoice: f.id })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  data.fontChoice === f.id
                    ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                    : "border-border hover:border-violet-400/50"
                }`}
                style={{
                  fontFamily:
                    f.id === "serif" ? "Georgia, serif" : f.id === "mono" ? "monospace" : "inherit",
                }}
              >
                <p className="font-medium text-xs">{f.label}</p>
                <p className="text-xs text-muted-foreground mt-1 opacity-70">Aa Bb Cc</p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Account */}
      <Card>
        <h3 className="font-semibold mb-4 text-sm">Account</h3>
        <div className="space-y-2 divide-y divide-border">
          <div className="flex items-center justify-between pb-3">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-xs text-muted-foreground">alex@example.com</p>
            </div>
            <Btn size="sm" variant="secondary">Change</Btn>
          </div>
          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
            </div>
            <Btn size="sm" variant="secondary">Update</Btn>
          </div>
        </div>
      </Card>

      {/* Plan */}
      <Card className="border-violet-500/30 bg-violet-50/60 dark:bg-violet-900/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm">Free Plan</h3>
              <Badge color="#6366f1">Current</Badge>
            </div>
            <p className="text-xs text-muted-foreground">3 portfolios · 100MB storage · Core features</p>
          </div>
          <Btn onClick={() => toast.success("Opening Pro plan…")} className="flex-shrink-0">
            <Star size={13} /> Upgrade to Pro
          </Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── Dashboard Layout ─────────────────────────────────────────────────────────

function DashboardLayout({
  user, darkMode, setDarkMode, onLogout, children, tab, setTab,
}: {
  user: { name: string; email: string };
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  onLogout: () => void;
  children: React.ReactNode;
  tab: DashTab;
  setTab: (t: DashTab) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const navItems: Array<{ id: DashTab; label: string; icon: typeof LayoutDashboard }> = [
    { id: "home", label: "Dashboard", icon: LayoutDashboard },
    { id: "portfolios", label: "My Portfolios", icon: FileText },
    { id: "templates", label: "Templates", icon: Layers },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "ai", label: "AI Assistant", icon: Sparkles },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-sidebar border-r border-sidebar-border flex-shrink-0 transition-all duration-300 ${collapsed ? "w-14" : "w-56"}`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-2.5 px-4 py-4 border-b border-sidebar-border ${collapsed ? "justify-center" : ""}`}>
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
            <Zap size={13} className="text-white" />
          </div>
          {!collapsed && <span className="font-bold text-sm text-sidebar-foreground">PortfolioForge</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                tab === id
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-600/25"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon size={15} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom controls */}
        <div className={`px-2 pb-3 border-t border-sidebar-border pt-3 space-y-0.5`}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-all ${collapsed ? "justify-center" : ""}`}
          >
            {darkMode ? <Sun size={15} className="flex-shrink-0" /> : <Moon size={15} className="flex-shrink-0" />}
            {!collapsed && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
          </button>
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-red-500/10 hover:text-red-500 transition-all ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={15} className="flex-shrink-0" />
            {!collapsed && <span>Log Out</span>}
          </button>
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-3 pt-2 mt-1">
              <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.name[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center gap-3 px-5 py-3 bg-background/80 backdrop-blur-md border-b border-border">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
          >
            <Menu size={15} />
          </button>
          <div className="flex-1" />
          <button className="relative p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-violet-600" />
          </button>
        </div>

        <div className="flex-1 px-6 py-6">{children}</div>
      </main>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

function LandingPage({
  onLogin,
  onSignup,
  darkMode,
  setDarkMode,
}: {
  onLogin: () => void;
  onSignup: () => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}) {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const features = [
    { icon: Code, title: "No-Code Builder", desc: "Drag-and-drop portfolio creation without writing a single line of code." },
    { icon: Sparkles, title: "AI Content Assistant", desc: "Generate professional bios, project descriptions, and skill suggestions." },
    { icon: Eye, title: "Live Preview", desc: "Every change renders in real-time across 5 professional templates." },
    { icon: Download, title: "Export PDF", desc: "Download a beautifully formatted portfolio resume with one click." },
    { icon: Globe, title: "Publish Online", desc: "Get a shareable portfolioforge.app URL in under a minute." },
    { icon: Palette, title: "Premium Templates", desc: "Developer, Designer, Researcher, Creative, and Minimal templates." },
  ];

  const faqs = [
    { q: "Is PortfolioForge free to use?", a: "Yes — the free plan supports up to 3 portfolios with core features. Pro unlocks unlimited portfolios, custom domains, and advanced analytics." },
    { q: "Can I export my portfolio as a PDF?", a: "Absolutely. One click generates a professionally formatted PDF that works as both a portfolio and a resume." },
    { q: "How does the AI Assistant work?", a: "The AI analyzes your role, skills, and experience level to write polished content. Everything it generates is editable before you apply it." },
    { q: "Can I switch templates after publishing?", a: "Yes. Templates can be switched at any time, and your published URL stays the same." },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold">PortfolioForge</span>
        </div>
        <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          {["Features", "Templates", "Pricing"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-foreground transition-colors">
              {l}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground">
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <Btn variant="ghost" size="sm" onClick={onLogin}>Log in</Btn>
          <Btn size="sm" onClick={onSignup}>Get Started</Btn>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 md:px-12 pt-20 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.12),transparent)] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/8 text-violet-600 dark:text-violet-400 text-xs font-medium mb-6">
            <Sparkles size={11} /> AI-Powered Portfolio Builder
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 leading-[1.1]">
            Build a Professional<br />
            <span className="text-violet-600">Portfolio Website</span><br />
            in Minutes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Choose a template, customize your content, and publish your portfolio without writing a single line of code.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Btn size="lg" onClick={onSignup}>Start Building <ArrowRight size={15} /></Btn>
            <Btn size="lg" variant="secondary" onClick={onSignup}>Explore Templates</Btn>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Free forever · No credit card required</p>
        </div>

        {/* Hero browser mockup */}
        <div className="relative max-w-4xl mx-auto mt-14">
          <div className="rounded-2xl border border-border overflow-hidden shadow-2xl bg-card">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-muted/50">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-background text-xs text-muted-foreground border border-border">
                  portfolioforge.app/alex-chen
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 min-h-[200px]">
              <div className="border-r border-border p-4 bg-muted/20">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Editor</p>
                {[{ l: "Name", v: "Alex Chen" }, { l: "Tagline", v: "Full-Stack Dev" }, { l: "Template", v: "Developer" }].map((f) => (
                  <div key={f.l} className="mb-2.5">
                    <p className="text-xs text-muted-foreground mb-0.5">{f.l}</p>
                    <div className="h-7 rounded-md border border-border bg-background px-2 flex items-center text-xs">{f.v}</div>
                  </div>
                ))}
              </div>
              <div className="col-span-2 p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Live Preview</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">A</div>
                  <div>
                    <p className="font-bold text-sm">Alex Chen</p>
                    <p className="text-xs text-muted-foreground">Full-Stack Developer · React & Node.js</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {["React", "TypeScript", "Node.js", "PostgreSQL"].map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-full text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="space-y-2">
                  {[85, 70, 55].map((w, i) => (
                    <div key={i} className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-violet-600/50" style={{ width: `${w}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Everything you need to stand out</h2>
            <p className="text-muted-foreground">A complete platform built for modern professionals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-5 rounded-xl border border-border hover:border-violet-400/40 bg-card hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-3">
                  <Icon size={17} className="text-violet-600" />
                </div>
                <h3 className="font-semibold mb-1 text-sm">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="px-6 md:px-12 py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">5 professional templates</h2>
            <p className="text-muted-foreground">Each designed for a specific profession and style</p>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x -mx-2 px-2">
            {TEMPLATES.map((t) => (
              <div key={t.id} className="flex-shrink-0 w-44 snap-start">
                <div
                  className="h-28 rounded-t-xl flex items-center justify-center"
                  style={{ backgroundColor: `${t.color}18` }}
                >
                  <div className="w-10 h-10 rounded-full" style={{ backgroundColor: t.color }} />
                </div>
                <div className="p-3 rounded-b-xl border border-t-0 border-border bg-card">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Loved by professionals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Sarah Kim", role: "Frontend Developer at Stripe", text: "PortfolioForge helped me land my dream job. The AI assistant wrote better descriptions than I ever could." },
              { name: "Marcus Johnson", role: "UX Designer at Figma", text: "I had a gorgeous portfolio live in under an hour. The templates are beautiful and customization is seamless." },
              { name: "Priya Patel", role: "Data Scientist at DeepMind", text: "The analytics showed recruiters were spending 3+ minutes on my portfolio. Never had that kind of insight before." },
            ].map((t) => (
              <Card key={t.name}>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 md:px-12 py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Simple, honest pricing</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Free", price: "$0", period: "forever",
                features: ["3 portfolios", "All 5 templates", "PDF export", "portfolioforge.app URL", "Basic analytics"],
                cta: "Get Started Free", highlight: false,
              },
              {
                name: "Pro", price: "$9", period: "per month",
                features: ["Unlimited portfolios", "Custom domain", "Advanced analytics", "AI assistant (unlimited)", "Priority support", "Early access to new templates"],
                cta: "Start 14-Day Free Trial", highlight: true,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-7 border ${plan.highlight ? "border-violet-500 bg-violet-50/80 dark:bg-violet-900/10 shadow-lg shadow-violet-500/10" : "border-border bg-card"}`}
              >
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <Check size={13} className="text-emerald-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Btn
                  className="w-full justify-center"
                  variant={plan.highlight ? "primary" : "secondary"}
                  onClick={onSignup}
                >
                  {plan.cta}
                </Btn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently asked questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/40 transition-colors"
                >
                  <span className="font-medium text-sm">{faq.q}</span>
                  {faqOpen === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <AnimatePresence>
                  {faqOpen === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-20 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to build your portfolio?</h2>
          <p className="text-muted-foreground mb-8">Join thousands of professionals who already use PortfolioForge.</p>
          <Btn size="lg" onClick={onSignup}>Start Building for Free <ArrowRight size={15} /></Btn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 md:px-12 py-7">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center">
              <Zap size={11} className="text-white" />
            </div>
            <span className="font-semibold text-sm">PortfolioForge</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 PortfolioForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// ─── Auth Pages ───────────────────────────────────────────────────────────────

function AuthLayout({
  children, darkMode, setDarkMode, onBack,
}: {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(124,58,237,0.08),transparent)] pointer-events-none" />
      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground">
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
      <div className="w-full max-w-sm relative">
        {children}
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-5 mx-auto">
          <ChevronLeft size={11} /> Back to home
        </button>
      </div>
    </div>
  );
}

function LoginPage({
  onLogin,
  onGoSignup,
  onBack,
  darkMode,
  setDarkMode,
}: {
  onLogin: (name: string, email: string) => void;
  onGoSignup: () => void;
  onBack: () => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    setTimeout(() => { onLogin("Alex Chen", email); toast.success("Welcome back!"); }, 900);
  };

  return (
    <AuthLayout darkMode={darkMode} setDarkMode={setDarkMode} onBack={onBack}>
      <div className="text-center mb-7">
        <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center mx-auto mb-4">
          <Zap size={17} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
      </div>
      <Card>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@example.com" />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Password</label>
              <button type="button" className="text-xs text-violet-600 hover:underline">Forgot?</button>
            </div>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 pr-10 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Eye size={13} />
              </button>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-border accent-violet-600"
            />
            <span className="text-sm text-muted-foreground">Remember me</span>
          </label>
          <Btn type="submit" className="w-full justify-center" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Btn>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center">
            <span className="bg-card px-2 text-xs text-muted-foreground">or</span>
          </div>
        </div>

        <button
          onClick={() => { setLoading(true); setTimeout(() => onLogin("Alex Chen", "alex@gmail.com"), 800); }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-all text-sm"
        >
          <svg width="15" height="15" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>
      </Card>
      <p className="text-center text-sm text-muted-foreground mt-4">
        Don&apos;t have an account?{" "}
        <button onClick={onGoSignup} className="text-violet-600 hover:underline font-medium">Sign up free</button>
      </p>
    </AuthLayout>
  );
}

function SignupPage({
  onSignup,
  onGoLogin,
  onBack,
  darkMode,
  setDarkMode,
}: {
  onSignup: (name: string, email: string) => void;
  onGoLogin: () => void;
  onBack: () => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#10b981", "#6366f1"][strength];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error("Please fill in all fields"); return; }
    if (password !== confirm) { toast.error("Passwords don't match"); return; }
    if (strength < 2) { toast.error("Please use a stronger password"); return; }
    setLoading(true);
    setTimeout(() => { onSignup(name, email); toast.success("Account created! Welcome to PortfolioForge 🎉"); }, 1000);
  };

  return (
    <AuthLayout darkMode={darkMode} setDarkMode={setDarkMode} onBack={onBack}>
      <div className="text-center mb-7">
        <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center mx-auto mb-4">
          <Zap size={17} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Start building for free</p>
      </div>
      <Card>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Full Name" value={name} onChange={setName} placeholder="Alex Chen" />
          <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@example.com" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 pr-10 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Eye size={13} />
              </button>
            </div>
            {password && (
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${strength * 25}%`, backgroundColor: strengthColor }}
                  />
                </div>
                <span className="text-xs font-medium" style={{ color: strengthColor }}>{strengthLabel}</span>
              </div>
            )}
          </div>
          <Field label="Confirm Password" value={confirm} onChange={setConfirm} type="password" placeholder="••••••••" />
          <Btn type="submit" className="w-full justify-center" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </Btn>
        </form>
      </Card>
      <p className="text-center text-sm text-muted-foreground mt-4">
        Already have an account?{" "}
        <button onClick={onGoLogin} className="text-violet-600 hover:underline font-medium">Log in</button>
      </p>
    </AuthLayout>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try { return localStorage.getItem("pf-theme") !== "light"; } catch { return true; }
  });
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [dashTab, setDashTab] = useState<DashTab>("home");
  const [portfolios, setPortfolios] = useState<Portfolio[]>(DEMO_PORTFOLIOS);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(EMPTY_PORTFOLIO);
  const [isBuilding, setIsBuilding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Sync dark class on html element
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
    try { localStorage.setItem("pf-theme", darkMode ? "dark" : "light"); } catch { /* noop */ }
  }, [darkMode]);

  const handleLogin = (name: string, email: string) => {
    setUser({ name, email });
    setView("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setView("landing");
    toast.success("Logged out successfully");
  };

  const startNewPortfolio = () => {
    setPortfolioData({ ...EMPTY_PORTFOLIO });
    setEditingId(null);
    setIsBuilding(true);
  };

  const editPortfolio = (id: string) => {
    const p = portfolios.find((p) => p.id === id);
    if (!p) return;
    setPortfolioData({ ...p.data });
    setEditingId(id);
    setIsBuilding(true);
  };

  const savePortfolio = () => {
    const title = portfolioData.name || "Untitled Portfolio";
    if (editingId) {
      setPortfolios((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, title, data: portfolioData, lastEdited: "just now" } : p))
      );
      toast.success("Portfolio saved!");
    } else {
      const newP: Portfolio = { id: uid(), title, data: portfolioData, views: 0, lastEdited: "just now" };
      setPortfolios((prev) => [...prev, newP]);
      toast.success("Portfolio created!");
    }
    setIsBuilding(false);
    setEditingId(null);
    setDashTab("portfolios");
  };

  const deletePortfolio = (id: string) => {
    setPortfolios((prev) => prev.filter((p) => p.id !== id));
    toast.success("Portfolio deleted");
  };

  const togglePublish = (id: string) => {
    setPortfolios((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const published = !p.data.published;
        const publishedUrl = published ? `portfolioforge.app/${p.title.toLowerCase().replace(/\s+/g, "-")}` : "";
        if (published) toast.success(`Portfolio published! URL: ${publishedUrl}`);
        else toast.success("Portfolio unpublished");
        return { ...p, data: { ...p.data, published, publishedUrl } };
      })
    );
  };

  const activeTemplate = portfolios[0]?.data.template ?? "developer";
  const setActiveTemplate = (id: TplId) => {
    setPortfolioData((d) => ({ ...d, template: id }));
  };

  // Builder view
  if (isBuilding) {
    return (
      <>
        <Toaster richColors position="top-right" />
        <PortfolioBuilder
          data={portfolioData}
          setData={setPortfolioData}
          onClose={() => setIsBuilding(false)}
          onSave={savePortfolio}
        />
      </>
    );
  }

  // Landing
  if (view === "landing") {
    return (
      <>
        <Toaster richColors position="top-right" />
        <LandingPage onLogin={() => setView("login")} onSignup={() => setView("signup")} darkMode={darkMode} setDarkMode={setDarkMode} />
      </>
    );
  }

  // Login
  if (view === "login") {
    return (
      <>
        <Toaster richColors position="top-right" />
        <LoginPage
          onLogin={handleLogin}
          onGoSignup={() => setView("signup")}
          onBack={() => setView("landing")}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </>
    );
  }

  // Signup
  if (view === "signup") {
    return (
      <>
        <Toaster richColors position="top-right" />
        <SignupPage
          onSignup={handleLogin}
          onGoLogin={() => setView("login")}
          onBack={() => setView("landing")}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </>
    );
  }

  // Dashboard
  const loggedInUser = user ?? { name: "Alex Chen", email: "alex@example.com" };

  const dashContent = (() => {
    if (dashTab === "home") return <DashHome portfolios={portfolios} onNew={startNewPortfolio} onEdit={editPortfolio} />;
    if (dashTab === "portfolios") return (
      <DashPortfolios
        portfolios={portfolios}
        onNew={startNewPortfolio}
        onEdit={editPortfolio}
        onDelete={deletePortfolio}
        onPublish={togglePublish}
      />
    );
    if (dashTab === "templates") return (
      <DashTemplates
        selected={activeTemplate}
        onSelect={setActiveTemplate}
      />
    );
    if (dashTab === "analytics") return <DashAnalytics />;
    if (dashTab === "ai") return <DashAI data={portfolioData} setData={setPortfolioData} />;
    if (dashTab === "settings") return (
      <DashSettings
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        data={portfolioData}
        setData={setPortfolioData}
      />
    );
    return null;
  })();

  return (
    <>
      <Toaster richColors position="top-right" />
      <DashboardLayout
        user={loggedInUser}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLogout={handleLogout}
        tab={dashTab}
        setTab={setDashTab}
      >
        {dashContent}
      </DashboardLayout>
    </>
  );
}
