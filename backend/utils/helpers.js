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

//base62 encoding randommm
export const generateBase62Code = (id) => {
    let shortCode = '';
    for(let i = 0; i < 6; i++){
        const randomIndex = Math.floor(Math.random() * BASE62.length);
        shortCode += BASE62[randomIndex];
    }
    return `short.ly/${shortCode}`;
};

// decode
export const decodeBase62Code = (shortCode) => {
    let id = 0;
    for (let i = 0; i < shortCode.length; i++){
        id = id * 62 + BASE62.indexOf(shortCode[i]);
    }
    return id;
};