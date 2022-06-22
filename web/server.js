const cli = require("next/dist/cli/next-start");
console.log(`using port ${process.env.PORT || 3000}`);
cli.nextStart(["-p", process.env.PORT || 3000]);
