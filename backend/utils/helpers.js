//url validation
export const isValidLink = (link) => {
    if(typeof link !== 'string' || link.trim().length === 0){
        return false;
    }
    
    let processedLink = link;
    if(!/^https?:\/\//i.test(link)){
        processedLink = 'https://' + link;
    }

    try {
        const validLink = new URL(processedLink);

        //protocol check
        if(!['http:', 'https:'].includes(validLink.protocol)){
            return false;
        }
    
        //domain validation
        if(!validLink.hostname || validLink.hostname.includes('..') || !/\./.test(validLink.hostname)){
            return false;
        }

        if(['localhost', '127.0.0.1', '0.0.0.0'].includes(validLink.hostname) || /^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\.|^192\.168\./.test(validLink.hostname)){
            return false;
        }

        const tld = validLink.hostname.split('.').pop();
        if(tld.length < 2){
            return false;
        }
        return true;
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