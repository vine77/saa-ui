module.exports = function(issue) {
  // Required for creation
  var id = issue['cq:id'];
  var title = issue['dcterms:title'];
  var description = issue['dcterms:description'];
  var state = issue['oslc_cm:status'];
  var product = issue['cq:Product']['rdf:resource'];
  var project = issue['cq:Found_in_Project']['rdf:resource'];
  var component = issue['cq:Found_in_Component']['rdf:resource'];
  var release = issue['cq:Found_in_Product_Release'];
  var classification = issue['cq:Classification'];
  var exposure = issue['cq:Exposure'];
  var priority = issue['cq:Priority'];
  var owner = issue['cq:Owner_FORM'];
  var contributor = issue['dcterms:contributor'];
  var submitter = issue['cq:Submitter_FORM'];
  var creator = issue['dcterms:creator']['rdf:resource'];
  var submitterGroup = issue['cq:Submitter_Group']['rdf:resource'];  // Prefilled
  var customerSupport = issue['cq:Customer_Support_ID'];
  var mastership = issue['cq:ratl_mastership']['rdf:resource'];  // Prefilled
  var phaseDiscovered = issue['cq:Phase_Discovered'];
  var operatingSystem = '';  // Prefilled
  var configuration = issue['cq:Configuration'];
  var gate = issue['cq:Gate_To'];
};
