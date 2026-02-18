"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logOut } from "@/actions/auth"



export default function UserMenu({ imageUrl }: { imageUrl: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="mb-1.5 mt-1 mr-1.5 cursor-pointer hover:opacity-80 transition">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>NS</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={async () => {
            await logOut()
          }}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer font-bold"
        >
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
