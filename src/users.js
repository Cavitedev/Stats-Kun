var utils = require("./utils");
var modUtils = require("./mods");
var countryUtils = require("./utils_country");

function processUsersData(data) {
  var summaryUsersData = [];

  for (var userData of data) {
    let id = userData.user_id;
    let pp = userData.pp;
    let acc = `${userData.acc.toFixed(2)}%`;

    let countryData = countryUtils.getDataFromCountryCode(
      userData.country_acronym
    );
    let countryName = `${countryData.emoji} (${countryData.name})`;

    for (var play of userData.scores) {
      var modId = play.mods;
      var mods = modUtils.getModAcronyms(modUtils.getMods(modId));

      // Beatmap stats
      var ar = play.ar;
      var cs = play.cs;
      var length = play.hit_length;

      let arMs;

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
        arMs *= 0.6666666667;
        length = length / 1.5;
      }

      if (mods.includes("HT")) {
        arMs *= 1.3333333333333333;
        length = length / 0.75;
      }

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
