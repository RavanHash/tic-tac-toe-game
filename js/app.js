import View from "./view.js";
import Store from "./store.js";

const App = {
  $: {
    menu: document.querySelector(`[data-id="menu"]`),
    menuItems: document.querySelector(`[data-id="menu-items"]`),
    resetBtn: document.querySelector(`[data-id="reset-btn"]`),
    newRoundBtn: document.querySelector(`[data-id="new-round-btn"]`),
    squares: document.querySelectorAll(`[data-id="square"]`),
    modal: document.querySelector(`[data-id="modal"]`),
    modalText: document.querySelector(`[data-id="modal-text"]`),
    modalBtn: document.querySelector(`[data-id="modal-btn"]`),
    turn: document.querySelector(`[data-id= "turn"]`),
  },

  state: {
    moves: [],
  },

  getGameStatus(moves) {
    const playerOneMoves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.squareId);
    const playerTwoMoves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.squareId);

    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    let winner = null;

    winningPatterns.forEach((pattern) => {
      const playerOneWins = pattern.every((value) =>
        playerOneMoves.includes(value)
      );
      const playerTwoWins = pattern.every((value) =>
        playerTwoMoves.includes(value)
      );

      if (playerOneWins) winner = 1;
      if (playerTwoWins) winner = 2;
    });

    return {
      status: moves.length === 9 || winner != null ? "complete" : "in-progress",
      winner,
    };
  },

  init() {
    App.registerEventListeners();
  },

  registerEventListeners() {
    App.$.menu.addEventListener("click", (evt) => {
      App.$.menuItems.classList.toggle("hidden");
    });

    App.$.resetBtn.addEventListener("click", (evt) => {
      console.log("Reset");
    });

    App.$.newRoundBtn.addEventListener("click", (evt) => {
      console.log("New Round");
    });

    App.$.modalBtn.addEventListener("click", (evt) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => square.replaceChildren());
      App.$.modal.classList.add("hidden");
    });

    App.$.squares.forEach((square) => {
      square.addEventListener("click", (evt) => {
        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };

        if (hasMove(+square.id)) {
          return;
        }

        const lastMove = App.state.moves.at(-1);
        const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
        const currentPlayer =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerId);
        const nextPlayer = getOppositePlayer(currentPlayer);
        const turnLabel = document.createElement("p");

        const squareIcon = document.createElement("i");
        const turnIcon = document.createElement("i");
        turnLabel.innerText = `Player ${nextPlayer}, you are up!`;

        if (currentPlayer === 1) {
          squareIcon.classList.add("fa-solid", "fa-x", "turquoise");
          turnIcon.classList.add("fa-solid", "fa-o", "yellow");
          turnLabel.classList = "yellow";
        } else {
          squareIcon.classList.add("fa-solid", "fa-o", "yellow");
          turnIcon.classList.add("fa-solid", "fa-x", "turquoise");
          turnLabel.classList = "turquoise";
        }

        App.$.turn.replaceChildren(turnIcon, turnLabel);

        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });

        square.replaceChildren(squareIcon);

        const game = App.getGameStatus(App.state.moves);

        if (game.status === "complete") {
          App.$.modal.classList.remove("hidden");

          let message = "";
          if (game.winner) {
            message = `Player ${game.winner} wins!`;
          } else {
            message = `Tie game...`;
          }
          App.$.modalText.textContent = message;
        }
      });
    });
  },
};

const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];

function init() {
  const view = new View();
  const store = new Store(players);

  console.log(store.game);

  view.bindGameResetEvent((event) => {
    view.closeAll();
    store.reset();
    view.clearMoves();
    view.setTurnIndicator(store.game.currentPlayer);
  });
  view.bindNewRoundEvent((event) => {
    console.log(event);
  });
  view.bindPlayerMoveEvent((square) => {
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) {
      return;
    }

    view.handlePlayerMove(square, store.game.currentPlayer);

    store.playerMove(+square.id);

    if (store.game.status.isComplete) {
      view.openModal(
        store.game.status.winner
          ? `${store.game.status.winner.name} wins!`
          : "Tie..."
      );

      return;
    }

    view.setTurnIndicator(store.game.currentPlayer);
  });
}

window.addEventListener("load", init);
