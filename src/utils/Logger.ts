import chalk, { ChalkObj } from "@nothing628/chalk";
import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

class Logger {
  private chalk = chalk;

  private prefix(type: string, color: ChalkObj) {
    return color(` ${type} `) + `:`;
  }

  async prompt(message: string): Promise<string> {
    try {
      const prefix = this.prefix(
        "PROMPT",
        this.chalk.bgHex("#0099ffff") as ChalkObj,
      );

      const rl = readline.createInterface({ input, output });

      return await new Promise<string>((resolve, reject) => {
        const onSigint = () => {
          rl.close();
          reject(new Error("Aborted by user (Ctrl+C)"));
        };

        rl.on("SIGINT", onSigint);

        rl.question(`${prefix} ${message}: `, (ans) => {
          rl.removeListener("SIGINT", onSigint);
          rl.close();
          resolve(ans);
        });
      });
    } catch (_error) {
      return "";
    }
  }

  public msg(message: string, type: string, color: ChalkObj) {
    const prefix = this.prefix(type.toUpperCase(), color);

    console.log(`${prefix} ${this.chalk.grey(message)}`);
  }

  public info(message: string) {
    const prefix = this.prefix("INFO", this.chalk.bgBlue);

    console.log(`${prefix} ${this.chalk.grey(message)}`);
  }

  public error(message: string) {
    const prefix = this.prefix("ERROR", this.chalk.bgRed);
    console.log(`${prefix} ${this.chalk.grey(message)}`);
  }

  public success(message: string) {
    const prefix = this.prefix("SUCCESS", this.chalk.bgGreen);

    console.log(`${prefix} ${this.chalk.grey(message)}`);
  }

  public debug(message: string) {
    const prefix = this.prefix(
      "DEBUG",
      this.chalk.bgHex("#800080") as ChalkObj,
    );
    console.log(`${prefix} ${this.chalk.grey(message)}`);
  }

  public process(message: string) {
    //Yellow
    const prefix = this.prefix(
      "PROCESS",
      this.chalk.bgHex("#FFFF00") as ChalkObj,
    );
    console.log(`${prefix} ${this.chalk.grey(message)}`);
  }
}

export { Logger };
