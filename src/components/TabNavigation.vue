<template>
    <div class="tab-nav">
        <div class="flex">
            <div class="w-full border-b-2 border-slate-100">
                <ul class="flex mb-0 gap-x-3 list-none pb-4 flex-row">
                    <li v-for="tab in tabs" :key="tab" class="hover:cursor-pointer mr-2 last:mr-0 text-center">
                        <h2 @click="switchTab(tab)" :class="{'tab-active': activeTab === tab}" class="tab">{{tab}}</h2> 
                    </li>
                </ul>
            </div>
        </div>
        <div class="relative flex flex-col bg-white w-full mb-6">
                <div class="py-5 flex-auto">
                    <div class="tab-content tab-space">
                        <slot :name="activeTab"/>
                    </div>
                </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        tabs: Array
    },
    data(){
        return {
            activeTab: null
        }
    },
    methods: {
        switchTab(name){
            this.activeTab = name;
        }
    },
    created() {
        this.switchTab(this.tabs[0]);
    },
    watch: {
        tabs () {
            let current_tab = this.tabs.includes(this.activeTab) ? this.activeTab : this.tabs[0]
            this.switchTab(current_tab);
        }
    }
}
</script>

<style>
.tab-active {
    @apply text-white bg-blue-600;
}
.tab {
    @apply capitalize px-7 py-2 rounded-lg text-xl;
}
</style>