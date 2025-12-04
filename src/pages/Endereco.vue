<template>
  <div class="enderecos-page">
    
    <div class="top-bar-container">
      <div class="header-content">
        <h1 class="title">Meus Endereços</h1>
        <p class="subtitle">Gerencie seus endereços de entrega</p>
      </div>

      <v-btn
        class="add-button"
        color="#0066FF"
        prepend-icon="mdi-plus"
        @click="abrirModal()"
      >
        Adicionar Endereço
      </v-btn>
    </div>

    <v-container class="listagem-container">
      <v-row>
        <v-col
          v-for="end in enderecos"
          :key="end.id"
          cols="12"
          sm="6"
          md="6" lg="6" 
        >
          <v-card class="endereco-card">
  <div class="address-info-group">
      <v-icon color="#0066FF" class="mr-2">mdi-map-marker</v-icon>
      <div class="address-details">

          <h3 class="cep-numero">
            {{ end.cep }} — Nº {{ end.numero }}

            <!-- TAG CORRETA -->
            <span v-if="end.ativo" class="tag-principal">Principal</span>
            <span v-else class="tag-entrega">Entrega</span>
          </h3>

          <p class="cidade-estado">{{ end.cidade }} / {{ end.estado }}</p>
      </div>
  </div>

  <div class="actions-container">

    <v-btn
      variant="outlined"
      color="primary"
      class="action-button edit-button"
      @click="abrirModal(end)"
    >Editar</v-btn>

    <v-btn
      variant="outlined"
      color="red"
      class="action-button delete-button"
      @click="deletarEndereco(end.id)"
    >Excluir</v-btn>

    <!-- BOTÃO TORNAR PRINCIPAL -->
    <v-btn
      v-if="!end.ativo"
      variant="outlined"
      color="purple"
      class="action-button"
      @click="tornarPrincipal(end.id)"
    >
      Tornar Principal
    </v-btn>

  </div>
</v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="modal" max-width="550" persistent>
      <v-card class="pa-6">

        <h2 class="text-center mb-6">Adicionar endereço</h2>

        <!-- CEP -->
        <v-text-field
          label="CEP *"
          v-model="form.cep"
          placeholder="00000-000"
          maxlength="9"
          @input="formatarCep"
          @blur="buscarCep"
        />

        <!-- Número -->
        <v-text-field
          label="Número *"
          v-model="form.numero"
          placeholder="123"
        />

        <!-- Cidade -->
        <v-text-field
          label="Cidade"
          :model-value="form.cidade"
          readonly
          placeholder="Será preenchido automaticamente"
        />

        <!-- Estado -->
        <v-text-field
          label="Estado"
          :model-value="form.estado"
          readonly
          placeholder="Será preenchido automaticamente"
        />

        <!-- AÇÕES -->
        <div class="d-flex flex-column mt-4">
          <v-btn color="purple" class="mb-3" @click="salvarEndereco">
            Salvar Endereço
          </v-btn>

          <v-btn color="grey" variant="tonal" @click="fecharModal">
            Cancelar
          </v-btn>
        </div>

      </v-card>
    </v-dialog>


    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import api from "../controller/api";
import { decryptJSON } from "../utils/crypto";

const usuario = decryptJSON(localStorage.getItem("usuario"));

const enderecos = ref([]);
const modal = ref(false);
const enderecoEdicao = ref(null);

const form = ref({
  cep: "",
  numero: "",
  cidade: "",
  estado: "",
  ativo: true
});

// -------------------------
//  CARREGAR ENDEREÇOS
// -------------------------
const carregarEnderecos = async () => {
  try {
    const res = await api.get(`/endereco?cpf=${usuario.cpf}`);

    // ordena para mostrar o principal primeiro
    enderecos.value = res.data.sort((a, b) => Number(b.ativo) - Number(a.ativo));

  } catch (e) {
    console.error("Erro ao carregar endereços:", e);
  }
};

onMounted(carregarEnderecos);

// -------------------------
//  MODAL
// -------------------------
const abrirModal = (endereco = null) => {
  enderecoEdicao.value = endereco;

  form.value = endereco
    ? { ...endereco }
    : { cep: "", numero: "", cidade: "", estado: "", ativo: true };

  modal.value = true;
};

const fecharModal = () => {
  modal.value = false;
  enderecoEdicao.value = null;
};

// -------------------------
// FORMATA CEP
// -------------------------
const formatarCep = () => {
  let c = form.value.cep.replace(/\D/g, "");
  if (c.length > 5) c = c.replace(/(\d{5})(\d)/, "$1-$2");
  form.value.cep = c;
};

// -------------------------
// CONSULTAR VIA CEP
// -------------------------
const buscarCep = async () => {
  if (form.value.cep.length < 9) return;

  const cepNumerico = form.value.cep.replace("-", "");

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
    const dados = await res.json();

    if (!dados.erro) {
      form.value.cidade = dados.localidade;
      form.value.estado = dados.uf;
    }
  } catch (e) {
    console.error("Erro ao buscar CEP:", e);
  }
};

// -------------------------
// SALVAR ENDEREÇO
// -------------------------
const salvarEndereco = async () => {
  try {
    const payload = {
      cep: form.value.cep.replace("-", ""),
      numero: Number(form.value.numero),
      usuarioId: usuario.id,
      ativo: form.value.ativo
    };

    if (!usuario.id) {
      console.error("❌ ID do usuário não encontrado");
      return;
    }

    if (enderecoEdicao.value) {
      await api.patch(`/endereco/${enderecoEdicao.value.id}`, payload);
    } else {
      await api.post("/endereco", payload);
    }

    fecharModal();
    carregarEnderecos();

  } catch (e) {
    console.error("❌ Erro ao salvar:", e.response?.data || e);
  }
};

// -------------------------
// DELETAR
// -------------------------
const deletarEndereco = async (id) => {
  if (!confirm("Deseja excluir este endereço?")) return;

  try {
    await api.delete(`/endereco/${id}`);
    carregarEnderecos();
  } catch (e) {
    console.error("Erro ao deletar:", e);
  }
};

// -------------------------
// DEFINIR PRINCIPAL
// -------------------------
const tornarPrincipal = async (id) => {
  try {
 
    for (const end of enderecos.value) {
      if (end.ativo) {
        await api.patch(`/endereco/${end.id}`, { ativo: false, usuarioId: usuario.id });
      }
    }

    await api.patch(`/endereco/${id}`, { ativo: true, usuarioId: usuario.id });

    carregarEnderecos();

  } catch (e) {
    console.error("Erro ao tornar principal:", e);
  }
};


</script>

<style scoped>

.enderecos-page {
  background: #FFFFFF;
  min-height: 100vh;
}

.top-bar-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 30px 20px 10px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

/* TÍTULOS */
.title {
  font-size: 32px;
  font-weight: 700;
  color: #000;
  margin-bottom: 8px;
}
.subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #666;
}

/* BOTÃO ADICIONAR ENDEREÇO */
.add-button {
  text-transform: none !important;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  padding: 0 16px !important;
  height: 36px !important;
  color: white !important;
  background-color: #0066FF !important; 
}

/* LISTAGEM */
.listagem-container {
    max-width: 1200px; 
    padding: 10px 20px 30px;
    padding-top: 64px;
}

/* ESTILO DO CARD DE ENDEREÇO */
.endereco-card {
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid #ddd !important; 
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white !important;
}

.address-info-group {
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;
}

.address-info-group .v-icon {
    margin-right: 10px !important; 
}

.cep-numero {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 0px;
  line-height: 1.2;
}


.cidade-estado {
  font-size: 14px;
  color: #666;
  margin-top: 4px; 
  padding-right:64px;
}


.actions-container {
    gap: 5px; 
    margin-top: 15px !important;
    display: flex;
    justify-content: flex-start; 
}

.action-button {

    flex-grow: 1; 
    max-width: 50%; 
    text-transform: none !important;
    font-size: 14px !important; 
    font-weight: 500;
    letter-spacing: normal !important;
    border-radius: 6px;
    height: 40px !important;
    padding: 0 16px !important; 
}

.edit-button {
    color: #0066FF !important;
    border-color: #0066FF !important;
    background-color: white !important;
}

.delete-button {
    color: #E53935 !important;
    border-color: #E53935 !important;
    background-color: white !important;
}

.tag-principal {
  background: #0066FF;
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
  font-weight: 600;
}

.tag-entrega {
  background: #888;
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
  font-weight: 600;
}


@media (max-width: 600px) {
  .top-bar-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .add-button {
    margin-top: 15px;
    width: 100%;
    max-width: 300px;
  }
  .actions-container {
    flex-direction: row; 
    justify-content: space-between;
  }
}
</style>