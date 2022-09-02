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
      image: anime.coverImage.large,
      color: anime.coverImage.color,
      releaseDate: anime.seasonYear,
      rating: anime.averageScore
    }
}
export const getLuminanceValue = (RGBColor) => {
    const R = parseInt(RGBColor.substr(1, 2), 16);
    const G = parseInt(RGBColor.substr(3, 2), 16);
    const B = parseInt(RGBColor.substr(5, 2), 16);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}