import axios from "axios";

export async function criaPersonagem(lista, personagemID) {
  const getPersonagem = await axios.get(lista).then((response) => response);
  const personagem = getPersonagem.data[personagemID];
  personagem.posicao = 0;
  personagem.buff = 0;
  return personagem;
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

  personagens.forEach((elementPersonagem) => {
    corrida.participantes.push(elementPersonagem);
  });
  return corrida;
}

export async function executarCorrida(corrida) {
  for (let rodada = 1; rodada < 12; rodada++) {
    corrida.buffs.forEach((elementBuff) => {
      let buffouAlguem = false;
      corrida.participantes.forEach((elementPersonagem) => {
        if (elementBuff.buffados.includes(elementPersonagem.nome) == false) {
          if (elementPersonagem.posicao >= elementBuff.posicao) {
            elementBuff.buffados.push(elementPersonagem.nome);
            elementPersonagem.buff += elementBuff.valor;
            buffouAlguem = true;
          }
        }
      });
      if (buffouAlguem) {
        elementBuff.valor += 1;
      }
    });

    console.log("buffados: ", corrida.buffs);

    corrida.participantes.forEach((elementPersonagem) => {
      switch (true) {
        case rodada <= 3:
          elementPersonagem.posicao +=
            elementPersonagem.aceleracao + elementPersonagem.buff;
          console.table([
            [
              elementPersonagem.nome,
              `Rodada: ${rodada}`,
              "Acelerando",
              `Posicao: ${elementPersonagem.posicao}`,
              `Buff: ${elementPersonagem.buff}`,
            ],
          ]);
          break;

        case rodada % 4 == 0:
          elementPersonagem.posicao +=
            elementPersonagem.drift + elementPersonagem.buff;
          console.table([
            [
              elementPersonagem.nome,
              `Rodada: ${rodada}`,
              "Drift",
              `Posicao: ${elementPersonagem.posicao}`,
              `Buff: ${elementPersonagem.buff}`,
            ],
          ]);
          break;

        default:
          elementPersonagem.posicao +=
            elementPersonagem.velocidade + elementPersonagem.buff;
          console.table([
            [
              elementPersonagem.nome,
              `Rodada: ${rodada}`,
              "Velocidade",
              `Posicao: ${elementPersonagem.posicao}`,
              `Buff: ${elementPersonagem.buff}`,
            ],
          ]);
          break;
      }
    });
  }
}
