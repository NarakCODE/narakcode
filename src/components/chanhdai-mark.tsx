export function ChanhDaiMark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 827 418"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="309" width="103" height="412" fill="currentColor" />
      <rect x="515" y="106" width="103" height="206" fill="currentColor" />
      <rect x="618" width="206" height="106" fill="currentColor" />
      <rect x="618" y="312" width="209" height="100" fill="currentColor" />
      <rect x="103" y="106" width="103" height="103" fill="currentColor" />
      <rect x="206" y="209" width="103" height="103" fill="currentColor" />
      <rect width="103" height="412" fill="currentColor" />
    </svg>
  )
}

export function getMarkSVG(color = "currentColor") {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 827 418"><rect x="309" width="103" height="412" fill="${color}"/><rect x="515" y="106" width="103" height="206" fill="${color}"/><rect x="618" width="206" height="106" fill="${color}"/><rect x="618" y="312" width="209" height="100" fill="${color}"/><rect x="103" y="106" width="103" height="103" fill="${color}"/><rect x="206" y="209" width="103" height="103" fill="${color}"/><rect width="103" height="412" fill="${color}"/></svg>`
}
