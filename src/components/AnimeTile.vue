<template>
  <div class="anime_tile relative w-[185px]">
    <div>
      <img
        class="anime_tile__img h-[265px] object-cover w-full rounded"
        :src="anime.image"
      />
    </div>
    <div class="mt-2 flex items-start h-12">
      <p class="anime_tile__title grow line-clamp-2">
        {{ preferredTitle(anime.title) }}
      </p>
      <div class="relative">
        <button
          ref="contextMenuToggle"
          class="p-2 context-menu-btn"
          @click.prevent="toggleContextMenu"
        >
          <BIconThreeDotsVertical />
        </button>
        <div
          ref="contextMenu"
          class="
            context-menu
            drop-shadow-xl
            bg-white
            absolute
            left-0
            rounded
            w-[238px]
            bottom-full
            z-40
          "
          :class="{ invisible: contextMenuClosed }"
        >
          <div class="px-2 py-2 h-full">
            <ul>
              <li
                @click.prevent
                class="
                  rounded
                  hover:bg-slate-200
                "
              >
                <WatchListButton :id="+anime.id" :title="preferredTitle(anime.title)" type="menu-item" />
              </li>
              <li
                v-if="anime.removeWatchedAnime"
                @click.prevent="anime.removeWatchedAnime(anime.id)"
                class="
                  flex
                  rounded
                  gap-x-3
                  px-4
                  py-2
                  hover:bg-slate-200
                  items-center
                "
              >
                <BIconXCircleFill class="text-xl" /> Remove from Group
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div
      class="
        blur-overlay
        rounded
        absolute
        top-0
        w-full
        h-[265px]
        bg-transparent-dark
        left-0
      "
    >
      <div class="relative text-white py-2 px-3 w-full h-full">
        <div class="mb-2">
          <span v-if="anime.format">{{ anime.format }}</span>
          <span v-if="anime.releaseDate">
            <span class="dot" />
            {{ anime.releaseDate }}
          </span>
        </div>
        <div v-if="anime.rating" class="flex text-xl space-x-2 items-center">
          <h2>{{ anime.rating }}%</h2>
          <BIconHandThumbsUpFill
            :style="{
              color:
                anime.rating > 80
                  ? '#50C878'
                  : anime.rating > 70
                  ? '#FFC300'
                  : anime.rating > 50
                  ? '#FF5733'
                  : 'red',
            }"
          />
        </div>
        <div
          class="
            text-5xl
            absolute
            top-0
            left-0
            w-full
            h-full
            flex
            justify-center
            items-center
          "
        >
          <BIconArrowRightCircleFill class="shadow-lg" />
        </div>
        <div
          v-if="anime.genres"
          class="
            rounded-b
            bg-black
            w-full
            left-0
            px-4
            text-center
            py-2
            overflow-hidden
            absolute
            bottom-0
          "
        >
          <TagBadge
            v-for="genre in anime.genres?.slice(0, 1)"
            :key="genre"
            :color="anime.color"
            >{{ genre }}</TagBadge
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TagBadge from "./TagBadge.vue";
import { preferredTitle } from '@/libs/utils-lib';
import {
  BIconHandThumbsUpFill,
  BIconXCircleFill,
  BIconArrowRightCircleFill,
  BIconThreeDotsVertical,
} from "bootstrap-icons-vue";
import WatchListButton from "./WatchListButton.vue";
export default {
  data() {
    return {
      contextMenuClosed: true,
      preferredTitle
    };
  },
  methods: {
    toggleContextMenu() {
      this.contextMenuClosed = !this.contextMenuClosed;
      this.applyBoxStyle();
    },
    onDocumentMouseDown(e) {
      if (
        e.target == this.$refs.contextMenuToggle ||
        this.$refs.contextMenuToggle.contains(e.target)
      )
        return;
      this.contextMenuClosed = !this.$refs.contextMenu.contains(e.target);
    },
    applyBoxStyle() {
      let boundingRect = this.$refs.contextMenu.getBoundingClientRect();
      if (boundingRect.x + boundingRect.width > window.innerWidth) {
        this.$refs.contextMenu.style.transform = `translateX(-90%)`;
      } else {
        this.$refs.contextMenu.style.transform = "";
      }
    },
  },
  mounted() {
    document.addEventListener("mousedown", this.onDocumentMouseDown);
  },
  unmounted() {
    document.removeEventListener("mousedown", this.onDocumentMouseDown);
  },
  props: {
    anime: Object,
  },
  components: {
    TagBadge,
    BIconHandThumbsUpFill,
    BIconXCircleFill,
    BIconArrowRightCircleFill,
    BIconThreeDotsVertical,
    WatchListButton
},
};
</script>
<style scoped>
.anime_tile:hover .blur-overlay {
  display: block;
}
.blur-overlay {
  display: none;
}
.anime_tile__img {
  box-shadow: 0 14px 30px rgba(103, 132, 187, 0.15),
    0 4px 4px rgba(103, 132, 187, 0.05);
}
</style>