<template>
  <BackLayout>
    <div class="details">
      <ShimmerBox v-if="$apollo.loading || isLoading" height="28rem" />
      <AnimeBanner v-else :bannerImage="anime.cover">
        <div class="px-5">
          <h1 class="text-5xl font-bold line-clamp-1">
            {{ anime.title?.english || anime.title?.romaji }}
          </h1>
          <div class="ml-[250px] mt-9 px-9">
            <div>
              <TagBadge v-for="genre in anime.genres" :key="genre">{{
                genre
              }}</TagBadge>
              <span class="dot" />
              <span class="text-lg text-bold">{{ anilistInfo?.format }}</span>
              <span class="dot" />
              <span class="text-lg text-bold">{{ anime.releaseDate }}</span>
              <span v-if="anime.duration">
                <span class="dot" />
                <span class="text-lg text-bold">{{ anime.duration }}m</span>
              </span>
            </div>
            <div class="mt-3">
              <TruncatedTextWithMore :lines="5">
                <template v-slot:text>
                  <span v-html="anime.description" />
                </template>
              </TruncatedTextWithMore>
            </div>
            <div class="mt-3 flex">
              <router-link
                class="mr-4"
                v-if="
                  anime?.status != 'Not yet aired' &&
                  anime?.episodes?.length > 0
                "
                :to="'/watch/' + playBtnState.id"
              >
                <PrimaryButton class="pr-9 flex items-center gap-x-1">
                  <span class="text-2xl"><BIconPlayFill /></span>
                  <span>
                    {{ playBtnState.text }}
                  </span>
                </PrimaryButton>
              </router-link>
              <WatchListButton :id="+anime.id" />
            </div>
          </div>
        </div>
      </AnimeBanner>
      <div class="px-12">
        <div class="lg:grid lg:grid-cols-[250px_auto] gap-x-10">
          <div class="max-w-xl mt-[-250px]">
            <div class="cover_img__wrapper min-h-[265px]">
              <ShimmerBox
                v-if="$apollo.loading || isLoading"
                height="300px"
                width="250px"
              />
              <img
                v-else
                :src="anime.image"
                class="w-[250px] lg:w-full rounded"
              />
            </div>
            <div
              class="mt-4 flex flex-col gap-y-2"
              v-if="$apollo.loading || isLoading"
            >
              <ShimmerBox v-for="i in 6" :key="i" height="2rem" />
            </div>
            <div v-else class="text-lg mt-4">
              <b>Anime Provider: </b>
              <select @change="selectProvider">
                <option
                  v-for="provider in provider_list"
                  :key="provider"
                  :value="provider"
                  :selected="provider == selected_provider"
                >
                  {{ provider }}
                </option>
              </select>
              <div v-for="(name, language, index) in anime.title" :key="index">
                <div class="py-0.5" v-if="language != 'userPreferred' && name">
                  <b class="capitalize">{{ language }} Name:</b> {{ name }}
                </div>
              </div>
              <div
                v-if="
                  anime.nextAiringEpisode && anime.status == 'Not yet aired'
                "
                class="py-0.5"
              >
                <b>Release Date:</b>
                {{ new Date(anime.nextAiringEpisode.airingTime * 1000) }}
              </div>
              <div class="py-0.5"><b>Status:</b> {{ anime.status }}</div>
              <div v-if="anime.rating" class="py-0.5">
                <b>Average Score:</b> {{ anime.rating }}%
              </div>
              <div class="py-0.5">
                <b>Studios:</b> {{ anime.studios.join(", ") }}
              </div>
            </div>
          </div>
          <div class="mt-1">
            <div class="mt-4" v-if="$apollo.loading || isLoading">
              <ShimmerBox height="70vh" />
            </div>
            <div v-else>
              <TabNavigation
                v-if="availableTabs.length > 0"
                :tabs="availableTabs"
                class="mt-8"
              >
                <template v-slot:trailer>
                  <TrailerVideo class="mx-auto" :trailer="anime.trailer" />
                </template>
                <template v-slot:episodes>
                  <div>
                    <EpisodesList
                      :episodes="anime.episodes"
                      :animeId="anime.id"
                      :watched="watchedEpisodes"
                    />
                    <div class="text-lg mt-3" v-if="anime.nextAiringEpisode">
                      <EpisodeItem
                        badge="AIRING SOON"
                        :episode="{
                          image: anime.image,
                          number: anime.nextAiringEpisode.episode,
                          description: `${
                            anime.title.english || anime.title.romaji
                          } episode ${anime.nextAiringEpisode.episode} 
                          ${
                            anilistInfo?.episodes
                              ? 'of ' + anilistInfo?.episodes
                              : ''
                          } airing in
                          ${convertToTime(
                            +anime.nextAiringEpisode.timeUntilAiring
                          )}`,
                        }"
                      />
                    </div>
                  </div>
                </template>
                <template v-slot:related>
                  <div
                    class="
                      grid
                      xl:grid-cols-6
                      lg:grid-cols-5
                      md:grid-cols-4
                      sm:grid-cols-3
                      gap-y-4
                    "
                  >
                    <div
                      class="w-[150px] relative"
                      v-for="relation in anilistInfo?.relations"
                      :key="relation.id"
                    >
                      <router-link :to="`/details/${relation.id}`">
                        <img class="w-full h-60" :src="relation.image" />
                        <div class="w-full text-center">
                          {{ relation.title.userPreferred }}
                        </div>
                        <div
                          class="
                            absolute
                            top-0
                            text-center
                            bg-transparent-dark
                            text-white
                            w-full
                          "
                        >
                          {{ relation.relationType }}
                        </div>
                      </router-link>
                    </div>
                  </div>
                </template>
              </TabNavigation>
              <div
                v-else
                class="flex flex-col items-center justify-center h-full"
              >
                <h2 class="text-3xl font-bold">
                  Sorry no video content for this anime were found yet.
                </h2>
                <p class="text-lg">Try again at a later date.</p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="anime && !($apollo.loading || isLoading)">
          <CategoryAnimeSlider
            :animes="anime.recommendations"
            categoryTitle="More like this"
          />
        </div>
      </div>
    </div>
  </BackLayout>
</template>
<script>
import config from "../config.json";
import gql from "graphql-tag";
import { BIconPlayFill } from "bootstrap-icons-vue";
import CategoryAnimeSlider from "@/components/CategoryAnimeSlider.vue";
import AnimeBanner from "@/components/AnimeBanner.vue";
import TagBadge from "@/components/TagBadge.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import BackLayout from "@/layouts/BackLayout.vue";
import TruncatedTextWithMore from "@/components/TruncatedTextWithMore.vue";
import TrailerVideo from "@/components/TrailerVideo.vue";
import TabNavigation from "@/components/TabNavigation.vue";
import {
  getAnimeInfo,
  getAnimeFromAnilistOnly,
  getAllAnimeProviders,
  setAnimeProvider,
  getAnimeProvider,
} from "@/libs/anime-lib";
import { createWatchId, transformFields } from "@/libs/utils-lib";
import { sendEventAsync } from "@/libs/ipc-lib";
import WatchListButton from "@/components/WatchListButton.vue";
import EpisodesList from "@/components/EpisodesList.vue";
import EpisodeItem from "@/components/EpisodeItem.vue";
import ShimmerBox from "@/components/ShimmerBox.vue";

export default {
  name: "DetailsView",
  data() {
    return {
      isLoading: true,
      anime: null,
      anilistInfo: null,
      availableTabs: [],
      watchedEpisodes: [],
      playBtnState: {},
      selected_provider: null,
      provider_list: [],
    };
  },
  apollo: {
    anilistInfo: {
      query: () => gql`
        query ($id: Int!) {
          Media(id: $id) {
            format
            episodes
            relations {
              edges {
                relationType(version: 2)
                node {
                  type
                  id
                  format
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
      `,
      variables() {
        return {
          id: this.$route.params.animeId,
        };
      },
      update({ Media }) {
        let relations = Media.relations.edges
          .map((relation) => {
            return {
              ...transformFields(relation.node),
              relationType: relation.relationType,
            };
          })
          .filter(
            (anime) =>
              anime.type == "ANIME" &&
              !config.banned_formats.includes(anime.format)
          );
        return { relations, format: Media.format, episodes: Media.episodes };
      },
    },
  },
  created() {
    this.$watch(() => this.$route.params, this.getAnime, { immediate: true });
  },
  mounted() {
    this.provider_list = getAllAnimeProviders();
    this.selected_provider = getAnimeProvider();
  },
  methods: {
    getAnime() {
      this.isLoading = true;
      let animeId = this.$route.params.animeId;
      if (animeId) {
        getAnimeInfo(animeId)
          .then((anime) => (this.anime = anime))
          .catch(
            async () => (this.anime = await getAnimeFromAnilistOnly(animeId))
          )
          .then(() => {
            this.isLoading = false;
            this.updatePlayBtnState();
            this.getAvailableTabs();
          });
        sendEventAsync("db:getWatchedEpisodes", animeId).then(
          (watchedEpisodes) => (this.watchedEpisodes = watchedEpisodes)
        );
      }
    },
    selectProvider(e) {
      if (setAnimeProvider(e.target.value)) {
        this.selected_provider = e.target.value;
        this.getAnime();
      }
    },
    convertToTime(seconds) {
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      let days = Math.floor(hours / 24);
      minutes = minutes % 60;
      hours = hours % 24;
      let time = "";
      if (days > 0) time += days + " days, ";
      if (hours > 0) time += hours + " hours, ";
      time += minutes > 0 ? minutes + " mins" : (seconds % 60) + " seconds";
      return time;
    },
    getAvailableTabs() {
      let availableTabs = [];
      if (
        this.anime?.episodes &&
        this.anime.episodes.length != 0 &&
        this.anilistInfo?.format != "MOVIE" &&
        this.anime?.status != "Not yet aired"
      )
        availableTabs.push("episodes");
      if (this.anime?.trailer?.id) availableTabs.push("trailer");
      if (this.anilistInfo?.relations.length > 0) availableTabs.push("related");
      this.availableTabs = availableTabs;
    },
    updatePlayBtnState() {
      let btnText = "Start Watching";
      let currentEp = this.watchedEpisodes[0];
      let epId = null, epNo = 1;
      if (this.anime?.episodes != undefined) {
        if (currentEp){
        epNo =
          currentEp.watchTime / currentEp.episodeDuration >=
          config.episode_watched_ratio
            ? currentEp.episodeNumber + 1
            : currentEp.episodeNumber;
        }
        epNo %= this.anime.episodes.length + 1;
        epNo = Math.max(epNo, 1);
        epId = this.anime.episodes.filter(ep => ep.number == epNo).at(0)?.id;
        if (this.watchedEpisodes.length > 1 && epNo == 1) {
          btnText = "Watch Again";
        } else if (this.watchedEpisodes.length > 0) {
          btnText = "Continue Watching";
        }
      }
      this.playBtnState = {
        id: epId && createWatchId(epId, epNo, this.anime.id),
        text: btnText,
      };
    },
  },
  components: {
    CategoryAnimeSlider,
    AnimeBanner,
    BIconPlayFill,
    TagBadge,
    PrimaryButton,
    BackLayout,
    TruncatedTextWithMore,
    TrailerVideo,
    TabNavigation,
    WatchListButton,
    EpisodesList,
    EpisodeItem,
    ShimmerBox,
  },
};
</script>