"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "./ui/button"

type buttonProps = {
  href: string
}

export function BackpreviousButton(Props: buttonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  return (
    <div>
      <Button
        variant="ghost"
        asChild
        className="ml-1 text-muted-foreground"
        disabled={isLoading}
        onClick={handleClick}
      >
        <Link href={Props.href}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isLoading ? "移動中..." : "戻る"}
        </Link>
      </Button>
    </div>
  )
}

