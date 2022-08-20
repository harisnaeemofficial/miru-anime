<template>
  <div>
    <div class="px-5 py-3 grid grid-cols-[30px_auto] max-h-[100px]">
        <div>
            {{ episode.number }}
        </div>
        <div class="flex max-h-full my-2">
            <div class="img-cover rounded bg-black min-w-[160px] relative">
                <img class="max-h-[90px] mx-auto" :src="episode?.image" />
                <div class="absolute bottom-0 w-full" v-if="episode.watchedPercentage">
                    <StatusBar :percentage="episode.watchedPercentage" />
                </div>
                <span class="top-1 left-1 text-xs absolute bg-white px-1 py-0.5 rounded-sm" v-if="badge">{{badge}}</span>
            </div>
            <div class="ml-3 w-full">
                <div class="line-clamp-1 text-xl font-bold">
                    <span>{{episodeTitle}}</span>
                </div>
                <span v-if="episode.description" class="line-clamp-2">
                    {{episode.description}}
                </span>
                <span v-else>
                    The description for {{episodeTitle}} ( Episode no.{{episode.number}} ) is not available for now.
                </span>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import StatusBar from './StatusBar.vue';
export default {
    name: "EpisodeItem",
    data() {
        return { episodeTitle: null };
    },
    props: {
        episode: Object,
        badge: String
    },
    mounted() {
        this.episodeTitle = this.episode.title != null ? this.episode.title : `Episode ${this.episode.number}`;
    },
    components: { StatusBar }
};
</script>