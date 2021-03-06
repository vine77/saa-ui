// Constants for priority codes
App.UNKNOWN = 0;
App.SUCCESS = 1;
App.INFO = 2;
App.WARNING = 3;
App.ERROR = 4;
App.CRITICAL = 5;

// Constants for operational status codes
App.UNKNOWN = 0;
App.OFF = 1;
App.ON = 2;
App.REBOOTING = 4;
App.PAUSED = 10;
App.SUSPENDED = 12;
App.LIVE_MIGRATING = 15;
App.MIGRATING_RESIZING = 16;
App.CONFIRMATION_NEEDED = 17;
App.REVERTING = 18;
App.MIGRATION_BLOCKED = 19;
App.SHELVING = 21;
App.SHELVED = 22;
App.SHELVED_OFFLOADED = 23;

// Constants for trust
App.UNTRUSTED = 1;
App.TRUSTED = 2;
App.UNREGISTERED = 3;

// Constants for agent mode
App.NON_SAM = 0;
App.MONITORED = 1;
App.ASSURED_SCU_VCPU = 2;
App.ASSURED_SCU_VM = 3;
App.ASSURED_CORES_PHYSICAL = 4;

// Constants for network type
App.NEUTRON = 1;
App.NOVA = 2;

// Constants for trust configuration
App.TRUST_CONFIG_UNKNOWN = 0;
App.TRUST_CONFIG_FALSE = 1;
App.TRUST_CONFIG_TRUE = 2

App.caseMapping = {
  'cpu': 'CPU',
  'cpus': 'CPUs',
  'vcpu': 'vCPU',
  'vcpus': 'vCPUs',
  'sla': 'SLA',
  'slas': 'SLAs',
  'slo': 'SLO',
  'slos': 'SLOs'
};

App.NOT_APPLICABLE = '<span class="not-applicable">n/a</span>'.htmlSafe();

App.typeToSortOrder = function(type) {
  switch(type) {
    case 'os':
      return 0;
    case '6wind':
      return 1;
    case 'vm':
      return 2;
  }
}

App.codeToMode = function(code) {
  if (typeof type === 'string') code = code.toLowerCase();
  switch (code) {
    case null:
      return null;
    case App.NON_SAM:
      return 'unmonitored';
    case App.MONITORED:
      return 'monitored';
    case App.ASSURED_SCU_VCPU:
      return 'assured (per-vCPU SCUs)';
    case App.ASSURED_SCU_VM:
      return 'assured (SCUs)';
    case App.ASSURED_CORES_PHYSICAL:
      return 'assured (exclusive cores)';
    default:
      return 'unknown'
  }
}

App.codeToTrustConfig = function(code) {
  if (typeof type === 'string') code = code.toLowerCase();
  switch (code) {
    case null:
      return null;
    case 'unknown':
    case 'n/a':
    case App.TRUST_CONFIG_UNKNOWN:
    case App.TRUST_CONFIG_UNKNOWN.toString():
      return 'unknown';
    case 'false':
    case App.TRUST_CONFIG_FALSE:
    case App.TRUST_CONFIG_FALSE.toString():
      return 'false';
    case 'true':
    case App.TRUST_CONFIG_TRUE:
    case App.TRUST_CONFIG_TRUE.toString():
      return 'true';
    default:
      return 'unknown'

  }
}

/**
 * Convert integer code of priority to corresponding string representation
 *
 * @param {number} priority A numerical code for priority level
 * @return {string} The corresponding string representation for that priority level: 'unknown', 'success', 'info', 'warning', or 'error'
 */
App.priorityToType = function (priority, good) {
  if (typeof priority === 'string') priority = priority.toLowerCase();
  switch (priority) {
    case null:
      return null;
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
      return (good) ? 'good' : 'success';
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
    case App.CRITICAL:
    case App.CRITICAL.toString():
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
    case null:
      return 'hide';
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
    case App.CRITICAL:
    case App.CRITICAL.toString():
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
    case null:
      return null;
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
    case App.REBOOTING:
    case App.REBOOTING.toString():
    case 'rebooting':
      return 'rebooting';
    case App.PAUSED:
    case App.PAUSED.toString():
    case 'paused':
      return 'paused';
    case App.SUSPENDED:
    case App.SUSPENDED.toString():
    case 'suspended':
      return 'suspended';
        case App.LIVE_MIGRATING:
    case App.LIVE_MIGRATING.toString():
    case 'live migrating':
      return 'live migrating';
    case App.MIGRATING_RESIZING:
    case App.MIGRATING_RESIZING.toString():
    case 'migrating resizing':
      return 'migrating resizing';
    case App.CONFIRMATION_NEEDED:
    case App.CONFIRMATION_NEEDED.toString():
    case 'confirmation needed':
      return 'confirmation needed';
    case App.REVERTING:
    case App.REVERTING.toString():
    case 'reverting':
      return 'reverting';
    case App.MIGRATION_BLOCKED:
    case App.MIGRATION_BLOCKED.toString():
    case 'migration blocked':
      return 'migration blocked';
    case App.SHELVING:
    case App.SHELVING.toString():
    case 'shelving':
      return 'shelving';
    case App.SHELVED:
    case App.SHELVED.toString():
    case 'shelved':
      return 'shelved';
    case App.SHELVED_OFFLOADED:
    case App.SHELVED_OFFLOADED.toString():
    case 'shelved offloaded':
      return 'shelved offloaded';
    default:
      return 'unknown';
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
    case null:
      return 'hide';
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
    case App.REBOOTING:
    case App.REBOOTING.toString():
    case 'rebooting':
      return 'icon-spinner icon-spin';
    case App.PAUSED:
    case App.PAUSED.toString():
    case 'paused':
      return 'icon-pause';
    case App.SUSPENDED:
    case App.SUSPENDED.toString():
    case 'suspended':
      return 'icon-pause';
    case App.LIVE_MIGRATING:
    case App.LIVE_MIGRATING.toString():
    case 'live migrating':
      return 'icon-truck icon-flip-horizontal blink-success';
    case App.MIGRATING_RESIZING:
    case App.MIGRATING_RESIZING.toString():
    case 'migrating resizing':
      return 'icon-truck icon-flip-horizontal blink-success';
    case App.CONFIRMATION_NEEDED:
    case App.CONFIRMATION_NEEDED.toString():
    case 'confirmation needed':
      return 'icon-comments';
    case App.REVERTING:
    case App.REVERTING.toString():
    case 'reverting':
      return 'icon-truck blink-warning';
    case App.MIGRATION_BLOCKED:
    case App.MIGRATION_BLOCKED.toString():
    case 'migration blocked':
      return 'icon-minus-sign';
    case App.SHELVING:
    case App.SHELVING.toString():
    case 'shelving':
      return 'icon-folder-close blink-success';
    case App.SHELVED:
    case App.SHELVED.toString():
    case 'shelved':
      return 'icon-folder-close';
    case App.SHELVED_OFFLOADED:
    case App.SHELVED_OFFLOADED.toString():
    case 'shelved offloaded':
      return 'icon-folder-open';
    default:
      return 'icon-question-sign';
  }
};

App.overallHealth = function (health, operational) {
  if (health === App.SUCCESS) {
    return App.codeToOperational(operational);
  } else {
    return App.priorityToType(health);
  }
};

App.trustToString = function (value) {
  switch (value) {
    case null:
      return null;
    case App.UNKNOWN:
    case '0':
      return 'unknown';
    case App.UNTRUSTED:
    case '1':
      return 'untrusted';
    case App.TRUSTED:
    case '2':
      return 'trusted';
    case App.UNREGISTERED:
    case '3':
      return 'unregistered';
    default:
      return App.NOT_APPLICABLE;
  }
}

/**
 * Convert trust status to corresponding icon class
 *
 * @param {number} code A numerical code for trust status
 * @return {string} The corresponding icon class (to be applied to an <i> tag)
 */
App.trustToIconClass = function (code) {
  if (typeof code === 'string') code = code.toLowerCase();
  switch (code) {
    case null:
      return 'hide';
    case App.UNKNOWN:
    case App.UNKNOWN.toString():
      return 'icon-question-sign unknown';
    case App.UNTRUSTED:
    case App.UNTRUSTED.toString():
      return 'icon-unlock untrusted';
    case App.TRUSTED:
    case App.TRUSTED.toString():
      return 'icon-lock trusted';
    case App.UNREGISTERED:
    case App.UNREGISTERED.toString():
      return 'icon-unlock unregistered';
    default:
      return 'icon-question-sign';
  }
}


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
