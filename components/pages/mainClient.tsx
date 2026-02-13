"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { chatAction } from "@/actions/langchain"; // Assuming your server action is here
import { Send, User, Bot, Loader2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "bot";
  text: string;
}

export default function CareerChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isPending]);

  async function handleSend() {
    if (!input.trim() || isPending) return;

    const userText = input;
    setInput(""); // Clear input immediately for UX
    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    startTransition(async () => {
      const result = await chatAction(userText);

      if (result.error) {
        setMessages((prev) => [...prev, { role: "bot", text: result.error }]);
      } else {
        setMessages((prev:any) => [...prev, { role: "bot", text: result.content }]);
      }
    });
  }

  return (
    <div className="flex items-center justify-center bg-slate-50 p-2">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col shadow-xl border-slate-200">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Briefcase className="w-6 h-6" />
            Ollolaiser Career Coach AI
          </CardTitle>
          <p className="text-xs text-muted-foreground">Powered by Llama 3.3 & LangChain</p>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea ref={scrollRef} className="h-full p-4">
            {messages.length === 0 && (
              // <div className="flex flex-col items-center justify-center h-full text-center space-y-2 mt-20 opacity-60">
              //   <Bot className="w-12 h-12 mb-2" />
              //   <p className="font-medium">Welcome to your career transition partner.</p>
              //   <p className="text-sm max-w-xs">Ask me about resume optimization, interview strategies, or industry shifts.</p>
              // </div>
              
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 mt-16 px-6">
                  <div className="bg-primary/10 p-4 rounded-full">
                      <Briefcase className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                      <h2 className="text-xl font-bold tracking-tight">Oloolaiser Career & Placement Office</h2>
                      <p className="text-sm text-muted-foreground max-w-[300px]">
                          Your guide to **KUCCPS clusters**, **KCSE subject selection**, and **TVET pathways**. 
                      </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 w-full max-w-xs pt-4">
                      <div className="text-[10px] font-bold text-left text-muted-foreground uppercase tracking-widest">
                          Select a Career Track:
                      </div>
                      <Button variant="secondary" size="sm" className="justify-start text-xs h-9 shadow-sm" onClick={() => setInput("What subjects do I need for a Degree in Medicine?")}>
                          🩺 Medicine & Health Sciences
                      </Button>
                      <Button variant="secondary" size="sm" className="justify-start text-xs h-9 shadow-sm" onClick={() => setInput("Explain the Engineering cluster requirements.")}>
                          ⚙️ Engineering & Architecture
                      </Button>
                      <Button variant="secondary" size="sm" className="justify-start text-xs h-9 shadow-sm" onClick={() => setInput("What are the best TVET courses for a C- plain?")}>
                          🛠️ Technical & Vocational (TVET)
                      </Button>
                  </div>
              </div>
            )}

            <div className="space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user" 
                    ? "bg-primary text-primary-foreground ml-12 rounded-tr-none" 
                    : "bg-slate-100 text-slate-900 mr-12 rounded-tl-none"
                  }`}>
                    <div className="mt-1 shrink-0">
                      {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              ))}
              
              {isPending && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-500 rounded-2xl px-4 py-3 text-sm flex items-center gap-2 animate-pulse">
                    <Loader2 size={16} className="animate-spin" />
                    Coach is thinking...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 border-t bg-white">
          <div className="flex w-full gap-2">
            <Input
              placeholder="Ask me any question........."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isPending}
              className="rounded-full bg-slate-50 border-slate-200 focus-visible:ring-primary"
            />
            <Button 
              onClick={handleSend} 
              disabled={isPending || !input.trim()}
              size="icon"
              className="rounded-full shrink-0"
            >
              <Send size={18} />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}