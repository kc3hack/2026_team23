import { auth } from "@/auth"
import { NotificationCancelButton } from "@/components/notification/NotificationCancelButton";
import { NotificationPleaseButton } from "@/components/notification/PleaseNotificationButton";
import AddnewProjectButton from "@/components/project/addnewProject";
import MoveGroupButton from "@/components/project/moveGroupButton";
import TestMoveButton from "@/components/TestMoveButton";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth()

  if (!session) return (
    redirect('/login')
  )
  return (
    <div>
      <NotificationPleaseButton />
      <p>こんにちは、{session.user?.name}さん</p>
      <div className="flex justify-between">
        <div className="mx-2 px-1">
          <MoveGroupButton />
          <AddnewProjectButton />
        </div>
        <div className="mx-5 flex pl-2">
          <TestMoveButton />
          <NotificationCancelButton />
        </div>
      </div>
      <div className="px-10 mt-3">
        <div className="text-center py-20 border rounded-lg bg-muted/20 ">
          <p className="text-muted-foreground">現在招待されている旅行はありません！</p>
          <p className="text-sm text-muted-foreground mt-1">新しく作成するか、招待を受け取りましょう！</p>
        </div>

      </div>


    </div>
  );
}
