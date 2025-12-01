<template>
  <v-container class="detalhes-produto" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card class="detalhes-card" elevation="8">
          <v-row>

            
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

            
            <v-col cols="12" md="6" class="info-section">
              <div v-if="produto" class="info-content">
                <p class="product-price">R$ {{ produto.valor.toFixed(2).replace('.', ',') }}</p>
                <p class="product-desconto">R$ {{ produto.desconto.toFixed(1).replace('.', ',') }}</p>
                <p class="product-description">{{ produto.descricao || 'Descrição não disponível.' }}</p>
                <div class="product-category"><strong>Categoria:</strong> {{ categoriaNome || 'Não especificada' }}</div>
                <p class="product-estoque">Estoque: {{ produto.estoque || 'Não especificado' }}</p>
                <div class="product-avaliacao">
                <strong>Avaliação:</strong>
                <span v-for="i in 5" :key="i">
                <v-icon small color="yellow" v-if="i <= Math.round(produto.avaliacao)">mdi-star</v-icon>
                <v-icon small color="grey" v-else>mdi-star-outline</v-icon>
                </span>
                ({{ produto.avaliacao }})
                </div>
                

                <div class="product-quantidade">
                  <strong>Quantidade:</strong>
                  <v-text-field
                    v-model.number="quantidade"
                    type="number"
                    min="1"
                    variant="outlined"
                    density="compact"
                    style="max-width: 100px; margin-left: 10px;"
                  ></v-text-field>
                </div>
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
const mediaAvaliacao = ref<number>(0);
const categoriaNome = ref('');
const quantidade = ref(1);
const token = localStorage.getItem('authToken'); 
const usuarioId = localStorage.getItem('userId'); 



onMounted(async () => {
  try {
    const id = route.params.id;

    const res = await apiController.get("/produto", {
      params: { id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

   
    produto.value = Array.isArray(res.data) ? res.data[0] : res.data;

    console.log("Produto carregado:", produto.value);
  } catch (err) {
    console.error("Erro ao carregar produto:", err);
  }
  try {
    if (produto.value && produto.value.categoria) {
      const resCategoria = await apiController.get("/categoria", {
        params: { id: produto.value.categoria },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      categoriaNome.value = resCategoria.data.nome || 'Não especificada';
    }
  } catch (err) {
    console.error("Erro ao carregar categoria:", err);
  }

});

    async function carregarAvaliacao() {
  if (!produto.value) return;

  try {
    const res = await apiController.get("/avaliacao", {
      params: { produtoId: produto.value.id }
    });
    mediaAvaliacao.value = res.data.media || 0;
  } catch (err) {
    console.error("Erro ao carregar avaliação:", err);
    mediaAvaliacao.value = 0;
  }
}
onMounted(() => {
  carregarAvaliacao();
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
  width: 100%;
  min-height: 100vh;
  background: #f8f8fa; 
  padding: 50px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.detalhes-card {
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem;
  border: none;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}
.detalhes-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.12);
}


.image-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.product-title {
  font-size: 28px;
  font-weight: 900;
  color: #010101;
  margin-bottom: 0.8rem;
  text-align: center;
}

.product-image {
  width: 100%;
  max-width: 450px;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
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
  border-radius: 12px;
  transition: all 0.25s;
}
.thumbnail:hover {
  transform: scale(1.1);
  border-color: #6b2dff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}
.thumbnail.selected {
  border-color: #43119b;
  box-shadow: 0 0 12px #6b2dff;
}
.info-section {
  display: flex;
  flex-direction: column;
  gap: 10rem;
  padding: 0 1rem;
}
.product-price {
  font-size: 2.6rem;
  font-weight: 900;
  color: #010101;
  margin-bottom: 0.8rem;
  text-align: justify;
}
.product-desconto {
  font-size: 1.8rem;
  font-weight: 700;
  color: #d32f2f;
  margin-bottom: 0.8rem;
  text-align: justify;
  text-decoration: line-through;
}
.product-description {
  font-size: 0.9rem;
  color: #444;
  line-height: 1.6;
  background-color: #fafafa;
  padding: 1.2rem;
  border-radius: 14px;
  border: 1px solid #eee;
  text-align: justify;
  gap: 1rem;
}

.product-category {
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
  text-align: justify;
  gap: 1rem;
}
.product-estoque {
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
  margin-top: 0.5rem;
  text-align: justify;
  gap: 1rem;
}
.product-avaliacao {
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.product-avaliacao i {
  vertical-align: middle;
  margin-right: 2px;
}
.product-avaliacao span {
  vertical-align: middle;
}
.product-quantidade{
  font-size: 0.9rem;
  color: #000000;
  font-weight: 500;
  margin-top: 0.5rem;
  text-align: justify;
  gap: 1rem;
}
.button-group {
  display: flex;
  justify-content: flex-start;
  gap: 0.9rem;
  margin-top: 1rem;
}

.btnAdd {
  background: linear-gradient(135deg, #6b2dff, #9b4dff);
  color: #fff;
  font-weight: 700;
  border-radius: 14px;
  height: 50px;
  padding: 0 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btnAdd:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(107,45,255,0.4);
}

.btnBack {
  background: #222;
  color: #fff;
  font-weight: 700;
  border-radius: 14px;
  height: 50px;
  padding: 0 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btnBack:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.25);
}

/* Snackbar / Toast */
.toast {
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.5px;
  padding: 12px 20px;
  border-radius: 50px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.15);
}

@media (max-width: 960px) {
  .detalhes-card {
    padding: 1.5rem;
  }
  .info-section {
    gap: 0.1rem;
    padding: 0;
  }
  .product-price {
    font-size: 2rem;
  }
  .product-description {
    font-size: 0.8rem;
  }
  .product-category {
    font-size: 0.8rem;
    padding-left: 16px;
  }
  .product-avaliacao {
    font-size: 0.8rem;
    padding-left: 16px;
  }
  .product-quantidade {
    font-size: 0.8rem;
    padding-top: 8px;
    padding-left: 16px;
  }
}
@media (max-width: 600px) {
  .detalhes-card {
    padding: 1rem;
  }
  .product-title {
    font-size: 22px;
    padding-bottom: 20px;
  }
  .product-price {
    font-size: 2rem;
    padding-left: 24px;
    padding-bottom: 8px;
  }
  .button-group {
    flex-direction: column;
    gap: 0.7rem;
    padding: 2rem;
  }
  .image-section {
    margin-bottom: 2rem;
    padding-top: 36px;
  }
  .product-description {
    font-size: 0.8rem;
    padding: 1rem;
    padding-left: 24px;
  }
}
</style>
