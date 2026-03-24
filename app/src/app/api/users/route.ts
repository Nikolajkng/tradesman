// app/api/<resource>/route.ts

export async function GET(request: Request) {
  return Response.json({ data: "GET response" })
}

export async function POST(request: Request) {
  const body = await request.json()

  return Response.json({
    received: body
  })
}

export async function PUT(request: Request) {
  return Response.json({ message: "Updated" })
}

export async function DELETE(request: Request) {
  return Response.json({ message: "Deleted" })
}