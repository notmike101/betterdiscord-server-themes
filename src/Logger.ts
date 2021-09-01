export class Logger {
  static info(message: any, ...optionalParams: any[]): void {
    this.log('info', message, ...optionalParams);
  }

  static warn(message: any, ...optionalParams: any[]): void {
    this.log('warn', message, ...optionalParams);
  }

  static error(message: any, ...optionalParams: any[]): void {
    this.log('error', message, ...optionalParams);
  }

  static debug(message: any, ...optionalParams: any[]): void {
    this.log('debug', message, ...optionalParams);
  }

  static log(
    level: 'debug' | 'info' | 'warn' | 'error',
    message: any,
    ...optionalParams: any[]
  ): void {
    // eslint-disable-next-line no-console
    console[level](message, ...optionalParams);
  }
}
