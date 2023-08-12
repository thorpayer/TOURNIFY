function formatDate(inputDateString) {
    const inputDate = new Date(inputDateString);
  
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
    const formattedDate = `${daysOfWeek[inputDate.getUTCDay()]} ${months[inputDate.getUTCMonth()]} ${inputDate.getUTCDate()} ${inputDate.getUTCFullYear()}`;
  
    return formattedDate;
  }
  
module.exports = formatDate