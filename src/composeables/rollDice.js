const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const rollDice = (num, sides, mods = 0) => {
  let result = { total: 0, num: num, sides: sides, mods: mods, diceRolled: [] };

  for (let i = 0; i < num; i++) {
    let roll = getRandomInt(sides) + 1;
    result.diceRolled.push(roll);
    result.total += roll;
  }
  result.total += mods;

  return result;
};

export default rollDice;
