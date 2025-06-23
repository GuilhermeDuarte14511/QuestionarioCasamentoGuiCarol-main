let passoAtual = 1;
    const totalPassos = 4;

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

        // Desabilita botões e mostra o loading
        btn.disabled = true;
        btnVoltar.disabled = true;
        text.textContent = "Enviando...";
        spinner.classList.remove('d-none');

        // Troca texto após 2s para mensagem mais amigável
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
            // Reabilita botões em caso de erro
            btn.disabled = false;
            btnVoltar.disabled = false;
            text.textContent = "Finalizar";
            spinner.classList.add('d-none');
        });
    }



    async function obterLocalizacao() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) {
          let local = "em pontos a definir";
          try {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            const cidade = (data.address.city || data.address.town || data.address.village || data.address.suburb || "").toLowerCase();
            if (cidade.includes("itapecerica") || cidade.includes("jacira")) local = "a partir do Jacira (Itapecerica da Serra)";
            else if (cidade.includes("carapicuíba") || cidade.includes("carapicui")) local = "a partir de Carapicuíba";
          } catch {}
          $("#textoTransporte").text(`Sabemos que às vezes é difícil conseguir um Uber. Pensando nisso, queremos oferecer um transporte coletivo com saída e retorno ${local}. A ideia é dividir o valor da locação entre os convidados que optarem por essa opção. Você toparia participar dessa divisão?`);
        });
      }
    }

    window.onload = () => {
      $('#formulario, #mensagemFinal, #barraContainer').hide();
      obterLocalizacao();
    };