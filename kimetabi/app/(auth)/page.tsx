import { auth } from "@/auth"
import HostedProjects from "@/components/main/HostedProjects";
import { NotificationCancelButton } from "@/components/notification/NotificationCancelButton";
import { NotificationPleaseButton } from "@/components/notification/PleaseNotificationButton";
import AddnewProjectButton from "@/components/project/addnewProject";
import MoveGroupButton from "@/components/project/moveGroupButton";
import MyProjectsList from "@/components/project/MyProjectList";
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
      <HostedProjects />
      <MyProjectsList />
    </div>
  );
}
