const mp = new (window as any).MercadoPago(
  "TEST-3d076f3c-d08e-4260-a924-4fb5ef6e6d41",
  { locale: "pt-BR" }
);

export async function gerarCardToken(cartao: {
  cardNumber: string;
  securityCode: string;
  expMonth: string;
  expYear: string;
  name: string;
  cpf: string;
}) {
  const token = await mp.fields.createCardToken({
    cardNumber: cartao.cardNumber,
    securityCode: cartao.securityCode,
    expirationMonth: cartao.expMonth,
    expirationYear: cartao.expYear,
    cardholderName: cartao.name,
    identificationType: "CPF",
    identificationNumber: cartao.cpf,
  });

  return token.id; // retorna o card_token
}