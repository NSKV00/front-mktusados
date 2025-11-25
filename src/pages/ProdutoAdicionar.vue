<template>
  <div class="page-container">
    <main class="main-content">

      <!-- Banner de Dicas -->
      <div class="tips-banner">
        <h3>💡 Dicas para um anúncio de sucesso</h3>
        <ul>
          <li>• Use fotos nítidas e com boa iluminação</li>
          <li>• Seja honesto sobre a condição do produto</li>
          <li>• Descreva defeitos ou marcas de uso</li>
        </ul>
      </div>

      <!-- Formulário de Anúncio -->
      <div class="form-container">
        <form @submit.prevent="submitForm">

          <!-- SEÇÃO 1: Informações básicas -->
          <section class="form-section">
            <h4>Informações do Produto</h4>

            <div class="form-group">
              <label for="titulo">Título do Produto</label>
              <input
                v-model="form.titulo"
                id="titulo"
                type="text"
                placeholder="Ex: Notebook Dell Inspiron"
                required
              />
            </div>

            <div class="form-group">
              <label for="descricao">Descrição</label>
              <textarea
                v-model="form.descricao"
                id="descricao"
                rows="4"
                placeholder="Descreva o produto..."
                required
              ></textarea>
            </div>
          </section>

          <!-- SEÇÃO 2: Preço e Localização -->
          <section class="form-section">
            <h4>Preço e Localização</h4>

            <div class="form-group">
              <label for="preco">Preço</label>
              <input
                v-model="form.preco"
                id="preco"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 1299.99"
                required
              />
            </div>

            <div class="form-group">
              <label for="localizacao">Localização</label>
              <input
                v-model="form.localizacao"
                id="localizacao"
                type="text"
                placeholder="Ex: São Paulo, SP"
                required
              />
            </div>
          </section>

          <button type="submit" class="submit-button">Publicar Anúncio</button>
        </form>
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
        titulo: "",
        descricao: "",
        preco: ""
      }
    };
  },
  methods: {
    submitForm() {
      console.log("Anúncio enviado:", this.form);
      alert("Anúncio criado com sucesso!");
    }
  }
};
</script>

<style scoped>
/* ======== BASE ======== */
* {
  box-sizing: border-box;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
}

body, html {
  margin: 0;
  padding: 0;
  background: #f9fafb;
  color: #111827;
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

/* ÍCONES */
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
  background: #eff6ff;
  border: 1px solid #bfdbfe;
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
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 6px;
  color: black;
  display: flex;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

.form-group textarea {
  resize: vertical;
}

/* BOTÃO */
.submit-button {
  background-color: #111827;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-button:hover {
  background-color: #1f2937;
}

/* ======== FOOTER ======== */
.footer {
  background: #fff;
  border-top: 1px solid #e5e7eb;
  text-align: center;
  padding: 20px 0;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 32px;
}
</style>
