ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_test boolean NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS products_is_test_idx ON public.products(is_test);
UPDATE public.products SET is_test = true
WHERE name ILIKE '%teste%' OR name ILIKE '%test %' OR name ILIKE 'test' OR name ILIKE '%exemplo%' OR name ILIKE '%mock%' OR name ILIKE '%demo%';