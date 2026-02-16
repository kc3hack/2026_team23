import { createProject } from "../actions/project";
// CreateProjectPage.ts
import { prisma } from "@/lib/prisma"; // データベース接続をインポート
import { auth } from "@/auth";

// 👇 async をつけて非同期コンポーネントにする
export default async function CreateProjectPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // 👇 画面を描画する前に、自分が所属しているグループ一覧を取得
  const myGroups = userId
    ? await prisma.group.findMany({
      where: {
        members: {
          some: { userId: userId } // 自分がメンバーに含まれているグループだけを取得
        }
      }
    })
    : [];

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>✈️ 新しい旅行を企画する</h2>

      <form action={createProject} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

        {/* ▼ グループ選択プルダウンを追加 ▼ */}
        <div>
          <label>参加するグループ（任意）</label><br />
          <select
            name="groupId"
            style={{ width: "100%", padding: "8px" }}
            defaultValue=""
          >
            <option value="">グループを指定しない（単発旅行）</option>
            {myGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
        {/* ▲ ここまで ▲ */}

        <div>
          <label>旅行のタイトル</label><br />
          <input
            type="text"
            name="title"
            placeholder="例：冬の温泉旅行"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label>出発日</label><br />
          <input
            type="date"
            name="departureDate"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button
          type="submit"
          style={{ padding: "10px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          旅行を作成する！
        </button>
      </form>
    </div>
  )
}

