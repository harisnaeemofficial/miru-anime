<template>
  <DefaultLayout :addScrollEvents="true">
    <div v-if="$apollo.loading">
      <ShimmerPageGrid />
    </div>
    <div v-else>
      <div class="pb-2">
        <TrailerBanner
          :trailer="homeFeed.banner_anime.trailer"
          :thumbnail="homeFeed.banner_anime.bannerImage"
        >
          <div class="banner_anime_info lg:w-1/2 px-14">
            <h1 class="text-5xl font-bold">
              {{ preferredTitle(homeFeed.banner_anime.title) }}
            </h1>
            <div class="mt-4">
              <TagBadge
                v-for="genre in homeFeed.banner_anime.genres"
                :key="genre"
                >{{ genre }}</TagBadge
              >
              <span class="dot" />
              <span class="text-lg text-bold">{{
                homeFeed.banner_anime.format
              }}</span>
              <span class="dot" />
              <span class="text-lg text-bold">{{
                homeFeed.banner_anime.seasonYear
              }}</span>
            </div>
            <p
              class="text-lg mt-2 line-clamp-6"
              v-html="`<span>${homeFeed.banner_anime.description}</span>`"
            />
            <div class="mt-3 flex gap-x-2">
              <router-link :to="'/details/' + homeFeed.banner_anime.id">
                <PrimaryButton>
                  <span class="flex items-center gap-x-2">
                    <BIconInfoCircle />
                    <span class="mr-2"> View Details </span>
                  </span>
                </PrimaryButton>
              </router-link>
              <WatchListButton
                :id="homeFeed.banner_anime.id"
                :title="preferredTitle(homeFeed.banner_anime.title)"
              />
            </div>
          </div>
        </TrailerBanner>
        <div class="main-container-fluid">
          <CategoryAnimeSlider
            categoryTitle="Recent Releases"
            :animes="recently_released_animes"
          />
          <CategoryAnimeSlider
            categoryTitle="Trending Now"
            :animes="homeFeed.trending_animes"
            viewAll="?collection=trending-now"
          />
          <CategoryAnimeSlider
            categoryTitle="Continue Watching"
            :animes="homeFeed.continue_watch_animes"
            :viewAll="
              continueWatchAnimes.length > feedLimit &&
              '?collection=continue-watch'
            "
          />
          <CategoryAnimeSlider
            categoryTitle="Upcoming Animes"
            :animes="homeFeed.upcoming_animes"
            viewAll="?collection=upcoming"
          />
          <CategoryAnimeSlider
            categoryTitle="Recommended"
            :animes="homeFeed.recommended"
          />
          <CategoryAnimeSlider
            categoryTitle="All Time Popular"
            :animes="homeFeed.popular_animes"
            viewAll="?collection=all-time-popular"
          />
          <CategoryAnimeSlider
            categoryTitle="Top Airing"
            :animes="homeFeed.top_airing"
            viewAll="?collection=top-airing"
          />
          <CategoryAnimeSlider
            categoryTitle="Anime Movies"
            :animes="homeFeed.anime_movies"
            viewAll="?collection=movies"
          />
        </div>
      </div>
    </div>
  </DefaultLayout>
  <ConfirmDialogue ref="confirmDialogue" />
</template>

<script>
import gql from "graphql-tag";
import config from "../config.json";
import { BIconInfoCircle } from "bootstrap-icons-vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import CategoryAnimeSlider from "@/components/CategoryAnimeSlider.vue";
import TagBadge from "@/components/TagBadge.vue";
import notificationStore from "@/stores/notificationStore";
import { sendEventAsync } from "@/libs/ipc-lib";
import { getRecentEpisodes } from "@/libs/anime-lib";
import {
  transformFields,
  preferredTitle,
  randomizeAndSlice,
} from "@/libs/utils-lib";
import WatchListButton from "@/components/WatchListButton.vue";
import TrailerBanner from "@/components/TrailerBanner.vue";
import ShimmerPageGrid from "@/components/ShimmerPageGrid.vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";

export default {
  name: "HomeView",
  apollo: {
    homeFeed: {
      query: () => gql`
        query (
          $watchedIds: [Int]
          $continueWatchIds: [Int]
          $limit: Int
          $recommendationMax: Int
          $banned_formats: [MediaFormat]
        ) {
          banner_anime: Media(
            sort: [TRENDING_DESC, POPULARITY_DESC]
            format_not_in: $banned_formats
            type: ANIME
            isAdult: false
            status_in: [RELEASING, FINISHED]
          ) {
            id
            genres
            bannerImage
            coverImage {
              extraLarge
            }
            format
            seasonYear
            description
            title {
              english
              romaji
              native
            }
            trailer {
              id
              site
              thumbnail
            }
          }
          trending_animes: Page(perPage: $limit) {
            media(
              sort: TRENDING_DESC
              format_not_in: $banned_formats
              type: ANIME
              isAdult: false
              status: RELEASING
            ) {
              id
              genres
              format
              seasonYear
              averageScore
              coverImage {
                color
                large
              }
              title {
                english
                romaji
                native
              }
            }
          }
          upcoming_animes: Page {
            media(
              status: NOT_YET_RELEASED
              sort: [POPULARITY_DESC, TRENDING_DESC]
            ) {
              id
              genres
              format
              seasonYear
              averageScore
              coverImage {
                color
                large
              }
              title {
                english
                romaji
                native
              }
            }
          }
          continue_watch_animes: Page(perPage: $limit) {
            media(id_in: $continueWatchIds) {
              id
              status
              format
              genres
              seasonYear
              averageScore
              coverImage {
                color
                large
              }
              nextAiringEpisode {
                episode
              }
              title {
                english
                romaji
                native
              }
            }
          }
          recommended_animes: Page(perPage: $limit) {
            media(id_in: $watchedIds, sort: POPULARITY_DESC) {
              recommendations(perPage: $recommendationMax) {
                nodes {
                  mediaRecommendation {
                    id
                    genres
                    format
                    seasonYear
                    averageScore
                    description
                    coverImage {
                      color
                      large
                    }
                    title {
                      english
                      romaji
                      native
                    }
                  }
                }
              }
            }
          }
          popular_animes: Page(perPage: $limit) {
            media(
              sort: POPULARITY_DESC
              format_not_in: $banned_formats
              type: ANIME
              isAdult: false
              status_not: NOT_YET_RELEASED
            ) {
              id
              genres
              format
              seasonYear
              averageScore
              coverImage {
                color
                large
              }
              title {
                english
                romaji
                native
              }
            }
          }
          anime_movies: Page(perPage: $limit) {
            media(
              sort: TRENDING_DESC
              type: ANIME
              isAdult: false
              format: MOVIE
              status_not: NOT_YET_RELEASED
            ) {
              id
              genres
              format
              seasonYear
              averageScore
              coverImage {
                color
                large
              }
              title {
                english
                romaji
                native
              }
            }
          }
          top_airing: Page(perPage: $limit) {
            media(
              sort: SCORE_DESC
              status: RELEASING
              type: ANIME
              isAdult: false
            ) {
              id
              genres
              format
              seasonYear
              averageScore
              coverImage {
                color
                large
              }
              title {
                english
                romaji
                native
              }
            }
          }
        }
      `,
      variables() {
        let watchedIds = randomizeAndSlice(
          this.watchedAnimeIds,
          this.feedLimit
        );
        return {
          banned_formats: config.banned_formats,
          limit: this.feedLimit,
          recommendationMax: Math.max(
            5,
            Math.ceil(this.feedLimit / watchedIds.length)
          ),
          watchedIds,
          continueWatchIds: this.continueWatchAnimes.map(
            ({ animeId }) => animeId
          ),
        };
      },
      update(data) {
        let top_airing = data.top_airing.media.map(transformFields);
        let anime_movies = data.anime_movies.media.map(transformFields);
        let popular_animes = data.popular_animes.media.map(transformFields);
        let episodesObj = {};
        for (let anime of this.continueWatchAnimes) {
          episodesObj[anime.animeId] = {
            num: anime.episodeNumber,
            completed:
              anime.watchTime / anime.episodeDuration >=
              config.episode_watched_ratio,
          };
        }
        let continue_watch_animes = data.continue_watch_animes.media
          .map(transformFields)
          .filter(
            (anime) =>
              anime.status != "RELEASING" ||
              !episodesObj[anime.id].completed ||
              (anime.nextAiringEpisode &&
                anime.nextAiringEpisode.episode - episodesObj[anime.id].num >=
                  2)
          )
          .map((anime) => ({
            ...anime,
            removeWatchedAnime: this.removeWatchedAnime,
          }));
        let trending_animes = data.trending_animes.media.map(transformFields);
        let upcoming_animes = data.upcoming_animes.media.map(transformFields);
        let recommended = data.recommended_animes.media
          .reduce((rec_list, anime) => {
            return rec_list
              .concat(
                anime.recommendations.nodes.map(
                  ({ mediaRecommendation }) => mediaRecommendation
                )
              )
              .map(transformFields);
          }, [])
          .filter((anime) => !this.watchedAnimeIds.includes("" + anime.id));
        return {
          banner_anime: data.banner_anime,
          continue_watch_animes,
          top_airing,
          upcoming_animes,
          anime_movies,
          popular_animes,
          trending_animes,
          recommended,
        };
      },
    },
  },
  created() {
    this.getWatchedAnimes();
    this.getContinueWatchList();
    this.getRecentAnimeReleases();
  },
  data() {
    return {
      homeFeed: null,
      watchedAnimeIds: [],
      continueWatchAnimes: [],
      recently_released_animes: [],
      preferredTitle,
      feedLimit: config.feed_limit,
    };
  },
  components: {
    DefaultLayout,
    CategoryAnimeSlider,
    PrimaryButton,
    BIconInfoCircle,
    TagBadge,
    WatchListButton,
    TrailerBanner,
    ShimmerPageGrid,
    ConfirmDialogue,
  },
  methods: {
    getWatchedAnimes() {
      sendEventAsync("db:getWatchedAnimes").then((animes) => {
        this.watchedAnimeIds = animes.map(({ animeId }) => animeId);
      });
    },
    getContinueWatchList() {
      sendEventAsync("db:getContinueWatchAnimes").then((animes) => {
        this.continueWatchAnimes = animes;
      });
    },
    getRecentAnimeReleases() {
      getRecentEpisodes().then((data) => {
        this.recently_released_animes = data.results;
      });
    },
    removeWatchedAnime(id) {
      this.$refs.confirmDialogue
        .show(
          "You won't see this show in Continue Watching, and your watch progress will be reset. Are you sure you continue?"
        )
        .then(() => {
          sendEventAsync("db:removeWatchedAnime", id).then(() => {
            this.homeFeed.continue_watch_animes =
              this.homeFeed.continue_watch_animes.filter((a) => {
                if (a.id === id) {
                  notificationStore.setNotification(
                    `${preferredTitle(
                      a.title
                    )} has been removed from your Continue Watch`
                  );
                  return false;
                }
                return true;
              });
          });
        }).catch(()=>{});
    },
  },
};
</script>
