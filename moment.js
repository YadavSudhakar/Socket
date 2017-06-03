var moment = require ('moment');
var now = moment();
console.log(now.format());
// console.log(now.format("dddd, MMMM Do YYYY, h:mm:ss a"));
console.log(now.format('X'));//moment time stamp of unix
console.log(now.format('x'));/*javscript time stamp of unix.we cannot use to compare
it or convert it into the normal time,because that is not possible with moment format*/
console.log(now.valueOf());//we can commapre the javscript timestamp using the valueOf function
//comparision
var timestamp= 1496230373314;
var timestampMoment=moment.utc(timestamp);/*by passing moment.utc instead of only moment function we are telling
are accessing it utc property and passing timestamp in utc to get local time*/
console.log(timestampMoment.local().format('  '));
