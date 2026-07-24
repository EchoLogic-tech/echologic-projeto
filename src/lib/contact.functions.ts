import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  subject: z.string().trim().min(1).max(150),
  message: z.string().trim().min(5, "Mensagem muito curta").max(2000),
});

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const SLACK_API_KEY = process.env.SLACK_API_KEY;
    if (!LOVABLE_API_KEY || !SLACK_API_KEY) {
      throw new Error("Integração com Slack não configurada.");
    }

    const channel = process.env.SLACK_CONTACT_CHANNEL || "#novo-canal";

    const text = [
      `:incoming_envelope: *Novo contato EchoLogic*`,
      `*Nome:* ${data.name}`,
      `*E-mail:* ${data.email}`,
      `*Assunto:* ${data.subject}`,
      `*Mensagem:*\n${data.message}`,
    ].join("\n");

    const res = await fetch(
      "https://connector-gateway.lovable.dev/slack/api/chat.postMessage",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": SLACK_API_KEY,
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          channel,
          text,
          username: "EchoLogic Contato",
          icon_emoji: ":sparkles:",
        }),
      },
    );

    const body = await res.text();
    let parsed: { ok?: boolean; error?: string } = {};
    try { parsed = JSON.parse(body); } catch {}
    if (!res.ok || !parsed.ok) {
      console.error("Slack error:", res.status, body);
      throw new Error(parsed.error || "Falha ao enviar mensagem para o Slack.");
    }
    return { ok: true as const };
  });
