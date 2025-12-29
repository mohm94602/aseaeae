import type { DownloadResponse } from "@shared/schema";
import { Download, Clock, Film, Music } from "lucide-react";
import { motion } from "framer-motion";

interface ResultCardProps {
  data: DownloadResponse;
}

export function ResultCard({ data }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-3xl overflow-hidden mt-8 w-full max-w-3xl mx-auto"
    >
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail Section */}
        <div className="w-full md:w-2/5 aspect-video md:aspect-auto relative bg-black/40 group overflow-hidden">
          <img
            src={data.thumbnail}
            alt={data.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
          
          {data.duration && (
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 text-white text-xs font-mono flex items-center gap-1 backdrop-blur-sm">
              <Clock className="w-3 h-3" />
              {data.duration}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 md:p-8 flex flex-col">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2">
            {data.title}
          </h3>
          
          <div className="h-px bg-white/10 w-full my-4" />
          
          <div className="space-y-4">
            <h4 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">
              Available Downloads
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.downloadLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-white/5 hover:bg-secondary hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      {link.format.toLowerCase() === 'mp3' ? (
                        <Music className="w-4 h-4" />
                      ) : (
                        <Film className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-white">
                        {link.quality}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase">
                        {link.format}
                      </span>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
