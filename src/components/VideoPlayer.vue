<template>
  <div ref="container" class="video-container h-screen bg-black relative">
    <video
      class="h-full mx-auto"
      @ended="$emit('ended', $event)"
      @loadeddata="handleLoadedMetaData"
      @volumechange="updateVolumeState"
      @timeupdate="handleTimeUpdate"
      @pause="handlePlay"
      @play="handlePlay"
      :autoplay="autoplay"
      ref="video"
    >
      <slot name="innerVideo"/>
    </video>
    <div class="video-overlay-widgets">
      <slot name="widgetOverlay" />
    </div>
    <div
      class="
        video-controls-container
        text-white
        z-40
        opacity-0
        transition-opacity
        ease-in-out
        hover:opacity-100
        focus:opacity-100
        absolute
        bottom-0
        left-0
        w-full
      "
      :class="{ paused: isPaused }"
    >
      <div class="next-video-metadata absolute right-10 bottom-32">
        <slot name="nextVideoMetaData" />
      </div>
      <div class="video-controls flex items-center gap-3 p-3">
        <button
          @click="togglePaused"
          class="
            w-[30px]
            h-[30px]
            opacity-75
            hover:opacity-100
            transition-opacity
            text-4xl
          "
        >
          <BIconPlayFill v-if="isPaused" />
          <BIconPauseFill v-else />
        </button>
        <div class="volume-controls-container flex items-center">
          <button
            @click="toggleMuteVideo"
            class="
              w-[30px]
              h-[30px]
              opacity-75
              hover:opacity-100
              transition-opacity
              text-3xl
            "
          >
            <BIconVolumeMuteFill v-if="volumeState.muted" />
            <BIconVolumeUpFill v-else-if="volumeState.level >= 0.5" />
            <BIconVolumeDownFill v-else />
          </button>
          <input
            :value="volumeState.muted ? 0 : volumeState.level"
            class="w-0 scale-x-0 volume-slider"
            type="range"
            min="0"
            max="1"
            step="any"
            @input="changeVolume"
          />
        </div>
        <div class="current-time-container grow flex items-center pr-2">
          {{ this.currentTime }}
          <div
            :style="{
              '--timeline-percentage': completionPercentage,
              '--seek-percentage': seekPercentage,
            }"
            @mousedown="handleMouseDown"
            class="
              timeline-container
              flex
              items-center
              h-2
              hover:cursor-pointer
              grow
              px-6
            "
            @mousemove="updateTimeline"
          >
            <div
              ref="timeline"
              class="timeline bg-gray-400 rounded h-[4px] w-full relative"
              id="timeline"
            >
              <div class="preview-container">
                <canvas ref="canvas" class="absolute w-full"></canvas>
                <div class="preview-time">{{ previewTime }}</div>
              </div>
              <div class="timeline-playhead"></div>
            </div>
          </div>
          {{ this.videoDuration }}
        </div>
        <slot name="controlsRight" />
         <div class="relative subtitles-container" v-if="subtitlesData.availableSubtitles.length > 0">
          <div class="subtitles-menu w-[300px] absolute bg-gray-700 right-4 bottom-7 hidden py-4">
            <span class="block px-7 py-2 hover:font-bold hover:cursor-pointer" v-for="(subtitle, index) in subtitlesData.availableSubtitles" :key="index" @click="selectLang(subtitle)">
              {{subtitle}}
            </span>
          </div>
          <button
              @click="toggleSubtitles"
              class="
                w-[30px]
                h-[30px]
                opacity-75
                hover:opacity-100
                transition-opacity
                text-2xl
              "
            >
            <BIconBadgeCcFill v-if="subtitlesData.selectedSubtitle != 'OFF'" />
            <BIconBadgeCc v-else />
          </button>
        </div>
        <button
          @click="toggleFullscreen"
          class="
            w-[30px]
            h-[30px]
            opacity-75
            hover:opacity-100
            transition-opacity
            text-2xl
          "
        >
          <BIconFullscreenExit v-if="isFullscreen" />
          <BIconFullscreen v-else />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  BIconPlayFill,
  BIconPauseFill,
  BIconFullscreen,
  BIconFullscreenExit,
  BIconVolumeUpFill,
  BIconVolumeDownFill,
  BIconVolumeMuteFill,
  BIconBadgeCc,
  BIconBadgeCcFill,
} from "bootstrap-icons-vue";
import Hls from "hls.js";
import webvtt from 'node-webvtt';
const hls = new Hls();
export default {
  data() {
    return {
      isPaused: true,
      isFullscreen: false,
      volumeState: {
        muted: false,
        level: 1,
      },
      videoDuration: "--:--",
      currentTime: "00:00",
      previewTime: "00:00",
      completionPercentage: 0,
      seekPercentage: 0,
      isMouseDown: false,
      thumbnailsData: null,
      subtitlesData: {
        availableSubtitles: [],
        selectedSubtitle: "OFF"
      }
    };
  },
  components: {
    BIconPauseFill,
    BIconPlayFill,
    BIconFullscreen,
    BIconFullscreenExit,
    BIconVolumeUpFill,
    BIconVolumeDownFill,
    BIconVolumeMuteFill,
    BIconBadgeCc,
    BIconBadgeCcFill,
  },
  methods: {
    handlePlay(ev) {
      this.isPaused = ev.target.paused;
      this.$emit("play", ev);
    },
    togglePaused() {
      let video = this.$refs["video"];
      if (this.isPaused) {
        video.play();
      } else {
        video.pause();
      }
    },
    toggleFullscreen() {
      if (document.fullscreenElement != null) {
        document.exitFullscreen();
        this.isFullscreen = false;
      } else {
        this.$refs.container.requestFullscreen();
        this.isFullscreen = true;
      }
    },
    selectLang(lang){
      this.subtitlesData.selectedSubtitle = lang;
      for (let track of this.$refs.video.textTracks){
        if (track.label == lang){
          track.mode = 'showing';
        } else {
          track.mode = 'hidden';
        }
      }
    },
    toggleSubtitles(){
      if (this.subtitlesData.selectedSubtitle != "OFF"){
        this.selectLang('OFF');
      } else {
        this.selectLang(this.subtitlesData.availableSubtitles[0])
      }
    },
    toggleMuteVideo() {
      this.$refs.video.muted = !this.$refs.video.muted;
    },
    updateVolumeState() {
      this.volumeState.muted = this.$refs.video.muted;
      this.volumeState.level = this.$refs.video.volume;
    },
    changeVolume(e) {
      this.$refs.video.volume = e.target.value;
      this.$refs.video.muted = e.target.value == 0;
    },
    skipContent(deltaTime) {
      this.$refs.video.currentTime += deltaTime;
    },
    addThumbnailsData(track, srcUrl) {
      const parsedThumbnails = [];
      const  images = {}
      const baseUrl = srcUrl.slice(0, srcUrl.lastIndexOf('/'))
      const diff = track.cues[0].end - track.cues[0].start; // DIff might be different for different tracks need to verify.
      for (const cue of track.cues){
        let [imgSrc, dims] = cue.text.split("#");
        if (images[imgSrc] == null){
          let img = new Image();
          img.src = baseUrl + "/" + imgSrc;
          images[imgSrc] = img;
        }
        let [x, y, w, h] = dims.split("=")[1].split(",")
        parsedThumbnails.push({x, y, w, h, imgSrc})
      }
      const canvas = this.$refs.canvas;
      let ctx = canvas.getContext("2d");
      canvas.classList.add("thumbnail-img")
      this.thumbnailsData = {ctx, diff, parsedThumbnails, images}
    },
    addSubtitleData(){
      this.subtitlesData.availableSubtitles = [];
      for (let track of this.$refs.video?.textTracks) {
        if (track.kind == 'captions'){
          this.subtitlesData.availableSubtitles.push(track.label);
        }
      }
      this.subtitlesData.selectedSubtitle = document.querySelector("track[kind='captions'][default]")?.label;
    },
    formatTime(time) {
      let zeroFormatter = Intl.NumberFormat(undefined, {
        minimumIntegerDigits: 2,
      });
      if (time) {
        let secs = Math.floor(time % 60);
        let mins = Math.floor(time / 60) % 60;
        let hrs = Math.floor(time / 3600);
        return (
          (hrs == 0 ? "" : `${hrs}:`) + `${mins}:${zeroFormatter.format(secs)}`
        );
      }
      return "-- : --";
    },
    handleLoadedMetaData(ev) {
      this.$emit("loadedmetadata", ev);
      this.videoDuration = this.formatTime(ev.target.duration);
      let thumbnailTrackUrl = ev.target.querySelector("track[kind='thumbnails']")?.src;
      if (thumbnailTrackUrl){
        fetch(thumbnailTrackUrl).then(res => res.text()).then(input => {
          this.addThumbnailsData(webvtt.parse(input), thumbnailTrackUrl);
        })
      }
      this.addSubtitleData();
    },
    handleTimeUpdate(ev) {
      this.currentTime = this.formatTime(ev.target.currentTime);
      this.completionPercentage = ev.target.currentTime / ev.target.duration;
      this.$emit("timeupdate", ev);
    },
    updateTimeline(ev) {
      ev.preventDefault();
      let bRect = this.$refs.timeline.getBoundingClientRect();
      let mousePercentage =
        Math.min(Math.max(0, ev.x - bRect.x), bRect.width) / bRect.width;
      this.seekPercentage = mousePercentage;
      let previewTimeValue = parseFloat(
        mousePercentage * this.$refs.video.duration
      ).toFixed(2);
      if(this.thumbnailsData){
        let index = (previewTimeValue / this.thumbnailsData.diff) | 0;
        let thumbnailInfo = this.thumbnailsData.parsedThumbnails[index];
        if (thumbnailInfo){
          let image = this.thumbnailsData.images[thumbnailInfo.imgSrc]
          this.thumbnailsData.ctx.drawImage(image, thumbnailInfo.x, thumbnailInfo.y, thumbnailInfo.w, thumbnailInfo.h,
            0, 0, this.$refs.canvas.width, this.$refs.canvas.height
          );
        }
      }
      this.previewTime = this.formatTime(previewTimeValue);
      if (this.isMouseDown) {
        this.$refs.timeline.style.setProperty(
          "--timeline-percentage",
          this.seekPercentage
        );
        this.$refs.video.currentTime = previewTimeValue;
      }
    },
    handleMouseDown(ev) {
      ev.preventDefault();
      this.isMouseDown = ev.buttons & 1;
      if (ev.target.id == "timeline") {
        this.updateTimeline(ev);
      }
    },
    handleMouseUp() {
      this.isMouseDown = false;
    },
    handleKeyDown(ev) {
      switch (ev.key.toLocaleLowerCase()) {
        case " ":
          ev.preventDefault();
          return this.togglePaused();
        case "m":
          ev.preventDefault();
          return this.toggleMuteVideo();
        case "arrowleft":
          ev.preventDefault();
          return this.skipContent(-10);
        case "arrowright":
          ev.preventDefault();
          return this.skipContent(10);
      }
    },
  },
  props: {
    hlsSrc: String,
    autoplay: Boolean,
  },
  watch: {
    hlsSrc: function () {
      let video = this.$refs["video"];
      if (this.hlsSrc) {
        hls.loadSource(this.hlsSrc);
        hls.attachMedia(video);
        this.completionPercentage = 0;
      }
    },
  },
  mounted() {
    window.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("keydown", this.handleKeyDown);
  },
  unmounted() {
    window.removeEventListener("mouseup", this.handleMouseUp);
    window.removeEventListener("keydown", this.handleKeyDown);
  },
};
</script>

<style scoped>
.video-controls-container::before {
  content: "";
  position: absolute;
  bottom: 0;
  background: linear-gradient(to top, #000000cc, transparent);
  width: 100%;
  aspect-ratio: 6 / 1;
  z-index: -1;
  pointer-events: none;
}
.volume-controls-container:hover .volume-slider {
  width: 100px;
  transform: scaleX(1);
}
.volume-slider {
  transition: width 150ms ease-in-out, transform 150ms ease-in-out;
}
.timeline-container:hover .timeline {
  height: 100%;
}
.timeline::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 0.25rem;
  bottom: 0;
  right: calc(100% - var(--timeline-percentage) * 100%);
  background: white;
}
.timeline::after {
  content: "";
  position: absolute;
  left: calc(var(--seek-percentage) * 100%);
  height: 1rem;
  top: -50%;
  width: 3px;
  background-color: white;
  border-radius: 1rem;
  visibility: hidden;
}
.timeline-container:hover .timeline::after {
  visibility: visible;
}
.timeline-playhead {
  position: absolute;
  height: 200%;
  top: -50%;
  background-color: #fff;
  transform: scale(0);
  left: calc(var(--timeline-percentage) * 100%);
  margin-left: -0.25rem;
  border-radius: 50%;
  aspect-ratio: 1 / 1;
  transition: transform 150ms ease-in-out;
}
.preview-container {
  --height: 150px;
  position: absolute;
  top: calc(0px - var(--height) - 20px);
  visibility: hidden;
  display: flex;
  flex-direction: column;
  transition: visibility 150ms ease-in-out;
  left: calc(var(--seek-percentage) * 100%);
  height: var(--height);
  aspect-ratio: 16 / 9 ;
  margin-left: calc(0px - var(--height) * 8 / 9);
  justify-content: flex-end;
  text-align: center;
  z-index: -1;
}
.timeline-container:hover .timeline .preview-container {
  z-index: 2;
  visibility: visible;
}
video::-webkit-media-text-track-container {
 overflow: visible !important;
 transform: translateY(-40px) !important;
}
.thumbnail-img + .preview-time {
  z-index: 1;
  background: linear-gradient(to top, #000000cc, transparent);
}
.timeline-container:hover .timeline .timeline-playhead {
  transform: scale(1);
}
.paused {
  opacity: 1;
}
.subtitles-container:hover .subtitles-menu {
  display: block;
}
</style>