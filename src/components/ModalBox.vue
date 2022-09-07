<template>
    <div v-if="show" @click="checkClose" class="fixed text-white top-0 left-0 w-full h-full overflow-hidden z-50">
        <div id="scy" class="absolute overflow-y-scroll z-10 overflow-x-hidden w-full h-full flex justify-center top-0 left-0">
            <div class="modal-wrapper">
                <div ref="modal" :style="mstyle" class="modal transition-all rounded bg-zinc-900 color-white mt-10">
                    <div class="modal-header font-bold border-b-zinc-400 border-b flex justify-end">
                        <slot name="modalHeader" />
                        <button @click="$emit('close')" class="w-[37px] h-[37px] m-2">
                            <BIconX class="text-3xl text-bold"/>
                        </button>
                    </div>
                    <div class="modal-body pt-6 px-12 pb-12">
                        <slot name="modalBody"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-overlay z-[-1] w-full h-full bg-gray-800 opacity-80 fixd top-0 left-0">
        </div>
    </div>
</template>
<script>

import { BIconX } from 'bootstrap-icons-vue';
export default {
    props: {
        show: {
            type: Boolean,
            default: true
        },
        mstyle: {
            type: String,
            default:'width: 560px'
        }
    },
    methods: {
        checkClose(e){
            if (this.$refs.modal && !this.$refs.modal.contains(e.target)){
                this.$emit('close');
            }
        }
    },
    mounted(){
        if(this.show){
            document.body.style.overflow = "hidden"
        }
    },
    unmounted(){
        document.body.style.overflow = "";
    },
    components: {
        BIconX
    },
}
</script>