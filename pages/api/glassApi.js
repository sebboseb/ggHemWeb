export async function getApi(sort) {
    if (sort) {
        // const searchUrl = `https://swedishicecream.herokuapp.com/${sort}`;
        const searchUrl = `https://swedishicecream.herokuapp.com/glass?sort=${sort}`;
        const response = await fetch(searchUrl);
        const responseJson = await response.json();
        const searchResults = responseJson;

        return searchResults;
    }
}

export async function getAllApi(page) {
        // const searchUrl = `https://swedishicecream.herokuapp.com/${sort}`;
        const searchUrl = `https://swedishicecream.herokuapp.com/glass?_page=${page}&_limit=20`;
        const response = await fetch(searchUrl);
        const responseJson = await response.json();
        const searchResults = responseJson;

        return searchResults;
}

// export async function getApiType(sort, namn) {
//     const searchUrl = `https://swedishicecream.herokuapp.com/${sort}?namn=${namn}`;
//     const response = await fetch(searchUrl);
//     const responseJson = await response.json();
//     const searchResults = responseJson;

//     return searchResults;
// }

// export async function getWeather() {
//     const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=stockholm&appid=7f3629c9cb887cc63ceccf2f0eb4ed48`;
//     const response = await fetch(weatherUrl);
//     const responseJson = await response.json();

//     return responseJson;
// }