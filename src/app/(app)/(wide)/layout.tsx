export default function WideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      data-slot="layout-wide"
      className="container mx-auto border-x border-line pt-12"
    >
      {children}
    </div>
  )
}
