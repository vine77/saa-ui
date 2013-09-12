// Constants for priority codes
App.UNKNOWN = 0;
App.SUCCESS = 1;
App.INFO = 2;
App.WARNING = 3;
App.ERROR = 4;

// Constants for operational status codes
App.OFF = 1;
App.ON = 2;
App.PAUSED = 3;
App.BOOTING = 4;
App.REBOOTING = 4;
App.UPDATING = 5;
App.BUSY = 6;

/**
 * Convert string representation of priority to corresponding integer codes
 *
 * @param {string} type A string representing priority level: 'unknown', 'success', 'warning', or 'error'
 * @return {number} The corresponding numerical code for that priority level
 */
App.typeToPriority = function (type) {
  if (typeof type === 'string') type = type.toLowerCase();
  switch (type) {
    // Unknown
    case 'unknown':
    case 'n/a':
    case App.UNKNOWN:
    case App.UNKNOWN.toString():
      return App.UNKNOWN;
    // Success
    case 'success':
    case 'good':
    case App.SUCCESS:
    case App.SUCCESS.toString():
      return App.SUCCESS;
    // Info
    case 'info':
    case App.INFO:
    case App.INFO.toString():
      return App.INFO;
    // Warning
    case 'warning':
    case App.WARNING:
    case App.WARNING.toString():
      return App.WARNING;
    // Error
    case 'error':
    case 'danger':
    case 'important':
    case 'bad':
    case 'critical':
    case App.ERROR:
    case App.ERROR.toString():
      return App.ERROR;
    default:
      return null;
  }
};

/**
 * Convert integer code of priority to corresponding string representation
 *
 * @param {number} priority A numerical code for priority level
 * @return {string} The corresponding string representation for that priority level: 'unknown', 'success', 'warning', or 'error'
 */
App.priorityToType = function (priority) {
  if (typeof priority === 'string') priority = priority.toLowerCase();
  switch (priority) {
    // Unknown
    case 'unknown':
    case 'n/a':
    case App.UNKNOWN:
    case App.UNKNOWN.toString():
      return 'unknown';
    // Success
    case 'success':
    case 'good':
    case App.SUCCESS:
    case App.SUCCESS.toString():
      return 'success';
    // Info
    case 'info':
    case App.INFO:
    case App.INFO.toString():
      return 'info';
    // Warning
    case 'warning':
    case App.WARNING:
    case App.WARNING.toString():
      return 'warning';
    // Error
    case 'error':
    case 'danger':
    case 'important':
    case 'bad':
    case 'critical':
    case App.ERROR:
    case App.ERROR.toString():
      return 'error';
    default:
      return 'unknown';
  }
};

/**
 * Convert priority to corresponding icon class
 *
 * @param {number} priority A numerical code for priority level (the corresponding string representation works too)
 * @return {string} The corresponding icon class (to be applied to an <i> tag)
 */
App.priorityToIconClass = function (priority) {
  if (typeof priority === 'string') priority = priority.toLowerCase();
  switch (priority) {
    case App.UNKNOWN:
    case App.UNKNOWN.toString():
    case 'unknown':
    case 'n/a':
      return 'icon-question-sign';
    case App.SUCCESS:
    case App.SUCCESS.toString():
    case 'success':
    case 'good':
      return 'icon-ok';
    case App.INFO:
    case App.INFO.toString():
    case 'info':
      return 'icon-info-sign';
    case App.WARNING:
    case App.WARNING.toString():
    case 'warning':
      return 'icon-warning-sign';
    case App.ERROR:
    case App.ERROR.toString():
    case 'error':
    case 'danger':
    case 'important':
    case 'bad':
    case 'critical':
      return 'icon-remove';
    default:
      return 'icon-question-sign';
  }
}

/**
 * Convert integer code of operational status to corresponding string representation
 *
 * @param {number} code A numerical code for operational status
 * @return {string} The corresponding string representation for that operational status
 */
App.codeToOperational = function (code) {
  if (typeof code === 'string') code = code.toLowerCase();
  switch (code) {
    case App.UNKNOWN:
    case App.UNKNOWN.toString():
    case 'unknown':
    case 'n/a':
      return 'unknown';
    case App.ON:
    case App.ON.toString():
    case 'on':
      return 'on';
    case App.OFF:
    case App.OFF.toString():
    case 'off':
      return 'off';
    case App.PAUSED:
    case App.PAUSED.toString():
    case 'paused':
      return 'paused';
    case App.REBOOTING:
    case App.REBOOTING.toString():
    case 'booting':
      return 'booting';
    case App.UPDATING:
    case App.UPDATING.toString():
    case 'updating':
      return 'updating';
    case App.BUSY:
    case App.BUSY.toString():
    case 'busy':
      return 'busy';
    default:
      return 'unknown';
  }
};

/**
 * Convert string representation of operational status to corresponding integer code
 *
 * @param {string} code A string representation of operational status
 * @return {number} The corresponding integer code for that operational status
 */
App.operationalToCode = function (operational) {
  if (typeof operational === 'string') operational = operational.toLowerCase();
  switch (operational) {
    case App.UNKNOWN:
    case App.UNKNOWN.toString():
    case 'unknown':
    case 'n/a':
      return 0;
    case App.ON:
    case App.ON.toString():
    case 'on':
      return 1;
    case App.OFF:
    case App.OFF.toString():
    case 'off':
      return 2;
    case App.PAUSED:
    case App.PAUSED.toString():
    case 'paused':
      return 3;
    case App.REBOOTING:
    case App.REBOOTING.toString():
    case 'booting':
      return 4;
    case App.UPDATING:
    case App.UPDATING.toString():
    case 'updating':
      return 5;
    case App.BUSY:
    case App.BUSY.toString():
    case 'busy':
      return 6;
    default:
      return 0;
  }
};

/**
 * Convert operational status to corresponding icon class
 *
 * @param {number} code A numerical code for operational status (the corresponding string representation works too)
 * @return {string} The corresponding icon class (to be applied to an <i> tag)
 */
App.operationalToIconClass = function (code) {
  if (typeof code === 'string') code = code.toLowerCase();
  switch (code) {
    case App.UNKNOWN:
    case App.UNKNOWN.toString():
    case 'unknown':
    case 'n/a':
      return 'icon-question-sign';
    case App.ON:
    case App.ON.toString():
    case 'on':
      return 'icon-bolt';
    case App.OFF:
    case App.OFF.toString():
    case 'off':
      return 'icon-off';
    case App.PAUSED:
    case App.PAUSED.toString():
    case 'paused':
      return 'icon-pause';
    case App.REBOOTING:
    case App.REBOOTING.toString():
    case 'booting':
      return 'icon-spinner icon-spin';
    case App.UPDATING:
    case App.UPDATING.toString():
    case 'updating':
      return 'icon-spinner icon-spin';
    case App.BUSY:
    case App.BUSY.toString():
    case 'busy':
      return 'icon-spinner icon-spin';
    default:
      return 'icon-question-sign';
  }
};

/**
 * Convert logTime labels to corresponding seconds used by Kibana
 *
 * @param {string} code A log time label for Kibana parameter
 * @return {string} The corresponding number of seconds
 */
App.logTimeToSeconds = function (time) {
  switch (time) {
    case 'Last 15min':
      return '900';
    case 'Last 60min':
      return '3600';
    case 'Last 4h':
      return '14400';
    case 'Last 12h':
      return '43200';
    case 'Last 24h':
      return '86400';
    case 'Last 48h':
      return '172800';
    case 'Last 7d':
      return '604800';
    case 'All Time':
      return 'all';
  }
}

/**
 * Convert a value to a color given the range of possible values
 *
 * @param {number} value The value to translate into a corresponding color
 * @param {number} minimum The minimum of the range of possible values
 * @param {number} maximum The maximum of the range of possible values
 * @param {number} warning The lower threshold for orange values
 * @param {number} danger The lower threshold for red values
 * @return {string} A CSS color string, e.g. 'hsl(60, 100%, 100%)'
 */
App.rangeToColor = function (value, minimum, maximum, warning, danger) {
  if (typeof value !== 'number') {
    return null;
  } else if (typeof minimum === 'number' && typeof maximum === 'number' && typeof warning === 'undefined' && typeof danger === 'undefined') {
    var range = maximum - minimum;
    var percentage = value/range;
    // Hues of green through red are 120 through 0
    var hue = -1 * (percentage * 120) + 120;
    return 'hsl(' + hue + ', 100%, 45%)';
  } else if (typeof minimum === 'number' && typeof maximum === 'number' && typeof warning === 'number' && typeof danger === 'number' && minimum <= warning && warning <= danger && danger <= maximum && value >= minimum && value <= maximum) {
    if (value <= warning) {
      // Hues of green through yellow are 120 through 60
      var range = warning - minimum;
      var percentage = value/range;
      var hue = -1 * (percentage * 60) + 120;
    } else if (value <= danger) {
      // Hues of yellow through dark orange are 60 through 30
      var range = danger - warning;
      var percentage = (value - warning)/range;
      var hue = -1 * (percentage * 30) + 60;
    } else {
      // Hues of dark orange through red orange are 30 through 0
      var range = maximum - danger;
      var percentage = (value - danger)/range;
      var hue = -1 * (percentage * 30) + 30;
    }
    return 'hsl(' + hue + ', 100%, 45%)';
  } else {
    return null;
  }
};

App.rangeToPercentage = function(value, minimum, maximum) {
  var percentage = value/maximum;
  percentage = Math.round(percentage * 100);
  return percentage;
}

App.trustDetailsToString = function (value) {
  switch (value) {
    case 0:
    case '0':
      return 'Unknown';
    case 1:
    case '1':
      return 'Not Trusted';
    case 2:
    case '2':
      return 'Trusted';
  }

  /** Old
  switch (value) {
    case '0':
    case 0:
      return 'Not Trusted';
    case '1':
    case 1:
      return 'Trusted';
    case 'unknown':
    case null:
      return 'Unknown';
  }
  **/
}
