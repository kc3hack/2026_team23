import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "./ui/button"

type buttonProps = {
  label: string,
  href: string
}



export function BackpreviousButton(Props: buttonProps) {
  return (
    <div>
      <Button variant="ghost" asChild className="ml-1 text-muted-foreground">
        <Link href={Props.href}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {Props.label}
        </Link>
      </Button>
    </div>
  )
}
