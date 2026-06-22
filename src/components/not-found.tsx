"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Daikanoid } from "@/components/daikanoid"

export function NotFound() {
  const searchParams = useSearchParams()
  const defaultLogo = searchParams.get("logo") ?? ""

  return (
    <div className="grid min-h-svh place-items-center py-6">
      <section className="max-lg:hidden">
        <Daikanoid defaultLogo={defaultLogo} />
      </section>

      <section className="flex flex-col items-center gap-6 lg:hidden">
        <h1 className="font-mono text-8xl font-medium">404</h1>
        <Button variant="outline" asChild>
          <Link href="/">
            Go to Home
            <ArrowRightIcon />
          </Link>
        </Button>
      </section>
    </div>
  )
}
