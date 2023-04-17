const App = {
  $: {
    menu: document.querySelector(`[data-id="menu"]`),
    menuItems: document.querySelector(`[data-id="menu-items"]`),
    resetBtn: document.querySelector(`[data-id="reset-btn"]`),
    newRoundBtn: document.querySelector(`[data-id="new-round-btn"]`),
    squares: document.querySelectorAll(`[data-id="square"]`),
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

    App.$.squares.forEach((square) => {
      square.addEventListener("click", (evt) => {
        console.log(evt.target.id);
      });
    });
  },
};

window.addEventListener("load", App.init);
