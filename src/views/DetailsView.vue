<template>
<BackLayout>
  <div class="details">
    <div v-if="anime">
      <AnimeBanner :bannerImage="anime.cover">
        <div class="px-5">
          <h1 class="text-5xl font-bold line-clamp-1">{{anime.title?.english || anime.title?.romaji}}</h1>
          <div class="ml-[250px] mt-9 px-9">
            <div>
              <TagBadge v-for="genre in anime.genres" :key="genre">{{genre}}</TagBadge>
              <span class="dot"/>
              <span class="text-lg text-bold">{{anilistInfo?.format}}</span>
              <span class="dot"/>
              <span class="text-lg text-bold">{{anime.releaseDate}}</span>
              <span v-if="anime.duration">
                <span class="dot"/>
                <span class="text-lg text-bold">{{anime.duration}}m</span>
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
              <router-link class="mr-4" v-if="anime?.status != 'Not yet aired' && anime?.episodes.length > 0" :to="'/watch/'+getContinueEpisodeId()">
                <PrimaryButton class="pr-9 flex items-center gap-x-1">
                  <span class="text-2xl"><BIconPlayFill/></span>
                  <span v-if="watchedEpisodes.length == 0">
                    Start Watching
                  </span>
                  <span v-else>
                    Continue Watching
                  </span>
                </PrimaryButton>
              </router-link>
              <WatchListButton :id="anime.id"/>
            </div>
          </div>
        </div>
      </AnimeBanner>
      <div class="px-12">
        <div class="lg:grid lg:grid-cols-[250px_auto] gap-x-10">
          <div class="max-w-xl mt-[-250px]">
            <div class="cover_img__wrapper">
              <img :src="anime.image" class="lg:w-full rounded"/>
            </div>
            <div class="text-lg mt-4">
                <div v-for="(name, language, index) in anime.title" :key="index">
                  <div class="py-0.5" v-if="language != 'userPreferred' && name">
                    <b class="capitalize">{{language}} Name:</b> {{name}}
                  </div>
                </div>
              <div v-if="anime.nextAiringEpisode && anime.status == 'Not yet aired'" class="py-0.5">
                <b>Release Date:</b> {{new Date(anime.nextAiringEpisode.airingTime*1000)}}
              </div>
              <div class="py-0.5"><b>Status:</b> {{anime.status}}</div>
              <div v-if="anime.rating" class="py-0.5"><b>Average Score:</b> {{anime.rating}}%</div>
              <div class="py-0.5"><b>Studios:</b> {{anime.studios.join(", ")}}</div>

            </div>
          </div>
          <div class="mt-1">
            <TabNavigation v-if="availableTabs.length > 0" :tabs="availableTabs" class="mt-8">
              <template v-slot:trailer>
                <TrailerVideo class="mx-auto" :trailer="anime.trailer"/>
              </template>
              <template v-slot:episodes>
                <div>
                    <EpisodesList :episodes="anime.episodes" :animeId="anime.id" :watched="watchedEpisodes" />
                    <div class="text-lg mt-3" v-if="anime.nextAiringEpisode">
                      <EpisodeItem badge="NEW" :episode="{
                        image: anime.image,
                        number: anime.nextAiringEpisode.episode,
                        description: `Episode ${anime.nextAiringEpisode.episode} 
                          ${anilistInfo?.episodes ? 'of '+ anilistInfo?.episodes: ''} airing in
                          ${convertToTime(+anime.nextAiringEpisode.timeUntilAiring)}`}"/>
                    </div>
                </div>
              </template>
              <template v-slot:related>
                <div class="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 gap-y-4">
                    <div class="w-[150px] relative" v-for="relation in anilistInfo?.relations" :key="relation.id">
                      <router-link :to="`/details/${relation.id}`">
                        <img class="w-full h-60" :src="relation.image" />
                        <div class="w-full text-center">{{relation.title.userPreferred}}</div>
                        <div class="absolute top-0 text-center bg-[#0000007c] text-white w-full">{{relation.relationType}}</div>
                      </router-link>
                    </div>
                </div>
              </template>
            </TabNavigation>
            <div v-else class="text-center">
              <h2 class="text-3xl font-bold">Sorry no video content for this anime were found yet.</h2>
              <p>Try again at a later date.</p>
            </div>
          </div>
        </div>
        <CategoryAnimeSlider v-if="anime.recommendations?.length > 0"
         :animes="anime.recommendations" categoryTitle="More like this"/>
      </div>
    </div>
  </div>
</BackLayout>
</template>
<script>
import gql from "graphql-tag";
import {BIconPlayFill} from 'bootstrap-icons-vue';
import CategoryAnimeSlider from "@/components/CategoryAnimeSlider.vue";
import AnimeBanner from "@/components/AnimeBanner.vue";
import TagBadge from "@/components/TagBadge.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import BackLayout from "@/layouts/BackLayout.vue";
import TruncatedTextWithMore from "@/components/TruncatedTextWithMore.vue";
import TrailerVideo from "@/components/TrailerVideo.vue";
import TabNavigation from "@/components/TabNavigation.vue";
import { getAnimeInfo, getAnimeFromAnilistOnly } from "@/libs/anime-lib";
import { createWatchId, transformFields } from "@/libs/utils-lib";
import { sendEventAsync } from "@/libs/ipc-lib";
import WatchListButton from "@/components/WatchListButton.vue";
import EpisodesList from "@/components/EpisodesList.vue";
import EpisodeItem from "@/components/EpisodeItem.vue";

export default {
  name: "DetailsView",
  data() {
      return { 
        anime: null,
        anilistInfo: null,
        availableTabs: [],
        watchedEpisodes: null
      };
  },
  apollo: {
    anilistInfo: {
      query: () => gql`
        query ($id: Int!){
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
      variables(){
        return {
          id: this.$route.params.animeId
        }
      },
      update({Media}){
        let relations = Media.relations.edges.map((relation) => {
          return {
            ...transformFields(relation.node),
            relationType: relation.relationType
          }
        }).filter( anime => anime.type == 'ANIME' && !['MUSIC', 'MANGA', 'NOVEL', 'TV_SHORT'].includes(anime.format))
        return {relations, format: Media.format, episodes: Media.episodes}
      }
    },
  },
  created(){
    this.$watch(
      () => this.$route.params,
      this.getAnime,
      { immediate: true }
    )
  },
  methods: {
    getAnime(){
      let animeId = this.$route.params.animeId;
      if (animeId){
        getAnimeInfo(animeId)
        .then(anime => {this.anime = anime; this.getAvailableTabs()})
        .catch(async () => this.anime = await getAnimeFromAnilistOnly(animeId));
        sendEventAsync("db:getWatchedEpisodes", animeId)
        .then( watchedEpisodes => this.watchedEpisodes = watchedEpisodes )
      }
    },
    convertToTime(seconds){
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      let days  = Math.floor(hours / 24);
      minutes = minutes % 60;
      hours = hours % 24;
      let time = "";
      if (days > 0) time += days + " days, "
      if (hours > 0) time += hours + " hours, "
      time += (minutes > 0) ? minutes+" mins": seconds+" seconds"
      return time;
    },
    getAvailableTabs(){
      let availableTabs = [];
      if (this.anime?.episodes.length != 0 && this.anilistInfo?.format != 'MOVIE' && this.anime?.status != 'Not yet aired')
        availableTabs.push('episodes')
      if (this.anime?.trailer.id)
        availableTabs.push('trailer')
      if (this.anilistInfo?.relations.length > 0) 
        availableTabs.push('related')
      this.availableTabs = availableTabs;
    },
    getContinueEpisodeId(){
      let epNo = this.watchedEpisodes[0]?.episodeNumber || 0;
      return createWatchId(this.anime.episodes[epNo]?.id, epNo, this.anime.id)
    },
    createWatchId
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
    EpisodeItem
}
}
</script>