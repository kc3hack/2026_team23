import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type GroupRole = "ADMIN" | "MEMBER";

interface GroupMemberItem {
  id: string;
  role: GroupRole;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface GroupMembersCardProps {
  members: GroupMemberItem[];
}

export function GroupMembersCard({ members }: GroupMembersCardProps) {
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
