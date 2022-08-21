const query = (start, end, page) =>
` query ($start: Int = ${start}, $end: Int = ${end}) {
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
export default  query