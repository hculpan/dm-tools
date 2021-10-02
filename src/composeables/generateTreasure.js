import treasureTypes from "../data/treasure-types.json";
import artDescriptions from "../data/art-descriptions.json";
import magicItems from "../data/magic-items.json";
import potions from "../data/potions.json";
import scrollSpells from "../data/scrolls-spell.json";
import scrollProtection from "../data/scrolls-protection.json";

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const checkChance = (chance) => {
  return getRandomInt(100) < chance;
};

function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
    c
  ) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

const roundAmount = (amount) => {
  if (amount > 10000) {
    return Math.floor(amount / 1000) * 1000;
  } else if (amount > 1000) {
    return Math.floor(amount / 100) * 100;
  } else if (amount > 100) {
    return Math.floor(amount / 10) * 10;
  }

  return amount;
};

const generateCoin = (coin) => {
  if (coin && checkChance(coin.chance)) {
    return roundAmount(getRandomInt(coin.max - coin.min) + coin.min);
  }

  return 0;
};

const varyGemValue = (value) => {
  let result = value;
  if (getRandomInt(100) < 10) {
    let choice = getRandomInt(6) + 1;
    switch (choice) {
      case 1:
        result = varyGemValue(result * 5);
        break;
      case 2:
        result *= 2;
        break;
      case 3:
        result = Math.floor(result * 1.3);
        break;
      case 4:
        result = Math.floor(result * 0.5);
        break;
      case 5:
        result = Math.floor(result * 0.5);
        break;
      case 6:
        result = varyGemValue(Math.floor(result / 5));
        break;
    }
  }

  return result;
};

const generateGemValue = () => {
  let roll = getRandomInt(100) + 1;
  let result = 5000;
  if (roll < 26) {
    result = 10;
  } else if (roll < 51) {
    result = 50;
  } else if (roll < 71) {
    result = 100;
  } else if (roll < 91) {
    result = 500;
  } else if (roll < 100) {
    result = 1000;
  }

  return varyGemValue(result);
};

const generateGems = (gems) => {
  if (gems && checkChance(gems.chance)) {
    let count = getRandomInt(gems.max - gems.min) + gems.min;
    let gemsMap = new Map();

    for (let i = 0; i < count; i++) {
      let value = generateGemValue();
      if (gemsMap.has(value)) {
        gemsMap.set(value, gemsMap.get(value) + 1);
      } else {
        gemsMap.set(value, 1);
      }
    }

    let totalValue = 0;
    let gemsResult = [];

    for (let gem of gemsMap) {
      totalValue += gem[0] * gem[1];
      gemsResult.push({ count: gem[1], value: gem[0] });
    }

    return {
      totalCount: count,
      totalValue: totalValue,
      gems: gemsResult,
    };
  }

  return { totalCount: 0, totalValue: 0 };
};

const generateArtDescription = () => {
  return artDescriptions[getRandomInt(artDescriptions.length)];
};

const generateArtObject = () => {
  let value = getRandomInt(10000) + 2000;
  let roll = getRandomInt(100) + 1;

  if (roll < 11) {
    value = getRandomInt(90) + 10;
  } else if (roll < 26) {
    value = getRandomInt(150) + 30;
  } else if (roll < 41) {
    value = getRandomInt(500) + 100;
  } else if (roll < 51) {
    value = getRandomInt(900) + 100;
  } else if (roll < 61) {
    value = getRandomInt(1000) + 200;
  } else if (roll < 71) {
    value = getRandomInt(1500) + 300;
  } else if (roll < 81) {
    value = getRandomInt(2000) + 400;
  } else if (roll < 86) {
    value = getRandomInt(2500) + 500;
  } else if (roll < 91) {
    value = getRandomInt(3000) + 1000;
  } else if (roll < 96) {
    value = getRandomInt(5000) + 1000;
  } else if (roll < 100) {
    value = getRandomInt(6000) + 2000;
  }

  return { value: roundAmount(value), description: generateArtDescription() };
};

const generateArtObjects = (artParams) => {
  if (artParams && checkChance(artParams.chance)) {
    let count = getRandomInt(artParams.max - artParams.min) + artParams.min;
    let totalValue = 0;
    let artObjects = [];

    for (let i = 0; i < count; i++) {
      let artObject = generateArtObject();
      totalValue += artObject.value;
      artObjects.push(artObject);
    }

    return {
      totalCount: count,
      totalValue: totalValue,
      art: artObjects,
    };
  }

  return { totalCount: 0, totalValue: 0, art: [] };
};

const findMagicItemById = (id) => {
  for (let j = 0; j < magicItems.length; j++) {
    if (magicItems[j].id && id.indexOf(magicItems[j].id) > -1) {
      return { ...magicItems[j] };
    }
  }

  return {};
};

const generatePotion = () => {
  let roll = getRandomInt(3) + 1;
  let table = potions[roll.toString()];
  return table[getRandomInt(table.length)];
};

const generateScroll = () => {
  if (getRandomInt(100) < 50) {
    return scrollProtection[getRandomInt(scrollProtection.length)];
  } else {
    let scrollParams = scrollSpells[getRandomInt(scrollSpells.length)];
    let result = "Scroll: " + scrollParams.count + " spells [";
    for (let i = 0; i < scrollParams.count; i++) {
      if (getRandomInt(100) < 50) {
        result +=
          " W" +
          (getRandomInt(scrollParams.wizardmax - scrollParams.wizardmin) +
            scrollParams.wizardmin);
      } else {
        result +=
          " C" +
          (getRandomInt(scrollParams.clericmax - scrollParams.clericmin) +
            scrollParams.clericmin);
      }
    }
    result += " ]";
    return result;
  }
};

const generateMagicItem = (key, params) => {
  let resultItem = undefined;
  let loop = true;

  while (loop) {
    if (key === "any") {
      let roll = getRandomInt(100) + 1;
      for (let j = 0; j < magicItems.length; j++) {
        if (roll >= magicItems[j].min && roll <= magicItems[j].max) {
          resultItem = { ...magicItems[j] };
          break;
        }
      }
    } else if (key.indexOf(",") > -1) {
      let keys = key.split(",");
      let index = getRandomInt(keys.length);
      resultItem = findMagicItemById(keys[index]);
    } else {
      resultItem = findMagicItemById(key);
    }

    if (!params.exclude || resultItem.id != params.exclude) {
      break;
    }
  }

  if (resultItem.id === "potion") {
    resultItem.description = generatePotion();
  } else if (resultItem.id === "scroll") {
    resultItem.description = generateScroll();
  }

  return resultItem.description;
};

const generateMagicItems = (magicParams) => {
  if (magicParams && checkChance(magicParams.chance)) {
    let totalCount = 0;
    let items = [];

    for (const [key, value] of Object.entries(magicParams)) {
      if (key !== "chance") {
        let count = getRandomInt(value.max - value.min) + value.min;
        totalCount += count;
        for (let i = 0; i < count; i++) {
          items.push(generateMagicItem(key, value));
        }
      }
    }

    return { totalCount: totalCount, items: items };
  }

  return { totalCount: 0, items: [] };
};

const generateTreasure = (name) => {
  let result = {
    type: name.toUpperCase(),
    id: create_UUID(),
    isEmpty: false,
    coins: {
      copper: generateCoin(treasureTypes[name].copper),
      silver: generateCoin(treasureTypes[name].silver),
      gold: generateCoin(treasureTypes[name].gold),
      platinum: generateCoin(treasureTypes[name].platinum),
    },
    gems: generateGems(treasureTypes[name].gems),
    collapsedGems: true,
    art: generateArtObjects(treasureTypes[name].art),
    collapsedArt: true,
    magic: generateMagicItems(treasureTypes[name].magic),
    collapsedMagic: true,
  };

  result.isEmpty =
    result.coins.copper == 0 &&
    result.coins.silver == 0 &&
    result.coins.gold == 0 &&
    result.coins.platinum == 0 &&
    result.gems.totalCount == 0 &&
    result.art.totalCount == 0 &&
    result.magic.totalCount == 0;

  return result;
};

export { generateTreasure, treasureTypes };
