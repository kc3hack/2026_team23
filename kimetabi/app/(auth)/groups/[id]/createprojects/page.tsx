import CreateProjectForm from "@/components/group/createProjects/CreateProjects_byGroup";
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation";



type GroupIdProps = {
  params: Promise<{
    id: string
  }>
}

export default async function Page(props: GroupIdProps) {
  const { id } = await props.params
  const group = await prisma.group.findUnique({
    where: {
      id: id, //ここではグループの固有idを指すものとする
    },
    include: {
      members: {
        include: {
          user: true,
        },
        orderBy: {
          role: "asc"
        }
      }
    }
  })
  if (!group) notFound()
  return (
    <div className="mx-7">
      <CreateProjectForm
        members={group.members}
        groupId={id}
      />
    </div>
  )
}

