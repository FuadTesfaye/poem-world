import { NextResponse } from "next/server";

export async function GET() {
  const albertUrl = process.env.ALBERT_URL;
  if (!albertUrl) {
    return NextResponse.json(
      {
        service: "albert-proxy",
        status: "binding_pending",
        message: "ALBERT_URL service binding is not active or running in standalone mode."
      },
      { status: 200 }
    );
  }

  try {
    const res = await fetch(new URL("/", albertUrl), {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Service connection error";
    return NextResponse.json({ error: message, target: albertUrl }, { status: 502 });
  }
}

export async function POST(req: Request) {
  const albertUrl = process.env.ALBERT_URL;
  if (!albertUrl) {
    return NextResponse.json(
      {
        error: "ALBERT_URL internal service binding is not configured",
        help: "Deploy through Vercel Multi-Services or define ALBERT_URL in development"
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const res = await fetch(new URL("/classify", albertUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream albert service responded with ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to call albert service";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
