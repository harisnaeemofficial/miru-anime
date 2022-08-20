<template>
    <ModalBox :show="showMoreDialog" @close="showMoreDialog = false">
        <template v-slot:modalHeader>
            <h1 class="grow leading-[3] text-xl pl-8">
                FULL DESCRIPTION
            </h1>
        </template>
        <template v-slot:modalBody>
                <slot name="text" />
        </template>
    </ModalBox>    
    <div>
        <span ref="contentDiv" class="line-clamp" :style="{'-webkit-line-clamp': lines}">
            <slot name="text"/>
        </span>
        <button  v-if="contentHeight >= lines" @click="showMoreDialog = true">
            <b>SEE MORE</b>
        </button>
    </div>

</template>

<script>
import ModalBox from './ModalBox.vue';
export default {
    data(){
        return {
            contentHeight: 0,
            showMoreDialog: false
        }
    },
    props: {
        lines: Number,
    },
    mounted(){
        if (this.$refs.contentDiv){
            this.contentHeight = this.countLines(this.$refs.contentDiv);
        }
    },
    components: {
    ModalBox
},
    methods: {
        countLines(target) {
            var style = window.getComputedStyle(target, null);
            var height = parseInt(style.getPropertyValue("height"));
            var font_size = parseInt(style.getPropertyValue("font-size"));
            var line_height = parseInt(style.getPropertyValue("line-height"));
            var box_sizing = style.getPropertyValue("box-sizing");
            if(isNaN(line_height)) line_height = font_size * 1.2;
            if(box_sizing=='border-box')
            {
                var padding_top = parseInt(style.getPropertyValue("padding-top"));
                var padding_bottom = parseInt(style.getPropertyValue("padding-bottom"));
                var border_top = parseInt(style.getPropertyValue("border-top-width"));
                var border_bottom = parseInt(style.getPropertyValue("border-bottom-width"));
                height = height - padding_top - padding_bottom - border_top - border_bottom
            }
            var lines = Math.ceil(height / line_height);
            return lines;
        }
    },
}
</script>

<style>
.line-clamp {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}
</style>