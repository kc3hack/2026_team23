"use client"

import { useTransition } from "react";
import { useRouter } from "next/navigation"; // Next.jsのナビゲーション機能を使います
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

// hrefを受け取る必要がなくなるので、Propsの定義（type buttonProps）は消してもOKです

export function BackpreviousButton() {
  const router = useRouter(); // routerを使えるように宣言します
  const [isPending, startTransition] = useTransition()

  return (
    <div>
      <Button
        variant="ghost"
        className="ml-1 text-muted-foreground"
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            router.back()
          })
        }} >
        {isPending ? (
          <div>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </div>
        ) : (
          <div className="flex mx-1 justify-center items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </div>
        )}
      </Button>
    </div>
  );
}
