export function createWatchId(episodeId, episodeNumber, animeId) {
    let watchInfo = JSON.stringify({ episodeId, episodeNumber, animeId });
    return Buffer.from(watchInfo).toString("base64");

}
export function decodeWatchId(watchId) {
    let jsonInfo = new Buffer(watchId, 'base64').toString("ascii");
    return JSON.parse(jsonInfo);
}
export const transformFields = (anime) => {
    const animeInfo = {};
    animeInfo.malId = anime.idMal;
    animeInfo.id = anime.id;
    animeInfo.type = anime.format?.replace("_", " ");
    animeInfo.title = {
        romaji: anime.title.romaji,
        english: anime.title.english,
        native: anime.title.native,
        userPreferred: anime.title.userPreferred || preferredTitle(anime.title),
    };
    animeInfo.trailer = {
        id: anime.trailer?.id,
        site: anime.trailer?.site,
        thumbnail: anime.trailer?.thumbnail,
    };
    animeInfo.image =
        anime.coverImage?.extraLarge ??
        anime.coverImage?.large ??
        anime.coverImage?.medium ??
        anime.coverImage?.small;
    animeInfo.color = anime.coverImage?.color;
    animeInfo.cover = anime.bannerImage || animeInfo.image;
    animeInfo.description = anime.description;
    switch (anime.status) {
        case 'RELEASING':
            animeInfo.status = 'Ongoing';
            break;
        case 'FINISHED':
            animeInfo.status = 'Completed';
            break;
        case 'NOT_YET_RELEASED':
            animeInfo.status = 'Not yet aired';
            break;
        case 'CANCELLED':
            animeInfo.status = 'Cancelled';
            break;
        case 'HIATUS':
            animeInfo.status = 'Hiatus';
            break;
        default:
            animeInfo.status = 'Unknown';
    }
    animeInfo.releaseDate = anime.startDate?.year || anime.seasonYear;
    if (anime.nextAiringEpisode)
        animeInfo.nextAiringEpisode = {
            airingTime: anime.nextAiringEpisode?.airingAt,
            timeUntilAiring: anime.nextAiringEpisode?.timeUntilAiring,
            episode: anime.nextAiringEpisode?.episode,
        };
    animeInfo.rating = anime.averageScore || anime.meanScore;
    animeInfo.duration = anime.duration;
    animeInfo.genres = anime.genres;
    animeInfo.studios = anime.studios?.edges.map((item) => item.node.name);
    animeInfo.relations = anime.relations?.edges.map((item) => ({
        ...transformFields(item.node),
        relationType: item.relationType
    }));
    animeInfo.characters = anime.characters?.edges.map((item) => ({
        id: item.node.id,
        name: item.node.name,
        image: item.node.image.large ?? item.node.image.medium,
        role: item.role,
        voiceActors: item.node.voiceActors?.map((actor) => ({
            id: actor.id,
            name: actor.name,
            image: actor.image.large ?? actor.image.medium
        })) || []
    }));
    animeInfo.recommendations = anime.recommendations?.edges.map((item) => transformFields(item.node.mediaRecommendation));
    return animeInfo;
}
export const getLuminanceValue = (RGBColor) => {
    const R = parseInt(RGBColor.substr(1, 2), 16);
    const G = parseInt(RGBColor.substr(3, 2), 16);
    const B = parseInt(RGBColor.substr(5, 2), 16);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
export const preferredTitle = (title) => title.english || title.romaji || title.native;
export const randomizeAndSlice = (data, limit) => data.sort(() => 0.5 - Math.random()).slice(0, limit);
export const getCurrentSeason = () => {
    const today = new Date();
    const month = today.getMonth();
    const date = today.getDate();
    if (date >= 30 && month >= 2 || date <= 21 && month <= 5)
        return 'SPRING';
    if (date >= 21 && month >= 5 || date <= 22 && month <= 8)
        return 'SUMMER';
    if (date >= 22 && month >= 8 || date <= 21 && month <= 11)
        return 'FALL';
    return 'WINTER';
}