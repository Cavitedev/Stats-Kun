# Osu CTB data into Stats-kun spreadsheet

## Replication

Data from osu has been processed using Maria DB 10.9 rather than mySQL 8 to optimize it and make it faster as well as being able to use more advanced features for free.

1. Uncompress the top10000 file twice until a folder remain.
2. Remove "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci" from sample_users.sql as that produces an error on MariaDB 10.9
3. Import/Execute sample_users.sql, osu_user_stats_fruits.sql, osu_beatmap_difficulty.sql, osu_beatmap_difficulty_attribs.sql, osu_beatmapsets.sql, osu_beatmaps.sql and osu_scores_fruits_high.sql
4. Execute [queries.sql](https://github.com/Cavitedev/Stats-Kun/blob/master/queries/queries.sql)
5. Using node 16 or node 18 execute index.js by executing `npm start` or `node src/index.js` in the root folder of the project.
6. There will be a new file named users.json with the data. Upload it somewhere and import it using something like `=ImportJSON("https://raw.githubusercontent.com/Cavitedev/Stats-Kun/master/users.json")`
