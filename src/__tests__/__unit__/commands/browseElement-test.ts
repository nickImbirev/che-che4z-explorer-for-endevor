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

// Explicitly show NodeJS how to find VSCode (required for Jest)
process.vscode = vscode;

describe('process for submitting browse element command', () => {
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
        vscode.window.showTextDocument = jest.fn();
        // when
        await browseElement(uriMock);
        // then
        const keepExistingEditorTabs = { preview: false };
        expect(vscode.window.showTextDocument).toHaveBeenCalledWith(uriMock, keepExistingEditorTabs);
    });
});
