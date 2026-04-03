import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickSymptoms = [
  "Headache",
  "Fever",
  "Stomach pain",
  "Cold & cough",
  "Back pain",
  "Fatigue",
  "Chest pain",
  "Skin rash",
];

const emergencyKeywords = ["chest pain", "difficulty breathing", "severe bleeding", "unconscious", "seizure", "stroke"];

const AIDoctor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hello! I'm your SmartHealth AI Doctor. I can help analyze your symptoms and provide health guidance.\n\nYou can type your symptoms or tap a quick symptom chip below. I support both **English** and **Hindi**.\n\n⚠️ *Disclaimer: I provide general health information only. Always consult a qualified doctor for medical decisions.*",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const isEmergency = (text: string) =>
    emergencyKeywords.some((k) => text.toLowerCase().includes(k));

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    if (isEmergency(text)) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "🚨 **EMERGENCY ALERT** 🚨\n\nYour symptoms suggest a potentially serious condition. Please:\n\n1. **Call emergency services immediately** (112 in India)\n2. **Go to the nearest hospital**\n3. **Do not delay seeking professional medical help**\n\nThis is not something that should be managed at home.",
        },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const allMessages = [...messages.filter((m) => m.role !== "assistant" || messages.indexOf(m) !== 0), userMsg];

      const { data, error } = await supabase.functions.invoke("ai-doctor", {
        body: { messages: allMessages, language },
      });

      if (error) throw error;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || "I'm sorry, I couldn't process that. Please try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Language Toggle */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <span className="text-xs text-muted-foreground">Language:</span>
        <div className="flex gap-1">
          <Button
            variant={language === "en" ? "default" : "outline"}
            size="sm"
            className="text-xs h-7"
            onClick={() => setLanguage("en")}
          >
            English
          </Button>
          <Button
            variant={language === "hi" ? "default" : "outline"}
            size="sm"
            className="text-xs h-7"
            onClick={() => setLanguage("hi")}
          >
            हिंदी
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full health-gradient flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "health-gradient text-white rounded-br-md"
                  : "bg-card border border-border rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full health-gradient flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            </div>
          </div>
        )}
      </div>

      {/* Quick Symptoms */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Quick symptoms:</p>
          <div className="flex flex-wrap gap-2">
            {quickSymptoms.map((symptom) => (
              <Button
                key={symptom}
                variant="outline"
                size="sm"
                className="text-xs h-7 rounded-full"
                onClick={() => sendMessage(`I have ${symptom.toLowerCase()}`)}
              >
                {symptom}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border bg-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === "hi" ? "अपने लक्षण बताएं..." : "Describe your symptoms..."}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="health-gradient" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4 text-white" />
          </Button>
        </form>
      </div>

      {/* Bottom Nav for chat page */}
      <nav className="border-t border-border bg-card">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {[
            { to: "/", label: "Dashboard" },
            { to: "/calculator", label: "Calculator" },
            { to: "/hospitals", label: "Hospitals" },
            { to: "/ai-doctor", label: "AI Doctor" },
          ].map(({ to, label }) => (
            <a
              key={to}
              href={to}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 text-xs transition-colors ${
                to === "/ai-doctor" ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              <span>{label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AIDoctor;
