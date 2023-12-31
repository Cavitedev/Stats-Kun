var mysql = require("mysql");
var users = require("./users");
require("dotenv").config();
var time_start = new Date().getTime();

console.log("Start time: " + new Date(time_start).toISOString());

var con = mysql.createConnection({
  host: process.env.DBhost,
  user: process.env.DBuser,
  password: process.env.DBpassword,
  database: process.env.DBdatabase,
});

con.connect(function (err) {
  if (err) throw err;
  con.query(
    `SELECT * 
    FROM users_simple as ud
    JOIN top100Scores s on s.user_id = ud.user_id
    JOIN beatmap_data bd on s.beatmap_id = bd.beatmap_id
    JOIN simple_beatmap_diff bdiff on s.beatmap_id = bdiff.beatmap_id and (s.enabled_mods & 338) = bdiff.mods
    ORDER BY ud.user_pp desc, ud.user_id, rank_pos  
        `,
    function (err, result, fields) {
      if (err) throw err;

      let usersData = [];
      let user_id = 0;
      let userData = {};
      let scoresData = [];
      let csScores = []
      let userIndex = 0
      for (var i = 0; i < result.length; i++) {
        let row = 
        result[i];
        
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
            rank: row.rank_score_index,
            pp: row.user_pp,
            acc: row.accuracy,
            country: row.country_acronym,
          };

          user_id = row.user_id;

          userIndex = 0
          csScores = result.filter(r => r.user_id == user_id).sort((a, b) => b.cs - a.cs).map(r => r.cs)

          scoresData = [];
        }
        // Add score
        scoreData = {
          ar: row.ar,
          b_id: row.beatmap_id,
          cs: csScores[userIndex],
          mods: row.enabled_mods,
          h_len: row.hit_length,
          pp: row.pp,
          rank: row.rank_pos,
          sr: row.sr,
        };
        userIndex++
        scoresData.push(scoreData);
      }

      var time_end_fetch_data = new Date().getTime();
      console.log(
        "Fetch data: " +
          new Date(time_end_fetch_data - time_start).toISOString().slice(14, 19)
      );

      //Last player
      userData.scores = scoresData;
      usersData.push(userData);
      let top100Json = JSON.stringify(usersData);
      let fs = require("fs");
      fs.writeFile("top100.json", top100Json, "utf-8", function (err) {});
      // console.log(usersData);

      const filteredData = users.processUsersData(usersData);
      // console.log(filteredData);

      var time_exec = new Date().getTime();

      console.log(
        "Process time: " +
          new Date(time_exec - time_end_fetch_data).toISOString().slice(14, 19)
      );
      console.log(
        "Execution time: " +
          new Date(time_exec - time_start).toISOString().slice(14, 19)
      );

      con.end(function (err) {
        if (err) {
          return console.log("error:" + err.message);
        }
        console.log("Close the database connection.");
      });

      // let jsonString = JSON.stringify(usersData);

      // var fs = require("fs");
      // fs.writeFile("users.json", jsonString, "utf-8", function (err) {});
    }
  );
});
