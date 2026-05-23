/*
  SUA VOZ, SEU PODER — script.js
  Modal de inscrição + Google Sheets + ZapData.
  Corrigido para o repositório novo: suavozseupoder.
*/

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx5OVOClj3G3vpjHHg66aIixz4R9P24C1uHN-Sb9oXGZIcQFbBwVcXs2KDV1bi5ppbQ/exec";

const ZAPDATA_WEBHOOK =
  "https://dcjizoulbggsavizbukq.supabase.co/functions/v1/webhook-global?token=156b523d-fd9d-49fb-a61f-ee648c9d7368";

const THANK_YOU_URL =
  "https://maferreiraa.github.io/suavozseupoder/obrigado.html";

const INGRESSO_BASE_URL =
  "https://maferreiraa.github.io/suavozseupoder/ingresso.html";

function normalizarWhatsApp(numero) {
  return (numero || "").replace(/\D/g, "");
}

function gerarCodigoIngresso() {
  return "SVSP-" + Date.now().toString().slice(-6) + Math.floor(10 + Math.random() * 90);
}

function enviarEventoMeta(evento, parametros = {}) {
  if (window.fbq) {
    window.fbq("track", evento, parametros);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("inscricaoModal");
  const fecharModal = document.getElementById("fecharModal");
  const inscricaoForm = document.getElementById("inscricaoForm");
  const formMessage = document.getElementById("formMessage");

  const abrirModalBtns = document.querySelectorAll(
    ".abrir-inscricao, .btn-free, .btn-secondary, .btn-valor-gratis"
  );

  function abrirModal() {
    if (!modal) return;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const primeiroCampo = modal.querySelector("input");

    if (primeiroCampo) {
      setTimeout(function () {
        primeiroCampo.focus();
      }, 150);
    }
  }

  function fecharModalFn() {
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  abrirModalBtns.forEach(function (botao) {
    botao.addEventListener("click", function (event) {
      const href = botao.getAttribute("href");
      const abreInscricao =
        botao.classList.contains("abrir-inscricao") ||
        botao.classList.contains("btn-free") ||
        botao.classList.contains("btn-valor-gratis") ||
        botao.classList.contains("btn-secondary") ||
        href === "#" ||
        href === "#inscricao";

      if (!abreInscricao) return;

      event.preventDefault();
      abrirModal();
    });
  });

  if (fecharModal) {
    fecharModal.addEventListener("click", fecharModalFn);
  }

  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        fecharModalFn();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      fecharModalFn();
    }
  });

  if (inscricaoForm) {
    inscricaoForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const submitButton = inscricaoForm.querySelector("button[type='submit']");
      const formData = new FormData(inscricaoForm);

      const nome = (formData.get("nome") || "").trim();
      const email = (formData.get("email") || "").trim();
      const whatsapp = normalizarWhatsApp(formData.get("whatsapp"));
      const codigo = gerarCodigoIngresso();

      const linkIngresso =
        INGRESSO_BASE_URL +
        "?id=" +
        encodeURIComponent(codigo) +
        "&nome=" +
        encodeURIComponent(nome);

      const lead = {
        data: new Date().toLocaleString("pt-BR"),
        nome: nome,
        email: email,
        whatsapp: whatsapp,
        telefone: whatsapp,
        tipo: "gratuito",
        codigo: codigo,
        linkIngresso: linkIngresso,
        linkingresso: linkIngresso,
        link_ingresso: linkIngresso,
        ingresso: linkIngresso,
        origem: "LP Sua Voz Seu Poder"
      };

      if (formMessage) {
        formMessage.textContent = "Enviando sua inscrição...";
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
      }

      localStorage.setItem("ingresso_svsp", JSON.stringify(lead));
      enviarEventoMeta("Lead");

      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "cors",
         headers: {
  "Content-Type": "application/json"
},
body: JSON.stringify(lead)
        });
      } catch (error) {
        console.log("Erro Google Sheets:", error);
      }

      try {
        await fetch(ZAPDATA_WEBHOOK, {
          method: "POST",
          mode: "cors",
          headers: {
  "Content-Type": "application/json"
},
body: JSON.stringify(lead)
        });
      } catch (error) {
        console.log("Erro ZapData:", error);
      }

      setTimeout(function () {
        window.location.href = THANK_YOU_URL;
      }, 900);
    });
  }
});
