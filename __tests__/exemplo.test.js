import axios from "axios";

import {
  aliadoInimigoBuffDebuff,
  calcularVantagem,
  criaCorrida,
  criaPersonagem,
  criaPista,
  executarCorrida,
  moverPersonagens,
} from "../src/corrida.js";

describe("Suite de testes da Corrida Maluca", () => {
  const personagensURL =
    "https://gustavobuttenbender.github.io/gus.github/corrida-maluca/personagens.json";

  const pistasURL =
    "https://gustavobuttenbender.github.io/gus.github/corrida-maluca/pistas.json";

  // --- Teste 1 -- //

  it("Deve conseguir obter o corredor corretamente", async () => {
    const resposta = await criaPersonagem(personagensURL, 0);

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
    const dick = await criaPersonagem(personagensURL, 0, true, 1, true, 2);
    const rocha = await criaPersonagem(personagensURL, 1, true, 0, true, 2);
    const pavor = await criaPersonagem(personagensURL, 2, true, 0, true, 1);
    const deserto = await criaPista(pistasURL, 2);

    const corrida = await criaCorrida(deserto, dick, rocha, pavor);

    executarCorrida(corrida);

    expect(rocha.buffPosicao).toBe(3);
  });

  // --- Teste 7 --- //

  it("Deve conseguir calcular a próxima posição corretamente se estiver sob o buff de um aliado", async () => {
    const dick = await criaPersonagem(personagensURL, 0, true, 1);
    const rocha = await criaPersonagem(personagensURL, 1, true, 0);
    const F1 = await criaPista(pistasURL, 1);

    const corridaF1 = await criaCorrida(F1, dick, rocha);

    aliadoInimigoBuffDebuff(corridaF1);

    moverPersonagens(corridaF1, 0);

    expect(dick.posicao).toBe(8);
  });

  // --- Teste 8 --- //

  it("Deve conseguir calcular a próxima posição corretamente se estiver sob o debuff de um inimigo", async () => {
    const dick = await criaPersonagem(personagensURL, 0, false, 0, true, 1);
    const rocha = await criaPersonagem(personagensURL, 1, false, 0, false, 0);
    const F1 = await criaPista(pistasURL, 1);

    const corridaF1 = await criaCorrida(F1, dick, rocha);

    aliadoInimigoBuffDebuff(corridaF1);

    moverPersonagens(corridaF1, 0);

    expect(dick.posicao).toBe(4);
  });

  //  --- Teste 9 --- //

  it("Deve conseguir completar uma corrida com um vencedor", async () => {
    const dick = await criaPersonagem(personagensURL, 0, true, 1, true, 2);
    const rocha = await criaPersonagem(personagensURL, 1, true, 0, true, 2);
    const pavor = await criaPersonagem(personagensURL, 2, true, 0, true, 1);
    const deserto = await criaPista(pistasURL, 2);

    const corrida = await criaCorrida(deserto, dick, rocha, pavor);

    const vencedor = await executarCorrida(corrida);

    expect(vencedor.nome).toBe("Irmãos Pavor");
  });

  // --- Teste 10 --- //

  it("Deve conseguir criar corredor corretamente somente com aliado", async () => {
    const dick = await criaPersonagem(personagensURL, 0, true, 1);
    expect(dick.inimigo).toBe("");
  });

  // --- Teste 11 --- //

  it("Deve conseguir criar corredor corretamente somente com inimigo", async () => {
    const dick = await criaPersonagem(personagensURL, 0, false, 1, true, 1);
    expect(dick.aliado).toBe("");
  });

  // --- Teste 12 --- //

  it("Deve conseguir criar corredor corretamente com aliado e inimigo", async () => {
    const dick = await criaPersonagem(personagensURL, 0, true, 1, true, 2);
    expect(dick.aliado + " e " + dick.inimigo).toBe(
      "Irmãos Rocha e Irmãos Pavor"
    );
  });

  // --- Teste 13 --- //

  it("Deve conseguir calcular as novas posições corretamente de uma rodada para a próxima", async () => {
    const dick = await criaPersonagem(personagensURL, 0, false, 0, true, 1);
    const rocha = await criaPersonagem(personagensURL, 1, false, 0, false, 0);
    const F1 = await criaPista(pistasURL, 1);

    const corridaF1 = await criaCorrida(F1, dick, rocha);

    aliadoInimigoBuffDebuff(corridaF1);

    moverPersonagens(corridaF1, 0);

    console.log(dick.posicao, rocha.posicao);

    expect(dick.posicao + " - " + rocha.posicao).toBe("4 - 2");
  });

  /// --- Teste 14 --- //

  it("Deve impedir que corredor se mova negativamente mesmo se o calculo de velocidade seja negativo", async () => {
    const dick = await criaPersonagem(personagensURL, 0, false, 0, false, 0);
    const rocha = await criaPersonagem(personagensURL, 1, false, 0, true, 0);
    const F1 = await criaPista(pistasURL, 1);

    const corridaF1 = await criaCorrida(F1, dick, rocha);

    aliadoInimigoBuffDebuff(corridaF1);

    moverPersonagens(corridaF1, 0);

    expect(rocha.posicao).toBe(0);
  });

  it("Deve impedir que o Dick Vigarista vença a corrida se estiver a uma rodada de ganhar", async () => {
    const dick = await criaPersonagem(
      personagensURL,
      0,
      false,
      Math.floor(Math.random() * 10),
      false,
      0
    );
    const rocha = await criaPersonagem(personagensURL, 1, false, 0, true, 0);
    const F1 = await criaPista(pistasURL, 1);

    const corridaF1 = await criaCorrida(F1, dick, rocha);

    const vencedor = await executarCorrida(corridaF1);

    expect(vencedor.nome).toBe("Irmãos Rocha");
  });

  it("Corrida totalmente aleatoria", async () => {
    const dickVigarista = await criaPersonagem(
      personagensURL,
      0,
      true,
      Math.floor(Math.random() * 11),
      true,
      Math.floor(Math.random() * 11)
    );

    const irmaosRocha = await criaPersonagem(
      personagensURL,
      1,
      true,
      Math.floor(Math.random() * 11),
      true,
      Math.floor(Math.random() * 11)
    );
    const irmaosPavor = await criaPersonagem(
      personagensURL,
      2,
      true,
      Math.floor(Math.random() * 11),
      true,
      Math.floor(Math.random() * 11)
    );
    const professorAereo = await criaPersonagem(
      personagensURL,
      3,
      true,
      Math.floor(Math.random() * 11),
      true,
      Math.floor(Math.random() * 11)
    );
    const baraoVermelho = await criaPersonagem(
      personagensURL,
      4,
      true,
      Math.floor(Math.random() * 11),
      true,
      Math.floor(Math.random() * 11)
    );
    const penelopeCharmosa = await criaPersonagem(
      personagensURL,
      5,
      true,
      Math.floor(Math.random() * 11),
      true,
      Math.floor(Math.random() * 11)
    );
    const sargentoBombarda = await criaPersonagem(
      personagensURL,
      6,
      true,
      Math.floor(Math.random() * 11),
      true,
      Math.floor(Math.random() * 11)
    );
    const quadrilhaDaMorte = await criaPersonagem(
      personagensURL,
      7,
      true,
      Math.floor(Math.random() * 11),
      true,
      Math.floor(Math.random() * 11)
    );
    const tioTomas = await criaPersonagem(
      personagensURL,
      8,
      true,
      Math.floor(Math.random() * 11),
      true,
      Math.floor(Math.random() * 11)
    );
    const peterPerfeito = await criaPersonagem(
      personagensURL,
      9,
      true,
      Math.floor(Math.random() * 11),
      true,
      Math.floor(Math.random() * 11)
    );
    const rufusLenhador = await criaPersonagem(
      personagensURL,
      10,
      true,
      Math.floor(Math.random() * 11),
      true,
      Math.floor(Math.random() * 11)
    );

    const pistaAleatoria = await criaPista(
      pistasURL,
      Math.floor(Math.random() * 8)
    );

    const corridaAleatoria = await criaCorrida(
      pistaAleatoria,
      dickVigarista,
      irmaosRocha,
      irmaosPavor,
      professorAereo,
      baraoVermelho,
      penelopeCharmosa,
      sargentoBombarda,
      quadrilhaDaMorte,
      tioTomas,
      peterPerfeito,
      rufusLenhador
    );

    const vencedor = await executarCorrida(corridaAleatoria);

    console.log(`Grande Premio da ${pistaAleatoria.nome}! 
    O vencedor é -> ${vencedor.nome}`);
  });
});
