// components/group/MemberList.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GroupMember, User } from "@prisma/client";
import { Prisma } from "@prisma/client";

// 1. 親（ページ）から受け取る「members」のデータの形（型）を定義します
type MemberWithUser = Prisma.GroupMemberGetPayload<{
  include: { user: true }
}>;

type MemberListProps = {
  members: MemberWithUser[]; // Member型の配列を受け取る
};

// 2. コンポーネント本体
export function MemberList({ members }: MemberListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>メンバー</CardTitle>
        <CardDescription>このグループに所属しているメンバー</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <ul className="divide-y">
          {members.map((gm) => (
            <li key={gm.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={gm.user.image || ""} alt={gm.user.name || "User"} />
                  <AvatarFallback>
                    {gm.user.name ? gm.user.name.slice(0, 1).toUpperCase() : "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium leading-none">{gm.user.name || "名前未設定ユーザー"}</p>
                  <p className="text-sm text-muted-foreground mt-1">{gm.user.email}</p>
                </div>
              </div>
              <div>
                {gm.role === "ADMIN" ? (
                  <Badge variant="default">管理者</Badge>
                ) : (
                  <Badge variant="secondary">メンバー</Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}