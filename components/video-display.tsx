"use client"

import { useState, useRef, useEffect } from "react"
import { useTheme } from "@/contexts/theme-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Music, 
  Subtitles as SubtitlesIcon,
  Settings,
  RotateCcw
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function VideoDisplay() {
  const { videoData } = useTheme()
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([])
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [volume, setVolume] = useState(1)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [activeAudioTrack, setActiveAudioTrack] = useState(-1) // -1 is original video audio
  const [activeSubtitle, setActiveSubtitle] = useState(-1) // -1 is off
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Sync muted state to DOM — React's `muted` prop doesn't update reactively on <video>
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted || activeAudioTrack !== -1
    }
    audioRefs.current.forEach((a, i) => {
      if (a) a.muted = isMuted || activeAudioTrack !== i
    })
  }, [isMuted, activeAudioTrack])

  // Autoplay when video source is ready (muted, so browsers allow it)
  useEffect(() => {
    if (videoRef.current && videoData?.url) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {})
    }
  }, [videoData?.url])

  if (!videoData || !videoData.url) return null

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        audioRefs.current.forEach(a => a?.pause())
      } else {
        videoRef.current.play()
        if (activeAudioTrack !== -1) {
          const activeAudio = audioRefs.current[activeAudioTrack]
          if (activeAudio) {
            activeAudio.currentTime = videoRef.current.currentTime
            activeAudio.play()
          }
        }
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(p)
      
      // Sync active audio track if necessary
      if (activeAudioTrack !== -1) {
        const activeAudio = audioRefs.current[activeAudioTrack]
        if (activeAudio && Math.abs(activeAudio.currentTime - videoRef.current.currentTime) > 0.1) {
          activeAudio.currentTime = videoRef.current.currentTime
        }
      }
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const time = (value[0] / 100) * videoRef.current.duration
      videoRef.current.currentTime = time
      setProgress(value[0])
      audioRefs.current.forEach(a => {
        if (a) a.currentTime = time
      })
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current?.parentElement) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.parentElement.requestFullscreen()
      }
    }
  }

  const changeAudioTrack = (index: number) => {
    setActiveAudioTrack(index)
    // Pause all extra audio tracks, then start the selected one
    audioRefs.current.forEach((a, i) => {
      if (!a) return
      a.pause()
      if (i === index && isPlaying && videoRef.current) {
        a.currentTime = videoRef.current.currentTime
        a.play()
      }
    })
  }

  const changeSubtitle = (index: number) => {
    setActiveSubtitle(index)
    if (videoRef.current) {
      const tracks = videoRef.current.textTracks
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].mode = i === index ? "showing" : "hidden"
      }
    }
  }

  const handleVideoError = () => {
    console.error("Video failed to load, falling back to default")
    // If it fails, we try to load the default video
    if (videoRef.current && videoData.url !== "/camion.mp4") {
      videoRef.current.src = "/camion.mp4"
      videoRef.current.load()
    }
  }

  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <Card 
          className="overflow-hidden border-border/50 shadow-2xl relative group bg-black aspect-video"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          {/* Main Video Element */}
          <video
            ref={videoRef}
            src={videoData.url}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
            onError={handleVideoError}
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            playsInline
            autoPlay
            loop
          >
            {videoData.subtitles.map((sub, idx) => (
              <track 
                key={idx}
                kind="subtitles" 
                src={sub} 
                label={`Subtítulo ${idx + 1}`} 
                className="vtt-track"
              />
            ))}
          </video>

          {/* Sync Audio Elements (Hidden) */}
          {videoData.audioTracks.map((track, idx) => (
            <audio
              key={idx}
              ref={el => { audioRefs.current[idx] = el }}
              src={track}
              muted={activeAudioTrack !== idx || isMuted}
            />
          ))}

          {/* Overlay Content */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-500 flex flex-col justify-end p-4 z-20",
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            
            {/* Progress Bar */}
            <div className="mb-4 group/progress">
              <Slider
                value={[progress]}
                max={100}
                step={0.1}
                onValueChange={handleSeek}
                className="cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20">
                  {isPlaying ? <Pause className="h-6 w-6 fill-white" /> : <Play className="h-6 w-6 fill-white" />}
                </Button>

                <div className="flex items-center gap-2 group/volume">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMuted(m => !m)}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300">
                    <Slider
                      value={[isMuted ? 0 : volume * 100]}
                      max={100}
                      onValueChange={(v) => {
                        const newVol = v[0] / 100
                        setVolume(newVol)
                        if (newVol > 0) setIsMuted(false)
                        if (videoRef.current) videoRef.current.volume = newVol
                        audioRefs.current.forEach(a => { if (a) a.volume = newVol })
                      }}
                      className="w-20"
                    />
                  </div>
                </div>

                <span className="text-xs text-white/80 font-mono">
                  {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Audio Tracks Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" title="Pistas de Audio">
                      <Music className={cn("h-5 w-5", activeAudioTrack !== -1 && "text-accent")} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black/90 border-white/10 text-white backdrop-blur-md">
                    <DropdownMenuLabel>Seleccionar Audio</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuCheckboxItem 
                      checked={activeAudioTrack === -1}
                      onCheckedChange={() => changeAudioTrack(-1)}
                    >
                      Original
                    </DropdownMenuCheckboxItem>
                    {videoData.audioTracks.map((_, idx) => (
                      <DropdownMenuCheckboxItem 
                        key={idx}
                        checked={activeAudioTrack === idx}
                        onCheckedChange={() => changeAudioTrack(idx)}
                      >
                        Pista Extra {idx + 1}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Subtitles Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" title="Subtítulos">
                      <SubtitlesIcon className={cn("h-5 w-5", activeSubtitle !== -1 && "text-accent")} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black/90 border-white/10 text-white backdrop-blur-md">
                    <DropdownMenuLabel>Subtítulos</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuCheckboxItem 
                      checked={activeSubtitle === -1}
                      onCheckedChange={() => changeSubtitle(-1)}
                    >
                      Desactivados
                    </DropdownMenuCheckboxItem>
                    {videoData.subtitles.map((_, idx) => (
                      <DropdownMenuCheckboxItem 
                        key={idx}
                        checked={activeSubtitle === idx}
                        onCheckedChange={() => changeSubtitle(idx)}
                      >
                        Subtítulo {idx + 1}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Title Label (Same as before) */}
          <div className={cn(
            "absolute top-4 left-4 z-30 transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}>
            <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              {videoData.name}
            </span>
          </div>
        </Card>
      </div>
    </section>
  )
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
