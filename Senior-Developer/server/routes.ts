import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import ytdl from "ytdl-core";
import { execa } from "execa";

async function getYoutubeInfo(url: string) {
  if (!ytdl.validateURL(url)) {
    throw new Error("Invalid YouTube URL");
  }
  
  const info = await ytdl.getInfo(url);
  
  // Filter for formats that have both audio and video, or reasonable quality
  const formats = info.formats.filter(f => f.hasVideo && f.hasAudio);
  
  // If no combined formats, take what we have (e.g. video only or audio only might be needed, but prompt implies video)
  // Let's return a mix.
  
  const downloadLinks = info.formats
    .filter(f => f.url) // Must have a URL
    .map(f => ({
      quality: f.qualityLabel || (f.hasAudio && !f.hasVideo ? 'Audio Only' : 'Unknown'),
      format: f.container,
      url: f.url
    }));

  // Deduplicate based on quality and format
  const uniqueLinks: typeof downloadLinks = [];
  const seen = new Set();
  
  for (const link of downloadLinks) {
    const key = `${link.quality}-${link.format}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueLinks.push(link);
    }
  }

  return {
    title: info.videoDetails.title,
    thumbnail: info.videoDetails.thumbnails.pop()?.url || "", // High res is usually last
    duration: info.videoDetails.lengthSeconds,
    downloadLinks: uniqueLinks
  };
}

async function getYtDlpInfo(url: string) {
  try {
    // -J for JSON output, --flat-playlist to just get the video info if it's a playlist (or handle single video)
    const { stdout } = await execa('yt-dlp', ['-J', url]);
    const info = JSON.parse(stdout);
    
    const formats = info.formats || [info]; // Sometimes single format
    
    const downloadLinks = formats
      .filter((f: any) => f.url && f.url.startsWith('http'))
      .map((f: any) => ({
        quality: f.resolution || f.format_note || 'Unknown',
        format: f.ext,
        url: f.url
      }));

    // Filter out m3u8 if possible as they are streams, not direct downloads usually, unless user has player
    // But requirement says "direct and temporary". http links from yt-dlp are often direct.

    return {
      title: info.title,
      thumbnail: info.thumbnail,
      duration: String(info.duration || 0),
      downloadLinks: downloadLinks.reverse() // Often best quality is last in yt-dlp
    };
  } catch (err: any) {
    console.error("yt-dlp error:", err.message);
    throw new Error("Failed to process video with external downloader");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.download.process.path, async (req, res) => {
    try {
      const { platform, url } = api.download.process.input.parse(req.body);
      
      let result;
      
      if (platform === 'youtube') {
        result = await getYoutubeInfo(url);
      } else {
        // TikTok, Instagram, Facebook use yt-dlp
        result = await getYtDlpInfo(url);
      }
      
      res.json(result);
    } catch (err: any) {
      console.error(err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      
      const message = err.message || "An internal error occurred";
      res.status(500).json({ message });
    }
  });

  return httpServer;
}
