"use client"
import { useState } from "react";
import { Button } from "../ui/button";
import { useNotificationManager } from "@/hooks/useNotificationManager";

export function NotificationCancelButton() {
  const { isSupported, subscription, error, subscribeToPush, unsubscribeFromPush } = useNotificationManager()
  //進行状況を示すためのフラグ
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = async () => {
    setIsLoading(true)
    try {
      await unsubscribeFromPush()
    } finally {
      setIsLoading(false)
    }
  }
  if (!isSupported) {
    return <></>
  }
  return (

    <div>
      {subscription && (
        <Button variant="destructive" onClick={() => handleCancel()}>
          アプリ通知をOFFにする
        </Button>
      )}
    </div>
  )
}

