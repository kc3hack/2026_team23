"use client"
import { useState } from "react";
import { redirect } from "next/navigation";
import { Button } from "../ui/button";
import { UsersRound } from "lucide-react";

export default function MoveGroupButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    redirect('/groups');
  };

  return (
    <>
      <Button
        className="bg-secondary text-secondary-foreground"
        onClick={handleClick}
        disabled={isLoading}
      >
        <UsersRound />
        {isLoading ? "Loading..." : "グループ管理"}
      </Button>
    </>
  )
}
