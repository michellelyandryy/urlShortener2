//url validation
export const isValidLink = (link) => {
    try{
        new URL(link);
        return true;
    } catch {
        return false;
    }
};

const BASE62 ="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

//base62 encoding 
export const generateBase62Code = (id) => {
    let shortCode = '';
    while (id > 0){
        shortCode = BASE62[id % 62] + shortCode;
        id = Math.floor(id / 62);
    }
    return shortCode;
};

// decode
export const decodeBase62Code = (shortCode) => {
    let id = 0;
    for (let char of shortCode){
        id = id * 62 + BASE62.indexOf(char);
    }
    return id;
};