import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { sendContactMessage } from "@/lib/contact.functions";
import echoLogicLogo from "@/assets/echologic-logo.png.asset.json";

export const Route = createFileRoute("/contato")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contato · EchoLogic — Fale com nossa curadoria" },
      { name: "description", content: "Envie dúvidas ou sugira ofertas para o time EchoLogic. Respondemos rapidamente pelo nosso canal interno." },
    ],
  }),
});

function ContactPage() {
  const send = useServerFn(sendContactMessage);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  // --- Proteção antispam (client-side) ---
  // Honeypot: campo invisível para humanos, mas que bots costumam preencher.
  const [honeypot, setHoneypot] = useState("");
  // Time-trap: marca quando o formulário foi montado; envios em menos de
  // ~2.5s costumam ser automatizados, não uma pessoa digitando de verdade.
  const mountedAtRef = useRef(Date.now());

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Bot detectado: finge sucesso sem chamar o servidor, para não
    // sinalizar ao script automatizado que foi bloqueado.
    const submittedTooFast = Date.now() - mountedAtRef.current < 2500;
    if (honeypot.trim() !== "" || submittedTooFast) {
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      return;
    }

    setStatus("loading");
    setError(null);
    try {
      await send({ data: form });
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center">
            <img src={echoLogicLogo.url} alt="EchoLogic" className="h-10 w-auto object-contain select-none" draggable={false} />
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
        </div>
      </header>


      <section className="relative overflow-hidden border-b border-border" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-4xl px-4 py-14 md:py-20">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{ background: "color-mix(in oklab, var(--brand-green) 12%, transparent)", color: "var(--brand-green)" }}
          >
            <MessageSquare className="h-3.5 w-3.5" /> Fale com a EchoLogic
          </span>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-5xl" style={{ color: "var(--brand-navy)" }}>
            Dúvidas, sugestões ou uma oferta imperdível?
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
            Sua mensagem chega direto no nosso canal interno de curadoria. Respondemos em até 24h úteis.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12">
        {status === "success" ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
            <CheckCircle2 className="mx-auto h-12 w-12" style={{ color: "var(--brand-green)" }} />
            <h2 className="mt-4 text-2xl font-black" style={{ color: "var(--brand-navy)" }}>Mensagem enviada!</h2>
            <p className="mt-2 text-muted-foreground">Obrigado pelo contato — nossa equipe já foi notificada.</p>
            <button onClick={() => setStatus("idle")} className="btn-price mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm">
              Enviar outra mensagem
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8">
            {/* Honeypot anti-spam: invisível e inacessível para humanos (aria-hidden,
                fora da ordem de tab, fora da viewport). Bots que preenchem todos os
                campos de um form tendem a cair nessa armadilha. */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
              <label htmlFor="empresa">Empresa</label>
              <input
                type="text"
                id="empresa"
                name="empresa"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Seu nome" required>
                <input
                  required maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-base"
                  placeholder="Ex: Maria Silva"
                />
              </Field>
              <Field label="E-mail" required>
                <input
                  required type="email" maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-base"
                  placeholder="voce@email.com"
                />
              </Field>
            </div>
            <Field label="Assunto" required>
              <input
                required maxLength={150}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="input-base"
                placeholder="Dúvida sobre um produto, sugestão de oferta..."
              />
            </Field>
            <Field label="Mensagem" required>
              <textarea
                required minLength={5} maxLength={2000} rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input-base resize-y"
                placeholder="Conte pra gente como podemos ajudar..."
              />
            </Field>

            {status === "error" && (
              <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5" /> Nunca compartilhamos seu e-mail.
              </p>
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-price inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {status === "loading" ? "Enviando..." : "Enviar mensagem"}
              </button>
            </div>
          </form>
        )}
      </section>

      <style>{`
        .input-base {
          width: 100%;
          height: 2.75rem;
          border-radius: 0.75rem;
          border: 1px solid var(--color-border);
          background: var(--color-input);
          padding: 0 0.875rem;
          font-size: 0.9rem;
          color: var(--color-foreground);
          outline: none;
          transition: all .15s ease;
        }
        textarea.input-base { height: auto; padding: 0.75rem 0.875rem; line-height: 1.5; }
        .input-base:focus {
          border-color: var(--brand-green);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--brand-green) 25%, transparent);
        }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--brand-navy)" }}>
        {label}{required && <span style={{ color: "var(--brand-green)" }}> *</span>}
      </span>
      {children}
    </label>
  );
}
