import { AnimatePresence, motion } from "framer-motion";
import {
  Clock3,
  Globe2,
  Inbox,
  LayoutDashboard,
  Lock,
  MapPin,
  MessageSquareText,
  RefreshCw,
  SendHorizontal,
  Shield,
  UserRound,
  Users,
  X,
} from "lucide-react";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../utils/cn";

const ADMIN_KEY_STORAGE_KEY = "fiora-message-admin-key";
const THREADS_REFRESH_MS = 12_000;
const MAX_ADMIN_REPLY_LENGTH = 280;
const DATE_RANGE_OPTIONS: Array<{ value: DateRangeFilter; label: string }> = [
  { value: "all", label: "All time" },
  { value: "24h", label: "Last 24h" },
  { value: "7d", label: "Last 7d" },
  { value: "30d", label: "Last 30d" },
];

type AdminTab = "overview" | "visitors" | "inbox";
type DateRangeFilter = "all" | "24h" | "7d" | "30d";
type ThreadStatusFilter =
  | "all"
  | "open"
  | "handled"
  | "archived"
  | "needs_reply";

type DashboardMetric = {
  label: string;
  count: number;
};

type DashboardFilterOptions = {
  countries: string[];
  pages: string[];
  referrers: string[];
};

type DashboardFilters = {
  country: string;
  page: string;
  referrer: string;
  dateRange: DateRangeFilter;
};

type DashboardTrendPoint = {
  key: string;
  label: string;
  visits: number;
  conversations: number;
};

type DashboardVisitor = {
  visitor_key: string;
  visit_count: number;
  first_seen_at: string;
  last_seen_at: string;
  total_duration_seconds: number;
  latest_duration_seconds: number;
  latest_country: string | null;
  latest_region: string | null;
  latest_city: string | null;
  latest_guide_page: string;
  latest_pathname: string;
  latest_referrer_label: string;
  latest_referrer: string | null;
  latest_user_agent: string | null;
  has_conversation: boolean;
  needs_reply: boolean;
};

type DashboardOverview = {
  visit_events: number;
  unique_visitors: number;
  unique_visitors_24h: number;
  active_countries: number;
  total_duration_seconds: number;
  average_duration_seconds: number;
  conversations: number;
  conversations_24h: number;
  waiting_replies: number;
  open_threads: number;
  handled_threads: number;
  archived_threads: number;
};

type DashboardPayload = {
  ok?: boolean;
  generatedAt?: string;
  filtersApplied?: DashboardFilters;
  filterOptions?: DashboardFilterOptions;
  overview?: DashboardOverview;
  topCountries?: DashboardMetric[];
  topPages?: DashboardMetric[];
  topReferrers?: DashboardMetric[];
  activityByDay?: DashboardTrendPoint[];
  recentVisitors?: DashboardVisitor[];
  recentThreads?: ChatThread[];
  issues?: {
    visits?: string | null;
    chat?: string | null;
  };
  reason?: string;
};

type ChatThread = {
  id: number;
  thread_token: string;
  created_at: string;
  updated_at: string;
  nickname: string | null;
  contact: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  status: string | null;
  last_message_preview: string | null;
  last_visitor_message_at: string | null;
  last_admin_message_at: string | null;
};

type ChatMessage = {
  id: number;
  created_at: string;
  author: "visitor" | "admin";
  content: string;
};

type ThreadsPayload = {
  ok?: boolean;
  adminMode?: boolean;
  threads?: ChatThread[];
  reason?: string;
};

type ConversationPayload = {
  ok?: boolean;
  adminMode?: boolean;
  thread?: ChatThread;
  messages?: ChatMessage[];
  reason?: string;
};

type ThreadDeletePayload = {
  ok?: boolean;
  deletedThreadId?: number;
  reason?: string;
};

type LoadState = "idle" | "loading" | "ready" | "error";

type MessagesAdminPanelProps = {
  onClose: () => void;
  initialTab?: AdminTab;
  standalone?: boolean;
};

function getRequestedAdminTab(): AdminTab | null {
  if (typeof window === "undefined") {
    return null;
  }

  const adminView = new URLSearchParams(window.location.search).get("admin");

  if (adminView === "messages") {
    return "inbox";
  }

  if (adminView === "visitors") {
    return "visitors";
  }

  if (adminView === "dashboard") {
    return "overview";
  }

  return null;
}

function formatParisTime(value: string | null) {
  if (!value) {
    return "Unknown time";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "Europe/Paris",
  }).format(date);
}

function formatLocation(thread: ChatThread) {
  const parts = [thread.country, thread.region, thread.city].filter(Boolean);
  return parts.length ? parts.join(" / ") : "Unknown location";
}

function formatDuration(seconds: number | null | undefined) {
  const safeValue = Number(seconds || 0);

  if (!Number.isFinite(safeValue) || safeValue <= 0) {
    return "0s";
  }

  if (safeValue >= 3600) {
    const hours = Math.floor(safeValue / 3600);
    const minutes = Math.floor((safeValue % 3600) / 60);
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  }

  if (safeValue >= 60) {
    const minutes = Math.floor(safeValue / 60);
    const remainingSeconds = safeValue % 60;
    return `${minutes}m ${String(remainingSeconds).padStart(2, "0")}s`;
  }

  return `${safeValue}s`;
}

function threadNeedsReply(thread: ChatThread) {
  if (thread.status === "handled" || thread.status === "archived") {
    return false;
  }

  if (!thread.last_visitor_message_at) {
    return false;
  }

  if (!thread.last_admin_message_at) {
    return true;
  }

  return (
    new Date(thread.last_visitor_message_at).getTime() >
    new Date(thread.last_admin_message_at).getTime()
  );
}

function reasonToMessage(reason?: string | null) {
  switch (reason) {
    case "missing_admin_key_env":
      return "The server has not picked up MESSAGE_ADMIN_KEY yet. Redeploy Vercel, then try again.";
    case "chat_schema_missing":
      return "Chat tables are missing in Supabase.";
    case "visit_schema_missing":
      return "Visit log tables are missing in Supabase.";
    case "invalid_admin_key":
      return "Invalid admin key.";
    case "untrusted_request_source":
      return "Blocked request source.";
    case "missing_dashboard_env":
      return "Dashboard env vars are missing on the server.";
    default:
      return "Admin data is unavailable right now.";
  }
}

function isWithinDateRange(
  value: string | null,
  dateRange: DateRangeFilter
) {
  if (dateRange === "all") {
    return true;
  }

  const timestamp = Date.parse(value || "");

  if (!Number.isFinite(timestamp)) {
    return false;
  }

  const dayMs = 24 * 60 * 60 * 1000;
  const threshold =
    dateRange === "24h"
      ? Date.now() - dayMs
      : dateRange === "7d"
        ? Date.now() - dayMs * 7
        : Date.now() - dayMs * 30;

  return timestamp >= threshold;
}

function MetricCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string | number;
  tone?: "default" | "alert";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-4",
        tone === "alert"
          ? "border-amber-300/25 bg-amber-300/10"
          : "border-white/10 bg-white/[0.045]"
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-300">
        {label}
      </p>
      <p className="mt-3 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function BreakdownPanel({
  title,
  items,
}: {
  title: string;
  items: DashboardMetric[];
}) {
  const maxCount = Math.max(...items.map((item) => item.count), 1);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-300">
        {title}
      </p>
      <div className="mt-4 space-y-2">
        {items.length ? (
          items.map((item) => (
            <div
              key={`${title}-${item.label}`}
              className="rounded-xl border border-white/8 bg-black/20 px-3 py-2"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-sm text-white/85">
                  {item.label}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-semibold text-white/75">
                  {item.count}
                </span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,rgba(255,110,135,0.8),rgba(255,40,90,0.95))]"
                  style={{
                    width: `${Math.max(
                      12,
                      Math.round((item.count / maxCount) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 bg-black/15 px-3 py-4 text-sm text-white/45">
            No data yet.
          </div>
        )}
      </div>
    </div>
  );
}

function ShareBreakdownChart({
  title,
  subtitle,
  items,
  tone = "red",
}: {
  title: string;
  subtitle: string;
  items: DashboardMetric[];
  tone?: "red" | "amber";
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const maxCount = Math.max(...items.map((item) => item.count), 1);

  return (
    <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.025)_100%)] p-5 shadow-[0_16px_34px_rgba(0,0,0,0.18)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-300">
            {title}
          </p>
          <p className="mt-2 text-sm text-white/55">{subtitle}</p>
        </div>
        <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
            Total
          </p>
          <p className="mt-1 text-xl font-black text-white">{total}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {items.length ? (
          items.map((item, index) => {
            const share = total ? Math.round((item.count / total) * 100) : 0;

            return (
              <div
                key={`${title}-${item.label}`}
                className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-black text-white/78">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {item.label}
                      </p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/40">
                        {share}% share
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-lg font-black text-white">{item.count}</p>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">
                      events
                    </p>
                  </div>
                </div>

                <div className="mt-3 h-2 rounded-full bg-white/5">
                  <div
                    className={cn(
                      "h-full rounded-full shadow-[0_0_18px_rgba(255,80,120,0.18)]",
                      tone === "amber"
                        ? "bg-[linear-gradient(90deg,rgba(255,215,120,0.96),rgba(255,155,55,0.9))]"
                        : "bg-[linear-gradient(90deg,rgba(255,130,155,0.98),rgba(255,45,92,0.92))]"
                    )}
                    style={{
                      width: `${Math.max(
                        item.count ? 12 : 0,
                        Math.round((item.count / maxCount) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/15 px-4 py-8 text-center text-sm text-white/45">
            No data yet.
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardFilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-300">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-white/12 bg-white/[0.05] px-3 py-2.5 text-sm text-white outline-none transition focus:border-red-500/35 focus:bg-red-500/[0.05]"
        style={{ colorScheme: "dark" }}
      >
        {options.map((option) => (
          <option
            key={`${label}-${option.value}`}
            value={option.value}
            className="bg-[#140c11] text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function MiniTrendChart({
  title,
  data,
  metric,
  tone = "red",
}: {
  title: string;
  data: DashboardTrendPoint[];
  metric: "visits" | "conversations";
  tone?: "red" | "amber";
}) {
  const maxValue = Math.max(...data.map((item) => item[metric]), 1);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-300">
        {title}
      </p>
      <div className="mt-4 flex h-36 items-end gap-2">
        {data.map((item) => (
          <div
            key={`${title}-${item.key}`}
            className="flex min-w-0 flex-1 flex-col items-center gap-2"
          >
            <span className="text-[10px] font-semibold text-white/52">
              {item[metric]}
            </span>
            <div className="flex h-24 w-full items-end rounded-t-xl bg-white/[0.03] px-1 pb-1">
              <div
                className={cn(
                  "w-full rounded-lg",
                  tone === "amber"
                    ? "bg-[linear-gradient(180deg,rgba(255,210,110,0.95),rgba(255,150,40,0.82))]"
                    : "bg-[linear-gradient(180deg,rgba(255,120,145,0.95),rgba(255,40,90,0.88))]"
                )}
                style={{
                  height: `${Math.max(
                    item[metric] ? 12 : 4,
                    Math.round((item[metric] / maxValue) * 100)
                  )}%`,
                }}
              />
            </div>
            <span className="text-[10px] uppercase tracking-[0.08em] text-white/40">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MessagesAdminPanel({
  onClose,
  initialTab = "overview",
  standalone = false,
}: MessagesAdminPanelProps) {
  const requestedTab = getRequestedAdminTab();
  const [filters, setFilters] = useState<DashboardFilters>({
    country: "",
    page: "",
    referrer: "",
    dateRange: "all",
  });
  const [inboxStatusFilter, setInboxStatusFilter] =
    useState<ThreadStatusFilter>("all");
  const [activeTab, setActiveTab] = useState<AdminTab>(
    requestedTab ?? initialTab
  );
  const [adminKey, setAdminKey] = useState("");
  const [draftKey, setDraftKey] = useState("");
  const [dashboardState, setDashboardState] = useState<LoadState>("idle");
  const [dashboardData, setDashboardData] = useState<DashboardPayload | null>(
    null
  );
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [threadLoadState, setThreadLoadState] = useState<LoadState>("idle");
  const [threadActionState, setThreadActionState] = useState<LoadState>("idle");
  const [statusMessage, setStatusMessage] = useState(
    "Enter your admin key to open the inbox."
  );
  const [replyDraft, setReplyDraft] = useState("");
  const [replyState, setReplyState] = useState<LoadState>("idle");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const hasKey = adminKey.trim().length > 0;
  const canReply =
    Boolean(selectedThreadId) &&
    selectedThread?.status !== "archived" &&
    replyDraft.trim().length >= 2 &&
    replyState !== "loading";

  useEffect(() => {
    setActiveTab(requestedTab ?? initialTab);
  }, [initialTab, requestedTab]);

  const loadDashboard = useCallback(
    async (keyOverride?: string) => {
      const keyToUse = (keyOverride ?? adminKey).trim();

      if (!keyToUse) {
        setDashboardState("error");
        setStatusMessage("Missing admin key.");
        return;
      }

      setDashboardState("loading");

      try {
        const query = new URLSearchParams();

        if (filters.country) {
          query.set("country", filters.country);
        }

        if (filters.page) {
          query.set("page", filters.page);
        }

        if (filters.referrer) {
          query.set("referrer", filters.referrer);
        }

        if (filters.dateRange !== "all") {
          query.set("dateRange", filters.dateRange);
        }

        const response = await fetch(
          query.toString()
            ? `/api/admin-dashboard?${query.toString()}`
            : "/api/admin-dashboard",
          {
          method: "GET",
          headers: {
            "x-admin-key": keyToUse,
          },
          cache: "no-store",
          }
        );

        const payload = (await response.json().catch(() => null)) as
          | DashboardPayload
          | null;

        if (!response.ok || !payload?.ok) {
          setDashboardState("error");
          setStatusMessage(reasonToMessage(payload?.reason));
          return;
        }

        setDashboardData(payload);
        setDashboardState("ready");
        setAdminKey(keyToUse);
        setStatusMessage("Dashboard loaded.");
        window.sessionStorage.setItem(ADMIN_KEY_STORAGE_KEY, keyToUse);
      } catch {
        setDashboardState("error");
        setStatusMessage("Dashboard unavailable right now.");
      }
    },
    [adminKey, filters]
  );

  const loadThreads = useCallback(
    async (keyOverride?: string) => {
      const keyToUse = (keyOverride ?? adminKey).trim();

      if (!keyToUse) {
        setLoadState("error");
        setStatusMessage("Missing admin key.");
        return;
      }

      setLoadState("loading");
      setStatusMessage("Loading inbox...");

      try {
        const query = new URLSearchParams();

        if (
          inboxStatusFilter === "open" ||
          inboxStatusFilter === "handled" ||
          inboxStatusFilter === "archived"
        ) {
          query.set("status", inboxStatusFilter);
        }

        const response = await fetch(
          query.toString() ? `/api/messages?${query.toString()}` : "/api/messages",
          {
          method: "GET",
          headers: {
            "x-admin-key": keyToUse,
          },
          cache: "no-store",
          }
        );

        const payload = (await response.json().catch(() => null)) as
          | ThreadsPayload
          | null;

        if (!response.ok || !payload?.ok || !Array.isArray(payload.threads)) {
          setLoadState("error");

          if (response.status === 403) {
            setStatusMessage("Invalid admin key.");
            return;
          }

          if (
            response.status === 500 &&
            payload?.reason === "missing_admin_key_env"
          ) {
            setStatusMessage(
              "The server has not picked up MESSAGE_ADMIN_KEY yet. Redeploy Vercel, then try again."
            );
            return;
          }

          if (payload?.reason === "chat_schema_missing") {
            setStatusMessage("Chat schema is missing in Supabase.");
            return;
          }

          setStatusMessage("Inbox unavailable right now.");
          return;
        }

        const threadList = payload.threads;

        setAdminKey(keyToUse);
        setThreads(threadList);
        setLoadState("ready");
        setStatusMessage(
          threadList.length
            ? `${threadList.length} conversations loaded.`
            : "No conversations yet."
        );
        window.sessionStorage.setItem(ADMIN_KEY_STORAGE_KEY, keyToUse);

        if (threadList.length) {
          setSelectedThreadId((current) =>
            current && threadList.some((thread) => thread.id === current)
              ? current
              : threadList[0].id
          );
        } else {
          setSelectedThreadId(null);
          setSelectedThread(null);
          setMessages([]);
        }
      } catch {
        setLoadState("error");
        setStatusMessage("Inbox unavailable right now.");
      }
    },
    [adminKey, inboxStatusFilter]
  );

  const loadConversation = useCallback(async () => {
    if (!selectedThreadId || !adminKey.trim()) {
      return;
    }

    setThreadLoadState("loading");

    try {
      const response = await fetch(
        `/api/messages?threadId=${encodeURIComponent(selectedThreadId)}`,
        {
          method: "GET",
          headers: {
            "x-admin-key": adminKey.trim(),
          },
          cache: "no-store",
        }
      );

      const payload = (await response.json().catch(() => null)) as
        | ConversationPayload
        | null;

      if (!response.ok || !payload?.ok || !payload.thread || !payload.messages) {
        setThreadLoadState("error");
        return;
      }

      setSelectedThread(payload.thread);
      setMessages(payload.messages);
      setThreadLoadState("ready");
    } catch {
      setThreadLoadState("error");
    }
  }, [adminKey, selectedThreadId]);

  useEffect(() => {
    const savedKey = window.sessionStorage.getItem(ADMIN_KEY_STORAGE_KEY) || "";

    if (!savedKey) {
      return;
    }

    setDraftKey(savedKey);

    if ((requestedTab ?? initialTab) === "inbox") {
      void loadThreads(savedKey);
      return;
    }

    void loadDashboard(savedKey);
    void loadThreads(savedKey);
  }, [initialTab, loadDashboard, loadThreads, requestedTab]);

  useEffect(() => {
    if (!selectedThreadId || !adminKey.trim()) {
      return;
    }

    void loadConversation();
  }, [adminKey, loadConversation, selectedThreadId]);

  useEffect(() => {
    if (!hasKey || activeTab === "inbox") {
      return;
    }

    void loadDashboard();
  }, [activeTab, filters, hasKey, loadDashboard]);

  useEffect(() => {
    if (!hasKey) {
      return;
    }

    void loadThreads();
  }, [hasKey, inboxStatusFilter, loadThreads]);

  useEffect(() => {
    if (!hasKey) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (activeTab === "inbox") {
        void loadThreads();
        void loadConversation();
        return;
      }

      void loadDashboard();

      if (activeTab === "visitors") {
        void loadThreads();
      }
    }, THREADS_REFRESH_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeTab, hasKey, loadConversation, loadDashboard, loadThreads]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if ((requestedTab ?? activeTab) === "inbox") {
      await loadThreads(draftKey);
      return;
    }

    await Promise.all([loadDashboard(draftKey), loadThreads(draftKey)]);
  };

  const handleRefresh = () => {
    if (activeTab === "inbox") {
      void loadThreads();
      void loadConversation();
      return;
    }

    void loadDashboard();

    if (activeTab === "visitors") {
      void loadThreads();
    }
  };

  const handleLock = () => {
    window.sessionStorage.removeItem(ADMIN_KEY_STORAGE_KEY);
    setDashboardData(null);
    setDashboardState("idle");
    setAdminKey("");
    setDraftKey("");
    setThreads([]);
    setSelectedThreadId(null);
    setSelectedThread(null);
    setMessages([]);
    setLoadState("idle");
    setThreadLoadState("idle");
    setThreadActionState("idle");
    setReplyDraft("");
    setStatusMessage("Admin dashboard locked.");
  };

  const handleReply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canReply || !selectedThreadId) {
      return;
    }

    setReplyState("loading");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify({
          action: "admin_reply",
          threadId: selectedThreadId,
          message: replyDraft.trim(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | ConversationPayload
        | null;

      if (!response.ok || !payload?.ok || !payload.thread || !payload.messages) {
        setReplyState("error");
        return;
      }

      setReplyDraft("");
      setSelectedThread(payload.thread);
      setMessages(payload.messages);
      setReplyState("ready");
      setStatusMessage("Reply sent.");
      void loadThreads();

      if (activeTab !== "inbox") {
        void loadDashboard();
      }
    } catch {
      setReplyState("error");
    }
  };

  const handleThreadStatusUpdate = useCallback(
    async (status: "open" | "handled" | "archived") => {
      if (!selectedThreadId || !adminKey.trim()) {
        return;
      }

      setThreadActionState("loading");

      try {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey.trim(),
          },
          body: JSON.stringify({
            action: "admin_set_status",
            threadId: selectedThreadId,
            status,
          }),
        });

        const payload = (await response.json().catch(() => null)) as
          | ConversationPayload
          | null;

        if (!response.ok || !payload?.ok || !payload.thread || !payload.messages) {
          setThreadActionState("error");
          setStatusMessage("Status update failed.");
          return;
        }

        setSelectedThread(payload.thread);
        setMessages(payload.messages);
        setThreadActionState("ready");
        setStatusMessage(
          status === "handled"
            ? "Conversation marked handled."
            : status === "archived"
              ? "Conversation archived."
              : "Conversation reopened."
        );
        void loadThreads();

        if (activeTab !== "inbox") {
          void loadDashboard();
        }
      } catch {
        setThreadActionState("error");
        setStatusMessage("Status update failed.");
      }
    },
    [activeTab, adminKey, loadDashboard, loadThreads, selectedThreadId]
  );

  const handleDeleteThread = useCallback(async () => {
    if (!selectedThreadId || !adminKey.trim()) {
      return;
    }

    const confirmed = window.confirm(
      "Delete this conversation permanently? This also removes all messages in the thread."
    );

    if (!confirmed) {
      return;
    }

    setThreadActionState("loading");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify({
          action: "admin_delete_thread",
          threadId: selectedThreadId,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | ThreadDeletePayload
        | null;

      if (!response.ok || !payload?.ok || !payload.deletedThreadId) {
        setThreadActionState("error");
        setStatusMessage("Delete failed.");
        return;
      }

      setThreads((current) =>
        current.filter((thread) => thread.id !== payload.deletedThreadId)
      );
      setSelectedThreadId(null);
      setSelectedThread(null);
      setMessages([]);
      setThreadActionState("ready");
      setStatusMessage("Conversation deleted.");
      void loadThreads();

      if (activeTab !== "inbox") {
        void loadDashboard();
      }
    } catch {
      setThreadActionState("error");
      setStatusMessage("Delete failed.");
    }
  }, [activeTab, adminKey, loadDashboard, loadThreads, selectedThreadId]);

  const selectedThreadMeta = useMemo(() => {
    if (!selectedThread) {
      return null;
    }

    return {
      location: formatLocation(selectedThread),
      lastSeen: formatParisTime(selectedThread.updated_at),
      needsReply: threadNeedsReply(selectedThread),
    };
  }, [selectedThread]);

  const dashboardOverview = dashboardData?.overview;
  const dashboardIssues = dashboardData?.issues;
  const dashboardFilterOptions = dashboardData?.filterOptions ?? {
    countries: [],
    pages: [],
    referrers: [],
  };
  const activityByDay = dashboardData?.activityByDay ?? [];
  const recentVisitors = dashboardData?.recentVisitors ?? [];
  const recentThreads = dashboardData?.recentThreads ?? [];
  const filteredThreads = useMemo(
    () =>
      threads.filter((thread) => {
        if (
          filters.country &&
          (thread.country || "Unknown") !== filters.country
        ) {
          return false;
        }

        if (!isWithinDateRange(thread.updated_at, filters.dateRange)) {
          return false;
        }

        if (inboxStatusFilter === "open" && thread.status !== "open") {
          return false;
        }

        if (inboxStatusFilter === "handled" && thread.status !== "handled") {
          return false;
        }

        if (inboxStatusFilter === "archived" && thread.status !== "archived") {
          return false;
        }

        if (inboxStatusFilter === "needs_reply" && !threadNeedsReply(thread)) {
          return false;
        }

        return true;
      }),
    [filters.country, filters.dateRange, inboxStatusFilter, threads]
  );
  const priorityThreads = useMemo(
    () => threads.filter(threadNeedsReply).slice(0, 6),
    [threads]
  );
  const unreadThreadCount = useMemo(
    () => threads.filter(threadNeedsReply).length,
    [threads]
  );
  useEffect(() => {
    if (activeTab !== "inbox") {
      return;
    }

    if (!filteredThreads.length) {
      setSelectedThreadId(null);
      setSelectedThread(null);
      setMessages([]);
      return;
    }

    setSelectedThreadId((current) =>
      current && filteredThreads.some((thread) => thread.id === current)
        ? current
        : filteredThreads[0].id
    );
  }, [activeTab, filteredThreads]);
  const isUnlocking =
    loadState === "loading" || dashboardState === "loading";
  const activeTabMeta = {
    overview: {
      label: "Overview",
      icon: LayoutDashboard,
      eyebrow: "Dashboard view",
      description:
        "Traffic, countries, pages, and open conversations in one place.",
    },
    visitors: {
      label: "Visitors",
      icon: Users,
      eyebrow: "Live visitor read",
      description:
        "Recent human traffic with page, duration, referrer, and location.",
    },
    inbox: {
      label: "Inbox",
      icon: Inbox,
      eyebrow: "Conversation mode",
      description:
        "Open a thread, reply, archive, or clean up conversations from here.",
    },
  }[activeTab];
  const ActiveTabIcon = activeTabMeta.icon;
  const filterSelectOptions = {
    countries: [
      { value: "", label: "All countries" },
      ...dashboardFilterOptions.countries.map((country) => ({
        value: country,
        label: country,
      })),
    ],
    pages: [
      { value: "", label: "All pages" },
      ...dashboardFilterOptions.pages.map((page) => ({
        value: page,
        label: page,
      })),
    ],
    referrers: [
      { value: "", label: "All referrers" },
      ...dashboardFilterOptions.referrers.map((referrer) => ({
        value: referrer,
        label: referrer,
      })),
    ],
  };
  const tabCounts = {
    overview: dashboardOverview?.unique_visitors ?? 0,
    visitors: dashboardData?.recentVisitors?.length ?? 0,
    inbox: unreadThreadCount,
  };

  return (
    <div
      className={cn(
        "fixed z-[70]",
        standalone
          ? "inset-3 block sm:inset-4"
          : "inset-x-4 top-[7.25rem] bottom-5 hidden lg:block xl:left-6 xl:right-6"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 14 }}
        transition={{ duration: 0.18 }}
        className="flex h-full overflow-hidden rounded-3xl border border-red-500/30 bg-[rgba(8,8,10,0.97)] shadow-[0_0_34px_rgba(255,0,60,0.22)]"
      >
        <div className="flex w-[340px] shrink-0 flex-col border-r border-white/8 bg-[linear-gradient(180deg,rgba(24,10,16,0.98)_0%,rgba(10,8,12,0.98)_100%)]">
          <div className="border-b border-white/8 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-300">
                  <Shield className="h-3.5 w-3.5" />
                  Admin dashboard
                </div>
                <p className="mt-3 text-lg font-black text-white">
                  Control room
                </p>
                <p className="mt-1 text-xs text-white/55">{statusMessage}</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/12 bg-white/5 p-2 text-white/70 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-200"
                aria-label="Close inbox"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="border-b border-white/8 px-5 py-4">
            <form onSubmit={handleUnlock} className="space-y-3">
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-300/70" />
                <input
                  type="password"
                  value={draftKey}
                  onChange={(event) => setDraftKey(event.target.value)}
                  placeholder="Admin key"
                  className="w-full rounded-2xl border border-white/12 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-red-500/35 focus:bg-red-500/5"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!draftKey.trim() || isUnlocking}
                  className={cn(
                    "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition",
                    draftKey.trim() && !isUnlocking
                      ? "border-red-500/35 bg-red-500/12 text-red-200 hover:bg-red-500/18"
                      : "cursor-not-allowed border-white/10 bg-white/[0.04] text-white/35"
                  )}
                >
                  <RefreshCw
                    className={cn(
                      "h-3.5 w-3.5",
                      isUnlocking && "animate-spin"
                    )}
                  />
                  {hasKey ? "Refresh" : "Unlock"}
                </button>

                <button
                  type="button"
                  onClick={handleLock}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/75 transition hover:border-red-500/25 hover:bg-red-500/8 hover:text-red-200"
                >
                  Lock
                </button>
              </div>
            </form>
          </div>

          <div className="border-b border-white/8 px-4 py-4">
            <div className="space-y-2">
              {[
                {
                  id: "overview" as const,
                  label: "Overview",
                  icon: LayoutDashboard,
                  count: tabCounts.overview,
                },
                {
                  id: "visitors" as const,
                  label: "Visitors",
                  icon: Users,
                  count: tabCounts.visitors,
                },
                {
                  id: "inbox" as const,
                  label: "Inbox",
                  icon: Inbox,
                  count: tabCounts.inbox,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                const isUnreadTab = tab.id === "inbox" && unreadThreadCount > 0;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left transition",
                      active
                        ? "border-red-400/45 bg-red-500/12 shadow-[0_0_18px_rgba(255,0,60,0.14)]"
                        : "border-white/8 bg-white/[0.04] hover:border-red-500/20 hover:bg-red-500/[0.05]"
                    )}
                    >
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                        <Icon className="h-4 w-4 text-red-300" />
                        {tab.label}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
                          isUnreadTab
                            ? "animate-pulse border border-red-300/40 bg-[linear-gradient(180deg,rgba(255,74,104,0.38),rgba(140,0,20,0.42))] text-white shadow-[0_0_20px_rgba(255,0,64,0.26)]"
                            : "border border-white/10 bg-white/[0.06] text-white/70"
                        )}
                      >
                        {tab.count}
                      </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
            <div className="mb-3 grid grid-cols-2 gap-2">
              <MetricCard
                label="Visitors"
                value={dashboardOverview?.unique_visitors ?? 0}
              />
              <MetricCard
                label="Need reply"
                value={dashboardOverview?.waiting_replies ?? 0}
                tone="alert"
              />
            </div>
            <AnimatePresence mode="popLayout">
              {activeTab === "inbox" ? (
                filteredThreads.length ? (
                  <div className="space-y-2">
                    {filteredThreads.map((thread) => {
                      const active = thread.id === selectedThreadId;
                      const needsReply = threadNeedsReply(thread);
                      const isArchived = thread.status === "archived";
                      const isHandled = thread.status === "handled";

                      return (
                        <motion.button
                          key={thread.id}
                          layout
                          type="button"
                          onClick={() => setSelectedThreadId(thread.id)}
                          className={cn(
                            "relative w-full overflow-hidden rounded-2xl border p-3 text-left transition",
                            needsReply
                              ? "border-red-300/45 bg-[linear-gradient(180deg,rgba(255,45,85,0.16),rgba(40,8,14,0.78))] shadow-[0_0_24px_rgba(255,0,64,0.18)]"
                              : active
                                ? "border-red-400/45 bg-red-500/12 shadow-[0_0_18px_rgba(255,0,60,0.14)]"
                                : "border-white/8 bg-white/[0.04] hover:border-red-500/20 hover:bg-red-500/[0.05]"
                          )}
                        >
                          {needsReply ? (
                            <div className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-[linear-gradient(180deg,rgba(255,170,190,0.95),rgba(255,40,90,0.95))]" />
                          ) : null}

                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-white">
                                {thread.nickname?.trim() || "Anonymous"}
                              </p>
                              <p className="mt-1 truncate text-[11px] text-white/45">
                                {thread.contact?.trim() ||
                                  formatLocation(thread)}
                              </p>
                            </div>

                            {needsReply ? (
                              <span className="shrink-0 rounded-full border border-red-300/40 bg-[linear-gradient(180deg,rgba(255,80,110,0.36),rgba(130,0,18,0.42))] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-[0_0_18px_rgba(255,0,64,0.22)]">
                                Unread
                              </span>
                            ) : isHandled ? (
                              <span className="shrink-0 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100">
                                Handled
                              </span>
                            ) : isArchived ? (
                              <span className="shrink-0 rounded-full border border-white/12 bg-white/[0.07] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/72">
                                Archived
                              </span>
                            ) : null}
                          </div>

                          <p
                            className={cn(
                              "mt-3 line-clamp-2 text-sm",
                              needsReply ? "text-white/90" : "text-white/72"
                            )}
                          >
                            {thread.last_message_preview || "No preview yet."}
                          </p>

                          <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/38">
                            {formatParisTime(thread.updated_at)}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-center text-sm text-white/45">
                    No conversations yet.
                  </div>
                )
              ) : activeTab === "visitors" ? (
                recentVisitors.length ? (
                  <div className="space-y-2">
                    {recentVisitors.slice(0, 10).map((visitor) => (
                      <motion.div
                        key={visitor.visitor_key}
                        layout
                        className="rounded-2xl border border-white/8 bg-white/[0.04] p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white">
                              {[
                                visitor.latest_country,
                                visitor.latest_region,
                                visitor.latest_city,
                              ]
                                .filter(Boolean)
                                .join(" / ") || "Unknown visitor"}
                            </p>
                            <p className="mt-1 truncate text-[11px] text-white/45">
                              {visitor.latest_guide_page} {" · "}
                              {formatDuration(visitor.total_duration_seconds)}
                            </p>
                          </div>
                          <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
                            {visitor.visit_count} visits
                          </span>
                        </div>
                        <p className="mt-3 truncate text-xs text-white/62">
                          {visitor.latest_referrer_label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-center text-sm text-white/45">
                    No visitor data yet.
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-300">
                      Health check
                    </p>
                    <div className="mt-3 space-y-2 text-sm text-white/75">
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-black/20 px-3 py-2">
                        <span>Visits feed</span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
                            dashboardIssues?.visits
                              ? "border border-amber-300/25 bg-amber-300/12 text-amber-100"
                              : "border border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                          )}
                        >
                          {dashboardIssues?.visits ? "Check" : "Ready"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-black/20 px-3 py-2">
                        <span>Chat feed</span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
                            dashboardIssues?.chat
                              ? "border border-amber-300/25 bg-amber-300/12 text-amber-100"
                              : "border border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                          )}
                        >
                          {dashboardIssues?.chat ? "Check" : "Ready"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-300">
                      Top countries
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(dashboardData?.topCountries ?? []).length ? (
                        (dashboardData?.topCountries ?? []).map((country) => (
                          <span
                            key={country.label}
                            className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/78"
                          >
                            {country.label} {" · "} {country.count}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-white/45">
                          Nothing yet.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-300">
                      Priority inbox
                    </p>
                    <div className="mt-3 space-y-2">
                      {priorityThreads.length ? (
                        priorityThreads.map((thread) => (
                          <button
                            key={`priority-${thread.id}`}
                            type="button"
                            onClick={() => {
                              setActiveTab("inbox");
                              setSelectedThreadId(thread.id);
                            }}
                            className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/8 bg-black/20 px-3 py-2 text-left transition hover:border-red-500/20 hover:bg-red-500/[0.05]"
                          >
                            <span className="truncate text-sm text-white/82">
                              {thread.nickname?.trim() || "Anonymous"}
                            </span>
                            <span className="shrink-0 rounded-full border border-amber-300/25 bg-amber-300/12 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-100">
                              Reply
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="rounded-xl border border-dashed border-white/10 bg-black/15 px-3 py-4 text-sm text-white/45">
                          No one is waiting for a reply right now.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-white/8 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-300">
                  {activeTabMeta.eyebrow}
                </p>
                <p className="mt-2 flex items-center gap-2 text-xl font-black text-white">
                  <ActiveTabIcon className="h-5 w-5 text-red-300" />
                  <span className="truncate">{activeTabMeta.label}</span>
                </p>
                <p className="mt-2 max-w-3xl text-sm text-white/58">
                  {activeTabMeta.description}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {dashboardData?.generatedAt ? (
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/62">
                    {formatParisTime(dashboardData.generatedAt)}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/5 p-2.5 text-white/72 transition hover:border-red-500/25 hover:bg-red-500/8 hover:text-red-200"
                  aria-label="Refresh dashboard"
                >
                  <RefreshCw
                    className={cn(
                      "h-4 w-4",
                      (loadState === "loading" || dashboardState === "loading") &&
                        "animate-spin"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          {activeTab !== "inbox" ? (
            <div className="border-b border-white/8 px-6 py-4">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <DashboardFilterSelect
                  label="Country"
                  value={filters.country}
                  options={filterSelectOptions.countries}
                  onChange={(value) =>
                    setFilters((current) => ({ ...current, country: value }))
                  }
                />
                <DashboardFilterSelect
                  label="Page"
                  value={filters.page}
                  options={filterSelectOptions.pages}
                  onChange={(value) =>
                    setFilters((current) => ({ ...current, page: value }))
                  }
                />
                <DashboardFilterSelect
                  label="Referrer"
                  value={filters.referrer}
                  options={filterSelectOptions.referrers}
                  onChange={(value) =>
                    setFilters((current) => ({ ...current, referrer: value }))
                  }
                />
                <DashboardFilterSelect
                  label="Date"
                  value={filters.dateRange}
                  options={DATE_RANGE_OPTIONS}
                  onChange={(value) =>
                    setFilters((current) => ({
                      ...current,
                      dateRange: value as DateRangeFilter,
                    }))
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setFilters({
                      country: "",
                      page: "",
                      referrer: "",
                      dateRange: "all",
                    })
                  }
                  className="self-end rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/72 transition hover:border-red-500/25 hover:bg-red-500/[0.08] hover:text-red-200"
                >
                  Reset filters
                </button>
              </div>
            </div>
          ) : (
            <div className="border-b border-white/8 px-6 py-4">
              <div className="grid gap-3 md:grid-cols-3">
                <DashboardFilterSelect
                  label="Country"
                  value={filters.country}
                  options={filterSelectOptions.countries}
                  onChange={(value) =>
                    setFilters((current) => ({ ...current, country: value }))
                  }
                />
                <DashboardFilterSelect
                  label="Date"
                  value={filters.dateRange}
                  options={DATE_RANGE_OPTIONS}
                  onChange={(value) =>
                    setFilters((current) => ({
                      ...current,
                      dateRange: value as DateRangeFilter,
                    }))
                  }
                />
                <DashboardFilterSelect
                  label="Thread state"
                  value={inboxStatusFilter}
                  options={[
                    { value: "all", label: "All threads" },
                    { value: "open", label: "Open only" },
                    { value: "handled", label: "Handled only" },
                    { value: "archived", label: "Archived only" },
                    { value: "needs_reply", label: "Needs reply" },
                  ]}
                  onChange={(value) =>
                    setInboxStatusFilter(value as ThreadStatusFilter)
                  }
                />
              </div>
            </div>
          )}

          {activeTab === "overview" ? (
            <div className="min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(10,8,10,0.92)_0%,rgba(8,8,10,0.98)_100%)] px-6 py-5">
              <div className="space-y-5">
                {dashboardIssues?.visits ? (
                  <div className="rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-50">
                    Visits feed: {reasonToMessage(dashboardIssues.visits)}
                  </div>
                ) : null}
                {dashboardIssues?.chat ? (
                  <div className="rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-50">
                    Chat feed: {reasonToMessage(dashboardIssues.chat)}
                  </div>
                ) : null}

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <MetricCard
                    label="Visit events"
                    value={dashboardOverview?.visit_events ?? 0}
                  />
                  <MetricCard
                    label="Unique visitors"
                    value={dashboardOverview?.unique_visitors ?? 0}
                  />
                  <MetricCard
                    label="Visitors 24h"
                    value={dashboardOverview?.unique_visitors_24h ?? 0}
                  />
                  <MetricCard
                    label="Active countries"
                    value={dashboardOverview?.active_countries ?? 0}
                  />
                  <MetricCard
                    label="Avg duration"
                    value={formatDuration(
                      dashboardOverview?.average_duration_seconds ?? 0
                    )}
                  />
                  <MetricCard
                    label="Waiting replies"
                    value={dashboardOverview?.waiting_replies ?? 0}
                    tone="alert"
                  />
                  <MetricCard
                    label="Open threads"
                    value={dashboardOverview?.open_threads ?? 0}
                  />
                  <MetricCard
                    label="Handled"
                    value={dashboardOverview?.handled_threads ?? 0}
                  />
                  <MetricCard
                    label="Archived"
                    value={dashboardOverview?.archived_threads ?? 0}
                  />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <ShareBreakdownChart
                    title="Country pressure"
                    subtitle="Where the recent traffic clusters the most."
                    items={dashboardData?.topCountries ?? []}
                  />
                  <ShareBreakdownChart
                    title="Page pressure"
                    subtitle="Which guide pages are pulling the most attention."
                    items={dashboardData?.topPages ?? []}
                    tone="amber"
                  />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <MiniTrendChart
                    title="Visits trend"
                    data={activityByDay}
                    metric="visits"
                  />
                  <MiniTrendChart
                    title="Conversation trend"
                    data={activityByDay}
                    metric="conversations"
                    tone="amber"
                  />
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                  <BreakdownPanel
                    title="Top referrers"
                    items={dashboardData?.topReferrers ?? []}
                  />
                  <BreakdownPanel
                    title="Countries snapshot"
                    items={dashboardData?.topCountries ?? []}
                  />
                  <BreakdownPanel
                    title="Pages snapshot"
                    items={dashboardData?.topPages ?? []}
                  />
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-300">
                        Recent visitors
                      </p>
                      <span className="text-xs text-white/45">
                        {recentVisitors.length} shown
                      </span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {recentVisitors.slice(0, 8).map((visitor) => (
                        <div
                          key={`overview-visitor-${visitor.visitor_key}`}
                          className="rounded-2xl border border-white/8 bg-black/20 p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-white">
                                {[
                                  visitor.latest_country,
                                  visitor.latest_region,
                                  visitor.latest_city,
                                ]
                                  .filter(Boolean)
                                  .join(" / ") || "Unknown visitor"}
                              </p>
                              <p className="mt-1 truncate text-xs text-white/48">
                                {visitor.latest_guide_page}{" · "}
                                {visitor.latest_pathname}
                              </p>
                            </div>
                            <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/72">
                              {visitor.visit_count} visits
                            </span>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-white/58">
                            <span>{formatParisTime(visitor.last_seen_at)}</span>
                            <span>·</span>
                            <span>
                              {formatDuration(visitor.total_duration_seconds)}
                            </span>
                            <span>·</span>
                            <span className="truncate">
                              {visitor.latest_referrer_label}
                            </span>
                          </div>
                        </div>
                      ))}
                      {!recentVisitors.length ? (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-black/15 px-4 py-8 text-center text-sm text-white/45">
                          No visitor data yet.
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-300">
                        Recent conversations
                      </p>
                      <div className="mt-4 space-y-2">
                        {recentThreads.length ? (
                          recentThreads.map((thread) => (
                            <button
                              key={`overview-thread-${thread.id}`}
                              type="button"
                              onClick={() => {
                                setActiveTab("inbox");
                                setSelectedThreadId(thread.id);
                              }}
                              className="w-full rounded-2xl border border-white/8 bg-black/20 p-3 text-left transition hover:border-red-500/20 hover:bg-red-500/[0.05]"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-bold text-white">
                                    {thread.nickname?.trim() || "Anonymous"}
                                  </p>
                                  <p className="mt-1 truncate text-[11px] text-white/48">
                                    {thread.contact?.trim() || formatLocation(thread)}
                                  </p>
                                </div>
                                {threadNeedsReply(thread) ? (
                                  <span className="rounded-full border border-red-300/40 bg-[linear-gradient(180deg,rgba(255,80,110,0.34),rgba(130,0,18,0.42))] px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-[0_0_16px_rgba(255,0,64,0.2)]">
                                    Unread
                                  </span>
                                ) : thread.status === "archived" ? (
                                  <span className="rounded-full border border-white/12 bg-white/[0.06] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70">
                                    Archived
                                  </span>
                                ) : null}
                              </div>
                              <p className="mt-3 line-clamp-2 text-sm text-white/72">
                                {thread.last_message_preview || "No preview yet."}
                              </p>
                            </button>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-white/10 bg-black/15 px-4 py-8 text-center text-sm text-white/45">
                            No conversations yet.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-300">
                        Total watch time
                      </p>
                      <p className="mt-3 text-3xl font-black text-white">
                        {formatDuration(
                          dashboardOverview?.total_duration_seconds ?? 0
                        )}
                      </p>
                      <p className="mt-2 text-sm text-white/55">
                        Combined active time from recent visit events pulled into
                        the dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "visitors" ? (
            <div className="min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(10,8,10,0.92)_0%,rgba(8,8,10,0.98)_100%)] px-6 py-5">
              <div className="grid gap-4 xl:grid-cols-2">
                {recentVisitors.length ? (
                  recentVisitors.map((visitor) => (
                    <div
                      key={`visitor-card-${visitor.visitor_key}`}
                      className="rounded-2xl border border-white/10 bg-white/[0.045] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 text-lg font-black text-white">
                            <Globe2 className="h-4.5 w-4.5 text-red-300" />
                            <span className="truncate">
                              {[
                                visitor.latest_country,
                                visitor.latest_region,
                                visitor.latest_city,
                              ]
                                .filter(Boolean)
                                .join(" / ") || "Unknown visitor"}
                            </span>
                          </p>
                          <p className="mt-2 text-xs text-white/52">
                            Last seen {formatParisTime(visitor.last_seen_at)}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          {visitor.needs_reply ? (
                            <span className="rounded-full border border-amber-300/25 bg-amber-300/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-100">
                              Needs reply
                            </span>
                          ) : null}
                          {visitor.has_conversation ? (
                            <span className="rounded-full border border-red-300/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-100">
                              Chat linked
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-white/8 bg-black/20 px-3 py-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-300">
                            Visits
                          </p>
                          <p className="mt-2 text-xl font-black text-white">
                            {visitor.visit_count}
                          </p>
                        </div>
                        <div className="rounded-xl border border-white/8 bg-black/20 px-3 py-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-300">
                            Total duration
                          </p>
                          <p className="mt-2 text-xl font-black text-white">
                            {formatDuration(visitor.total_duration_seconds)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 text-sm text-white/72">
                        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-black/20 px-3 py-2.5">
                          <span className="text-white/52">Latest page</span>
                          <span className="truncate font-semibold text-white">
                            {visitor.latest_guide_page}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-black/20 px-3 py-2.5">
                          <span className="text-white/52">Path</span>
                          <span className="truncate font-semibold text-white">
                            {visitor.latest_pathname}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-black/20 px-3 py-2.5">
                          <span className="text-white/52">Referrer</span>
                          <span className="truncate font-semibold text-white">
                            {visitor.latest_referrer_label}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl border border-white/8 bg-black/20 px-3 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-300">
                          User agent
                        </p>
                        <p className="mt-2 break-words text-xs leading-relaxed text-white/58">
                          {visitor.latest_user_agent || "Unknown"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-sm text-white/45">
                    No visitor data available yet.
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {activeTab === "inbox" ? (
            selectedThread ? (
              <>
                <div className="border-b border-white/8 px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-lg font-black text-white">
                        <UserRound className="h-5 w-5 text-red-300" />
                        <span className="truncate">
                          {selectedThread.nickname?.trim() || "Anonymous"}
                        </span>
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/55">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-red-300/75" />
                          {selectedThreadMeta?.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5 text-red-300/75" />
                          {selectedThreadMeta?.lastSeen}
                        </span>
                        {selectedThread.contact ? (
                          <span className="truncate text-white/72">
                            Contact: {selectedThread.contact}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {selectedThreadMeta?.needsReply ? (
                        <span className="animate-pulse rounded-full border border-red-300/40 bg-[linear-gradient(180deg,rgba(255,80,110,0.34),rgba(130,0,18,0.42))] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-[0_0_18px_rgba(255,0,64,0.22)]">
                          Unread - reply waiting
                        </span>
                      ) : selectedThread.status === "archived" ? (
                        <span className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                          Archived
                        </span>
                      ) : selectedThread.status === "handled" ? (
                        <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100">
                          Handled
                        </span>
                      ) : (
                        <span className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                          Open
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          void handleThreadStatusUpdate(
                            selectedThread.status === "handled"
                              ? "open"
                              : "handled"
                          )
                        }
                        disabled={
                          selectedThread.status === "archived" ||
                          threadActionState === "loading"
                        }
                        className={cn(
                          "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] transition",
                          selectedThread.status === "archived"
                            ? "cursor-not-allowed border-white/10 bg-white/[0.03] text-white/32"
                            : selectedThread.status === "handled"
                              ? "border-white/12 bg-white/[0.05] text-white/72 hover:border-red-500/25 hover:bg-red-500/[0.08] hover:text-red-200"
                              : "border-emerald-300/20 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/15"
                        )}
                      >
                        {selectedThread.status === "handled"
                          ? "Reopen"
                          : "Mark handled"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void handleThreadStatusUpdate(
                            selectedThread.status === "archived"
                              ? "open"
                              : "archived"
                          )
                        }
                        disabled={threadActionState === "loading"}
                        className={cn(
                          "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] transition",
                          selectedThread.status === "archived"
                            ? "border-white/12 bg-white/[0.05] text-white/72 hover:border-red-500/25 hover:bg-red-500/[0.08] hover:text-red-200"
                            : "border-white/12 bg-black/25 text-white/72 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                        )}
                      >
                        {selectedThread.status === "archived"
                          ? "Restore"
                          : "Archive"}
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDeleteThread()}
                        disabled={threadActionState === "loading"}
                        className={cn(
                          "rounded-full border border-red-400/28 bg-red-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-100 transition hover:bg-red-500/18",
                          threadActionState === "loading" &&
                            "cursor-not-allowed opacity-55"
                        )}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(10,8,10,0.92)_0%,rgba(8,8,10,0.98)_100%)] px-6 py-5">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.author === "admin"
                            ? "justify-end"
                            : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-3 shadow-[0_12px_22px_rgba(0,0,0,0.16)]",
                            message.author === "admin"
                              ? "rounded-br-md border border-red-300/28 bg-[linear-gradient(180deg,rgba(255,55,85,0.26),rgba(120,0,16,0.24))] text-white"
                              : "rounded-bl-md border border-white/12 bg-white/[0.06] text-white/92"
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                            {message.content}
                          </p>
                          <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/45">
                            {message.author === "admin" ? "Admin" : "Visitor"}
                            {" · "}
                            {formatParisTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div className="border-t border-white/8 px-6 py-5">
                  <form onSubmit={handleReply} className="space-y-3">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                      <MessageSquareText className="h-4 w-4" />
                      Reply as admin
                    </div>

                    <textarea
                      value={replyDraft}
                      onChange={(event) =>
                        setReplyDraft(
                          event.target.value.slice(0, MAX_ADMIN_REPLY_LENGTH)
                        )
                      }
                      placeholder={
                        selectedThread.status === "archived"
                          ? "Restore this thread before replying..."
                          : "Write your reply..."
                      }
                      rows={4}
                      disabled={selectedThread.status === "archived"}
                      className="w-full resize-none rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-red-500/35 focus:bg-red-500/[0.05]"
                    />

                    <div className="flex items-center justify-between gap-3">
                      <p
                        className={cn(
                          "text-xs",
                          replyState === "error"
                            ? "text-red-200"
                            : replyState === "ready"
                              ? "text-emerald-200"
                              : "text-white/45"
                        )}
                      >
                        {replyState === "error"
                          ? "Reply failed. Try again."
                          : replyState === "ready"
                            ? "Reply sent."
                            : selectedThread.status === "archived"
                              ? "This thread is archived. Restore it if you want to answer."
                              : "Visitor will see this on the same browser thread."}
                      </p>

                      <button
                        type="submit"
                        disabled={!canReply}
                        className={cn(
                          "inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition",
                          canReply
                            ? "border-red-300/60 bg-[linear-gradient(180deg,rgba(255,55,85,0.34),rgba(120,0,16,0.35))] text-white shadow-[0_0_24px_rgba(255,0,60,0.24)] hover:bg-[linear-gradient(180deg,rgba(255,70,95,0.42),rgba(140,0,18,0.4))]"
                            : "cursor-not-allowed border-red-500/20 bg-red-500/[0.08] text-white/40"
                        )}
                      >
                        <SendHorizontal className="h-4 w-4" />
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center text-white/45">
                {threadLoadState === "loading"
                  ? "Loading conversation..."
                  : "Select a conversation on the left."}
              </div>
            )
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

