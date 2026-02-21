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

  const testTimeout = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);

  };
  return (
    <div className="mr-2">
      <Button
        className="h-10 text-sm"
        onClick={() => {
          testTimeout()
          handleClick()
        }}
        disabled={isLoading}
      >
        <div className="flex flex-col justify-center items-center">
          <UsersRound className="!h-7 !w-7" />
          {isLoading ? "Loading..." : "グループ管理"}
        </div>
      </Button>
    </div>
  )
}
