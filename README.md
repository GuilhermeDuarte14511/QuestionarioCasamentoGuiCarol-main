# 💍 QuestionarioCasamentoGuiCarol

Formulário moderno e romântico para os convidados confirmarem presença no casamento de **Guilherme & Caroline**. O site é responsivo, tem estilo em **dark mode com Rose Gold**, animações elegantes, envio de dados para o **Google Sheets**, confetes dourados no final e experiência suave em todas as etapas.

---

## ✨ Funcionalidades

- Confirmação de presença com múltiplas perguntas
- Estilo visual: **Rose Gold + Preto** (tema do casamento)
- Barra de progresso e navegação por etapas (steps)
- Opções de bebidas, marcas e transporte coletivo
- Validações por etapa com mensagens personalizadas
- Animações com [Animate.css](https://animate.style/)
- Confete com [Canvas Confetti](https://www.kirilv.com/canvas-confetti/)
- Envio automático para uma planilha do Google Sheets
- Compatível com **mobile e desktop**
- Deploy via GitHub Pages

---

## 🛠 Tecnologias utilizadas

- HTML5 + CSS3 + JavaScript
- Bootstrap 4.5
- jQuery
- FontAwesome
- Animate.css
- Canvas Confetti
- Google Apps Script (para integração com planilha)

---

## 🔗 Deploy (GitHub Pages)

Este projeto pode ser acessado diretamente por um link público após deploy.

### 📦 Como fazer deploy no GitHub Pages

1. Suba os arquivos em um repositório público (ou privado com GitHub Pro).
2. Vá em `Settings > Pages`
3. Selecione a branch `main` e a pasta `/ (root)`
4. Acesse pela URL gerada, por exemplo:  
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
