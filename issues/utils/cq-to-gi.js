var userMapping = require('../config.json').users;

module.exports = function(issue) {
  // Required for creation
  var id = issue['cq:id'];  // To GitHub labels[]
  var title = issue['dcterms:title'];  // To GitHub title
  var description = issue['dcterms:description'];  // To GitHub body
  var state = issue['oslc_cm:status'];  // New, Assigned, Pending, Implemented, etc.
  var product = issue['cq:Product']['rdf:resource'];  // SAM
  var project = issue['cq:Found_in_Project']['rdf:resource'];  // GUI
  var component = issue['cq:Found_in_Component']['rdf:resource'];  // GUI - Issues
  var release = issue['cq:Found_in_Product_Release'];  // From config.json
  var classification = issue['cq:Classification'];  // Defect, Feature Request, etc.
  var exposure = issue['cq:Exposure'];  // Medium
  var priority = issue['cq:Priority'];  // P3
  var owner = issue['cq:Owner_FORM'];
  var contributorUrl = issue['dcterms:contributor']['rdf:resource'];
  var contributor = contributorUrl.split('/').pop();  // To GitHub assignee (after mapping)
  var submitter = issue['cq:Submitter_FORM'];
  var creator = issue['dcterms:creator']['rdf:resource'];
  var submitterGroup = issue['cq:Submitter_Group']['rdf:resource'];  // Prefilled
  var customerSupport = issue['cq:Customer_Support_ID'];  // From GitHub number
  var mastership = issue['cq:ratl_mastership']['rdf:resource'];  // Prefilled
  var phaseDiscovered = issue['cq:Phase_Discovered'];  // From config.json
  var operatingSystem = '';  // Prefilled
  var configuration = issue['cq:Configuration'];
  var gate = issue['cq:Gate_To'];  // From config.json

  var githubPayload = {
    title: title,
    body: description,
    labels: ["clearquest", id]
  }
  if (contributor) {
    var assignee = userMapping.filter(function(user) {
      return user.clearquest.toLowerCase() === contributor.toLowerCase();
    }).pop();
    if (assignee) githubPayload.assignee = assignee.github;
  }
  return githubPayload;

};
