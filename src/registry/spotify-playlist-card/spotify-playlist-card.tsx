"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Music, Palette, RefreshCw, Volume2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsClient } from "@/hooks/use-is-client";

interface SpotifyPlaylistCardProps {
  playlistId?: string;
  title?: string;
  description?: string;
  className?: string;
}

export const SpotifyPlaylistCard = ({
  playlistId = "677KIyayzcVJeA77I9hEi0",
  title = "Spotify Playlist",
  description = "Curated music for every mood",
  className = "",
}: SpotifyPlaylistCardProps) => {
  const { theme, systemTheme, setTheme } = useTheme();
  const isMounted = useIsClient();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const [prevTheme, setPrevTheme] = useState(currentTheme);

  // Derived state pattern for theme changes
  if (isMounted && currentTheme !== prevTheme) {
    setPrevTheme(currentTheme);
    setIsLoading(true);
    setHasError(false);
  }

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    setIsLoading(true);
    setHasError(false);
  };

  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  const openInSpotify = () => {
    window.open(`https://open.spotify.com/playlist/${playlistId}`, "_blank");
  };

  const iframeHeight = "500px";

  if (!isMounted) {
    return (
      <Card className={`w-full overflow-hidden ${className}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-7 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-9 w-20" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Skeleton
            style={{ height: iframeHeight }}
            className="w-full rounded-lg"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`w-full overflow-hidden border-0 bg-gradient-to-br from-background to-muted/20 shadow-lg ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              <CardTitle className="bg-gradient-to-r from-foreground to-secondary bg-clip-text text-xl font-bold text-transparent">
                {title}
              </CardTitle>
            </div>
            <CardDescription className="text-sm">
              {description} • {currentTheme === "dark" ? "Dark" : "Light"} theme
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Volume2 className="h-3 w-3" />
              Spotify
            </Badge>
            <Button
              variant="outline"
              size="default"
              onClick={toggleTheme}
              className="gap-1 transition-transform hover:scale-105"
            >
              <Palette className="h-3 w-3" />
              Theme
            </Button>
            <Button
              variant="outline"
              size="default"
              onClick={openInSpotify}
              className="gap-1 transition-transform hover:scale-105"
            >
              <ExternalLink className="h-3 w-3" />
              Open
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div
          className="relative w-full overflow-hidden rounded-lg border bg-muted/10"
          style={{ height: iframeHeight }}
        >
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="mb-4"
                >
                  <Music className="h-12 w-12 text-primary" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2 text-center"
                >
                  <p className="text-sm font-medium">
                    Loading your playlist...
                  </p>
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                        }}
                        className="h-2 w-2 rounded-full bg-primary"
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {hasError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
            >
              <div className="space-y-4 p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <Music className="h-8 w-8 text-destructive" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Unable to load playlist</h3>
                  <p className="text-sm text-muted-foreground">
                    There was an issue loading the Spotify playlist. Please try
                    again.
                  </p>
                </div>
                <Button onClick={handleRetry} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Button>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentTheme}-${retryCount}`}
              className="h-full w-full"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
                scale: { duration: 0.3 },
              }}
            >
              <iframe
                title="Spotify Playlist"
                className="h-full w-full"
                src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=${currentTheme === "dark" ? "0" : "1"}`}
                width="100%"
                height="100%"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 flex items-center justify-between text-xs text-muted-foreground"
        >
          <span>Powered by Spotify</span>
          <span>Theme: {currentTheme === "dark" ? "Dark" : "Light"}</span>
        </motion.div>
      </CardContent>
    </Card>
  );
};
