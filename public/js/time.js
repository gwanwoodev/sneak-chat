function getHoursAndMinutes() {
    let date = new Date(Date.now());
    const hours = date.getHours();
    const minutes = date.getMinutes();
    let dateString = `${hours}:${minutes}`;
    
    return dateString;
}