import { createProject } from "../actions/project";


export default function CreateProjectPage() {
  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>✈️ 新しい旅行を企画する</h2>

      <form action={createProject} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

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
