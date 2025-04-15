// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-extraneous-class */
// /* eslint-disable no-console */
// import chalk, { type ChalkInstance } from 'chalk';

// const stringify = (value: any): string => typeof value !== 'object' ? value : JSON.stringify(value, null, 2);

// export class Logger {
//   private static readonly prefix: string | undefined;

//   private static print (chalkInstance: ChalkInstance, ...logs: any[]): void {
//     const normallizedLogs = logs.map((log) => stringify(log));
//     console.log(chalkInstance(...normallizedLogs));
//   }

//   static log (...logs: any[]): void {
//     console.log(...logs);
//   }

//   static info (...logs: any[]): void {
//     Logger.print(chalk.blue, ...logs);
//   }

//   static success (...logs: any[]): void {
//     Logger.print(chalk.green, '✅', ...logs);
//   }

//   static warn (...logs: any[]): void {
//     Logger.print(chalk.yellow, ...logs);
//   }

//   static danger (...logs: unknown[]): void {
//     Logger.print(chalk.red, '❗', ...logs);
//   }

//   static bgred (...logs: unknown[]): void {
//     Logger.print(chalk.bgRed, ...logs);
//   }

//   static error (error: unknown): void {
//     try {
//       console.log(chalk.bgRed('========================================='));
//       if (error instanceof Error) {
//         Logger.danger(`[ERROR] ${error.message}`);
//         if (error.stack) {
//           console.log(chalk.red('STACKTRACE ------------------------------'));
//           console.log(chalk.red(error.stack));
//           console.log(chalk.red('-----------------------------------------'));
//         }
//       } else {
//         Logger.danger('[ERROR]');
//         Logger.danger(error);
//       }
//       console.log(chalk.bgRed('========================================='));
//     } catch (exception) {
//       console.error(chalk.red(exception));
//     }
//   }
// }
