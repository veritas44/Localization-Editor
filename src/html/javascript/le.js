/*jslint devel: true, undef: true, unparam: true, vars: true, white: true, maxerr: 50, indent: 4, plusplus: false, browser: true */
// © Copyright 2011, William H. Prescott

"use strict";

var localization;

/**
	@class Handles the the adding a new prompt
*/
function AddLanguage(id, ut, lang) {
	ControlElement.call(this, id);
	this.onClick = function () {
		var langElem = document.getElementById('addLanguage');
		var langValue = langElem.value;
		
		var url = "ajax/addLanguage.php";
		var request = "string=" + langValue;
		
		var xmlHttp = ut.ajaxFunction();
		xmlHttp.onreadystatechange = function () {
			if(xmlHttp.readyState === 4) {
				var jsonObj = JSON.parse(xmlHttp.responseText);
				if (!jsonObj.resultFlag) {
					console.log("Response: "+xmlHttp.responseText);
				}						
				window.location.reload(true);
			}
		};
		xmlHttp.open("POST",url,true);
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlHttp.setRequestHeader("Content-length", request.length);
		xmlHttp.setRequestHeader("Connection", "close");		
		xmlHttp.send(request);
/*
*/
	};
}
AddLanguage.prototype = new ControlElement();

/**
	@class Handles the the adding a new prompt
*/
function AddPrompt(id, ut, lang) {
	ControlElement.call(this, id);
	this.onClick = function () {
		var promptElem = document.getElementById('addPrompt');
		var promptValue = promptElem.value;
		
		var url = "ajax/addPrompt.php";
		var request = "string=" + promptValue;
		
		var xmlHttp = ut.ajaxFunction();
		xmlHttp.onreadystatechange = function () {
			if(xmlHttp.readyState === 4) {
				var jsonObj = JSON.parse(xmlHttp.responseText);
				if (!jsonObj.resultFlag) {
					console.log("Response: "+xmlHttp.responseText);
				}						
				window.location.reload(true);
			}
		};
		xmlHttp.open("POST",url,true);
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlHttp.setRequestHeader("Content-length", request.length);
		xmlHttp.setRequestHeader("Connection", "close");		
		xmlHttp.send(request);
/*
*/
	};
}
AddPrompt.prototype = new ControlElement();

/**
	@class Handles the translation cancellation
*/
function CancelTranslation(id) {
	ControlElement.call(this, id);
	this.onClick = function () {
//		console.log("Debug 0");
		window.location.reload(true);
	};
}
CancelTranslation.prototype = new ControlElement();

/**
* This class provides general methods for all page objects.
* Most buttons and checkboxes on the page extend this objec
    @class Prototype for all web page control elements. 
*/
function ControlElement(id) {
	this.element = document.getElementById(id);
	this.disable = function () {
		this.element.disabled = true;
	};
	this.enable = function () {
		this.element.disabled = false;
	};
	this.getEnabled = function () {
		return !this.element.disabled;
	};
	this.getState = function () {
		return this.element.checked;
	};
	this.getValue = function () {
		return this.element.value;
	};
	this.setState = function () {
		this.element.checked = true;
	};
	this.setValue = function (val) {
		this.element.value = val;
	};
}

/**
	@class Handle cookie creation, updating, elimination
*/
function CookieHandler() {
	this.createCookie = function (name, value, days) {
		var expires;
		var date;
		if (days) {
			date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toGMTString();
		}
		else {
			expires = "";
		}
		document.cookie = name + "=" + value + expires + "; path=/";
	};
	this.readCookie = function (name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		var c;
		var i;
		for (i=0; i<ca.length; i++) {
			c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1, c.length);
			}
			if (c.indexOf(nameEQ) === 0) {
				return c.substring(nameEQ.length, c.length);
			}
		}
		return null;
	};
	this.eraseCookie = function (name) {
		this.createCookie(name,"",-1);
	};
}

/**
	@class Handles selecting a prompt string
*/
function SelectPrompt(id, ut, lang) {
	ControlElement.call(this, id);
	this.onChange = function (local) {
		var plElem = document.getElementById('promptList');
		var radioBtnElem = document.forms['promptList'].elements;
		var chkdValue = getCheckedValue(radioBtnElem);
		if (local.someTextAreaChanged) {
			if (confirm("Some text has changed.\n"
				+ "Switching prompts will lose the changes.\n"
				+ "Click OK to discard changes.\n"
				+ "Click Cancel to go back without losing changes.")) {
			}
			else {
				return;		
			}
		}
		local.cookieHandler.createCookie("pid", chkdValue);
		window.location.reload(true);
	};
	// From http://www2.somacon.com/p516.php
	// return the value of the radio button that is checked
	// return an empty string if none are checked, or
	// there are no radio buttons
	function getCheckedValue(radioObj) {
		if(!radioObj)
			return "";
		var radioLength = radioObj.length;
		if(radioLength == undefined)
			if(radioObj.checked)
				return radioObj.value;
			else
				return "";
		for(var i = 0; i < radioLength; i++) {
			if(radioObj[i].checked) {
				return radioObj[i].value;
			}
		}
		return "";
	}
	
	// From http://www2.somacon.com/p516.php
	// set the radio button with the given value as being checked
	// do nothing if there are no radio buttons
	// if the given value does not exist, all the radio buttons
	// are reset to unchecked
	function setCheckedValue(radioObj, newValue) {
		if(!radioObj)
			return;
		var radioLength = radioObj.length;
		if(radioLength == undefined) {
			radioObj.checked = (radioObj.value == newValue.toString());
			return;
		}
		for(var i = 0; i < radioLength; i++) {
			radioObj[i].checked = false;
			if(radioObj[i].value == newValue.toString()) {
				radioObj[i].checked = true;
			}
		}
	}
}
SelectPrompt.prototype = new ControlElement();

/**
	@class Handles the language selection
*/
function LanguageButton(id) {
	ControlElement.call(this, id);
	this.onClick = function (optim, cookieHdl) {
		var language;
		language = cookieHdl.readCookie("language");
		// Note: If current language is es, 
		// make it en and visa versa
		if (language === null || language === "es") {
			cookieHdl.createCookie("language", "en", 1000);
			optim.langFlag = "en";
			window.location.reload(true);
		}
		else {
			cookieHdl.createCookie("language", "es", 1000);
			optim.langFlag = "es";
			window.location.reload(true);
		}
	};
	this.getLanguage = function (cookieHdl) {
		var langFlag = cookieHdl.readCookie("language");
		if (langFlag === null) {
			langFlag = "en";
			cookieHdl.createCookie("language", "en", 1000);
		}
		return langFlag;
	};
}
LanguageButton.prototype = new ControlElement();

/**
	@class Handles updating a translation block
*/
function UpdateTranslation(id, ut, lang) {
	ControlElement.call(this, id);
	// Note:
	// in editRecord, id is the id of the record being edited
	// in addRecord, id is the id of related record in another table
	//	ie in adding a comment, id is the id of the owning answer record
	//	ie in adding a answer, id is the id of the owning question record
	//
	this.onClick = function (tid) {
		var saveBtnElem = document.getElementById('saveBtn-' + tid);
		var cancelBtnElem = document.getElementById('cancelBtn-' + tid);
		var editorTextareaElem = document.getElementById('langstring-' + tid);
		var text = editorTextareaElem.value;
		var url = "ajax/updateTranslation.php";
		var request = "tid=" + tid;
		request += "&text=" + encodeURIComponent(text);
		
		var xmlHttp = ut.ajaxFunction();
		xmlHttp.onreadystatechange = function () {
			if(xmlHttp.readyState === 4) {
				var jsonObj = JSON.parse(xmlHttp.responseText);
				if (!jsonObj.resultFlag) {
					console.log("Response: "+xmlHttp.responseText);
				}						
//				window.location.reload();
				saveBtnElem.disabled = true;
				cancelBtnElem.disabled = true;
			}
		};
		xmlHttp.open("POST",url,true);
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlHttp.setRequestHeader("Content-length", request.length);
		xmlHttp.setRequestHeader("Connection", "close");		
		xmlHttp.send(request);
	};
	this.onKeyPress = function(tid) {
		var saveBtnElem = document.getElementById('saveBtn-' + tid);
		var cancelBtnElem = document.getElementById('cancelBtn-' + tid);
		saveBtnElem.disabled = false;
		cancelBtnElem.disabled = false;
	};
}
UpdateTranslation.prototype = new ControlElement();

/**
	@class Useful methods
*/
function Utilities() {
	/**
	* Defines xmlhttp for all browsers
	*/
	this.ajaxFunction = function () {
		var xmlHttp;
		try {
			// Firefox, Opera 8.0+, Safari
			xmlHttp = new XMLHttpRequest();
		}
		catch (e1) { // Internet Explorer
			try {
				xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (e2) {
				try {
					xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (e3) {
					alert("Optim:ajaxFunction: Your browser does not support AJAX.");
				return false;
				}
			}
		}
		return xmlHttp;
	};
	this.returnObjById = function (id) {
		var returnVar;
		if (document.getElementById) {
			returnVar = document.getElementById(id);
		}
		else if (document.all) {
			returnVar = document.all[id];
		}
		else if (document.layers) {
			returnVar = document.layers[id];
		}
		return returnVar;
	};

	this.fixDisplayText = function (string) {
		return string.replace(/\r\n|\r|\n|\n\r/g , '<br />');
	};	
}

/**
	@class Handles response to user input as directed by HandleEvents
*/
function Localization () {
	var index;
	this.version = "6.1.0:2009-06-11";
	// Check for the various File API support.
	
	// Controls
	this.cookieHandler = new CookieHandler();
	this.languageButton = new LanguageButton("Language");
	this.langFlag = this.languageButton.getLanguage(this.cookieHandler);
	this.util = new Utilities();
	
	this.addLanguage = new AddLanguage("AddLanguage", this.util, this.langFlag);
	this.addPrompt = new AddPrompt("AddPrompt", this.util, this.langFlag);
	this.cancelTranslation = new CancelTranslation("CancelTranslation", this.util, this.langFlag);
	this.selectPrompt = new SelectPrompt("SelectPrompt", this.util, this.langFlag);
	this.updateTranslation = new UpdateTranslation("UpdateTranslation", this.util, this.langFlag);

	this.someTextAreaChanged = false;
	
	this.addLanguageOnClick = function () {
		this.addLanguage.onClick();
	};
	this.addPromptOnClick = function () {
		this.addPrompt.onClick();
	};
	this.cancelTranslationOnClick = function () {
		this.cancelTranslation.onClick();
	};
	this.selectPromptOnChange = function () {
		this.selectPrompt.onChange(this);
	};
	this.updateTranslationOnKeyPress = function (tid) {
		this.someTextAreaChanged = true;
		this.updateTranslation.onKeyPress(tid);
	};
	this.updateTranslationOnClick = function (tid) {
		this.updateTranslation.onClick(tid);
		this.someTextAreaChanged = false;
	};
}
/**
	Handles user activity on web page
*/
function handleEvent(type, parameter) {
	switch (type) {
		case "init":
			localization = new Localization(); // This is global, hopefully the only global.
			return this;
			break;
		case "addLanguage":
			localization.addLanguageOnClick();
			break;
		case "addPrompt":
			localization.addPromptOnClick();
			break;
		case "cancelTranslation":
			localization.cancelTranslationOnClick();
			break;
		case "selectPrompt":
			localization.selectPromptOnChange();
			break;
		case "translationTextChanged":
			localization.updateTranslationOnKeyPress(parameter);
			break;
		case "updateTranslation":
			localization.updateTranslationOnClick(parameter);
			break;
		default:
			alert("handleEvents: Type not found: " + type );
			break; 
	}
}

/* ------------------------ Debug utilities --------------------------------*/
function dumpProperties(obj, objName) {
	var tp = typeof(obj);
	var i;
	for (i in obj) {
		if (true) {
			try {
				console.log(objName + "." + i + " = " + obj[i]);
			}
			catch (err) {
				console.log("Error for: " + objName + "." + i);
				console.log("Error description: " + err.description);
			}
		}
	}
	return;
}
function countProperties(obj, objName) {
	var tp = typeof(obj);
	console.log("Type of " + objName + ": " + tp);
	var count = 0;
	var i;
	for (i in obj) {
		if (true) {
			count++;
		}
	}
	console.log("Count: " + count);
}



