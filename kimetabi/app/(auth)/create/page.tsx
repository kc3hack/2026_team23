"use client";

import { createProject } from "../../../actions/project"; // 作成したアクションをインポート
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


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
    <div className="max-w mx-auto mt-10">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 mb-6 text-center">
            新しい旅行を計画する ✈️
          </CardTitle>
        </CardHeader>

        <form action={createProject} onSubmit={handleSubmit} className="space-y-6">
          {/* 旅行タイトル */}
          <Card>
            <CardHeader>
              <Label>
               旅行のタイトル
              </Label>
            </CardHeader>
            <CardContent>
              <Input
                name="tripName"
                required
                placeholder="例: 北海道グルメツアー"
              />
            </CardContent>
          </Card>

          {/*　旅行詳細 */}
          <Card>
            <CardHeader>
              <Label>
                旅行の詳細
              </Label>
            </CardHeader>
            <CardContent>
               <Textarea
                name="tripDetail"
                placeholder="例：北海道のグルメを食べ歩きする旅です"
              />
            </CardContent> 
          </Card>

          {/* 出発日 */}
          <Card>
            <CardHeader>
              <Label>
                出発予定日
              </Label>
            </CardHeader>
            <CardContent>
               <Input
                name="departureDate"
                type="date"
                required
              />
            </CardContent>
          </Card>

          {/* 予算のスライダー */}
          <Card>
            <Label>
                予算の範囲 <span className={`ml-2 text-xl font-mono ${budget >= 100000 ? 'text-primary font-bold' : 'text-primary'}`}>
                             {budget >= 100000 ? "上限なし" : `¥${budget.toLocaleString()}`}
                          </span>
            </Label>
            <CardContent>
              <Slider
              min={0}
              max={100000}
              step={1000}
              value={[budget]}
              onValueChange={ (vals) => setBudget(vals[0])}
              className="w-full"
              style={{
                background: `linear-gradient(to right, 
            #3b82f6 0%, 
            #ef4444 ${progress}%, 
            #e5e7eb ${progress}%, 
            #e5e7eb 100%)`,}}/> 
            </CardContent>
          </Card>
          

          {/* 送信ボタン */}
          <Button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl text--primary-foreground font-bold text-lg shadow-lg transition-all ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 active:transform active:scale-95"
            }`}
          >
            {loading ? "作成中..." : "プロジェクトを作成する"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          作成後、メンバーを招待できるようになります。
        </p>
      </div>
    </div>
  );}