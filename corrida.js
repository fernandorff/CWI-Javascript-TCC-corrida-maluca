import axios from "axios";

export async function criaPersonagem(lista, personagemID) {
  const getPersonagem = await axios.get(lista).then((response) => response);
  const personagem = getPersonagem.data[personagemID];
  personagem.posicao = 0;
  return personagem;
}

export async function criaPista(lista, pistaID) {
  const getPista = await axios.get(lista).then((response) => response);
  const pista = getPista.data[pistaID];
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

  personagens.forEach((element) => {
    corrida.participantes.push(element);
  });
  return corrida;
}

export async function executarCorrida(corrida) {
  for (let rodada = 1; rodada < 10; rodada++) {
    if (condition) {
    }

    corrida.participantes.forEach((element) => {
      switch (true) {
        case rodada <= 3:
          element.posicao += element.aceleracao;
          console.log(
            "RODADA ",
            rodada,
            "RANDANDANDAN",
            element.nome,
            element.posicao
          );
          break;

        case rodada % 4 == 0:
          element.posicao += element.drift;
          console.log(
            "RODADA ",
            rodada,
            "DORIFITOOO",
            element.nome,
            element.posicao
          );
          break;

        default:
          element.posicao += element.velocidade;
          console.log(
            "RODADA ",
            rodada,
            "VRUMMMMM",
            element.nome,
            element.posicao
          );
          break;
      }
    });
  }
}
