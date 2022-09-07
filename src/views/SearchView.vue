<template>
<div class="main-container pt-8">
  <div v-if="results?.length > 0">
    <GridLayout>
        <router-link v-for="result in results" :key="result.id" :to="'/details/'+result?.id">
            <AnimeTile :anime="result" />
        </router-link>
    </GridLayout>
  </div>
  <div class="text-center" v-else>
    <h1 class="text-3xl ">Sorry no results found for query <b>"{{query}}"</b></h1>
  </div>
</div>
</template>

<script>
import config from '../config.json';
import AnimeTile from '@/components/AnimeTile.vue';
import { transformFields, preferredTitle } from '@/libs/utils-lib';
import GridLayout from '@/layouts/GridLayout.vue';
import { SEARCH_QUERY } from '@/apollo/queries';
export default {
    data(){
        return { 
            results: null,
            preferredTitle
        }
    },
    props: {
        query: String
    },
    apollo: {
        results: {
            query: SEARCH_QUERY,
            variables(){
                return { title: this.query, banned_formats: config.banned_formats }
            },
            update(data){
                return data.results.media.map(transformFields);
            }
        },
    },
    components: {
    AnimeTile,
    GridLayout,
}
}
</script>

<style>

</style>