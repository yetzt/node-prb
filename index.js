
const prb = module.exports = function prb(max, opt){
	if (!this instanceof prb) return new prb(max, opt);

	opt = opt || {};

	const self = this;
	self.max = max;
	self.precision = opt.precision || 0;
	self.prefix = opt.prefix || "";
	self.char = opt.char || "="; // '█', '▬'
	self.width = opt.width || null;
	self.cursor = (opt.hidecursor === false);

	self.complete = false;
	self.percentstr = null;
	self.value = 0;

	self.stream = (opt.stream || process.stderr);

	self.percentagewidth = (self.precision > 0) ? 5+self.precision : 4;

	// disable cursor
	if (!self.cursor && self.stream.isTTY) this.stream.write('\x1B[?25l');

	return function update(value){
		if (self.complete) return;

		self.value = value||0;

		if (self.stream.isTTY) { // only if tty

			let ratio = Math.min((self.value / self.max), 1);
			let percentstr = ((ratio*100).toFixed(self.precision)+"%").padStart(self.percentagewidth, ' ');

			if (self.percentstr !== percentstr) {
				self.percentstr = percentstr;

				self.stream.write("\r");

				let barwidth = opt.width || process.env.COLUMNS || self.stream.columns || 80;
				barwidth -= (self.percentstr.length + 1);

				if (!!self.prefix) {
					barwidth -= self.prefix.length+1;
					self.stream.write(self.prefix+" ");
				}
				self.stream.write(self.percentstr+" "+self.char.repeat(Math.round(barwidth * ratio))+"\r");

			}

		}

		if (value >= max) {
			if (!self.stream.isTTY) { // if not a tty, just print when complete
				if (self.prefix) self.stream.write(self.prefix+" ");
				self.stream.write((100).toFixed(self.precision)+"%");
			}

			self.stream.write("\n"); // final newline
			self.complete = true; // no more updates
			if (!self.cursor) self.stream.write('\x1B[?25h'); // re-enable cursor
		}

	};
};
