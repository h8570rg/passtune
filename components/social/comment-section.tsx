"use client";

import { useForm } from "@conform-to/react/future";
import { ErrorMessage, TextArea, TextField, toast } from "@heroui/react";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useActionState, useTransition } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { UserAvatar } from "@/components/user-avatar";
import { createComment, deleteComment } from "@/lib/actions/social";
import { COMMENT_MAX_LENGTH } from "@/lib/config";
import type { Comment } from "@/lib/data/social";
import { createCommentSchema } from "@/lib/schemas/post";
import { formatRelativeTime } from "@/lib/utils/date";
import { createSubmitHandler } from "@/lib/utils/form";

/** 投稿詳細のコメント一覧と入力欄（返信なし） */
export function CommentSection({
  postId,
  comments,
  viewerId,
}: {
  postId: string;
  comments: Comment[];
  viewerId: string | null;
}) {
  return (
    <section className="space-y-4 py-4" aria-label="コメント">
      <h2 className="text-sm font-bold">コメント {comments.length > 0 ? comments.length : ""}</h2>
      {comments.length === 0 ? (
        <p className="text-sm text-muted">最初のコメントを書きましょう</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-3">
              <Link href={`/u/${comment.author.handle}`} className="shrink-0">
                <UserAvatar
                  avatarUrl={comment.author.avatarUrl}
                  name={comment.author.displayName}
                  size="sm"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs">
                  <Link
                    href={`/u/${comment.author.handle}`}
                    className="font-semibold hover:underline"
                  >
                    {comment.author.displayName}
                  </Link>
                  <span className="text-muted">{formatRelativeTime(comment.createdAt)}</span>
                  {viewerId === comment.author.id ? (
                    <DeleteCommentButton commentId={comment.id} postId={postId} />
                  ) : null}
                </div>
                <p className="text-sm wrap-break-word whitespace-pre-wrap">{comment.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {viewerId ? (
        <CommentForm postId={postId} />
      ) : (
        <Link
          href={`/login?next=${encodeURIComponent(`/posts/${postId}`)}`}
          className="block rounded-xl border border-border px-4 py-3 text-center text-sm hover:bg-default"
        >
          ログインしてコメントする
        </Link>
      )}
    </section>
  );
}

function CommentForm({ postId }: { postId: string }) {
  const [lastResult, formAction, isPending] = useActionState(createComment, null);
  const { form, fields } = useForm(createCommentSchema, {
    lastResult,
    onSubmit: createSubmitHandler(formAction),
  });
  const bodyErrors = form.fieldErrors?.[fields.body.name];

  return (
    <Form validationErrors={form.fieldErrors} {...form.props} className="space-y-2">
      <input type="hidden" name={fields.postId.name} value={postId} />
      <TextField name={fields.body.name} key={form.key} aria-label="コメント">
        <TextArea placeholder="コメントを書く" rows={2} maxLength={COMMENT_MAX_LENGTH} />
      </TextField>
      {bodyErrors?.length ? <ErrorMessage>{bodyErrors[0]}</ErrorMessage> : null}
      {form.errors ? <ErrorMessage>{form.errors}</ErrorMessage> : null}
      <div className="flex justify-end">
        <Button type="submit" size="sm" isPending={isPending}>
          コメントする
        </Button>
      </div>
    </Form>
  );
}

function DeleteCommentButton({ commentId, postId }: { commentId: string; postId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      aria-label="コメントを削除"
      disabled={isPending}
      className="ml-auto text-muted hover:text-danger"
      onClick={() => {
        if (!window.confirm("このコメントを削除しますか？")) return;
        startTransition(async () => {
          const result = await deleteComment(commentId, postId);
          if (result.error) toast.danger(result.error);
        });
      }}
    >
      <Trash2Icon className="size-3.5" />
    </button>
  );
}
