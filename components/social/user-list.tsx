import Link from "next/link";
import { UserAvatar } from "@/components/user-avatar";
import type { Profile } from "@/lib/type";

type UserListProps = {
  users: Profile[];
  emptyMessage: string;
  /** 行の右側に置く操作（フォローボタンなど） */
  action?: (user: Profile) => React.ReactNode;
};

export function UserList({ users, emptyMessage, action }: UserListProps) {
  if (users.length === 0)
    return <p className="py-12 text-center text-sm text-muted">{emptyMessage}</p>;
  return (
    <ul className="divide-y divide-border">
      {users.map((user) => (
        <li key={user.id} className="flex items-center gap-3">
          <Link
            href={`/u/${user.handle}`}
            className="flex min-w-0 flex-1 items-center gap-3 py-3 hover:bg-default/40"
          >
            <UserAvatar avatarUrl={user.avatarUrl} name={user.displayName} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.displayName}</p>
              <p className="truncate text-xs text-muted">@{user.handle}</p>
            </div>
          </Link>
          {action ? <div className="shrink-0">{action(user)}</div> : null}
        </li>
      ))}
    </ul>
  );
}
