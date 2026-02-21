"use client"
import { useState } from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UsersRound } from "lucide-react";

type GropIdProps = {
  groupId: string
}

export default function CreateProjectByGroupButton(Props: GropIdProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    redirect(`/groups/${Props.groupId}/createprojects`);
  };

  return (
    <>
      <Button
        className="w-full h-20 text-xl"
        onClick={handleClick}
        disabled={isLoading}
      >
        <UsersRound />
        {isLoading ? "Loading..." : (<div>
          このメンバーで旅行を計画する！
        </div>
        )}
      </Button>
    </>
  )
}
