import axios from 'axios';
import { META, ANIME } from "@consumet/extensions";
import {
    anilistMediaDetailQuery,
  } from '@consumet/extensions/dist/utils/utils';
import anilistAiringScheduleQuery from '../queries/scheduleQuery';
const anime_provider = new ANIME.Zoro();
const anilist = new META.Anilist(anime_provider);

export async function getAnimeInfo(animeId){
    return await anilist.fetchAnimeInfo(animeId);
}
export async function getEpisodeSources(episodeId){
    return await anime_provider.fetchEpisodeSources(episodeId);
}
export const getRecentEpisodes = anime_provider.fetchRecentEpisodes;
export async function getWeekAiringSchedule(start, end){
  let hasNextPage = true, page = 1, airingSchedules = [];
  do {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      query: anilistAiringScheduleQuery(start, end, page),
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
export async function getAnimeFromAnilistOnly(animeId){
    const animeInfo = {
        id: animeId,
        title: '',
      };
  
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
        animeInfo.malId = data.data.Media.idMal;
        animeInfo.title = {
          romaji: data.data.Media.title.romaji,
          english: data.data.Media.title.english,
          native: data.data.Media.title.native,
          userPreferred: data.data.Media.title.userPreferred,
        };
        animeInfo.trailer = {
          id: data.data.Media.trailer?.id,
          site: data.data.Media.trailer?.site,
          thumbnail: data.data.Media.trailer?.thumbnail,
        };
        animeInfo.image =
          data.data.Media.coverImage.extraLarge ??
          data.data.Media.coverImage.large ??
          data.data.Media.coverImage.medium ??
          data.data.Media.coverImage.small;
  
        animeInfo.cover = data.data.Media.bannerImage ?? animeInfo.image;
        animeInfo.description = data.data.Media.description;
        switch (data.data.Media.status) {
          case 'RELEASING':
            animeInfo.status = 'Ongoing';
            break;
          case 'FINISHED':
            animeInfo.status = 'Completed';
            break;
          case 'NOT_YET_RELEASED':
            animeInfo.status = 'Not yet aired';
            break;
          case 'CANCELLED':
            animeInfo.status = 'Cancelled';
            break;
          case 'HIATUS':
            animeInfo.status = 'Hiatus';
            break;
          default:
            animeInfo.status = 'Unknown';
        }
        animeInfo.releaseDate = data.data.Media.startDate.year;
        if (data.data.Media.nextAiringEpisode?.airingAt)
          animeInfo.nextAiringEpisode = {
            airingTime: data.data.Media.nextAiringEpisode?.airingAt,
            timeUntilAiring: data.data.Media.nextAiringEpisode?.timeUntilAiring,
            episode: data.data.Media.nextAiringEpisode?.episode,
          };
        animeInfo.rating = data.data.Media.averageScore;
        animeInfo.duration = data.data.Media.duration;
        animeInfo.genres = data.data.Media.genres;
        animeInfo.studios = data.data.Media.studios.edges.map((item) => item.node.name);
        animeInfo.recommendations = data.data.Media.recommendations.edges.map((item) => ({
          id: item.node.mediaRecommendation.id,
          malId: item.node.mediaRecommendation.idMal,
          title: {
            romaji: item.node.mediaRecommendation.title.romaji,
            english: item.node.mediaRecommendation.title.english,
            native: item.node.mediaRecommendation.title.native,
            userPreferred: item.node.mediaRecommendation.title.userPreferred,
          },
          status:
            item.node.mediaRecommendation.status == 'RELEASING'
              ? 'Ongoing'
              : item.node.mediaRecommendation.status == 'FINISHED'
              ? 'Completed'
              : item.node.mediaRecommendation.status == 'NOT_YET_RELEASED'
              ? 'Not yet aired'
              : item.node.mediaRecommendation.status == 'CANCELLED'
              ? 'Cancelled'
              : item.node.mediaRecommendation.status == 'HIATUS'
              ? 'Hiatus'
              : 'Unknown',
          episodes: item.node.mediaRecommendation.episodes,
          image:
            item.node.mediaRecommendation.coverImage.extraLarge ??
            item.node.mediaRecommendation.coverImage.large ??
            item.node.mediaRecommendation.coverImage.medium,
          cover:
            item.node.mediaRecommendation.bannerImage ??
            item.node.mediaRecommendation.coverImage.extraLarge ??
            item.node.mediaRecommendation.coverImage.large ??
            item.node.mediaRecommendation.coverImage.medium,
          score: item.node.mediaRecommendation.meanScore,
        }));
        return animeInfo;
    } catch (err) {
      throw new Error(err.message);
    }
}