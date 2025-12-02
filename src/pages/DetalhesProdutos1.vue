<template>
  <v-container class="detalhes-produto" fluid>
    <v-row justify="center" class="full-height">
      <v-col cols="12" md="10" class="full-height">
        <v-card class="detalhes-card" elevation="12">
          <v-row class="full-height">
           
            <v-col cols="12" md="6" class="image-section">
              <div class="image-wrapper">
                <h1 class="product-title">
                  {{ produto?.nome || 'Produto não encontrado' }}
                </h1>
                <v-img :src="produto?.img" class="product-image" contain />
              </div>
            </v-col>

            <v-col cols="12" md="6" class="info-section">
              <div v-if="produto" class="info-content">
                
                <p class="product-price">
                  R$ {{ produto.valor.toFixed(2).replace('.', ',') }}
                </p>

                <div class="rating-section">
                  <p class="rating-title">Avaliação média:</p>
                  <div class="stars">
                    <v-icon
                      v-for="i in 5"
                      :key="i"
                      color="yellow darken-3"
                      size="30"
                    >
                      {{ i <= Math.round(averageRating) ? 'mdi-star' : 'mdi-star-outline' }}
                    </v-icon>
                    <span class="rating-value">{{ averageRating.toFixed(1) }}/5</span>
                  </div>
                </div>

                <p class="product-description">
                  {{ produto.descricao || 'Descrição não disponível.' }}
                </p>

                <div class="product-category">
                  <strong>Categoria:</strong> {{ categoriaNome || 'Não especificada' }}
                </div>
                
                <v-text-field
                  v-model.number="quantidade"
                  label="Quantidade"
                  type="number"
                  min="1"
                  variant="outlined"
                  density="compact"
                  class="mt-4"
                  style="max-width: 150px;"
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
      color="green-darken-2"
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import apiController from '../controller/api'

const route = useRoute()
const produto = ref<any>(null)
const showToast = ref(false)
const averageRating = ref(0)
const categoriaNome = ref('')
const quantidade = ref(1); 
const token = ref(localStorage.getItem('token'));




onMounted(async () => {
  try {
    const id = route.params.id;

    const res = await apiController.get("/produto", {
      params: { id },
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

   
    produto.value = Array.isArray(res.data) ? res.data[0] : res.data;

    console.log("Produto carregado:", produto.value);
  } catch (err) {
    console.error("Erro ao carregar produto:", err);
  }
});
async function adicionarAoCarrinho() {
  if (!produto.value) return;

  if (quantidade.value < 1) { 
    toast.error("A quantidade deve ser pelo menos 1.");
    return;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Você precisa estar logado para adicionar itens ao carrinho.");
      return;
    }

    // Extrair usuário do token JWT
    const payload = JSON.parse(atob(token.split(".")[1]));
    const usuarioId = Number(payload.id);

    if (!usuarioId) {
      toast.error("Usuário inválido. Faça login novamente.");
      return;
    }

    await apiController.post("/itemCarrinho",
      {
        UsuarioId: usuarioId,
        ProdutoId: produto.value.id,
        Qtd: quantidade.value 
      },
      { 
        headers: { Authorization: `Bearer ${token}` } 
      }
    );

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
  background-color: #f4f4f4;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
}

.detalhes-card {
  border-radius: 18px;
  padding: 2rem 2.5rem;
  background-color: #ffffff;
  color: #000;
  box-shadow: 0 8px 20px #00000022;
}

.image-section {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.image-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.2rem;
}

.product-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.product-image {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 4px 12px #00000030;
  object-fit: contain;
}

.info-section {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1.8rem;
  padding: 1.5rem 1rem;
}

.product-price {
  font-size: 3rem;
  font-weight: 900;
  color: #111;
  margin-bottom: 0.8rem;
  text-align: left;
}

.rating-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.rating-title {
  font-weight: 600;
  font-size: 1rem;
  padding-right: 80px;
}

.stars {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.rating-value {
  font-size: 0.95rem;
  color: #555;
  margin-left: 0.4rem;
}

.product-description {
  font-size: 1.1rem;
  color: #333;
  line-height: 1.6;
  background-color: #fafafa;
  padding: 1rem 1.3rem;
  border-radius: 10px;
  border: 1px solid #ddd;
  text-align: justify;
}

.product-category {
  font-size: 1rem;
  color: #555;
  margin-top: 0.8rem;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
  margin-top: 2.5rem;
}

.button-group .v-btn {
  min-width: 150px;
  height: 55px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btnAdd {
  background-color: #111;
  color: #fff;
  box-shadow: 0 4px 0 #ffaf04;
}
.btnAdd:hover {
  background-color: #333;
}

.btnBack {
  background-color: #000;
  color: #fff;
  box-shadow: 0 4px 0 #d100ff;
}
.btnBack:hover {
  background-color: #222;
}

.toast {
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.5px;
  padding: 10px 18px;
}
</style>

