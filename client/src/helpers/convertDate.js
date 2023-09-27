export default function timeSince(date) {
  var newDate = new Date(date);
  var seconds = Math.floor((new Date() - newDate) / 1000);
  var interval = seconds / 31536000;

  // if it's positive
  if (seconds > 0) {
    if (interval > 1 && interval < 2) {
      return Math.floor(interval) + ' year ago';
    }
    if (interval >= 2) {
      return Math.floor(interval) + ' years ago';
    }

    interval = seconds / 2592000;
    if (interval > 1 && interval < 2) {
      return Math.floor(interval) + ' month ago';
    }
    if (interval >= 2) {
      return Math.floor(interval) + ' months ago';
    }

    interval = seconds / 86400;
    if (interval > 1 && interval < 2) {
      return Math.floor(interval) + ' day ago';
    }

    if (interval >= 2) {
      return Math.floor(interval) + ' days ago';
    }

    interval = seconds / 3600;
    if (interval > 1 && interval < 2) {
      return Math.floor(interval) + ' hour ago';
    }
    if (interval >= 2) {
      return Math.floor(interval) + ' hours ago';
    }

    interval = seconds / 60;
    if (interval > 1 && interval < 2) {
      return Math.floor(interval) + ' minute ago';
    }
    if (interval >= 2) {
      return Math.floor(interval) + ' minutes ago';
    }

    return Math.floor(seconds) + ' seconds ago';
  } else {
    var positiveSeconds = Math.abs(seconds);
    var intervalPos = positiveSeconds / 31536000;

    if (intervalPos > 1 && intervalPos < 2) {
      return 'in ' + Math.floor(intervalPos) + ' year';
    }
    if (intervalPos >= 2) {
      return 'in ' + Math.floor(intervalPos) + ' years';
    }

    intervalPos = positiveSeconds / 2592000;
    if (intervalPos > 1 && intervalPos < 2) {
      return 'in ' + Math.floor(intervalPos) + ' month';
    }
    if (intervalPos >= 2) {
      return 'in ' + Math.floor(intervalPos) + ' months';
    }

    intervalPos = positiveSeconds / 86400;
    if (intervalPos > 1 && intervalPos < 2) {
      return 'in ' + Math.floor(intervalPos) + ' day';
    }
    if (intervalPos >= 2) {
      return 'in ' + Math.floor(intervalPos) + ' days';
    }

    intervalPos = positiveSeconds / 3600;
    if (intervalPos > 1 && intervalPos < 2) {
      return 'in ' + Math.floor(intervalPos) + ' hour';
    }
    if (intervalPos >= 2) {
      return 'in ' + Math.floor(intervalPos) + ' hours';
    }

    intervalPos = positiveSeconds / 60;
    if (intervalPos > 1 && intervalPos < 2) {
      return 'in ' + Math.floor(intervalPos) + ' minute';
    }
    if (intervalPos >= 2) {
      return 'in ' + Math.floor(intervalPos) + ' minutes';
    }

    return 'in ' + Math.floor(positiveSeconds) + ' seconds';
  }
}
// BACKUP INCASE I BREAK THE TOP ONE
// export default function timeSince(date) {
//   var newDate = new Date(date);

//   // console.log('date from postgres: ' + date);
//   // console.log('date in js: ' + newDate);

//   var seconds = Math.floor((new Date() - newDate) / 1000);
//   // console.log('seconds: ' + seconds);

//   var interval = seconds / 31536000;

//   // console.log(seconds);

//   // if it's positive
//   if (seconds > 0) {
//     if (interval > 1) {
//       return Math.floor(interval) + 'y ago';
//     }
//     interval = seconds / 2592000;
//     if (interval > 1) {
//       return Math.floor(interval) + 'm ago';
//     }
//     interval = seconds / 86400;
//     if (interval > 1) {
//       return Math.floor(interval) + 'd ago';
//     }
//     interval = seconds / 3600;
//     if (interval > 1) {
//       return Math.floor(interval) + 'hrs ago';
//     }
//     interval = seconds / 60;
//     if (interval > 1) {
//       return Math.floor(interval) + 'mins ago';
//     }
//     return Math.floor(seconds) + 'seconds ago';
//   } else {
//     // console.log(seconds);
//     var positiveSeconds = Math.abs(seconds);
//     var intervalPos = positiveSeconds / 31536000;

//     if (intervalPos > 1) {
//       return 'in ' + Math.floor(intervalPos) + ' years';
//     }
//     intervalPos = positiveSeconds / 2592000;
//     if (intervalPos > 1) {
//       return 'in ' + Math.floor(intervalPos) + ' months';
//     }
//     intervalPos = positiveSeconds / 86400;
//     if (intervalPos > 1) {
//       return 'in ' + Math.floor(intervalPos) + ' days';
//     }
//     intervalPos = positiveSeconds / 3600;
//     if (intervalPos > 1) {
//       return 'in ' + Math.floor(intervalPos) + ' hours';
//     }
//     intervalPos = positiveSeconds / 60;
//     if (intervalPos > 1) {
//       return 'in ' + Math.floor(intervalPos) + ' minutes';
//     }
//     return 'in ' + Math.floor(positiveSeconds) + ' seconds';
//   }
// }
