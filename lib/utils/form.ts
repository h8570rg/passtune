import { startTransition } from "react";

/**
 * Conform の useForm の onSubmit で使う共通ハンドラー。
 * preventDefault し、formData を取り出して startTransition で Server Action を呼ぶ。
 */
export const createSubmitHandler = (formAction: (formData: FormData) => void) => {
  return (event: React.SyntheticEvent, context?: { formData?: FormData }): void => {
    event.preventDefault();
    const formData = context?.formData ?? new FormData(event.target as HTMLFormElement);
    startTransition(() => {
      formAction(formData);
    });
  };
};
