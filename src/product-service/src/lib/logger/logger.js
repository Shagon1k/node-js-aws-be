class Logger {
	checkShouldLog() {
    const shouldLog = !TEST && LOG;

		return shouldLog;
	}

	log(...args) {
		let shouldLog = this.checkShouldLog();

		if (shouldLog) {
			console.log(...args);
		}
	}

	error(...args) {
		let shouldLog = this.checkShouldLog();

		if (shouldLog) {
			console.error(...args);
		}
	}
}

export default new Logger();
