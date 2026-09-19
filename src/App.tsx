import { useState } from "react"
import { Topbar } from "./components"
import { Systems } from "./pages/Systems"
import { Locations } from "./pages/Locations"
import { Wiki } from "./pages/Wiki"
import { Schedule } from "./pages/Schedule"
import type { Page } from "./types"

export default function App() {
  const [page, setPage] = useState<Page>("systems")

  const renderPage = () => {
    switch (page) {
      case "locations":
        return <Locations />
      case "wiki":
        return <Wiki />
      case "schedule":
        return <Schedule />
      case "systems":
      default:
        return <Systems />
    }
  }

  return (
    <div className="flex flex-col h-dvh overflow-x-hidden bg-slate-50">
      <Topbar active={page} onNavigate={setPage} />
      <main className="min-h-0 flex-1 overflow-auto overflow-x-hidden">
        {renderPage()}
      </main>
    </div>
  )
}
