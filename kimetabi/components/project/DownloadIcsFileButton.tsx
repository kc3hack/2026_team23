// components/project/IcsDownloadButton.tsx
'use client'

import { Button } from "@/components/ui/button"

interface ProjectProps {
  title: string
  description: string
  departureDate: Date
  endDate: Date
}

export default function IcsDownloadButton({ project }: { project: ProjectProps }) {
  const downloadIcs = () => {
    // 日付をICSフォーマット(YYYYMMDDTHHmmssZ)に変換
    const formatDate = (date: Date) => {
      const d = new Date(date)
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${project.title}
DESCRIPTION:${project.description}
DTSTART:${formatDate(project.departureDate)}
DTEND:${formatDate(project.endDate)}
END:VEVENT
END:VCALENDAR`

    // Blobを作成してダウンロードリンクを強制クリック
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${project.title}_予定.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button onClick={downloadIcs} className="mt-4">
      📅 カレンダーに追加する (ICS)
    </Button>
  )
}
