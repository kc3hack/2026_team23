"use client"
import { Button } from "../ui/button";
import { Plane } from "lucide-react";
import { redirect } from "next/navigation";

export default function AddnewProjectButton() {
  return (
    <>
      <Button onClick={() => redirect('/create')}>

        <Plane />
        旅行を計画する
      </Button>
    </>
  )
}
