"use strict";

const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { scriptSource, compileFunctions } = require("./script-harness");
const core = require("../core.js");
const classic = require("../classic-mode.js");

const root = path.join(__dirname, "..");
const jogadores = JSON.parse(fs.readFileSync(path.join(root, "jogadores.json"), "utf8"));
const nomesComFoto = JSON.parse(fs.readFileSync(path.join(root, "fotos-manifest.json"), "utf8"));
const partidas = JSON.parse(fs.readFileSync(path.join(root, "partidas.json"), "utf8"));
const fotoSet = new Set(nomesComFoto);
const poolFoto = jogadores.filter(jogador => fotoSet.has(jogador.nome));
const poolMM = poolFoto.filter(jogador => typeof jogador.jogos === "number" && Number.isFinite(jogador.jogos));

const datas = ["2025-01-01", "2025-07-09", "2026-08-25", "2027-03-12", "2028-12-31"];

const classicApi = {
    sortearJogadorDoDia: data => classic.selecionarJogadorDiario(jogadores, data, core.hashString)
};
const photoApi = compileFunctions([
    "jogadoresComFotoObjetos", "sortearJogadorFotoDoDia"
], { jogadores, JOGADORES_COM_FOTO: nomesComFoto, hashString: core.hashString });
const mmApi = compileFunctions([
    "gerarPRNG", "embaralharComSemente", "embaralharComRngMM",
    "maiorSequenciaIgualMM", "maiorSequenciaAlternadaMM", "gerarPlanoDirecoesMM",
    "direcaoComparacaoMM", "dificuldadeComparacaoMM", "atendeDificuldadeExpandidaMM",
    "construirSequenciaExataMM", "construirSequenciaComFallbackMM", "gerarDesafioMMV2",
    "gerarSequenciaMMV1"
], {
    CAMPO_STAT_MM: "jogos",
    RODADAS_MM: 10,
    PLANO_DIFICULDADES_MM: ["facil", "facil", "facil", "media", "media", "media", "media", "dificil", "dificil", "dificil"],
    jogadoresElegiveisMM: () => poolMM,
    hashString: core.hashString
});
const lineupApi = compileFunctions([
    "gerarPRNG", "embaralharComSemente", "selecionarPartidaDoDia"
], { PARTIDAS_ESCALACAO: partidas, MAX_OCULTOS_ESCALACAO: 3, hashString: core.hashString });

function fnv1a(text) {
    let hash = 0x811c9dc5;
    for (const char of text) {
        hash ^= char.charCodeAt(0);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, "0");
}

function fingerprint(items) {
    return {
        length: items.length,
        hash: fnv1a(items.join("\u001f")),
        first: items[0],
        last: items.at(-1)
    };
}

function observeDate(data) {
    const v2 = mmApi.gerarDesafioMMV2(data);
    const lineup = lineupApi.selecionarPartidaDoDia(data);
    return {
        hash: core.hashString(data),
        classic: classicApi.sortearJogadorDoDia(data).nome,
        photo: photoApi.sortearJogadorFotoDoDia(data).nome,
        mmV1: mmApi.gerarSequenciaMMV1(data).map(jogador => jogador.nome).join(" > "),
        mmV2: v2.sequencia.map(jogador => jogador.nome).join(" > "),
        mmDirections: v2.planoDirecoes.join(" > "),
        mmDifficulties: v2.planoDificuldades.join(" > "),
        mmFallbacks: v2.fallbacks.join(","),
        mmAttempts: v2.tentativasPlano,
        lineupId: lineup.id,
        hidden: lineup.jogadores_ocultos.map(jogador => jogador.nome_correto).join(" > ")
    };
}

const observed = Object.fromEntries(datas.map(data => [data, observeDate(data)]));
const observedFingerprints = {
    jogadores: fingerprint(jogadores.map(jogador => jogador.nome)),
    foto: fingerprint(poolFoto.map(jogador => jogador.nome)),
    mm: fingerprint(poolMM.map(jogador => `${jogador.nome}:${jogador.jogos}`)),
    partidas: fingerprint(partidas.map(partida => partida.id)),
    titulares: fingerprint(partidas.map(partida => `${partida.id}:${partida.titulares.map(jogador => jogador.nome).join(">")}`))
};

const expectedFingerprints = {
    jogadores: { length: 157, hash: "5be61d7b", first: "Ado", last: "Índio" },
    foto: { length: 157, hash: "5be61d7b", first: "Ado", last: "Índio" },
    mm: { length: 157, hash: "9392feb3", first: "Ado:206", last: "Índio:112" },
    partidas: { length: 9, hash: "b3a9c6ec", first: "boca-juniors-2012", last: "internacional-2005" },
    titulares: {
        length: 9,
        hash: "31208ea3",
        first: "boca-juniors-2012:Cássio>Alessandro>Chicão>Leandro Castán>Fábio Santos>Ralf>Paulinho>Danilo>Alex>Emerson Sheik>Jorge Henrique",
        last: "internacional-2005:Fábio Costa>Coelho>Marinho>Betão>Gustavo Nery>Marcelo Mattos>Wendel>Rosinei>Ricardinho>Carlos Tevez>Rafael Moura"
    }
};

const expected = {
    "2025-01-01": {
        hash: 274162049, classic: "Biro-Biro", photo: "Gil",
        mmV1: "Alessandro > Ricardinho > Ezequiel > Gilmar dos Santos Neves > Lucca > Mateus Vital > Luizinho > Neco > Flávio Minuano > Edílson Capetinha > Dinei",
        mmV2: "Wilson Mano > Fábio Santos > Vaguinho > Marcelinho Carioca > Baltazar > Zé Maria > Rivelino > Gil > Gilmar dos Santos Neves > Wladimir > Luizão",
        mmDirections: "menos > mais > menos > menos > mais > mais > menos > menos > mais > menos",
        mmDifficulties: "media > facil > media > dificil > media > dificil > dificil > media > facil > facil",
        mmFallbacks: "0,0,0,0,0,0,0,0,0,0", mmAttempts: 1,
        lineupId: "internacional-2009", hidden: "Chicão > William > Cristian"
    },
    "2025-07-09": {
        hash: 274340803, classic: "Memphis Depay", photo: "Zé Elias",
        mmV1: "Willian > Rafael Moura > Manoel > Ángel Romero > Jairo > Liedson > Bruno Henrique > Júlio César > Ramiro > Matheus Donelli > Felipe Ventura",
        mmV2: "Ezequiel > Teleco > Elias > Paolo Guerrero > Guilherme Arana > Freddy Rincón > Talles Magno > Vampeta > Del Debbio > Ángel Romero > Jô",
        mmDirections: "menos > mais > menos > menos > mais > menos > mais > mais > mais > menos",
        mmDifficulties: "dificil > dificil > facil > media > media > facil > facil > media > dificil > media",
        mmFallbacks: "0,0,0,0,0,0,0,0,0,0", mmAttempts: 1,
        lineupId: "santos-2005", hidden: "Fábio Costa > Coelho > Ricardinho"
    },
    "2026-08-25": {
        hash: 1161874333, classic: "Hugo Souza", photo: "Flávio Minuano",
        mmV1: "Freddy Rincón > Brandão > Palhinha > Grané > Junior Urso > Gilmar dos Santos Neves > Cássio > Igor Coronado > Carbone > Félix Torres > Wallace",
        mmV2: "Marcelo Djian > Baltazar > Roberto Belangero > Deivid > Luizão > Félix Torres > José Martínez > Memphis Depay > Ado > Neto > Edílson Capetinha",
        mmDirections: "mais > mais > menos > mais > menos > menos > menos > mais > mais > menos",
        mmDifficulties: "facil > media > facil > dificil > media > media > dificil > facil > dificil > media",
        mmFallbacks: "0,0,0,0,0,0,0,0,0,0", mmAttempts: 1,
        lineupId: "palmeiras-2011", hidden: "Alessandro > Leandro Castán > Wallace"
    },
    "2027-03-12": {
        hash: 2049229025, classic: "Cláudio", photo: "Marcelo Djian",
        mmV1: "Memphis Depay > Caçapava > William > Javier Mascherano > Coelho > Wilson Mano > Hugo > Biro-Biro > Ezequiel > Jadson > Pedrinho",
        mmV2: "Marcelinho Carioca > Baltazar > Idário > Paulinho > Marcelo Djian > Viola > Cabeção > Mauro > Rosinei > Memphis Depay > Edu Dracena",
        mmDirections: "menos > mais > menos > menos > mais > mais > menos > menos > menos > mais",
        mmDifficulties: "dificil > media > facil > dificil > media > media > facil > media > facil > dificil",
        mmFallbacks: "0,0,0,0,0,0,0,0,0,0", mmAttempts: 1,
        lineupId: "palmeiras-2018", hidden: "Sidcley > Ángel Romero > Clayson"
    },
    "2028-12-31": {
        hash: 2937626497, classic: "Ronaldo Giovanelli", photo: "Hugo Souza",
        mmV1: "Talles Magno > Tobias > Amílcar Barbuy > Vaguinho > Dinei > Freddy Rincón > Paulo André > Edson > Basílio > William > Jadson",
        mmV2: "Douglas > Breno Bidon > Tuffy > Paulo André > Alex Santana > Nilmar > Emerson Sheik > Marinho > Yuri Alberto > Ramiro > Danilo Avelar",
        mmDirections: "menos > mais > mais > menos > mais > mais > menos > mais > menos > menos",
        mmDifficulties: "facil > dificil > media > facil > media > facil > media > media > dificil > dificil",
        mmFallbacks: "0,0,0,0,0,0,0,0,0,0", mmAttempts: 1,
        lineupId: "palmeiras-2017", hidden: "Fágner > Camacho > Ángel Romero"
    }
};

let assertions = 0;
function equal(actual, wanted, message) {
    assertions++;
    assert.equal(actual, wanted, message);
}
function deepEqual(actual, wanted, message) {
    assertions++;
    assert.deepEqual(actual, wanted, message);
}
function matches(actual, expression, message) {
    assertions++;
    assert.match(actual, expression, message);
}

for (const [pool, value] of Object.entries(expectedFingerprints)) {
    deepEqual(observedFingerprints[pool], value, `${pool}: o conteúdo ou a ordem deste pool mudou`);
}

matches(scriptSource, /hashString\(dataStr \+ "-foto"\)/, "seed da Foto mudou");
matches(scriptSource, /hashString\(dataStr \+ "-mm"\)/, "seed do MM v1 mudou");
matches(scriptSource, /hashString\(dataStr \+ "-mm-v2"\)/, "seed do MM v2 mudou");
matches(scriptSource, /hashString\(dataStr \+ "-onze"\)/, "seed da partida do Onze Inicial mudou");
matches(scriptSource, /hashString\(dataStr \+ "-onze-slots-" \+ partida\.id\)/, "seed dos ocultos do Onze Inicial mudou");

for (const data of datas) {
    const actual = observed[data];
    const wanted = expected[data];
    equal(actual.hash, wanted.hash, `${data}: hash mudou`);
    equal(actual.classic, wanted.classic, `${data}: jogador do Clássico mudou`);
    equal(actual.photo, wanted.photo, `${data}: jogador da Foto mudou`);
    equal(actual.mmV1, wanted.mmV1, `${data}: sequência do MM v1 mudou`);
    equal(actual.mmV2, wanted.mmV2, `${data}: sequência do MM v2 mudou`);
    equal(actual.mmDirections, wanted.mmDirections, `${data}: respostas MAIS/MENOS mudaram`);
    equal(actual.mmDifficulties, wanted.mmDifficulties, `${data}: plano 3/4/3 mudou`);
    equal(actual.mmFallbacks, wanted.mmFallbacks, `${data}: fallbacks do MM v2 mudaram`);
    equal(actual.mmAttempts, wanted.mmAttempts, `${data}: tentativas de plano do MM v2 mudaram`);
    equal(actual.lineupId, wanted.lineupId, `${data}: partida do Onze Inicial mudou`);
    equal(actual.hidden, wanted.hidden, `${data}: jogadores ocultos ou sua ordem mudaram`);
}

console.log(`daily-determinism.test.js: 7 cenários, ${assertions} assertions aprovadas em ${datas.length} datas`);
