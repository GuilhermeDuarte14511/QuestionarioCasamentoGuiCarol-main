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
  const transporte = $('#transporte').val();
  if (transporte === 'Sim') {
    $('#divisaoTransporte').slideDown();
    verificarLocalizacaoNovamente();
  } else {
    $('#divisaoTransporte').slideUp();
  }
}

function finalizarFake() {
  const transporte = $('#transporte').val();
  if (!transporte) {
    mostrarErro('Por favor, selecione se deseja ou não transporte.');
    $('#transporte').focus();
    return;
  }

  if (transporte === "Sim") {
    const divisao = $('#divisao').val();
    if (!divisao) {
      mostrarErro('Por favor, selecione se aceita ou não dividir o valor do transporte.');
      $('#divisao').focus();
      return;
    }
  }

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


  fetch('https://script.google.com/macros/s/AKfycbzoAxbX2ZCxaQkU6Bo4tRyGek6By0YAS1JXUBVW4Zl-phc_x3Ef_JS4X4g0H-9kFzG8/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(() => {
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

async function obterLocalizacao() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(async function (position) {
    localizacaoDetectada = true;

    // Coordenadas de teste (Taubaté)
   const userLat = position.coords.latitude;
   const userLon = position.coords.longitude;

    // Coordenadas de referência
    const jaciraLat = -23.7175;
    const jaciraLon = -46.8498;
    const caraLat = -23.5225;
    const caraLon = -46.8356;

    const distanciaJacira = calcularDistanciaKm(userLat, userLon, jaciraLat, jaciraLon);
    const distanciaCara = calcularDistanciaKm(userLat, userLon, caraLat, caraLon);

    const urlNominatim = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLon}`;

    try {
      const response = await fetch(urlNominatim);
      const data = await response.json();
    } catch (err) {
      console.warn("Erro ao buscar endereço:", err);
    }

    if (distanciaJacira <= 28) {
      $("#textoTransporte").html(`
        Sabemos que às vezes é difícil conseguir um Uber, seja pelo horário ou pelo custo de ida e volta.<br>
        Pensando nisso, queremos oferecer um transporte coletivo com saída e retorno <strong>a partir do Jacira (Itapecerica da Serra)</strong>.<br>
        A ideia é dividir o valor da locação entre os convidados que optarem por essa opção.
      `);
    } else if (distanciaCara <= 15) {
      $("#textoTransporte").html(`
        Sabemos que às vezes é difícil conseguir um Uber, seja pelo horário ou pelo custo de ida e volta.<br>
        Pensando nisso, queremos oferecer um transporte coletivo com saída e retorno <strong>a partir de Carapicuíba</strong>.<br>
        A ideia é dividir o valor da locação entre os convidados que optarem por essa opção.
      `);
    } else {
      $("#textoTransporte").html(`
        Sabemos que às vezes é difícil conseguir um Uber, seja pelo horário ou pelo custo de ida e volta.<br>
        Infelizmente, você está um pouco mais distante dos pontos principais de saída, mas queremos muito ajudar!<br>
        <strong>Fale com a gente no WhatsApp</strong> e veremos juntos a melhor forma de garantir seu transporte com carinho. 💕
      `);
    }
  }, function (error) {
    localizacaoDetectada = false;
    console.warn("Usuário negou ou erro ao obter localização:", error);
  });
}

// Função auxiliar para calcular distância em KM
function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}




function verificarLocalizacaoNovamente() {
  if (!localizacaoDetectada) {
    obterLocalizacao();
  }
}

window.onload = () => {
  $('#formulario, #mensagemFinal, #barraContainer').hide();
  obterLocalizacao();
};
