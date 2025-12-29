import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="py-8 md:py-12 text-center relative z-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-in">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Universal Video Downloader</span>
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-4 animate-in [animation-delay:100ms]">
        Download from <span className="text-primary">Anywhere</span>
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 animate-in [animation-delay:200ms]">
        Save your favorite videos from YouTube, TikTok, Instagram, and Facebook in high quality instantly.
      </p>
    </header>
  );
}
