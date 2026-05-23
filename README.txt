COMO USAR

1. Crie uma pasta no seu computador:
C:\Users\mafer\OneDrive\Documentos\NoemiahAlves

2. Dentro dela, deixe assim:
NoemiahAlves
- index.html
- style.css
- script.js
- assets
  - Background Noemiah.webp
  - CAPA_noemiah_1.webp
  - Frame_1707480869_1.webp
  - Transbordar_767_1_2_1.webp
  - bg111.webp

3. Abra o index.html no navegador.

IMPORTANTE
O código usa caminhos relativos, exemplo: assets/CAPA_noemiah_1.webp.
Isso é melhor do que usar o caminho completo C:\Users\..., porque depois você poderá subir a LP para HostGator, GitHub Pages ou outro servidor sem quebrar as imagens.

PARA COLOCAR O VÍDEO VSL
No arquivo index.html, procure por:
<div class="video-placeholder">

Substitua esse bloco por um iframe do YouTube/Vimeo ou por uma tag <video>.

PARA TROCAR OS LINKS DO SYMPLA
No index.html, procure por:
https://www.sympla.com.br/

Substitua pelo link oficial do evento ou pelo link específico de cada ingresso.

SUGESTÃO PARA SYMPLA + WHATSAPP
Crie dois ingressos no Sympla:
- Ingresso Gratuito
- Ingresso VIP

Na mensagem de confirmação do Sympla, coloque:
- Link da comunidade geral para ingresso gratuito
- Link da comunidade VIP para ingresso VIP

Também é possível automatizar depois usando Pluga/Zapier/Make, se quiser separar os fluxos.
