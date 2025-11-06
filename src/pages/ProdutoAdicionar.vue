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
        <h4>📸 Foto do Produto</h4>
        <div class="photo-upload" @click="selecionarImagem">
          <img v-if="form.fotoPreview" :src="form.fotoPreview" alt="Prévia" class="upload-image" />
          <div v-else class="upload-placeholder">
            <p>+ Cadastrar produto</p>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
        </div>
      </div>

      <!-- FORM 2: INFORMAÇÕES -->
      <div class="form-container">
        <h4>🛍️ Informações do Produto</h4>

        <div class="form-group">
          <label for="titulo">Título</label>
          <input
            v-model="form.titulo"
            id="titulo"
            type="text"
            placeholder="Ex: Notebook Dell Inspiron"
          />
        </div>

        <div class="form-group">
          <label for="descricao">Descrição</label>
          <textarea
            v-model="form.descricao"
            id="descricao"
            rows="4"
            placeholder="Descreva o produto..."
          ></textarea>
        </div>

        <div class="form-group">
          <label for="categoria">Categoria</label>
          <select v-model="form.categoria" id="categoria">
            <option value="">Selecione...</option>
            <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="estado">Estado do Produto</label>
          <select v-model="form.estado" id="estado">
            <option value="">Selecione...</option>
            <option value="Novo">Novo</option>
            <option value="Usado">Usado</option>
            <option value="Semi-novo">Semi-novo</option>
          </select>
        </div>
      </div>

      <!-- FORM 3: PREÇO E LOCALIZAÇÃO -->
      <div class="form-container">
        <h4>💰 Preço e Localização</h4>

        <div class="form-group">
          <label for="preco">Preço</label>
          <input
            v-model.number="form.preco"
            id="preco"
            type="number"
            step="0.01"
            placeholder="Ex: 1299.99"
          />
        </div>

        <div class="form-group">
          <label for="cep">CEP</label>
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

<script>
export default {
  name: "CreateListingPage",
  data() {
    return {
      form: {
        foto: null,
        fotoPreview: null,
        titulo: "",
        descricao: "",
        categoria: "",
        estado: "",
        preco: "",
        cep: ""
      },
      categorias: [
        "Roupas Femininas",
        "Roupas Masculinas",
        "Calçados",
        "Celulares e Smartphones",
        "Eletrodomésticos",
        "Móveis",
        "Beleza e Cuidados Pessoais",
        "Informática",
        "Games",
        "Automotivo"
      ]
    };
  },
  watch: {
    form: {
      deep: true,
      handler(novo) {
        localStorage.setItem("draftProduto", JSON.stringify(novo));
      }
    }
  },
  mounted() {
    const salvo = localStorage.getItem("draftProduto");
    if (salvo) this.form = JSON.parse(salvo);
  },
  methods: {
    selecionarImagem() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.form.foto = file;
        this.form.fotoPreview = URL.createObjectURL(file);
      }
    },
    removerImagem() {
      this.form.foto = null;
      this.form.fotoPreview = null;
    }
  },

   beforeUnmount() {
    this.limparLocalStorage();
    window.removeEventListener("beforeunload", this.limparLocalStorage);
  },
};
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

/* ======== MAIN ======== */
.main-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* DICAS */
.tips-banner {
  background: #9dc0ef;
  border: 1px solid #97c1f4;
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 24px;
}

.tips-banner h3 {
  color: #1e3a8a;
  margin-bottom: 8px;
}

.tips-banner ul {
  list-style: none;
  color: #1e40af;
  font-size: 0.9rem;
  margin: 0;
  padding: 0;
}

.tips-banner li {
  margin-bottom: 4px;
}

/* FORM */
.form-container {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 24px;
}

.form-container h4 {
  margin-bottom: 16px;
  color: #393838;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

/* FOTO UPLOAD */
.photo-upload {
  border: 2px dashed #f4b37f;
  background: #fff7ef;
  border-radius: 12px;
  width: 200px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
}

.photo-upload img {
  width: 200px;
  height: 250px;
  object-fit: cover;
  border-radius: 12px;
}

.photo-upload:hover {
  background: #fff3e5;
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
