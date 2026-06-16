import { NotFound as PageNotFound } from "@/components/not-found"

import "@/components/daikanoid/daikanoid.css"

export const metadata = {
  title: "Page Not Found",
}

export default function NotFound() {
  return <PageNotFound />
}
