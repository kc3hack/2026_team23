"use client";

import { createProject } from "../../../actions/project"; // 作成したアクションをインポート
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { BackpreviousButton } from "@/components/backprevious-button";

import {addDays, format} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


export default function CreateProjectForm() {
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState< DateRange | undefined>({
    from: new Date(), 
    to: addDays(new Date(),7)//初期値は今日から7日間料
  })

  const [budget, setBudget] = useState(50000);//予算管理用のuseStateを設定
  const Maxbudget = 100000;
 
  //予算のInputが変更されたときの処理
  const handleInputChange =(e: React.ChangeEvent<HTMLInputElement>) =>{
    const value = e.target.value.replace(/[^0-9]/g,"")//数字以外を除去
    const numValue = value === "" ? 0 : Number(value)
     //予算の入力最大値を制御
    if(numValue <= Maxbudget){
    setBudget(numValue)
  }
  }

  //０～１００パーセントの割合を計算
  const progress =(budget/Maxbudget)*100;

  const handleSubmit = async () => {
    // ボタンの連打防止
    setLoading(true);
  };

  return (
    <div className="max-w mx-auto mt-10 relative">
      <BackpreviousButton href="/"/>
      <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 mb-6 text-center">
              新しい旅行を計画する ✈️
            </CardTitle>
          </CardHeader>
          <form action={createProject} onSubmit={handleSubmit} className="space-y-6">
          {/* 旅行タイトル */}
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

       
          {/*　旅行詳細 */}
        <div className="grid grid-cols-12 gap-4 px-6 py-2">
            <div className="col-span-12 md:col-span-8 space-y-2">
            <Label>
              旅行の詳細
            </Label>
            <Textarea
              name="tripDetail"
              placeholder="例：北海道のグルメを食べ歩きする旅です"
              className="h-[120px]"
            />
          </div>
            
          {/* 日程変更 */}
          <div className= "col-span-12 md:col-span-4 px-6 py-2 space-y-2">
            <Label>
              出発予定日
            </Label>
            <Input
             name="departureDate"
             type="date"
             required
            />
          </div>
        </div>
        
          
          {/* 予算のスライダー */}
            <CardHeader>
              <Label htmlFor="budget-input">  予算の目安　 </Label>
              <Input id="budget-input"
                     type="text"
                     //表示のロジック：最大値以上なら「上限なし」そうでないならカンマ区切り
                     value={budget >= Maxbudget ? "上限なし" : `¥${budget.toLocaleString()}`}

                     //入力時
                     onChange={handleInputChange}

                     //クリックしたときは上限なしから数字に変更して表示
                     onFocus = {(e) =>{
                      if(budget >= Maxbudget){
                        //文字列ではく「100000」と表示させる
                        e.currentTarget.value = Maxbudget.toString();
                      }
                     }
                    }
                    className="w-fit font-mono text-xl text-primary" />
            </CardHeader>
            <CardContent>
              <Slider
              min={0}
              max={100000}
              step={1000}
              value={[budget]}
              onValueChange={ (vals) => setBudget(vals[0])}
              className="w-full"
              /> 
            </CardContent>
          

          {/* 送信ボタン */}
          <CardContent>
            <Button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl text-primary-foreground font-bold text-lg shadow-lg transition-all ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-primary hover:shadow-md active:transform active:scale-95"
            }`}
          >
            {loading ? "作成中..." : "プロジェクトを作成する"}
          </Button>
          </CardContent>
          
        </form>
        </Card>
        <p className="mt-4 text-center text-sm text-gray-500">
          作成後、メンバーを招待できるようになります。
        </p>
    </div>
  );}