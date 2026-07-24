import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type ProductDTO = {
  id: string;
  name: string;
  category: string;
  price: number;
  old_price: number | null;
  discount: string | null;
  rating: number;
  reviews: number;
  sold: number;
  image_url: string | null;
  images: string[];
  video_url: string | null;
  affiliate_url: string;
  badge: string | null;
  platform: string | null;
  description: string | null;
  sort_order: number;
  created_at: string | null;
  reviews_text: string | null;
};

function detectPlatform(url: string): string | null {
  const u = (url || "").toLowerCase();
  if (u.includes("meli.la") || u.includes("mercadolivre") || u.includes("mercadolibre")) return "Mercado Livre";
  if (u.includes("amazon") || u.includes("amzn")) return "Amazon";
  if (u.includes("magazineluiza") || u.includes("magalu")) return "Magalu";
  if (u.includes("shopee")) return "Shopee";
  if (u.includes("aliexpress")) return "AliExpress";
  if (u.includes("americanas")) return "Americanas";
  return null;
}

function toMoney(value: unknown, fallback: number | null = null): number | null {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  const s = String(value).replace(/R\$\s?/gi, "").trim();
  const normalized = s.includes(",")
    ? s.replace(/\./g, "").replace(",", ".")
    : s;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toNumber(value: unknown, fallback = 0) {
  const n = toMoney(value, NaN as unknown as number);
  return typeof n === "number" && Number.isFinite(n) ? n : fallback;
}

// Trata "" como "sem valor" (diferente de ??, que só pula null/undefined).
function nonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isLikelyUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

function mapRow(r: Record<string, unknown>, idx: number): ProductDTO {
  const rec = r as Record<string, unknown>;

  const price = toMoney(rec.price ?? rec.preco, 0) ?? 0;
  const oldPrice = toMoney(rec.old_price ?? rec.oldPrice ?? rec.preco_antigo, null);

  const productName = String(rec.name ?? rec.nome ?? "Sem nome");

  // --- Link de afiliado ---------------------------------------------
  // Coluna confirmada no Supabase (Table Editor): "affiliate_url".
  const affiliateRaw = nonEmptyString(rec.affiliate_url);
  const affiliate = affiliateRaw && isLikelyUrl(affiliateRaw) ? affiliateRaw : null;

  if (!affiliate) {
    console.warn(
      `[mapRow] Produto "${productName}" (id bruto: ${rec.id ?? rec.ID ?? idx}) está sem um ` +
        `"affiliate_url" válido (valor bruto: ${JSON.stringify(rec.affiliate_url)}). ` +
        `O botão de oferta vai apontar para "#".`,
    );
  }

  const id = String(rec.id ?? rec.ID ?? idx);

  const discountRaw =
    rec.desconto ?? rec.Desconto_Percentual ?? rec.desconto_percentual ?? rec.discount ?? null;
  const ratingRaw =
    rec.avaliacao ?? rec.Nota_Avaliacao ?? rec.nota_avaliacao ?? rec.rating ?? null;
  const soldRaw = rec.total_vendas ?? rec.Total_Vendas ?? rec.vendas ?? rec.avaliacoes ?? null;
  const reviewsCountRaw = Number(rec.avaliacoes ?? 0);
  const reviewsTextRaw = null;
  let discount: string | null = null;
  if (discountRaw !== null && discountRaw !== undefined && discountRaw !== "") {
    const n = toNumber(discountRaw, NaN);
    discount = Number.isFinite(n) ? `${Math.round(n)}%` : String(discountRaw);
  } else if (oldPrice && Number.isFinite(oldPrice) && oldPrice > price && price > 0) {
    discount = `${Math.round(((oldPrice - price) / oldPrice) * 100)}%`;
  }

  const descriptionRaw =
    (rec.description as string | null) ??
    (rec["descricao"] as string | null) ??
    (rec["descrição"] as string | null) ??
    null;

  // --- Imagem principal -----------------------------------------------
  // Coluna confirmada no Supabase (Table Editor): "image_url".
  // Não existe coluna de galeria (images/imagens) — a lista `images`
  // abaixo contém só a imagem principal, para manter a UI da galeria
  // funcionando sem quebrar caso o front espere um array.
  const imageRaw = nonEmptyString(rec.image_url);
  const image_url = imageRaw ? (imageRaw.startsWith("/") ? imageRaw : `/${imageRaw}`) : null;

  if (!image_url) {
    console.warn(
      `[mapRow] Produto "${productName}" (id bruto: ${rec.id ?? rec.ID ?? idx}) está sem um ` +
        `"image_url" válido (valor bruto: ${JSON.stringify(rec.image_url)}). ` +
        `Vai exibir o placeholder "Sem Imagem".`,
    );
  }

  const images = image_url ? [image_url] : [];

  const video_url =
    (rec.video_url as string | null) ??
    (rec.video as string | null) ??
    (rec.youtube as string | null) ??
    (rec.youtube_url as string | null) ??
    null;

  return {
    id,
    name: productName,
    category: String(rec.category ?? rec.categoria ?? "Outros"),
    price,
    old_price: oldPrice && Number.isFinite(oldPrice) ? oldPrice : null,
    discount,
    rating: toNumber(ratingRaw),
    reviews: Number(reviewsCountRaw || rec.avaliacoes || 0),
    sold: Math.round(toNumber(soldRaw)),
    image_url,
    images,
    video_url: video_url ? String(video_url) : null,
    affiliate_url: affiliate ?? "#",
    badge: (rec.badge as string | null) || (rec.selo as string | null) || null,
    platform: detectPlatform(affiliate ?? ""),
    description: descriptionRaw,
    sort_order: Math.round(toNumber(rec.sort_order, idx)),
    created_at: (rec.created_at as string | null) || null,
    reviews_text: reviewsTextRaw,
  };
}

function makeClient() {
  const url = process.env.EXTERNAL_SUPABASE_URL || process.env.SUPABASE_URL!;
  const key = process.env.EXTERNAL_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if ((key.startsWith("sb_publishable_") || key.startsWith("sb_secret_")) && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const getProducts = createServerFn({ method: "GET" }).handler(async (): Promise<ProductDTO[]> => {
  try {
    const supabase = makeClient();
    const { data, error } = await supabase
      .from("produtos" as never)
      .select("*")
      .order("id", { ascending: true, nullsFirst: false })
      .limit(1000);
    if (error) {
      console.error("[getProducts] products query error", error);
      return [];
    }
    return (data ?? []).map((r, idx) => mapRow(r as Record<string, unknown>, idx));
  } catch (err) {
    console.error("[getProducts error]", err);
    return [];
  }
});

export const getProductById = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => {
    const id = typeof data === "object" && data !== null ? (data as { id: unknown }).id : data;
    return { id: String(id ?? "") };
  })
  .handler(async ({ data }): Promise<ProductDTO | null> => {
    try {
      if (!data.id) return null;
      const supabase = makeClient();

      const { data: row, error } = await supabase
        .from("produtos" as never)
        .select("*")
        .eq("id", data.id)
        .maybeSingle();

      if (!error && row) {
        return mapRow(row as Record<string, unknown>, 0);
      }
      if (error) {
        console.warn("[getProductById] busca direta falhou, tentando fallback por índice:", error.message);
      }

      const { data: rows, error: listError } = await supabase
        .from("produtos" as never)
        .select("*")
        .order("id", { ascending: true, nullsFirst: false })
        .limit(1000);

      if (listError || !rows) {
        console.error("[getProductById] fallback query error", listError);
        return null;
      }

      const product = rows
        .map((r, idx) => mapRow(r as Record<string, unknown>, idx))
        .find((p) => p.id === data.id);
      return product ?? null;
    } catch (err) {
      console.error("[getProductById error]", err);
      return null;
    }
  });