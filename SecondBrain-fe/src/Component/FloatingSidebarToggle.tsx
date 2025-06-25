import { PanelLeft, PanelLeftClose } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function FloatingSidebarToggle() {
  const { toggleSidebar, open } = useSidebar()

  return (
    <Button
      onClick={toggleSidebar}
      size="icon"
      variant="outline"
      className="fixed top-4 left-4 z-50 h-10 w-10 rounded-full shadow-lg border-2 bg-background hover:bg-accent transition-all duration-200"
      aria-label={open ? "Close Sidebar" : "Open Sidebar"}
    >
      {open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
    </Button>
  )
}