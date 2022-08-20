<template>
  <DefaultLayout :addScrollEvents="true">
    <div class="pb-2">
      <TrailerBanner
        :trailer="homeFeed?.banner_anime.trailer"
        :thumbnail="homeFeed?.banner_anime.bannerImage"
      >
        <div class="banner_anime_info w-1/2 px-5">
          <h1 class="text-5xl font-bold">
            {{ homeFeed?.banner_anime.title.english || homeFeed?.banner_anime.title.userPreferred}}
          </h1>
          <div class="mt-4">
            <TagBadge
              v-for="genre in homeFeed?.banner_anime.genres"
              :key="genre"
              >{{ genre }}</TagBadge
            >
            <span class="dot"/>
            <span class="text-lg text-bold">{{homeFeed?.banner_anime.format}}</span>
            <span class="dot"/>
            <span class="text-lg text-bold">{{homeFeed?.banner_anime.seasonYear}}</span>
          </div>
          <p
            class="text-lg mt-2 line-clamp-6"
            v-html="`<span>${homeFeed?.banner_anime.description}</span>`"
          />
          <div class="mt-3 flex gap-x-2">
            <router-link :to="'/details/' + homeFeed?.banner_anime.id">
              <PrimaryButton>
                <span class="flex items-center gap-x-2">
                  <BIconInfoCircle />
                   <span class="mr-2" >
                    View Details
                  </span>
                </span>
              </PrimaryButton>
            </router-link>
            <WatchListButton :id="homeFeed?.banner_anime.id" />
          </div>
        </div>
      </TrailerBanner>
      <div class="mt-3 bg-white px-4">
        <CategoryAnimeSlider
          categoryTitle="Trending Now"
          :animes="homeFeed?.trending_animes"
        />
        <CategoryAnimeSlider
          categoryTitle="Continue Watching"
          :animes="homeFeed?.watched_animes"
        />
        <CategoryAnimeSlider
          categoryTitle="Recommended"
          :animes="homeFeed?.recommended"
        />
        <CategoryAnimeSlider
          categoryTitle="All Time Popular"
          :animes="homeFeed?.popular_animes"
        />
        <CategoryAnimeSlider
          categoryTitle="New Releases"
          :animes="homeFeed?.top_airing"
        />
        <CategoryAnimeSlider
          categoryTitle="Anime Movies"
          :animes="homeFeed?.anime_movies"
        />
      </div>
    </div>
  </DefaultLayout>
</template>

<script>
import gql from 'graphql-tag'
import {BIconInfoCircle} from 'bootstrap-icons-vue'
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import CategoryAnimeSlider from "@/components/CategoryAnimeSlider.vue";
import TagBadge from "@/components/TagBadge.vue";
import { sendEventAsync } from '@/libs/ipc-lib';
import { transformFields } from '@/libs/utils-lib';
import WatchListButton from '@/components/WatchListButton.vue';
import TrailerBanner from '@/components/TrailerBanner.vue';
const feedLimit = 28;
function randomizeAndSlice(data){
  return [...new Set(data)].sort(() => Math.random())
  .slice(0, feedLimit);
}
export default {
  name: "HomeView",
  apollo: {
    homeFeed: {
      query: () => gql`query($watchedIds: [Int], $limit: Int, $recommendationMax: Int, $date: FuzzyDateInt, $not_allowed_formats: [MediaFormat] = [MUSIC, MANGA, NOVEL, TV_SHORT]) {
        banner_anime: Media(sort: [TRENDING_DESC, POPULARITY], endDate_greater: $date, format_not_in: $not_allowed_formats, type: ANIME, isAdult: false, status_in: [RELEASING, FINISHED], averageScore_greater: 85) {
          id
          genres
          bannerImage
          format
          seasonYear
          description
          title {
            english
            userPreferred
          }
          trailer {
            id
            site
            thumbnail
          }
        }
        trending_animes: Page(perPage: $limit) {
          media(sort: TRENDING_DESC, format_not_in: $not_allowed_formats, type: ANIME, isAdult: false,  status: RELEASING){
            id
            coverImage {
              large
            }
            title {
              english
              userPreferred
            }
          }
        }
        watched_animes: Page(perPage: $limit){
          media(id_in: $watchedIds){
            id
            coverImage {
              large
            }
            title {
              english
              userPreferred
            }
            recommendations(perPage: $recommendationMax) {
              nodes {
                mediaRecommendation {
                  id
                  coverImage {
                    large
                  }
                  title {
                    english
                    userPreferred
                  }
                }
              }
            }
          }
        }
        popular_animes: Page(perPage: $limit) {
          media(sort: POPULARITY_DESC, format_not_in: $not_allowed_formats, type: ANIME, isAdult: false,  status_not: NOT_YET_RELEASED){
            id
            coverImage {
              large
            }
            title {
              english
              userPreferred
            }
          }
        }
        anime_movies: Page(perPage: $limit) {
          media(sort: TRENDING_DESC, type: ANIME, isAdult: false, format: MOVIE,  status_not: NOT_YET_RELEASED){
            id
            coverImage {
              large
            }
            title {
              english
              userPreferred
            }
          }
        }
        top_airing: Page(perPage: $limit) {
          media(sort: SCORE_DESC, status: RELEASING, type: ANIME, isAdult: false){
            id
            coverImage {
              large
            }
            title {
              english
              userPreferred
            }
          }
      }
    }
    `,
      variables(){
        let watchedIds = randomizeAndSlice(this.watchedAnimes);
        let date = new Date();
        let fmter = Intl.NumberFormat(undefined, {
          minimumIntegerDigits: 2,
        });
        return { 
          limit: feedLimit, 
          recommendationMax: Math.max(2, Math.ceil(feedLimit / watchedIds.length)),
          watchedIds,
          date: date.getFullYear() - 1 + fmter.format(date.getMonth()) + "00"
          }
      },
      update(data){
        let top_airing = data.top_airing.media.map(transformFields);
        let anime_movies = data.anime_movies.media.map(transformFields);
        let popular_animes = data.popular_animes.media.map(transformFields);
        let watched_animes = data.watched_animes.media.map(transformFields);
        let trending_animes = data.trending_animes.media.map(transformFields);
        let recommended = watched_animes
          .reduce((rec_list, anime) => {
            return rec_list
              .concat(
                anime.recommendations.nodes.map(
                  ({ mediaRecommendation }) => mediaRecommendation
                )
              )
              .map(transformFields);
          }, [])
          .filter(anime => !this.watchedAnimes.includes("" + anime.id))
        return {banner_anime: data.banner_anime, watched_animes, top_airing, anime_movies, popular_animes, trending_animes, recommended};
      },
    },
  },
  created(){
    this.getWatchedAnimes();
  },
  data() {
    return {
      homeFeed: null,
      watchedAnimes: []
    };
  },
  components: {
    DefaultLayout,
    CategoryAnimeSlider,
    PrimaryButton,
    BIconInfoCircle,
    TagBadge,
    WatchListButton,
    TrailerBanner
},
  methods: {
    getWatchedAnimes() {
      sendEventAsync("db:getWatchedAnimes")
      .then(animes => {
        this.watchedAnimes = animes.map(({animeId}) => animeId)
      });
    },
  }
};
</script>
