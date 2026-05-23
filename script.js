/* SUA VOZ, SEU PODER — script.js
   Nova versão com Ingresso START e VIP.
   Mantém URLs e rastreia cliques de checkout no Meta Pixel.
*/

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx5OVOClj3G3vpjHHg66aIixz4R9P24C1uHN-Sb9oXGZIcQFbBwVcXs2KDV1bi5ppbQ/exec";

const ZAPDATA_WEBHOOK =
  "https://dcjizoulbggsavizbukq.supabase.co/functions/v1/webhook-global?token=156b523d-fd9d-49fb-a61f-ee648c9d7368";

const CHECKOUT_START_URL = "https://pay.kiwify.com.br/6jYbGbk";
const CHECKOUT_VIP_URL = "https://pay.kiwify.com.br/saSkvXX";

function enviarEventoMeta(evento, parametros = {}) {
  if (window.fbq) {
    window.fbq("track", evento, parametros);
  }
}

function iniciarContador() {
  const dias = document.getElementById("cd-days");
  const horas = document.getElementById("cd-hours");
  const minutos = document.getElementById("cd-minutes");
  const segundos = document.getElementById("cd-seconds");

  if (!dias || !horas || !minutos || !segundos) return;

  const agora = new Date();
  const fim = new Date(agora.getTime() + 48 * 60 * 60 * 1000);

  function atualizar() {
    const distancia = Math.max(0, fim.getTime() - new Date().getTime());
    const d = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const h = Math.floor((distancia / (1000 * 60 * 60)) % 24);
    const m = Math.floor((distancia / (1000 * 60)) % 60);
    const s = Math.floor((distancia / 1000) % 60);

    dias.textContent = String(d).padStart(2, "0");
    horas.textContent = String(h).padStart(2, "0");
    minutos.textContent = String(m).padStart(2, "0");
    segundos.textContent = String(s).padStart(2, "0");
  }

  atualizar();
  setInterval(atualizar, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
  iniciarContador();

  document.querySelectorAll(".checkout-link").forEach(function (link) {
    link.addEventListener("click", function () {
      const ticket = link.dataset.ticket || "Ingresso";
      const value = Number(link.dataset.value || 0);

      enviarEventoMeta("InitiateCheckout", {
        content_name: "Sua Voz Seu Poder - " + ticket,
        content_category: "Ingresso Evento",
        value: value,
        currency: "BRL"
      });
    });
  });
});
