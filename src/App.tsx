import { useState } from "react"
import { Topbar, Sidebar } from "./components"
import { Dashboard } from "./pages/Dashboard"
import { Systems } from "./pages/Systems"
import { Credits } from "./pages/Credits"
import { Locations } from "./pages/Locations"
import { Support } from "./pages/Support"
import { Extracurricular } from "./pages/Extracurricular"
import { Wiki } from "./pages/Wiki"
import { Schedule } from "./pages/Schedule"
import type { Page } from "./types"

export default function App() {
  const [page, setPage] = useState<Page>("dashboard")
  const [search, setSearch] = useState("")

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard setPage={setPage} />
      case "systems":
        return <Systems />
      case "credits":
        return <Credits />
      case "locations":
        return <Locations />
      case "support":
        return <Support />
      case "extracurricular":
        return <Extracurricular />
      case "wiki":
        return <Wiki />
      case "schedule":
        return <Schedule />
      default:
        return <Dashboard setPage={setPage} />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Topbar search={search} setSearch={setSearch} setPage={setPage} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar active={page} onNavigate={setPage} />
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
