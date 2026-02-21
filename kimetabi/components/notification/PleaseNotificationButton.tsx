"use client"
import { useNotificationManager } from "@/hooks/useNotificationManager";
import { Button } from "../ui/button";
import { useState } from "react";
import Callout from "../Callout";


export function NotificationPleaseButton() {
  const { isSupported, subscription, error, subscribeToPush } = useNotificationManager()

  const [isLoading, setIsLoading] = useState(false)
  const handlesubscribe = async () => {
    setIsLoading(true)
    try {
      await subscribeToPush()
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported) {
    return (
      <Callout type="danger" >
        お使いのブラウザは通知をサポートしていません。ごめんね。
      </Callout>
    )
  }

  return (
    <div>
      {!subscription && (
        <>
          <Callout type="info">
            ↓ 通知を購読することで旅行の招待をプッシュ通知で受け取れます
          </Callout>
          <Button variant="secondary" onClick={() => handlesubscribe()}>
            通知をONにする!
          </Button>

        </>


      )}
    </div>
  )
}
