<template>
<DefaultLayout>
  <div>My List</div>
</DefaultLayout>
</template>
<script>
import { sendEventAsync } from '@/libs/ipc-lib'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
export default {
    created() {
        sendEventAsync("db:getWatchList", null).then(console.log);
    },
    components: { DefaultLayout }
}
</script>

<style>

</style>