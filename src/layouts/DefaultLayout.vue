<template>
    <header ref="navbar" id="main-header" class="py-5 px-12 fixed transition-colors top-0 z-20 w-full" :class="{'solid': (!addScrollEvents || searchQuery !== '')}">
        <div class="flex items-center text-lg" >
            <ul class="nav-links mx-auto flex space-x-10">
                <router-link class="nav-link" to="/">Home</router-link>
                <router-link class="nav-link" to="/tv">TV</router-link>
                <router-link class="nav-link" to="/movies">Movies</router-link>
                <router-link class="nav-link" to="/my-list">My List</router-link>
            </ul>
            <div class="grow search-container justify-end flex">
                <form @submit="searchTitle" id="search-form" :class="{'expanded': searchBarVisible}" class="rounded-md py-1.5 pl-2 pr-3 flex items-center leading-6">
                    <label class="hover:cursor-pointer" @click="searchBarVisible = true" for="search-input">
                        <BIconSearch class="ml-2 mr-3"/>
                    </label>
                    <input @blur="searchBarVisible = false" id="search-input" class="bg-transparent delay-100 transition-transform scale-x-0" v-model="searchQuery" type="search" placeholder="Search a title..."/>
                    <span class="hint-text ml-auto pl-3 flex-none text-sm font-semibold hidden">
                        Esc
                    </span>
                </form>
            </div>
        </div>
    </header>
    <main class="">
        <SearchView :query="searchQuery" v-if="searchQuery !== ''" />
        <slot v-else/>
    </main>
</template>

<script>
import {BIconSearch} from "bootstrap-icons-vue";
import SearchView from "@/views/SearchView.vue";
export default {
    name: 'DefaultLayout',
    data(){
        return { searchBarVisible: false, showResults: false, searchQuery: "" }
    },
    props: {
        addScrollEvents: Boolean
    },
    methods: {
        openSearchBar(){
            this.searchBarVisible = true;
        },
        closeSearchBar(){
            this.searchBarVisible = false;
        },
        searchTitle(e){
            e.preventDefault();
        },
        handleScroll(){
            if (this.searchQuery !== '') return;
            if (window.scrollY > 50){
                this.$refs.navbar?.classList.add("solid")
            } else {
                this.$refs.navbar?.classList.remove("solid")
            }
        }
    },
    components: {
        BIconSearch,
        SearchView
    },
    created(){
        if (this.addScrollEvents)
        document.addEventListener("scroll", this.handleScroll);
    },
    onBeforeUnmount(){
        if (this.addScrollEvents)
        document.removeEventListener("scroll", this.hanfleScroll);
    }
}
</script>

<style>
#main-header .nav-link, #main-header .search-container{
    @apply text-slate-300;
}
#main-header.solid .nav-link,#main-header.solid .search-container{
    @apply text-slate-600 !important;
}
#main-header.solid {
    @apply bg-white;
    border-bottom: 2px solid rgb(226 232 240);
}
.nav-link.nav-link.router-link-active, .nav-link:hover {
    @apply font-extrabold
}
#main-header.solid .nav-link:hover {
    @apply text-black !important;
}
#main-header .nav-link:hover {
    @apply text-white;
}
#main-header .nav-link.router-link-active {
    @apply text-white ;
}
#main-header.solid .nav-link.router-link-active {
    @apply text-black !important;
}

#main-header.solid #search-form {
    @apply bg-transparent;
}
#main-header:not(.solid) #search-form.expanded {
    @apply ring-slate-300 !important;
}
#search-form {
    width: 32px;
    transition: width 100ms ease-in-out;
}
#search-form.expanded {
    @apply ring-1 ring-slate-900/10 hover:ring-slate-300 w-auto;
    background: rgba(0,0,0,0.5);
}
#search-form.expanded #search-input {
    @apply scale-x-100;
}
#search-form.expanded .hint-text {
    @apply inline-block;
}
.default-layout-main {
    @apply  mx-12 mt-20
}
</style>