"use client"
import { sendTestNotification } from "@/actions/test-notification";
import { Button } from "@/components/ui/button";

import SendNotificationToShunButton from "@/components/test/SendNotificationToShunButton";

export default function Page() {

  return (
    <div className="mt-5 ml-10">
      <Button onClick={() => sendTestNotification()}>
        自分に向けてテスト送信してみる
      </Button>
      <div>
        <SendNotificationToShunButton />
      </div>

    </div>
  )
}
