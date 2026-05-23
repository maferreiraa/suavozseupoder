/*
  Cole este código no Google Apps Script da planilha e implante como App da Web.
  Ele aceita compra aprovada da Kiwify para Ingresso START e VIP.
*/

const ZAPDATA_WEBHOOK =
  "https://dcjizoulbggsavizbukq.supabase.co/functions/v1/webhook-global?token=156b523d-fd9d-49fb-a61f-ee648c9d7368";

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0];

  let data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (error) {
    data = {};
  }

  const payloadString = JSON.stringify(data);
  const orderId = data.order_id || data.order_ref || data.id || data.order?.id || "";
  const status = data.order_status || data.webhook_event_type || data.status || "";

  if (status !== "paid" && status !== "order_approved" && data.webhook_event_type !== "order_approved") {
    return ContentService.createTextOutput("Evento ignorado").setMimeType(ContentService.MimeType.TEXT);
  }

  if (pedidoJaExiste(sheet, orderId)) {
    return ContentService.createTextOutput("Pedido já registrado").setMimeType(ContentService.MimeType.TEXT);
  }

  const nome = data.Customer?.full_name || data.Customer?.first_name || data.customer?.name || data.customer_name || "";
  const email = data.Customer?.email || data.customer?.email || data.customer_email || "";
  const whatsapp = limparTelefone(data.Customer?.mobile || data.Customer?.phone || data.customer?.phone || data.customer_phone || "");

  const productName = String(
    data.Product?.product_name || data.product?.name || data.product_name || data.product || ""
  ).toLowerCase();

  const valorCentavos = data.Commissions?.charge_amount || data.commissions?.charge_amount || data.charge_amount || 0;
  const valor = valorCentavos ? (valorCentavos / 100).toFixed(2) : "";

  const isStart = productName.includes("start") || valor === "27.90" || valor === "27.9";
  const tipo = isStart ? "START" : "VIP";
  const valorFinal = valor || (isStart ? "27.90" : "97.00");
  const codigo = gerarCodigo(tipo);

  const paginaIngresso = isStart ? "ingresso-start.html" : "ingresso-vip.html";
  const linkIngresso =
    "https://maferreiraa.github.io/suavozseupoder/" + paginaIngresso +
    "?id=" + encodeURIComponent(codigo) +
    "&nome=" + encodeURIComponent(nome);

  sheet.appendRow([
    new Date(), nome, email, whatsapp, tipo, codigo, linkIngresso,
    "paid", valorFinal, "Kiwify", payloadString, orderId
  ]);

  enviarZapData({
    nome: nome,
    email: email,
    whatsapp: whatsapp,
    telefone: whatsapp,
    tipo: tipo,
    codigo: codigo,
    linkIngresso: linkIngresso,
    linkingresso: linkIngresso,
    link_ingresso: linkIngresso,
    ingresso: linkIngresso,
    status: "paid",
    valor: valorFinal,
    origem: "Kiwify"
  });

  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}

function pedidoJaExiste(sheet, orderId) {
  if (!orderId) return false;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  const ids = sheet.getRange(2, 12, lastRow - 1, 1).getValues().flat();
  return ids.includes(orderId);
}

function gerarCodigo(prefixo) {
  return prefixo + "-" + Date.now().toString().slice(-6) + Math.floor(10 + Math.random() * 90);
}

function limparTelefone(numero) {
  return String(numero || "").replace(/\D/g, "");
}

function enviarZapData(payload) {
  try {
    UrlFetchApp.fetch(ZAPDATA_WEBHOOK, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  } catch (error) {
    Logger.log("Erro ZapData: " + error);
  }
}
