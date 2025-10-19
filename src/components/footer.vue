<template>
  <v-footer class="footer">
    <v-container class="footer-container">
      <v-row class="footer-content" justify="center">
        <!-- Company Info Section -->
        <v-col cols="12" class="text-center">
          <div class="company-info">
            <div class="logo-container">
              <img src="../assets/logo.png" alt="MKT Usados Logo" class="footer-logo" />
            </div>
            <p class="company-description">
              Sua plataforma confiável para compra e venda de produtos usados.
              Conectando pessoas com segurança e praticidade desde 2024.
            </p>
          </div>
        </v-col>
      </v-row>

      <v-row class="footer-links-row" justify="center">
        <v-col cols="12" lg="10">
          <v-row justify="center">
            <!-- Quick Links Section -->
            <v-col cols="12" md="4" class="text-center">
              <h3 class="footer-heading">Links Rápidos</h3>
              <v-list class="footer-links" align="center">
                <v-list-item
                  v-for="(link, index) in quickLinks"
                  :key="index"
                  :to="link.path"
                  class="footer-link-item"
                  density="compact"
                >
                  <v-icon :icon="link.icon" size="small" class="me-2" />
                  {{ link.text }}
                </v-list-item>
              </v-list>
            </v-col>

            <!-- Help & Support Section -->
            <v-col cols="12" md="4" class="text-center">
              <h3 class="footer-heading">Ajuda & Suporte</h3>
              <v-list class="footer-links" align="center">
                <v-list-item
                  v-for="(link, index) in supportLinks"
                  :key="index"
                  :to="link.path"
                  class="footer-link-item"
                  density="compact"
                >
                  <v-icon :icon="link.icon" size="small" class="me-2" />
                  {{ link.text }}
                </v-list-item>
              </v-list>
            </v-col>

            <!-- Contact Section -->
            <v-col cols="12" md="4" class="text-center">
              <h3 class="footer-heading">Contato</h3>
              <div class="contact-info">
                <p class="contact-item">
                  <v-icon icon="mdi-email" size="small" class="me-2" />
                  contato@mktusados.com.br
                </p>
                <p class="contact-item">
                  <v-icon icon="mdi-phone" size="small" class="me-2" />
                  0800 123 4567
                </p>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- Social Media Section -->
      <v-row justify="center" class="social-media-row">
        <v-col cols="12" class="text-center">
          <div class="social-media-inline">
            <v-btn
              v-for="(social, index) in socialMedia"
              :key="index"
              :href="social.link"
              target="_blank"
              rel="noopener noreferrer"
              variant="text"
              :icon="social.icon"
              class="social-btn mx-2"
            />
          </div>
        </v-col>
      </v-row>

      <!-- Bottom Section -->
      <v-divider class="footer-divider" />
      
      <v-row class="footer-bottom" justify="center">
        <v-col cols="12" lg="8" class="text-center">
          <div class="bottom-content">
            <div class="copyright">
              © {{ new Date().getFullYear() }} MKT Usados. Todos os direitos reservados.
            </div>
            <div class="legal-links">
              <router-link to="/privacidade" class="legal-link">Política de Privacidade</router-link>
              <span class="mx-2">|</span>
              <router-link to="/termos" class="legal-link">Termos de Uso</router-link>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
const quickLinks = [
  { text: 'Início', path: '/', icon: 'mdi-home' },
  { text: 'Produtos', path: '/produtos', icon: 'mdi-shopping' },
  { text: 'Como Funciona', path: '/como-funciona', icon: 'mdi-help-circle' },
  { text: 'Cadastre-se', path: '/cadastro', icon: 'mdi-account-plus' }
]

const supportLinks = [
  { text: 'Central de Ajuda', path: '/ajuda', icon: 'mdi-lifebuoy' },
  { text: 'Segurança', path: '/seguranca', icon: 'mdi-shield-check' },
  { text: 'FAQ', path: '/faq', icon: 'mdi-frequently-asked-questions' },
  { text: 'Contato', path: '/contato', icon: 'mdi-message' }
]

const socialMedia = [
  { icon: 'mdi-facebook', link: 'https://facebook.com/mktusados' },
  { icon: 'mdi-instagram', link: 'https://instagram.com/mktusados' },
  { icon: 'mdi-twitter', link: 'https://twitter.com/mktusados' },
  { icon: 'mdi-linkedin', link: 'https://linkedin.com/company/mktusados' }
]
</script>

<style scoped>
.footer {
  background: linear-gradient(40deg, #372b73, #372b73, #FF6B6B, #372b73);
  color: rgba(255, 255, 255, 0.87);
  width: 100%;
  padding: var(--spacing-xl) 0 var(--spacing-md);
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
}

.footer-content {
  padding-bottom: var(--spacing-md);
  gap: var(--spacing-xl);
}

.footer-links-row {
  padding: 0 var(--spacing-xl);
}

.company-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
}

.logo-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: var(--spacing-md);
}

.footer-logo {
  width: 150px;
  height: auto;
  margin-bottom: var(--spacing-sm);
}

.company-description {
  font-size: var(--font-sm);
  line-height: 1.6;
  opacity: 0.9;
}

.footer-heading {
  font-size: var(--font-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: white;
  text-align: center;
}

.footer-links {
  background: transparent !important;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-link-item {
  background: transparent !important;
  min-height: 32px !important;
  color: rgba(255, 255, 255, 0.87);
  transition: var(--transition-quick);
  padding: var(--spacing-xs) 0;
  width: 100%;
  max-width: 200px;
  text-align: center;
  border-radius: 4px;
}

.footer-link-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1) !important;
  transform: translateY(-2px);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  align-items: center;
}

.contact-item {
  display: flex;
  align-items: center;
  font-size: var(--font-sm);
  margin-bottom: var(--spacing-xs);
}

.social-media-row {
  padding-top: var(--spacing-lg);
}

.social-media-inline {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.social-btn {
  color: white !important;
  opacity: 0.87;
  transition: var(--transition-quick);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.social-btn:hover {
  opacity: 1;
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.2);
}

.footer-divider {
  border-color: rgba(255, 255, 255, 0.12);
  margin: var(--spacing-lg) 0;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
}

.footer-bottom {
  font-size: var(--font-xs);
  padding-top: var(--spacing-md);
  padding-bottom: var(--spacing-md);
}

.bottom-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.copyright {
  opacity: 0.87;
}

.legal-links {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.legal-link {
  color: rgba(255, 255, 255, 0.87);
  text-decoration: none;
  transition: var(--transition-quick);
}

.legal-link:hover {
  color: white;
  text-decoration: underline;
}

@media (max-width: 600px) {
  .footer {
    padding: var(--spacing-lg) 0 var(--spacing-md);
  }

  .footer-content > [class*="col-"] {
    margin-bottom: var(--spacing-lg);
  }

  .footer-bottom {
    text-align: center;
  }

  .legal-links {
    margin-top: var(--spacing-sm);
  }
}
</style>