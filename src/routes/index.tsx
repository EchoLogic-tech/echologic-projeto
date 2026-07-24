import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { sendContactMessage } from "@/lib/contact.functions";
import { getProducts, type ProductDTO } from "@/lib/products.functions";
import {
  Search,
  ShoppingBag,
  Star,
  Sparkles,
  Menu,
  X,
  TrendingUp,
  ShieldCheck,
  Heart,
  Mail,
  MessageSquare,
  Tag,
  ImageOff,
  ArrowUpDown,
  Eye,
} from "lucide-react";
import echoLogicLogo from "@/assets/echologic-logo.png.asset.json";

const searchSchema = z.object({
  search: fallback(z.string(), "").default(""),
  category: fallback(z.string(), "all").default("all"),
  sort: fallback(z.string(), "relevance").default("relevance"),
});

const productsQueryOptions = (fetcher: () => Promise<ProductDTO[]>) =>
  queryOptions({ queryKey: ["products", "real-cols-v4"], queryFn: fetcher, staleTime: 0, gcTime: 0 });

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: zodValidator(searchSchema),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions(() => getProducts())),
  pendingMs: 0,
  pendingComponent: ProductsSkeleton,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl p-10 text-center text-sm text-muted-foreground">
      Não foi possível carregar as ofertas: {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">Página não encontrada.</div>,
  head: ({ loaderData }) => {
    const products = (loaderData as ProductDTO[] | undefined) ?? [];
    // Limita o ItemList a uma amostra razoável para não inflar o HTML —
    // o objetivo é sinalizar aos buscadores que é uma página de catálogo,
    // não listar cada item do site inteiro.
    const sample = products.slice(0, 24);
    return {
      meta: [
        { title: "EchoLogic — Curadoria inteligente das melhores ofertas" },
        {
          name: "description",
          content:
            "Portal de curadoria EchoLogic: utensílios inteligentes, tecnologia portátil, linha pet e produtos sazonais no menor preço das grandes plataformas.",
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "EchoLogic",
            url: "https://echologic.com.br",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://echologic.com.br/?search={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        },
        ...(sample.length > 0
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "ItemList",
                  itemListElement: sample.map((p, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    url: `https://echologic.com.br/produto/${p.id}`,
                    name: p.name,
                  })),
                }),
              },
            ]
          : []),
      ],
    };
  },
});

function SkeletonShimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded bg-muted ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <article className="card-product flex flex-col overflow-hidden rounded-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <SkeletonShimmer className="absolute inset-0 h-full w-full rounded-none" />
        <div className="absolute left-2 top-2 h-5 w-16 rounded-md bg-muted/80" />
        <div className="absolute right-2 top-2 h-5 w-12 rounded-md bg-muted/80" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <SkeletonShimmer className="h-3.5 w-11/12" />
        <SkeletonShimmer className="h-3.5 w-2/3" />
        <div className="mt-1 flex items-center gap-1">
          <SkeletonShimmer className="h-3 w-3 rounded-full" />
          <SkeletonShimmer className="h-3 w-8" />
          <SkeletonShimmer className="h-3 w-10" />
        </div>
        <div className="mt-auto space-y-2">
          <SkeletonShimmer className="h-3 w-16" />
          <SkeletonShimmer className="h-7 w-24" />
          <SkeletonShimmer className="h-9 w-full rounded-lg" />
          <SkeletonShimmer className="h-8 w-full rounded-lg" />
        </div>
      </div>
    </article>
  );
}

function ProductsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
            <SkeletonShimmer className="h-10 w-32" />
            <SkeletonShimmer className="h-10 w-full rounded-full" />
            <SkeletonShimmer className="h-10 w-28" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonShimmer key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </header>

      {/* Hero skeleton */}
      <section className="border-b border-border" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
          <SkeletonShimmer className="h-5 w-40 rounded-full" />
          <SkeletonShimmer className="mt-3 h-10 w-3/4 max-w-xl rounded-lg md:h-14" />
          <SkeletonShimmer className="mt-3 h-4 w-2/3 max-w-lg rounded-lg" />
          <div className="mt-5 flex gap-3">
            <SkeletonShimmer className="h-10 w-36 rounded-full" />
            <SkeletonShimmer className="h-10 w-48 rounded-full" />
          </div>
        </div>
      </section>

      {/* Products grid skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        <div className="mb-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <SkeletonShimmer className="h-7 w-48 rounded-lg" />
              <SkeletonShimmer className="mt-2 h-3 w-32 rounded-lg" />
            </div>
            <SkeletonShimmer className="h-9 w-40 rounded-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonShimmer key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

type Category = string; // "all" or a category name from the sheet

const PAGE_SIZE = 20;

const formatPrice = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatCompact = (n: number) => {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(".0", "")}k+`;
  return n.toLocaleString("pt-BR");
};


const resolveImage = (p: ProductDTO): string | null =>
  p.image_url && p.image_url.length > 0 ? p.image_url : null;

function ProductImagePlaceholder({ category, name }: { category?: string; name: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface p-4 text-center">
      <div
        className="grid h-12 w-12 place-items-center rounded-full"
        style={{ background: "color-mix(in oklab, var(--brand-green) 12%, transparent)" }}
      >
        <ImageOff className="h-5 w-5" style={{ color: "var(--brand-green)" }} />
      </div>
      <span className="text-[10px] font-medium leading-tight text-muted-foreground line-clamp-2">{name}</span>
      {category && (
        <span
          className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
          style={{
            background: "color-mix(in oklab, var(--brand-navy) 10%, transparent)",
            color: "var(--brand-navy)",
          }}
        >
          {category}
        </span>
      )}
    </div>
  );
}

function BrandLogo({ className = "h-10" }: { className?: string }) {
  return (
    <img
      src={echoLogicLogo.url}
      alt="EchoLogic"
      className={`${className} w-auto object-contain select-none`}
      draggable={false}
    />
  );
}

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (!text || terms.length === 0) return <>{text}</>;
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  // Split with normalized matching but preserve original characters.
  const normalized = normalize(text);
  const parts: Array<{ str: string; hit: boolean }> = [];
  let i = 0;
  while (i < text.length) {
    let matched = false;
    for (const t of terms) {
      if (normalized.startsWith(t, i)) {
        parts.push({ str: text.slice(i, i + t.length), hit: true });
        i += t.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // append single char to a running non-hit segment
      const last = parts[parts.length - 1];
      if (last && !last.hit) last.str += text[i];
      else parts.push({ str: text[i], hit: false });
      i++;
    }
  }
  void pattern;
  return (
    <>
      {parts.map((p, idx) =>
        p.hit ? (
          <mark
            key={idx}
            className="rounded px-0.5 font-bold"
            style={{
              background: "color-mix(in oklab, var(--brand-green) 22%, transparent)",
              color: "var(--brand-navy)",
            }}
          >
            {p.str}
          </mark>
        ) : (
          <span key={idx}>{p.str}</span>
        ),
      )}
    </>
  );
}

function Index() {
  const { search: urlSearch, category: urlCategory, sort: urlSort } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const active = urlCategory;
  const sort = urlSort;

  const setActive = (c: string) =>
    navigate({ search: (prev: z.infer<typeof searchSchema>) => ({ ...prev, category: c }), replace: true });
  const setQuery = (q: string) =>
    navigate({ search: (prev: z.infer<typeof searchSchema>) => ({ ...prev, search: q }), replace: true });
  const setSort = (s: string) =>
    navigate({ search: (prev: z.infer<typeof searchSchema>) => ({ ...prev, sort: s }), replace: true });

  // Estado local do campo de busca: atualiza a UI instantaneamente a cada
  // tecla, mas só propaga para a URL (via setQuery/navigate) depois de um
  // pequeno intervalo sem digitação — evita disparar navigate/replace a
  // cada caractere.
  const [queryInput, setQueryInput] = useState(urlSearch);

  // Mantém o campo sincronizado se a URL mudar por outro caminho
  // (ex: botão "Limpar busca", navegação, voltar/avançar do navegador).
  useEffect(() => {
    setQueryInput(urlSearch);
  }, [urlSearch]);

  // Debounce: só grava na URL 300ms após o usuário parar de digitar.
  useEffect(() => {
    if (queryInput === urlSearch) return;
    const timeoutId = window.setTimeout(() => {
      setQuery(queryInput);
    }, 300);
    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryInput]);

  const clearQuery = () => {
    setQueryInput("");
    setQuery("");
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const fetchProducts = useServerFn(getProducts);
  const { data: products } = useSuspenseQuery(productsQueryOptions(fetchProducts));

  // Agrupa categorias por chave normalizada (case/acento-insensitive) para
  // evitar chips duplicados quando o banco tem variações como "utensilios" e
  // "Utensílios Inteligentes".
  const categoriesList = useMemo(() => {
    const map = new Map<string, { label: string; count: number }>();
    products.forEach((p) => {
      const key = normalize(p.category);
      const cur = map.get(key);
      if (cur) cur.count += 1;
      else map.set(key, { label: p.category, count: 1 });
    });
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
  }, [products]);

  const activeKey = useMemo(() => (active === "all" ? "all" : normalize(active)), [active]);

  const searchTerms = useMemo(
    () => normalize(queryInput.trim()).split(/\s+/).filter(Boolean),
    [queryInput],
  );

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      if (activeKey !== "all" && normalize(p.category) !== activeKey) return false;
      if (searchTerms.length === 0) return true;
      const haystack = normalize(
        [p.name, p.description ?? "", p.category, p.badge ?? "", p.platform ?? ""].join(" "),
      );
      return searchTerms.every((t) => haystack.includes(t));
    });
    const sorted = [...list];
    if (sort === "price_asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "recent")
      sorted.sort((a, b) => {
        const ta = a.created_at ? Date.parse(a.created_at) : 0;
        const tb = b.created_at ? Date.parse(b.created_at) : 0;
        return tb - ta;
      });
    return sorted;
  }, [products, active, searchTerms, sort]);

  // Paginação incremental ("Carregar mais"): renderiza só um lote por vez em
  // vez do catálogo inteiro de uma só vez, o que melhora o desempenho de
  // renderização inicial quando há muitos produtos.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Sempre que filtro, busca ou ordenação mudam, volta para o primeiro lote.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeKey, sort, searchTerms.join(" ")]);

  const visibleProducts = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visibleCount < filtered.length;


  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
            {/* Logo */}
            <Link to="/" className="group flex items-center shrink-0" aria-label="EchoLogic — Início">
              <BrandLogo />
            </Link>

            {/* Search */}
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar produtos, marcas e ofertas..."
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                className="h-10 w-full rounded-full border border-border bg-input pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                style={{ boxShadow: "none" }}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 0 0 3px color-mix(in oklab, var(--brand-green) 25%, transparent)")
                }
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              />
              {queryInput && (
                <button
                  type="button"
                  onClick={clearQuery}
                  aria-label="Limpar busca"
                  className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition hover:bg-surface hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface md:hidden"
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="hidden items-center gap-2 md:flex">
              <a
                href="#produtos"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition hover:brightness-110"
                style={{
                  background: "color-mix(in oklab, var(--brand-green) 12%, transparent)",
                  color: "var(--brand-green)",
                }}
              >
                <TrendingUp className="h-3.5 w-3.5" /> Ofertas do Dia
              </a>
            </div>

          </div>

          {/* Category nav */}
          <nav
            className={`${menuOpen ? "flex" : "hidden"} mt-3 flex-col gap-1 md:mt-3 md:flex md:flex-row md:items-center md:gap-1`}
          >
            <CatBtn
              active={active === "all"}
              onClick={() => {
                setActive("all");
                setMenuOpen(false);
              }}
            >
              Todos
            </CatBtn>
            {categoriesList.map((c) => (
              <CatBtn
                key={c.label}
                active={active === c.label}
                onClick={() => {
                  setActive(c.label);
                  setMenuOpen(false);
                }}
              >
                <Tag className="h-4 w-4" />
                {c.label}
              </CatBtn>
            ))}

            <div className="md:ml-auto">
              <Link
                to="/contato"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-surface hover:text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                <MessageSquare className="h-4 w-4" /> Contato
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden border-b border-border"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
          <div className="max-w-2xl">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
              style={{
                background: "color-mix(in oklab, var(--brand-green) 12%, transparent)",
                color: "var(--brand-green)",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" /> Curadoria EchoLogic
            </span>
            <h1
              className="mt-3 text-3xl font-black leading-tight tracking-tight md:text-5xl"
              style={{ color: "var(--brand-navy)" }}
            >
              Os melhores produtos, <span style={{ color: "var(--brand-green)" }}>o menor preço</span>.
            </h1>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Comparamos milhares de ofertas em tempo real para você economizar sem abrir mão da qualidade.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href="#produtos"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="btn-price inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm"
              >
                <ShoppingBag className="h-4 w-4" /> Ver Ofertas
              </a>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Star className="h-4 w-4 fill-current" style={{ color: "var(--brand-green)" }} />
                <span className="font-semibold text-foreground">4.9</span> · 32k+ compradores satisfeitos
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Products */}
      <section id="produtos" className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        <div className="mb-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-black md:text-2xl" style={{ color: "var(--brand-navy)" }}>
                {active === "all" ? "Todos os Produtos" : active}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "oferta encontrada" : "ofertas encontradas"}
                {queryInput && <> para <span className="font-semibold text-foreground">"{queryInput}"</span></>}
              </p>
            </div>

            <label className="flex items-center gap-2 rounded-full border border-border bg-input px-3 py-1.5 text-xs font-medium">
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Ordenar:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="cursor-pointer bg-transparent text-foreground focus:outline-none"
                aria-label="Ordenar produtos"
              >
                <option value="relevance">Relevância</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="recent">Mais Recente</option>
              </select>
            </label>
          </div>


          {/* Filtros por categoria — carrossel horizontal */}
          <div
            role="tablist"
            aria-label="Filtrar por categoria"
            className="-mx-4 flex snap-x snap-mandatory items-center gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <FilterChip active={active === "all"} onClick={() => setActive("all")} count={products.length}>
              Todos
            </FilterChip>
            {categoriesList.map((c) => (
              <FilterChip
                key={c.label}
                active={activeKey === normalize(c.label)}
                onClick={() => setActive(c.label)}
                count={c.count}
              >
                <Tag className="h-3.5 w-3.5" />
                {c.label}
              </FilterChip>
            ))}

            {active !== "all" && (
              <button
                onClick={() => setActive("all")}
                className="ml-2 inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" /> Limpar
              </button>
            )}
          </div>
        </div>


        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center">
            <p className="text-muted-foreground">
              Nenhum produto encontrado
              {queryInput && <> para <span className="font-semibold text-foreground">"{queryInput}"</span></>}
              {active !== "all" && <> em <span className="font-semibold text-foreground">{active}</span></>}.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {queryInput && (
                <button
                  onClick={clearQuery}
                  className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium hover:bg-surface"
                >
                  Limpar busca
                </button>
              )}
              {active !== "all" && (
                <button
                  onClick={() => setActive("all")}
                  className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium hover:bg-surface"
                >
                  Ver todas as categorias
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            key={`${activeKey}-${sort}`}
            className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 animate-in fade-in duration-300"
          >
            {visibleProducts.map((p) => (
              <article key={p.id} className="card-product group flex flex-col overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[color-mix(in_oklab,var(--brand-green)_25%,transparent)]">
                <Link to="/produto/$id" params={{ id: p.id }} aria-label={`Ver detalhes de ${p.name}`} className="relative aspect-square block overflow-hidden bg-surface">
                  {resolveImage(p) ? (
                    <img
                      src={resolveImage(p)!}
                      alt={p.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const el = e.currentTarget;
                        const step = el.dataset.fallback ?? "0";
                        if (step === "0" && p.image_url) {
                          // Tenta reprocessar a imagem original via proxy (contorna CORS/hotlink block)
                          el.dataset.fallback = "1";
                          el.src = `https://images.weserv.nl/?url=${encodeURIComponent(
                            p.image_url.replace(/^https?:\/\//, ""),
                          )}&w=600&h=600&fit=cover`;
                        } else {
                          // Última opção: placeholder estático com o texto "Sem Imagem"
                          el.dataset.fallback = "2";
                          el.src = "https://placehold.co/600x600/e2e8f0/64748b?text=Sem+Imagem";
                        }
                      }}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <ProductImagePlaceholder category={p.category} name={p.name} />
                  )}
                  {p.platform && (
                    <span
                      className="absolute left-1.5 top-1.5 rounded-md border px-1.5 py-0.5 text-[9px] font-semibold backdrop-blur"
                      style={{
                        background: "rgba(255,255,255,0.92)",
                        color: "var(--brand-navy)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      {p.platform}
                    </span>
                  )}
                  {p.discount && (
                    <span
                      className="absolute right-1.5 top-1.5 rounded-md px-2 py-1 text-[11px] font-black shadow-lg ring-2 ring-white/70"
                      style={{ background: "#ef4444", color: "white" }}
                    >
                      -{p.discount}
                    </span>
                  )}
                  {p.badge && (
                    <span
                      className="absolute left-1.5 bottom-1.5 rounded-md px-1.5 py-0.5 text-[9px] font-semibold shadow-md"
                      style={{ background: "var(--brand-navy)", color: "white" }}
                    >
                      {p.badge}
                    </span>
                  )}
                </Link>

                <div className="flex flex-1 flex-col gap-1.5 p-2.5">
                  <h3
                    className="line-clamp-2 min-h-[2rem] text-[11px] font-semibold leading-snug sm:text-xs"
                    style={{ color: "var(--brand-navy)" }}
                  >
                    <Link
                      to="/produto/$id"
                      params={{ id: p.id }}
                      className="transition-colors hover:underline"
                    >
                      <Highlight text={p.name} terms={searchTerms} />
                    </Link>
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px]">
                    <span className="inline-flex items-center gap-0.5" style={{ color: "var(--brand-navy)" }}>
                      <Star className="h-3 w-3 fill-current" style={{ color: "var(--brand-green)" }} />
                      <span className="font-semibold">{p.rating.toFixed(1)}</span>
                    </span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-muted-foreground">
                      {p.sold}
                    </span>
                  </div>

                  <div className="mt-auto">
                    {p.old_price != null && p.old_price > p.price && (
                      <div className="text-[10px] leading-none text-muted-foreground line-through">
                        R$ {formatPrice(p.old_price)}
                      </div>
                    )}
                    <div
                      className="mt-0.5 flex items-baseline gap-1"
                      style={{ color: "var(--brand-blue)" }}
                    >
                      <span className="text-xs font-bold">R$</span>
                      <span className="text-lg font-black tracking-tight leading-none sm:text-xl">
                        {formatPrice(p.price)}
                      </span>
                    </div>
                  </div>





                  <div className="mt-1 flex flex-col gap-1">
                    <Link
                      to="/produto/$id"
                      params={{ id: p.id }}
                      className="btn-price inline-flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[11px]"
                    >
                      <Eye className="h-3 w-3" />
                      Ver Detalhes
                    </Link>
                    <a
                      href={p.affiliate_url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      aria-label={`Ir para oferta de ${p.name} (abre em nova aba)`}
                      className="group/cta inline-flex items-center justify-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-semibold transition-all duration-200 hover:scale-[1.03] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                      style={{
                        borderColor: "var(--brand-navy)",
                        color: "var(--brand-navy)",
                        ["--tw-ring-color" as string]: "var(--brand-green)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--brand-green)";
                        e.currentTarget.style.borderColor = "var(--brand-green)";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "";
                        e.currentTarget.style.borderColor = "var(--brand-navy)";
                        e.currentTarget.style.color = "var(--brand-navy)";
                      }}
                    >
                      Ir para Oferta
                      <span className="transition-transform duration-200 group-hover/cta:translate-x-0.5">→</span>
                    </a>
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}

        {hasMore && (
          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground">
              Mostrando {visibleProducts.length} de {filtered.length} ofertas
            </p>
            <button
              type="button"
              onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
              className="inline-flex items-center justify-center gap-2 rounded-full border px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-surface"
              style={{ borderColor: "var(--brand-navy)", color: "var(--brand-navy)" }}
            >
              Carregar mais ofertas
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_2fr]">
            {/* Brand */}
            <div>
              <div className="flex items-center">
                <BrandLogo className="h-10" />
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Somos um portal de <span className="font-semibold text-foreground">curadoria independente</span> que
                garimpa as melhores ofertas nas maiores plataformas do Brasil — para você comprar com{" "}
                <span className="font-semibold text-foreground">segurança, economia e confiança</span>, sempre no menor
                preço.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold"
                  style={{
                    background: "color-mix(in oklab, var(--brand-green) 12%, transparent)",
                    color: "var(--brand-green)",
                  }}
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Compra Segura
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                  <Heart className="h-3.5 w-3.5" style={{ color: "var(--brand-green)" }} /> Curado a mão
                </span>
              </div>
            </div>

            {/* Institucional */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: "var(--brand-navy)" }}>
                Institucional
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <Link to="/termos-de-uso" className="transition hover:text-foreground">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link to="/politica-de-privacidade" className="transition hover:text-foreground">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link to="/contato" className="transition hover:text-foreground">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contato / Sugira uma Oferta */}
            <div className="md:col-span-2">
              <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: "var(--brand-navy)" }}>
                Sugira uma oferta
              </h4>
              <p className="mt-4 text-sm text-muted-foreground">
                Encontrou uma promoção incrível? Nos avise — respondemos rapidinho.
              </p>
              <FooterContactForm />
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
            <p>© {new Date().getFullYear()} EchoLogic. Todos os direitos reservados.</p>
            <p className="max-w-xl md:text-right">
              Este site contém links de afiliados. Preços sujeitos a alteração.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

function FooterContactForm() {
  const send = useServerFn(sendContactMessage);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string>("");

  // --- Proteção antispam (client-side) ---
  const [honeypot, setHoneypot] = useState("");
  const mountedAtRef = useRef(Date.now());

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const submittedTooFast = Date.now() - mountedAtRef.current < 2500;
    if (honeypot.trim() !== "" || submittedTooFast) {
      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
      return;
    }

    setStatus("sending");
    setError("");
    try {
      await send({
        data: {
          name: name.trim(),
          email: email.trim(),
          subject: "Sugestão / Contato via rodapé",
          message: message.trim(),
        },
      });
      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Falha ao enviar. Tente novamente.");
    }
  }

  if (status === "ok") {
    return (
      <div
        className="mt-4 rounded-xl border p-4 text-sm"
        style={{
          background: "color-mix(in oklab, var(--brand-green) 10%, transparent)",
          borderColor: "color-mix(in oklab, var(--brand-green) 40%, transparent)",
          color: "var(--brand-navy)",
        }}
      >
        ✓ Mensagem enviada! Nossa equipe já foi notificada no Slack.
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 block text-xs font-semibold underline-offset-2 hover:underline"
          style={{ color: "var(--brand-green)" }}
        >
          Enviar outra
        </button>
      </div>
    );
  }

  return (
    <form className="mt-4 space-y-2" onSubmit={onSubmit}>
      {/* Honeypot anti-spam: invisível para humanos, armadilha para bots */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
        <label htmlFor="empresa-rodape">Empresa</label>
        <input
          type="text"
          id="empresa-rodape"
          name="empresa"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <input
        type="text"
        required
        maxLength={100}
        placeholder="Seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-10 w-full rounded-lg border border-border bg-input px-3 text-sm focus:outline-none"
      />
      <div className="relative">
        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="email"
          required
          maxLength={255}
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-input pl-9 pr-3 text-sm focus:outline-none"
        />
      </div>
      <textarea
        required
        minLength={5}
        maxLength={2000}
        rows={3}
        placeholder="Sua mensagem ou link da oferta..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full resize-none rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none"
      />
      {status === "error" && (
        <p className="text-xs" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-price inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm disabled:opacity-60"
      >
        <MessageSquare className="h-4 w-4" />
        {status === "sending" ? "Enviando..." : "Enviar mensagem"}
      </button>
    </form>
  );
}

function CatBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition"
      style={active ? { background: "var(--brand-navy)", color: "white" } : { color: "var(--color-muted-foreground)" }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "var(--color-surface)";
          e.currentTarget.style.color = "var(--color-foreground)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--color-muted-foreground)";
        }
      }}
    >
      {children}
    </button>
  );
}

function FilterChip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition"
      style={
        active
          ? {
              background: "var(--brand-green)",
              color: "white",
              borderColor: "var(--brand-green)",
            }
          : {
              background: "var(--color-surface)",
              color: "var(--brand-navy)",
              borderColor: "var(--color-border)",
            }
      }
    >
      {children}
      {typeof count === "number" && (
        <span
          className="rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none"
          style={
            active
              ? { background: "rgba(255,255,255,0.22)", color: "white" }
              : { background: "var(--color-background)", color: "var(--color-muted-foreground)" }
          }
        >
          {count}
        </span>
      )}
    </button>
  );
}
