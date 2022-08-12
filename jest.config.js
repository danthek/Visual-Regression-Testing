module.exports = {
	rootDir: './tests-snapshots', //we set the root for the test
	testTimeout: 30000,
	bail: 0, // the test will not termiate the process on the first fail, it will run all. i.e. If we put "1" , it will terminate the test after the 1st fail.
}
