ClearQuest (CQ) GitHub Issues (GI) Integration
===============================================================================


Flow #1: Other user files issue in ClearQuest
-------------------------------------------------------------------------------

1. SAA team member files issue in CQ
2. Bot polls CQ regularly and notices new issue in CQ
3. Bot adds issue to GI with appropriate mappings
4. Front-end team member updates issue in GI
5. Bot notices the update to the issue on GI and makes mapped update in CQ
6. Front-end team member closes issue in GI
7. Bot closes the issue in CQ


Flow #2: Front-end team member files issue on GitHub Issues
-------------------------------------------------------------------------------

1. Front-end team member files issue in GI
2. Bot polls GI regularly and notices the new issue in GI
3. Bot adds issue to CQ with appropriate mappings
4. SAA team member updates the issue in CQ
5. Bot notices the update to the issue in CQ and makes mapped update in GI
6. Front-end team member closes issue in GI
7. Bot closes the issue in CQ


Requirements
-------------------------------------------------------------------------------

* Bot needs to be able to open issue in both systems
* Bot needs to be able to update issue in both systems
* Bot needs to be able to close issue in CQ
* Need to store IDs and last-updated timestamps of CQ and GI issues somewhere
* Need bot to have 24/7 accessibility to Intel network and the Internet
* Need mapping file with two-way mappings of fields/tags in each system


API details
-------------------------------------------------------------------------------

### ClearQuest

* Documentation: https://jazz.net/wiki/bin/view/Main/CqOslcV2
* API endpoint: https://pg.clearquest.intel.com/cqweb/oslc/repo/CQMS.EPSD.PG/db/EPSD1
* Example query: https://pg.clearquest.intel.com/cqweb/oslc/repo/CQMS.EPSD.PG/db/EPSD1/query/49124594


### GitHub Issues:

* Documentation: https://developer.github.com/v3/issues/
* API query example: GET https://api.github.com/repos/vine77/saa-ui/issues?state=open


Config File
-------------------------------------------------------------------------------

```json
{
  "phase": "SAA 1.1.2 eNovance"
}
```

ClearQuest Required Fields
-------------------------------------------------------------------------------

### Required for creation

Main:
  ID: EPSD100244057
  Title: Something doesn't work
  State: New/Assigned
  Product: SAM
  Project: GUI
  Component: UI - Issues
  Release: Debug
  Classification:
    Defect
    Can Not Reproduce
    Documentation
    Duplicate
    Feature Request
    Not a Defect
    Requirement
  Exposure: Medium
  Priority: P3
  Owner: WARD, NATHAN J
  Submitter: WYNNE, MICHAEL
  Submitter Group (prefilled): EPSD_Users
  Customer Support ID: 14
  Mastership (prefilled): PG
  Phase Discovered: SAA 1.1.2 eNovance
Description: Something doesn't work
Environment: 
  Operating System (prefilled):
    OS: Linux - Other
    Variant: Ubuntu 14.04
  Configuration: ""
Correlations:
  Gate To: SAA 1.1.2 eNovance


### Required for moving to implemented

Main:
  State: Implemented
Resolution:
  Product (prefilled): SAM
  Component (prefilled): UI - Issues
  Build: SAA_1.1.2.84
  Root cause: Fixed in 12345
  Root cause summary:
    Code : Coding error (incorrect implementation)
    New Feature
    Not a defect
    Not Reproducible

### Required for moving to verified

Main:
  State: Verified
Resolution:
  Verified in:
    Regression Test: Verified in 12345

### Other fields

cq:Submit_Date



