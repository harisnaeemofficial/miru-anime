import axios from 'axios';
import { META, ANIME } from "@consumet/extensions";
import {
    anilistMediaDetailQuery,
  } from '@consumet/extensions/dist/utils/queries';
import { Genres } from '@consumet/extensions';
import { schedule_query } from '@/apollo/queries';
const anilist = new META.Anilist();

export function setAnimeProvider(provider){
  let new_provider_class = ANIME[provider];
  if (new_provider_class === undefined) return false;
  const new_anime_provider = new ANIME[provider];
  anilist.provider = new_anime_provider;
  return true;
}
export const getAllAnimeProviders = () => Object.keys(ANIME);
export const getAnimeInfo = anilist.fetchAnimeInfo;
export const getEpisodeSources = anilist.fetchEpisodeSources;
export const getRecentEpisodes = anilist.fetchRecentEpisodes;
export async function getWeekAiringSchedule(start, end){
  let hasNextPage = true, page = 1, airingSchedules = [];
  do {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      query: schedule_query(start, end, page),
    };
    const { data } = await axios.post(anilist.anilistGraphqlUrl, options).catch(() => {
      throw new Error('Schedule not found');
    });
    hasNextPage = data.data.weekSchedule.pageInfo.hasNextPage;
    page++;
    airingSchedules = airingSchedules.concat(data.data.weekSchedule.airingSchedules)
  } while(hasNextPage);
  return airingSchedules;
}
export const animeGenres = Genres;

export async function getAnimeFromAnilistOnly(animeId){
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        query: anilistMediaDetailQuery(animeId),
      };
  
      try {
        const { data } = await axios.post(anilist.anilistGraphqlUrl, options).catch(() => {
          throw new Error('Media not found');
        });
        return data.data.Media;
    } catch (err) {
      throw new Error(err.message);
    }
}