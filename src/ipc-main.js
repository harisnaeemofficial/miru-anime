import { ipcMain } from "electron";
import { 
    addToWatchList,
    removeFromWatchList,
    getContinueWatchAnimes,
    addWatchedAnime,
    removeWatchedAnime,
    getWatchList,
    addWatchedEpisode,
    updateEpisodeWatchTime,
    updateWatchedAnimeWatchedAll,
    getEpisodeWatchTime,
    getWatchedEpisodes,
    getWatchedAnimes
} from "./db";

export default function registerChannelEvents() {
    ipcMain.handle("db:addToWatchList", async (_, ...args) => {
        return await addToWatchList(...args);
    })
    ipcMain.handle("db:removeFromWatchList", async (_, ...args) => {
        return await removeFromWatchList(...args);
    })
    ipcMain.handle("db:getWatchList", async () => {
        return await getWatchList();
    })
    ipcMain.handle("db:addWatchedAnime", async (_, ...args)=> {
        return await addWatchedAnime(...args);
    })
    ipcMain.handle("db:updateWatchedAnimeWatchedAll", async (_, ...args)=> {
        return await updateWatchedAnimeWatchedAll(...args);
    })
    ipcMain.handle("db:getContinueWatchAnimes", async () => {
        return await getContinueWatchAnimes();
    })
    ipcMain.handle("db:removeWatchedAnime", async (_, ...args) => {
        return await removeWatchedAnime(...args);
    })
    ipcMain.handle("db:addWatchedEpisode", async (_, ...args) => {
        return await addWatchedEpisode(...args);
    })
    ipcMain.handle("db:getWatchedAnimes", async () => {
        return await getWatchedAnimes();
    })
    ipcMain.handle("db:updateEpisodeWatchTime", async (_, ...args) => {
        return await updateEpisodeWatchTime(...args);
    })
    ipcMain.handle("db:getEpisodeWatchTime", async (_, ...args) => {
        return await getEpisodeWatchTime(...args);
    })
    ipcMain.handle("db:getWatchedEpisodes", async (_, ...args) => {
        return await getWatchedEpisodes(...args);
    })
}