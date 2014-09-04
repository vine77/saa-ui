ClearQuest (CQ) GitHub (GH) Integration
===============================================================================


Flow #1: Other user files issue in ClearQuest
-------------------------------------------------------------------------------

1. SAA team member files issue in CQ
2. Bot polls CQ regularly and notices new issue in CQ
3. Bot adds issue to GH with appropriate mappings
4. Front-end team member updates issue in GH
5. Bot notices the update to the issue on GH and makes mapped update in CQ
6. Front-end team member closes issue in GH
7. Bot closes the issue in CQ


Flow #2: Front-end team member files issue on GitHub Issues
-------------------------------------------------------------------------------

1. Front-end team member files issue in GH
2. Bot polls GH regularly and notices the new issue in GH
3. Bot adds issue to CQ with appropriate mappings
4. SAA team member updates the issue in CQ
5. Bot notices the update to the issue in CQ and makes mapped update in GH
6. Front-end team member closes issue in GH
7. Bot closes the issue in CQ


Requirements
-------------------------------------------------------------------------------

* Bot needs to be able to open issue in both systems
* Bot needs to be able to update issue in both systems
* Bot needs to be able to close issue in CQ
* Need to store IDs and last-updated timestamps of CQ and GH issues somewhere
* Need bot to have 24/7 accessibility to Intel network and the Internet
* Need mapping file with two-way mappings of fields/tags in each system


API details
-------------------------------------------------------------------------------

### ClearQuest API:

* Documentation: https://jazz.net/wiki/bin/view/Main/CqOslcV2
* API endpoint: https://pg.clearquest.intel.com/cqweb/oslc/repo/CQMS.EPSD.PG/db/EPSD1
* Example query: https://pg.clearquest.intel.com/cqweb/oslc/repo/CQMS.EPSD.PG/db/EPSD1/query/49124594


### GitHub Issues API:

* Documentation: https://developer.github.com/v3/issues/
* Example query: GET https://api.github.com/repos/vine77/saa-ui/issues?state=open


### QuickBuild API:

* Documentation: http://wiki.pmease.com/display/QB51/RESTful+API
* Example query: https://quickbuild.igk.intel.com/rest/latest_builds/4075


ClearQuest Required Fields
-------------------------------------------------------------------------------

### Required for creation

Main
* ID: EPSD100244057
* Title: Something doesn't work
* State: New/Assigned
* Product: SAM
* Project: GUI
* Component: UI - Issues
* Release: Debug
* Classification:
  * Defect
  * Can Not Reproduce
  * Documentation
  * Duplicate
  * Feature Request
  * Not a Defect
  * Requirement
* Exposure: Medium
* Priority: P3
* Owner: WARD, NATHAN J
* Submitter: WYNNE, MICHAEL
* Submitter Group (prefilled): EPSD_Users
* Customer Support ID: 14
*  Mastership (prefilled): PG
*  Phase Discovered: SAA 1.1.2 eNovance

Description

Environment
* Operating System (prefilled):
  * OS: Linux - Other
  * Variant: Ubuntu 14.04
* Configuration: ""

Correlations
* Gate To: SAA 1.1.2 eNovance


### Required for moving to implemented

Main
* State: Implemented

Resolution
* Product (prefilled): SAM
* Component (prefilled): UI - Issues
* Build: SAA_1.1.2.84
* Root cause: Fixed in 12345
* Root cause summary:
  * Code : Coding error (incorrect implementation)
  * New Feature
  * Not a defect
  * Not Reproducible

### Required for moving to verified

Main
* State: Verified

Resolution
* Verified in
  * Regression Test: Verified in 12345

### Other fields

cq:Submit_Date



