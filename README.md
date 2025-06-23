# 💍 QuestionarioCasamentoGuiCarol

Formulário moderno e romântico para os convidados confirmarem presença no casamento de **Guilherme & Caroline**.

O site é responsivo, tem estilo em **dark mode com Rose Gold**, animações elegantes, envio de dados para o **Google Sheets**, confetes dourados no final e experiência suave em todas as etapas.

---

## ✨ Funcionalidades

- Confirmação de presença com múltiplas perguntas
- Estilo visual: **Rose Gold + Preto** (tema oficial do casamento)
- Barra de progresso animada entre etapas (steps)
- Escolha de bebidas (alcoólicas e não alcoólicas)
- Marcas preferidas para bebidas alcoólicas
- Detecção automática de localização para oferecer transporte coletivo (Itapecerica ou Carapicuíba)
- Mensagem especial se o convidado estiver fora da região
- Validações de campos por etapa com mensagens personalizadas
- Botão "Finalizar" só habilita após selecionar transporte
- Animações suaves com [Animate.css](https://animate.style/)
- Efeito de confetes dourados ao final com [Canvas Confetti](https://www.kirilv.com/canvas-confetti/)
- Integração com **Google Sheets** via API pública (Apps Script)
- Design 100% responsivo (mobile & desktop)
- Deploy simples via GitHub Pages

---

## 🛠 Tecnologias utilizadas

- HTML5 + CSS3 + JavaScript (Vanilla)
- [Bootstrap 5.3.3](https://getbootstrap.com/)
- [jQuery](https://jquery.com/)
- [FontAwesome 6](https://fontawesome.com/)
- [Animate.css](https://animate.style/)
- [Canvas Confetti](https://www.kirilv.com/canvas-confetti/)
- Google Apps Script (para integração com planilha)

---

## 🔗 Deploy (GitHub Pages)

Este projeto pode ser publicado diretamente via GitHub Pages.

### 📦 Como fazer deploy

1. Crie um repositório no GitHub com os arquivos do projeto.
2. Acesse `Settings > Pages`.
3. Em “Source”, selecione a branch `main` e pasta `/ (root)`.
4. O GitHub irá gerar uma URL como:  
   `https://seunome.github.io/QuestionarioCasamentoGuiCarol/`

---

## 📋 Como configurar com sua planilha

### 1. Crie uma planilha no Google Sheets

- Nomeie a aba como `Respostas`

### 2. Vá para `Extensões > Apps Script`

Cole este código no `Code.gs`:

```javascript
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Respostas");
  sheet.appendRow([data.nome, data.bebidaAlcoolica, data.tipoBebida, data.marca, data.transporte, data.divisao, new Date()]);
  return ContentService.createTextOutput("Dados recebidos com sucesso").setMimeType(ContentService.MimeType.TEXT);
}
