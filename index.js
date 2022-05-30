
const pbr = module.exports = function pbr(max, opt){
	if (!this instanceof pbr) return new pbr(max, opt);
	
	opt = opt || {};
	
	const self = this;
	self.max = max;
	self.precision = opt.precision || 0;
	self.prefix = opt.prefix || "";
	self.char = opt.char || "="; // '█'
	
	self.complete = false;
	self.percentstr = null;
	self.value = 0;

	self.percentagewidth = (precision > 0) ? 5+precision : 4;
		
	return function update(value){
		if (self.complete) return;
		
		self.value = value||0;
		
		if (process.stdout.isTTY) { // only if tty

			let ratio = Math.min((self.value / self.max), 1);
			let percentstr = ((ratio*100).toFixed(self.precision)+"%").padStart(self.percentagewidth, ' ');
		
			if (self.percentstr !== percentstr) {
				self.percentstr = percentstr;

				process.stdout.write("\r")

				let barwidth = process.env.COLUMNS || process.stdout.columns || 80;
				barwidth -= (self.percentstr.length + 1);

				if (!!self.prefix) {
					barwidth -= self.prefix.length+1;
					process.stdout.write(self.prefix+" ");
				}
				process.stdout.write(self.percentstr+" ");
				
				
				let barchars = Math.round(barwidth * ratio);
				let blankchars = barwidth - barchars;
		
				process.stdout.write(self.char.repeat(barchars));
				
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

const bar = pbr(100, {
	prefix: "test",
	precision: 2,
	char: '█'

})

let n = 0;
console.log("start");
setInterval(function(){
	n += Math.random();
	bar(n);
	if (n > 100) {
		clearInterval(this);
		console.log("complete");
	}
},10);