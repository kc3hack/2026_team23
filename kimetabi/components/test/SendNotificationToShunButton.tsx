"use client"


import { sendNotification } from "@/actions/sendNotificationToOther";
import { Button } from "../ui/button";

export default function SendNotificationToShunButton() {

  return (
    <div>
      <Button onClick={() => sendNotification({
        userId: "", //安藤IDは削除しました
        title: "個別メッセージ",
        body: "しゅんのID指定の特別メッセージです",

      })}>
        しゅんに通知を送信
      </Button>
    </div>
  )
}



