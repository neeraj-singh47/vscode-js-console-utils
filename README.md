## vscode-js-console-utils

Easily insert and remove console.log statements, by [@whtouche](https://twitter.com/whtouche)

![](https://i.imgur.com/0tiesd2.gif)

## Installing
Orginal Package
This extension is available for free in the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=whtouche.vscode-js-console-utils)

Modified Package [Visual Studio Code Marketplace]
(https://marketplace.visualstudio.com/items?itemName=neeraj-singh.vscode-js-console-utils-extended)

## Usage

With selection:
* Highlight a variable (or really any text)
* Press Cmd+Shift+L
* The output (on a new line) will be: console.log('variable: ', variable);

Without selection:
* Press Cmd+Shift+L
* The output (on the same line) will be: console.log();

To remove console.logs:
* Press Cmd+Shift+A
* This will delete all console.log statements in the current document

To remove only console.warns:
*Press Cmd+Shift+W

To remove only console.logs:
*Press Cmd+Shift+L

To remove only console.errors:
*Press Cmd+Shift+E

## To Do
* Add support for other console.* methods (warn, error, time, timeEnd, etc)
* Add ability to delete console.* across project (currently just the open file)
* ~~When deleting console.*, report how many were deleted~~, across how many files
* Allow configuration to only delete certain types of console.* statements

## License
[MIT License](LICENSE)