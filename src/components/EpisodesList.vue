<template>
  <ul class="text-lg flex flex-col gap-y-3">
    <li v-for="episode in episodes" :key="episode.id">
      <router-link :to="'/watch/' + createWatchId(episode.id, episode.number, animeId)">
        <EpisodeItem :episode="episode" />
      </router-link>
    </li>
  </ul>
</template>

<script>
import { createWatchId } from '@/libs/utils-lib';
import EpisodeItem from './EpisodeItem.vue';
export default {
    props: {
        episodes: Array,
        animeId: String,
        watched: Array
    },
    methods: {
        createWatchId
    },
    components: {
        EpisodeItem
    },
    mounted(){
        for (let watchedEpisode of this.watched){
            let episode = this.episodes.filter(ep => ep.number == watchedEpisode.episodeNumber).at(0);
            if (episode)
              episode.watchedPercentage = (watchedEpisode.watchTime / watchedEpisode.episodeDuration) * 100;
        }
    }
};
</script>

<style>
</style>