export class Logger {
  private static formatTime(): string {
    return new Date().toISOString();
  }

  public static info(message: string, ...meta: any[]): void {
    console.log(`[${this.formatTime()}] [INFO] ${message}`, meta.length ? meta : '');
  }

  public static warn(message: string, ...meta: any[]): void {
    console.warn(`[${this.formatTime()}] [WARN] ${message}`, meta.length ? meta : '');
  }

  public static error(message: string, error?: any): void {
    console.error(`[${this.formatTime()}] [ERROR] ${message}`, error?.stack || error || '');
  }
}
