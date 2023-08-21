export const waitFor = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const isValid = (value) => {
    if (value === undefined || value === null || value === "" || value === false) {
        return false;
    }
    return true;
}

export const removeDuplicates = (array) => {
    return Array.from(new Set(array));
}

export const removeItem = (array, strToRemove) => {
    return array.filter(item => item !== strToRemove);
}

export const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate random index
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements at indices i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export const cleanNextPageToken = (nextPageToken) => {
    if (!isValid(nextPageToken)) return null;

    let parsedJson = JSON.parse(nextPageToken);
    let nextPageUrl = parsedJson.url.split("&")[0];
    parsedJson.url = nextPageUrl;

    return JSON.stringify(parsedJson);
};

// This function is used to filter out duplicate objects from an array of objects
// Input params:
// arr: array of objects
// key: key of the object to be used for filtering
export const filterUniqueObj = (arr, key) => {
    if (!key) return [];

    const seenValues = new Set();
    const filteredList = [];

    arr.forEach(obj => {
        if (!seenValues.has(obj[key])) {
            seenValues.add(obj[key]);
            filteredList.push(obj);
        }
    });

    return filteredList;
}