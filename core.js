(function (root, factory) {
    const api = factory();
    if (typeof module === "object" && module.exports) module.exports = api;
    if (root) root.TimaodleCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    function formatarDataLocal(data) {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");
        return `${ano}-${mes}-${dia}`;
    }

    function dataCivilValida(data) {
        if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
        const [ano, mes, dia] = data.split("-").map(Number);
        const conferida = new Date(Date.UTC(ano, mes - 1, dia));
        return conferida.getUTCFullYear() === ano
            && conferida.getUTCMonth() === mes - 1
            && conferida.getUTCDate() === dia;
    }

    function componentesDataCivil(data) {
        if (!dataCivilValida(data)) return null;
        const [year, month, day] = data.split("-").map(Number);
        return { year, month, day };
    }

    function criarDataCivilString(year, month, day) {
        if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
        const data = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return dataCivilValida(data) ? data : null;
    }

    function compararDatasCivis(dataA, dataB) {
        if (!dataCivilValida(dataA) || !dataCivilValida(dataB)) return null;
        return dataA === dataB ? 0 : dataA < dataB ? -1 : 1;
    }

    function diasNoMesCivil(year, month) {
        if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) return 0;
        return new Date(Date.UTC(year, month, 0)).getUTCDate();
    }

    function deslocamentoPrimeiraSemanaCivil(year, month) {
        if (diasNoMesCivil(year, month) === 0) return null;
        const diaDaSemana = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
        return (diaDaSemana + 6) % 7;
    }

    function moverMesCivil(year, month, deslocamento) {
        if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12
            || !Number.isInteger(deslocamento)) return null;
        const data = new Date(Date.UTC(year, month - 1 + deslocamento, 1));
        return { year: data.getUTCFullYear(), month: data.getUTCMonth() + 1 };
    }

    function moverDataCivil(data, deslocamento) {
        const civil = componentesDataCivil(data);
        if (!civil || !Number.isInteger(deslocamento)) return null;
        const destino = new Date(Date.UTC(civil.year, civil.month - 1, civil.day + deslocamento));
        return criarDataCivilString(destino.getUTCFullYear(), destino.getUTCMonth() + 1, destino.getUTCDate());
    }

    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
        }
        return hash;
    }

    return {
        formatarDataLocal, dataCivilValida, componentesDataCivil, criarDataCivilString,
        compararDatasCivis, diasNoMesCivil, deslocamentoPrimeiraSemanaCivil,
        moverMesCivil, moverDataCivil, hashString
    };
});
