async function getArtistInsights(query) {
    const {
        id,
        limit,
        weight,
        daysAgo,
        newsFormat
    } = query;

    // Get weight and preliminary insights
    const artistWeight = await getArtistWeightValue(id, weight, daysAgo);
    const artistInsights = await getArtistInsightsFromSnowflake(id, limit, artistWeight, daysAgo);

    //Filter and Format results
    const filteredResults = filterResults(artistInsights);
    const finalInsights = formatInsights(filteredResults, limit, weight, newsFormat);

    return newsFormat ? {finalInsights, weight} : insights;
}

async function getArtistWeightValue(id, weight, daysAgo) {
    let counts, finalWeight;
    if (weight === undefined) {
        counts = await getArtistsInsightsCountFromSnowflake(id, 8, 4, daysAgo);
    }

    let high, medium;
    if (counts) {
        high = counts[0]?.count;
        medium = counts[1]?.count;
    }

    if (weight === undefined) {
        finalWeight = high ? 8 : medium ? 4 : 1;
    }

    return weight ? weight : finalWeight;
}

async function getArtistsInsightsCountFromSnowflake(id, highWeight, mediumWeight, daysAgo) {
    const insightCount = await snowflakeClientExecuteQuery(
        QUERIES.QUERY_GET_ARTIST_INFO.ARTIST_INSIGHTS.GET_INSIGHTS_COUNT(
            id,
            highWeight,
            lowWeight,
            daysAgo
        )
    );

    return insightCount;
}

async function getArtistInsightsFromSnowflake(id, limit, weight, daysAgo) {
    const artistsInsights = await snowflakeClientExecuteQuery(
        QUERIES.QUERY_GET_ARTIST_INFO.ARTIST_INSIGHTS.GET_ARTIST_INSIGHTS(
            id,
            limit * 10,
            weight,
            daysAgo
        ));

    return artistsInsights;
}

async function formatInsights(filteredResult, limit, weight, newsFormat) {
    const results = filteredResult
        .map(result => formatInsight(result))
        .filter(e => e !== null)
        .slice(0, limit + (10 - weight) * 200);

    const insights = await Promise.all(
        results.map(async result => {
            const news = insightToNews(result);
            return newsFormat ? news : result;
        })
    );

    return insights;
}
