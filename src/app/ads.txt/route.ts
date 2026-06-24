export const revalidate = false
export const dynamic = "force-static"

export async function GET() {
  if (!process.env.ADS_TXT) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain;charset=utf-8" },
    })
  }

  return new Response(process.env.ADS_TXT, {
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
  })
}
