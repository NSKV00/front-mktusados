<template>
  <v-footer class="footer">
    <v-container class="footer-container">
      <v-row class="footer-content" justify="center">
        <v-col cols="12" class="text-center">
          <div class="company-info">
            <p class="company-description">
              Sua plataforma confiável para compra e venda de produtos usados.
              Conectando pessoas com segurança e praticidade desde 2025.
            </p>
          </div>
        </v-col>
      </v-row>

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
      
      <v-row class="footer-bottom" justify="center">
        <v-col cols="12" lg="8" class="text-center">
          <div class="bottom-content">
            <div class="copyright">
              © {{ new Date().getFullYear() }} MKT Usados. Todos os direitos reservados.
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
  const socialMedia = [
    { icon: 'mdi-facebook', link: 'https://facebook.com/mktusados' },
    { icon: 'mdi-instagram', link: 'https://instagram.com/mktusados' },
    { icon: 'mdi-twitter', link: 'https://twitter.com/mktusados' },
    { icon: 'mdi-linkedin', link: 'https://linkedin.com/company/mktusados' }
  ]
</script>

<style scoped>
.footer {
  background: var(--color-text);
  color: rgba(10, 10, 10, 0.87);
  width: 100%;
}

.footer::before{
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  top: 0px;
  background: linear-gradient(40deg, #372b73, #FF6B6B, #372b73);
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
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

.company-description {
  font-size: var(--font-sm);
  line-height: 1.6;
  opacity: 0.9;
}

.social-media-inline {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.social-btn {
  color: rgba(10, 10, 10, 0.87)!important;
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
}

@media (max-width: 350px){
  .social-media-inline {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}
}
</style>