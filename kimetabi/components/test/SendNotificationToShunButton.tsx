"use client"


import { sendNotification } from "@/actions/sendNotificationToOther";
import { Button } from "../ui/button";

export default function SendNotificationToShunButton() {

  return (
    <div>
      <Button onClick={() => sendNotification({
        userId: "cmlpy5qs40000tpus7t0rgefy", //安藤ID
        title: "個別メッセージ",
        body: "しゅんのID指定の特別メッセージです",

      })}>
        しゅんに通知を送信
      </Button>
    </div>
  )
}

