<template>
    <div class="produto-page">

        <div v-if="loading" class="loading-wrapper">
            <div class="loader"></div>
            <p class="loading-text">Carregando produto...</p>
        </div>
        <div v-else>
            <div class="produto-inner max-w-7xl mx-auto px-6 py-10">
                <header class="produto-header text-center mb-8">
                    <h1 class="produto-title">{{ produtoAPI?.nome || product.name }}</h1>
                </header>

                <main class="produto-grid">
                    <section class="images-col">
                        <div class="main-image card">
                            <img :src="imagemSelecionada.url" :alt="imagemSelecionada.alt" @error="onImgError"
                                class="main-img" />
                        </div>

                        <div class="thumbs">
                            <button @click="selectedImageIndex = 0" :aria-pressed="selectedImageIndex === 0"
                                class="thumb-btn" :key="'main'">
                                <img :src="imagemPrincipal" :alt="produtoAPI?.nome" class="thumb-img"
                                    @error="onImgError" />
                            </button>

                            <button v-for="(img, i) in imgs" :key="'extra-' + i" @click="selectedImageIndex = i + 1"
                                :aria-pressed="selectedImageIndex === i + 1" class="thumb-btn">
                                <img :src="converterBase64(img.imagem)" :alt="`${produtoAPI?.nome} - Imagem ${i + 2}`"
                                    class="thumb-img" @error="onImgError" />
                            </button>
                        </div>
                    </section>

                    <section class="details-col">
                        <div class="card price-card">
                            <div class="price-row">
                                <div class="price-left">
                                    <span class="price">R$ {{ (produtoAPI?.valor || product.price).toFixed(2) }}</span>
                                </div>

                            </div>
                        </div>

                        <div class="card small-card rating-card">
                            <div class="rating-row">
                                <div class="stars" aria-hidden="true">
                                    <template v-for="n in 5">
                                        <span class="star"
                                            :class="n <= Math.round(avaliacaoMedia) ? 'on' : 'off'">★</span>
                                    </template>
                                </div>
                                <div class="rating-value">{{ avaliacaoMedia.toFixed(1) }} de 5</div>
                            </div>
                        </div>

                        <div class="card small-card meta-card">
                            <div class="meta-row">
                                <div class="meta-left">
                                    <div class="meta-label">Categoria:</div>
                                    <div class="meta-value">{{ categoriaNome || product.category }}</div>
                                </div>
                                <div class="meta-right">
                                    <div class="meta-label">Estado:</div>
                                    <div class="meta-value2">{{ produtoAPI.estado }}</div>
                                </div>
                                <div class="meta-right">
                                    <div class="meta-label">Estoque:</div>
                                    <div :class="estoqueClass + ' stock-badge'">{{ estoque }} unidades</div>
                                </div>
                            </div>
                        </div>

                        <div class="card desc-card">
                            <h2 class="desc-title">Descrição do Produto</h2>
                            <p class="desc-text">{{ produtoAPI?.descricao || product.description }}</p>
                        </div>

                        <div class="card qty-card">
                            <label class="qty-label">Quantidade:</label>
                            <div class="qty-controls">
                                <button class="qty-btn" @click="decrement" :disabled="quantity <= 1"
                                    aria-label="Diminuir">—</button>
                                <input type="number" v-model="quantity" @input="onQuantityInput" :min="1"
                                    :max="estoque" class="qty-input" aria-label="Quantidade" />
                                <button class="qty-btn" @click="increment" :disabled="quantity >= estoque"
                                    aria-label="Aumentar">+</button>
                                <span class="qty-max">(máx: {{ estoque }})</span>
                            </div>
                        </div>

                        <div class="actions">
                            <button class="btn-add" @click="handleAddToCart" :disabled="estoque <= 0"
                                aria-label="Adicionar ao carrinho">
                                <span class="icon-cart" aria-hidden="true">🛒</span>
                                {{ estoque > 0 ? 'Adicionar ao Carrinho' : 'Fora de Estoque' }}
                            </button>

                            <button class="btn-buy" @click="handleBuyNow" :disabled="estoque <= 0"
                                aria-label="Comprar agora">
                                <span class="icon-buy" aria-hidden="true">💳</span>
                                Comprar Agora
                            </button>

                            <button class="btn-back" @click="goBack" aria-label="Voltar">
                                <span class="icon-back" aria-hidden="true">←</span>
                                Voltar
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../controller/api'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'vue3-toastify'



const quantity = ref(1)
const selectedImageIndex = ref(0)
const router = useRouter()
const route = useRoute()
const produtoAPI = ref(null)
const categoriaNome = ref('')
const estoque = ref(0)
const avaliacaoMedia = ref(0)
const imgs = ref([])
const loading = ref(true)
const produtoId2 = ref(route.params.id) 

const tokenLocal = localStorage.getItem("token") || ""
const token = ref(tokenLocal)
const user = ref(tokenLocal ? jwtDecode(tokenLocal) : null)

const imagemPrincipal = computed(() => {
    if (produtoAPI.value?.img) {
        return converterBase64(produtoAPI.value.img)
    }
    return product.images[0].url
})

const todasAsImagens = computed(() => {
    const resultado = [
        { url: imagemPrincipal.value, alt: produtoAPI.value?.nome || 'Produto' }
    ]

    imgs.value.forEach((img, idx) => {
        resultado.push({
            url: converterBase64(img.imagem),
            alt: `${produtoAPI.value?.nome || 'Produto'} - Imagem ${idx + 2}`
        })
    })

    return resultado
})

const imagemSelecionada = computed(() => {
    return todasAsImagens.value[selectedImageIndex.value] || todasAsImagens.value[0]
})

const priceWithDiscount = computed(() => {
    if (!produtoAPI.value?.desconto || produtoAPI.value.desconto <= 0) return null
    const priceWithoutDiscount = produtoAPI.value.valor / (1 - produtoAPI.value.desconto / 100)
    return priceWithoutDiscount
})

const savingsPercent = computed(() => {
    return produtoAPI.value?.desconto || 0
})

const estoqueClass = computed(() => {
    if (estoque.value <= 0) return 'stock-unavailable'
    if (estoque.value > 10) return 'stock-good'
    return 'stock-low'
})

onMounted(async () => {
    try {
        const produtoId = produtoId2.value

        console.log(user.value)
        const res = await api.get(`/produto?id=${produtoId}`)

        if (res.data && res.data.length > 0) {
            produtoAPI.value = res.data[0]

            if (produtoAPI.value.categoriaId) {
                await buscarCategoria(produtoAPI.value.categoriaId)
            }

            await buscarEstoque(produtoId)

            await buscarAvaliacao(produtoId)

            await buscarImagemExtra(produtoId)

            
        }
        console.log("PRODUTO API =>", produtoAPI.value)
    } catch (error) {
        console.error('Erro ao carregar produto:', error)
    } finally {
        loading.value = false
    }
})

const converterBase64 = (base64) => {
    if (!base64 || typeof base64 !== 'string') return null
    const trimmed = base64.trim()
    if (trimmed.startsWith('data:')) return trimmed

    let tipo = 'image/png'
    if (trimmed.startsWith('/9j/')) tipo = 'image/jpeg'

    return `data:${tipo};base64,${trimmed}`
}

const buscarCategoria = async (categoriaId) => {
    try {
        const res = await api.get(`/categoria?Id=${categoriaId}`)
        if (res.data && res.data.length > 0) categoriaNome.value = res.data[0].nome || 'Categoria'
    } catch (error) {
        categoriaNome.value = 'Categoria'
    }
}

const buscarEstoque = async (produtoId) => {
    try {
        const res = await api.get(`/estoque?ProdutoId=${produtoId}`)
        if (res.data && res.data.length > 0) estoque.value = res.data[0].qtdEstoque || 0
        else estoque.value = 0
    } catch (error) {
        estoque.value = 0
    }
}

const buscarAvaliacao = async (produtoId) => {
    try {
        const res = await api.get(`/avaliacao?produtoId=${produtoId}`)
        console.log("RES AVALIAÇÃO =>", res);
        if (res.data) {
            if (Array.isArray(res.data)) avaliacaoMedia.value = res.data[0]?.media || res.data[0]?.nota || 0
            else if (typeof res.data === 'number') avaliacaoMedia.value = res.data
            else if (res.data?.media) avaliacaoMedia.value = res.data.media
            else avaliacaoMedia.value = 0
        } else avaliacaoMedia.value = 0
    } catch (error) {
        avaliacaoMedia.value = 0
    }
}

const buscarImagemExtra = async (produtoId) => {
    try {
        const res = await api.get(`/produtoImagem/${produtoId}`, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        })
        if (res.data) imgs.value = Array.isArray(res.data) ? res.data : [res.data]
        else imgs.value = []
    } catch (error) {
        imgs.value = []
    }
}

const onImgError = (e) => {
    e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
}

const decrement = () => {
    if (quantity.value > 1) quantity.value -= 1
}

const increment = () => {
    if (quantity.value < estoque.value) quantity.value += 1
}

const onQuantityInput = () => {
    const num = Number(quantity.value);

    if (isNaN(num) || num < 1) quantity.value = 1;
    else if (num > estoque.value) quantity.value = estoque.value;
    else quantity.value = num;
};

const handleAddToCart = () => {
    if (estoque.value <= 0) {
        toast.error('essa quantidade nao pode ser adicionada ao carrinho!')
        return
    }
    
    const adicionarCarrinho = async () => {
    try {
        const body = {
            ProdutoId: produtoAPI.value.id,
            Qtd: quantity.value,
            UsuarioId: Number(user.value.id)
        }

        const res = await api.post("/itemCarrinho", body, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        });

        console.log("Item adicionado:", res.data)
        toast.success('Produto adicionado ao carrinho!')
        setTimeout(() => {
            router.push('/')
        }, 1500)
    } catch (err) {
        console.error("Erro ao adicionar ao carrinho:", err)
        toast.error('Erro ao adicionar ao carrinho')
    }
    }

    adicionarCarrinho()
}

const handleBuyNow =  async () => {
    if (estoque.value <= 0) {
        toast.error('Produto fora de estoque!')
        return
    }

    const body = {
        usuarioId: Number(user.value.id),
        itens: [
            {
                produtoId: Number(produtoId2.value),
                quantidade: quantity.value
            },
        ]
    }

    console.log("BODY ENVIADO =>", body);

    const res = await api.post("/checkout", body,
        {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        }
    )

    router.push({
        path: '/pagamento',
        query: {
            checkoutId: res.data.id
        }
    })
    }

const goBack = () => {
    if (window.history.length > 1) router.back()
    else router.push('/')
}
</script>

<style scoped>
.produto-page {
    background: linear-gradient(180deg, #f9f6ff 0%, #fffaf0 100%);
    min-height: 100vh;
}

.produto-inner {
    max-width: 1200px;
}

.produto-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #2b1b3a;
    margin: 0;
}

.produto-grid {
    display: grid;
    grid-template-columns: 1fr 520px;
    gap: 32px;
    align-items: start;
}

@media (max-width: 1024px) {
    .produto-grid {
        grid-template-columns: 1fr;
    }
}

.card {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
    overflow: hidden;
}

.images-col .main-image {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px;
    background: #fff;
}

.main-img {
    width: 100%;
    height: 560px; 
    object-fit: contain;
    border-radius: 16px;
    box-shadow: 0 18px 50px rgba(15, 23, 42, 0.06);
}

@media (max-width:1024px) {
    .main-img {
        height: 420px;
    }
}

@media (max-width:640px) {
    .main-img {
        height: 320px;
    }
}

.thumbs {
    display: flex;
    gap: 14px;
    margin-top: 18px;
    flex-wrap: wrap;
}

.thumb-btn {
    width: 86px;
    height: 86px;
    padding: 6px;
    border-radius: 12px;
    background: #fff;
    border: 2px solid rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all .18s ease;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
}

.thumb-btn[aria-pressed="true"] {
    box-shadow: 0 20px 48px rgba(99, 33, 255, 0.18);
    border-color: transparent;
    outline: 4px solid rgba(139, 92, 246, 0.14);
    transform: translateY(-4px);
}

.thumb-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 10px;
}

.price-card {
    padding: 20px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.price-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.price-left {
    display: flex;
    align-items: baseline;
    gap: 12px;
}

.price {
    font-size: 2.4rem;
    font-weight: 900;
    color: #7b2ff7;
}

.original {
    color: #bfb6c6;
    text-decoration: line-through;
    font-weight: 700;
}

.savings {
    background: #ffd54f;
    color: #2b1b3a;
    padding: 8px 12px;
    border-radius: 999px;
    font-weight: 700;
}

.small-card {
    padding: 14px 18px;
    margin-top: 16px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.rating-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.star {
    width: 20px;
    height: 20px;
    font-size: 20px;
    line-height: 1;
    display: inline-block;
    text-align: center;
}

.star.on {
    color: #facc15;
}

.star.off {
    color: #e9e9ee;
}

.rating-value {
    color: #6b6b74;
    font-weight: 600;
}

.meta-card {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.meta-label {
    color: #8a7e9f;
    font-weight: 700;
    font-size: 13px;
}

.meta-value {
    background: #f3eaff;
    color: #6236c9;
    padding: 6px 12px;
    border-radius: 999px;
    font-weight: 700;
}

.meta-value2 {
    background: #d89d304d;
    color: #db8f00;
    padding: 6px 12px;
    border-radius: 999px;
    font-weight: 700;
}

.stock-good {
    background: #d1fae5;
    color: #065f46;
    padding: 6px 12px;
    border-radius: 999px;
}

.stock-low {
    background: #fff7d6;
    color: #7a5f00;
    padding: 6px 12px;
    border-radius: 999px;
}

.stock-unavailable {
    background: #fee2e2;
    color: #991b1b;
    padding: 6px 12px;
    border-radius: 999px;
}

.desc-card {
    margin-top: 16px;
    padding: 20px;
    border-radius: 18px;
    background: linear-gradient(180deg, #fff, #fffaf0);
}

.desc-title {
    margin: 0 0 8px 0;
    font-weight: 800;
    color: #2b1b3a;
}

.desc-text {
    margin: 0;
    color: #6b6b74;
    line-height: 1.6;
}

.qty-card {
    margin-top: 16px;
    padding: 18px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.qty-label {
    font-weight: 700;
    color: #6b6b74;
}

.qty-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.qty-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 56px;
    height: 44px;
    border-radius: 12px;
    color: black;
    border: 2px solid rgba(123, 47, 247, 0.14);
    background: #fff;
    font-size: 20px;
    font-weight: 700;
    cursor: pointer;
    transition: all .12s ease;
}

.qty-btn:disabled {
    opacity: .45;
    cursor: not-allowed;
    transform: none;
}

.qty-input {
    width: 84px;
    height: 44px;
    text-align: center;
    border-radius: 12px;
    color: black;
    border: 2px solid rgba(123, 47, 247, 0.14);
    font-weight: 700;
}

.qty-max {
    color: #8a7e9f;
    font-weight: 600;
}

.actions {
    margin-top: 18px;
    display: flex;
    gap: 12px;
    flex-direction: column;
}

.btn-add {
    flex: 1;
    height: 56px;
    background: linear-gradient(90deg, #7b2ff7, #9c4dff);
    color: white;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-weight: 800;
    box-shadow: 0 14px 36px rgba(124, 58, 237, 0.22);
    border: none;
    cursor: pointer;
    transition: transform .12s ease, box-shadow .12s ease;
}

.btn-add:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 20px 48px rgba(124, 58, 237, 0.28);
}

.btn-add:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-buy {
    width: 100%;
    height: 56px;
    background: linear-gradient(90deg, #059669, #10b981);
    color: white;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-weight: 800;
    box-shadow: 0 14px 36px rgba(16, 185, 129, 0.22);
    border: none;
    cursor: pointer;
    transition: transform .12s ease, box-shadow .12s ease;
}

.btn-buy:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 20px 48px rgba(16, 185, 129, 0.28);
}

.btn-buy:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-back {
    height: 56px;
    min-width: 150px;
    border-radius: 999px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    background: #fff;
    color: #6b6b74;
    font-weight: 700;
    cursor: pointer;
    transition: all .12s ease;
}

.btn-back:hover {
    background: #f3f4f6;
}

.icon-cart {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    font-size: 18px;
    line-height: 1;
}

.icon-buy {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    font-size: 18px;
    line-height: 1;
}

.icon-back {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    font-size: 16px;
    line-height: 1;
}

@media (max-width: 1024px) {
    .fixed-action {
        display: block;
        width: calc(100% - 48px);
    }
}

@media (max-width: 640px) {
    .actions {
        flex-direction: column;
    }

    .btn-add, .btn-buy, .btn-back {
        width: 100%;
    }
}

.loading-wrapper {
    width: 100%;
    height: 70vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
}

.loader {
    width: 64px;
    height: 64px;
    border: 6px solid #e8d5ff;
    border-top-color: #7b2ff7;
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
}

.loading-text {
    font-weight: 600;
    color: #7b2ff7;
    font-size: 1.1rem;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
