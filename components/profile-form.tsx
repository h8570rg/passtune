"use client";

import { useForm } from "@conform-to/react/future";
import type { SubmissionResult } from "@conform-to/react/future";
import { ErrorMessage, FieldError, Input, InputGroup, Label, TextField } from "@heroui/react";
import { useActionState, useState } from "react";
import { profileSchema } from "@/app/onboarding/_components/schema";
import { AvatarInput } from "@/components/avatar-input";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { DISPLAY_NAME_MAX_LENGTH, HANDLE_MAX_LENGTH } from "@/lib/config";
import { createSubmitHandler } from "@/lib/utils/form";

type ProfileFormProps = {
  action: (prevState: unknown, formData: FormData) => Promise<SubmissionResult<string[]>>;
  submitLabel: string;
  defaultValue?: {
    handle: string;
    displayName: string;
    avatarPath: string | null;
    avatarUrl: string | null;
  };
};

/** プロフィールの作成・編集で共通のフォーム（ID・表示名・アイコン画像） */
export function ProfileForm({ action, submitLabel, defaultValue }: ProfileFormProps) {
  const [lastResult, formAction, isPending] = useActionState(action, null);
  const [isUploading, setIsUploading] = useState(false);
  const { form, fields } = useForm(profileSchema, {
    lastResult,
    defaultValue: defaultValue
      ? { handle: defaultValue.handle, displayName: defaultValue.displayName }
      : undefined,
    onSubmit: createSubmitHandler(formAction),
  });

  return (
    <Form validationErrors={form.fieldErrors} {...form.props} className="space-y-6">
      <AvatarInput
        name={fields.avatarPath.name}
        defaultPath={defaultValue?.avatarPath}
        defaultUrl={defaultValue?.avatarUrl}
        onUploadingChange={setIsUploading}
      />
      <TextField
        name={fields.handle.name}
        defaultValue={fields.handle.defaultValue}
        autoComplete="username"
      >
        <Label>ユーザー ID</Label>
        <InputGroup>
          <InputGroup.Prefix>@</InputGroup.Prefix>
          <InputGroup.Input
            placeholder="passtune_fan"
            maxLength={HANDLE_MAX_LENGTH}
            autoCapitalize="none"
            spellCheck={false}
          />
        </InputGroup>
        <span className="text-xs text-muted">
          {defaultValue
            ? "半角英小文字・数字・_ で 3〜20 文字。変更すると、プロフィールの URL も変わります（招待リンクはそのまま使えます）"
            : "半角英小文字・数字・_ で 3〜20 文字。あとから変更できます"}
        </span>
        <FieldError />
      </TextField>
      <TextField
        name={fields.displayName.name}
        defaultValue={fields.displayName.defaultValue}
        autoComplete="nickname"
      >
        <Label>表示名</Label>
        <Input placeholder="パス太郎" maxLength={DISPLAY_NAME_MAX_LENGTH} />
        <FieldError />
      </TextField>
      {form.errors ? <ErrorMessage>{form.errors}</ErrorMessage> : null}
      <Button className="w-full" type="submit" isPending={isPending} isDisabled={isUploading}>
        {submitLabel}
      </Button>
    </Form>
  );
}
