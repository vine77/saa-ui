webshims.register('form-validators', function($, webshims, window, document, undefined, options){
"use strict";

(function(){
	if(webshims.refreshCustomValidityRules){
		webshims.error("form-validators already included. please remove custom-validity.js");
	}
	
	var customValidityRules = {};
	var formReady = false;
	var blockCustom;
	var initTest;
	var onEventTest = function(e){
		webshims.refreshCustomValidityRules(e.target);
	};
	
	
	webshims.customErrorMessages = {};
	webshims.addCustomValidityRule = function(name, test, defaultMessage){
		customValidityRules[name] = test;
		if(!webshims.customErrorMessages[name]){
			webshims.customErrorMessages[name] = [];
			webshims.customErrorMessages[name][''] = defaultMessage || name;
		}
		if($.isReady && formReady){
			$('input, select, textarea').each(function(){
				testValidityRules(this);
			});
		}
	};
	webshims.refreshCustomValidityRules = function(elem){
		if(!elem.form || (!initTest && !$.prop(elem, 'willValidate')) ){return;}
		blockCustom = true;
		var customMismatchedRule = $.data(elem, 'customMismatchedRule');
		var validity = $.prop(elem, 'validity') || {};
		var message = '';
		if(customMismatchedRule || !validity.customError){
			var val = $(elem).val();
			$.each(customValidityRules, function(name, test){
				message = test(elem, val) || '';
				customMismatchedRule = name;
				if(message){
					
					if(typeof message != 'string'){
						message = $(elem).data('errormessage') || elem.getAttribute('x-moz-errormessage') || webshims.customErrorMessages[name][webshims.activeLang()] || webshims.customErrorMessages[name]['']; 
					}
					
					if(typeof message == 'object'){
						message = message[name] || message.customError || message.defaultMessage;
					}
					return false;
				}
			});
			
			if(message){
				$.data(elem, 'customMismatchedRule', customMismatchedRule);
			}
			$(elem).setCustomValidity(message);
		}
		blockCustom = false;
	};
	var testValidityRules = webshims.refreshCustomValidityRules;
	
	webshims.ready('forms form-validation', function(){
		
				
		var oldCustomValidity = $.fn.setCustomValidity;
		
		
		$.fn.setCustomValidity = function(message){
			if(!blockCustom){
				this.data('customMismatchedRule', '');
			}
			return oldCustomValidity.apply(this, arguments);
		};
		
		setTimeout(function(){
			webshims.addReady(function(context, selfElement){
				initTest = true;
				$('input, select, textarea', context).add(selfElement.filter('input, select, textarea')).each(function(){
					testValidityRules(this);
				});
				initTest = false;
				formReady = true;
			});
			$(document).on('refreshCustomValidityRules change', onEventTest);
		}, 9);
		
	});
	
})();

/*
 * adds support for HTML5 constraint validation
 * 	- partial pattern: <input data-partial-pattern="RegExp" />
 *  - creditcard-validation: <input class="creditcard-input" />
 *  - several dependent-validation patterns (examples):
 *  	- <input type="email" id="mail" /> <input data-dependent-validation='mail' />
 *  	- <input type="date" id="start" data-dependent-validation='{"from": "end", "prop": "max"}' /> <input type="date" id="end" data-dependent-validation='{"from": "start", "prop": "min"}' />
 *  	- <input type="checkbox" id="check" /> <input data-dependent-validation='checkbox' />
 */
(function(){
	
	var addCustomValidityRule = $.webshims.addCustomValidityRule;
	addCustomValidityRule('partialPattern', function(elem, val){
		if(!val || !elem.getAttribute('data-partial-pattern')){return;}
		var pattern = $(elem).data('partial-pattern');
		if(!pattern){return;}
		return !(new RegExp('(' + pattern + ')', 'i').test(val));
	}, 'This format is not allowed here.');
	
	addCustomValidityRule('tooShort', function(elem, val){
		if(!val || !elem.getAttribute('data-minlength')){return;}
		return $(elem).data('minlength') > val.length;
	}, 'Entered value is too short.');
	
	var groupTimer = {};
	addCustomValidityRule('group-required', function(elem, val){
		var name = elem.name;
		if(!name || elem.type !== 'checkbox' || !$(elem).hasClass('group-required')){return;}
		var checkboxes = $( (elem.form && elem.form[name]) || document.getElementsByName(name));
		var isValid = checkboxes.filter(':checked:enabled');
		if(groupTimer[name]){
			clearTimeout(groupTimer[name]);
		}
		groupTimer[name] = setTimeout(function(){
			checkboxes
				.addClass('group-required')
				.unbind('click.groupRequired')
				.bind('click.groupRequired', function(){
					checkboxes.filter('.group-required').each(function(){
						$.webshims.refreshCustomValidityRules(this);
					});
				})
			;
		}, 9);
		
		return !(isValid[0]);
	}, 'Please check one of these checkboxes.');
	
	// based on https://sites.google.com/site/abapexamples/javascript/luhn-validation
	addCustomValidityRule('creditcard', function(elem, value){
		if(!value || !$(elem).hasClass('creditcard-input')){return;}
		value = value.replace(/\-/g, "");
		//if it's not numeric return true >- for invalid
		if(value != value * 1){return true;}
		var len = value.length;
		var sum = 0;
		var mul = 1;
		var ca;
	
		while (len--) {
			ca = parseInt(value.charAt(len),10) * mul;
			sum += ca - (ca>9)*9;// sum += ca - (-(ca>9))|9
			// 1 <--> 2 toggle.
			mul ^= 3; // (mul = 3 - mul);
		}
		return !((sum%10 === 0) && (sum > 0));
	}, 'Please enter a valid credit card number');
	
	var dependentDefaults = {
		//"from": "IDREF || UniqueNAMEREF", //required property: element 
		"prop": "value", //default: value||disabled	(last if "from-prop" is checked)
		"from-prop": "value", //default: value||checked (last if element checkbox or radio)
		"toggle": false
	};
	
	var getGroupElements = function(elem) {
		return $(elem.form[elem.name]).filter('[type="radio"]');
	};
	$.webshims.ready('form-validation', function(){
		if($.webshims.modules){
			getGroupElements = $.webshims.modules["form-core"].getGroupElements || getGroupElements;
		}
	});
	
	addCustomValidityRule('dependent', function(elem, val){
		
		if( !elem.getAttribute('data-dependent-validation') ){return;}
		
		var data = $(elem).data('dependentValidation');
		var specialVal;
		if(!data){return;}
		var depFn = function(e){
			var val = $.prop(data.masterElement, data["from-prop"]);
			if(specialVal){
				val = $.inArray(val, specialVal) !== -1;
			}
			if(data.toggle){
				val = !val;
			}
			$.prop( elem, data.prop, val);
			if(e){
				$(elem).getShadowElement().filter('.user-error, .user-success').trigger('refreshvalidityui');
			}
		};
		
		if(!data._init || !data.masterElement){
			
			if(typeof data == 'string'){
				data = {"from": data};
			}
			
			
			data.masterElement = document.getElementById(data["from"]) || (document.getElementsByName(data["from"] || [])[0]);
			
			if (!data.masterElement || !data.masterElement.form) {return;}
			
			if(/radio|checkbox/i.test(data.masterElement.type)){
				if(!data["from-prop"]){
					data["from-prop"] = 'checked';
				}
				if(!data.prop && data["from-prop"] == 'checked'){
					data.prop = 'disabled';
				}
			} else if(!data["from-prop"]){
				data["from-prop"] = 'value';
			}
			
			if(data["from-prop"].indexOf('value:') === 0){
				specialVal = data["from-prop"].replace('value:', '').split('||');
				data["from-prop"] = 'value';
				
			}
			
			data = $.data(elem, 'dependentValidation', $.extend({_init: true}, dependentDefaults, data));

			if(data.prop !== "value" || specialVal){
				$(data.masterElement.type === 'radio' && getGroupElements(data.masterElement) || data.masterElement).bind('change', depFn);
			} else {
				$(data.masterElement).bind('change', function(){
					$.webshims.refreshCustomValidityRules(elem);
					$(elem).getShadowElement().filter('.user-error, .user-success').trigger('refreshvalidityui');
				});
			}
		}

		if(data.prop == "value" && !specialVal){
			return ($.prop(data.masterElement, 'value') != val);
		} else {
			depFn();
			return '';
		}
		
	}, 'The value of this field does not repeat the value of the other field');
})();

});
