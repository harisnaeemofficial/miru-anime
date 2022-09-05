<template>
  <DefaultLayout :addScrollEvents="true">
    <div v-if="$apollo.loading">
      <ShimmerPageGrid />
    </div>
    <div v-else class="overflow-hidden">
      <SliderBanner :images="bannerAnimes.map((a) => a.cover)">
        <div
          v-for="(anime, i) in bannerAnimes"
          :key="anime.id"
          class="min-w-full"
        >
          <div class="banner_anime_info lg:w-1/2 px-24">
            <h1 class="text-4xl font-bold">
              <span class="text-primary-green">#{{ i + 1 }}</span> this season
            </h1>
            <h1 class="mt-8 text-5xl font-bold">
              {{ preferredTitle(anime.title) }}
            </h1>
            <div class="mt-4">
              <TagBadge v-for="genre in anime.genres" :key="genre">{{
                genre
              }}</TagBadge>
              <span class="dot" />
              <span class="text-lg text-bold">{{ anime.format }}</span>
              <span class="dot" />
              <span class="text-lg text-bold">{{ anime.seasonYear }}</span>
            </div>
            <p
              class="text-lg mt-2 line-clamp-6"
              v-html="`<span>${anime.description}</span>`"
            />
            <div class="mt-3 flex gap-x-2">
              <router-link :to="'/details/' + anime.id">
                <PrimaryButton>
                  <span class="flex items-center gap-x-2">
                    <BIconInfoCircle />
                    <span class="mr-2"> View Details </span>
                  </span>
                </PrimaryButton>
              </router-link>
              <WatchListButton
                :id="anime.id"
                :title="anime.title.english || anime.title.userPreferred"
              />
            </div>
          </div>
        </div>
      </SliderBanner>
      <div class="tv-view-container main-container-fluid">
        <CategoryAnimeSlider
          v-for="(animes, key) in browseFeed"
          :key="key"
          :animes="animes"
          :categoryTitle="animeGenres[key]"
          :viewAll="`?collection=${$route.params.browse_type}-${key.toLocaleLowerCase()}`"
        />
      </div>
    </div>
  </DefaultLayout>
</template>

<script>
import config from '@/config.json';
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { BIconInfoCircle } from "bootstrap-icons-vue";
import { getCurrentSeason, transformFields, preferredTitle } from "@/libs/utils-lib";
import gql from "graphql-tag";
import SliderBanner from "@/components/SliderBanner.vue";
import WatchListButton from "@/components/WatchListButton.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import ShimmerPageGrid from "@/components/ShimmerPageGrid.vue";
import TagBadge from "@/components/TagBadge.vue";
import { animeGenres } from "@/libs/anime-lib";
import CategoryAnimeSlider from "@/components/CategoryAnimeSlider.vue";

function browseQuery() {
  return `
    query ($format: MediaFormat, $perPage: Int){
    ${Object.keys(animeGenres)
      .map(
        (key) => ` ${key}: Page(perPage: $perPage) {
      media(
        sort: POPULARITY_DESC
        type: ANIME
        format: $format
        isAdult: false
        genre_in: ["${animeGenres[key]}"]
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
    `
      )
      .join("")}
  }`;
}
export default {
  data() {
    return {
      browseFeed: null,
      bannerAnimes: null,
      animeGenres,
      preferredTitle,
    };
  },
  components: {
    DefaultLayout,
    SliderBanner,
    WatchListButton,
    PrimaryButton,
    BIconInfoCircle,
    ShimmerPageGrid,
    TagBadge,
    CategoryAnimeSlider,
  },
  apollo: {
    bannerAnimes: {
      query: () => gql`
        query (
          $format: MediaFormat
          $season: MediaSeason
          $seasonYear: Int
          $limit: Int
        ) {
          Page(perPage: $limit) {
            media(
              sort: POPULARITY_DESC
              type: ANIME
              status_not: NOT_YET_RELEASED
              format: $format
              isAdult: false
              season: $season
              seasonYear: $seasonYear
            ) {
              id
              genres
              bannerImage
              format
              description
              seasonYear
              coverImage {
                extraLarge
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
        return {
          seasonYear: new Date().getFullYear(),
          limit: 5,
          season: getCurrentSeason(),
          format: this.anilist_format(),
        };
      },
      update(data) {
        return data.Page.media.map(transformFields);
      },
    },
    browseFeed: {
      query: () => gql(browseQuery()),
      variables() {
        return {
          format: this.anilist_format(),
          perPage: config.feed_limit,
        };
      },
      update(data) {
        let result = {};
        for (let genre in data) {
          result[genre] = data[genre].media.map(transformFields);
        }
        return result;
      },
    },
  },
  methods: {
    anilist_format() {
      let type = this.$route.params.browse_type;
      return type == "tv" ? "TV" : type == "movies" ? "MOVIE" : "";
    },
  },
};
</script>

<style>
</style>