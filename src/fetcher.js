const path = require('path');

const child_process = require('child_process');
const spawn = child_process.spawn;

const phantomjs = require('phantomjs');
const binPath = phantomjs.path;

// const DEFAULT_DATA_DIRNAME = process.cwd();
const PHANTOMJS_DIR = path.join(__dirname, 'phantomjs');
const PHANTOMJS_FILE = path.join(PHANTOMJS_DIR, 'main.js');

class Fetcher {
	constructor(url, cb, option) {
		this.url = url;
		this.cb = cb;
		this.option = option || {};
		this.init();
	}
	init() {
		this.process();
	}
	process() {
		let self = this;
		let proc = spawn(binPath, [PHANTOMJS_FILE, this.url], {
			stdio: "inherit"
		});
		proc.on('exit', () => {
			self.cb();
		});
	}
}

module.exports = Fetcher;