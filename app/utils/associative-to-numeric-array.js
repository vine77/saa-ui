export default function(associativeArray) {
  var numericArray = [];
  for (var key in associativeArray) {
    numericArray.push(associativeArray[key]);
  }
  return numericArray;
}
