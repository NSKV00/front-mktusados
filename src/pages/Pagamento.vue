<template>
  <main class="main">
    <v-container v-if="carregando">
      <v-progress-circular indeterminate color="white" size="44" />
    </v-container>
    <v-container v-else class="py-8" max-width="700">
      <v-card v-if="produtos && !mostrarAvaliacao" class="pa-6 inverted-card" elevation="4">
        <h2 class="mb-4">Finalizar Pagamento</h2>
        <p class="text-medium-emphasis mb-6">
          Escolha seu método de pagamento preferido
        </p>
  
        <v-tabs v-model="tab" grow class="inverted-tabs">
          <v-tab value="cartao">Cartão</v-tab>
          <v-tab value="boleto">Boleto</v-tab>
          <v-tab value="pix">PIX</v-tab>
        </v-tabs>
  
        <v-divider class="my-4" />
  
        <v-window v-model="tab">
          <!-- CARTÃO -->
          <v-window-item value="cartao">
            <h1 class="parcelamento">Parcelamento Somente Compras Acima de 10R$</h1>
            <div id="cardPaymentBrick" style="margin-top: 20px;"></div>

            <div style="margin-top: 20px;">
              <h3>Preço do Produto: R$ {{ totalProdutos.toFixed(2) }} + Frete R$ {{ freteInfo }} = R$ {{ totalGeral.toFixed(2) }}</h3>
            </div>
          </v-window-item>
  
          <!-- BOLETO -->
          <v-window-item v-if="!boletoGerado" value="boleto">

            <v-alert type="info" variant="tonal" class="mb-4 inverted-alert">
              O boleto vence em 3 dias úteis após a geração.
            </v-alert>

            <v-text-field
              v-model="boletoNome"
              label="Nome do Pagador"
              variant="solo"
              class="inverted-input mb-3"
            />

            <v-text-field
              v-model="sobrenome"
              label="Sobrenome do Pagador"
              variant="solo"
              class="inverted-input mb-3"
            />
            
            <v-text-field
              v-model="boletoEmail"
              label="Email do Pagador"
              type="email"
              variant="solo"
              class="inverted-input mb-3"
            />

            <v-text-field
              v-model="boletoCpf"
              label="CPF do Pagador"
              variant="solo"
              class="inverted-input mb-3"
            />

            <div class="text-right price-text">
              Preço do Produto: R$ {{ totalProdutos.toFixed(2) }} +
              Frete R$ {{ freteInfo }} =
              R$ {{ totalGeral.toFixed(2) }}
            </div>

            <v-btn
              block
              color="white"
              class="mt-4 black-btn"
              height="48"
              @click="gerarBoleto"
              :disabled="!boletoNome || !boletoEmail || !boletoCpf"
            >
              <v-icon start>mdi-file-document</v-icon>
              Gerar Boleto
            </v-btn>

          </v-window-item>


          <!-- TELA DO BOLETO GERADO -->
          <v-window-item v-if="boletoGerado" value="boleto">
            <div class="text-center mt-4">

              <h3 class="mb-3">Boleto Gerado!</h3>

              <v-alert type="info" variant="tonal" class="mb-4 inverted-alert">
                Clique no botão abaixo para abrir seu boleto.
              </v-alert>

              <v-btn
                block
                color="white"
                class="black-btn"
                height="48"
                :href="boletoLink"
                target="_blank"
              >
                Abrir Boleto
              </v-btn>

            </div>
          </v-window-item>
  
          <!-- PIX -->
          <v-window-item value="pix">
            
            <!-- CONTEÚDO ORIGINAL (SOME AO GERAR O QR) -->
            <div v-if="!pixGerado">

            <v-alert type="warning" variant="tonal" class="mb-4 inverted-alert">
              O código PIX expira em 30 minutos após a geração
            </v-alert>

            <!-- CAMPOS DO PAGADOR -->
            <v-text-field
              v-model="pixNome"
              label="Nome completo"
              variant="solo"
              class="inverted-input mb-3"
            />

            <v-text-field
              v-model="pixEmail"
              label="Email"
              type="email"
              variant="solo"
              class="inverted-input mb-3"
            />

            <v-text-field
              v-model="pixCpf"
              label="CPF"
              variant="solo"
              class="inverted-input mb-3"
            />

            <v-card class="py-8 px-4 mb-4 inverted-card-2" elevation="2">
              <div class="text-center">
                <v-icon size="48">mdi-qrcode</v-icon>
                <p class="text-h6 mt-3 mb-1">Pagamento Instantâneo com PIX</p>
                <p class="text-medium-emphasis">Aprovação imediata 24h por dia</p>
              </div>
            </v-card>

            <div class="text-right price-text">
              Preço do Produto: R$ {{ totalProdutos.toFixed(2) }} +
              Frete R$ {{ freteInfo }} =
              R$ {{ totalGeral.toFixed(2) }}
            </div>

            <v-btn
              block
              color="white"
              class="mt-4 black-btn"
              height="48"
              @click="gerarPix"
              :disabled="!pixNome || !pixEmail || !pixCpf"
            >
              <v-icon start>mdi-qrcode</v-icon>
              Gerar QR Code PIX
            </v-btn>

          </div>

            <!-- TELA DO QR CODE (APARECE DEPOIS) -->
            <div v-if="pixGerado" class="text-center mt-4">

              <h3 class="mb-3">Seu PIX está pronto!</h3>

              <img
                :src="pixQrCode"
                alt="QR Code PIX"
                style="width: 240px; height: 240px; background: white; padding: 12px; border-radius: 12px;"
              />

              <p class="mt-4 mb-1">Código Copia e Cola:</p>

              <v-textarea
                readonly
                :value="pixCopiaCola"
                rows="3"
                auto-grow
                class="inverted-input"
              />

              <v-btn
                block
                color="white"
                class="black-btn mt-3"
                @click="navigator.clipboard.writeText(pixCopiaCola)"
              >
                Copiar código PIX
              </v-btn>

            </div>

          </v-window-item>
        </v-window>
      </v-card>
      <div v-if="mostrarAvaliacao" class="avaliacao-produto mt-6 text-center, divAvalia">
        <h1>Sua compra foi concluída com sucesso! 🚀</h1>
        <h3>Conte-nos o que achou do produto:</h3>
        <div class="estrelas">
          <span 
            v-for="n in 5" 
            :key="n" 
            @click="avaliacao = n" 
            :class="{'ativa': n <= avaliacao}"
            class="estrela"
          >★</span>
        </div>
        <v-btn class="mt-4" color="green" @click="enviarAvaliacao">
          Enviar Avaliação
        </v-btn>
      </div>
    </v-container>
  </main>
</template>

<script setup>
import { jwtDecode } from "jwt-decode";
import { computed, onMounted, onUnmounted, ref } from "vue";
import api from "../controller/api";
import { fr } from "vuetify/locale";
import { toast } from "vue3-toastify";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import * as signalR from "@microsoft/signalr";
import { gerarCardToken } from '@/services/mercadoPago.ts';


const tab = ref("cartao");

const tokenLocal = localStorage.getItem("token") || ""
const token = ref(tokenLocal)
const user = ref(tokenLocal ? jwtDecode(tokenLocal) : null)
const pixQrCode = ref(null)      
const pixCopiaCola = ref(null)   
const pixGerado = ref(false)
const enderecoPrincipal = ref(null)
const produtos = ref(null)
const carregando = ref(true)
const sobrenome = ref("");
const boletoGerado = ref(false);
const boletoLink = ref(null);
const freteInfo = ref(null);
const pixNome = ref("");
const pixEmail = ref("");
const pixCpf = ref("");
const boletoNome = ref("");
const boletoEmail = ref("");
const boletoCpf = ref("");
const cardNumber = ref("");
const cardName = ref("");
const cardExp = ref("");   // MM/AA
const cardCvv = ref("");
const Parcelas = ref(1);
const mensagensHub = ref([]);
const brickController = ref(null);
const pagamentoFeedback = ref(null);
const mostrarAvaliacao = ref(false);
const avaliacao = ref(0);
const route = useRoute()
const checkoutRes = ref({})

const checkout = Number(route.query.checkoutId)

const limparPagamentoLocal = () => {
  localStorage.removeItem("pixGerado");
  localStorage.removeItem("pixQrCode");
  localStorage.removeItem("pixCopiaCola");

  localStorage.removeItem("boletoGerado");
  localStorage.removeItem("boletoLink");
};

const unloadHandler = () => {
  localStorage.setItem("page_unloading", "true");
};

const enviarAvaliacao = async () => {
  try {
    await api.post("/avaliacao", {
      ProdutoId: checkoutRes.value.itens[0].produtoId,        
      Numero: avaliacao.value,       
      Ativo: true                   
    }, {
      headers: { Authorization: `Bearer ${token.value}` }
    });

    toast.success("Avaliação enviada! Obrigado!");
    mostrarAvaliacao.value = true;

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
    
  } catch (err) {
    toast.error("Erro ao enviar avaliação.");
  }
};

onUnmounted(async () => {
  if (connection) {
    await connection.stop();
    console.log("SignalR desconectado");
  }
});



onBeforeRouteLeave(() => {
  limparPagamentoLocal();
});

function initMercadoPago() {
  const mp = new window.MercadoPago("APP_USR-ea797ca3-e3cd-4984-82ef-8357bae31316", {
    locale: "pt-BR",
  });

  const bricks = mp.bricks();

  bricks.create("cardPayment", "cardPaymentBrick", {
    initialization: { amount: produtos.value ? totalProdutos.value + 1 : 0 },
    customization: {
      visual: {
        style: {
          theme: "dark",
        },
      },
    },
    callbacks: {
      onReady: () => console.log("Brick montado ✔" + produtos.value ? totalProdutos.value + 100 : 0),
      onSubmit: async (cardData) => {
        console.log("📌 Dados do Brick:", cardData);

        const response = await api.post(
          "/pagamento",
          {
            metodo: "credit_card",
            usuarioId: user.value.id,
            tokenCartao: cardData.token,
            Bandeira: cardData.payment_method_id,
            IssuerId: cardData.issuer_id,
            Parcela: cardData.installments,
            Email: cardData.payer.email,
            Nome: cardData.payer.first_name,
            Cpf: cardData.payer.identification.number,
            produtos: [
              {
                produtoId: checkoutRes.value.itens[0].produtoId,
                qtd: checkoutRes.value.itens[0].quantidade,
              },
            ],
            frete: freteInfo.value,
          },
          { headers: { Authorization: `Bearer ${token.value}` } }
        );

        console.log("📘 API:", response.data);
      },
      onError: (err) => console.error("ERRO BRICK:", err),
    },
  }).then((controller) => (brickController.value = controller));
}

onMounted(async () => {
  carregando.value = true
  if (!token.value) {
    window.location.href = "/login"
  }


  const pixStorage = localStorage.getItem("pixGerado");
  if (pixStorage === "true") {
    pixGerado.value = true;
    pixQrCode.value = localStorage.getItem("pixQrCode");
    pixCopiaCola.value = localStorage.getItem("pixCopiaCola");
  }

  const boletoStorage = localStorage.getItem("boletoGerado");
  if (boletoStorage === "true") {
    boletoGerado.value = true;
    boletoLink.value = localStorage.getItem("boletoLink");
  }

  const resEndereco = await api.get(`/endereco-principal/${user.value.id}`, {
    headers: { 
      Authorization: `Bearer ${token.value}`,
      "Access-Control-Allow-Origin": "*"
    }
  })

  const resCheckout = await api.get(`/checkout/${checkout}`, {
    headers: { 
      Authorization: `Bearer ${token.value}`,
      "Access-Control-Allow-Origin": "*"
    }
  })

  checkoutRes.value = resCheckout.data
  console.log("Checkout recebido:", checkoutRes.value)


   window.addEventListener("beforeunload", unloadHandler);

   document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        limparPagamentoLocal();
      }
    });


  const navType = performance.getEntriesByType("navigation")[0].type;

  const unloading = localStorage.getItem("page_unloading") === "true";

  if (unloading && navType === "reload") {
  }
  else if (unloading) {
    limparPagamentoLocal();
  }

  localStorage.removeItem("page_unloading");

  const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://api-c-atha.onrender.com/myhub") // seu endpoint do Hub
  .withAutomaticReconnect()
  .build();

  connection.on("ReceiveMessage", (msg) => {
    console.log("Mensagem recebida do SignalR:", msg);
    mensagensHub.value.push(msg);

    // verificar status do pagamento
    if (msg.status === "approved") {
      toast.success("Pagamento aprovado!"); 
      mostrarAvaliacao.value = true; // mostra a avaliação
    } else if (msg.status === "pending") {
      toast.warning("Pagamento pendente...");
    } else if (msg.status === "rejected") {
      toast.error("Pagamento recusado.");
    } else {
      toast.info("Status do pagamento: " + msg.status);
    }
  });

  try {
    await connection.start();
    console.log("Conectado ao Hub SignalR!");
  } catch (err) {
    console.error("Erro ao conectar SignalR:", err);
  }

  enderecoPrincipal.value = resEndereco.data.endereco
  
  const produtosCompletos = []

  for (const item of checkoutRes.value.itens) {
    const res = await api.get(`/produto?Id=${item.produtoId}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })

    produtosCompletos.push({
      ...res.data[0],
      qtd: item.quantidade
    })
  }

  produtos.value = produtosCompletos

  console.log("Produto carregado:", produtos.value)

  const script = document.createElement("script");
  script.src = "https://sdk.mercadopago.com/js/v2";
  script.onload = initMercadoPago;
  document.body.appendChild(script);

  console.log(resEndereco.data.endereco, checkoutRes.value.itens)
  carregando.value = false

  const frete = calcularFreteCarrinho(produtos.value, enderecoPrincipal.value.cep)

  console.log(user.value.sub)
  console.log("Frete calculado:", frete);
  freteInfo.value = frete.valor;
})

const totalProdutos = computed(() => {
  if (!produtos.value) return 0

  return produtos.value.reduce((total, item) => {
    return total + (item.valor * item.qtd)
  }, 0)
})

const totalGeral = computed(() => {
  return totalProdutos.value + (freteInfo.value || 0)
})

const produtosParaPagamento = computed(() => {
  return checkoutRes.value.itens.map(item => ({
    produtoId: item.produtoId,
    qtd: item.quantidade
  }))
})

onBeforeRouteLeave(() => {
  localStorage.removeItem("pixGerado");
  localStorage.removeItem("pixQrCode");
  localStorage.removeItem("pixCopiaCola");

  localStorage.removeItem("boletoGerado");
  localStorage.removeItem("boletoLink");
});

const gerarPix = async () => {
  try {

    if (!validarEmail(pixEmail.value)) {
      return toast.error("Email inválido. Verifique e tente novamente.");
    }

    if (!validarCPF(pixCpf.value)) {
      return toast.error("CPF inválido. Verifique e tente novamente.");
    }

    const res = await api.post("/pagamento", {
      metodo: "pix",
      usuarioId: user.value.id,
      email: pixEmail.value,
      nome: pixNome.value,
      cpf: pixCpf.value,
      frete: 0,
      produtos: produtosParaPagamento.value
    }, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });

    console.log("PIX gerado com sucesso:", res.data);

    pixQrCode.value = "data:image/png;base64," + res.data.qr_base64;
    pixCopiaCola.value = res.data.qr_code;
    pixGerado.value = true;

    localStorage.setItem("pixGerado", "true");
    localStorage.setItem("pixQrCode", pixQrCode.value);
    localStorage.setItem("pixCopiaCola", pixCopiaCola.value);

  } catch (error) {
    toast.error("Erro ao gerar PIX. Verifique os dados e tente novamente.");
  }
};

const gerarBoleto = async () => {
  try {

    if (!validarEmail(boletoEmail.value)) {
      return toast.error("Email inválido. Verifique e tente novamente.");
    }

    if (!validarCPF(boletoCpf.value)) {
      return toast.error("CPF inválido. Verifique e tente novamente.");
    }

    const res = await api.post("/pagamento", {
      metodo: "bolbradesco",
      usuarioId: user.value.id,
      email: boletoEmail.value,
      nome: boletoNome.value,
      cpf: boletoCpf.value,
      sobrenome: sobrenome.value,
      cep: enderecoPrincipal.value.cep,
      rua: enderecoPrincipal.value.rua,
      numero: enderecoPrincipal.value.numero,
      bairro: enderecoPrincipal.value.bairro,
      cidade: enderecoPrincipal.value.cidade,
      estado: enderecoPrincipal.value.estado,
      frete: freteInfo.value,
      produtos: produtosParaPagamento.value
    }, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });

    console.log("BOLETO gerado:", res.data);

    boletoLink.value = res.data.boleto;
    boletoGerado.value = true;
    localStorage.setItem("boletoGerado", "true");
    localStorage.setItem("boletoLink", boletoLink.value);

  } catch (error) {
      toast.error("Erro ao gerar boleto. Verifique os dados e tente novamente.");
  }
};

const pagarCartao = async () => {
  try {
    if (!cardNumber.value || !cardName.value || !cardExp.value || !cardCvv.value) {
      return toast.error("Preencha todos os dados do cartão.");
    }

    const [expMonth, expYear] = cardExp.value.split("/");

    // 1️⃣ GERAR TOKEN NO FRONT
    const tokenId = await gerarCardToken({
      cardNumber: cardNumber.value,
      securityCode: cardCvv.value,
      expMonth: expMonth,
      expYear: "20" + expYear,
      name: cardName.value,
      cpf: user.value.cpf
    });

    console.log("Token gerado:", tokenId);

    // 2️⃣ ENVIAR TOKEN PARA O BACK
    const response = await api.post(
      "/pagamento",
      {
        metodo: "credit_card",
        usuarioId: user.value.id,
        email: user.value.sub,
        nome: cardName.value,
        cpf: user.value.cpf,
        frete: 0,
        tokenCartao: tokenId,
        Bandeira: detectarBandeira(cardNumber.value),
        produtos: produtosParaPagamento.value
      },
      {
        headers: { Authorization: `Bearer ${token.value}` }
      }
    );

    toast.success("Pagamento aprovado!");
  } catch (err) {
    console.error(err);
    toast.error("Erro ao pagar com cartão.");
  }
};

function estimarDistancia(cepOrigem, cepDestino) {
  const prefixOrigem = parseInt(String(cepOrigem).substring(0, 3));
  const prefixDestino = parseInt(String(cepDestino).substring(0, 3));
  return Math.abs(prefixOrigem - prefixDestino) * 20; // cada diferença ≈ 20 km
}

function pesoCubico(altura, largura, comprimento) {
  return (altura * largura * comprimento) / 6000;
}

function calcularFrete({
  cepOrigem,
  cepDestino,
  peso,
  altura,
  largura,
  comprimento,
  valorDeclarado = 0
}) {
  const distancia = estimarDistancia(cepOrigem, cepDestino);

  const pesoCub = pesoCubico(altura, largura, comprimento);

  // Peso final usado no cálculo
  const pesoFinal = Math.max(peso, pesoCub);

  // Valor base (pode ajustar)
  const taxaBase = 5;

  // Tarifa por kg
  const custoPorKg = 4.5;

  // Tarifa por km
  const custoPorKm = 0.02;

  // Seguro opcional
  const seguro = valorDeclarado > 0 ? valorDeclarado * 0.02 : 0;

  // Cálculo final
  const valorFrete =
    taxaBase + pesoFinal * custoPorKg + distancia * custoPorKm + seguro;

  return {
    valor: Number(valorFrete.toFixed(2)),
    pesoUsado: Number(pesoFinal.toFixed(2)),
    distancia: distancia,
  };
}

function calcularFreteCarrinho(produtos, cepDestino) {
  
  // encontrar o CEP mais distante do destino
  const produtoMaisDistante = produtos.reduce((maisDistante, item) => {
    const distAtual = Math.abs(Number(item.cep) - Number(cepDestino))
    const distMaisDist = maisDistante
      ? Math.abs(Number(maisDistante.cep) - Number(cepDestino))
      : -1

    return distAtual > distMaisDist ? item : maisDistante
  }, null)

  const cepOrigemSelecionado = produtoMaisDistante.cep

  // peso total
  const pesoTotal = produtos.reduce((acc, item) => {
    return acc + item.peso * item.qtd
  }, 0)

  // valor declarado total
  const valorDeclarado = produtos.reduce((acc, item) => {
    return acc + item.valor * item.qtd
  }, 0)

  // calcular frete usando o CEP mais distante
  return calcularFrete({
    cepOrigem: cepOrigemSelecionado,
    cepDestino,
    peso: 0.2,
    altura: 10,
    largura: 20,
    comprimento: 20,
    valorDeclarado
  })
}

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let digito1 = (soma * 10) % 11;
  if (digito1 === 10) digito1 = 0;
  if (digito1 !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  let digito2 = (soma * 10) % 11;
  if (digito2 === 10) digito2 = 0;

  return digito2 === parseInt(cpf[10]);
}

function detectarBandeira(numero) {
  numero = numero.replace(/\D/g, ""); // remove espaços e traços

  const regras = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^(5[1-5][0-9]{14}|2(2[2-9][0-9]{12}|[3-7][0-9]{13}))$/,
    amex: /^3[47][0-9]{13}$/,
    elo: /^(4011|4312|4389|4514|4576|5041|5066|5090|6277|6362|6363)/,
    hipercard: /^(606282|3841)/,
    diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/
  };

  for (const bandeira in regras) {
    if (regras[bandeira].test(numero)) {
      return bandeira;
    }
  }

  // fallback: se começar com 50-55 ou 2221-2720, assume MasterCard (teste MP)
  if (/^5[0-5]/.test(numero) || /^2(2[2-9]|[3-7])/.test(numero)) {
    return "mastercard";
  }

  return null; // não identificou
}


</script>

<style scoped>
/* página inteira invertida */
:host,
.v-application {
  background: #000 !important;
  color: #fff !important;
}

.main {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #302e2e;
}

.parcelamento {
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.4rem;
}

/* Card preto */
.inverted-card {
  background: #000 !important;
  color: #fff !important;
  border: 1px solid #444;
}

/* Segundo card */
.inverted-card-2 {
  background: #111 !important;
  color: #fff !important;
  border: 1px solid #333;
}

/* Inputs invertidos */
.inverted-input .v-field {
  background: #111 !important;
  color: #fff !important;
}

.inverted-input input {
  color: #fff !important;
}

/* Tabs invertidas */
.inverted-tabs {
  color: #fff !important;
}

.inverted-tabs .v-tab {
  color: #fff !important;
}

.inverted-tabs .v-tab--selected {
  background: #222 !important;
}

/* Alerts invertidos */
.inverted-alert {
  background: #111 !important;
  color: #fff !important;
  border: 1px solid #333;
}

/* Preço verde claro para contraste */
.price-text {
  color: #7aff9a !important;
  font-weight: bold;
  display: flex;
  justify-content: center;
}

/* Botão branco com texto preto */
.black-btn {
  background: #fff !important;
  color: #000 !important;
  font-weight: 600;
}

.estrelas {
  font-size: 2rem;
  color: #ffffff;
  cursor: pointer;
}

.estrelas .estrela.ativa {
  color: gold;
}

/* Container da avaliação */
.divAvalia {
  background: linear-gradient(145deg, rgba(0, 0, 0, 0.596), rgba(0, 0, 0, 0.788));
  padding: 40px 30px;
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.divAvalia:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.8);
}

.divAvalia h1 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #f8f8f8;
  text-align: center;
}

.divAvalia h3 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #cccccc;
  text-align: center;
}

/* Estrelas */
.estrelas {
  display: flex;
  gap: 10px;
  font-size: 2.5rem;
  color: #ffffff;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.estrelas .estrela:hover,
.estrelas .estrela.ativa {
  color: #ffd700;
  transform: scale(1.2);
}

/* Botão enviar avaliação */
.divAvalia .v-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 30px;
  padding: 12px 30px;
  font-size: 1rem;
  border-radius: 12px;
  background: linear-gradient(90deg, #c908ffb6, #814d91a4);
  color: #fff !important;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.divAvalia .v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .divAvalia {
    padding: 30px 20px;
  }
  
  .estrelas {
    font-size: 2rem;
    gap: 8px;
  }
  
  .divAvalia h1 {
    font-size: 24px;
  }

  .divAvalia h3 {
    font-size: 18px;
  }
}
</style>
