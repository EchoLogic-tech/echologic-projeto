import { createFileRoute } from '@tanstack/react-router'
import { getProductById } from '@/lib/products.functions'

export const Route = createFileRoute('/produto/$id')({
  loader: async ({ params }) => {
    const product = await getProductById({ data: params.id })
    return { product }
  },
  component: ProdutoDetalhePage,
})

function ProdutoDetalhePage() {
  const { product } = Route.useLoaderData()

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Produto não encontrado</h2>
        <p className="text-gray-600 mb-6">O produto que você está procurando não existe ou foi removido.</p>
        <a href="/" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition">
          Voltar para a Vitrine
        </a>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Coluna da Imagem */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-center items-center">
          <img 
            src={product.image_url || "/placeholder.svg"} 
            alt={product.name} 
            className="max-h-[500px] w-full object-contain rounded-xl"
          />
        </div>

        {/* Coluna de Detalhes */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
            {product.category}
          </span>
          
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex text-yellow-400">
              {"★".repeat(Math.floor(Number(product.rating) || 5))}
            </div>
            <span className="font-semibold text-gray-700">{product.rating}</span>
            <span className="text-gray-400">({product.reviews || 0} avaliações)</span>
          </div>

          <div className="mb-6 bg-gray-50 p-5 rounded-xl border border-gray-100">
            {product.old_price && (
              <div className="text-sm text-gray-400 line-through">De R$ {product.old_price}</div>
            )}
            <div className="text-3xl font-black text-emerald-600 mt-1">
              R$ {product.price}
            </div>
            {product.discount && (
              <div className="text-xs font-medium text-emerald-700 mt-1">
                Desconto de {product.discount}
              </div>
            )}
          </div>

          <div className="prose text-gray-600 mb-8 leading-relaxed">
            <p>{product.description || "Produto selecionado com curadoria independente para garantir a melhor escolha."}</p>
          </div>

          <a 
            href={product.affiliate_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg shadow-emerald-600/20 text-lg"
          >
            Ver Menor Preço ↗
          </a>
        </div>
      </div>
    </div>
  )
}