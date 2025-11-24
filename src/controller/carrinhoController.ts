import api from '../controller/api'

export function apiFinalizarCompra(usuarioId: number, itens: any[]) {
  return api.post('/pagamento', {
    FPagamentoId: usuarioId,
    Status: 'Pendente',
    Ativo: true,
    Produtos: itens.map(item => ({
      ProdutoId: item.id,
      Qtd: item.quantidade
    }))
  })
}


export function apiUpdateQuantity(usuarioId: number, produtoId: number, quantidade: number) {
  return api.put('/itemCarrinho', {
    usuario_id: usuarioId,
    produto_id: produtoId,
    quantidade
  })
}

export function apiRemoveFromCart(usuarioId: number, produtoId: number) {
  return api.delete('/itemCarrinho', {
    data: { usuario_id: usuarioId, produto_id: produtoId }
  })
}

export function apiGetCart(usuarioId: number) {
  return api.get(`/itemCarrinho${usuarioId}`)
}
