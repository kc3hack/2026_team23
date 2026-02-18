import { auth } from "@/auth"
import AddnewProjectButton from "@/components/project/addnewProject";
import MoveGroupButton from "@/components/project/moveGroupButton";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth()

  if (!session) return (
    redirect('/login')
  )
  return (
    <div>
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
