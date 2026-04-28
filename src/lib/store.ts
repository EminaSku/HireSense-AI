import { create } from "zustand"

interface AppState {
  // UI State
  sidebarOpen: boolean
  theme: "light" | "dark" | "system"
  demoMode: boolean
  
  // Actions
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: "light" | "dark" | "system") => void
  setDemoMode: (enabled: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  theme: "system",
  demoMode: false,
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
  setDemoMode: (enabled) => set({ demoMode: enabled }),
}))
