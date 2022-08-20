<template>
<div class="anime_tile w-[182px] text-center">
  <div>
    <img class="anime_tile__img h-60 object-cover w-full rounded" :src="anime.image"/>
  </div>
  <p class="mt-2 h-12 line-clamp-2">{{anime.title.english || anime.title.userPreferred}}</p>
</div>
</template>

<script>
export default {
    props: {
        anime: Object
    }
}
</script>