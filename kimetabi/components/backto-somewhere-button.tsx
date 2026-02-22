"use client"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
type buttonProps =
  {
    href: string
  }



export function BackToSomewhereButton(Props: buttonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  return (
    <div>
      <Button variant="ghost"
        asChild
        className="ml-1 text-muted-foreground"
        disabled={isPending}
        onClick={() => startTransition(() => {
          router.push(Props.href)
        })}
      >
        {isPending ? (
          <div>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </div>
        ) : (<div>
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </div>)}
      </Button>
    </div>
  )
}
