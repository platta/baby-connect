/**
 * Lookup array of weekday names.
 * 
 * @type {string[]}
 */
const daysOfTheWeek = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
];

/**
 * Lookup array of month names.
 * 
 * @type {string[]}
 */
const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

/**
 * Formats the time portion of a Date object for use on the baby-connect web
 * site.
 * 
 * @param {Date} date
 *  The date to format.
 * 
 * @returns {string}
 */
function getTimeString (date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  minutes = minutes < 10 ? '0' + minutes : minutes;

  return hours + ':' + minutes + ampm;
}

/**
 * Formats the date portion of a Date object for use on the baby-connect web
 * site.
 * 
 * @param {Date} date
 *  The date to format.
 * 
 * @returns {string}
 */
function getDateString(date) {
    return daysOfTheWeek[date.getDay()] + ', ' +
        date.getDate() + ' ' +
        months[date.getMonth()] + ', ' +
        date.getFullYear();
}

module.exports.getTimeString = getTimeString;

module.exports.getDateString = getDateString;