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