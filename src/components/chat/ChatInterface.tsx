import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Send, Square, Bot, Plus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { useChatAssistant, type ChildContext } from "@/hooks/useChatAssistant";

type ChatInterfaceProps = {
  childContext?: ChildContext;
};

export function ChatInterface({ childContext }: ChatInterfaceProps) {
  const {
    messages,
    isLoading,
    sendMessage,
    stopStreaming,
    conversations,
    activeConversationId,
    loadConversation,
    startNewConversation,
  } = useChatAssistant(childContext);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}. ${d.getMonth() + 1}.`;
  };

  // Dynamic suggested questions based on child age
  const suggestedQuestions = (() => {
    const age = childContext?.age;
    const ageLabel = age ? `${age}-letnika` : "mojega otroka";
    return [
      "Kdaj naj bi otrok pravilno izgovarjal glasove?",
      `Katere vaje so primerne za ${ageLabel}?`,
      "Kako razumeti rezultate artikulacijskega testa?",
      "Kako spodbujati govor pri otroku?",
    ];
  })();

  return (
    <div className="flex flex-col h-full">
      {/* Conversation history bar */}
      {conversations.length > 0 && (
        <div className="border-b border-border bg-muted/30 p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={startNewConversation}
              className="text-xs gap-1 shrink-0"
            >
              <Plus className="w-3 h-3" />
              Nov pogovor
            </Button>
            <div className="h-4 w-px bg-border shrink-0 hidden sm:block" />
            <div className="flex gap-1.5 flex-wrap overflow-hidden">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg transition-colors truncate max-w-[200px] flex items-center gap-1.5 ${
                    activeConversationId === conv.id
                      ? "bg-dragon-green text-white"
                      : "bg-background border border-border hover:bg-muted text-muted-foreground"
                  }`}
                  title={conv.title}
                >
                  <MessageCircle className="w-3 h-3 shrink-0" />
                  <span className="truncate">{conv.title || "Pogovor"}</span>
                  <span className="text-[10px] opacity-70 shrink-0">
                    {formatDate(conv.updated_at)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="p-4 md:p-6 space-y-2">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-app-orange/10 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-app-orange" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Pozdravljeni! Sem Tomi 👋
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Vaš digitalni logopedski pomočnik. Pomagam vam z vprašanji o
                    govorno-jezikovnem razvoju vašega otroka in uporabi
                    aplikacije TomiTalk.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 w-full max-w-lg">
                  {suggestedQuestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion);
                        sendMessage(suggestion);
                      }}
                      className="text-left text-xs p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <ChatMessage
                key={i}
                message={msg}
                isStreaming={
                  isLoading &&
                  msg.role === "assistant" &&
                  i === messages.length - 1
                }
              />
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-app-orange text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Disclaimer */}
      <div className="px-4 pt-2 pb-0">
        <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
          Vsebino je ustvaril AI model na podlagi strokovnih logopedskih smernic; kljub temu so možne napake ali odstopanja.{" "}
          <Link to="/kontakt" className="underline hover:text-foreground transition-colors">
            Sporočite nam svoje mnenje.
          </Link>
        </p>
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-background p-4">
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 max-w-3xl mx-auto"
        >
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Vprašajte o govorno-jezikovnem razvoju..."
              className="min-h-[44px] max-h-[120px] resize-none pr-12 rounded-xl"
              rows={1}
              disabled={isLoading}
            />
          </div>

          {isLoading ? (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={stopStreaming}
              className="flex-shrink-0 rounded-xl"
              title="Ustavi"
            >
              <Square className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim()}
              className="flex-shrink-0 rounded-xl bg-app-orange hover:bg-app-orange/90"
              title="Pošlji"
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
