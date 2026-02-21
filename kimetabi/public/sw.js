// public/sw.js

// 1. サーバーからPush通知を受け取った時の処理
self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push通知を受信しました！', event);

  // 通知データがない場合は無視
  if (!event.data) return;

  // サーバーから送られてきたJSONデータをパース
  const data = event.data.json();

  // 通知の見た目や動作の設定
  const options = {
    body: data.body, // 通知の本文
    icon: data.icon || '/favicon.ico', // 通知のアイコン（publicフォルダ内の画像）
    badge: '/favicon.ico', // スマホのステータスバーに出る小さな白黒アイコン
    vibrate: [100, 50, 100], // スマホのバイブレーションパターン
    data: {
      url: data.url || '/' // 通知をクリックしたときの遷移先URLを保存しておく
    }
  };

  // 画面に通知を表示！
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});


// 2. ユーザーが通知をクリックした時の処理
self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] 通知がクリックされました！');

  // まず通知自体を閉じる
  event.notification.close();

  // 保存しておいたURLを取り出す
  const urlToOpen = event.notification.data.url;

  // クリックされたら該当ページを開く（すでに開いていたらそこにフォーカスする）
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function (windowClients) {
      // すでに目的のURLが開かれているかチェック
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // 開かれていなければ新しいタブで開く
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
