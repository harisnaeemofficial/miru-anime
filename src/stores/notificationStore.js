import { reactive } from 'vue';
const timeOut = 4000;
const store = reactive({
    notification: null,
    clearNotification(){
        this.notification = null;
    },
    setNotification(notification){
        this.notification = notification;
        setTimeout(this.clearNotification.bind(this), timeOut);
    }
})
export default store;