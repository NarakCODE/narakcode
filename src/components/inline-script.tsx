export function InlineScript({ html }: { html: string }) {
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
