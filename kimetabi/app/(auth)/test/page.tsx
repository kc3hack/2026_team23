"use client"
import { sendTestNotification } from "@/actions/test-notification";
import { Button } from "@/components/ui/button";


export default function Page() {
  return (
    <div>
      aa
      <Button onClick={() => sendTestNotification()}>
        自分に向けてテスト送信してみる
      </Button>
    </div>
  )
}
