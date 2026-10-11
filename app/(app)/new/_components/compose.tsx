"use client";

import { useForm } from "@conform-to/react/future";
import { ErrorMessage, Label, SearchField, Spinner, TextArea, TextField } from "@heroui/react";
import { CheckIcon, SearchIcon, XIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { PlayButton } from "@/components/play-button";
import { TrackBlock } from "@/components/post/track-block";
import { createPost } from "@/lib/actions/post";
import { POST_COMMENT_MAX_LENGTH } from "@/lib/config";
import { searchTracks, type Track } from "@/lib/music/itunes";
import { createPostSchema } from "@/lib/schemas/post";
import { createSubmitHandler } from "@/lib/utils/form";

/** 投稿する: 曲名で検索 → 候補を試聴 → 1 曲選ぶ → 一言を添えて投稿 */
export function Compose() {
  const [term, setTerm] = useState("");
  const [debouncedTerm] = useDebounce(term, 400);
  const [result, setResult] = useState<{ term: string; tracks: Track[]; error: boolean } | null>(
    null,
  );
  const [selected, setSelected] = useState<Track | null>(null);
  const query = debouncedTerm.trim();

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    searchTracks(query, controller.signal)
      .then((tracks) => setResult({ term: query, tracks, error: false }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setResult({ term: query, tracks: [], error: true });
      });
    return () => controller.abort();
  }, [query]);

  // 検索中・結果・エラーは、今の検索語と結果の検索語の一致から導く
  const isCurrent = result?.term === query;
  const status = !query ? "empty" : !isCurrent ? "loading" : result.error ? "error" : "done";
  const results = query && isCurrent ? result.tracks : [];

  if (selected) {
    return <ComposeForm track={selected} onChangeTrack={() => setSelected(null)} />;
  }

  return (
    <div className="space-y-4">
      <SearchField value={term} onChange={setTerm} aria-label="曲を検索" autoFocus>
        <SearchField.Group>
          <SearchField.SearchIcon>
            <SearchIcon className="size-4" />
          </SearchField.SearchIcon>
          <SearchField.Input placeholder="曲名・アーティスト名で検索" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
      {status === "loading" ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : status === "error" ? (
        <p className="py-8 text-center text-sm text-danger">
          検索できませんでした。時間をおいて試してください。
        </p>
      ) : status === "done" && results.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          見つかりませんでした。曲名とアーティスト名を両方入れて試してください。
        </p>
      ) : status === "empty" ? (
        <p className="py-8 text-center text-sm text-muted">友人に届けたい 1 曲を探しましょう</p>
      ) : (
        <ul className="divide-y divide-border" aria-label="検索結果">
          {results.map((track) => (
            <li key={track.trackId} className="flex items-center gap-3 py-2">
              <PlayButton
                playKey={`search:${track.trackId}`}
                appleTrackId={track.trackId}
                previewUrl={track.previewUrl}
                label={track.title}
                className="size-9"
              />
              {track.artworkUrl ? (
                // oxlint-disable-next-line nextjs/no-img-element -- Apple から直接配信する画像
                <img
                  src={track.artworkUrl}
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 rounded-md"
                />
              ) : null}
              <button
                type="button"
                onClick={() => setSelected(track)}
                className="min-w-0 flex-1 text-left"
                aria-label={`${track.title}（${track.artistName}）を選ぶ`}
              >
                <p className="truncate text-sm font-medium">{track.title}</p>
                <p className="truncate text-xs text-muted">
                  {track.artistName}
                  {track.albumName ? ` · ${track.albumName}` : ""}
                </p>
              </button>
              <Button size="sm" variant="secondary" onPress={() => setSelected(track)}>
                選ぶ
              </Button>
            </li>
          ))}
        </ul>
      )}
      {results.length > 0 ? (
        <p className="text-center text-[10px] text-muted">
          検索結果と試聴: provided courtesy of iTunes
        </p>
      ) : null}
    </div>
  );
}

function ComposeForm({ track, onChangeTrack }: { track: Track; onChangeTrack: () => void }) {
  const [lastResult, formAction, isPending] = useActionState(createPost, null);
  const { form, fields } = useForm(createPostSchema, {
    lastResult,
    onSubmit: createSubmitHandler(formAction),
  });
  const [comment, setComment] = useState("");

  return (
    <Form validationErrors={form.fieldErrors} {...form.props} className="space-y-4">
      <input type="hidden" name={fields.appleTrackId.name} value={track.trackId} />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-sm font-medium">
            <CheckIcon className="size-4 text-accent" />
            この曲で合っていますか？
          </span>
          <Button size="sm" variant="ghost" onPress={onChangeTrack}>
            <XIcon className="size-4" />
            選び直す
          </Button>
        </div>
        <TrackBlock
          playKey={`compose:${track.trackId}`}
          appleTrackId={track.trackId}
          title={track.title}
          artistName={track.artistName}
          artworkUrl={track.artworkUrl}
          previewUrl={track.previewUrl}
        />
      </div>
      <TextField name={fields.comment.name} value={comment} onChange={setComment}>
        <Label>一言（任意）</Label>
        <TextArea placeholder="この曲のどこが好き？" rows={3} maxLength={POST_COMMENT_MAX_LENGTH} />
        <span className="text-right text-xs text-muted">
          {comment.length} / {POST_COMMENT_MAX_LENGTH}
        </span>
      </TextField>
      {form.errors ? <ErrorMessage>{form.errors}</ErrorMessage> : null}
      <Button type="submit" className="w-full" isPending={isPending}>
        投稿する
      </Button>
    </Form>
  );
}
