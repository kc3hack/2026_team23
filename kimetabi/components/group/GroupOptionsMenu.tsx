"use client"

import { useTransition } from "react"
import { MoreHorizontal, Trash } from "lucide-react"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { deleteGroupAction } from "@/actions/group"

interface GroupOptionMenuProos {
  groupId: string
}

export function GroupOptionMenu({ groupId }: GroupOptionMenuProos) {
  const [isPending, startTransition] = useTransition()
  const handleDelete = () => {
    if (window.confirm("本当にこのグループを削除しますか？この操作は取り消せません")) {
      startTransition(() => {
        deleteGroupAction(groupId)
      })
    }
  }
  return (
    <DropdownMenu>
      {/*aschildでButtonがそのままトリガーとなってくれるらしい。すごいね*/}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <MoreHorizontal className="mr-2 h-8 w-8" />
          <span className="sr-only">メニューを開く</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDelete} className="text-red-600 cursor-pointer">
          <Trash className="mr-2 h-4 w-4" />
          グループ削除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
