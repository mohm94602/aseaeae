import { useState } from "react";
import { useProcessDownload } from "@/hooks/use-download";
import { Header } from "@/components/Header";
import { ResultCard } from "@/components/ResultCard";
import { useToast } from "@/hooks/use-toast";
import { 
  Youtube, 
  Instagram, 
  Facebook, 
  Video, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Custom TikTok icon since Lucide doesn't have it yet
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const PLATFORMS = [
  { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-500" },
  { id: "tiktok", name: "TikTok", icon: TikTokIcon, color: "text-pink-500" },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "text-purple-500" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600" },
] as const;

export default function Home() {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState<string>("youtube");
  const { toast } = useToast();
  
  const processMutation = useProcessDownload();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a valid video URL to continue.",
        variant: "destructive",
      });
      return;
    }

    processMutation.mutate(
      { url, platform: platform as any },
      {
        onError: (error) => {
          toast({
            title: "Download Failed",
            description: error.message,
            variant: "destructive",
          });
        },
        onSuccess: () => {
          toast({
            title: "Success!",
            description: "Video processed successfully.",
            action: <CheckCircle2 className="w-5 h-5 text-green-500" />,
          });
        },
      }
    );
  };

  const selectedPlatform = PLATFORMS.find(p => p.id === platform) || PLATFORMS[0];
  const PlatformIcon = selectedPlatform.icon;

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Header />

        <main className="relative z-10 w-full max-w-3xl mx-auto">
          {/* Main Input Card */}
          <div className="glass-card rounded-3xl p-1.5 animate-in [animation-delay:300ms]">
            <div className="bg-background/50 rounded-[1.2rem] p-6 md:p-8 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Platform Selector Tabs - Mobile/Desktop Responsive */}
                <div className="grid grid-cols-4 gap-2 p-1 bg-secondary/50 rounded-xl">
                  {PLATFORMS.map((p) => {
                    const Icon = p.icon;
                    const isSelected = platform === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPlatform(p.id)}
                        className={`
                          relative flex flex-col md:flex-row items-center justify-center gap-2 py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200
                          ${isSelected ? 'bg-background shadow-lg text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}
                        `}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? p.color : ''}`} />
                        <span className="hidden md:inline">{p.name}</span>
                        {isSelected && (
                          <motion.div
                            layoutId="activePlatform"
                            className="absolute inset-0 border-2 border-primary/20 rounded-lg pointer-events-none"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* URL Input Group */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <PlatformIcon className={`w-5 h-5 ${selectedPlatform.color} opacity-50 group-focus-within:opacity-100 transition-opacity`} />
                    </div>
                    <Input
                      placeholder={`Paste ${selectedPlatform.name} URL here...`}
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="pl-12 h-14 rounded-xl bg-secondary/30 border-2 border-transparent focus:border-primary/50 text-lg shadow-inner transition-all hover:bg-secondary/50"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={processMutation.isPending}
                    className="h-14 px-8 rounded-xl bg-gradient-to-r from-primary to-violet-600 hover:to-violet-500 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 text-lg font-semibold min-w-[160px]"
                  >
                    {processMutation.isPending ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Download
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Helper Text */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/60">
                  <AlertCircle className="w-4 h-4" />
                  <span>Supports HD Video, MP3 Audio, and more</span>
                </div>
              </form>
            </div>
          </div>

          {/* Error Message Display */}
          <AnimatePresence>
            {processMutation.isError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3"
              >
                <div className="p-2 bg-destructive/20 rounded-full">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <p className="font-medium">{processMutation.error.message}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Result */}
          <AnimatePresence>
            {processMutation.isSuccess && processMutation.data && (
              <ResultCard data={processMutation.data} />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground/40 text-sm">
        <p>© {new Date().getFullYear()} Universal Video Downloader. For personal use only.</p>
      </footer>
    </div>
  );
}
