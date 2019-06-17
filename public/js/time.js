function getHoursAndMinutes() {
    let date = new Date(Date.now());
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    let mornoon;
    
    if(hours <= 12) mornoon = '오전';
    else mornoon = '오후';
    
    let dateString = `${mornoon} ${hours}:${minutes}:${seconds}`;
    
    return dateString;
}