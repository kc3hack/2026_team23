"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { Home, UsersRound, Settings, Loader2 } from "lucide-react"
import { useTransition } from "react"

type FloatNavProps = {
  id: string,
  name: string,
}

export default function FloatingNav(Props: FloatNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const navItems = [
    { title: "Group", href: "/groups", icon: UsersRound },
    { title: "Home", href: "/", icon: Home },
    { title: "Settings", href: `/${Props.id}`, icon: Settings },
  ]

  return (
    // z-[9999] で常に最前面＆全画面対応
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] pb-[env(safe-area-inset-bottom)]">

      {/* ベースの箱：緑(primary) + 80%の不透明度 + backdrop-blur ですりガラス感を演出！ */}
      <div className="flex w-fit px-2 py-2 rounded-[2.5rem] bg-primary/80 backdrop-blur-md shadow-xl border border-white/20">
        <div className="flex items-center gap-2">

          {navItems.map((item) => {
            // Homeが常にアクティブになるバグを修正
            const isActive = item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href)

            return (
              <button
                key={item.title}
                title={item.title}
                disabled={isPending}
                onClick={() => {
                  startTransition(() => {
                    router.push(item.href)
                  })
                }}
                className={`
                    flex flex-col items-center justify-center w-20 h-20 rounded-full transition-all duration-300 focus:outline-none
                    ${isActive
                    // 選択時：白色っぽく(bg-white/95) + キメ旅カラーの文字 + 画像のようなへこんだ影
                    ? "bg-white/95 text-primary shadow-[inset_2px_2px_6px_rgba(0,0,0,0.15)] scale-95"
                    // 通常時：透明感のある白文字 + ホバーで少し背景を明るく
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                  }
                  `}
              >
                {isPending ? (<div>
                  {isActive && (
                    <div className="flex justify-center items-center">

                      <Loader2 />
                    </div>
                  )}
                </div>) : (
                  <div className="flex flex-col justify-center items-center">

                    <item.icon className="w-7 h-7 mb-1" />
                    <span className="text-[12px] font-bold tracking-wider">{item.title}</span>
                  </div>)}
              </button>
            )
          })}

        </div>
      </div>
    </div>
  )
}
