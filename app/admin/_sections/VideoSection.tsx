"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Video, Play, Upload, FileVideo, Loader2, Trash2, CheckCircle2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData()
  fd.append("file", file)
  const res = await fetch("/api/upload-video", { method: "POST", body: fd })
  if (!res.ok) throw new Error(`Error subiendo ${file.name}`)
  const { url } = await res.json()
  return url as string
}

export function VideoSection() {
  const { videoData, setVideoData, videoList, addVideoToList, removeVideoFromList } = useTheme()
  const [localData, setLocalData] = useState(videoData)
  const [isUploading, setIsUploading] = useState(false)
  const videoFileRef = useRef<HTMLInputElement>(null)
  const [videoSearch, setVideoSearch] = useState("")
  const [videosPerPage, setVideosPerPage] = useState(5)
  const [videoPage, setVideoPage] = useState(1)

  const pendingFiles = useRef<{
    video?: File
    sub1?: File; sub2?: File
    audio1?: File; audio2?: File
  }>({})

  useEffect(() => {
    setLocalData(videoData)
  }, [videoData])

  const handleVideoFile = (file: File | null) => {
    if (!file) return
    pendingFiles.current.video = file
    setLocalData(prev => ({ ...prev, url: URL.createObjectURL(file) }))
    toast.info(`${file.name} listo para subir`)
  }

  const handleFileChange = (type: "sub1" | "sub2" | "audio1" | "audio2", file: File | null) => {
    if (!file) return
    pendingFiles.current[type] = file
    const url = URL.createObjectURL(file)
    setLocalData(prev => {
      if (type === "sub1")   { const s = [...prev.subtitles];   s[0] = url; return { ...prev, subtitles: s } }
      if (type === "sub2")   { const s = [...prev.subtitles];   s[1] = url; return { ...prev, subtitles: s } }
      if (type === "audio1") { const a = [...prev.audioTracks]; a[0] = url; return { ...prev, audioTracks: a } }
      if (type === "audio2") { const a = [...prev.audioTracks]; a[1] = url; return { ...prev, audioTracks: a } }
      return prev
    })
    toast.info(`${file.name} listo para subir`)
  }

  const handleSave = async () => {
    const p = pendingFiles.current
    const hasFiles = p.video || p.sub1 || p.sub2 || p.audio1 || p.audio2
    const blank = () => ({ id: "", name: "", url: "", subtitles: [] as string[], audioTracks: [] as string[] })

    setIsUploading(true)
    const toastId = toast.loading(hasFiles ? "Subiendo archivos..." : "Guardando...")
    try {
      const final = { ...localData }
      if (p.video)  { final.url = await uploadFile(p.video) }
      if (p.sub1)   { const s = [...final.subtitles];   s[0] = await uploadFile(p.sub1);   final.subtitles = s }
      if (p.sub2)   { const s = [...final.subtitles];   s[1] = await uploadFile(p.sub2);   final.subtitles = s }
      if (p.audio1) { const a = [...final.audioTracks]; a[0] = await uploadFile(p.audio1); final.audioTracks = a }
      if (p.audio2) { const a = [...final.audioTracks]; a[1] = await uploadFile(p.audio2); final.audioTracks = a }

      const withId = { ...final, id: `video_${Date.now()}` }
      setVideoData(withId)
      addVideoToList(withId)
      pendingFiles.current = {}
      if (videoFileRef.current) videoFileRef.current.value = ""
      setLocalData(blank())
      toast.success("Video guardado", { id: toastId })
    } catch (err: any) {
      toast.error(err?.message ?? "Error al subir archivos", { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Formulario + Vista Previa */}
      <div className="flex flex-col xl:flex-row gap-6">

        {/* Agregar Nuevo Video */}
        <Card className="bg-card border-border flex-1">
          <CardHeader>
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Agregar Nuevo Video
            </CardTitle>
            <CardDescription>Sube un archivo de video con subtítulos y pistas de audio opcionales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <style dangerouslySetInnerHTML={{ __html: `input[type="file"]::file-selector-button { background-color: var(--accent); }` }} />

            {/* Nombre */}
            <div className="space-y-2">
              <Label className="text-foreground">Nombre del video</Label>
              <Input
                placeholder="Ej. Presentación del Proyecto"
                value={localData.name}
                onChange={(e) => setLocalData({ ...localData, name: e.target.value })}
                disabled={isUploading}
                className="bg-input border-border text-foreground"
              />
            </div>

            {/* Archivo de Video */}
            <div className="space-y-2">
              <Label className="text-foreground">Archivo de Video</Label>
              <Input
                ref={videoFileRef}
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoFile(e.target.files?.[0] || null)}
                disabled={isUploading}
                className="bg-input border-border text-foreground file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:cursor-pointer file:hover:opacity-90"
              />
            </div>

            {/* Subtítulos */}
            <div className="space-y-2">
              <Label className="text-foreground">Subtítulos (opcional)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Subtítulo 1 (.vtt / .srt)</Label>
                  <Input
                    type="file"
                    accept=".vtt,.srt"
                    onChange={(e) => handleFileChange("sub1", e.target.files?.[0] || null)}
                    disabled={isUploading}
                    className="bg-input border-border text-foreground file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:cursor-pointer file:hover:opacity-90"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Subtítulo 2 (.vtt / .srt)</Label>
                  <Input
                    type="file"
                    accept=".vtt,.srt"
                    onChange={(e) => handleFileChange("sub2", e.target.files?.[0] || null)}
                    disabled={isUploading}
                    className="bg-input border-border text-foreground file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:cursor-pointer file:hover:opacity-90"
                  />
                </div>
              </div>
            </div>

            {/* Pistas de Audio */}
            <div className="space-y-2">
              <Label className="text-foreground">Pistas de Audio (opcional)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Pista de Audio 1</Label>
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileChange("audio1", e.target.files?.[0] || null)}
                    disabled={isUploading}
                    className="bg-input border-border text-foreground file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:cursor-pointer file:hover:opacity-90"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Pista de Audio 2</Label>
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileChange("audio2", e.target.files?.[0] || null)}
                    disabled={isUploading}
                    className="bg-input border-border text-foreground file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:cursor-pointer file:hover:opacity-90"
                  />
                </div>
              </div>
            </div>

            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Subiendo archivos...
              </div>
            )}

            <div className="pt-2 border-t border-border">
              <Button
                onClick={handleSave}
                disabled={isUploading}
                className="w-full text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {isUploading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Subiendo...</>
                ) : (
                  <><Upload className="mr-2 h-4 w-4" />Guardar Video</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vista Previa */}
        <Card className="bg-card border-border w-full xl:w-[480px] shrink-0">
          <CardHeader>
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              {localData.name || "Vista Previa"}
            </CardTitle>
            <CardDescription>Previsualización del video seleccionado</CardDescription>
          </CardHeader>
          <CardContent className="p-0 rounded-b-lg overflow-hidden">
            <div className="bg-black aspect-video flex items-center justify-center">
              {localData.url ? (
                <video
                  key={localData.url}
                  src={localData.url}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  muted
                  loop
                >
                  {localData.subtitles.map((sub, idx) => (
                    <track key={idx} kind="subtitles" src={sub} label={`Subtítulo ${idx + 1}`} default={idx === 0} />
                  ))}
                </video>
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground py-12">
                  <FileVideo className="h-16 w-16 mb-4 opacity-10" />
                  <p className="text-sm opacity-40">Selecciona un archivo de video</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Videos Guardados */}
      {videoList.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  Videos Guardados
                </CardTitle>
                <CardDescription className="mt-1">
                  {videoList.length} video{videoList.length !== 1 ? "s" : ""} en total
                </CardDescription>
              </div>
              <div className="flex gap-2 items-center">
                <div className="relative flex-1 sm:w-52">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Buscar video..."
                    value={videoSearch}
                    onChange={(e) => { setVideoSearch(e.target.value); setVideoPage(1) }}
                    className="pl-8 bg-input border-border text-foreground"
                  />
                </div>
                <Select
                  value={String(videosPerPage)}
                  onValueChange={(v) => { setVideosPerPage(Number(v)); setVideoPage(1) }}
                >
                  <SelectTrigger className="w-20 bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {(() => {
              const filtered = videoList.filter((v) =>
                v.name.toLowerCase().includes(videoSearch.toLowerCase()) ||
                v.url.toLowerCase().includes(videoSearch.toLowerCase())
              )
              const totalPages = Math.max(1, Math.ceil(filtered.length / videosPerPage))
              const safePage = Math.min(videoPage, totalPages)
              const paginated = filtered.slice((safePage - 1) * videosPerPage, safePage * videosPerPage)

              return (
                <>
                  {filtered.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg border-border">
                      No se encontraron videos para &ldquo;{videoSearch}&rdquo;
                    </div>
                  ) : (
                    paginated.map((v) => (
                      <div
                        key={v.id}
                        className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${videoData.id === v.id ? "bg-primary/10 border-primary" : "bg-muted/50 border-border"}`}
                      >
                        {/* Thumbnail */}
                        <div className="w-24 h-14 rounded-md overflow-hidden bg-black shrink-0">
                          <video src={v.url} className="w-full h-full object-cover" muted preload="metadata" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{v.name || "Sin nombre"}</p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{v.url}</p>
                          <div className="flex gap-3 mt-1 text-[10px] text-muted-foreground">
                            {v.subtitles.length > 0 && <span>{v.subtitles.length} subtítulo{v.subtitles.length > 1 ? "s" : ""}</span>}
                            {v.audioTracks.length > 0 && <span>{v.audioTracks.length} pista{v.audioTracks.length > 1 ? "s" : ""}</span>}
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center gap-2 shrink-0">
                          {videoData.id === v.id ? (
                            <span className="flex items-center gap-1 text-xs text-primary font-medium">
                              <CheckCircle2 className="h-4 w-4" /> Activo
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs border-border text-foreground hover:bg-muted"
                              onClick={() => { setVideoData(v); setLocalData(v); toast.success(`"${v.name}" establecido como activo`) }}
                            >
                              Usar
                            </Button>
                          )}
                          {videoData.id === v.id ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive" className="h-8">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar video activo?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    <strong>&ldquo;{v.name}&rdquo;</strong> es el video que se está mostrando actualmente en el sitio. Si lo eliminas dejará de reproducirse. ¿Estás seguro?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                    onClick={() => { removeVideoFromList(v.id); toast.warning("Video activo eliminado de la lista") }}
                                  >
                                    Sí, eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8"
                              onClick={() => removeVideoFromList(v.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}

                  {/* Paginación */}
                  {filtered.length > videosPerPage && (
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        {(safePage - 1) * videosPerPage + 1}–{Math.min(safePage * videosPerPage, filtered.length)} de {filtered.length}
                      </p>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="outline" className="h-7 w-7 border-border" disabled={safePage <= 1} onClick={() => setVideoPage((p) => p - 1)}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-foreground px-2">{safePage} / {totalPages}</span>
                        <Button size="icon" variant="outline" className="h-7 w-7 border-border" disabled={safePage >= totalPages} onClick={() => setVideoPage((p) => p + 1)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
