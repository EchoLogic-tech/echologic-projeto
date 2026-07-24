ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS desconto numeric,
  ADD COLUMN IF NOT EXISTS avaliacao numeric,
  ADD COLUMN IF NOT EXISTS vendas numeric;