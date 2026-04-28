"use client"

import { useSession as useNextAuthSession } from "next-auth/react"

export function useSession() {
  const { data: session, status, update } = useNextAuthSession()
  
  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
    update,
  }
}
