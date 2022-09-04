import { reactive } from 'vue';
import { sendEventAsync } from '../libs/ipc-lib';
let listenersCount = 0;
const listeners = {}
const store = reactive({
    watchListIds: [],
    addWatchIdToWatchList(id){
        return sendEventAsync("db:addToWatchList", id)
        .then(() => {
            this.watchListIds.push(id);
            this.dispatchStateChange();
        });
    },
    removeIdFromWatchList(id){
        return sendEventAsync("db:removeFromWatchList", id)
        .then(() => {
            this.watchListIds = this.watchListIds.filter(_id => id !== _id);
            this.dispatchStateChange();
        });
    },
    dispatchStateChange(){
        for(let listenerKey in listeners){
            listeners[listenerKey](this.watchListIds);
        }
    },
    addListener(fnc){
        listeners[listenersCount] = fnc;
        return listenersCount++
    },
    removeListener(id){
        delete listeners[id];
    }
})
sendEventAsync("db:getWatchList", null).then(w => store.watchListIds  = w.map( anime => anime.animeId));
export default store;