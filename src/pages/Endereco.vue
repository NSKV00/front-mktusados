<template>
  <div class="enderecos-page">

    <!-- HEADER -->
    <div class="header-container">
      <h1 class="title">Meus Endereços</h1>
      <p class="subtitle">Gerencie seus endereços de entrega</p>
    </div>

    <!-- BOTÃO -->
    <div class="button-container">
      <v-btn
        class="add-button"
        color="primary"
        prepend-icon="mdi-plus"
        @click="abrirModal()"
      >
        Adicionar Endereço
      </v-btn>
    </div>

    <!-- LISTAGEM -->
    <v-container>
      <v-row>
        <v-col
          v-for="end in enderecos"
          :key="end.id"
          cols="12"
          md="4"
        >
          <v-card class="pa-4">
            <h3 class="mb-2">
              {{ end.cep }} — Nº {{ end.numero }}
            </h3>

            <p class="text-body-2">{{ end.cidade }} / {{ end.estado }}</p>

            <div class="d-flex justify-end mt-3">
              <v-btn variant="text" color="primary" @click="abrirModal(end)">
                Editar
              </v-btn>

              <v-btn variant="text" color="red" @click="deletarEndereco(end.id)">
                Excluir
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- MODAL -->
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
import { decryptJSON, decrypt } from "../utils/crypto";

const usuario = decryptJSON(localStorage.getItem("usuario"));

const enderecos = ref([]);
const modal = ref(false);
const enderecoEdicao = ref(null);

const form = ref({
  cep: "",
  numero: "",
  cidade: "",
  estado: ""
});

const carregarEnderecos = async () => {
  try {
    const res = await api.get("/endereco");
    enderecos.value = res.data;
  } catch (e) {
    console.error("Erro ao carregar endereços:", e);
  }
};

onMounted(carregarEnderecos);

const abrirModal = (endereco = null) => {
  enderecoEdicao.value = endereco;

  form.value = endereco
    ? { ...endereco }
    : { cep: "", numero: "", cidade: "", estado: "" };

  modal.value = true;
};

const fecharModal = () => {
  modal.value = false;
  enderecoEdicao.value = null;
};

const formatarCep = () => {
  let c = form.value.cep.replace(/\D/g, "");
  if (c.length > 5) c = c.replace(/(\d{5})(\d)/, "$1-$2");
  form.value.cep = c;
};

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

const salvarEndereco = async () => {
  try {
    const payload = {
      cep: form.value.cep.replace("-", ""),
      numero: Number(form.value.numero),
      usuarioCpf: usuario?.cpf
    };

    if (!payload.usuarioCpf) {
      console.error("❌ CPF do usuário não encontrado!");
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

const deletarEndereco = async (id) => {
  if (!confirm("Deseja excluir este endereço?")) return;

  try {
    await api.delete(`/endereco/${id}`);
    carregarEnderecos();
  } catch (e) {
    console.error("Erro ao deletar:", e);
  }
};
</script>

<style scoped>
.enderecos-page {
  width: 100%;
  background: #ffffff;
  min-height: 100vh;
}

.header-container {
  background: linear-gradient(90deg, #372b73, #372b73, #FF6B6B, #372b73);
  padding: 60px 0;
  text-align: center;
  color: white;
}
.title {
  font-size: 48px;
  font-weight: 700;
}
.subtitle {
  font-size: 20px;
  opacity: 0.9;
}
.button-container {
  display: flex;
  justify-content: center;
  margin-top: -20px;
}
.add-button {
  background: linear-gradient(90deg, #372b73, #FF6B6B) !important;
  color: white;
  font-size: 16px;
  padding: 12px 26px;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.15);
}

button.v-btn[color="purple"] {
  background: #372b73 !important;
  color: white !important;
  border-radius: 12px !important;
  font-weight: 700;
  padding: 12px 0;
  font-size: 15px;
}
button.v-btn[color="grey"] {
  background: #e5e5e5 !important;
  color: #444 !important;
  border-radius: 12px !important;
  font-weight: 600;
  padding: 10px 0;
  font-size: 14px;
}
</style>
