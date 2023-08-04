export default function timeSince(date) {
  var newDate = new Date(date);
  console.log(date);
  console.log(newDate);
  console.log(new Date());
  var seconds = Math.floor((new Date() - newDate) / 1000);
  console.log('seconds: ' + seconds);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + 'y ago';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + 'm ago';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + 'd ago';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + 'hrs ago';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + 'mins ago';
  }
  return Math.floor(seconds) + 'seconds ago';
}
