import { NextResponse } from "next/server";

export async function GET() {
  const gpt2Url = process.env.GPT2_URL;
  if (!gpt2Url) {
    return NextResponse.json(
      {
        service: "gpt-2-proxy",
        status: "binding_pending",
        message: "GPT2_URL service binding is not active or running in standalone mode."
      },
      { status: 200 }
    );
  }

  try {
    const res = await fetch(new URL("/", gpt2Url), {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Service connection error";
    return NextResponse.json({ error: message, target: gpt2Url }, { status: 502 });
  }
}

export async function POST(req: Request) {
  const gpt2Url = process.env.GPT2_URL;
  if (!gpt2Url) {
    return NextResponse.json(
      {
        error: "GPT2_URL internal service binding is not configured",
        help: "Deploy through Vercel Multi-Services or define GPT2_URL in development"
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const res = await fetch(new URL("/generate", gpt2Url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream gpt-2 service responded with ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to call gpt-2 service";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
