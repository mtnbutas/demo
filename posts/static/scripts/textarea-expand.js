
var height = '4em';

document.querySelector('textarea').addEventListener('blur', function() {
	
	if(document.querySelector('textarea').value != "") {
		document.querySelector('textarea').style.height = height;
		document.querySelector('textarea').style.minHeight = '4em';
	}
	else {
		document.querySelector('textarea').style.height = '1.2em';
		document.querySelector('textarea').style.minHeight = '1.2em';
		document.querySelector('button[type=submit]').style.display = 'none';
		document.querySelector('button[type=submit]').disabled = true;
	}
});

document.querySelector('textarea').addEventListener('focus', function() {
	document.querySelector('button[type=submit]').style.display = 'block';

	if(document.querySelector('textarea').value != "") {
		document.querySelector('textarea').style.minHeight = '4em';
	}
	else {
		document.querySelector('textarea').style.minHeight = '4em';
		document.querySelector('textarea').style.height = '4em';
		document.querySelector('button[type=submit]').disabled = true;
		height = '4em'
	}
});

document.addEventListener('input', function (event) {
	if (event.target.tagName.toLowerCase() !== 'textarea') return;

	if(document.querySelector('button[type=submit]').disabled) {
		document.querySelector('button[type=submit]').disabled = false;
	}
	else if(document.querySelector('textarea').value == "") {
		document.querySelector('button[type=submit]').disabled = true;
	}

	autoExpand(event.target);
}, false);


var autoExpand = function (field) {

	// Reset field height
	field.style.height = 'inherit';

	// Get the computed styles for the element
	var computed = window.getComputedStyle(field);

	// Calculate the height
	height = parseInt(computed.getPropertyValue('border-top-width'), 10)
	             + parseInt(computed.getPropertyValue('padding-top'), 10)
	             + field.scrollHeight
	             + parseInt(computed.getPropertyValue('padding-bottom'), 10)
	             + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

	field.style.height = height + 'px';

};
