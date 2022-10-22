import axios from "axios";

import {
  calcularVantagem,
  criaCorrida,
  criaPersonagem,
  criaPista,
  executarCorrida,
} from "../corrida.js";

describe("Suite de testes da Corrida Maluca", () => {
  const personagensURL =
    "https://gustavobuttenbender.github.io/gus.github/corrida-maluca/personagens.json";

  const pistasURL =
    "https://gustavobuttenbender.github.io/gus.github/corrida-maluca/pistas.json";

  // Deve conseguir calcular o buff de posição de pista para 3 corredores
  // Deve conseguir calcular a próxima posição corretamente se estiver sob o buff de um aliado
  // Deve conseguir calcular a próxima posição corretamente se estiver sob o debuff de um inimigo
  // Deve conseguir completar uma corrida com um vencedor
  // Deve conseguir criar corredor corretamente somente com aliado
  // Deve conseguir criar corredor corretamente somente com inimigo
  // Deve conseguir criar corredor corretamente com aliado e inimigo
  // Deve conseguir calcular as novas posições corretamente de uma rodada para a próxima
  // Deve impedir que corredor se mova negativamente mesmo se o calculo de velocidade seja negativo
  // Deve impedir que o Dick Vigarista vença a corrida se estiver a uma rodada de ganhar

  // --- Teste 1 -- //

  it("Deve conseguir obter o corredor corretamente", async () => {
    const resposta = await criaPersonagem(personagensURL, 0, 1, 2, 3, 4);

    expect(resposta).toMatchObject({
      id: 1,
      nome: "Dick Vigarista",
      velocidade: 5,
      drift: 2,
      aceleracao: 4,
      vantagem: "CIRCUITO",
    });
  });

  // --- Teste 2 -- //

  it("Deve conseguir obter a pista corretamente", async () => {
    const resposta = await criaPista(pistasURL, 0);

    expect(resposta).toMatchObject({
      id: 1,
      nome: "Himalaia",
      tipo: "MONTANHA",
      descricao:
        "Uma montanha nevada, os corredores devem dar uma volta inteira nela, como existe muita neve eles terão dificuldade em enxergar",
      tamanho: 30,
      debuff: -2,
      posicoesBuffs: [6, 17],
    });
  });

  // --- Teste 3 --- //

  it("Deve conseguir calcular a vantagem de tipo pista corretamente", async () => {
    const dick = await criaPersonagem(personagensURL, 0);
    const f1 = await criaPista(pistasURL, 1);
    const resposta = await calcularVantagem(dick, f1);

    expect(resposta).toBe(2);
  });

  // --- Teste 4 --- //

  it("Deve conseguir calcular o debuff de pista corretamente", async () => {
    const dick = await criaPersonagem(personagensURL, 0);
    const monstanha = await criaPista(pistasURL, 0);
    const resposta = await calcularVantagem(dick, monstanha);

    expect(resposta).toBe(-2);
  });

  // --- Teste 5 --- //

  it("Deve criar a corrida com qualquer numero de participantes", async () => {
    const dick = await criaPersonagem(personagensURL, 0);
    const rocha = await criaPersonagem(personagensURL, 1);
    const pavor = await criaPersonagem(personagensURL, 2);
    const deserto = await criaPista(pistasURL, 2);

    const resposta = await criaCorrida(deserto, dick, rocha, pavor);

    expect(resposta.participantes).toMatchObject([
      {
        id: 1,
        nome: "Dick Vigarista",
        velocidade: 5,
        drift: 2,
        aceleracao: 4,
        vantagem: "CIRCUITO",
      },
      {
        id: 2,
        nome: "Irmãos Rocha",
        velocidade: 5,
        drift: 2,
        aceleracao: 3,
        vantagem: "MONTANHA",
      },
      {
        id: 3,
        nome: "Irmãos Pavor",
        velocidade: 4,
        drift: 2,
        aceleracao: 3,
        vantagem: "DESERTO",
      },
    ]);
  });

  // --- Teste 6 --- //

  it("Deve conseguir calcular o buff de posição de pista para 3 corredores", async () => {
    const dick = await criaPersonagem(personagensURL, 0);
    const rocha = await criaPersonagem(personagensURL, 1);
    const pavor = await criaPersonagem(personagensURL, 2);
    const deserto = await criaPista(pistasURL, 2);

    const corrida = await criaCorrida(deserto, dick, rocha, pavor);

    executarCorrida(corrida);
  });
});
