var utils = require("./utils");
var modUtils = require("./mods");
var countryUtils = require("./utils_country");

function processUsersData(data) {
  var summaryUsersData = [];

  for (var userData of data) {
    let id = userData.user_id;
    let pp = userData.pp;
    let acc = `${userData.acc.toFixed(2)}%`;

    let countryData = countryUtils.getDataFromCountryCode(userData.country_acronym);
    let countryName = `${countryData.emoji} (${countryData.name})`;

    for (var play of userData.scores) {
      var modId = play.mods;
      var mods = modUtils.getModAcronyms(modUtils.getMods(modId));

      // Beatmap stats
      var ar = play.ar;
      var cs = play.cs;
      var length = play.hit_length;

      let arMs;
      let hasHD = mods.includes("HD");
      let hasFL = mods.includes("FL");

      if (mods.includes("EZ")) {
        cs = cs / 2;
        ar = ar / 2;
      }

      if (mods.includes("HR")) {
        cs = cs * 1.3;
        ar = Math.min(ar * 1.4, 10);
      }

      arMs = utils.arToMs(ar);

      if (mods.includes("DT") && !mods.includes("FL")) {
        arMs *= 2 / 3;
        // if (ar <= 5) ar = Math.min((1800 - ((1800 - ar * 120) * 2 / 3)) / 120, 11);
        // else ar = Math.min(((1200 - ((1200 - (ar - 5) * 150) * 2 / 3)) / 150) + 5, 11);
        length = length / 1.5;
      }

      if (mods.includes("HT")) {
        arMs *= 3 / 2;
        // if (ar > 7) ar = (1 + (1 / 3)) * ar - (4 + (1 / 3));
        // else if (ar <= 7 && ar > 5) ar = (1 + (2 / 3)) * ar - (6 + (2 / 3))
        // else if (ar <= 5) ar = ((1 + (1 / 3)) * ar - 5);
        length = length * 1.5;
      }

      // PP recalculation
      ar = utils.msToAr(arMs);

      // let comboPenalty = Math.pow(playCombo / mapCombo, 0.8);
      // let accPenalty = Math.pow(acc, 5.5);
      // let missPenalty = Math.pow(0.97, fruitsAndDrops);

      // let lengthBonus = 0.95 + 0.3 * Math.min(1, mapCombo / 2500);
      // if (mapCombo > 2500) lengthBonus += Math.log10(mapCombo / 2500) * 0.475;

      // let flBonus = hasFL ? 1.35 * lengthBonus : 1;
      // let hdBonus = hasHD
      //   ? ar > 10
      //     ? 1.01 + 0.04 * (11 - ar)
      //     : 1.05 + 0.075 * (10 - ar)
      //   : 1;
      // let arBonus =
      //   ar > 9
      //     ? 1 + 0.1 * (ar - 9)
      //     : ar > 10
      //     ? 1.1 + 0.2 * (ar - 10)
      //     : ar < 8
      //     ? 1 + 0.025 * (8 - ar)
      //     : 1;

      // let product =
      //   arBonus *
      //   hdBonus *
      //   flBonus *
      //   lengthBonus *
      //   missPenalty *
      //   accPenalty *
      //   comboPenalty;

      // var sr = (0.0049 * (4 + Math.pow(100000 * (pp / product), 0.5))) / 5;

      // pp =
      //   (Math.pow((5 * sr) / 0.0049 - 4, 2) / 100000) *
      //   (arBonus * hdBonus * flBonus * lengthBonus);

      arMs = utils.arToMs(ar);

      // Effective AR calculation for FL
      if (mods.includes("FL")) {
        if (mods.includes("DT")) {
          arMs *= 8 / 15;
          length = length / 1.5;
        } else {
          arMs *= 4 / 5;
        }
      }

      ar = utils.msToAr(arMs);

      play.ar = ar;
      play.cs = cs;
      play.hit_length = length;
    }

    let weightedSR = utils.getWeightedValue(
      userData.scores
        .map((play) => play.sr)
        .sort((a, b) => b - a)
        .filter((ar) => ar)
    );
    let weightedAR = utils.getWeightedValue(
      userData.scores
        .map((play) => play.ar)
        .sort((a, b) => b - a)
        .filter((ar) => ar)
    );
    let weightedCS = utils.getWeightedValue(
      userData.scores.map((play) => play.cs).filter((cs) => cs)
    );
    let weightedLength =
      Number(
        utils.getWeightedValue(
          userData.scores
            .map((play) => play.hit_length)
            .filter((hit_length) => hit_length)
        )
      ) / 86400;

    var summaryUserData = {
      username: userData.username,
      id: id,
      pp: pp,
      acc: acc,
      weightedSR: weightedSR,
      weightedAR: weightedAR,
      weightedCS: weightedCS,
      weightedLength: weightedLength,
      country: countryName,
    };

    summaryUsersData.push(summaryUserData);
  }

  let jsonData = JSON.stringify(summaryUsersData);

  var fs = require("fs");
  fs.writeFile("users.json", jsonData, "utf-8", function (err) {});

  return summaryUsersData;
}

module.exports = { processUsersData };
