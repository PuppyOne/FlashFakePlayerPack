import { parseCommandString } from "./command-parser";
import { CommandAlreadyExistsError, CommandNotFoundError } from "./errors";
import type { Executable, Handler, BaseContext } from "./types";

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
 * commandManager.execute('hello world');
 * ```
 */
class CommandManager {
    private prefixToHandlerMap = new Map<string, Handler>();

    /**
     * 注册命令实例。
     * 
     * @param prefixes - 触发该命令的前缀字符串或字符串数组。
     * @param rawHandler - 要注册的命令对象或函数。
     * 
     * @throws {CommandAlreadyExistsError} 当给定的前缀已被注册时会抛出错误。
     * 
     * @example
     * ```typescript
     * add(['假人生成', '假人创建'], spawn);
     * ```
     */
    add(prefixes: string | string[], rawHandler: Executable | Handler): void {
        const prefixesArray = (Array.isArray(prefixes) ? prefixes : [prefixes])
            .map(prefix => prefix.toLowerCase());

        const normalizedHandler = this.normalizeHandler(rawHandler);;

        for (const prefix of prefixesArray) {
            if (this.prefixToHandlerMap.has(prefix))
                throw new CommandAlreadyExistsError(prefix);

            this.prefixToHandlerMap.set(prefix, normalizedHandler);
        }
    }

    private normalizeHandler(rawHandler: Executable | Handler): Handler {
        return typeof rawHandler === 'function'
            ? rawHandler
            : rawHandler.execute.bind(rawHandler);
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
            if (!this.prefixToHandlerMap.has(prefix))
                throw new CommandNotFoundError(prefix);

            this.prefixToHandlerMap.delete(prefix);
        }
    }

    /**
     * 处理字符串命令并执行。
     * 
     * @param commandString - 要执行的完整命令字符串。
     * @param baseContext - 初始命令上下文。
     * 
     * @throws {CommandNotFoundError} 如果命令不存在。
     * 
     * 该方法首先解析命令字符串，提取命令前缀和参数数组，
     * 然后将这些信息用于执行相应的命令。
     */
    run(commandString: string, baseContext?: BaseContext): void;

    /**
     * 执行指定命令
     * 
     * @param prefix 命令前缀。
     * @param args 命令参数。
     * @param baseContext 初始命令上下文。
     * 
     * @throws {CommandNotFoundError} 如果命令不存在。
     */
    run(prefix: string, args: string[], baseContext: BaseContext): void;

    // TODO: 后续参数修改为全称 ctx
    run(arg1: string, arg2: BaseContext | string[] = {}, arg3?: BaseContext): void {
        if (Array.isArray(arg2))
            this.runCommand(arg1, arg2, arg3!);
        else
            this.runString(arg1, arg2);
    }

    private runCommand(prefix: string, args: string[], baseContext: BaseContext): void {
        prefix = prefix.toLowerCase();
        const command = this.prefixToHandlerMap.get(prefix);
        if (!command)
            throw new CommandNotFoundError(prefix);

        // ding~
        // 都有?.了你还用&&
        baseContext?.player?.playSound?.('note.bell');

        command({ prefix, args, ...baseContext });
    }

    private runString(commandString: string, baseContext: BaseContext = {}): void {
        const { prefix, args } = parseCommandString(commandString);

        this.runCommand(prefix, args, baseContext);
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
        return Array.from(this.prefixToHandlerMap.keys());
    }
}

// 导出实例（单例模式）
export const commandManager = new CommandManager();
