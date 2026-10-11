"use client";

import { toast } from "@heroui/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { lookupTracks } from "@/lib/music/itunes";
import { createClient } from "@/lib/supabase/client";

/**
 * 試聴プレーヤー。同時に 1 曲だけ再生する（別の曲を再生すると前の曲は止まる）。
 * 試聴音源の URL は保存せず、再生時に iTunes Lookup API から取得する（Apple の利用条件: キャッシュ禁止）。
 * 投稿の試聴が始まったら、延べ再生回数を 1 増やす。
 */

type PlayRequest = {
  key: string;
  appleTrackId: number;
  previewUrl?: string | null;
  postId?: string;
};

type PlayerState = {
  currentKey: string | null;
  status: "idle" | "loading" | "playing" | "paused";
  progress: number;
};

type PlayerContextValue = PlayerState & {
  toggle: (request: PlayRequest) => void;
  stop: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewCache = useRef(new Map<number, string | null>());
  const countedRef = useRef<string | null>(null);
  const [state, setState] = useState<PlayerState>({
    currentKey: null,
    status: "idle",
    progress: 0,
  });

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;
    const onTime = () =>
      setState((prev) => ({
        ...prev,
        progress: audio.duration ? audio.currentTime / audio.duration : 0,
      }));
    const onEnded = () =>
      setState((prev) => ({ ...prev, status: "idle", progress: 0, currentKey: null }));
    const onPause = () =>
      setState((prev) => (prev.status === "playing" ? { ...prev, status: "paused" } : prev));
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  const resolvePreviewUrl = useCallback(async (request: PlayRequest) => {
    if (request.previewUrl) return request.previewUrl;
    if (previewCache.current.has(request.appleTrackId)) {
      return previewCache.current.get(request.appleTrackId) ?? null;
    }
    const tracks = await lookupTracks([request.appleTrackId]);
    const url = tracks.get(request.appleTrackId)?.previewUrl ?? null;
    previewCache.current.set(request.appleTrackId, url);
    return url;
  }, []);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    setState({ currentKey: null, status: "idle", progress: 0 });
  }, []);

  const toggle = useCallback(
    async (request: PlayRequest) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (state.currentKey === request.key) {
        if (state.status === "playing") {
          audio.pause();
          return;
        }
        if (state.status === "paused") {
          await audio.play().catch(() => undefined);
          setState((prev) => ({ ...prev, status: "playing" }));
          return;
        }
      }

      audio.pause();
      setState({ currentKey: request.key, status: "loading", progress: 0 });
      try {
        const url = await resolvePreviewUrl(request);
        if (!url) {
          toast.danger("この曲は試聴できません");
          setState({ currentKey: null, status: "idle", progress: 0 });
          return;
        }
        audio.src = url;
        await audio.play();
        setState({ currentKey: request.key, status: "playing", progress: 0 });
        if (request.postId && countedRef.current !== request.key) {
          countedRef.current = request.key;
          void createClient()
            .rpc("increment_play_count", { p_post_id: request.postId })
            .then(() => undefined);
        }
      } catch {
        toast.danger("試聴を再生できませんでした");
        setState({ currentKey: null, status: "idle", progress: 0 });
      }
    },
    [resolvePreviewUrl, state.currentKey, state.status],
  );

  // 同じ投稿でも、一度止めてから再生し直したら再カウントする
  useEffect(() => {
    if (state.status === "idle") countedRef.current = null;
  }, [state.status]);

  const value = useMemo(() => ({ ...state, toggle, stop }), [state, toggle, stop]);
  return <PlayerContext value={value}>{children}</PlayerContext>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within PlayerProvider");
  return context;
}
