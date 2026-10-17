"use client";

import { SearchField } from "@heroui/react";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "use-debounce";
import { USER_SEARCH_MAX_LENGTH } from "@/lib/utils/search";

/** 友だち検索の入力欄。入力が止まったら URL（?q=）を更新し、結果はサーバーで出す */
export function SearchBox({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [term, setTerm] = useState(defaultValue);
  const [debounced] = useDebounce(term.trim(), 300);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (debounced === defaultValue) return;
    const href = debounced ? `${pathname}?q=${encodeURIComponent(debounced)}` : pathname;
    startTransition(() => router.replace(href, { scroll: false }));
  }, [debounced, defaultValue, pathname, router]);

  return (
    <SearchField value={term} onChange={setTerm} aria-label="友だちを探す" autoFocus>
      <SearchField.Group>
        <SearchField.SearchIcon>
          <SearchIcon className="size-4" />
        </SearchField.SearchIcon>
        <SearchField.Input
          placeholder="ユーザー ID・表示名で探す"
          maxLength={USER_SEARCH_MAX_LENGTH}
          autoCapitalize="none"
          spellCheck={false}
        />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
}
