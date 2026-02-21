"use client";

import { createProject } from "../../../actions/project"; // 作成したアクションをインポート
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { BackpreviousButton } from "@/components/backprevious-button";

import { addDays, format, addMonths } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { MemberList } from "@/components/group/MemberList";
import { getGroupMemberIds } from "@/actions/members";
import { Prisma } from "@prisma/client";
type MemberWithUser = Prisma.GroupMemberGetPayload<{
  include: { user: true }
}>;

export default function CreateProjectForm({ groupId, members }: { groupId: string, members: MemberWithUser[] }) {
  const [loading, setLoading] = useState(false);

  const minDate = addMonths(new Date(), 3);
  const [date, setDate] = useState<DateRange | undefined>({
    from: minDate,
    to: addDays(minDate, 7)//初期値は三ヶ月後から7日間
  })

  const [budget, setBudget] = useState(50000);//予算管理用のuseStateを設定
  const Maxbudget = 100000;

  //予算のInputが変更されたときの処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")//数字以外を除去
    const numValue = value === "" ? 0 : Number(value)
    //予算の入力最大値を制御
    if (numValue <= Maxbudget) {
      setBudget(numValue)
    }
  }

  //０～１００パーセントの割合を計算
  const progress = (budget / Maxbudget) * 100;

  const [memberIds, setMemberIds] = useState<string[]>([]); // 取得したIDを保存する場所
  const handleFetchMembers = async () => {
    // ※ここで groupId を定義するか、引数で受け取る必要があります
    const groupId = "テスト用のID";
    try {
      const ids = await getGroupMemberIds(groupId);
      setMemberIds(ids);
    } catch (error) {
      console.error(error);
    }
  }


  const handleSubmit = async () => {
    // ボタンの連打防止
    setLoading(true);
  };

  return (
    <div className="max-w mx-auto mt-10 relative">
      <BackpreviousButton href="/" />
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
                className="h-[120px]" />
            </div>

            {/* 日程変更 */}
            <div className="col-span-12 md:col-span-4 px-6 py-2 space-y-2">
              <Label>
                旅行日程の選択
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer border border-border rounded-lg bg-muted hover:border-gray-700 transition-colors">
                    <input readOnly
                      value={date?.from ?
                        date.to ?
                          `${format(date.from!, "yyyy/MM/dd")}-${format(date.to!, "yyyy/MM/dd")}`
                          : format(date.from!, "yyyy/MM/dd")
                        : ""}
                      className={cn("w-full text-xl h-14 pl-12 cursor-pointer focus-visible:ring-0",
                        !date && "text-muted-foreground")}
                      placeholder="日程を選択してください" />
                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0"
                  align="start">
                  <Calendar mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    disabled={{ before: minDate }} />
                </PopoverContent>
              </Popover>
              <input type="hidden"
                name="departureDate"
                value={date?.from?.toISOString() || ""} />
              <input type="hidden"
                name="returnDate"
                value={date?.to?.toISOString() || ""} />
            </div>
          </div>


          {/* 予算のスライダー */}
          <CardHeader>
            <Label htmlFor="budget-input">  予算の目安  </Label>
            <Input id="budget-input"
              type="text"
              //表示のロジック：最大値以上なら「上限なし」そうでないならカンマ区切り
              value={budget >= Maxbudget ? "上限なし" : `¥${budget.toLocaleString()}`}

              //入力時
              onChange={handleInputChange}

              //クリックしたときは上限なしから数字に変更して表示
              onFocus={(e) => {
                if (budget >= Maxbudget) {
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
              onValueChange={(vals) => setBudget(vals[0])}
              className="w-full"
            />
          </CardContent>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-4 space-y-4">
              {/* 左側の概要カード（省略） */}
            </div>

            {/* 右側カラム: メンバー一覧 */}
            <div className="col-span-12 lg:col-span-8">
              {/* ★ ここがたった1行になります！ */}
              <MemberList members={members} />
            </div>
          </div>

          {/* 送信ボタン */}
          <CardContent> 
            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl text-primary-foreground font-bold text-lg shadow-lg transition-all ${loading
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
  )
}