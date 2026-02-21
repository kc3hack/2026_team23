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
      <div className="ml-5 mt-4 mr-5">
        <NotificationPleaseButton />
      </div>
      <div className="ml-5 mt-4">
        <NotificationCancelButton />
      </div>
      <div className="flex justify-between">
        <div className="mx-2 px-3 mt-4 flex ">
          <MoveGroupButton />
          <AddnewProjectButton />
        </div>
        <div className="mx-5 pl-2">
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <HostedProjects />
        </div>
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <MyProjectsList />
        </div>
      </div>
    </div>
  );
}
