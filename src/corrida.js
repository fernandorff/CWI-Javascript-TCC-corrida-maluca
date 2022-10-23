import axios from "axios";

export async function criaPersonagem(
  lista,
  personagemID,
  aliadoCheck,
  aliadoID,
  inimigoCheck,
  inimigoID
) {
  const getPersonagem = await axios.get(lista).then((response) => response);
  const personagem = getPersonagem.data[personagemID];

  personagem.posicao = 0;
  personagem.aliado = "";
  personagem.inimigo = "";
  personagem.buffAliado = 0;
  personagem.debuffInimigo = 0;
  personagem.buffPosicao = 0;
  personagem.buffDebuffPista = 0;

  if (typeof aliadoID !== "undefined") {
    if (personagemID !== aliadoID && aliadoCheck) {
      personagem.aliado = getPersonagem.data[aliadoID].nome;
    }
  }
  if (typeof aliadoID !== "undefined") {
    if (personagemID !== inimigoID && inimigoCheck) {
      personagem.inimigo = getPersonagem.data[inimigoID].nome;
    }
  }

  return personagem;
}

function buffTotal(personagem) {
  let total =
    personagem.buffAliado +
    personagem.debuffInimigo +
    personagem.buffDebuffPista +
    personagem.buffPosicao;

  return total;
}

export async function criaPista(lista, pistaID) {
  const getPista = await axios.get(lista).then((response) => response);
  const pista = getPista.data[pistaID];
  pista.buffs = [];
  pista.posicoesBuffs.forEach((element) => {
    pista.buffs.push({ posicao: element, valor: 0, buffados: [] });
  });
  return pista;
}

export async function calcularVantagem(personagem, pista) {
  if (personagem.vantagem == pista.tipo) {
    return 2;
  }
  return pista.debuff;
}

export async function criaCorrida(pista, ...personagens) {
  let corrida = pista;
  corrida.participantes = [];

  personagens.forEach(async (elementPersonagem) => {
    elementPersonagem.buffDebuffPista = await calcularVantagem(
      elementPersonagem,
      pista
    );
    corrida.participantes.push(elementPersonagem);
  });
  return corrida;
}

async function buffPosicaoCheck(corrida) {
  corrida.buffs.forEach((elementBuff) => {
    let buffouAlguem = false;
    corrida.participantes.forEach((elementPersonagem) => {
      if (elementBuff.buffados.includes(elementPersonagem.nome) == false) {
        if (elementPersonagem.posicao >= elementBuff.posicao) {
          elementBuff.buffados.push(elementPersonagem.nome);
          elementPersonagem.buffPosicao += elementBuff.valor;
          buffouAlguem = true;
        }
      }
    });
    if (buffouAlguem) {
      elementBuff.valor += 1;
    }
  });

  console.log("buffados: ", corrida.buffs);
}

export async function aliadoInimigoBuffDebuff(corrida) {
  corrida.participantes.forEach((ele1) => {
    ele1.buffAliado = 0;
    ele1.debuffInimigo = 0;
    corrida.participantes.forEach((ele2) => {
      if (
        ele1.posicao >= ele2.posicao - 2 &&
        ele1.posicao <= ele2.posicao + 2
      ) {
        if (ele1.aliado == ele2.nome) {
          ele1.buffAliado = 2;
        }
        if (ele1.inimigo == ele2.nome) {
          ele1.debuffInimigo = -2;
        }
      }
    });
  });
}

export async function moverPersonagens(corrida, rodada) {
  corrida.participantes.forEach((elementPersonagem) => {
    switch (true) {
      case rodada <= 3:
        let aceleracao =
          elementPersonagem.aceleracao + buffTotal(elementPersonagem);
        if (aceleracao < 0) {
          aceleracao = 0;
        }
        console.table([
          [
            elementPersonagem.nome,
            `Rodada: ${rodada}`,
            `Acelerando -> ${aceleracao}`,
            `Posicao: ${elementPersonagem.posicao}`,
            `Aliado: ${elementPersonagem.aliado}`,
            `Inimigo: ${elementPersonagem.inimigo}`,
            `BuffPosicao: ${elementPersonagem.buffPosicao}`,
            `BuffPista: ${elementPersonagem.buffDebuffPista}`,
            `BuffAliado: ${elementPersonagem.buffAliado}`,
            `DebuffInimigo: ${elementPersonagem.debuffInimigo}`,
            `BfTotal: ${buffTotal(elementPersonagem)}`,
          ],
        ]);
        elementPersonagem.posicao += aceleracao;

        break;

      case rodada % 4 == 0:
        let drift = elementPersonagem.drift + buffTotal(elementPersonagem);
        if (drift < 0) {
          drift = 0;
        }
        console.table([
          [
            elementPersonagem.nome,
            `Rodada: ${rodada}`,
            `Drift -> ${drift}`,
            `Posicao: ${elementPersonagem.posicao}`,
            `Aliado: ${elementPersonagem.aliado}`,
            `Inimigo: ${elementPersonagem.inimigo}`,
            `BuffPosicao: ${elementPersonagem.buffPosicao}`,
            `BuffPista: ${elementPersonagem.buffDebuffPista}`,
            `BuffAliado: ${elementPersonagem.buffAliado}`,
            `DebuffInimigo: ${elementPersonagem.debuffInimigo}`,
            `BfTotal: ${buffTotal(elementPersonagem)}`,
          ],
        ]);
        elementPersonagem.posicao += drift;

        break;

      default:
        let velocidade =
          elementPersonagem.velocidade + buffTotal(elementPersonagem);
        if (velocidade < 0) {
          velocidade = 0;
        }
        console.table([
          [
            elementPersonagem.nome,
            `Rodada: ${rodada}`,
            `velocidade -> ${velocidade}`,
            `Posicao: ${elementPersonagem.posicao}`,
            `Aliado: ${elementPersonagem.aliado}`,
            `Inimigo: ${elementPersonagem.inimigo}`,
            `BuffPosicao: ${elementPersonagem.buffPosicao}`,
            `BuffPista: ${elementPersonagem.buffDebuffPista}`,
            `BuffAliado: ${elementPersonagem.buffAliado}`,
            `DebuffInimigo: ${elementPersonagem.debuffInimigo}`,
            `BfTotal: ${buffTotal(elementPersonagem)}`,
          ],
        ]);
        elementPersonagem.posicao += velocidade;

        break;
    }
  });
}

export async function executarCorrida(corrida) {
  let fimDaCorrida = false;
  let rodada = 1;

  while (fimDaCorrida == false) {
    buffPosicaoCheck(corrida);
    aliadoInimigoBuffDebuff(corrida);
    moverPersonagens(corrida, rodada);
    rodada += 1;
    corrida.participantes.forEach((elementPersonagem) => {
      if (
        elementPersonagem.posicao >= corrida.tamanho &&
        elementPersonagem.nome != "Dick Vigarista"
      ) {
        fimDaCorrida = true;
      }
    });
  }

  let vencedor;
  corrida.participantes.forEach((elementPersonagem) => {
    if (
      elementPersonagem.posicao >= corrida.tamanho &&
      elementPersonagem.nome != "Dick Vigarista"
    ) {
      vencedor = elementPersonagem;
      if (elementPersonagem.posicao > vencedor.posicao) {
        vencedor = elementPersonagem;
      }
    }
  });
  console.log(vencedor);

  return vencedor;
}
