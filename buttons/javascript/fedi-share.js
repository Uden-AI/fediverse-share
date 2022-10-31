Array.prototype.forEach||(Array.prototype.forEach=function(r){var o,t;if(null==this)throw new TypeError("this is null or not defined");var n=Object(this),e=n.length>>>0;if("function"!=typeof r)throw new TypeError(r+" is not a function");for(arguments.length>1&&(o=arguments[1]),t=0;t<e;){var i;t in n&&(i=n[t],r.call(o,i,t,n)),t++}});
document.addEventListener("DOMContentLoaded", function() {
	var fedi_shares = document.querySelectorAll('.fedi-share')
	fedi_shares.forEach(function(q,i) {
		q.querySelector('.fedi-check-toggle').id = 'fedi-check-toggle-'+i
		q.querySelector('.fedi-check-label').htmlFor = 'fedi-check-toggle-'+i
		q.querySelector('.fedi-share-button').addEventListener('click', function(e) {
			var webreg=new RegExp("^(?:(?:https?|ftp)://)?(?:\\S+(?::\\S*)?@|\\d{1,3}(?:\\.\\d{1,3}){3}|(?:(?:[a-z\\d\\u00a1-\\uffff]+-?)*[a-z\\d\\u00a1-\\uffff]+)(?:\\.(?:[a-z\\d\\u00a1-\\uffff]+-?)*[a-z\\d\\u00a1-\\uffff]+)*(?:\\.[a-z\\u00a1-\\uffff]{2,6}))(?::\\d+)?(?:[^\\s]*)?$","i");
			var options = "toolbar=no,location=no,status=yes,resizable=yes,scrollbars=yes,height=600,width=400";
			var instance = q.querySelector('input[name="fedi-instance-input"]')
			if(webreg.test(instance.value)) {
				var url = `http:\/\/${instance.value.replace(/(^\w+:|^)\/\//, '')}/share?text=${encodeURIComponent(document.title)} ${encodeURIComponent(location.href)}`;
				window.open(url, "new", options);
			} else {
				instance.classList.add('invalid')
				setTimeout(function() {
					instance.classList.remove('invalid')
				}, 300)
			}
		})
		q.addEventListener('mouseleave', function(e) {
			q.querySelector('.fedi-check-toggle').checked = false
		})
	})
});
