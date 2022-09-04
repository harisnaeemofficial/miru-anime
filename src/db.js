import path from 'path';
import Datastore from 'nedb';
const app = require('electron').app;
const dbs = {};
const db_dir_name = path.join(app.getPath('userData'), 'db');

dbs.listDB = new Datastore({
    filename: path.join(db_dir_name, 'list.db'),
    autoload: true
});
dbs.animesDB = new Datastore({
    filename: path.join(db_dir_name, 'anime.db'),
    autoload: true
})
dbs.episodesDB = new Datastore({
    filename: path.join(db_dir_name, 'watched-eps.db'),
    autoload: true
})

dbs.listDB.ensureIndex({ fieldName: 'animeId', unique: true });
dbs.animesDB.ensureIndex({ fieldName: 'animeId', unique: true });
dbs.episodesDB.ensureIndex({ fieldName: 'animeIdEpisodeNumber', unique: true });

function NEDBPromise(queryFunction) {
    return new Promise((resolve, _) => {
        queryFunction((error, data) => resolve({ error, data }))
    })
}

export function addToWatchList(animeId) {
    return NEDBPromise(
        (cb) => dbs.listDB.insert({ animeId, addedOn: Date.now() }, cb)
    );
}
export function removeFromWatchList(animeId) {
    return NEDBPromise(
        (cb) => dbs.listDB.remove({ animeId }, cb)
    );
}
export function getWatchList() {
    return NEDBPromise(
        (cb) => dbs.listDB.find({}).sort({ addedOn: 1 }).exec(cb)
    );
}

const getAnimeIdEpisodeNumberKey = (animeId, episodeNumber) => `${animeId}${episodeNumber}`
export function addWatchedAnime(animeId) {
    return NEDBPromise(
        (cb) => dbs.animesDB.insert({ animeId, watchedAll: false }, cb)
    )
}
export function updateWatchedAnimeWatchedAll(animeId, watchedAll) {
    return NEDBPromise(
        (cb) => dbs.animesDB.update({ animeId }, { $set: { watchedAll } }, {}, cb)
    )
}
export function getContinueWatchAnimes() {
    return NEDBPromise(async (cb) => {
        dbs.animesDB.find({ watchedAll: false }, { animeId: 1, _id: 0 }, (err, animes) => {
            if (err) return cb(err, null);
            dbs.episodesDB.find({ $or: animes }, (err, episodes) => {
                if (err) return cb(err, null);
                let maxEpByAnime = {};
                for (let episode of episodes) {
                    let maxEp = maxEpByAnime[episode.animeId];
                    if (maxEp == undefined || maxEp.episodeNumber < episode.episodeNumber) {
                        maxEpByAnime[episode.animeId] = episode;
                    }
                }
                cb(null, Object.values(maxEpByAnime))
            })
        })
    })
}
export function removeWatchedAnime(animeId) {
    return NEDBPromise(
        (cb) => dbs.animesDB.remove({ animeId }, () => {
            dbs.episodesDB.remove({ animeId }, cb)
        })
    );
}
export function addWatchedEpisode(animeId, episodeNumber, episodeDuration) {
    return NEDBPromise(
        (cb) => dbs.episodesDB.insert({
            animeIdEpisodeNumber: getAnimeIdEpisodeNumberKey(animeId, episodeNumber),
            animeId,
            episodeNumber,
            episodeDuration,
            watchTime: 0
        }, cb)
    )
}
export async function getWatchedEpisodes(animeId) {
    return NEDBPromise(
        (cb) => dbs.episodesDB.find({ animeId })
            .sort({ episodeNumber: -1 })
            .projection({ episodeNumber: 1, episodeDuration: 1, watchTime: 1 }).exec(cb)
    )
}
export async function getWatchedAnimes() {
    return NEDBPromise(
        (cb) => dbs.animesDB.find({})
            .sort()
            .projection({ animeId: 1 }).exec(cb)
    )
}
export async function updateEpisodeWatchTime(animeId, episodeNumber, watchTime) {
    const animeIdEpisodeNumber = getAnimeIdEpisodeNumberKey(animeId, episodeNumber);
    return NEDBPromise((cb) => dbs.episodesDB.update(
        { animeIdEpisodeNumber },
        { $set: { watchTime } },
        {},
        cb
    ))

}
export function getEpisodeWatchTime(animeId, episodeNumber) {
    return NEDBPromise(
        (cb) => dbs.episodesDB.findOne({ animeIdEpisodeNumber: getAnimeIdEpisodeNumberKey(animeId, episodeNumber) })
            .projection({ watchTime: 1 })
            .exec(cb)
    );
}