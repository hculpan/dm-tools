<template>
  <section id="reaction" class="bg-dark text-light">
    <div class="container-xxl text-center">
      <div class="h3">
        Reaction Check<a
          data-bs-toggle="offcanvas"
          href="#offcanvasExample"
          role="button"
          aria-controls="offcanvasExample"
        >
          <i class="bi bi-info-circle ms-3"></i>
        </a>
      </div>
      <div>Party Stance</div>
      <div class="btn-group flex-wrap" role="group" aria-label="Basic radio toggle button group">
        <input
          type="radio"
          class="btn-check"
          name="btnradio"
          id="btnradio1"
          autocomplete="off"
          value="friendly"
          v-model="partyStance"
        />
        <label class="btn btn-outline-primary" for="btnradio1">Friendly</label>

        <input
          type="radio"
          class="btn-check"
          name="btnradio"
          id="btnradio2"
          autocomplete="off"
          value="indifferent"
          v-model="partyStance"
        />
        <label class="btn btn-outline-primary" for="btnradio2">Indifferent</label>

        <input
          type="radio"
          class="btn-check"
          name="btnradio"
          id="btnradio3"
          autocomplete="off"
          value="threatening"
          v-model="partyStance"
        />
        <label class="btn btn-outline-primary" for="btnradio3">Threatening</label>

        <input
          type="radio"
          class="btn-check"
          name="btnradio"
          id="btnradio4"
          autocomplete="off"
          value="hostile"
          v-model="partyStance"
        />
        <label class="btn btn-outline-primary" for="btnradio4">Hostile</label>
      </div>

      <div class="d-flex justify-content-center">
        <button class="btn btn-secondary m-2" style="width: 300px" @click="reset">Reset</button>
      </div>
      <div class="btn-group btn-group-vertical" role="group" aria-label="Basic checkbox toggle button group">
        <div v-for="mod in reactionModifiers" :key="mod.id" class="col-12">
          <input type="checkbox" class="btn-check" autocomplete="off" :checked="isChecked(mod.id)" />
          <label class="btn btn-outline-primary" @click="modifierClick(mod.id, mod.modifier)" style="width: 300px"
            >{{ mod.description }} ({{ mod.modifier > 0 ? "+" + mod.modifier : mod.modifier }})</label
          >
        </div>
      </div>
      <div class="mt-2">
        <label class="me-lg-2 me-1">Other mods:</label>
        <input
          type="number"
          style="max-width: 50px"
          class="bg-light border text-center"
          name=""
          id=""
          min="-100"
          max="100"
          @click="calculateTotalMods"
          v-model="otherMods"
        />
        <label class="mx-lg-2 mx-1">Total mods:</label>
        <label class="bg-light text-dark border" style="width: 50px">{{
          totalMods > 0 ? "+" + totalMods : totalMods
        }}</label>
      </div>
    </div>
    <div class="d-flex justify-content-center mt-1">
      <label
        class="ms-3 fw-bold"
        :class="{
          'text-secondary': reaction === 'None',
          'text-danger': reaction === 'Hostile',
          'text-success': reaction === 'Friendly' || reaction === 'Indifferent',
          'text-warning': reaction === 'Cautious' || reaction === 'Threatening' || reaction === 'Flight',
        }"
        >Reaction: {{ reaction }}</label
      >
    </div>
    <div class="d-flex justify-content-center">
      <button class="btn btn-primary m-2" style="width: 300px" @click="reactionRolled">Roll Reaction</button>
    </div>

    <!-- Reactions info sidebar -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title text-dark" id="offcanvasExampleLabel">Reactions</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body text-dark">
        <div class="row">
          <label class="text-muted mb-3"><em>Dungeon Master's Guide</em> pp. 140-141</label>
        </div>
        <div class="row">
          <label class="col-4 text-start">Flight</label>
          <p class="col-8 text-start">Avoidance, panic, terror, or surrender.</p>
        </div>
        <div class="row">
          <label class="col-4 text-start">Friendly</label>
          <p class="col-8 text-start">Kind, helpful, confiliatory, or surrender.</p>
        </div>
        <div class="row">
          <label class="col-4 text-start">Indifferent</label>
          <p class="col-8 text-start">Neutral, bored, businesslike, unconcerned, unimpressed, or simply oblivious.</p>
        </div>
        <div class="row">
          <label class="col-4 text-start">Cautious</label>
          <p class="col-8 text-start">
            Suspicious, wary, dubious, paranoid, guarded, untrusting, or mildly conciliatory.
          </p>
        </div>
        <div class="row">
          <label class="col-4 text-start">Threatening</label>
          <p class="col-8 text-start">
            Boastful, bravado, blustering, intimidating, short-tempered, or bluffing.
          </p>
        </div>
        <div class="row">
          <label class="col-4 text-start">Hostile</label>
          <p class="col-8 text-start">Irritable, hot-tempered, aggressive, or violent.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from "vue";
import reactionModifiers from "../data/reaction-modifiers.json";
import rollDice from "../composeables/rollDice";
import reactionResult from "../data/reaction-result.json";

const reactions = {
  NONE: "None",
  FRIENDLY: "Friendly",
  INDIFFERENT: "Indifferent",
  CAUTIOUS: "Cautious",
  THREATENING: "Threatening",
  HOSTILE: "Hostile",
  FLIGHT: "Flight",
};

export default {
  setup() {
    const otherMods = ref(0);
    const totalMods = ref(0);
    const partyStance = ref("friendly");

    const modsMap = new Map();

    const reaction = ref(reactions.NONE);

    const calculateTotalMods = () => {
      totalMods.value = 0;
      for (let value of modsMap.values()) {
        totalMods.value += value;
      }
      totalMods.value += otherMods.value;
    };

    const modifierClick = (id, mod) => {
      if (modsMap.has(id) && modsMap.get(id) != 0) {
        modsMap.set(id, 0);
      } else {
        modsMap.set(id, mod);
      }

      calculateTotalMods();
    };

    const reset = () => {
      modsMap.clear();
      otherMods.value = 0;
      partyStance.value = "friendly";
      calculateTotalMods();
      reaction.value = reactions.NONE;
    };

    const isChecked = (id) => {
      return modsMap.has(id) && modsMap.get(id) != 0;
    };

    const reactionRolled = () => {
      let dice = rollDice(2, 10, totalMods.value);
      let table = reactionResult[partyStance.value];
      if (dice.total < 2) {
        dice.total = 2;
      } else if (dice.total > 20) {
        dice.total = 20;
      }

      reaction.value = table[dice.total - 2];
    };

    return {
      otherMods,
      totalMods,
      partyStance,
      reactionModifiers,
      reaction,
      reactions,
      reactionRolled,
      isChecked,
      calculateTotalMods,
      modifierClick,
      reset,
    };
  },
};
</script>

<style scoped></style>
