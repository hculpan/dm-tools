import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import TreasureGenerator from "../views/TreasureGenerator";
import Reaction from "../views/Reaction";
import Morale from "../views/Morale";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/treasure-generator",
    name: "Treasure Generator",
    component: TreasureGenerator,
  },
  {
    path: "/reaction",
    name: "Reaction Check",
    component: Reaction,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === "production" ? "/dm-tools2" : undefined),
  routes,
});

export default router;
