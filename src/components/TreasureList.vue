<template>
  <div id="treasure-list" class="bg-dark">
    <div class="row pt-2" v-for="treasure in treasures" :key="treasure">
      <div class="col-lg-4"></div>
      <div class="card col-lg-4">
        <div class="card-body">
          <div class="card-title d-flex justify-content-between">
            <div class="h4 text-muted">Type {{ treasure.type }}</div>
            <div class="h4 text-primary">Treasure</div>
            <div>
              <button
                class="btn btn-outline-primary"
                @click="regenerateTreasure(treasure)"
              >
                <i class="bi bi-arrow-repeat"></i>
              </button>
              <button
                class="btn btn-outline-danger"
                @click="removeTreasure(treasure.id)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          <div class="card-text text-dark text-start">
            <div v-if="treasure.isEmpty">No treasure rolled</div>
            <div v-else>
              <div
                v-if="
                  treasure.coins.copper ||
                    treasure.coins.silver ||
                    treasure.coins.gold ||
                    treasure.coins.platinum
                "
              >
                Coins: {{ formattedCoins(treasure.coins) }}
              </div>

              <!-- Gems output -->
              <div v-if="treasure.gems.totalCount > 0">
                <div
                  class="d-flex justify-content-between"
                  v-if="treasure.collapsedGems"
                >
                  <div>
                    Gems: {{ treasure.gems.totalCount }} gems worth
                    {{ treasure.gems.totalValue }} gp
                  </div>
                  <a
                    @click="treasure.collapsedGems = !treasure.collapsedGems"
                    style="cursor: pointer"
                    ><i class="bi bi-chevron-right"></i
                  ></a>
                </div>
                <div class="d-flex justify-content-between" v-else>
                  <div class="text-primary">
                    Gems: {{ treasure.gems.totalCount }} gems worth
                    {{ treasure.gems.totalValue }} gp
                  </div>
                  <a
                    @click="treasure.collapsedGems = !treasure.collapsedGems"
                    style="cursor: pointer"
                    ><i class="bi bi-chevron-down"></i
                  ></a>
                </div>
                <div v-if="!treasure.collapsedGems">
                  <div
                    class="ps-3 d-flex justify-content-between small"
                    v-for="gem in sortValues(treasure.gems.gems)"
                    :key="gem.value"
                  >
                    <label>{{ gem.value }} gp x {{ gem.count }} gems</label>
                    <label>Total: {{ gem.value * gem.count }} gp</label>
                  </div>
                </div>
              </div>

              <!-- Objects of art output -->
              <div v-if="treasure.art.totalCount > 0">
                <div
                  class="d-flex justify-content-between"
                  v-if="treasure.collapsedArt"
                >
                  <div>
                    Art Objects: {{ treasure.art.totalCount }}
                    {{ treasure.art.totalCount > 1 ? "objects" : "object" }}
                    worth {{ treasure.art.totalValue }} gp
                  </div>
                  <a
                    @click="treasure.collapsedArt = !treasure.collapsedArt"
                    style="cursor: pointer"
                    ><i class="bi bi-chevron-right"></i
                  ></a>
                </div>
                <div v-else class="d-flex justify-content-between">
                  <div class="text-primary">
                    Art Objects: {{ treasure.art.totalCount }}
                    {{ treasure.art.totalCount > 1 ? "objects" : "object" }}
                    worth {{ treasure.art.totalValue }} gp
                  </div>
                  <a
                    @click="treasure.collapsedArt = !treasure.collapsedArt"
                    style="cursor: pointer"
                    ><i class="bi bi-chevron-down"></i
                  ></a>
                </div>
                <div v-if="!treasure.collapsedArt">
                  <div
                    class="ps-3 d-flex justify-content-between small"
                    v-for="art in sortValues(treasure.art.art)"
                    :key="art.value"
                  >
                    <label>Value: {{ art.value }}</label>
                    <label>{{ art.description }}</label>
                  </div>
                </div>
              </div>

              <!-- Magic items output -->
              <div v-if="treasure.magic.totalCount > 0">
                <div
                  class="d-flex justify-content-between"
                  v-if="treasure.collapsedMagic"
                >
                  <div>
                    Magic Items: {{ treasure.magic.totalCount }}
                    {{ treasure.magic.totalCount > 1 ? "items" : "item" }}
                  </div>
                  <a
                    @click="treasure.collapsedMagic = !treasure.collapsedMagic"
                    style="cursor: pointer"
                    ><i class="bi bi-chevron-right"></i
                  ></a>
                </div>
                <div v-else class="d-flex justify-content-between">
                  <div class="text-primary">
                    Magic Items: {{ treasure.magic.totalCount }}
                    {{ treasure.magic.totalCount > 1 ? "items" : "item" }}
                  </div>
                  <a
                    @click="treasure.collapsedMagic = !treasure.collapsedMagic"
                    style="cursor: pointer"
                    ><i class="bi bi-chevron-down"></i
                  ></a>
                </div>
                <div v-if="!treasure.collapsedMagic">
                  <div
                    class="ps-3 d-flex justify-content-between small"
                    v-for="item in sortValues(treasure.magic.items)"
                    :key="item"
                  >
                    <label>{{ item }}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["treasures"],
  setup(props, context) {
    const sortValues = (items) => {
      return items.sort((i1, i2) => {
        return i1.value - i2.value;
      });
    };

    const removeTreasure = (id) => {
      context.emit("remove-treasure", id);
    };

    const regenerateTreasure = (treasure) => {
      context.emit("regenerate", treasure);
    };

    const formattedCoins = (treasure) => {
      let result = "";

      if (treasure.copper > 0) {
        result += treasure.copper + " cp, ";
      }
      if (treasure.silver > 0) {
        result += treasure.silver + " sp, ";
      }
      if (treasure.gold > 0) {
        result += treasure.gold + " gp, ";
      }
      if (treasure.platinum > 0) {
        result += treasure.platinum + " pp";
      }

      if (result.endsWith(", ")) {
        result = result.substring(0, result.length - 2);
      }

      return result;
    };

    return {
      formattedCoins,
      sortValues,
      removeTreasure,
      regenerateTreasure,
    };
  },
};
</script>

<style></style>
