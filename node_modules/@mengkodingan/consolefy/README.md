# consolefy

`@mengkodingan/consolefy` is a customizable logging library 🙂.

## Installation

```sh
npm i @mengkodingan/consolefy
# or
yarn add @mengkodingan/consolefy
# or
pnpm add @mengkodingan/consolefy
```

## Usage

### Basic Example

```ts
import { Consolefy } from "@mengkodingan/consolefy";

const consolefy = new Consolefy();

consolefy.log("Just a regular log.");
consolefy.info("This is an info log.");
consolefy.success("Operation was successful!");
consolefy.warn("This is a warning.");
consolefy.error("An error occurred.");
```

### Customizing
You can customize the prefixes, formats, themes, and tags in the consolefy's configuration.

```ts
import { Colors, Consolefy } from "@mengkodingan/consolefy";
const consolefy = new Consolefy({
  prefixes: {
    warn: "Caution",
    success: "Done",
    error: "Oops",
    info: "Heads up",
  },
  theme: {
    warn: (text) => Colors.bgYellow(Colors.black(text)),
    success: (text) => Colors.bgGreen(Colors.black(text)),
    error: (text) => Colors.bgRed(Colors.black(text)),
    info: (text) => Colors.bgBlue(Colors.black(text)),
  },
  format: "{prefix}{tag} {message}",
  tag: "APP",
});

consolefy.info("Info log with custom tag and theme.");
consolefy.success("Custom success log.");
```

### Customizing Both Prefix and Theme Dynamically
You can also combine both `setPrefix()` and `setTheme()` to customize both the prefix and theme for specific log levels dynamically:


```ts
import { Colors, Consolefy } from "@mengkodingan/consolefy";
const consolefy = new Consolefy();

// Set a custom prefix and theme for the 'info' log level
consolefy.setPrefix("info", "INFORMATION");
consolefy.setTheme("info", (text) => Colors.bgMagenta(Colors.black(text)));

consolefy.info("This is an informational message with a custom prefix and theme.");
```

Using `setPrefix()` and `setTheme()` methods, you can change the behavior and appearance of your log messages at any point, giving you full flexibility to adapt the logger to different contexts during runtime.

### Grouping Logs
You can group related logs together using the `group()` and `groupEnd()` methods.

```ts
const consolefy = new Consolefy();

consolefy.group("Initialization");
consolefy.info("Initializing the application...");
consolefy.success("Initialization complete.");
consolefy.groupEnd();
```

### Setting Log Levels
You can define new log levels dynamically by using the `defineLogLevel()` method.

```ts
import { Colors, Consolefy } from "@mengkodingan/consolefy";
const consolefy = new Consolefy();

// Define a new log level "debug"
consolefy.defineLogLevel("debug", { prefix: "DEBUG", theme: (text) => Colors.bgRedBright(Colors.black(text)) });

consolefy.log("debug", "This is a debug message.");
```

### Silent Mode
To disable logging output entirely, you can set the logger to silent mode.

```ts
const consolefy = new Consolefy();

consolefy.silent(true);
consolefy.info("This log will not be printed because silent mode is enabled.");

consolefy.silent(false);
consolefy.info("This log will be printed.")
```

### Reset Configuration
You can reset the format and tag back to their default values.

```ts
const consolefy = new Consolefy();

// Change the format and tag
consolefy.setFormat("{prefix} - {message}");
consolefy.setTag("CUSTOM_TAG");

// Reset to defaults
consolefy.resetFormat();
consolefy.resetTag();
```

### More Example
For more usage examples and demonstrations of different features, please refer to the [example/example.ts](https://github.com/Mengkodingan/consolefy/blob/main/example/example.ts) file.

## API

### `new Consolefy(config: Config = {})`
Creates a new instance of the logger with optional configuration.

#### Config Options:

- `prefixes`: Custom prefixes for different log levels (`warn`, `success`, `error`, `info`, etc.)
- `format`: Custom format for log messages (default: `{prefix}{tag} {message}`)
- `silent`: Whether to suppress all logging (default: `false`)
- `tag`: Custom tag to be appended to each log message
- `theme`: Custom themes for each log level (functions that receive the log message and return the styled message)

### `setConfig(newConfig: Config): void`
Sets the configuration of the logger.

### `setPrefix(type: string, prefix: string): void`
Sets a custom prefix for the specified log level.

### `setTheme(type: string, theme: (text: string) => string): void`
Sets a custom theme (color/style) for the specified log level.

### `setFormat(format: string): void`
Sets a custom log message format.

### `resetFormat(): void`
Resets the log message format to the default.

### `setTag(tag: string): void`
Sets a custom tag to be appended to each log message.

### `resetTag(): void`
Resets the log tag to the default (empty).

### `silent(state: boolean): void`
Enables or disables silent mode.

### `defineLogLevel(level: string, options: { prefix: string; theme?: (text: string) => string }): void`
Defines a custom log level with a specific prefix and theme.

### `group(name: string): void`
Begins a log group with the given name.

### `groupEnd(): void`
Ends the current log group.

### `log(level: string, ...messages: any[]): void`
Logs a message at the specified log level.

### `warn(...messages: any[]): void`
Logs a warning message.

### `success(...messages: any[]): void`
Logs a success message.

### `error(...messages: any[]): void`
Logs an error message.

### `info(...messages: any[]): void`
Logs an informational message.
