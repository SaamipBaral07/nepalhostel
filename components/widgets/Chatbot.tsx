"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, ChevronRight, ArrowLeft, CheckCheck, HelpCircle } from "lucide-react";
import { widgetsApi } from "@/lib/api/widgets";
import { useAuth } from "@/contexts/AuthContext";
import type { ChatbotQA, ChatbotUserQuery } from "@/lib/types";

interface ChatMessage {
  id: string;
  type: "bot" | "user";
  text: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  type: "bot",
  text: "Hi there! 👋 I'm the Hostel Nepal assistant. How can I help you today? Pick a question below or type your own.",
};

export function Chatbot() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState<ChatbotQA[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [showQuestions, setShowQuestions] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmittingQuery, setIsSubmittingQuery] = useState(false);
  const [submittedQueries, setSubmittedQueries] = useState<ChatbotUserQuery[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const repliedQueryIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    widgetsApi
      .getChatbotQuestions()
      .then((res) => setQuestions(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let isCancelled = false;

    const fetchReplies = async () => {
      try {
        const res = await widgetsApi.getMyChatbotQueries({ onlyReplied: true });
        if (isCancelled) return;

        const unseenReplies = res.data.filter(
          (item) => item.adminReply && !item.replySeen && !repliedQueryIdsRef.current.has(item.id)
        );

        if (unseenReplies.length === 0) return;

        // Mark as seen
        for (const reply of unseenReplies) {
          try {
            await widgetsApi.markChatbotReplySeen(reply.id);
          } catch {
            // Silent fail
          }
        }

        repliedQueryIdsRef.current = new Set([
          ...repliedQueryIdsRef.current,
          ...unseenReplies.map((r) => r.id),
        ]);

        setSubmittedQueries((prev) => {
          const updated = [...prev];
          for (const reply of unseenReplies) {
            const idx = updated.findIndex((q) => q.id === reply.id);
            if (idx >= 0) {
              updated[idx] = { ...reply };
            } else {
              updated.push(reply);
            }
          }
          return updated;
        });

        if (!isOpen) setHasUnread(true);
      } catch {
        // Silent fail to avoid disrupting chat UX when polling fails.
      }
    };

    fetchReplies();
    const intervalId = setInterval(fetchReplies, 15000);

    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, [isAuthenticated, isOpen]);

  const categories = [...new Set(questions.map((q) => q.category))];

  const filteredQuestions = searchQuery.trim()
    ? questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : questions;

  const handleSelectQuestion = (qa: ChatbotQA) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      text: qa.question,
    };
    setMessages((prev) => [...prev, userMsg]);
    setShowQuestions(false);
    setSearchQuery("");

    // Simulate typing delay
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: "bot",
        text: qa.answer,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      text: query,
    };
    setMessages((prev) => [...prev, userMsg]);
    setSearchQuery("");
    setShowQuestions(false);

    // Find best matching question
    const match = questions.find(
      (q) =>
        q.question.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().includes(q.question.toLowerCase().slice(0, 20))
    );

    if (match) {
      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          type: "bot",
          text: match.answer,
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 500);
      return;
    }

    if (!isAuthenticated) {
      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          type: "bot",
          text: "For questions outside the suggested list, please submit your query through our Contact page. We will assist you there.",
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 500);
      return;
    }

    try {
      setIsSubmittingQuery(true);
      const res = await widgetsApi.submitChatbotQuery(query);
      const createdQuery: ChatbotUserQuery = res.data;

      setSubmittedQueries((prev) => [createdQuery, ...prev]);

      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          type: "bot",
          text: "Your question has been submitted! Our support team will review and reply soon. You'll see the reply here.",
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 400);
    } catch {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: "bot",
        text: "We could not submit your query right now. Please try again, or use the Contact page if this is urgent.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsSubmittingQuery(false);
    }
  };

  const handleShowQuestions = () => {
    setShowQuestions(true);
    setSearchQuery("");
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      general: "General",
      booking: "Booking",
      payment: "Payment",
      hosting: "Hosting",
      account: "Account",
    };
    return labels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  const getCategoryEmoji = (cat: string) => {
    const emojis: Record<string, string> = {
      general: "💡",
      booking: "📅",
      payment: "💳",
      hosting: "🏠",
      account: "👤",
    };
    return emojis[cat] || "❓";
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-zinc-800 text-white rotate-0 hover:bg-zinc-700"
            : "bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-600/25 hover:scale-105"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {hasUnread && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500" />
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-24 right-6 z-50 max-h-[600px] w-[420px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xl shadow-black/10 transition-all duration-300 flex flex-col ${
          isOpen
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-4 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Hostel Nepal Support
              </h3>
              <p className="text-xs text-emerald-100">
                Ask us anything about hostels
              </p>
            </div>
          </div>
        </div>

        {/* Messages + Queries area */}
        <div className="flex-1 overflow-y-auto space-y-3 px-4 py-4 bg-zinc-50/50">
          {/* Chat messages */}
          {messages.length > 1 && (
            <div className="space-y-3 pb-3 border-b border-zinc-200/60">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.type === "user"
                        ? "bg-emerald-600 text-white rounded-br-md"
                        : "bg-white text-zinc-700 shadow-sm border border-zinc-100 rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick questions panel */}
          {showQuestions && questions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-400 px-1">
                Suggested questions
              </p>
              {categories.map((cat) => {
                const catQuestions = filteredQuestions.filter(
                  (q) => q.category === cat
                );
                if (catQuestions.length === 0) return null;
                return (
                  <div key={cat} className="space-y-1">
                    <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
                      <span>{getCategoryEmoji(cat)}</span>
                      {getCategoryLabel(cat)}
                    </p>
                    {catQuestions.map((qa) => (
                      <button
                        key={qa.id}
                        onClick={() => handleSelectQuestion(qa)}
                        className="group flex w-full items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-left text-sm text-zinc-600 shadow-sm border border-zinc-100 transition-all hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 hover:shadow-md"
                      >
                        <span className="flex-1">{qa.question}</span>
                        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-zinc-300 transition-colors group-hover:text-emerald-500" />
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* Your Queries Section */}
          {isAuthenticated && submittedQueries.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-zinc-500" />
                <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                  Your Queries
                </p>
              </div>
              <div className="space-y-2">
                {submittedQueries.map((query) => (
                  <div key={query.id} className="space-y-1.5">
                    {/* Question */}
                    <div className="rounded-lg bg-white border border-zinc-100 p-3 shadow-sm">
                      <p className="text-xs font-medium text-zinc-500 mb-1">Your question:</p>
                      <p className="text-sm text-zinc-700">{query.question}</p>
                    </div>

                    {/* Admin Reply */}
                    {query.adminReply && (
                      <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-start gap-2">
                          <CheckCheck className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-emerald-700 mb-1">
                              Support Reply:
                            </p>
                            <p className="text-sm text-emerald-900">{query.adminReply}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pending state */}
                    {!query.adminReply && (
                      <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 shadow-sm">
                        <p className="text-xs text-amber-700 flex items-center gap-1.5">
                          <span className="inline-flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                          Awaiting support team response...
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show questions button when in conversation */}
          {!showQuestions && questions.length > 0 && (
            <div className="pt-1">
              <button
                onClick={handleShowQuestions}
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                Show suggested questions
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-zinc-100 bg-white px-4 py-3 flex-shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-700 placeholder:text-zinc-400 outline-none transition-all focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
          <button
            type="submit"
            disabled={!searchQuery.trim() || isSubmittingQuery}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition-all hover:bg-emerald-500 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}
