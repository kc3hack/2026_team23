"use client"
import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { searchUsersAction, createGroupAction } from "@/actions/group"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, X, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type User = {
  id: string,
  name: string | null,
  email: string | null,
  image: string | null,
}


export default function Page() {
  //フォームの状態管理
  const [groupName, setGroupName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [groupDescription, setGroupDescription] = useState("")
  //ローディング状態
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true)
        const results = await searchUsersAction(searchQuery)
        setSearchResults(results)
        setIsSearching(false)
      } else {
        setSearchResults([])
      }
    }, 300) //300ms待機

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const handleAddUser = (user: User) => {
    //重複を確認
    if (!selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user])
    }

    setSearchQuery("")
    setSearchResults([])
  }

  //タグを消去
  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId))
  }

  //フォーム送信ボタン(グループ作成ボタン)
  const handleSubmit = async () => {
    if (!groupName.trim()) {
      alert("グループ名を入力してください")
      return
    }

    setIsSubmitting(true)
    //選択されたユーザーの配列を作る
    const membersId = selectedUsers.map((u) => u.id)
    //サーバーアクションを起動
    const result = await createGroupAction(groupName, groupDescription, membersId)

    if (result?.error) {
      alert(result?.error)
      setIsSubmitting(false)
      redirect("/groups")
    }
    setIsSubmitting(false)
    redirect("/groups")
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <div className="space-y-4">      <Button variant="ghost" asChild className="-ml-4 text-muted-foreground">
        <Link href="/groups">
          <ArrowLeft className="mr-2 h-4 w-4" />
          グループ一覧へ戻る
        </Link>
      </Button>
      </div>

      <div className="col-span-12 gap-6">
        <div className="col-span-12 lg:col-span-8 lg:col-start-3">
          <Card className="h-auto">
            <CardHeader>
              <CardTitle className="text-2xl">新しいグループを作成</CardTitle>
              <CardDescription>グループ名と招待したい友達のメールアドレスを入力してください</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">グループ名</label>
                <Input
                  placeholder="例:大学のサークル,冬の卒業旅行"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">グループの説明</label>
                <Input
                  placeholder="例:いつも一緒に遊ぶ友達"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)} />
              </div>

              <div className="space-y-2 relative">
                <label className="text-sm font-medium">友達を追加(メールアドレス)</label>
                <div className="relative">
                  <Input
                    placeholder="メールアドレスを入力して検索"
                    className=""
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                {/*検索結果のドロップダウン*/}
                {searchQuery.trim() !== "" && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg overflow-hidden">
                    {isSearching ? (
                      <div className="p-4 flex items-center justify-center text-sm text-muted-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />検索中...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <ul className="max-h-60 overflow-y-auto">
                        {searchResults.map((user) => (
                          <li key={user.id}
                            className="flex items-center px-4 py-3 hover:bg-muted cursor-pointer transition-colors"
                            onClick={() => handleAddUser(user)}>

                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarImage src={user.image || ""} />
                              <AvatarFallback>{user.name?.slice(0, 1) || "?"}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{user.name || "名称未設定"}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        見つかりませんでした
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="h-50" />
              {selectedUsers.length > 0 && (
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground">追加するメンバー:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                      <Badge key={user.id} variant="secondary" className="px-3 py-1.5 text-sm font-normal flex items-center gap-1">
                        <Avatar className="h-4 w-4 mr-1">
                          <AvatarImage src={user.image || ""} />
                          <AvatarFallback className="text-[10px]">{user.name?.slice(0, 1) || "?"}</AvatarFallback>
                        </Avatar>
                        {user.name || user.email}
                        <button
                          onClick={() => handleRemoveUser(user.id)}
                          className="ml-1 hover:bg-muted rounded-full p-0.5 transition-colors focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {/* 4. 作成ボタン */}
              <div className="pt-4">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !groupName.trim()}
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 作成中...</>
                  ) : (
                    "作成！"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
