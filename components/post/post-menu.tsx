"use client";

import { AlertDialog, Dropdown, toast } from "@heroui/react";
import { EllipsisIcon, Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/button";
import { deletePost } from "@/lib/actions/post";

/** 自分の投稿のメニュー（削除） */
export function PostMenu({ postId, redirectTo }: { postId: string; redirectTo?: string }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deletePost(postId, redirectTo);
      if (result?.error) {
        toast.danger(result.error);
        return;
      }
      setIsConfirmOpen(false);
      toast.success("投稿を削除しました");
    });
  };

  return (
    <>
      <Dropdown>
        <Dropdown.Trigger
          aria-label="投稿のメニュー"
          className="rounded-full p-1 text-muted hover:bg-default"
        >
          <EllipsisIcon className="size-5" />
        </Dropdown.Trigger>
        <Dropdown.Popover placement="bottom end">
          <Dropdown.Menu onAction={(key) => key === "delete" && setIsConfirmOpen(true)}>
            <Dropdown.Item id="delete" textValue="削除" className="text-danger">
              <Trash2Icon className="size-4" />
              削除
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      <AlertDialog isOpen={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container size="sm">
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Heading>投稿を削除しますか？</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                削除した投稿は元に戻せません。いいねとコメントも消えます。
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button variant="tertiary" slot="close">
                  キャンセル
                </Button>
                <Button variant="danger" onPress={handleDelete} isPending={isPending}>
                  削除する
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </>
  );
}
