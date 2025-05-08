//url validation
export const isValidLink = (link) => {
    try {
        const validLink = new URL(link);
        return validLink.protocol === "http:" || validLink.protocol === "https:";
    } catch {
        return false;
    }
};

const BASE62 ="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

//base62 encoding randommm
export const generateBase62Code = (id) => {
    if (id === 0) return BASE62[0];
    
    let shortCode = '';
    while(id > 0){
        shortCode = BASE62[id % 62] + shortCode;
        id = Math.floor(id / 62);
    }
    return shortCode.padStart(6, '0');
};

// decode
export const decodeBase62Code = (shortCode) => {
    let id = 0;
    for (const char of shortCode){
        id = id * 62 + BASE62.indexOf(char);
    }
    return id;
};