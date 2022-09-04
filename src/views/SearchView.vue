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
import {transformFields} from '@/libs/utils-lib';
import gql from 'graphql-tag';
import GridLayout from '@/layouts/GridLayout.vue';
export default {
    data(){
        return {results: null}
    },
    props: {
        query: String
    },
    apollo: {
        results: {
            query: gql`query ($title: String!, $banned_formats: [MediaFormat]){
                    results: Page {
                        media(search: $title, type: ANIME, isAdult: false, format_not_in: $banned_formats){
                            id
                            genres
                            format
                            seasonYear
                            averageScore
                            coverImage {
                                large
                                color
                            }
                            title {
                                english
                                userPreferred
                            }
                        }
                    }
                }
            `,
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