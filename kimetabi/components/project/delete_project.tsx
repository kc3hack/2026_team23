"use client"

import { useTransition } from "react"
import { MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteProjectAction } from "@/actions/deletingProject"

interface deleteProjectProps {
    tripId: string
}

export function DeleteProject({ tripId }: deleteProjectProps) {
    const [isPending, startTransition] = useTransition()
    const handleDelete = () => {
        if (window.confirm("本当にこの旅行を削除しますか？この操作は取り消せません")) {
            startTransition(() => {
                deleteProjectAction(tripId)
            })
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost"
                    size="icon"
                    disabled={isPending}>
                    <MoreHorizontal className="mr-2 h-8 w-8" />
                    <span className="sr-only">メニューを開く</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete} className="text-red cursor-pointer">
                    <Trash className="mr-2 h-4 w-4" />
                    プロジェクト削除
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}