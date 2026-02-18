"use client"
import { Button } from "./ui/button";
import { AppWindow } from "lucide-react";
import { redirect } from "next/navigation";

export default function TestMoveButton() {
  return (
    <>
      <Button onClick={() => redirect('/test')}>

        <AppWindow />
        開発者デバック画面を開く
      </Button>
    </>
  )
}
