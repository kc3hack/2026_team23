"use client"
import { redirect } from "next/navigation";
import { Button } from "../ui/button";
import { UsersRound } from "lucide-react";

export default function MoveGroupButton() {
  return (
    <>
      <Button
        className="bg-secondary text-secondary-foreground"
        onClick={() => redirect('/groups')}
      >
        <UsersRound />
        グループ管理
      </Button>
    </>
  )
}
