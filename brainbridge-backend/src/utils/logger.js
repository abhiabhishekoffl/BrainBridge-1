const logger = {
  info: (message, ...args) => {
    console.log(`[INFO] ${message}`, ...args);
  },
  warn: (message, ...args) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message, ...args) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  http: (message, ...args) => {
    console.log(`[HTTP] ${message}`, ...args);
  },
};

export default logger;
export { logger };
