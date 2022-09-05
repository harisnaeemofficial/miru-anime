<template>
  <ModalBox v-if="$route.query.collection" @close="closeModal">
    <template v-slot:modalHeader>
        <h1 class="text-xl leading-[3] pl-8 grow uppercase">{{$route.query.collection.replace("-", " ")}}</h1>
    </template>
    <template v-slot:modalBody>
        <GridLayout>
            Welcome.
        </GridLayout>
    </template>
  </ModalBox>
</template>

<script>
import ModalBox from '@/components/ModalBox.vue';
import GridLayout from '@/layouts/GridLayout.vue';
export default {
    components: { ModalBox, GridLayout },
    methods: {
        closeModal(){
            this.$router.replace({'query': null})
        }
    }
}
</script>

<style>

</style>