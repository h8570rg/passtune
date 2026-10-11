"use client";

import {
  Button as HeroUiButton,
  type ButtonProps as HeroUiButtonProps,
  Spinner,
} from "@heroui/react";

export type ButtonProps = HeroUiButtonProps;

/** 送信中はスピナーを出すボタン */
export function Button({ children, ...props }: ButtonProps) {
  return (
    <HeroUiButton {...props}>
      {(renderProps) => (
        <>
          {renderProps.isPending ? <Spinner color="current" size="sm" /> : null}
          {typeof children === "function" ? children(renderProps) : children}
        </>
      )}
    </HeroUiButton>
  );
}
