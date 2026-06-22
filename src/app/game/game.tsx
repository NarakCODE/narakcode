"use client"

import { useSearchParams } from "next/navigation"

import { Daikanoid } from "@/components/daikanoid"

export function Game() {
  const searchParams = useSearchParams()
  const defaultLogo = searchParams.get("logo")

  return <Daikanoid defaultLogo={defaultLogo ?? undefined} />
}
