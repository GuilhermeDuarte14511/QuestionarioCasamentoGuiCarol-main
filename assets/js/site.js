let passoAtual = 1;
const totalPassos = 4;
let localizacaoDetectada = false;

function atualizarBarra() {
  const progresso = (passoAtual / totalPassos) * 100;
  $("#barraProgresso").css("width", progresso + "%");
  $("#etapaTexto").text(`Passo ${passoAtual} de ${totalPassos}`);
}

function iniciarFormulario() {
  $('#telaBoasVindas').hide();
  $('#formulario').show();
  $('#step1').addClass('active');
  $('#barraContainer').show();
  atualizarBarra();
}

function mostrarErro(mensagem) {
  $('#mensagemErro').text(mensagem).fadeIn();
  setTimeout(() => $('#mensagemErro').fadeOut(), 4000);
}

function proximo() {
  if (passoAtual === 1) {
    const nome = $('input[name="nome"]').val().trim();
    if (nome === '') {
      mostrarErro('Você não respondeu o nome completo.');
      $('input[name="nome"]').focus();
      return;
    }
  }

  if (passoAtual === 3) {
    const selecionados = $('input[name="tipoAlcoolica"]:checked').length;
    if (selecionados === 0) {
      mostrarErro('Você não selecionou nenhuma bebida alcoólica.');
      return;
    }
  }

  if (passoAtual === 4) {
    const transporte = $('#transporte').val();
    if (!transporte) {
      mostrarErro('Você não respondeu sobre o transporte.');
      $('#transporte').focus();
      return;
    }
  }

  $(`#step${passoAtual}`).removeClass('active');
  passoAtual++;
  $(`#step${passoAtual}`).addClass('active');
  atualizarBarra();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (passoAtual === 4) verificarLocalizacaoNovamente();
}

function voltar() {
  $(`#step${passoAtual}`).removeClass('active');
  passoAtual--;
  $(`#step${passoAtual}`).addClass('active');
  atualizarBarra();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function verificaBebidas() {
  const alcool = $('#alcoolica').is(':checked');
  const naoAlcool = $('#naoAlcoolica').is(':checked');
  if (!alcool && !naoAlcool) {
    mostrarErro('Você não selecionou nenhuma opção de bebida.');
    return;
  }

  $('#step2').removeClass('active');
  if (alcool) {
    passoAtual = 3;
    $('#step3').addClass('active');
  } else {
    passoAtual = 4;
    $('#step4').addClass('active');
    verificarLocalizacaoNovamente();
  }
  atualizarBarra();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleDivisao() {
  $('#divisaoTransporte').slideToggle($('#transporte').val() === 'Sim');
}

function finalizarFake() {
  const btn = document.getElementById('btnFinalizar');
  const text = document.getElementById('textFinalizar');
  const spinner = document.getElementById('spinnerFinalizar');
  const btnVoltar = document.getElementById('btnVoltar');

  btn.disabled = true;
  btnVoltar.disabled = true;
  text.textContent = "Enviando...";
  spinner.classList.remove('d-none');

  setTimeout(() => {
    text.textContent = "Pode demorar um pouco, fique tranquilo...";
  }, 2000);

  const nome = document.getElementById('nome').value || '';
  const marca = document.getElementById('marca').value || '';
  const transporte = document.getElementById('transporte')?.value || '';
  const divisao = document.getElementById('divisao')?.value || '';

  const bebidasSelecionadas = [];
  if (document.getElementById('alcoolica')?.checked) bebidasSelecionadas.push('Alcoólica');
  if (document.getElementById('naoAlcoolica')?.checked) bebidasSelecionadas.push('Não Alcoólica');

  const tiposSelecionados = Array.from(document.querySelectorAll('input[name="tipoAlcoolica"]:checked'))
    .map(cb => cb.value);

  const data = {
    nome,
    bebidaAlcoolica: bebidasSelecionadas.join(', '),
    tipoBebida: tiposSelecionados.join(', '),
    marca,
    transporte,
    divisao
  };

  console.log("Enviando os seguintes dados para o Google Sheets: ", data);

  fetch('https://script.google.com/macros/s/AKfycbzoAxbX2ZCxaQkU6Bo4tRyGek6By0YAS1JXUBVW4Zl-phc_x3Ef_JS4X4g0H-9kFzG8/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(() => {
      console.log("Dados enviados!");
      $('#formulario').hide();
      $('#barraContainer').hide();
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d8a29d', '#ffd700', '#fff5e1']
        });
        $('#mensagemFinal').show();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 800);
    })
    .catch(error => {
      console.error("Erro final no envio:", error);
      alert("Erro ao enviar. Verifique sua conexão ou tente novamente mais tarde.");
      btn.disabled = false;
      btnVoltar.disabled = false;
      text.textContent = "Finalizar";
      spinner.classList.add('d-none');
    });
}

function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function obterLocalizacao() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(async function (position) {
    localizacaoDetectada = true;
    let local = "em pontos a definir";
    let complemento = "";

    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;

    console.log("Sua localização detectada:");
    console.log("Latitude:", userLat);
    console.log("Longitude:", userLon);

    const itapLat = -23.7175;
    const itapLon = -46.8498;
    const caraLat = -23.5225;
    const caraLon = -46.8356;

    const distanciaItap = calcularDistanciaKm(userLat, userLon, itapLat, itapLon);
    const distanciaCara = calcularDistanciaKm(userLat, userLon, caraLat, caraLon);

    console.log("Distância até Itapecerica:", distanciaItap.toFixed(2), "km");
    console.log("Distância até Carapicuíba:", distanciaCara.toFixed(2), "km");

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLon}`);
      const data = await response.json();
      console.log("Endereço aproximado via Nominatim:", data.address);
    } catch (err) {
      console.warn("Erro ao buscar endereço:", err);
    }

    if (distanciaItap <= 8) {
      local = "a partir do Jacira (Itapecerica da Serra)";
    } else if (distanciaCara <= 11) {
      local = "a partir de Carapicuíba";
    } else {
      // Se não estiver em nenhuma região próxima
      complemento = "Percebemos que você não mora tão próximo da gente (Guilherme e Carol). Caso queira algum transporte, nos chame no privado do WhatsApp para conversarmos melhor e vermos a melhor solução ❤️";
    }

    $("#textoTransporte").html(`
      Sabemos que às vezes é difícil conseguir um Uber, seja pelo horário ou pelo custo de ida e volta.<br>
      Pensando nisso, queremos oferecer um transporte coletivo com saída e retorno <strong>${local}</strong>.<br>
      A ideia é dividir o valor da locação entre os convidados que optarem por essa opção.<br>
      ${complemento ? `<em style="color: #ffb6c1;">${complemento}</em>` : ""}
    `);
  }, function (error) {
    localizacaoDetectada = false;
    console.warn("Usuário negou ou erro ao obter localização:", error);
  });
}


function verificarLocalizacaoNovamente() {
  if (!localizacaoDetectada) {
    console.log("Tentando solicitar localização novamente...");
    obterLocalizacao();
  }
}

window.onload = () => {
  $('#formulario, #mensagemFinal, #barraContainer').hide();
  obterLocalizacao();
};
