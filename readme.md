# pbr

`pbr` is a very small, simple and dependency-free terminal progress bar. it conforms to your terminal width and downgrades to just an output when complete in a pipe.

## usage example

``` javascript

const pbr = require("pbr");

const bar = pbr(100, {
	prefix: "test",
	precision: 2,
	char: '█',
	width: 80, // optional: bar width; default: tty columns
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

```

```
start
test 100.00% ██████████████████████████████████████████████████████████████████
complete
```

## license

[UNLICENSE](UNLICENSE)
