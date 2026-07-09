import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MessageCircle,
  Settings,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  Activity,
  TrendingUp,
  Send,
  ArrowRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type View = "home" | "chat" | "account" | "support";

const Wordmark = () => (
  <span className="font-display text-xl font-bold tracking-tight text-charcoal">
    carbn<span className="text-primary">.</span>
  </span>
);

const nav: { id: View; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Dashboard", icon: LayoutDashboard },
  { id: "chat", label: "Chat with Daniel", icon: MessageCircle },
  { id: "account", label: "Account settings", icon: Settings },
  { id: "support", label: "Contact support", icon: LifeBuoy },
];

const CAPACITY_SCORE = 68;

const formatWhen = (iso: string | null) => {
  if (!iso) return "Just now";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

const HomeView = ({ firstName, onOpenChat }: { firstName: string; onOpenChat: () => void }) => {
  const joinedAt = localStorage.getItem("carbn_joined_at");
  const activity = [
    { title: "Morning check-in logged", when: "2 hr ago", icon: Activity },
    { title: "Capacity score updated", when: formatWhen(joinedAt), icon: TrendingUp },
    { title: "Chat with Daniel", when: "Yesterday", icon: MessageCircle },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Welcome back</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
          Hello, {firstName}.
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Current Capacity Score
              </p>
              <p className="mt-3 font-display text-6xl font-semibold text-charcoal">
                {CAPACITY_SCORE}
                <span className="ml-1 text-2xl text-muted-foreground">/100</span>
              </p>
              <p className="mt-2 text-sm text-primary">Steady — on track this week</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Activity className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${CAPACITY_SCORE}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Last score update: {formatWhen(joinedAt)}
          </p>
        </div>

        <button
          onClick={onOpenChat}
          className="group flex flex-col justify-between rounded-3xl bg-charcoal p-6 text-left text-on-charcoal shadow-card transition-transform hover:-translate-y-1"
        >
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <MessageCircle className="h-5 w-5" />
            </div>
            <p className="mt-6 font-display text-2xl font-semibold leading-tight">
              Chat with Daniel
            </p>
            <p className="mt-2 text-sm text-white/70">
              Your AI performance coach — ready when you are.
            </p>
          </div>
          <span className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
            Open chat <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-charcoal">Recent activity</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Last 7 days
          </span>
        </div>
        <ul className="divide-y divide-border">
          {activity.map(({ title, when, icon: Icon }) => (
            <li key={title} className="flex items-center gap-4 py-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-charcoal">{title}</p>
              </div>
              <span className="text-xs text-muted-foreground">{when}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ChatView = ({ firstName }: { firstName: string }) => {
  const [messages, setMessages] = useState<{ from: "user" | "daniel"; text: string }[]>([
    { from: "daniel", text: `Hey ${firstName} — how did today go? Sleep, energy, anything on your mind?` },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "daniel",
          text: "Got it. I'll factor that into tomorrow's plan. Aim for 7+ hours tonight and a 20-minute walk after lunch.",
        },
      ]);
    }, 700);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-semibold text-charcoal">Chat with Daniel</h1>
        <p className="text-sm text-muted-foreground">Your AI Human Performance Coach.</p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto rounded-3xl border border-border bg-card p-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.from === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-charcoal"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message Daniel…"
          className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-sm text-charcoal outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-primary-foreground transition-colors hover:bg-[hsl(var(--primary-hover))]"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

const AccountView = ({ firstName }: { firstName: string }) => {
  const [name, setName] = useState(firstName);
  const [email, setEmail] = useState(localStorage.getItem("carbn_user_email") || "");

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("carbn_user_firstname", name.trim() || "there");
    localStorage.setItem("carbn_user_email", email.trim());
    toast({ title: "Saved", description: "Your account has been updated." });
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-charcoal">Account settings</h1>
        <p className="text-sm text-muted-foreground">Update your profile details.</p>
      </div>
      <form onSubmit={save} className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            First name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-primary px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-primary-foreground hover:bg-[hsl(var(--primary-hover))]"
        >
          Save changes
        </button>
      </form>
    </div>
  );
};

const SupportView = () => (
  <div className="max-w-xl space-y-6">
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal">Contact support</h1>
      <p className="text-sm text-muted-foreground">
        We reply within one business day.
      </p>
    </div>
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <p className="text-sm text-muted-foreground">Email</p>
      <a
        href="mailto:support@carbn.app"
        className="mt-1 block font-display text-xl font-semibold text-charcoal hover:text-primary"
      >
        support@carbn.app
      </a>
      <p className="mt-6 text-sm text-muted-foreground">Founding beta members</p>
      <p className="mt-1 text-sm text-charcoal">
        You have direct access to the founder — reply to any onboarding email.
      </p>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const firstName = localStorage.getItem("carbn_user_firstname") || "there";

  useEffect(() => {
    if (!localStorage.getItem("carbn_user_firstname")) {
      navigate("/");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("carbn_user_firstname");
    localStorage.removeItem("carbn_user_email");
    localStorage.removeItem("carbn_joined_at");
    navigate("/");
  };

  const go = (v: View) => {
    setView(v);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-charcoal md:flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-border bg-card transition-transform md:sticky md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Wordmark />
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-muted-foreground md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = view === n.id;
            return (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-charcoal"
                }`}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-charcoal"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col md:ml-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-charcoal"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Wordmark />
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 p-6 md:p-10">
          {view === "home" && <HomeView firstName={firstName} onOpenChat={() => go("chat")} />}
          {view === "chat" && <ChatView firstName={firstName} />}
          {view === "account" && <AccountView firstName={firstName} />}
          {view === "support" && <SupportView />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
