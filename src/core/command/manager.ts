import { parseCommandString } from "./command-parser";
import { CommandAlreadyExistsError, CommandNotFoundError } from "./errors";
import type { Executable, CommandHandler, CommandInfoNoArgs, Middleware, Stack } from "./types";

/**
 * @example
 * ```typescript
 * // Instantiate the Command
 * const command = new Command();
 * 
 * // Handle no arguments
 * command.register(({ args }) => args.length === 0, ({ args }) => {
 *     console.log('Hello, world');
 * });
 * 
 * // Handle one argument
 * command.register(({ args }) => args.length === 1, ({ args }) => {
 *     console.log(`Hello, ${args[0]}`);
 * });
 * 
 * // Handle any other case
 * command.register(({ args }) => {
 *     console.log(`Hello, ${args.join(' ')}`);
 * });
 * 
 * // Register the Command to the Command Manager
 * commandManager.add(['hello', 'hi'], command);
 * 
 * // Execute the Command
 * commandManager.run('hello world');
 * ```
 */
class CommandManager {
    private parseCommandString = parseCommandString;
    private commandMap = new Map<string, Stack>();

    /**
     * 注册命令实例。
     * 
     * @param prefixes - 触发该命令的前缀字符串或字符串数组。
     * @param command - 要注册的命令对象或函数。
     * 
     * @throws {CommandAlreadyExistsError} 当给定的前缀已被注册时会抛出错误。
     * 
     * @example
     * ```typescript
     * add(['假人生成', '假人创建'], spawn);
     * ```
     */
    add(prefixes: string | string[], ...stack: [...middlewares: Middleware[], handler: Executable | CommandHandler]): void {
        const prefixesArray = (Array.isArray(prefixes) ? prefixes : [prefixes])
            .map(prefix => prefix.toLowerCase());

        const handler = stack.pop() as Executable | CommandHandler;
        const middlewares = stack as Middleware[];

        let commandHandler: CommandHandler;

        if (typeof handler === 'function')
            commandHandler = handler;
        else if (typeof handler.execute === 'function')
            commandHandler = handler.execute.bind(handler);
        else
            throw new Error('Handler must be a function or an object conforming to Executable interface.');

        for (const prefix of prefixesArray) {
            if (this.commandMap.has(prefix))
                throw new CommandAlreadyExistsError(prefix);

            this.commandMap.set(prefix, [...middlewares, commandHandler]);
        }
    }

    /**
     * 取消注册命令。
     * 
     * @param prefixes - 要取消注册的命令前缀字符串或字符串数组。
     * @throws {CommandNotFoundError} 当给定的前缀未被注册时会抛出错误。
     */
    remove(prefixes: string | string[]): void {
        const prefixesArray = (Array.isArray(prefixes) ? prefixes : [prefixes])
            .map(prefix => prefix.toLowerCase());

        for (const prefix of prefixesArray) {
            if (!this.commandMap.delete(prefix))
                throw new CommandNotFoundError(prefix);
        }
    }

    /**
     * 处理字符串命令并执行。
     * 
     * @param commandString - 要执行的完整命令字符串。
     * @param commandInfoNoArgs - 命令信息。
     * 
     * @throws {CommandNotFoundError} 如果命令不存在。
     * 
     * 该方法首先解析命令字符串，提取命令前缀和参数数组，
     * 然后将这些信息用于执行相应的命令。
     */
    run(commandString: string, commandInfoNoArgs?: CommandInfoNoArgs): void;

    /**
     * 执行指定命令
     * 
     * @param prefix 命令前缀。
     * @param args 命令参数。
     * @param commandInfoNoArgs 命令信息。
     * 
     * @throws {CommandNotFoundError} 如果命令不存在。
     */
    run(prefix: string, args: string[], commandInfoNoArgs: CommandInfoNoArgs): void;

    // TODO: 后续参数修改为全称 ctx
    run(arg1: string, arg2: CommandInfoNoArgs | string[] = {}, arg3?: CommandInfoNoArgs): void {
        if (Array.isArray(arg2))
            this.runCommand(arg1, arg2, arg3!);
        else
            this.runString(arg1, arg2);
    }

    private runCommand(prefix: string, args: string[], commandInfoNoArgs: CommandInfoNoArgs): void {
        prefix = prefix.toLowerCase();
        const command = this.commandMap.get(prefix);
        if (!command)
            throw new CommandNotFoundError(prefix);

        // ding~
        // 都有?.了你还用&&
        commandInfoNoArgs?.player?.playSound?.('note.bell');

        const composed = this.compose(command);
        composed({ prefix, args, ...commandInfoNoArgs });
    }

    private runString(commandString: string, commandInfoNoArgs: CommandInfoNoArgs = {}): void {
        const { prefix, args } = this.parseCommandString(commandString);

        this.runCommand(prefix, args, commandInfoNoArgs);
    }

    private compose(stack: Stack): CommandHandler {
        return stack.reduceRight<CommandHandler>(
            (next, middleware) => ctx => middleware(ctx, () => next(ctx)),
            () => {}
        );
    }

    /**
     * 已注册的所有命令前缀。
     * 
     * @example
     * ```typescript
     * console.log(commandManager.prefixes); // ['假人生成', '假人创建']
     * ```
     */
    get prefixes(): string[] {
        return Array.from(this.commandMap.keys());
    }
}

// 导出实例（单例模式）
export const commandManager = new CommandManager();
