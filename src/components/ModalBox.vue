<template>
    <div v-if="show" class="fixed top-0 left-0 w-screen overflow-hidden h-screen z-50">
        <div class="modal transition-all bg-zinc-900 color-white h-auto w-[560px] mt-24 mx-auto">
            <div class="modal-header font-bold border-b-zinc-400 border-b h-[52px] flex justify-end">
                <slot name="modalHeader" />
                <button @click="$emit('close')" class="w-[37px] h-[37px] m-2">
                    <BIconX class="text-3xl text-bold"/>
                </button>
            </div>
            <div class="modal-body pt-6 px-12 pb-12">
                <slot name="modalBody"/>
            </div>
        </div>
        <div  @click="$emit('close')" class="overlay-screen z-[-1] w-full h-full bg-gray-800 opacity-80 absolute top-0">
        </div>
    </div>
</template>
<script>

import { BIconX } from 'bootstrap-icons-vue';
export default {
    props: {
        show: Boolean
    },
    components: {
        BIconX
    }
}
</script>