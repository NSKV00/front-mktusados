<template>
  <div class="card-payment-brick">
    <div id="cardPaymentBrick" style="margin-top: 20px;"></div>

    <div v-if="messages.length" class="mt-4">
      <h3>Mensagens do Hub:</h3>
      <ul>
        <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as signalR from "@microsoft/signalr";
import api from "@/controller/api"; // ajuste caso seu path seja outro

// Props
defineProps({
  amount: { type: Number, required: true },        // valor da compra
  usuarioId: { type: Number, required: true },    // id do usuário
  token: { type: String, required: true }         // token JWT para autenticação
});

// Emite evento de sucesso ou erro
const emit = defineEmits(["success", "error"]);

const brickController = ref(null);
const messages = ref([]);
let connection = null;

onMounted(() => {
  loadMercadoPagoScript();
  startSignalR();
});

function loadMercadoPagoScript() {
  if (document.getElementById("mp-sdk")) return initMPBrick(); // já carregado
  const script = document.createElement("script");
  script.src = "https://sdk.mercadopago.com/js/v2";
  script.id = "mp-sdk";
  script.onload = initMPBrick;
  document.body.appendChild(script);
}

function initMPBrick() {
  const mp = new window.MercadoPago("SEU_PUBLIC_KEY", { locale: "pt-BR" });
  const bricks = mp.bricks();

  bricks.create("cardPayment", "cardPaymentBrick", {
    initialization: { amount: amount },
    callbacks: {
      onReady: () => console.log("Brick montado ✔"),
      onSubmit: async (cardData) => {
        try {
          const response = await api.post(
            "/pagamento",
            {
              UsuarioId: usuarioId,
              Metodo: "credit_card",
              TokenCartao: cardData.token,
              Bandeira: cardData.payment_method_id,
              IssuerId: cardData.issuer_id,
              Parcela: cardData.installments,
              Email: cardData.payer.email,
              Nome: cardData.payer.first_name,
              Cpf: cardData.payer.identification.number,
              Produtos: [{ ProdutoId: 1, Qtd: 1 }],
              Frete: 10,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          console.log("Resposta backend:", response.data);
          emit("success", response.data);
        } catch (err) {
          console.error("Erro no pagamento:", err);
          emit("error", err);
        }
      },
      onError: (err) => {
        console.error("Erro Brick:", err);
        emit("error", err);
      },
    },
  }).then(controller => {
    brickController.value = controller;
  });
}

function startSignalR() {
  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://api-c-atha.onrender.com/myhub", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveMessage", (msg) => {
    messages.value.push(msg);
  });

  connection.start()
    .then(() => console.log("Conectado ao Hub SignalR!"))
    .catch(err => console.error("Erro ao conectar SignalR:", err));
}

// Método para submeter o pagamento de fora do componente
function submitBrick() {
  if (brickController.value) brickController.value.submit();
}

defineExpose({ submitBrick });
</script>

<style scoped>
.card-payment-brick {
  padding: 20px;
  background: #111;
  color: #fff;
  border-radius: 8px;
}
</style>