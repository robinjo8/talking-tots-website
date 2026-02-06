import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistant`;

export function useChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

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

      const controller = new AbortController();
      abortControllerRef.current = controller;

      let assistantContent = "";

      try {
        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: updatedMessages }),
          signal: controller.signal,
        });

        if (!resp.ok) {
          const errorData = await resp.json().catch(() => null);
          const errorMsg =
            errorData?.error || "Napaka pri komunikaciji z asistentom.";

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

              // Handle Responses API streaming events
              // Text delta events
              if (parsed.type === "response.output_text.delta") {
                const delta = parsed.delta;
                if (delta) {
                  assistantContent += delta;
                  updateAssistant(assistantContent);
                }
              }

              // Also handle completed event to get final text
              if (parsed.type === "response.completed") {
                const output = parsed.response?.output;
                if (output && Array.isArray(output)) {
                  for (const item of output) {
                    if (item.type === "message" && item.content) {
                      for (const part of item.content) {
                        if (
                          part.type === "output_text" &&
                          part.text &&
                          !assistantContent
                        ) {
                          assistantContent = part.text;
                          updateAssistant(assistantContent);
                        }
                      }
                    }
                  }
                }
              }

              // Handle errors from the API
              if (parsed.type === "error") {
                console.error("Stream error:", parsed);
                toast.error("Napaka pri generiranju odgovora.");
                streamDone = true;
                break;
              }
            } catch {
              // Incomplete JSON, put it back
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
      }
    },
    [messages, isLoading]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    stopStreaming,
    clearMessages,
  };
}
