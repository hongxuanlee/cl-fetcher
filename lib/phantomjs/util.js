'use strict';

var cookie = function cookie(cookieStr, url) {
	var cookieArr = cookieStr.split('; ');
	var per = {};
	var res = [];
	var val = undefined;
	var domain = url.match(/\/\/(.*?)[\?\/$]/)[1];
	cookieArr.forEach(function (cookie) {
		val = cookie.match(/(.*?)\=(.*?$)/);
		per = {
			name: val[1],
			value: val[2],
			domain: domain,
			path: '/',
			httponly: true,
			secure: false,
			expires: new Date().getTime() + 1000 * 60 * 60 /* <-- expires in 1 hour */
		};
		res.push(per);
	});
	return res;
};

module.exports = {
	cookie: cookie
};