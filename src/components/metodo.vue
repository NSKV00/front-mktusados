<template>
  <v-card class="pa-6" max-width="650">
    <h2 class="mb-4">Finalizar Pagamento</h2>
    <p class="text-body-2 mb-4">Escolha seu método de pagamento preferido</p>

    <v-tabs v-model="tab" class="mb-6" grow>
      <v-tab value="card"><v-icon start>mdi-credit-card</v-icon> Cartão</v-tab>
      <v-tab value="boleto"><v-icon start>mdi-receipt</v-icon> Boleto</v-tab>
      <v-tab value="pix"><v-icon start>mdi-qrcode</v-icon> PIX</v-tab>
    </v-tabs>

    <!-- CARTÃO -->
    <v-window v-model="tab">
      <v-window-item value="card">
        <v-text-field label="Número do Cartão" prepend-inner-icon="mdi-credit-card-outline" variant="solo" class="mb-4" />
        <v-text-field label="Nome no Cartão" variant="solo" class="mb-4" />

        <div class="d-flex ga-4 mb-4">
          <v-text-field label="Validade" placeholder="MM/AA" variant="solo" />
          <v-text-field label="CVV" placeholder="123" prepend-inner-icon="mdi-lock-outline" variant="solo" />
        </div>

        <div class="text-right text-h6 text-green">R$ 299,90</div>

        <v-btn block color="primary" class="mt-4" size="large">Pagar com Cartão de Crédito</v-btn>
      </v-window-item>

      <!-- BOLETO -->
      <v-window-item value="boleto">
        <v-alert type="info" variant="tonal" class="mb-4">O boleto vence em 3 dias úteis após a geração</v-alert>

        <v-text-field label="CPF do Pagador" placeholder="000.000.000-00" variant="solo" class="mb-4" />

        <div class="text-right text-h6 text-green">R$ 299,90</div>

        <v-btn block color="primary" class="mt-4" size="large"><v-icon start>mdi-receipt</v-icon>Gerar Boleto</v-btn>
      </v-window-item>

      <!-- PIX -->
      <v-window-item value="pix">
        <v-alert type="warning" variant="tonal" class="mb-4">O código PIX expira em 30 minutos após a geração</v-alert>

        <v-card variant="tonal" class="pa-6 mb-4 text-center">
          <v-icon size="64">mdi-qrcode</v-icon>
          <p class="mt-2">Pagamento Instantâneo com PIX<br />Aprovação imediata 24h por dia</p>
        </v-card>

        <div class="text-right text-h6 text-green">R$ 299,90</div>

        <v-btn block color="primary" class="mt-4" size="large"><v-icon start>mdi-qrcode</v-icon>Gerar QR Code PIX</v-btn>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup>
import { ref } from "vue";

const tab = ref("card");
</script>

<style scoped>
.text-green {
  color: #28a745;
}
</style>