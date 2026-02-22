import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center space-y-6 text-center">
        
        {/* 「404」の色を指定された #42602D に変更しました */}
        <h1 className="text-9xl font-extrabold text-[#42602D]">
          404
        </h1>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
            目的地が見つかりません
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            お探しのページは、存在しない可能性があります。
          </p>
        </div>

        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }), 
            "px-10 bg-[#42602D] hover:bg-[#42602D]/90" // ボタンの色も合わせると統一感が出ます！
          )}
        >
          ホームへ戻る
        </Link>
      </div>
    </div>
  );
}