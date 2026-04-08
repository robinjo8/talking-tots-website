import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type ChildContext = {
  name: string;
  gender: string;
  age: number | null;
  speechDifficulties: string;
  speechDifficultiesDescription: string;
  speechDevelopmentSummary: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistant`;

export function useChatAssistant(childContext?: ChildContext) {
  const { user } = useAuth();
  const userId = user?.id;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const convIdRef = useRef<string | null>(null);
  const initialLoadDone = useRef(false);

  // Load single conversation on mount
  useEffect(() => {
    if (!userId || initialLoadDone.current) return;
    initialLoadDone.current = true;

    (async () => {
      const { data: convs } = await supabase
        .from("chat_conversations")
        .select("id")
        .eq("user_id", userId)
        .order("created_at", { ascending: true })
        .limit(1);

      if (convs && convs.length > 0) {
        const convId = (convs[0] as any).id;
        convIdRef.current = convId;

        const { data: msgs } = await supabase
          .from("chat_messages")
          .select("role, content")
          .eq("conversation_id", convId)
          .order("created_at", { ascending: true });

        if (msgs) {
          setMessages(
            (msgs as unknown as { role: string; content: string }[]).map((m) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            }))
          );
        }
      }
    })();
  }, [userId]);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (input: string) => {
      if (!input.trim() || isLoading) return;

      const userMsg: ChatMessage = { role: "user", content: input.trim() };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setIsLoading(true);

      let convId = convIdRef.current;
      if (userId) {
        try {
          if (!convId) {
            const { data: conv } = await supabase
              .from("chat_conversations")
              .insert({ user_id: userId, title: "Klepet" } as any)
              .select("id")
              .single();
            if (conv) {
              convId = (conv as any).id;
              convIdRef.current = convId;
            }
          }
          if (convId) {
            await supabase
              .from("chat_messages")
              .insert({
                conversation_id: convId,
                role: "user",
                content: input.trim(),
              } as any);
          }
        } catch (err) {
          console.error("Error saving user message:", err);
        }
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      let assistantContent = "";

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token;
        if (!accessToken) {
          toast.error("Niste prijavljeni. Prijavite se za uporabo asistenta.");
          setIsLoading(false);
          return;
        }

        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            messages: updatedMessages,
            ...(childContext ? { childContext } : {}),
          }),
          signal: controller.signal,
        });

        if (!resp.ok) {
          const errorData = await resp.json().catch(() => null);
          const errorMsg = errorData?.error || "Napaka pri komunikaciji z asistentom.";
          if (resp.status === 429) {
            toast.error("Preveč zahtev. Počakajte trenutek in poskusite znova.");
          } else {
            toast.error(errorMsg);
          }
          setIsLoading(false);
          return;
        }

        if (!resp.body) {
          toast.error("Streaming ni podprt.");
          setIsLoading(false);
          return;
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let textBuffer = "";
        let streamDone = false;

        const updateAssistant = (content: string) => {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content } : m
              );
            }
            return [...prev, { role: "assistant", content }];
          });
        };

        while (!streamDone) {
          const { done, value } = await reader.read();
          if (done) break;
          textBuffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") {
              streamDone = true;
              break;
            }

            try {
              const parsed = JSON.parse(jsonStr);

              // Azure Chat Completions SSE format
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantContent += content;
                updateAssistant(assistantContent);
              }

              // Check for error
              if (parsed.error) {
                console.error("Stream error:", parsed.error);
                toast.error("Napaka pri generiranju odgovora.");
                streamDone = true;
                break;
              }
            } catch {
              textBuffer = line + "\n" + textBuffer;
              break;
            }
          }
        }

        // Final flush
        if (textBuffer.trim()) {
          for (let raw of textBuffer.split("\n")) {
            if (!raw) continue;
            if (raw.endsWith("\r")) raw = raw.slice(0, -1);
            if (raw.startsWith(":") || raw.trim() === "") continue;
            if (!raw.startsWith("data: ")) continue;
            const jsonStr = raw.slice(6).trim();
            if (jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.type === "response.output_text.delta" && parsed.delta) {
                assistantContent += parsed.delta;
                updateAssistant(assistantContent);
              }
            } catch {
              /* ignore */
            }
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // User cancelled
        } else {
          console.error("Chat error:", err);
          toast.error("Napaka pri komunikaciji z asistentom.");
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;

        if (assistantContent && convId && userId) {
          try {
            await supabase
              .from("chat_messages")
              .insert({
                conversation_id: convId,
                role: "assistant",
                content: assistantContent,
              } as any);
            await supabase
              .from("chat_conversations")
              .update({ updated_at: new Date().toISOString() } as any)
              .eq("id", convId);
          } catch (err) {
            console.error("Error saving assistant message:", err);
          }
        }
      }
    },
    [messages, isLoading, childContext, userId]
  );

  return {
    messages,
    isLoading,
    sendMessage,
    stopStreaming,
  };
}
