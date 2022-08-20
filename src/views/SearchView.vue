<template>
<div class="default-layout-main pt-8">
  <div v-if="results?.length > 0" class="grid 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-x-4 gap-y-5">
    <router-link v-for="result in results" :key="result.id" :to="'/details/'+result?.id">
        <AnimeTile :anime="result" />
    </router-link>
  </div>
  <div class="text-center" v-else>
    <h1 class="text-3xl ">Sorry no results found for query <b>"{{query}}"</b></h1>
  </div>
</div>
</template>

<script>
import AnimeTile from '@/components/AnimeTile.vue';
import {transformFields} from '@/libs/utils-lib';
import gql from 'graphql-tag';
export default {
    data(){
        return {results: null}
    },
    props: {
        query: String
    },
    apollo: {
        results: {
            query: gql`query ($title: String!){
                    results: Page {
                        media(search: $title, type: ANIME, isAdult: false, format_not_in: [MUSIC, MANGA, NOVEL, TV_SHORT]){
                            id
                            coverImage {
                                large
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
                return { title: this.query }
            },
            update(data){
                return data.results.media.map(transformFields);
            }
        },
    },
    components: {
        AnimeTile,
    }
}
</script>

<style>

</style>