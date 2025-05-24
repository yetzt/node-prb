
const prb = module.exports = function prb(max, opt){
	if (!this instanceof prb) return new prb(max, opt);
	
	opt = opt || {};
	
	const self = this;
	self.max = max;
	self.precision = opt.precision || 0;
	self.prefix = opt.prefix || "";
	self.char = opt.char || "="; // '█'
	self.width = opt.width || null;
	
	self.complete = false;
	self.percentstr = null;
	self.value = 0;

	self.percentagewidth = (self.precision > 0) ? 5+self.precision : 4;

	return function update(value){
		if (self.complete) return;
		
		self.value = value||0;
		
		if (process.stdout.isTTY) { // only if tty

			let ratio = Math.min((self.value / self.max), 1);
			let percentstr = ((ratio*100).toFixed(self.precision)+"%").padStart(self.percentagewidth, ' ');
		
			if (self.percentstr !== percentstr) {
				self.percentstr = percentstr;

				process.stdout.write("\r");

				let barwidth = opt.width || process.env.COLUMNS || process.stdout.columns || 80;
				barwidth -= (self.percentstr.length + 1);

				if (!!self.prefix) {
					barwidth -= self.prefix.length+1;
					process.stdout.write(self.prefix+" ");
				}
				process.stdout.write(self.percentstr+" "+self.char.repeat(Math.round(barwidth * ratio))+"\r");
				
			}

		}
		
		if (value >= max) {
			if (!process.stdout.isTTY) { // if not a tty, just print when complete
				if (self.prefix) process.stdout.write(self.prefix+" ");
				process.stdout.write((100).toFixed(self.precision)+"%");
			}

			process.stdout.write("\n"); // final newline
			self.complete = true; // no more updates
		}
		
	};
};
