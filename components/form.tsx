import { Form as HeroUiForm, type FormProps as HeroUiFormProps } from "@heroui/react";

export type FormProps = Omit<HeroUiFormProps, "validationBehavior">;

/** Conform のエラーを aria 属性で表示するフォーム */
export function Form({ children, ...props }: FormProps) {
  return (
    <HeroUiForm validationBehavior="aria" {...props}>
      {children}
    </HeroUiForm>
  );
}
