This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# ディレクトリ構造

kimetabi/
├── app/
│ ├── (auth)/ # 認証関連（URLには表示されないグループ化）
│ │ └── login/
│ │ └── page.tsx # 画面: LP 兼 ログイン画面（「ログインしてはじめる」）
│ │
│ ├── projects/ # 旅行（Project）に関するページ
│ │ ├── create/
│ │ │ └── page.tsx # 画面: 旅行作成画面（※今の create_temp をここに移動）
│ │ └── [id]/ # [id]は動的ルーティング（各旅行の詳細）
│ │ ├── page.tsx # 画面: 旅行詳細（参加/不参加の回答、通知送信）
│ │ └── calendar/
│ │ └── page.tsx # 画面: カレンダー追加への案内画面
│ │
│ ├── groups/ # グループに関するページ
│ │ ├── page.tsx # 画面: Group 履歴画面（所属グループ一覧）
│ │ └── create/
│ │ └── page.tsx # 画面: 新しいグループを作る画面
│ │
│ ├── page.tsx # 画面: ホーム画面（ログイン後のダッシュボード / 予定一覧）
│ └── layout.tsx # 全画面共通のレイアウト（ヘッダーやナビゲーションバー）
│
├── actions/ # Server Actions（データベース保存処理など）
│ ├── project.ts # 旅行関連のアクション（createProject など）
│ └── group.ts # グループ関連のアクション
│
├── components/ # 使い回すUIパーツ
│ ├── ui/ # ボタンや入力フォームなどの小さなパーツ
│ └── project/ # 旅行一覧カードなどの大きめのパーツ
│
└── lib/ # 設定ファイルなど
└── prisma.ts # データベース接続設定
