/*
  POSTCARD RALLY DATA
  -------------------
  Keep this EMPTY on public GitHub until the space list is officially released.
  One object = one circle, not one physical space. This supports joint spaces and 2 GETs at one space.

  Example:
  {
    id: "a12a-awase",
    space: "A12a",
    circle: "18%",
    name: "awase",
    categories: ["小説"],
    comment: "現パロ新刊あります！",
    image: "./assets/images/circles/a12a.jpg",
    x: "https://x.com/...",
    pixiv: "https://www.pixiv.net/users/...",
    rally: true
  }
*/
window.CYNS_CIRCLES = [];

window.CYNS_RALLY_CONFIG = {
  thresholds: [5, 10, 15],
  rewardLabel: "BONUS POSTCARD GACHA ×1",
  playsPerReward: 1,
  postcardsPerPlay: 2
};
