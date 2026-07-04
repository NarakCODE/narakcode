"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { PauseIcon, PlayIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type MusicContextType = {
  isPlaying: boolean
  togglePlayback: () => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function useMusic() {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider")
  }
  return context
}

const DEFAULT_YOUTUBE_VIDEO_ID = "uVsy7Q7qr8s"
const DEFAULT_START_SECONDS = 114

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasLoadedPlayer, setHasLoadedPlayer] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const playerSrc = useMemo(() => {
    const params = new URLSearchParams({
      enablejsapi: "1",
      playsinline: "1",
      rel: "0",
      controls: "0",
      modestbranding: "1",
      start: DEFAULT_START_SECONDS.toString(),
      autoplay: "0",
    })

    if (typeof window !== "undefined") {
      params.set("origin", window.location.origin)
    }

    return `https://www.youtube.com/embed/${DEFAULT_YOUTUBE_VIDEO_ID}?${params.toString()}`
  }, [])

  const sendCommand = (func: "playVideo" | "pauseVideo") => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func,
        args: [],
      }),
      "https://www.youtube.com"
    )
  }

  const togglePlayback = () => {
    if (isPlaying) {
      sendCommand("pauseVideo")
      setIsPlaying(false)
      return
    }

    if (hasLoadedPlayer) {
      sendCommand("playVideo")
    } else {
      setHasLoadedPlayer(true)
    }

    setIsPlaying(true)
  }

  return (
    <MusicContext.Provider value={{ isPlaying, togglePlayback }}>
      {children}
      {hasLoadedPlayer ? (
        <iframe
          ref={iframeRef}
          width={200}
          height={200}
          src={playerSrc}
          title="NarakCODE music on YouTube"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          className="pointer-events-none fixed top-0 -left-[9999px] size-[200px] opacity-0"
          aria-hidden
          tabIndex={-1}
          onLoad={() => {
            if (isPlaying) {
              sendCommand("playVideo")
            }
          }}
        />
      ) : null}

      <Button
        variant="outline"
        size="icon"
        onClick={togglePlayback}
        aria-label={isPlaying ? "Pause YouTube audio" : "Play YouTube audio"}
        aria-pressed={isPlaying}
        className={cn(
          "fixed bottom-6 left-6 z-50 size-12 rounded-full shadow-md transition-all duration-300 ease-out",
          isPlaying &&
            "border-red-500/30 bg-red-500/5 text-red-500 hover:text-red-500 dark:bg-red-500/10",
          isScrolled
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-16 scale-50 opacity-0"
        )}
      >
        {isPlaying ? (
          <PauseIcon className="size-5" />
        ) : (
          <PlayIcon className="size-5 fill-current" />
        )}
      </Button>
    </MusicContext.Provider>
  )
}

type MusicButtonProps = {
  className?: string
}

export function MusicButton({ className }: MusicButtonProps) {
  const { isPlaying, togglePlayback } = useMusic()

  return (
    <button
      type="button"
      onClick={togglePlayback}
      aria-label={isPlaying ? "Pause YouTube audio" : "Play YouTube audio"}
      aria-pressed={isPlaying}
      className={cn(
        "relative flex touch-manipulation items-center justify-center text-muted-foreground transition-[color,scale] will-change-[scale] select-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:outline-none active:scale-[0.9]",
        isPlaying && "text-red-500 hover:text-red-500",
        className
      )}
    >
      <span className="absolute size-12 pointer-fine:hidden" aria-hidden />
      {isPlaying ? (
        <PauseIcon className="size-4.5" aria-hidden />
      ) : (
        <PlayIcon className="size-4.5 fill-current" aria-hidden />
      )}
    </button>
  )
}
