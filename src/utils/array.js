export const isUnique = (arr, str) => {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === str) {
            count++;
        }
        if (count > 1) {
            return false;
        }
    }
    return true;
}
