import { auth } from "@/auth"
import NotificationToggle from "@/components/notification/notificationButton";
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
      <NotificationToggle />
      <p>こんにちは、{session.user?.name}さん</p>
      <div className="flex justify-between">
        <div></div>
        <div>
          <MoveGroupButton />
          <AddnewProjectButton />
        </div>
      </div>
      <div>
        ここに旅行の予定が表示されるつもり
      </div>


    </div>
  );
}
