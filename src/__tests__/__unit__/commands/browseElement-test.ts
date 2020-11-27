/*
 * Copyright (c) 2020 Broadcom.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Broadcom, Inc. - initial API and implementation
 */

import * as vscode from 'vscode';
import { browseElement } from '../../../commands/BrowseElement';
import { logger } from '../../../globals';

// Explicitly show NodeJS how to find VSCode (required for Jest)
process.vscode = vscode;

describe('process for submitting browse element command', () => {
    // output stubs
    const anyValue: any = undefined;
    const mockEditor: vscode.TextEditor = {
        document: anyValue,
        selection: anyValue,
        selections: anyValue,
        visibleRanges: anyValue,
        options: anyValue,
        edit: anyValue,
        insertSnippet: anyValue,
        show: anyValue,
        hide: anyValue,
        revealRange: anyValue,
        setDecorations: anyValue
    };
    it('should submit uri request to content provider', async () => {
        // given
        const uriMock: vscode.Uri = {
            scheme: 'some_scheme',
            authority: 'some_authority',
            fsPath: '/path',
            path: '/path',
            query: 'some_value',
            fragment: 'very_important_fragment',
            with: jest.fn(),
            toJSON: jest.fn()
        };
        jest.spyOn(vscode.window, 'showTextDocument').mockImplementation((_uri: vscode.Uri, _options?: vscode.TextDocumentShowOptions | undefined) => {
            return Promise.resolve(mockEditor);
        });
        // when
        await browseElement(uriMock);
        // then
        const keepExistingEditorTabs = { preview: false };
        expect(vscode.window.showTextDocument).toHaveBeenCalledWith(uriMock, keepExistingEditorTabs);
    });

    it('should show the error message, when something went wrong with browse command submission', async () => {
        // given
        const uriMock: vscode.Uri = {
            scheme: 'some_scheme',
            authority: 'some_authority',
            fsPath: '/path',
            path: '/path',
            query: 'some_value',
            fragment: 'very_important_fragment',
            with: jest.fn(),
            toJSON: jest.fn()
        };
        const browseRejectReason = "something went really wrong, dude!";
        jest.spyOn(vscode.window, 'showTextDocument').mockImplementation((_uri: vscode.Uri, _options?: vscode.TextDocumentShowOptions | undefined) => {
            return Promise.reject(browseRejectReason);
        });
        jest.spyOn(logger, "error").mockImplementation((_message: string) => {
            // do nothing
        }) 
        // when
        await browseElement(uriMock);
        // then
        expect(logger.error).toHaveBeenCalledWith(browseRejectReason);
    })
});
