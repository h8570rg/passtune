export const USER_SEARCH_MAX_LENGTH = 30;

/** 友だち検索の入力を整える（前後の空白と先頭の @ を外し、長すぎる入力を切る） */
export function normalizeUserQuery(input: string | null | undefined): string {
  return (input ?? "").trim().replace(/^@+/, "").trim().slice(0, USER_SEARCH_MAX_LENGTH);
}

/** ILIKE の部分一致のパターンを作る。入力中の % _ \ は記号ではなく文字として扱う */
export function containsPattern(query: string): string {
  return `%${query.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
}
