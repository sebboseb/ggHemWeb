export async function getApi(sort) {
    if (sort) {
        const searchUrl = `https://swedishicecream.herokuapp.com/${sort}`;
        const response = await fetch(searchUrl);
        const responseJson = await response.json();
        const searchResults = responseJson;

        return searchResults;
    }
}

// export async function getApiType(sort, namn) {
//     const searchUrl = `https://swedishicecream.herokuapp.com/${sort}?namn=${namn}`;
//     const response = await fetch(searchUrl);
//     const responseJson = await response.json();
//     const searchResults = responseJson;

//     return searchResults;
// }