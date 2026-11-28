"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTitle,
} from "@/components/page-heading"

interface AdminLoginProps {
  email: string
  password: string
  totpCode: string
  busy: boolean
  error: string | null
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onTotpChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function AdminLogin({
  email,
  password,
  totpCode,
  busy,
  error,
  onEmailChange,
  onPasswordChange,
  onTotpChange,
  onSubmit,
}: AdminLoginProps) {
  return (
    <div className="mx-auto min-h-[70vh] max-w-3xl border-x border-x-line pt-12">
      <div className="screen-line-bottom px-4 py-3">
        <Link
          href="/stores"
          className="inline-flex min-h-9 touch-manipulation items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" aria-hidden />
          <span>Back to store</span>
        </Link>
      </div>

      <PageHeading>
        <PageHeadingTitle>Store admin</PageHeadingTitle>
        <PageHeadingDescription>
          Sign in with your storefront admin credentials.
        </PageHeadingDescription>
      </PageHeading>

      <section className="screen-line-bottom px-4 py-8">
        {error && (
          <div
            role="alert"
            className="mb-6 max-w-md border border-destructive/40 bg-surface px-4 py-3 text-xs text-destructive"
          >
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="max-w-md space-y-4">
          <label className="flex flex-col gap-1.5 text-xs">
            <span className="font-medium text-foreground">Email</span>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="admin@storefront.local"
              className="h-11 text-base sm:h-10 sm:text-sm"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs">
            <span className="font-medium text-foreground">Password</span>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Enter password"
              className="h-11 text-base sm:h-10 sm:text-sm"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs">
            <span className="font-medium text-foreground">
              Authenticator code (if MFA enabled)
            </span>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={totpCode}
              onChange={(e) => onTotpChange(e.target.value)}
              placeholder="Optional in dev"
              className="h-11 text-base tracking-widest tabular-nums sm:h-10 sm:text-sm"
            />
          </label>

          <Button
            type="submit"
            size="lg"
            disabled={busy}
            className="h-11 w-full transition-transform duration-150 ease-out active:scale-[0.97] sm:h-10 sm:w-auto"
          >
            {busy && <Spinner className="size-3.5" aria-hidden />}
            <span>{busy ? "Signing in..." : "Sign in"}</span>
          </Button>
        </form>
      </section>
    </div>
  )
}
