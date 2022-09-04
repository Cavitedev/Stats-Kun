var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ROOT",
  database: "osu",
});

con.connect(function (err) {
  if (err) throw err;
  con.query(
    `SELECT * 
  FROM users_simple as ud
  JOIN top100scores s on s.user_id = ud.user_id
  JOIN beatmap_data bd on s.beatmap_id = bd.beatmap_id
  JOIN simple_beatmap_diff bdiff on s.beatmap_id = bdiff.beatmap_id and (s.enabled_mods & 338) = bdiff.mods
  ORDER BY ud.rank_score_index, ud.user_id, rank_pos 
  `,
    function (err, result, fields) {
      if (err) throw err;
      console.log(result);

      let usersData = [];
      let user_id = 0;
      let userData = {};
      let scoresData = [];

      for (var i = 0; i < result.length; i++) {
        let row = result[i];
        if (user_id != row.user_id) {
          if (user_id != 0) {
            // No first user
            userData.scores = scoresData;
            usersData.push(userData);
          }

          // New user
          userData = {
            user_id: row.user_id,
            username: row.username,
            globalRank: row.rank_score_index,
            pp: row.user_pp,
            acc: row.accuracy

          };

          user_id = row.user_id;
          scoresData = [];
        }
        // Add score
        scoreData = {
          ar: row.ar,
          bpm: row.bpm,
          cs: row.cs,
          mods: row.enabled_mods,
          hit_length: row.hit_length,
          hp: row.hp,
          od: row.od,
          pp: row.pp,
          rank_score: row.rank_pos,
          sr: row.sr,
          map_max_combo: row.map_max_combo,
          maxcombo: row.mapcombo,
          count300: row.count300,
          count100: row.count100,
          count50: row.count50,
          countmiss: row.countmiss,
          countkatu: row.countkatu
        };

        scoresData.push(scoreData);
      }

      //Last player
      userData.scores = scoresData;
      usersData.push(userData);

      console.log(usersData);

      let jsonString = JSON.stringify(usersData);

      var fs = require("fs");
      fs.writeFile("users.json", jsonString, "utf-8", function (err) {});
    }
  );
});
