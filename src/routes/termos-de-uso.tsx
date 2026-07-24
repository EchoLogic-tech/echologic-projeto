import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Link2 } from "lucide-react";
import echoLogicLogo from "@/assets/echologic-logo.png.asset.json";

export const Route = createFileRoute("/termos-de-uso")({
  component: TermosDeUsoPage,
  head: () => ({
    meta: [
      { title: "Termos de Uso — EchoLogic" },
      {
        name: "description",
        content:
          "Termos de uso do portal EchoLogic, incluindo a divulgação de que o site utiliza links de afiliados e pode receber comissão por compras realizadas nas lojas parceiras.",
      },
      { property: "og:title", content: "Termos de Uso — EchoLogic" },
      { property: "og:description", content: "Termos de uso do portal EchoLogic." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center">
            <img src={echoLogicLogo.url} alt="EchoLogic" className="h-9 w-auto object-contain select-none" draggable={false} />
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full" style={{ background: "color-mix(in oklab, var(--brand-blue) 12%, transparent)" }}>
            <ShieldCheck className="h-5 w-5" style={{ color: "var(--brand-blue)" }} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl" style={{ color: "var(--brand-navy)" }}>Termos de Uso</h1>
        </div>

        <article className="space-y-5 text-sm leading-relaxed text-muted-foreground">
          <p>Bem-vindo ao <strong className="text-foreground">EchoLogic</strong>. Ao utilizar este site, você concorda com os termos abaixo.</p>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">1. Sobre o portal</h2>
            <p>O EchoLogic é um portal de curadoria independente que reúne ofertas e produtos de lojas parceiras. Não vendemos, não processamos pagamentos e não realizamos entregas.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">2. Informações exibidas</h2>
            <p>Preços, imagens e descrições dependem dos dados públicos das lojas e podem sofrer alterações a qualquer momento. Confirme sempre no site do vendedor antes de finalizar a compra.</p>
          </section>

          <section className="space-y-3 rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4" style={{ color: "var(--brand-green)" }} />
              <h2 className="text-base font-semibold text-foreground">3. Links de afiliados e monetização</h2>
            </div>
            <p>
              O EchoLogic participa de <strong className="text-foreground">programas de afiliados</strong> das lojas e
              plataformas parceiras exibidas no site. Isso significa que, quando você clica em um botão como{" "}
              <strong className="text-foreground">"Ver Menor Preço"</strong> ou <strong className="text-foreground">"Ir para
              Oferta"</strong> e realiza uma compra na loja de destino, o EchoLogic{" "}
              <strong className="text-foreground">pode receber uma comissão</strong> paga pela loja ou plataforma parceira.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Essa comissão é paga pela loja parceira e <strong className="text-foreground">não representa nenhum custo adicional para você</strong> — o preço que você paga é o mesmo que pagaria acessando a loja diretamente.</li>
              <li>Todos os links marcados com os botões de oferta neste site são <strong className="text-foreground">links de afiliado</strong>, identificados tecnicamente pelo atributo <code className="rounded bg-background px-1 py-0.5 text-[11px]">rel="sponsored"</code> conforme recomendação do Google para transparência com buscadores.</li>
              <li>A curadoria e a seleção de produtos exibidos buscam refletir <strong className="text-foreground">qualidade e custo-benefício reais</strong>; ainda assim, a existência de comissão é um interesse comercial do EchoLogic que você deve considerar ao avaliar nossas recomendações.</li>
              <li>Não temos controle sobre estoque, prazos de entrega, política de trocas ou atendimento pós-venda das lojas parceiras — essas responsabilidades são inteiramente da loja onde a compra é finalizada.</li>
            </ul>
            <p>
              Esta divulgação é feita em conformidade com o dever de informação e transparência previsto no{" "}
              <strong className="text-foreground">Código de Defesa do Consumidor</strong> (Lei nº 8.078/1990) para relações de
              consumo mediadas pela internet.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">4. Uso adequado</h2>
            <p>O usuário se compromete a utilizar o site de forma lícita, respeitando a legislação brasileira e os direitos de terceiros.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">5. Alterações</h2>
            <p>Estes termos podem ser atualizados a qualquer momento. Em caso de dúvidas, fale conosco pela página <Link to="/contato" className="font-medium underline hover:text-foreground">Contato</Link>.</p>
          </section>
        </article>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>Última atualização: {new Date().toLocaleDateString("pt-BR")}.</p>
        </div>
      </main>
    </div>
    )
}