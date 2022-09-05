<template>
  <BackLayout>
    <div class="details">
      <ShimmerBox v-if="$apollo.loading || isLoading" height="28rem" />
      <ImageBanner v-else :image="anime.cover">
        <div class="px-5">
          <h1 class="text-5xl font-bold line-clamp-1">
            {{ preferredTitle(anime.title) }}
          </h1>
          <div class="ml-[250px] mt-9 px-9">
            <div>
              <TagBadge v-for="genre in anime.genres" :key="genre">{{
                genre
              }}</TagBadge>
              <span class="dot" />
              <span class="text-lg text-bold">{{ anime.type }}</span>
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
              <WatchListButton
                :id="+anime.id"
                :title="preferredTitle(anime.title)"
              />
            </div>
          </div>
        </div>
      </ImageBanner>
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
            <div :style="{ '--theme-color': anime.color }" v-else>
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
                      :animeId="+anime.id"
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
                      overflow-hidden
                      2xl:grid-cols-5
                      lg:grid-cols-4
                      md:grid-cols-3
                      sm:grid-cols-2
                      gap-y-4
                    "
                  >
                    <router-link
                      v-for="relation in anime.relations"
                      :key="relation.id"
                      :to="`/details/${relation.id}`"
                    >
                      <AnimeTile :anime="relation" />
                    </router-link>
                  </div>
                </template>

                <template v-slot:characters>
                  <div
                    class="
                      grid
                      mt-5
                      xl:grid-cols-2
                      gap-y-8
                      lg:grid-cols-1
                      sm:grid-cols-1
                    "
                  >
                    <div
                      class="
                        flex
                        bg-slate-50
                        border-slate-500
                        rounded
                        justify-between
                        shadow
                        w-[400px]
                        h-[80px]
                      "
                      v-for="character in anime.characters"
                      :key="character.id"
                    >
                      <div class="flex gap-x-3">
                        <img class="rounded-l" :src="character.image" />
                        <div class="flex py-3 flex-col justify-between">
                          <span> {{ character.name.userPreferred }}</span>
                          <span class="text-xs text-gray-500">{{
                            character.role
                          }}</span>
                        </div>
                      </div>
                      <div class="flex flex-row-reverse gap-x-4">
                        <img
                          class="rounded-r"
                          :src="character.voiceActors.at(-1)?.image"
                        />
                        <span class="py-3 text-right">
                          {{
                            character.voiceActors.at(-1)?.name.userPreferred
                          }}</span
                        >
                      </div>
                    </div>
                  </div>
                </template>
              </TabNavigation>
              <div
                v-else-if="anime.episodes?.length < 1"
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
import CategoryAnimeSlider from "@/components/CategoryAnimeSlider.vue";
import ImageBanner from "@/components/ImageBanner.vue";
import TagBadge from "@/components/TagBadge.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import BackLayout from "@/layouts/BackLayout.vue";
import TruncatedTextWithMore from "@/components/TruncatedTextWithMore.vue";
import TrailerVideo from "@/components/TrailerVideo.vue";
import TabNavigation from "@/components/TabNavigation.vue";
import WatchListButton from "@/components/WatchListButton.vue";
import EpisodesList from "@/components/EpisodesList.vue";
import EpisodeItem from "@/components/EpisodeItem.vue";
import ShimmerBox from "@/components/ShimmerBox.vue";
import { BIconPlayFill } from "bootstrap-icons-vue";
import {
  getAnimeInfo,
  getAnimeFromAnilistOnly,
  getAllAnimeProviders,
  setAnimeProvider,
} from "@/libs/anime-lib";
import {
  createWatchId,
  transformFields,
  preferredTitle,
} from "@/libs/utils-lib";
import { sendEventAsync } from "@/libs/ipc-lib";
import { getOption, setOption } from "@/libs/settings-lib";
import AnimeTile from "@/components/AnimeTile.vue";

export default {
  name: "DetailsView",
  data() {
    return {
      isLoading: true,
      anime: null,
      availableTabs: [],
      watchedEpisodes: [],
      playBtnState: {},
      selected_provider: null,
      provider_list: [],
      preferredTitle,
    };
  },
  created() {
    this.provider_list = getAllAnimeProviders();
    this.selected_provider = getOption("provider");
    setAnimeProvider(this.selected_provider);
    this.$watch(() => this.$route.params, this.getAnime, { immediate: true });
  },
  methods: {
    getAnime() {
      this.isLoading = true;
      let animeId = +this.$route.params.animeId;
      if (animeId) {
        getAnimeInfo(animeId)
          .then((anime) => (this.anime = anime))
          .catch(
            async () =>
              (this.anime = transformFields(
                await getAnimeFromAnilistOnly(animeId)
              ))
          )
          .then(() => {
            this.anime.id = +this.anime.id;
            this.anime.relations = this.anime.relations
              .map((a) => ({
                ...a,
                genres: [a.relationType.replace("_", " ")],
              }))
              .filter(({ type }) => !config.banned_formats.includes(type));
            this.anime.episodes =
              this.anime.episodes?.filter((ep) => ep.id) || [];
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
        setOption("provider", this.selected_provider);
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
        this.anime.episodes &&
        this.anime.episodes.length != 0 &&
        this.anime.type != "MOVIE" &&
        this.anime.status != "Not yet aired"
      )
        availableTabs.push("episodes");
      if (this.anime.trailer?.id) availableTabs.push("trailer");
      if (this.anime.relations.length > 0) availableTabs.push("related");
      this.availableTabs = availableTabs;
      if (this.anime.characters.length > 0) availableTabs.push("characters");
    },
    updatePlayBtnState() {
      let btnText = "Start Watching";
      let currentEp = this.watchedEpisodes[0];
      let firstEp = this.anime?.episodes[0];
      let epId = null,
        epNo = firstEp?.number || 1;
      if (this.anime?.episodes != undefined) {
        if (currentEp) {
          epNo =
            currentEp.watchTime / currentEp.episodeDuration >=
            config.episode_watched_ratio
              ? currentEp.episodeNumber + 1
              : currentEp.episodeNumber;
        }
        epId = this.anime.episodes.find((ep) => ep.number == epNo)?.id;
        if (this.watchedEpisodes.length > 1 && epId == undefined) {
          btnText = "Watch Again";
          epNo = firstEp.number;
          epId = firstEp.id;
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
    ImageBanner,
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
    AnimeTile,
  },
};
</script>