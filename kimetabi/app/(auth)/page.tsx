import { auth } from "@/auth"
import { NotificationCancelButton } from "@/components/notification/NotificationCancelButton";
import { NotificationPleaseButton } from "@/components/notification/PleaseNotificationButton";
import AddnewProjectButton from "@/components/project/addnewProject";
import MoveGroupButton from "@/components/project/moveGroupButton";
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
        <div className="mx-5">
          <NotificationCancelButton />
        </div>
      </div>
      <div>
        ここに旅行の予定が表示されるつもり
      </div>


    </div>
  );
}
