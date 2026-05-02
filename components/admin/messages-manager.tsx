"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  reply: string | null;
  created_at: string;
};

export function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load messages.");
    else setMessages(data ?? []);
    setLoading(false);
  }

  async function handleReply(msg: Message) {
    const reply = replyText[msg.id]?.trim();
    if (!reply) return toast.error("Reply cannot be empty.");
    setSending(msg.id);

    const { error } = await supabase
      .from("contact_messages")
      .update({ reply })
      .eq("id", msg.id);

    if (error) {
      toast.error("Failed to send reply.");
    } else {
      toast.success("Reply saved.");
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, reply } : m))
      );
      setReplyText((prev) => ({ ...prev, [msg.id]: "" }));
      setExpanded(null);
    }
    setSending(null);
  }

  if (loading) return <p className="text-sm text-[var(--text-muted)]">Loading messages...</p>;
  if (!messages.length) return <p className="text-sm text-[var(--text-muted)]">No messages yet.</p>;

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-[var(--text)]">{msg.name}</span>
                <span className="text-xs text-[var(--text-muted)]">{msg.email}</span>
                <span className="text-xs text-[var(--text-muted)] ml-auto">
                  {new Date(msg.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--text)]">{msg.message}</p>

              {msg.reply && (
                <div className="mt-2 rounded-lg bg-[var(--surface-soft)] border border-[var(--line)] px-3 py-2">
                  <p className="text-xs font-semibold text-[var(--accent)] mb-1">Admin Reply</p>
                  <p className="text-sm text-[var(--text)]">{msg.reply}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
              className="shrink-0 rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:bg-[var(--surface-soft)] transition"
            >
              {expanded === msg.id ? "Cancel" : msg.reply ? "Edit Reply" : "Reply"}
            </button>
          </div>

          {expanded === msg.id && (
            <div className="mt-3 flex gap-2">
              <textarea
                rows={2}
                placeholder="Type your reply..."
                value={replyText[msg.id] ?? msg.reply ?? ""}
                onChange={(e) => setReplyText((prev) => ({ ...prev, [msg.id]: e.target.value }))}
                className="flex-1 rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] resize-none"
              />
              <button
                onClick={() => handleReply(msg)}
                disabled={sending === msg.id}
                className="self-end rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {sending === msg.id ? "Saving..." : "Send"}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
