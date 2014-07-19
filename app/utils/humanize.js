import caseMapping from './mappings/case';

export default function(str) {
  var newString = str.replace(/_id$/, '').replace(/_/g, ' ').replace(/^\w/g, function(s) {
    return s.toUpperCase();
  });
  Object.keys(caseMapping).forEach(function(searchString) {
    var replacementString = caseMapping[searchString];
    newString = newString.replace(new RegExp(searchString, 'ig'), replacementString);
  });
  return newString;
}
