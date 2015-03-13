// Generate a v4 (random) UUID
App.uuid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random()*16|0;
    var v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

App.humanize = function (str) {
  var newString = str.replace(/_id$/, '').replace(/_/g, ' ').replace(/^\w/g, function (s) {
    return s.toUpperCase();
  });
  Object.keys(App.caseMapping).forEach(function (searchString) {
    var replacementString = App.caseMapping[searchString];
    newString = newString.replace(new RegExp(searchString, 'ig'), replacementString);
  });
  return newString;
};

// Console.log wrapper
App.log = function () {
  App.log.history = App.log.history || [];   // store logs to an array for reference
  if (arguments.length === 1) {
    App.log.history.push(arguments[0]);
    if (this.console) console.log(arguments[0]);
  } else if (arguments.length > 1) {
    App.log.history.push(arguments);
    if (this.console) console.log(Array.prototype.slice.call(arguments));
  }
};

App.getApiDomain = function() {
  return (localStorage.apiDomain) ? '//' + localStorage.apiDomain : '//' + window.location.host + window.location.pathname.split('/').slice(0, -1).join('/');
};

// Messaging/events
App.notify = function (message, type, notifyTitle, sticky) {
  if (message.length > 600) message = message.substring(0, 600) + '... [truncated]';
  if (typeof type === 'undefined') {
    type = 'warning';
  } else {
    type = App.priorityToType(type);
  }
  if (typeof notifyTitle === 'undefined' || !notifyTitle) {
    notifyTitle = type.capitalize();
  }
  // Display notification to screen
  Ember.$.pnotify({
    title: notifyTitle,
    text: message,
    type: type,
    sticker: false,
    animate_speed: 200,
    hide: (sticky) ? false : true
  });
};
App.event = function (message, type, notify, title, sticky) {
  if (typeof type === 'undefined') type = App.WARNING;
  type = App.priorityToType(type);
  if (typeof message === 'undefined') {
    var prefix = (type === 'info' || type === 'error') ? 'An ' : 'A ';
    message = prefix + type + ' event occurred';
  }
  if (typeof notify === 'undefined' || notify === true) {
    var notifyTitle = (typeof title === 'undefined' || !title) ? null : title;
    App.notify(message, type, notifyTitle, sticky);
  }
};
// Hide message history pull-down
$.pnotify.defaults.history = false;


// Extend built-in Ember views
Ember.TextSupport.reopen({
  attributeBindings: ['required', 'autofocus']
});
Ember.SelectOption.reopen({
  attributeBindings: ['value', 'selected', 'disabled'],
  disabled: function() {
    var content = this.get('content');
    return content.disabled || false;
  }.property('content')
});


// View helpers
App.isEmpty = function (value) {
  return (Ember.isEmpty(value) || value === -1);
};
App.readableSizeToBytes = function (stringSize, decimalPrefix) {
  if (!stringSize) return null;
  var intSize = parseInt(stringSize);
  var inputUnits = stringSize.replace(intSize, '').trim().toUpperCase();
  var decimalUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var binaryUnits = ['B', 'KIB', 'MIB', 'GIB', 'TIB', 'PIB', 'EIB', 'ZIB', 'YIB'];
  if (decimalUnits.indexOf(inputUnits) !== -1) {
    var power = (typeof decimalPrefix === 'undefined') ? 1000 : (decimalPrefix ? 1000 : 1024);
    var multiplier = Math.pow(power, decimalUnits.indexOf(inputUnits));
    return intSize * multiplier;
  } else if (binaryUnits.indexOf(inputUnits) !== -1) {
    var power = (typeof decimalPrefix === 'undefined') ? 1024 : (decimalPrefix ? 1000 : 1024);
    var multiplier = Math.pow(power, binaryUnits.indexOf(inputUnits));
    return intSize * multiplier;
  } else {
    return null;
  }
};
App.bytesToReadableSize = function (sizeInBytes, multiplier, decimalPrefix) {
  if (typeof sizeInBytes !== 'number') sizeInBytes = parseInt(sizeInBytes);
  if (sizeInBytes === NaN || Ember.isEmpty(sizeInBytes)) {
    return App.NOT_APPLICABLE;
  } else {
    if (multiplier !== undefined) {
      sizeInBytes = sizeInBytes * multiplier;
    }
    if (sizeInBytes < 0) {
      return App.NOT_APPLICABLE;
    } else if (sizeInBytes === 0) {
      return '0';
    }
    var sizeInBytesStored = sizeInBytes.toFixed(1);
    // Default to binary/IEC prefixes rather than decimal/SI prefixes
    var byteUnits = (decimalPrefix) ? ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var power = (decimalPrefix) ? 1000 : 1024;
    var i = 0;

    while (sizeInBytes >= power) {
      sizeInBytes = sizeInBytes / power;
      i++;
    }
    if (typeof(byteUnits[i]) != "undefined") {
      return Math.max(sizeInBytes, 0.1).toFixed(1) + ' ' + byteUnits[i];
    } else {
      //too large
      return sizeInBytesStored + ' ' + 'B';
    }
  }
};
App.readableSize = function (size) {
  if (typeof size === 'string') {
    // Assume backend is using historic units for customary binary prefixes
    var byteUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    size = size.split(' ');
    if (size[1] && byteUnits.indexOf(size[1].toUpperCase()) !== -1) {
      var multiplier = Math.pow(1024, byteUnits.indexOf(size[1].toUpperCase()));
      var sizeBase = parseInt(size[0]);
      if (sizeBase !== NaN) {
        return App.bytesToReadableSize(sizeBase, multiplier);
      } else {
        return App.NOT_APPLICABLE;
      }
    } else {
      return App.NOT_APPLICABLE;
    }
  } else if (typeof size === 'number') {
    return App.bytesToReadableSize(size);
  } else {
    return App.NOT_APPLICABLE;
  }
};

App.numberWithCommas = function (number) {
  if (number){
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

App.isOdd = function (number) {
  return (number % 2) == 1;
}

App.isCriticalityPlus = function(criticality) {
  var criticality = (typeof criticality.get === 'function' ? criticality.get('label') : criticality.label);

  if (criticality.indexOf('+') > -1) {
    return true;
  } else {
    return false;
  }
}

// Handlebars helpers

Ember.Handlebars.registerHelper('unlessEmpty', function(property, fn) {
  var context = (fn.contexts && fn.contexts[0]) || this;
  var func = function(value) {
    if (typeof value === 'boolean') return value;
    return !Ember.isEmpty(value);
  };
  return Ember.Handlebars.bind.call(context, property, fn, true, func, func);
});

Ember.Handlebars.registerHelper('isNonNegativeNumber', function(property, fn) {
  var context = (fn.contexts && fn.contexts[0]) || this;
  var func = function(value) {
    if (typeof value === 'boolean') return value;
    return (parseInt(value) > 0 || parseInt(value) == 0);
  }
  return Ember.Handlebars.bind.call(context, property, fn, true, func, func);
});

Ember.Handlebars.registerBoundHelper('readableError', function (xhr) {
  return App.xhrErrorMessage(xhr);
});

Ember.Handlebars.registerBoundHelper('capitalize', function (string) {
  if (typeof string !== 'string') return null;
  return string.toString().capitalize();
});

Ember.Handlebars.registerBoundHelper('uppercase', function (string) {
  if (typeof string !== 'string') return null;
  return string.toString().toUpperCase();
});

Ember.Handlebars.registerBoundHelper('numberOf', function (items) {
  return items.get('length');
}, '@each');

Ember.Handlebars.registerBoundHelper('concatenate', function (items) {
  if (Ember.isEmpty(items) || Ember.typeOf(items) !== 'array') return '';
  return items.join(', ');
}, '@each');

Ember.Handlebars.registerBoundHelper('timeago', function (time) {
  if (!time) return null;
  if (time == -1) return App.NOT_APPLICABLE;
  return new Handlebars.SafeString('<time class="timeago" datetime="' + moment(time).format() + '" title="' + moment(time).format('YYYY-MM-DD hh:mm:ss') + '"' + '>' + moment(time).fromNow() + '</time>');
});

Ember.Handlebars.registerBoundHelper('duration', function (duration) {
  if (!duration) return null;
  if (duration == -1) return App.NOT_APPLICABLE;
  return (App.isEmpty(duration)) ? App.NOT_APPLICABLE : moment.duration(duration, 'seconds').humanize();
});

Ember.Handlebars.registerBoundHelper('timestamp', function (time) {
  if (!time) return null;
  if (time == -1) return App.NOT_APPLICABLE;
  if (typeof time === 'number') time *= 1000;  // Convert from Unix timestamp to milliseconds from epoch
  return new Handlebars.SafeString('<time class="timestamp" datetime="' + moment(time).format() + '">' + moment(time).format('LLL') + '</time>');
});

Ember.Handlebars.registerBoundHelper('year', function (time) {
  if (!time) return null;
  if (time == -1) return App.NOT_APPLICABLE;
  if (typeof time === 'number') time *= 1000;  // Convert from Unix timestamp to milliseconds from epoch
  return new Handlebars.SafeString('<time class="timestamp" datetime="' + moment(time).format('YYYY') + '">' + moment(time).format('YYYY') + '</time>');
});

Ember.Handlebars.registerBoundHelper('na', function (value) {
  return (value == -1) ? App.NOT_APPLICABLE : value;
});

Ember.Handlebars.registerBoundHelper('status', function (code) {
  return (code == -1) ? App.NOT_APPLICABLE : App.priorityToType(code).toString().capitalize();
});

Ember.Handlebars.registerBoundHelper('operational', function (code) {
  return (code == -1) ? App.NOT_APPLICABLE : App.codeToOperational(code).toString().capitalize();
});

Ember.Handlebars.registerBoundHelper('healthIcon', function (code) {
  return new Handlebars.SafeString('<i class="' + App.priorityToType(code) + ' ' + App.priorityToIconClass(code) + ' icon-large fixed-width"></i>');
});

Ember.Handlebars.registerBoundHelper('healthText', function (code) {
  return App.priorityToType(code, true).capitalize();
});

Ember.Handlebars.registerBoundHelper('trust', function (code) {
  return (code == -1) ? App.NOT_APPLICABLE : App.trustToString(code).capitalize();
});

Ember.Handlebars.registerBoundHelper('trustIcon', function (code) {
  return new Handlebars.SafeString('<i class="' + App.trustToString(code) + ' ' + App.trustToIconClass(code) + ' icon-large fixed-width"></i>');
});

Ember.Handlebars.registerBoundHelper('operationalIcon', function (code) {
  return new Handlebars.SafeString('<i class="' + App.codeToOperational(code) + ' ' + App.operationalToIconClass(code) + ' icon-large fixed-width"></i>');
});

Ember.Handlebars.registerBoundHelper('slaIcon', function (code) {
  return new Handlebars.SafeString('<i class="' + App.codeToOperational(code) + ' ' + App.operationalToIconClass(code) + ' icon-large fixed-width"></i>');
});

Ember.Handlebars.registerBoundHelper('readableSize', function (size) {
  return App.readableSize(size);
});

Ember.Handlebars.registerBoundHelper('readableBytes', function (sizeInBytes) {
  return App.bytesToReadableSize(sizeInBytes);
});

Ember.Handlebars.registerBoundHelper('readableMegabytes', function (sizeInMegabytes) {
  return App.bytesToReadableSize(sizeInMegabytes, 1048576);
});

Ember.Handlebars.registerBoundHelper('oneDecimal', function (value) {
  if (value) {
    return value.toFixed(1);
  } else {
    return App.NOT_APPLICABLE;
  }
});

Ember.Handlebars.registerBoundHelper('toFixed', function (number, digits) {
  if (isNaN(parseFloat(number))) {
    return null;
  } else {
    number = parseFloat(number);
  }
  if (digits === undefined) digits = 0;
  return number.toFixed(digits);
});

Ember.Handlebars.registerBoundHelper('numberWithCommas', function (value) {
  return App.numberWithCommas(value);
});

/*
Ember.Handlebars.registerHelper('eachWithParams', function(property, options) {
  console.log('>here<');
  console.log('property', property);
  console.log('options', options);
  Ember.defineProperty(this, 'isLive', Ember.computed('isNew', 'isDeleted', 'isLoading', function() {
    return !model.get('isNew') && !model.get('isDeleted') && !model.get('isLoading');
  }));
  //return Ember.Handlebars.helpers.boundIf.call(this, "isLive", options);
});
*/

// Miscellaneous helpers
App.selectTab = function (event) {
  var tabClassName = $(event.target).text().toLowerCase().replace(/ /g,'-');
  $(event.target).parent('li').addClass('active').siblings().removeClass('active');
  var tab = $(event.target).closest('.nav-tabs').next('.tab-content').find('.' + tabClassName);
  tab.addClass('active').siblings().removeClass('active');
};

/**
 * Generates a standard PDF templated report using jsPDF
 *
 * @param {object} reportContent The value to iterate over for generating all report rows
 * @param {array} rowContent The value to iterate over for generating each section of rows
 * @param {string} value The title of the PDF report
 * @param {string} value The subtitle of the PDF report
 * @param {string} enumerablePath The path inside of the reportContent object to iterate over.
 * @return {pdf}
 */
 App.pdfReport = function (reportContent, rowContent, title, subtitle, enumerablePath) {
  var doc = new jsPDF();
  // Header
  doc.setFontSize(22);
  var logo = 'data:image/jpeg;base64,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';
  doc.addImage(logo, 'JPEG', 8, 20, 20, 14);
  doc.text(28, 25, title);
  doc.text(28, 35, subtitle);
  //Rows
  doc.setFontSize(10);
  var rowCounter = 0;
  var verticalRowPosition = 55;
  var leftPosition = 10;

  if (reportContent.get(enumerablePath)) {
    reportContent.get(enumerablePath).forEach(function (item, index, enumerable) {
      rowContent.forEach(function (item2, index2, enumerable2) {
        if (rowCounter % 22 == 0 && rowCounter != 0) {
          verticalRowPosition = 25;
          doc.addPage();
        }
        doc.text(leftPosition, verticalRowPosition, eval(rowContent[index2]));
        verticalRowPosition += 10;
        rowCounter++;
      });
      verticalRowPosition += 10; //white space divider between items
      rowCounter++;
    });
  } else {
    doc.text(leftPosition, verticalRowPosition, 'No attestations found.');
  }
  doc.save(title + '.pdf');
};

App.percentageToRange = function (value, minimum, maximum) {
  percent = value / maximum;
  percent = Math.round(percent * 100);
  return percent;
};

App.associativeToNumericArray = function (associativeArray) {
  var numericArray = [];
  for (var key in associativeArray) {
    numericArray.push(associativeArray[key]);
  }
  return numericArray;
};

/**
 * Extract an error message from a JSON object
 *
 * @param {object} response - The JSON object returned from the API (already JSON.parse'd)
 * @param {string} [separator=<br>]
 * @returns {string} Error message if found, otherwise the empty string
 */
App.errorMessage = function (response, separator) {
  if (typeof separator === 'undefined') separator = '<br>';
  if (response.meta && response.meta.registration_status) {
    return response.meta.registration_status.mapBy('error_message').join(separator);
  }
  if (Ember.isArray(response)) {
    return response.join(separator);
  } else if (response.hasOwnProperty('errors')) {  // Check errors first in case response is actually a DS.InvalidError
    if (Ember.isArray(response.errors)) {
      return response.errors.join(separator);
    } else if (typeof response.errors === 'string') {
      return response.errors;
    // Expected format from backend for 422 validation errors
    } else if (typeof response.errors === 'object') {
      return App.associativeToNumericArray(response.errors).join(separator);
    } else {
      return '';
    }
  } else if (response.hasOwnProperty('error_message')) {
    return response.error_message;
  } else if (response.hasOwnProperty('message')) {
    return response.message;
  } else {
    return '';
  }
};

/**
 * Return an error notification given the XHR object
 *
 * @param {object} xhr - the XHR object (e.g. an XMLHTTPRequest object, jqXHR object, or the XHR parameter passed to the Promises/A+ error handler)
 * @param {string} [defaultMessage] - The error message to display if no message is found in the XHR response text. Defaults to a message of the form: 'An error occured: 404 Not Found'.
 * @returns {string} The error message, which is also displayed in the UI
 */
App.xhrErrorMessage = function (xhr, defaultMessage) {
  var errorMessage = defaultMessage || 'An error occured: ' + xhr.status + ' ' + xhr.statusText;
  try {
    var json = (xhr.hasOwnProperty('responseText')) ? Ember.$.parseJSON(xhr.responseText) : xhr;
    errorMessage = App.errorMessage(json) || errorMessage;
  } catch(error) {}
  return errorMessage;
}

/**
 * Display an error notification given the XHR object
 *
 * @param {object} xhr - the XHR object (e.g. an XMLHTTPRequest object, jqXHR object, or the XHR parameter passed to the Promises/A+ error handler)
 * @param {string} [defaultMessage] - The error message to display if no message is found in the XHR response text. Defaults to a message of the form: 'An error occured: 404 Not Found'.
 * @returns {string} The error message, which is also displayed in the UI
 */
App.xhrError = function (xhr, defaultMessage, severity) {
  var errorMessage = App.xhrErrorMessage(xhr, defaultMessage);
  var severity = (severity !== undefined) ? severity : (xhr.status == 422) ? App.WARNING : App.ERROR;
  App.event(errorMessage, severity);
  return errorMessage;
}

/**
 * Sort two inputs
 *
 * @param {string|number|boolean} a
 * @param {string|number|boolean} b
 * @returns {number} -1 if a < b, 0 if a == b, or 1 if a > b
 */
App.naturalSort = function (a, b) {
  // Sort undefined/null as less than non-undefined/non-null
  if (a === undefined || a === null) {
    return (b === undefined || b === null) ? 0 : -1;
  } else if (b === undefined || b === null) {
    return 1;
  }
  return naturalSort(a, b);
}

// Keyboard shortcuts
Mousetrap.bind('shift+ctrl+alt+i', function (e) {
  $('footer').toggle();
});

// Debounced observers that will only fire once at end of interval if no additional calls have been made
Ember.debouncedObserver = function (debounceFunction, property, interval) {
  return Ember.observer(function () {
    Ember.run.debounce(this, debounceFunction, interval);
  }, property);
};


// Generic isEmpty detection and string handling
App.na = function(value) {
  if (!value) return null;
  if (value == -1) return App.NOT_APPLICABLE;
  return value;
}

App.isComputeSlo = function(sloType) {
  switch(sloType) {
    case 'assured-cores-physical':
    case 'assured-scu-vm':
    case 'assured-scu-vcpu':
      return true;
    default:
      return false;
  }
}

App.isTrustSlo = function(sloType) {
  switch(sloType) {
    case 'trusted_platform':
      return true;
    default:
      false;
  }
}
