<template>
  <BackLayout :closePath="'details/'+watchInfo?.animeId">
    <VideoPlayer
      :hlsSrc="watchInfo?.streamUrl"
      @ended="showNextEpisode"
      @timeupdate="updateWatchedDuration"
      @play="addEpisodeToWatched"
      ref="videoPlayer"
      autoplay
    >
      <template v-slot:innerVideo>
        <track v-for="(subtitle, index) in watchInfo?.subtitles" :key="index" kind="captions" :default="subtitle.lang == storedSettings.preferredSubtitleLang" :label="subtitle.lang" :src="subtitle.url"/>
        <track kind="thumbnails" :src="watchInfo?.thumbnails?.url"/>
      </template>
      <template v-slot:nextVideoMetaData>
        <div
          v-if="nextEpisode"
          class="
            opacity-75
            hover:opacity-100
            w-[380px]
            flex
            items-center
            justify-items-center
          "
        >
          <button
            @click="showNextEpisode"
            class="w-[32px] aspect-square play_next_btn rounded-[50%]"
          >
            <BIconPlayFill class="text-3xl mx-auto" />
          </button>
          <div class="ml-4">
            <div class="mb-2">UP NEXT</div>
            <h1 class="text-2xl mb-0.5">{{ watchInfo?.animeTitle?.english }}</h1>
            <div class="text-clamp-2">
              <div v-if="nextEpisode.title">
                E{{nextEpisode?.number}} - {{nextEpisode.title}}
              </div>
              <div v-else>Episode {{ nextEpisode?.number }}</div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:widgetOverlay>
        <div class="text-white absolute bottom-32 left-10" v-if="watchInfo?.skipIntro">
          <button class="border-2 border-white text-white text-xl px-7 py-1 rounded font-meduim min-h-[32px] hover:opacity-100 hover:bg-white hover:text-black"
          @click="skipIntro"
          v-if="watchedDuration > watchInfo.skipIntro.start && watchedDuration < watchInfo.skipIntro.end">
            Skip Intro
          </button>
        </div>
      </template>
    </VideoPlayer>
  </BackLayout>
</template>

<script>
import config from '../config.json';
import BackLayout from "@/layouts/BackLayout.vue";
import VideoPlayer from "@/components/VideoPlayer.vue"
import { BIconPlayFill } from "bootstrap-icons-vue";
import { getAnimeInfo, getEpisodeSources } from "@/libs/anime-lib";
import { createWatchId, decodeWatchId } from "@/libs/utils-lib";
import { sendEventAsync } from "@/libs/ipc-lib";

export default {
  name: "WatchView",
  data() {
    return {
      watchInfo: null,
      watchedDuration: null,
      nextEpisode: null,
      storedSettings: {
        preferredSubtitleLang: "English"
      },
    };
  },
  components: {
    BackLayout,
    VideoPlayer,
    BIconPlayFill
  },
  methods: {
    seekToTime(time){
      if (this.$refs.videoPlayer.$refs.video)
        this.$refs.videoPlayer.$refs.video.currentTime = time || 0;
    },
    updateWatchInfo() {
      if (this.$route.params.watchId) {
        this.watchInfo = decodeWatchId(this.$route.params.watchId);
        getAnimeInfo(this.watchInfo.animeId).then(anime => {
          this.nextEpisode = anime.episodes.at(this.watchInfo.episodeNumber + 1)
          this.watchInfo.animeTitle = anime.title
          this.watchInfo.animeStatus = anime.status
        })
        getEpisodeSources(this.watchInfo.episodeId).then((streamData) => {
          let subtitles = [], thumbnailTrack = [];
          for (let subtitle of streamData.subtitles){
              if (subtitle.url.includes("thumbnails/sprite")){
                thumbnailTrack = subtitle;
                continue;
              }
            subtitles.push(subtitle)
          }
          this.watchInfo.thumbnails = thumbnailTrack;
          this.watchInfo.subtitles = subtitles;
          this.watchInfo.skipIntro = streamData.intro
          this.watchInfo.streamUrl = streamData.sources.at(-1).url
          this.watchInfo.watchedAll = false;
        });
        sendEventAsync("db:getEpisodeWatchTime", this.watchInfo.animeId, this.watchInfo.episodeNumber)
        .then( (response) => {
            this.watchedDuration =  response?.watchTime;
            this.seekToTime(this.watchedDuration)
        });
      }
    },
    addEpisodeToWatched(ev) {
      if (this.watchedDuration == null){
          sendEventAsync("db:addWatchedAnime", this.watchInfo.animeId).catch(() => {})
          sendEventAsync("db:addWatchedEpisode", this.watchInfo.animeId, this.watchInfo.episodeNumber, ev.target.duration)
          .then(() => this.watchedDuration = 0);
      }
    },
    updateWatchedDuration(ev){
        this.watchedDuration = ev.target.currentTime;
        if (!this.nextEpisode && (this.watchedDuration / ev.target.duration >= config.episode_watched_ratio) && this.watchInfo.animeStatus == 'Completed' && this.watchInfo.watchedAll == false)
          sendEventAsync("db:updateWatchedAnimeWatchedAll", this.watchInfo.animeId, true)
          .then(()=> this.watchInfo.watchedAll = true);
        sendEventAsync("db:updateEpisodeWatchTime", this.watchInfo.animeId, this.watchInfo.episodeNumber, this.watchedDuration);
    },
    showNextEpisode(){
      if (this.nextEpisode)
      this.$router.push(`/watch/${createWatchId(this.nextEpisode.id, this.watchInfo.episodeNumber + 1, this.watchInfo.animeId)}`)
    },
    skipIntro(){
      this.seekToTime(this.watchInfo.skipIntro.end);
    },
  },
  mounted() {
    this.$watch(() => this.$route.params.watchId, this.updateWatchInfo, {
      immediate: true,
    });
  },
};
</script>

<style>
.play_next_btn {
  box-shadow: 0 0 0 2px hsl(0deg 0% 100% / 40%);
}
</style>