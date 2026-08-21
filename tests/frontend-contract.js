"use strict";

const viewports = [
    { name: "mobile-360", width: 360, height: 800 },
    { name: "mobile-390", width: 390, height: 844 },
    { name: "mobile-412", width: 412, height: 915 },
    { name: "mobile-430", width: 430, height: 932 },
    { name: "mobile-480", width: 480, height: 900 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "desktop-wide", width: 1440, height: 1000 },
    { name: "mobile-low", width: 412, height: 600 }
];

const essentialIds = {
    home: [
        "homeView", "homeDailyProgress", "homeProgressBar", "homeProgressValue",
        "homeStreakCurrent", "homeStreakBest", "homeCompletionSummary",
        "homeCompletionActions", "shareDailyResultBtn", "btnOpenIntegratedStats", "btnOpenHistory"
    ],
    classic: [
        "gameView", "searchInput", "autocompleteList", "attemptsContainer",
        "dailyEndMessage", "shareResultBtn", "backHomeBtn"
    ],
    photo: [
        "photoView", "photoSearchInput", "photoAutocompleteList", "photoImg",
        "photoDots", "photoAttemptsList", "photoEndMessage", "backHomeBtnFoto"
    ],
    moreLess: [
        "maisMenosView", "mmRefRow", "mmCandRow", "mmBtnMais", "mmBtnMenos",
        "mmRoundResult", "mmEndMessage", "backHomeBtnMM"
    ],
    lineup: [
        "escalacaoView", "escScoreGuess", "escResultadoFinal", "escLineupCard",
        "escalacaoSearchInput", "escalacaoAutocompleteList", "pitchField",
        "escalacaoFeedback", "escCompletionCard", "backHomeBtnEsc"
    ],
    modals: [
        "welcomeModal", "photoTutorialModal", "integratedStatsModal", "historyModal", "howToPlayModal",
        "btnOpenHowToPlay", "btnCloseIntegratedStats", "btnCloseHistory", "btnCloseHowToPlay",
        "historyPreviousMonth", "historyNextMonth", "historyMonthTitle",
        "historyCalendarGrid", "historyDayPlaceholder"
    ],
    navigation: [
        "btnPlayDiario", "btnPlayFoto", "btnPlayMaisMenos", "btnPlayEscalacao",
        "usefulLinksBtn", "usefulLinksWidget"
    ]
};

const dynamicClasses = {
    home: ["hidden", "is-complete", "is-not-started", "is-in-progress", "is-completed", "celebrate-once"],
    classic: ["autocomplete-active", "reveal", "correct", "partial", "wrong", "shake"],
    photo: ["active", "image-fallback", "used", "wrong-used", "correct", "wrong", "facil", "medio", "dificil"],
    moreLess: [
        "answered", "answer-correct", "answer-wrong", "revealed", "correct-answer",
        "tie", "resultado-final", "mm-round-enter", "won", "lost"
    ],
    lineup: ["dense-line", "correct", "acertou", "errou", "hidden"],
    modals: [
        "hidden", "modal-open", "autocomplete-active", "is-future", "is-before-tracking",
        "is-no-record", "is-recorded", "is-started", "is-partial", "is-complete",
        "is-today", "is-selected"
    ],
    links: ["open"]
};

const essentialCssSelectors = [
    ".hidden", ".home-progress-card.is-complete", ".home-progress-card.celebrate-once",
    ".pokedle-btn.is-in-progress", ".pokedle-btn.is-completed",
    ".cell.correct", ".cell.partial", ".cell.wrong", ".cell.reveal", ".shake",
    ".photo-img.image-fallback", ".photo-attempt-item.correct", ".photo-attempt-item.wrong",
    "#maisMenosView .mm-player-candidate.answered", "#maisMenosView .mm-round-feedback",
    "#maisMenosView.resultado-final .mm-card", "#maisMenosView .mm-result-card",
    "#escalacaoView .player-chip.dense-line", ".slot-btn.correct", ".result-status.acertou",
    ".result-status.errou", "body.modal-open .page-content", ".modal", ".autocomplete-active",
    ".history-modal-content", ".history-calendar-grid", ".history-day-cell.is-complete",
    ".history-day-cell.is-today", ".history-day-cell.is-selected"
];

const decorativeClasses = [
    "mm-round-enter", "celebrate-once", "reveal", "shake"
];

module.exports = {
    viewports,
    essentialIds,
    dynamicClasses,
    essentialCssSelectors,
    decorativeClasses
};
