export function createWatchId(episodeId, episodeNumber, animeId){
    let watchInfo = JSON.stringify({episodeId, episodeNumber, animeId});
    return Buffer.from(watchInfo).toString("base64");
    
}
export function decodeWatchId(watchId){
    let jsonInfo = new Buffer(watchId, 'base64').toString("ascii");
    return JSON.parse(jsonInfo);
}
export const transformFields = (anime) => {
    return {
      ...anime,
      image: anime.coverImage.large
    }
}