import gql from 'graphql-tag';
export const PLACEHOLDER_QUERY = gql`
query {
  GenreCollection
}
`
export const HOME_FEED_QUERY = gql`
query (
  $watchedIds: [Int]
  $continueWatchIds: [Int]
  $limit: Int
  $recommendationMax: Int
  $banned_formats: [MediaFormat]
) {
  banner_anime: Media(
    sort: [TRENDING_DESC, POPULARITY_DESC]
    format_not_in: $banned_formats
    type: ANIME
    isAdult: false
    status_in: [RELEASING, FINISHED]
  ) {
    id
    genres
    bannerImage
    coverImage {
      extraLarge
    }
    format
    seasonYear
    description
    title {
      english
      romaji
      native
    }
    trailer {
      id
      site
      thumbnail
    }
  }
  trending_animes: Page(perPage: $limit) {
    media(
      sort: TRENDING_DESC
      format_not_in: $banned_formats
      type: ANIME
      isAdult: false
      status: RELEASING
    ) {
      id
      genres
      format
      seasonYear
      averageScore
      coverImage {
        color
        large
      }
      title {
        english
        romaji
        native
      }
    }
  }
  upcoming_animes: Page {
    media(
      status: NOT_YET_RELEASED
      sort: [POPULARITY_DESC, TRENDING_DESC]
    ) {
      id
      genres
      format
      seasonYear
      averageScore
      coverImage {
        color
        large
      }
      title {
        english
        romaji
        native
      }
    }
  }
  continue_watch_animes: Page(perPage: $limit) {
    media(id_in: $continueWatchIds) {
      id
      status
      format
      genres
      seasonYear
      averageScore
      coverImage {
        color
        large
      }
      nextAiringEpisode {
        episode
      }
      title {
        english
        romaji
        native
      }
    }
  }
  recommended_animes: Page(perPage: $limit) {
    media(id_in: $watchedIds, sort: POPULARITY_DESC) {
      recommendations(perPage: $recommendationMax) {
        nodes {
          mediaRecommendation {
            id
            genres
            format
            seasonYear
            averageScore
            description
            coverImage {
              color
              large
            }
            title {
              english
              romaji
              native
            }
          }
        }
      }
    }
  }
  popular_animes: Page(perPage: $limit) {
    media(
      sort: POPULARITY_DESC
      format_not_in: $banned_formats
      type: ANIME
      isAdult: false
      status_not: NOT_YET_RELEASED
    ) {
      id
      genres
      format
      seasonYear
      averageScore
      coverImage {
        color
        large
      }
      title {
        english
        romaji
        native
      }
    }
  }
  anime_movies: Page(perPage: $limit) {
    media(
      sort: TRENDING_DESC
      type: ANIME
      isAdult: false
      format: MOVIE
      status_not: NOT_YET_RELEASED
    ) {
      id
      genres
      format
      seasonYear
      averageScore
      coverImage {
        color
        large
      }
      title {
        english
        romaji
        native
      }
    }
  }
  top_airing: Page(perPage: $limit) {
    media(
      sort: SCORE_DESC
      status: RELEASING
      type: ANIME
      isAdult: false
    ) {
      id
      genres
      format
      seasonYear
      averageScore
      coverImage {
        color
        large
      }
      title {
        english
        romaji
        native
      }
    }
  }
}
`
export const SEARCH_QUERY = gql`
query ($title: String!, $banned_formats: [MediaFormat]){
  results: Page {
      media(search: $title, type: ANIME, isAdult: false, format_not_in: $banned_formats){
          id
          genres
          format
          seasonYear
          averageScore
          coverImage {
              large
              color
          }
          title {
              english
              romaji
              native
          }
      }
  }
}
`
export const browse_feed_query = (animeGenres) => gql`
      query ($format: MediaFormat, $perPage: Int){
      ${Object.keys(animeGenres)
        .map(
            (key) => ` ${key}: Page(perPage: $perPage) {
        media(
          sort: POPULARITY_DESC
          type: ANIME
          format: $format
          isAdult: false
          genre: "${animeGenres[key]}"
        ) {
          id
          genres
          format
          seasonYear
          averageScore
          coverImage {
            color
            large
          }
          title {
            english
            romaji
            native
          }
        }
      }
      `
        )
        .join("")}
}`;
export const BROWSE_BANNER_QUERY = gql`
query (
  $format: MediaFormat
  $season: MediaSeason
  $seasonYear: Int
  $limit: Int
) {
  Page(perPage: $limit) {
    media(
      sort: POPULARITY_DESC
      type: ANIME
      status_not: NOT_YET_RELEASED
      format: $format
      isAdult: false
      season: $season
      seasonYear: $seasonYear
    ) {
      id
      genres
      bannerImage
      format
      description
      seasonYear
      coverImage {
        extraLarge
      }
      title {
        english
        romaji
        native
      }
    }
  }
}
`

export const MY_LIST_QUERY = gql`
query ($idList: [Int]!, $perPage: Int, $page: Int){
  watchList: Page(page: $page, perPage: $perPage) {
    pageInfo {
      hasNextPage
    }
    media(id_in: $idList){
      id
      genres
      format
      seasonYear
      averageScore
      description
      coverImage {
        large
        color
      }
      title {
        english
        romaji
        native
      }
    }
  }
}
`

export const schedule_query = (start, end, page) => `
query ($start: Int = ${start}, $end: Int = ${end}) {
    weekSchedule: Page(page: ${page}) {
        pageInfo {
            hasNextPage
        }
        airingSchedules(
            airingAt_greater: $start
            airingAt_lesser: $end
            sort: TIME_DESC
        ) {
            episode
            airingAt
            media {
                id
                format
                isAdult
                coverImage {
                    medium
                }
                title {
                    romaji
                    english
                    native
                    userPreferred
                }
            }
        }
    }
}`

export const COLLECTIONS_QUERIES = {
  trending_now: gql`
   query($perPage: Int, $page: Int,  $banned_formats: [MediaFormat]){
    Page(perPage: $perPage, page: $page) {
      pageInfo {
        hasNextPage
      }
      media(
        sort: TRENDING_DESC
        format_not_in: $banned_formats
        type: ANIME
        isAdult: false
        status: RELEASING
      ) {
        id
        genres
        format
        seasonYear
        averageScore
        coverImage {
          color
          large
        }
        title {
          english
          romaji
          native
        }
      }
    }
  }
  `,
  continue_watch: gql`
   query($perPage: Int, $page: Int, $continueWatchIds: [Int]){
    Page(perPage: $perPage, page: $page) {
      pageInfo {
        hasNextPage
      }
      media(id_in: $continueWatchIds) {
        id
        status
        format
        genres
        seasonYear
        averageScore
        coverImage {
          color
          large
        }
        nextAiringEpisode {
          episode
        }
        title {
          english
          romaji
          native
        }
      }
    }
  }
  `,
  popular: gql`
  query($perPage: Int, $page: Int, $banned_formats: [MediaFormat]){
    Page(perPage: $perPage, page: $page) {
      pageInfo {
        hasNextPage
      }
      media(
        sort: POPULARITY_DESC
        format_not_in: $banned_formats
        type: ANIME
        isAdult: false
        status_not: NOT_YET_RELEASED
      ) {
        id
        genres
        format
        seasonYear
        averageScore
        coverImage {
          color
          large
        }
        title {
          english
          romaji
          native
        }
      }
    }
  }
  `,
  anime_movies: gql`
  query($perPage: Int, $page: Int){
    Page(perPage: $perPage, page: $page) {
      pageInfo {
        hasNextPage
      }
      media(
        sort: TRENDING_DESC
        type: ANIME
        isAdult: false
        format: MOVIE
        status_not: NOT_YET_RELEASED
      ) {
        id
        genres
        format
        seasonYear
        averageScore
        coverImage {
          color
          large
        }
        title {
          english
          romaji
          native
        }
      }
    }
  }
  `,
  top_airing: gql`
  query($perPage: Int, $page: Int){
    Page(perPage: $perPage, page: $page) {
      pageInfo {
        hasNextPage
      }
      media(
        sort: SCORE_DESC
        status: RELEASING
        type: ANIME
        isAdult: false
      ) {
        id
        genres
        format
        seasonYear
        averageScore
        coverImage {
          color
          large
        }
        title {
          english
          romaji
          native
        }
      }
    }
  }
  `,
  'format-genre': (format, genre) => gql`
  query($perPage: Int, $page: Int){
    Page(perPage: $perPage, page: $page) {
      pageInfo {
        hasNextPage
      }
      media(
        sort: POPULARITY_DESC
        type: ANIME
        format: ${format}
        isAdult: false
        genre: "${genre}"
      ) {
        id
        genres
        format
        seasonYear
        averageScore
        coverImage {
          color
          large
        }
        title {
          english
          romaji
          native
        }
      }
    }
  }
  `
}
