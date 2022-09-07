<template>
  <ModalBox
    @close="closeModal"
    mstyle="width: 90vw"
  >
    <template v-slot:modalHeader>
      <h1 class="text-xl text-center leading-[3] grow uppercase">
        <span class="pl-12">
          {{ $route.query.collection.replace("_", " ") }}
        </span>
      </h1>
    </template>
    <template v-slot:modalBody>
      <div
        :class="{'min-h-[75vh]': !$apollo.loading}"
        class="
          grid
          2xl:grid-cols-6
          xl:grid-cols-5
          lg:grid-cols-4
          md:grid-cols-3
          sm:grid-cols-2
          grid-cols-1
          gap-y-8
          justify-evenly 
          justify-items-center
        "
      >
        <router-link
          v-for="anime in collection"
          :key="anime.id"
          :to="'/details/' + anime.id"
        >
          <AnimeTile :anime="anime" />
        </router-link>
      </div>
      <div
        class="text-center mt-5"
        ref="sensor"
        :class="{ invisible: !$apollo.loading }"
      >
        Loading...
      </div>
    </template>
  </ModalBox>
</template>

<script>
import scrollMonitor from "scrollmonitor";
import config from "@/config.json";
import ModalBox from "@/components/ModalBox.vue";
import AnimeTile from "@/components/AnimeTile.vue";
import { COLLECTIONS_QUERIES, PLACEHOLDER_QUERY } from "@/apollo/queries";
import { transformFields } from "@/libs/utils-lib";
import { animeGenres } from "@/libs/anime-lib";
import { sendEventAsync } from "@/libs/ipc-lib";
export default {
  data() {
    return {
      collection: [],
      page: 1,
      hasNextPage: false,
      watchedAnimeIds: []
    };
  },
  apollo: {
    collection: {
      query() {
        if (!this.$route.query.collection) return PLACEHOLDER_QUERY;
        let format = this.$route.query.collection.split("_")[0];
        if (format == "tv" || format == "movies") {
          let genre = this.$route.query.collection.replace(`${format}_`, "");
          format = format == "movies" ? "MOVIE" : format.toLocaleUpperCase();
          genre = animeGenres[genre.toLocaleUpperCase()];
          return COLLECTIONS_QUERIES["format-genre"](format, genre);
        }
        return COLLECTIONS_QUERIES[this.$route.query.collection];
      },
      variables() {
        return { page: this.page, banned_formats: config.banned_formats, continueWatchIds: this.watchedAnimeIds };
      },
      update(data) {
        this.hasNextPage = data?.Page?.pageInfo.hasNextPage;
        return this.collection.concat(data?.Page?.media.map(transformFields) || []);
      },
    },
  },
  methods: {
    closeModal() {
      this.$router.replace({ query: null });
    },
  },
  components: { ModalBox, AnimeTile },
  created(){
    if(this.$route.query.collection == 'continue_watch')
    sendEventAsync("db:getContinueWatchAnimes").then((animes) => {
        this.watchedAnimeIds = animes.map(({ animeId }) => animeId);
    }); 
  },
  mounted() {
    var containerElement = document.getElementById("scy");
    if (!this.$refs.sensor || !containerElement) return;
    var containerMonitor = scrollMonitor.createContainer(containerElement);
    var elementWatcher = containerMonitor.create(this.$refs.sensor);
    elementWatcher.enterViewport(() => {
      if (this.hasNextPage) {
        this.$apollo.queries.collection.fetchMore({
            variables: {
                page: ++this.page,
            }
        });
      }
    });
  },
};
</script>

<style>
</style>