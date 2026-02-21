"use client"; // ブラウザの「戻る」機能を使うので、Client Componentにする必要があります

import { useRouter } from "next/navigation"; // Next.jsのナビゲーション機能を使います
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

// hrefを受け取る必要がなくなるので、Propsの定義（type buttonProps）は消してもOKです

export function BackpreviousButton() {
  const router = useRouter(); // routerを使えるように宣言します

  return (
    <div>
      <Button 
        variant="ghost" 
        className="ml-1 text-muted-foreground"
        onClick={() => router.back()} >
        <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
      </Button>
    </div>
  );
}