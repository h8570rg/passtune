"use client";

import { useForm } from "@conform-to/react/future";
import {
  ErrorMessage,
  FieldError,
  Input,
  InputOTP,
  Label,
  REGEXP_ONLY_DIGITS,
  Separator,
  TextField,
  toast,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useActionState, useState, useTransition } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { OTP_LENGTH } from "@/lib/config";
import { createSubmitHandler } from "@/lib/utils/form";
import { isInAppBrowser } from "@/lib/utils/user-agent";
import { sendOtp, signInWithGoogle, verifyOtp } from "./actions";
import { sendOtpSchema, verifyOtpSchema } from "./schema";

export function LoginFlow({ next }: { next: string | null }) {
  const [sendState, sendAction, isSending] = useActionState(sendOtp, null);
  const sentEmail = sendState?.sentEmail ?? null;
  const [editingEmail, setEditingEmail] = useState(false);
  const step = sentEmail && !editingEmail ? "verify" : "email";

  return step === "email" ? (
    <EmailStep
      lastResult={sendState?.result ?? null}
      action={sendAction}
      isPending={isSending}
      onSubmitted={() => setEditingEmail(false)}
      next={next}
    />
  ) : (
    <VerifyStep
      email={sentEmail ?? ""}
      next={next}
      onBack={() => setEditingEmail(true)}
      onResend={() => {
        const formData = new FormData();
        formData.set("email", sentEmail ?? "");
        sendAction(formData);
        toast.success("確認コードを再送しました");
      }}
    />
  );
}

function EmailStep({
  lastResult,
  action,
  isPending,
  onSubmitted,
  next,
}: {
  lastResult: Awaited<ReturnType<typeof sendOtp>>["result"] | null;
  action: (formData: FormData) => void;
  isPending: boolean;
  onSubmitted: () => void;
  next: string | null;
}) {
  const { form, fields } = useForm(sendOtpSchema, {
    lastResult,
    onSubmit: createSubmitHandler((formData) => {
      onSubmitted();
      action(formData);
    }),
  });
  const [isGooglePending, startGoogle] = useTransition();

  const handleGoogle = () => {
    if (isInAppBrowser(navigator.userAgent)) {
      window.alert(
        "アプリ内ブラウザでは Google でログインできません。Safari や Chrome で開くか、メールアドレスでログインしてください。",
      );
      return;
    }
    startGoogle(async () => {
      const result = await signInWithGoogle(next);
      if (result?.error) toast.danger(result.error);
    });
  };

  return (
    <div className="space-y-6">
      <Form validationErrors={form.fieldErrors} {...form.props}>
        <input type="hidden" name="next" value={next ?? ""} />
        <TextField
          type="email"
          inputMode="email"
          name={fields.email.name}
          autoComplete="email"
          defaultValue={fields.email.defaultValue}
        >
          <Label>メールアドレス</Label>
          <Input placeholder="you@example.com" />
          <FieldError />
        </TextField>
        {form.errors ? <ErrorMessage>{form.errors}</ErrorMessage> : null}
        <Button className="mt-4 w-full" type="submit" isPending={isPending}>
          確認コードを送る
        </Button>
      </Form>
      <div className="flex items-center gap-3 text-xs text-muted">
        <Separator className="flex-1" />
        または
        <Separator className="flex-1" />
      </div>
      <Button
        className="w-full"
        variant="tertiary"
        onPress={handleGoogle}
        isPending={isGooglePending}
      >
        <Icon icon="devicon:google" className="size-5" />
        Google でログイン
      </Button>
    </div>
  );
}

function VerifyStep({
  email,
  next,
  onBack,
  onResend,
}: {
  email: string;
  next: string | null;
  onBack: () => void;
  onResend: () => void;
}) {
  const [lastResult, action, isPending] = useActionState(verifyOtp, null);
  const { form, fields } = useForm(verifyOtpSchema, {
    lastResult,
    onSubmit: createSubmitHandler(action),
  });
  const tokenErrors = form.fieldErrors?.[fields.token.name];

  return (
    <Form validationErrors={form.fieldErrors} {...form.props}>
      <input type="hidden" name={fields.email.name} value={email} />
      <input type="hidden" name={fields.next.name} value={next ?? ""} />
      <div className="space-y-2">
        <p className="text-sm">
          <span className="font-medium">{email}</span> に確認メールを送りました。メールに書かれた{" "}
          {OTP_LENGTH}{" "}
          桁のコードを入力してください（このブラウザでメールのリンクを開いてもログインできます）。
        </p>
        <InputOTP
          name={fields.token.name}
          maxLength={OTP_LENGTH}
          pattern={REGEXP_ONLY_DIGITS}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          isInvalid={Boolean(tokenErrors?.length)}
          aria-label="確認コード"
        >
          <InputOTP.Group>
            {Array.from({ length: OTP_LENGTH }, (_, index) => (
              <InputOTP.Slot key={index} index={index} />
            ))}
          </InputOTP.Group>
        </InputOTP>
        {tokenErrors?.length ? <ErrorMessage>{tokenErrors[0]}</ErrorMessage> : null}
      </div>
      <Button className="mt-4 w-full" type="submit" isPending={isPending}>
        ログイン
      </Button>
      <div className="mt-2 flex justify-between text-sm">
        <Button variant="ghost" size="sm" onPress={onBack}>
          メールアドレスを変える
        </Button>
        <Button variant="ghost" size="sm" onPress={onResend}>
          コードを再送する
        </Button>
      </div>
    </Form>
  );
}
