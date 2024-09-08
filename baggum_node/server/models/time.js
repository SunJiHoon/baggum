//한국시간 KST
function kstDate(date){
    return date.getTime() + 9 * 60 * 60 * 1000;
}

//(YYYY-MM-DD HH:MM:SS)
function formatDate(date){
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

//Thu Aug 15 2024 18:22:05 GMT+0000 (Coordinated Universal Time)
function parseDate(dateString){
    return dateString.replace(' ', 'T');
};

module.exports = {
    kstDate,
    formatDate,
    parseDate
}