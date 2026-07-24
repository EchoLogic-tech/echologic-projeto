import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Lock, Cookie, ShieldCheck, Mail } from "lucide-react";
import echoLogicLogo from "@/assets/echologic-logo.png.asset.json";
import { COOKIE_CONSENT_STORAGE_KEY } from "./__root";

export const Route = createFileRoute("/politica-de-privacidade")({
  component: PoliticaDePrivacidadePage,
  head: () => ({
    meta: [
      { title: "Política de Privacidade — EchoLogic" },
      {
        name: "description",
        content:
          "Política de Privacidade do portal EchoLogic: quais dados coletamos, para que usamos, cookies e como você pode exercer seus direitos sob a LGPD.",
      },
      { property: "og:title", content: "Política de Privacidade — EchoLogic" },
      { property: "og:description", content: "Política de Privacidade do portal EchoLogic." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-foreground">{children}</h2>
  );
}

function PoliticaDePrivacidadePage() {
  const [cookiePrefSaved, setCookiePrefSaved] = useState(false);

  function reopenCookieBanner() {
    try {
      window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
    } catch {
      // se não conseguir limpar, ainda assim recarregamos — o banner some
      // sozinho na próxima decisão do usuário
    }
    setCookiePrefSaved(true);
    window.location.reload();
  }

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
            <Lock className="h-5 w-5" style={{ color: "var(--brand-blue)" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl" style={{ color: "var(--brand-navy)" }}>Política de Privacidade</h1>
            <p className="text-xs text-muted-foreground">Em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</p>
          </div>
        </div>

        <article className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            Esta Política de Privacidade explica como o <strong className="text-foreground">EchoLogic</strong> ("nós") coleta, usa,
            armazena e protege os dados pessoais dos visitantes do nosso site ("você"), em conformidade com a Lei Geral de Proteção
            de Dados Pessoais (LGPD — Lei nº 13.709/2018).
          </p>

          <section className="space-y-2">
            <SectionTitle>1. Quem somos (controlador dos dados)</SectionTitle>
            <p>
              O EchoLogic é um portal de curadoria independente que reúne ofertas de produtos de lojas parceiras. Não vendemos
              produtos diretamente, não processamos pagamentos e não realizamos entregas — essas etapas acontecem no site da loja
              parceira, para onde você é redirecionado.
            </p>
            <p className="rounded-lg border border-dashed border-border bg-surface p-3 text-xs">
              <strong className="text-foreground">Nota interna:</strong> inserir aqui razão social, CNPJ e endereço da empresa
              responsável pelo tratamento de dados, conforme exigido pela LGPD para identificação do controlador.
            </p>
          </section>

          <section className="space-y-2">
            <SectionTitle>2. Quais dados coletamos</SectionTitle>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong className="text-foreground">Dados fornecidos por você:</strong> nome, e-mail e mensagem, quando você usa nosso formulário de contato.</li>
              <li><strong className="text-foreground">Dados de navegação:</strong> páginas visitadas, produtos vistos, termos de busca, tipo de dispositivo/navegador e origem do acesso, coletados de forma automática via cookies (veja a seção 5).</li>
              <li>Não coletamos dados sensíveis (saúde, biometria, origem racial, opinião política, etc.) nem dados de crianças e adolescentes de forma intencional.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <SectionTitle>3. Para que usamos seus dados (finalidades e base legal)</SectionTitle>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong className="text-foreground">Responder seu contato</strong> — base legal: execução de procedimento preliminar a seu pedido (art. 7º, V, LGPD).</li>
              <li><strong className="text-foreground">Melhorar o site e entender o comportamento de navegação</strong> (cookies analíticos) — base legal: seu consentimento, coletado através do banner de cookies (art. 7º, I, LGPD).</li>
              <li><strong className="text-foreground">Garantir o funcionamento técnico do site</strong> (cookies essenciais) — base legal: legítimo interesse (art. 7º, IX, LGPD), estritamente necessário e sem impacto relevante à sua privacidade.</li>
              <li><strong className="text-foreground">Cumprir obrigações legais ou regulatórias</strong>, quando aplicável — base legal: art. 7º, II, LGPD.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <SectionTitle>4. Cookies</SectionTitle>
            <p>
              Cookies são pequenos arquivos armazenados no seu navegador. Ao acessar o site pela primeira vez, você vê um banner
              onde pode <strong className="text-foreground">aceitar todos os cookies</strong> ou continuar
              <strong className="text-foreground"> apenas com os essenciais</strong>.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong className="text-foreground">Cookies essenciais</strong> — necessários para o funcionamento básico do site (ex: lembrar sua escolha de cookies). Não podem ser desativados, pois o site depende deles.</li>
              <li><strong className="text-foreground">Cookies analíticos</strong> — usados apenas com seu consentimento, para entender como as páginas são usadas e identificar melhorias. Você pode recusá-los sem prejuízo ao uso do site.</li>
            </ul>
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-4">
              <Cookie className="h-5 w-5 shrink-0" style={{ color: "var(--brand-blue)" }} />
              <div className="flex-1">
                <p className="text-xs text-foreground">Você pode alterar sua decisão sobre cookies analíticos a qualquer momento.</p>
              </div>
              <button
                type="button"
                onClick={reopenCookieBanner}
                className="shrink-0 rounded-full border border-input bg-background px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
              >
                {cookiePrefSaved ? "Recarregando…" : "Alterar minhas preferências de cookies"}
              </button>
            </div>
            <p>
              Você também pode bloquear ou apagar cookies diretamente nas configurações do seu navegador a qualquer momento —
              isso pode afetar algumas funcionalidades do site.
            </p>
          </section>

          <section className="space-y-2">
            <SectionTitle>5. Compartilhamento de dados</SectionTitle>
            <p>
              Não vendemos nem compartilhamos seus dados pessoais com terceiros para fins comerciais. Quando você clica em um
              link de oferta, é redirecionado ao site da loja parceira — a partir desse momento, a coleta e o tratamento de dados
              nesse site passam a ser regidos pela política de privacidade da própria loja, sobre a qual não temos controle.
            </p>
            <p>
              Podemos compartilhar dados com prestadores de serviço estritamente necessários à operação do site (ex: hospedagem,
              ferramentas de e-mail/contato e analytics), sempre limitados ao necessário para a finalidade contratada.
            </p>
          </section>

          <section className="space-y-2">
            <SectionTitle>6. Por quanto tempo guardamos seus dados</SectionTitle>
            <p>
              Mensagens de contato são mantidas pelo tempo necessário para atendê-lo e, depois, pelo prazo mínimo exigido para
              fins de comprovação, segurança e cumprimento de obrigações legais. Dados de navegação/cookies analíticos são
              mantidos por prazo limitado, conforme a ferramenta de analytics utilizada, e você pode revogar o consentimento a
              qualquer momento (seção 4).
            </p>
          </section>

          <section className="space-y-2">
            <SectionTitle>7. Seus direitos como titular de dados</SectionTitle>
            <p>De acordo com o art. 18 da LGPD, você tem direito a:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Confirmar a existência de tratamento dos seus dados;</li>
              <li>Acessar seus dados;</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
              <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a lei;</li>
              <li>Solicitar a portabilidade dos seus dados a outro fornecedor de serviço;</li>
              <li>Solicitar a eliminação dos dados tratados com base no seu consentimento;</li>
              <li>Obter informações sobre com quem compartilhamos seus dados;</li>
              <li>Revogar o consentimento a qualquer momento;</li>
              <li>Se opor a um tratamento realizado com base em outra hipótese legal, em caso de descumprimento da LGPD;</li>
              <li>Peticionar em relação aos seus dados perante a Autoridade Nacional de Proteção de Dados (ANPD).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <SectionTitle>8. Como exercer seus direitos</SectionTitle>
            <p>
              Para exercer qualquer um dos direitos acima, solicitar a exclusão dos seus dados ou tirar dúvidas sobre esta
              política, fale com a gente pela página{" "}
              <Link to="/contato" className="font-medium underline hover:text-foreground">Contato</Link>{" "}
              ou pelo e-mail abaixo. Respondemos solicitações de titulares de dados dentro do prazo legal aplicável.
            </p>
            <p className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-surface p-3 text-xs">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span>
                <strong className="text-foreground">Nota interna:</strong> inserir aqui o e-mail do Encarregado de Proteção de
                Dados (DPO) ou canal dedicado a solicitações de titulares, exigido pela LGPD (art. 41).
              </span>
            </p>
          </section>

          <section className="space-y-2">
            <SectionTitle>9. Segurança dos dados</SectionTitle>
            <p>
              Adotamos medidas técnicas e organizacionais razoáveis para proteger seus dados contra acessos não autorizados,
              perda, alteração ou divulgação indevida. Ainda assim, nenhum sistema é 100% livre de risco — caso identifique
              qualquer incidente de segurança envolvendo seus dados, entre em contato conosco imediatamente.
            </p>
          </section>

          <section className="space-y-2">
            <SectionTitle>10. Alterações desta política</SectionTitle>
            <p>
              Esta política pode ser atualizada periodicamente para refletir mudanças legais, técnicas ou no funcionamento do
              site. Recomendamos revisitar esta página de tempos em tempos. A data da última atualização está sempre indicada
              no final desta página.
            </p>
          </section>

          <section className="space-y-2 rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" style={{ color: "var(--brand-green)" }} />
              <SectionTitle>Resumo rápido</SectionTitle>
            </div>
            <p>
              Coletamos o mínimo necessário, não vendemos seus dados, usamos cookies analíticos só com seu consentimento, e você
              pode acessar, corrigir, portar ou excluir seus dados a qualquer momento entrando em contato conosco.
            </p>
          </section>
        </article>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>Última atualização: {new Date().toLocaleDateString("pt-BR")}.</p>
        </div>
      </main>
    </div>
  );
}
