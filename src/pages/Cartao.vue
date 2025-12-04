<template>
  <div style="padding: 20px;">
    <h2>Pagamento com Cartão</h2>

    <div id="cardPaymentBrick" style="margin-top: 20px;"></div>

    <div v-if="messages.length" style="margin-top: 20px;">
      <h3>Mensagens do Hub:</h3>
      <ul>
        <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as signalR from "@microsoft/signalr";

export default {
  data() {
    return {
      brickController: null,
      messages: [],       // mensagens recebidas do SignalR
      connection: null    // conexão SignalR
    };
  },

  mounted() {
    this.loadScript();
    this.startSignalR();
  },

  methods: {
    loadScript() {
      const script = document.createElement("script");
      script.src = "https://sdk.mercadopago.com/js/v2";
      script.onload = this.initMP;
      document.body.appendChild(script);
    },

    initMP() {
      const mp = new window.MercadoPago(
        "TEST-3d076f3c-d08e-4260-a924-4fb5ef6e6d41",
        { locale: "pt-BR" }
      );

      const bricks = mp.bricks();

      bricks.create("cardPayment", "cardPaymentBrick", {
        initialization: { amount: 100.00 },
        callbacks: {
          onReady: () => console.log("Brick montado ✔"),
          onSubmit: async (cardData) => {
            console.log("📌 Dados do Brick:", cardData);

            const response = await fetch("https://api-c-atha.onrender.com/pagamento", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmczIiwiaWQiOiI1Iiwibm9tZSI6InN0cmluZzMiLCJhZG1pbiI6IlRydWUiLCJjcGYiOiJzdHJpbmczIiwibmJmIjoxNzY0NjIwNTE0LCJleHAiOjE3NjQ3OTMzMTQsImlhdCI6MTc2NDYyMDUxNH0.8nTgifygxIOMjJCvu4NvEb9PkCWkmf7jKQ88iDw3ZuU"
              },
              body: JSON.stringify({
                UsuarioId: 22,
                Metodo: "credit_card",
                TokenCartao: cardData.token,
                Bandeira: cardData.payment_method_id,
                IssuerId: cardData.issuer_id,
                Parcela: cardData.installments,
                Email: cardData.payer.email,
                Nome: cardData.payer.first_name,
                Cpf: cardData.payer.identification.number,
                Produtos: [{ ProdutoId: 1, Qtd: 1 }],
                Frete: 10
              })
            });

            const result = await response.json();
            console.log("📘 API:", result);
          },
          onError: (err) => console.error("ERRO BRICK:", err)
        }
      }).then(controller => {
        this.brickController = controller;
      });
    },

    async startSignalR() {
      // cria a conexão
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl("https://api-c-atha.onrender.com/myhub", { 
          accessTokenFactory: () => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmczIiwiaWQiOiI1Iiwibm9tZSI6InN0cmluZzMiLCJhZG1pbiI6IlRydWUiLCJjcGYiOiJzdHJpbmczIiwibmJmIjoxNzY0NjIwNTE0LCJleHAiOjE3NjQ3OTMzMTQsImlhdCI6MTc2NDYyMDUxNH0.8nTgifygxIOMjJCvu4NvEb9PkCWkmf7jKQ88iDw3ZuU" 
        })
        .withAutomaticReconnect()
        .build();

      // recebe mensagens do Hub
      this.connection.on("ReceiveMessage", (msg) => {
        this.messages.push(msg);
      });

      // inicia a conexão
      try {
        await this.connection.start();
        console.log("Conectado ao Hub SignalR!");
      } catch (err) {
        console.error("Erro ao conectar SignalR:", err);
      }
    }
  }
};
</script>