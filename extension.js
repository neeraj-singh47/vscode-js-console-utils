const vscode = require('vscode');

const insertText = (val) => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('Can\'t insert log because no document is open');
        return;
    }

    const selection = editor.selection;

    const range = new vscode.Range(selection.start, selection.end);

    editor.edit((editBuilder) => {
        editBuilder.replace(range, val);
    });
}

function getAllLogStatements(document, documentText, type = 'all') {
    let logStatements = [];

    let logRegex = /console.(log|debug|info|warn|error|assert|dir|dirxml|trace|group|groupEnd|time|timeEnd|profile|profileEnd|count)\((.*)\);?/g;
    switch(type) {
        case 'error':   logRegex = /console.error\((.*)\);?/g;
                        break;
        case 'warn' :   logRegex = /console.warn\((.*)\);?/g;
                        break;
        case 'log'  :   logRegex = /console.log\((.*)\);?/g;
                        break;
        default:        break;
    }
    let match;
    while (match = logRegex.exec(documentText)) {
        let matchRange =
            new vscode.Range(
                document.positionAt(match.index),
                document.positionAt(match.index + match[0].length)
            );
        if (!matchRange.isEmpty)
            logStatements.push(matchRange);
    }
    return logStatements;
}

function deleteFoundLogStatements(workspaceEdit, docUri, logs, type = 'log') {
    logs.forEach((log) => {
        workspaceEdit.delete(docUri, log);
    });

    vscode.workspace.applyEdit(workspaceEdit).then(() => {
        logs.length > 1
            ? vscode.window.showInformationMessage(`${logs.length} console.${type}s deleted`)
            : vscode.window.showInformationMessage(`${logs.length} console.${type} deleted`);
    });
}

function activate(context) {
    console.log('console-log-utils is now active');

    const insertLogStatement = vscode.commands.registerCommand('extension.insertLogStatement', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const selection = editor.selection;
        const text = editor.document.getText(selection);

        text
            ? vscode.commands.executeCommand('editor.action.insertLineAfter')
                .then(() => {
                    const logToInsert = `console.log('${text}: ', ${text});`;
                    insertText(logToInsert);
                })
            : insertText('console.log();');

    });
    context.subscriptions.push(insertLogStatement);

    const deleteAllLogStatements = vscode.commands.registerCommand('extension.deleteAllLogStatements', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const document = editor.document;
        const documentText = editor.document.getText();

        let workspaceEdit = new vscode.WorkspaceEdit();

        const logStatements = getAllLogStatements(document, documentText);

        deleteFoundLogStatements(workspaceEdit, document.uri, logStatements);
    });
    context.subscriptions.push(deleteAllLogStatements);

    const deleteOnlyLogStatements = vscode.commands.registerCommand('extension.deleteOnlyLogStatements', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const document = editor.document;
        const documentText = editor.document.getText();

        let workspaceEdit = new vscode.WorkspaceEdit();

        const logStatements = getAllLogStatements(document, documentText, 'log');

        deleteFoundLogStatements(workspaceEdit, document.uri, logStatements);
    });
    context.subscriptions.push(deleteOnlyLogStatements);

    const deleteOnlyErrorStatements = vscode.commands.registerCommand('extension.deleteOnlyErrorStatements', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const document = editor.document;
        const documentText = editor.document.getText();

        let workspaceEdit = new vscode.WorkspaceEdit();

        const logStatements = getAllLogStatements(document, documentText, 'error');

        deleteFoundLogStatements(workspaceEdit, document.uri, logStatements, 'Error');
    });
    context.subscriptions.push(deleteOnlyErrorStatements);

    const deleteOnlyWarnStatements = vscode.commands.registerCommand('extension.deleteOnlyWarnStatements', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const document = editor.document;
        const documentText = editor.document.getText();

        let workspaceEdit = new vscode.WorkspaceEdit();

        const logStatements = getAllLogStatements(document, documentText, 'warn');

        deleteFoundLogStatements(workspaceEdit, document.uri, logStatements, 'Warn');
    });
    context.subscriptions.push(deleteOnlyWarnStatements);
}
exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;
