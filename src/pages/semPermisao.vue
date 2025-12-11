<template>
  <div class="page-container">
    <div class="container-erro">
      <div class="card-erro">
        <div class="header-erro">
          <div class="icone-escudo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
              <path d="M64 24
                      C44 24 36 34 36 34
                      V56
                      C36 78 51 94 64 100
                      C77 94 92 78 92 56
                      V34
                      S84 24 64 24
                      Z"
                    fill="none" stroke="#E60023" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>

              <rect x="61" y="44" width="6" height="28" rx="3" ry="3" fill="#E60023" />

              <circle cx="64" cy="82" r="5" fill="#E60023" />
            </svg>
          </div>
          <h1 class="titulo-erro">Você não tem permisão para entrar nessa página</h1>
        </div>

        <div class="caixa-contato">
          <p class="rotulo-contato">Você pode voltar para:</p>
          <p class="email-contato" @click="voltarHome" style="cursor: pointer; text-decoration: underline;">
            Página Inicial
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { useRouter } from 'vue-router';

    const router = useRouter();

    function voltarHome() {
    router.push('/');
    }
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page-container {
  background: linear-gradient(135deg, #eee9ea 0%, #fce4ec 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  padding: 20px;
}

.container-erro {
  width: 100%;
  max-width: 500px;
}

.card-erro {
  background: #ffe8e888;
  border: 3px solid #e53935;
  border-radius: 20px;
  padding: 60px 40px;
  box-shadow: 0 10px 40px rgba(229, 57, 53, 0.15);
  text-align: center;
}

.header-erro {
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.caixa-contato {
  background: linear-gradient(135deg, rgba(229, 173, 53, 0.288) 0%, rgba(255, 145, 0, 0.267) 100%);
  border: 2px solid #fff3cd;
  border-radius: 16px;
  padding: 24px 20px;
  margin-bottom: 32px;
}

.rotulo-contato {
  font-size: 13px;
  color: #ec8714;
  margin: 0 0 12px 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.icone-escudo {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(229, 57, 53, 0.1) 0%, rgba(244, 67, 54, 0.08) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.titulo-erro {
  font-size: 24px;
  font-weight: 700;
  color: #e53935;
  margin: 0;
  letter-spacing: -0.3px;
}

.descricao-erro {
  font-size: 14px;
  color: #e53935;
  line-height: 1.6;
  margin-bottom: 32px;
  font-weight: 500;
}

.caixa-contato {
  background: linear-gradient(135deg, rgba(229, 57, 53, 0.05) 0%, rgba(244, 67, 54, 0.03) 100%);
  border: 2px solid #ffcdd2;
  border-radius: 16px;
  padding: 24px 20px;
  margin-bottom: 32px;
}

.rotulo-contato {
  font-size: 13px;
  color: #e53935;
  margin: 0 0 12px 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.email-contato {
  font-size: 15px;
  color: #e53935;
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.texto-suporte {
  font-size: 13px;
  color: #e53935;
  line-height: 1.5;
  margin: 0;
  font-weight: 500;
}

@media (max-width: 480px) {
  .card-erro {
    padding: 40px 24px;
    border-radius: 16px;
  }

  .icone-escudo {
    width: 64px;
    height: 64px;
    font-size: 40px;
  }

  .titulo-erro {
    font-size: 20px;
  }

  .descricao-erro {
    font-size: 13px;
    margin-bottom: 24px;
  }

  .caixa-contato {
    padding: 20px 16px;
    margin-bottom: 24px;
  }

  .rotulo-contato {
    font-size: 12px;
  }

  .email-contato {
    font-size: 14px;
  }

  .texto-suporte {
    font-size: 12px;
  }
}
</style>