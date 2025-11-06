<template>
  <div class="page-container">

    <!-- MAIN -->
    <main class="main-content">
      <!-- DICAS -->
      <div class="tips-banner">
        <h3>💡 Dicas para um anúncio de sucesso</h3>
          <ul>
            <li>• Use fotos nítidas e com boa iluminação</li>
            <li>• Seja honesto sobre a condição do produto</li>
            <li>• Descreva defeitos ou marcas de uso</li>
          </ul>
      </div>

      <!-- FORM 1: FOTO -->
      <div class="form-container">
        <div class="form-info">
          <h4>📦 Foto do Produto</h4>
          <h5>Adicione uma foto de qualidade ao seu produto</h5>
        </div>
        <div class="photo-upload" @click="selecionarImagem">
          <img v-if="form.fotoPreview" :src="form.fotoPreview" alt="Prévia" class="upload-image" />
          <div v-else class="upload-placeholder">
            <p>🗁 Adicionar foto</p>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
        </div>
          <h5 class="form-h5">Essa será a foto principal do anuncio</h5>
      </div>

      <!-- FORM 2: INFORMAÇÕES -->
      <div class="form-container">
        <div class="form-info">
          <h4>📋 Detalhes do produto</h4>
          <h5>Descreva seu produto de forma clara e completa</h5>
        </div>

        <div class="form-group">
          <label for="titulo">Título <span class="asterisco">*</span></label>
          <input
            v-model="form.titulo"
            id="titulo"
            type="text"
            placeholder="Ex: Notebook Dell Inspiron"
          />
        </div>

        <div class="form-group">
          <label for="descricao">Descrição <span class="asterisco">*</span></label>
          <textarea
            v-model="form.descricao"
            id="descricao"
            rows="4"
            placeholder="Fale um pouco sobre seu produto: conte o que o torna especial, qual o estado de uso, se tem acessórios e qualquer detalhe que ajude o comprador a entender melhor o que está comprando."
          ></textarea>
        </div>

        <div class="select">
          <div class="form-group">
            <label for="categoria">Categoria <span class="asterisco">*</span></label>
              <select v-model="form.categoriaId" id="categoria">
                <option :value="null">Selecione...</option>
                <option v-for="cat in categoriasAPI" :key="cat.id" :value="cat.id">{{ cat.nome }}</option>
              </select>
          </div>
  
          <div class="form-group">
            <label for="estado">Estado do Produto <span class="asterisco">*</span></label>
            <select v-model="form.estado" id="estado">
              <option value="">Selecione...</option>
              <option value="Novo">Novo</option>
              <option value="Usado">Usado</option>
              <option value="Semi-novo">Semi-novo</option>
            </select>
          </div>
        </div>

      </div>

      <!-- FORM 3: PREÇO E LOCALIZAÇÃO -->
      <div class="form-container">
        <div class="form-info">
          <h4>$ Preço e Localização do produto</h4>
          <h5>Defina o valor e onde o produto está localizado</h5>
        </div>

        <div class="select">
          <div class="form-group">
            <label for="preco">Preço (R$)</label>
            <input
              v-model.number="form.preco"
              id="preco"
              type="number"
              step="0.01"
              placeholder="Ex: 1299.99"
            />
          </div>
  
          <div class="form-group">
            <label for="Quantidade">Quantidade</label>
            <input
              v-model.number="form.quantidade"
              id="quantidade"
              type="number"
              step="0.01"
              placeholder="Ex: 1"
            />
          </div>
        </div>


        <div class="form-group">
          <label for="cep">Localização (CEP)</label>
          <input
            v-model="form.cep"
            id="cep"
            type="text"
            placeholder="Ex: 01001-000"
            maxlength="9"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { jwtDecode } from "jwt-decode";
import  apiController  from "../controller/api"

const tokenLocal = localStorage.getItem("token") || "";
const token = ref(tokenLocal);
const user = ref(tokenLocal ? jwtDecode(tokenLocal) : null);

const categoriasAPI = ref<string[]>([]);

const form = ref({
  foto: null,
  fotoPreview: null,
  titulo: "",
  descricao: "",
  categoriaId: null,
  categoria: "",
  estado: "",
  preco: "",
  quantidade: "",
  cep: ""
});

const fileInput = ref<HTMLInputElement | null>(null);

function selecionarImagem() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    form.value.foto = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.fotoPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

onMounted(async () => {
  try {
    const res = await apiController.get("/categoria", {
      headers: {
        Authorization: `Bearer ${token.value}` // <- aqui
      }
    });

    categoriasAPI.value = res.data;
    console.log("Categorias carregadas:", res.data);
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
  }
});
</script>

<style scoped>
/* ======== BASE ======== */
* {
  box-sizing: border-box;
  font-family: "Inter", system-ui, sans-serif;
}

body, html {
  margin: 0;
  padding: 0;
  background: #868686;
  color: #111827;
}

.header-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  padding: 6px;
  transition: background 0.2s;
}

.icon-button:hover {
  background: #f3f4f6;
}

.icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: #6b7280;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
}

.arrow-left {
  mask-image: url("https://www.svgrepo.com/show/509382/arrow-left.svg");
}

.help-circle {
  mask-image: url("https://www.svgrepo.com/show/509650/help-circle.svg");
}

.asterisco {
  color: orange;
  padding-left: 0.5em;
}

/* ======== MAIN ======== */
.main-content {
  max-width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* DICAS */
.tips-banner {
  width: 75%;
  max-width: 960px;
  background-color: #e7f2ff;
  border: 1px solid #97c1f4;
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 24px;
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.tips-banner h3 {
  color: #1e3a8a;
  margin-bottom: 8px;
  font-weight: 500;
}

.tips-banner ul {
  list-style-type: "• ";
  color: #012dc0;
  font-size: 0.9rem;
  margin: 0;
  padding: 0;
  padding-left: 0.7em;
}

.tips-banner li {
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

/* FORM */
.form-container {
  width: 75%;
  max-width: 960px;
  background: #fff;
  border: 1px solid #868686;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 24px;
}

.form-container h4 {
  margin-bottom: 2px;
  color: #393838;
  font-size: larger;
  font-weight: 700;
}

.form-container h5 {
  margin-bottom: 15px;
  color: #919090ef;
  font-weight: 400;
  font-size: large;
  padding-left: 0.3em;
}

.form-h5 {
  margin-top: 30px;
  color: #919090ef;
  font-weight: 400;
  display: flex;
}

.form-info {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
  color: black;
  display: flex;
}


.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  color: black;
}

.form-group select {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  max-width: 450px;
}

.select .form-group {
  flex: 1;
}

.select {
  display: flex;
  gap: 20px;
}

/* FOTO UPLOAD */
.photo-upload {
  border: 2px dashed #fcd9bdc7;
  background: #fcf1e7;
  border-radius: 12px;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden; /* importante: corta partes que ultrapassam */
  transition: 0.3s;
}

.photo-upload img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* preenche todo o container */
  border-radius: 0; /* opcional — o container já tem bordas arredondadas */
}

.photo-upload:hover {
  background: #ffe5c7;
}
.upload-placeholder p {
  font-weight: 600;
  color: #333;
  text-align: center;
  font-size: 1.1rem;
}
.upload-preview {
  position: relative;
  width: 100%;
  height: 100%;
}
.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
}
.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #fff;
  border: none;
  border-radius: 50%;
  font-size: 1rem;
  padding: 4px 8px;
  cursor: pointer;
  color: #e74c3c;
}
.hidden {
  display: none;
}
</style>
