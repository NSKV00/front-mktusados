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
          <h4>📦 Fotos do Produto</h4>
          <h5>Adicione fotos de qualidade do seu produto</h5>
        </div>

          <div class="photos-grid">

            <div class="photo-add" @click="selecionarImagem" v-if="!form.fotoPreview">
              🗁 Adicionar foto principal
            </div>

            <div class="photo-item" v-if="form.fotoPreview">
              <img :src="form.fotoPreview" alt="Foto principal" />
              <button class="remove-btn" @click="removeFotoPrincipal">✕</button>
            </div>

            <div
              v-for="(foto, index) in form.fotosAngulosPreview"
              :key="index"
              class="photo-item"
            >
              <img :src="foto" alt="Foto extra" />
              <button class="remove-btn" @click="removeFoto(index)">✕</button>
            </div>

            <div
              class="photo-add"
              @click="selecionarImagemExtra"
              v-if="form.fotoPreview && form.fotosAngulosPreview.length < 4"
            >
              🗁 Adicionar foto
            </div>
          </div>

          <!-- INPUTS -->
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileUpload"
          />

          <input
            ref="fileInputExtra"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleExtraUpload"
          />
        <div class="form-info">
          <h5>Adicione até 5 fotos. A primeira será a foto principal do anúncio.</h5>
        </div>
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
            <v-select
              v-model="form.categoriaId"
              :options="categoriasAPI"
              label="nome"
              :reduce="(cat: { id: number; nome: string }) => cat.id"
              :clearable="false"
              placeholder="Selecione..."
              class="styled-select"
            />
          </div>

          <div class="form-group">
            <label for="estado">Estado do Produto <span class="asterisco">*</span></label>
            <v-select
              v-model="form.estado"
              :options="estadoOpcoes"
              label="label"
              :reduce="(opt: { label: string; value: string }) => opt.value"
              :clearable="false"
              placeholder="Selecione..."
              class="styled-select"
            />
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
              placeholder="Ex: R$1299.99 "
            />
          </div>
  
          <div class="form-group">
            <label for="Quantidade">Quantidade</label>
            <input
              v-model.number="form.quantidade"
              id="quantidade"
              type="number"
              step="1"
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

      <div class="buttons-container">
        <button class="btn-cancelar" @click="cancelar">
          Cancelar
        </button>

        <button class="btn-anunciar" @click="anunciar">
          📢 Anunciar
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import vSelect from "vue-select"
import "vue-select/dist/vue-select.css"
import { ref, onMounted } from "vue"
import { jwtDecode } from "jwt-decode"
import apiController from "../controller/api"
import { nextTick } from "vue"
import { toast } from "vue3-toastify"

const tokenLocal = localStorage.getItem("token") || ""
const token = ref(tokenLocal)
const user = ref(tokenLocal ? jwtDecode(tokenLocal) : null)

const categoriasAPI = ref<string[]>([])

const estadoOpcoes = ref([
  { label: 'Novo', value: 'Novo' },
  { label: 'Semi-novo', value: 'Semi-novo' },
  { label: 'Usado', value: 'Usado' }
])

const form = ref({
  foto: null,
  fotoPreview: null,
  fotosAngulos: [] as File[],
  fotosAngulosPreview: [] as string[],
  titulo: "",
  descricao: "",
  categoriaId: null,
  categoria: "",
  estado: null,
  preco: "",
  quantidade: "",
  cep: ""
})

const fileInput = ref<HTMLInputElement | null>(null)
const fileInputExtra = ref<HTMLInputElement | null>(null)


function selecionarImagemExtra() {
  fileInputExtra.value?.click()
}

function selecionarImagem() {
  fileInput.value?.click()
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

function handleExtraUpload(event: Event) {
  if (form.value.fotosAngulos.length >= 5) {
    alert("Você só pode adicionar no máximo 5 fotos.");
    return;
  }

  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    form.value.fotosAngulos.push(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.fotosAngulosPreview.push(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }
}

function removeFotoPrincipal() {
  form.value.foto = null;
  form.value.fotoPreview = null;

  // 🔥 Permite reenviar a mesma imagem
  if (fileInput.value) {
    fileInput.value.value = "";
  }
}

function removeFoto(index: number) {
  form.value.fotosAngulos.splice(index, 1);
  form.value.fotosAngulosPreview.splice(index, 1);

  // 🔥 Permite reenviar a mesma imagem extra
  if (fileInputExtra.value) {
    fileInputExtra.value.value = "";
  }
}
function cancelar() {
  form.value = {
    foto: null,
    fotoPreview: null,
    fotosAngulos: [],
    fotosAngulosPreview: [],
    titulo: "",
    descricao: "",
    categoriaId: null,
    categoria: "",
    estado: null,
    preco: "",
    quantidade: "",
    cep: ""
  };

  window.history.back();
}

function highlight(el: HTMLElement | null) {
  if (!el) return;
  el.classList.add("error-highlight");
  setTimeout(() => el.classList.remove("error-highlight"), 1000);
}

async function anunciar() {
  const checks = [
    {
      ok: !!form.value.fotoPreview,
      el: () => document.querySelector(".photo-add") || fileInput.value,
      action: () => fileInput.value?.click()
    },
    {
      ok: !!form.value.titulo?.trim(),
      el: () => document.getElementById("titulo")
    },
    {
      ok: !!form.value.descricao?.trim(),
      el: () => document.getElementById("descricao")
    },
    {
      ok: form.value.categoriaId,
      el: () => document.querySelectorAll(".styled-select .vs__dropdown-toggle")[0]
    },
    {
      ok: form.value.estado,
      el: () => document.querySelectorAll(".styled-select .vs__dropdown-toggle")[1]
    },
    {
      ok: form.value.preco !== "" && !isNaN(Number(form.value.preco)),
      el: () => document.getElementById("preco")
    }
  ];

  const missing = checks.find(c => !c.ok);

  if (missing) {
    const el = typeof missing.el === 'function' ? missing.el() : missing.el;
    const element = el as HTMLElement | null;
    
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
    await nextTick();
    highlight(element);
    setTimeout(() => element?.focus(), 300);

    return;
  }

const formData = new FormData()

formData.append("UsuarioId", String((user.value as any).id));
formData.append("Nome", form.value.titulo)
formData.append("Descricao", form.value.descricao)
formData.append("Valor", String(form.value.preco).replace(",", "."))
formData.append("Desconto", "0")
formData.append("CategoriaId", String(form.value.categoriaId))
formData.append("Ativo", "true")
formData.append("Estado", String(form.value.estado))
formData.append("Cep", form.value.cep)
formData.append("QtdEstoque", String(form.value.quantidade))

// imagem principal
if (form.value.foto) {
  formData.append("Img", form.value.foto);
}

// imagens extras (envio como "Imagens")
for (const file of form.value.fotosAngulos) {
  formData.append("Imagens", file)
}


try {
  const produtoResponse = await apiController.post("/produto", formData, {
    headers: { 
      Authorization: `Bearer ${token.value}`,
      "Content-Type": undefined
    }
  });
  toast.success("Anuncio criado com sucesso!");

  setTimeout(() => {
    window.location.href = "/perfil";
  }, 1600);
} catch (error) {
  const msg = error.response?.data?.message || "Erro ao criar anúncio. Tente novamente mais tarde.";
  toast.error(msg);
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

/* Estilo do v-select customizado */
:deep(.styled-select) {
  width: 100%;
}

:deep(.vs__dropdown-toggle) {
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.vs__dropdown-toggle):hover {
  border-color: #fed5aa;
  box-shadow: 0 0 0 2px rgba(254, 213, 170, 0.1);
}

:deep(.vs__dropdown-toggle):focus-within {
  border-color: #fed5aa;
  box-shadow: 0 0 0 3px rgba(254, 213, 170, 0.2);
  outline: none;
}

:deep(.vs__search) {
  padding: 4px 0;
  cursor: pointer !important;
}

:deep(.vs__actions) {
  cursor: pointer !important;
}

:deep(.vs__search::placeholder) {
  color: #999;
}

:deep(.vs__dropdown-menu) {
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background-color: #fff;
}

:deep(.vs__dropdown-option) {
  padding: 10px 12px;
  color: #333;
  cursor: pointer;
  transition: background 0.15s ease;
}

:deep(.vs__dropdown-option:hover) {
  background-color: #fef3e6;
  color: #111827;
}

:deep(.vs__dropdown-menu::-webkit-scrollbar) {
  display: none;
}

:deep(.vs__dropdown-option--selected) {
  background-color: #fed5aa;
  color: #111827;
  font-weight: 600;
}

:deep(.vs__dropdown-option--highlight) {
  background-color: #fed5aa;
  color: #111827;
}

:deep(.vs__clear) {
  color: #999;
  cursor: pointer;
}

:deep(.vs__clear:hover) {
  color: #fed5aa;
}

/* ======== RESPONSIVE ======== */
@media (max-width: 768px) {
  :deep(.vs__dropdown-toggle) {
    padding: 6px 10px;
    font-size: 14px;
  }

  :deep(.vs__dropdown-option) {
    padding: 8px 10px;
  }
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
  margin-bottom: 2px;
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
  width: 100px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden; /* importante: corta partes que ultrapassam */
  transition: 0.3s;
}

.photos-grid {
  padding-left: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
  margin-bottom: 20px;
}

.photo-item,
.photo-add {
  width: 100%;
  aspect-ratio: 1 / 1;
  max-width: 230px;
  border-radius: 12px;
  border: 2px dashed #fcd9bdc7;
  background: #fcf1e7;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: 0.3s;
  position: relative; /* <- necessário para posicionamento absoluto do botão */
}

.photo-item {
  border: 2px dashed #fcd9bdc7;
}

.photo-item:has(img) {
  border: none !important;
  background: none !important;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.photo-add {
  font-size: 36px;
  font-weight: 300;
  color: #e0863a;
}

.photo-add:hover {
  background: #ffe5c7;
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
  z-index: 15;
  width: 16px;
  height: 42px;
  border-radius: 80%;
  border: none;
  background: rgba(255, 255, 255, 0);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  font-size: 18px;
  color: #c300ff;

  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: rgba(255, 255, 255, 0);
  transform: scale(1.08);
  box-shadow: 0 4px 10px rgba(0,0,0,0.18);
}

.hidden {
  display: none;
}

.buttons-container {
  width: 75%;
  max-width: 960px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 40px;
}

.btn-anunciar,
.btn-cancelar {
  padding: 12px 24px;
  width: 90%;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: 0.2s;
}

/* Botão Anunciar */
.btn-anunciar {
  background-color: #8d1ca0;
  color: white;
  font-weight: 600;
}

.btn-anunciar:hover {
  background-color: #460851;
}

/* Botão Cancelar */
.btn-cancelar {
  background-color: #b6b6b6ef;
  color: #333;
  font-weight: 500;
}

.btn-cancelar:hover {
  background-color: #767676;
}

@media (max-width: 420px) {
  .remove-btn {
    top: 6px;
    right: 6px;
    padding: 5px 7px;
    font-size: 15px;
  }
}

@keyframes highlightError {
  0% { 
    box-shadow: 0 0 0 rgba(239, 68, 68, 0);
    border-color: #d1d5db;
  }
  50% { 
    box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.5);
    border-color: #ef4444;
  }
  100% { 
    box-shadow: 0 0 0 rgba(239, 68, 68, 0);
    border-color: #d1d5db;
  }
}

.error-highlight {
  animation: highlightError 1s ease-out !important;
  border-color: #ef4444 !important;
}
</style>