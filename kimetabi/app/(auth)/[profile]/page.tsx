import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth"; // auth.jsのパス
import prisma from "@/lib/prisma"; // prismaのパス
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackpreviousButton } from "@/components/backprevious-button";
import { DeleteAccountButton } from "@/components/delete-account-button";

type ProfilePageProps = {
  params: Promise<{
    profile: string;
  }>;
};

export default async function ProfilePage(props: ProfilePageProps) {
  const { profile } = await props.params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userInformation = await prisma.user.findUnique({
    where: {
      id: profile,
    },
  });

  if (!userInformation) {
    notFound();
  }

  return (
    // 画面中央に寄せるためのコンテナ
    <div className="container mx-auto p-6 max-w-md">
      {/* 3. 戻るボタンをカードの上に配置 */}
      <div className="mb-6">
        <BackpreviousButton/>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">プロフィール設定</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-8">
          {/* プロフィール画像 */}
          <div className="relative">
            {userInformation.image ? (
              <img
                src={userInformation.image}
                alt="プロフィール画像"
                className="w-24 h-24 rounded-full border-4 border-primary/10 object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl text-muted-foreground">👤</span>
              </div>
            )}
          </div>

          {/* 1. 名前とメールアドレス（gap-3で少し距離をあけました） */}
          <div className="text-center flex flex-col gap-3">
            <h2 className="text-2xl font-bold tracking-tight">
              {userInformation.name || "名前未設定"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {userInformation.email}
            </p>
          </div>

          {/* 2. アカウント削除ボタン */}
          <div className="w-full pt-4 border-t">
            <DeleteAccountButton />
            <p className="text-[10px] text-center text-destructive mt-2">
              ※一度削除するとデータは復旧できません
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
