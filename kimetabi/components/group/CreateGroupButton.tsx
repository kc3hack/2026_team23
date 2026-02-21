"use client"
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateGroupButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Linkコンポーネントは自動的に遷移を行うため、ここではredirectは不要
    // 遷移先のページでisLoadingがリセットされる
  };

  return (
    <Button asChild disabled={isLoading} onClick={handleClick}>
      <Link href="/groups/create">
        {isLoading ? "作成中..." : "＋ 新規グループ作成"}
      </Link>
    </Button>
  );
}
