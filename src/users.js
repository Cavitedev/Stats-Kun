var utils = require("./utils");
var modUtils = require("./mods");
var countryUtils = require("./utils_country");

function processUsersData(data) {
  var summaryUsersData = [];

  for (var userData of data) {
    let id = userData.user_id;
    let pp = userData.pp;
    let acc = `${userData.acc.toFixed(2)}%`;

    let countryData = countryUtils.getDataFromCountryCode(userData.country);
    let countryName = `${countryData.emoji} (${countryData.name})`;

    for (var play of userData.scores) {
      var modId = play.mods;
      var mods = modUtils.getModAcronyms(modUtils.getMods(modId));

      // Beatmap stats
      var ar = play.ar;
      var cs = play.cs;
      var length = play.h_len;
      let staminaVariable = play.h_len;

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

      if (mods.includes("DT")) {

        length = length / 1.5;
        staminaVariable = staminaVariable / 0.75;
        if(!mods.includes("FL")){
          arMs *= 0.6666666667;
        }
        
      }

      if (mods.includes("HT")) {
        arMs *= 1.3333333333333333;
        length = length / 0.75;
        staminaVariable = staminaVariable / 1.5
      }

      if (mods.includes("FL")) {
        if (mods.includes("DT")) {
          arMs *= 8 / 15;
        } else {
          arMs *= 4 / 5;
        }
      }

      ar = utils.msToAr(arMs);

      play.ar = ar;
      play.cs = cs;
      play.h_len = length;
      play.sta = staminaVariable;
      play.h
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

    let weightedLength =
      Number(
        utils.getWeightedValue(
          userData.scores.map((play) => play.h_len).filter((h_len) => h_len)
        )
      ) / 86400;


      let stamina =
      Number(
        utils.getWeightedValue(
          userData.scores.map((play) => play.sta).filter((h_len) => h_len)
        )
      ) / 86400;

    userData.scores.sort((a, b) => b.cs - a.cs)

    let weightedCS = utils.getWeightedValue(
      userData.scores.map((play) => play.cs).filter((cs) => cs)
    );

    var summaryUserData = {
      username: userData.username,
      id: id,
      pp: pp,
      acc: acc,
      weightedSR: weightedSR,
      weightedAR: weightedAR,
      weightedCS: weightedCS,
      weightedLength: weightedLength,
      staminaVariable: stamina,
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
