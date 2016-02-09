let cookie = (cookieStr, url) => {
	let cookieArr = cookieStr.split('; ');
	let per = {};
	let res = [];
	let val;
	let domain = url.match(/\/\/(.*?)[\?\/$]/)[1];
	cookieArr.forEach((cookie) => {
		val = cookie.match(/(.*?)\=(.*?$)/);
		per = {
			name: val[1],
			value: val[2],
			domain,
			path: '/',
			httponly: true,
			secure: false,
			expires: (new Date()).getTime() + (1000 * 60 * 60) /* <-- expires in 1 hour */
		};
		res.push(per);
	});
	return res;
};

module.exports = {
	cookie
};