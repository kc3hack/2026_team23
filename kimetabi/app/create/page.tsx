"use client";

import { createProject } from "../actions/project"; // 作成したアクションをインポート
import { useState } from "react";

export default function CreateProjectForm() {
  const [loading, setLoading] = useState(false);

  const [budget, setBudget] = useState(50000);//予算管理用のuseStateを設定
  const Maxbudget = 100000;

  //０～１００パーセントの割合を計算
  const progress =(budget/Maxbudget)*100;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // ボタンの連打防止
    setLoading(true);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          新しい旅行を計画する ✈️
        </h2>

        <form action={createProject} onSubmit={handleSubmit} className="space-y-6">
          {/* 旅行タイトル */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              旅行のタイトル
            </label>
            <input
              name="title"
              type="text"
              required
              placeholder="例: 北海道グルメツアー"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/*　旅行詳細 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                旅行の詳細
            </label>
            <textarea
              name="tripDetail"
              placeholder="例：北海道のグルメを食べ歩きする旅です"
              className="w-full min-h-[100px] px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
          </div>

          {/* 出発日 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              出発予定日
            </label>
            <input
              name="departureDate"
              type="date"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* 予算のスライダー */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                予算の範囲 <span className={`ml-2 text-xl font-mono ${budget >= 300000 ? 'text-gray-500 font-bold' : 'text-blue-600'}`}>
                             {budget >= 100000 ? "上限なし" : `¥${budget.toLocaleString()}`}
                          </span>
            </label>
            <input 
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={budget}
              onChange={ (e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              style={{
                background: `linear-gradient(to right, 
            #3b82f6 0%, 
            #ef4444 ${progress}%, 
            #e5e7eb ${progress}%, 
            #e5e7eb 100%)`,}}>
            </input>  
          </div>
          

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 active:transform active:scale-95"
            }`}
          >
            {loading ? "作成中..." : "プロジェクトを作成する"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          作成後、メンバーを招待できるようになります。
        </p>
      </div>
    </div>
  );
}