<template>
  <section id="treasure_generator" class="bg-dark text-light">
    <div class="container-xxl text-center">
      <div class="h3">
        Treasure generator<a
          data-bs-toggle="offcanvas"
          href="#offcanvasExample"
          role="button"
          aria-controls="offcanvasExample"
          ><i class="bi bi-info-circle ms-3"></i
        ></a>
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <label class="me-2">Treasure Type</label>
        <select name="treasure_type" id="treasure_type" v-model="selectedType" style="width: 75px">
          <option v-for="type in Object.keys(treasureTypes)" :key="type" :value="type">{{ type.toUpperCase() }}</option>
        </select>
        <label class="ms-5 me-2">Number</label>
        <input type="number" name="count" id="count" min="1" max="100" style="max-width: 75px" v-model="count" />
      </div>
      <button class="btn btn-primary mt-2" @click="genTreasure">
        Generate Treasure
      </button>
      <button
        class="btn btn-danger mt-2 ms-2"
        @click="
          treasures = [];
          count = 1;
        "
      >
        Reset
      </button>
    </div>

    <!-- Treasure info sidebar -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title text-dark" id="offcanvasExampleLabel">Treasure Generator</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body text-dark">
        <label>Starts on p. 180 in the <em>Dungeon Master's Guide</em></label>
      </div>
    </div>
  </section>
  <TreasureList :treasures="treasures" @remove-treasure="removeTreasure" @regenerate="regenerateTreasure" />
</template>

<script>
import { ref } from "vue";
import { generateTreasure, treasureTypes } from "../composeables/generateTreasure";
import TreasureList from "../components/TreasureList.vue";

export default {
  components: { TreasureList },
  setup() {
    const treasures = ref([]);
    const count = ref(1);
    const selectedType = ref("a");

    const genTreasure = () => {
      for (let i = 0; i < count.value; i++) {
        treasures.value.push(generateTreasure(selectedType.value));
      }
      count.value = 1;
    };

    const regenerateTreasure = (treasure) => {
      let index = 0;
      let id = treasure.id;

      for (let i = 0; i < treasures.value.length; i++) {
        if (treasures.value[i].id === id) {
          index = i;
        }
      }

      let newTreasure = generateTreasure(treasure.type.toLowerCase());
      newTreasure.id = id;
      treasures.value[index] = newTreasure;
    };

    const removeTreasure = (id) => {
      treasures.value = treasures.value.filter((t) => t.id != id);
    };

    return {
      count,
      selectedType,
      treasures,
      treasureTypes,
      removeTreasure,
      genTreasure,
      regenerateTreasure,
    };
  },
};
</script>

<style></style>
