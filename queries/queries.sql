create or replace view simple_beatmap_diff as (select beatmap_id, mods, value sr
from osu_beatmap_difficulty_attribs obda
where attrib_id = 1);


create or replace view beatmap_data as (select beatmap_id, beatmapset_id, hit_length, ROUND(diff_drain,1) hp, ROUND(diff_size,1)  cs, ROUND(diff_overall,1) od, ROUND(diff_approach,1) ar, bpm, countTotal map_max_combo
from osu_beatmaps ob);

create or replace view users_simple as (select us.user_id, us.rank_score_index, rank_score user_pp, username, accuracy_new accuracy, country_acronym
  FROM osu_user_stats_fruits AS us
  JOIN sample_users AS u ON us.user_id = u.user_id)

  create or replace view best_scores_per_map as (
select score_id, beatmap_id, user_id, enabled_mods, pp, maxcombo, count300, count100, count50, countmiss, countkatu
from (
  select score_id,  beatmap_id , user_id, enabled_mods, pp, maxcombo, count300, count100, count50, countmiss, countkatu, 
  score,  max(score) over (partition by user_id, beatmap_id) best_score
  from osu_scores_fruits_high s
  order by s.user_id ,s.pp desc
) x
where x.score = x.best_score
);

create table top100Scores as select score_id, beatmap_id, user_id, enabled_mods, pp,  rank_pos, maxcombo, count300, count100, count50, countmiss, countkatu
from 
(
   select score_id,  beatmap_id , user_id, enabled_mods, pp, maxcombo, count300, count100, count50, countmiss, countkatu, 
   row_number() OVER (PARTITION BY user_id ORDER BY pp  DESC) AS rank_pos
  from best_scores_per_map s
  order by s.user_id ,s.pp desc
) as x
where rank_pos <= 100;

  
  
SELECT * 
  FROM users_simple as ud
  JOIN top100scores s on s.user_id = ud.user_id
  JOIN beatmap_data bd on s.beatmap_id = bd.beatmap_id
  JOIN simple_beatmap_diff bdiff on s.beatmap_id = bdiff.beatmap_id and (s.enabled_mods & 338) = bdiff.mods
  ORDER BY ud.rank_score_index, ud.user_id, rank_pos