CREATE INDEX pp_index ON osu_scores_fruits_high (pp);
create or replace INDEX user_index ON osu_scores_fruits_high (user_id);
CREATE INDEX mods_index ON osu_scores_fruits_high (enabled_mods);

create or replace view best_scores_per_map as (
select score_id, beatmap_id, user_id, enabled_mods, pp
from (
  select score_id,  beatmap_id , user_id, enabled_mods, pp,
  max(pp) over (partition by user_id, beatmap_id) best_pp
  from osu_scores_fruits_high s
  where pp is not null
  order by s.user_id ,s.pp desc
) x
where x.pp = x.best_pp);





drop table top100scores;

create table top100Scores as select score_id, beatmap_id, user_id, enabled_mods, pp,  rank_pos
from 
(
   select score_id,  beatmap_id , user_id, enabled_mods, pp,
   row_number() OVER (PARTITION BY user_id ORDER BY pp  DESC) AS rank_pos
  from best_scores_per_map s
  order by s.user_id ,s.pp desc
) as x
where rank_pos <= 100;

CREATE INDEX beatmap_id_index ON top100Scores (beatmap_id);
CREATE INDEX user_id_index ON top100Scores (user_id);
/

select * from top100scores ts;



create or replace view users_simple as (select us.user_id, us.rank_score_index, rank_score user_pp, username, accuracy_new accuracy, country_acronym
  FROM osu_user_stats_fruits AS us
  JOIN sample_users AS u ON us.user_id = u.user_id)


create or replace view beatmap_data as (select beatmap_id, beatmapset_id, hit_length, ROUND(diff_drain,1) hp, ROUND(diff_size,1)  cs, ROUND(diff_overall,1) od, ROUND(diff_approach,1) ar, bpm
from osu_beatmaps ob);

create or replace view simple_beatmap_diff as (select beatmap_id, mods, value sr
from osu_beatmap_difficulty_attribs obda
where attrib_id = 1);


SELECT * 
  FROM users_simple as ud
  JOIN top100scores s on s.user_id = ud.user_id
  JOIN beatmap_data bd on s.beatmap_id = bd.beatmap_id
  JOIN simple_beatmap_diff bdiff on s.beatmap_id = bdiff.beatmap_id and (s.enabled_mods & 338) = bdiff.mods
  ORDER BY ud.user_pp  desc, ud.user_id, rank_pos
  ;
 