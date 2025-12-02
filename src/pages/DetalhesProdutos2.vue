<template>
  <v-container class="detalhes-produto" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card class="detalhes-card" elevation="8">
          <v-row>

            <!-- Imagem principal + miniaturas -->
            <v-col cols="12" md="6" class="image-section">
              <h1 class="product-title">{{ produto?.nome || 'Produto não encontrado' }}</h1>
              <v-img :src="imagemSelecionada || produto?.img" class="product-image" contain />

              <v-row class="miniaturas" dense>
                <v-col
                  v-for="(img, index) in produtoImagens"
                  :key="index"
                  cols="3"
                  class="pa-1"
                >
                  <v-img
                    :src="img"
                    height="60"
                    width="60"
                    contain
                    class="thumbnail"
                    :class="{ selected: imagemSelecionada === img }"
                    @click="imagemSelecionada = img"
                  />
                </v-col>
              </v-row>
            </v-col>

            <!-- Informações do produto -->
            <v-col cols="12" md="6" class="info-section">
              <div v-if="produto" class="info-content">
                <p class="product-price">R$ {{ produto.valor.toFixed(2).replace('.', ',') }}</p>
                <p class="product-description">{{ produto.descricao || 'Descrição não disponível.' }}</p>
                <div class="product-category"><strong>Categoria:</strong> {{ categoriaNome || 'Não especificada' }}</div>

                <v-text-field
                  v-model.number="quantidade"
                  label="Quantidade"
                  type="number"
                  min="1"
                  variant="outlined"
                  density="compact"
                  class="mt-4"
                  style="max-width: 120px;"
                ></v-text-field>
              </div>

              <div class="button-group">
                <v-btn class="btnAdd" @click="adicionarAoCarrinho" :disabled="!produto">
                  Adicionar ao Carrinho ({{ quantidade }})
                </v-btn>
                <v-btn class="btnBack" @click="$router.back()">Voltar</v-btn>
              </div>
            </v-col>

          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="showToast"
      color="green darken-2"
      timeout="2000"
      location="bottom right"
      elevation="24"
      rounded="pill"
      class="toast"
    >
      <v-icon start>mdi-cart-check</v-icon>
      Produto adicionado ao carrinho!
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from 'vue3-toastify';
import apiController from '../controller/api';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const produto = ref<any>(null);
const produtoImagens = ref<string[]>([]);
const imagemSelecionada = ref<string>('');
const showToast = ref(false);
const averageRating = ref(0);
const categoriaNome = ref('');
const quantidade = ref(1);
const token = localStorage.getItem('authToken'); 
const usuarioId = localStorage.getItem('userId'); 


onMounted(async () => {
  try {
    const id = route.params.id;

   const resProduto = await apiController.get(
  `/produto/${id}`,
  { headers: { Authorization: `Bearer ${token}` }}
);
    produto.value = Array.isArray(resProduto.data) ? resProduto.data[0] : resProduto.data;
if (!produto.value) {
  toast.error("Produto não encontrado");
  return;
}
    
  } catch (err) {
    console.error("Erro ao carregar produto:", err);
    toast.error("Erro ao carregar produto. Tente novamente.");
    router.push('/');
  }
  try {
    const resAvaliacao = await apiController.get(
      `/avaliacao/produto/${produto.value.id}`,
      { headers: { Authorization: `Bearer ${token}` }}
    );
     if (resAvaliacao.data.length > 0) {
      const soma = resAvaliacao.data.reduce(
        (acc: number, a: any) => acc + a.nota, 
        0
      ); 
      averageRating.value = soma / resAvaliacao.data.length;
    }
  } catch (err) {
    console.log('Sem avaliações disponíveis');
  }
  if (produto.value.categoriaId) {
    const resCat = await apiController.get(
      `/categoria/${produto.value.categoriaId}`,
      { headers: { Authorization: `Bearer ${token}` }}
    );
    categoriaNome.value = resCat.data.nome;
  }
  try {
  const resImagens = await apiController.get(
    `/produtoImagem/${produto.value.id}`,
    { headers: { Authorization: `Bearer ${token}` }}
  );
  
  if (resImagens.data && resImagens.data.length > 0) {
    produtoImagens.value = resImagens.data.map(
      (i: any) => `data:image/jpeg;base64,${i.imagem}`
    );
    imagemSelecionada.value = produtoImagens.value[0];
  } else {
    
    if (produto.value.img) {
      produtoImagens.value = [produto.value.img];
      imagemSelecionada.value = produto.value.img;
    }
  }
} catch (err) {
  console.log('Produto sem imagens extras, usando principal');
  if (produto.value.img) {
    produtoImagens.value = [produto.value.img];
    imagemSelecionada.value = produto.value.img;
  }
}
});

async function adicionarAoCarrinho() {
  
  if (!produto.value) return;
  if (!token) {
    toast.error("Você precisa estar logado");
    return;
  }
  if (quantidade.value < 1) { toast.error("A quantidade deve ser pelo menos 1."); return; }

  try {
    
 if (!usuarioId) {
    toast.error("Usuário inválido. Faça login novamente.");
    return;
  }
  
  await apiController.post("/itemCarrinho", {
    UsuarioId: Number(usuarioId),
    ProdutoId: produto.value.id,
    Qtd: quantidade.value
  }, { headers: { Authorization: `Bearer ${token}` }});

    showToast.value = true;
    quantidade.value = 1;
  } catch (err: any) {
    console.error("Erro ao adicionar ao carrinho:", err.response?.data || err);
    toast.error(err.response?.data?.message || "Erro ao adicionar ao carrinho");
  }
}

</script>

<style scoped>
.detalhes-produto {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f5f5, #eaeaea);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
}

.detalhes-card {
  border-radius: 20px;
  padding: 2rem;
  background-color: #fff;
  box-shadow: 0 12px 25px rgba(0,0,0,0.12);
  transition: transform 0.2s;
}
.detalhes-card:hover { transform: translateY(-4px); }

.image-section { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.product-title { font-size: 2rem; font-weight: 900; color: #43119b; margin-bottom: 1rem; text-align: center; }

.product-image {
  width: 100%;
  max-width: 420px;
  height: auto;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  object-fit: contain;
}

.miniaturas {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.thumbnail {
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 10px;
  transition: all 0.2s;
}
.thumbnail:hover { transform: scale(1.1); box-shadow: 0 2px 10px rgba(0,0,0,0.2); }
.thumbnail.selected { border-color: #43119b; box-shadow: 0 0 8px #43119b; }

.info-section { display: flex; flex-direction: column; justify-content: flex-start; gap: 1.5rem; padding: 1rem; }
.product-price { font-size: 2.8rem; font-weight: 900; color: #ff6f91; margin-bottom: 1rem; }

.rating-section { display: flex; flex-direction: column; gap: 0.3rem; }
.stars { display: flex; align-items: center; gap: 0.3rem; }
.rating-value { font-size: 0.95rem; color: #555; margin-left: 0.4rem; }

.product-description {
  font-size: 1.05rem;
  color: #333;
  line-height: 1.6;
  background-color: #fafafa;
  padding: 1rem 1.3rem;
  border-radius: 12px;
  border: 1px solid #ddd;
  text-align: justify;
}

.product-category { font-size: 1rem; color: #555; margin-top: 0.8rem; font-weight: 500; }

.button-group { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
.btnAdd {
  background: linear-gradient(135deg, #43119b, #8e2de2);
  color: #fff;
  min-width: 160px;
  height: 50px;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 12px;
  box-shadow: 0 6px 0 #8e2de2;
  transition: all 0.2s;
}
.btnAdd:hover { transform: translateY(-2px); box-shadow: 0 10px 0 #8e2de2; }

.btnBack {
  background: linear-gradient(135deg, #333, #555);
  color: #fff;
  min-width: 140px;
  height: 50px;
  font-weight: 700;
  border-radius: 12px;
  transition: all 0.2s;
}
.btnBack:hover { transform: translateY(-2px); }

.toast { font-weight: 600; font-size: 1rem; letter-spacing: 0.5px; padding: 10px 18px; }
</style>
