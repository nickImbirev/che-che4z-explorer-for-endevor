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
import { EndevorQualifier } from '../../../../model/IEndevorQualifier';
import { Repository } from '../../../../model/Repository';
import { EndevorElementDataProvider } from '../../../../ui/tree/EndevorElementDataProvider';
import * as uri from '../../../../ui/tree/uri';
import { IncorrectUriError, UriParams } from '../../../../ui/tree/uri';
import * as cliProxy from '../../../../service/EndevorCliProxy';
import { assert } from 'chai';
import { logger } from '../../../../globals';
// Explicitly show NodeJS how to find VSCode (required for Jest)
process.vscode = vscode;

describe('element data provider document fetching', () => {
        // input stubs
        const endevorHost = "example.com:1234";
        const elementRepo = new Repository(
            'testRepo',
            `https://${endevorHost}`,
            'testUser',
            'testPass',
            'testRepo',
            'testConnLabel'
        );
        const elementQualifier: EndevorQualifier = {
            element: 'some_name',
            env: 'envTest',
            stage: '1',
            subsystem: 'sbsTest',
            system: 'sysTest',
            type: 'COBOL',
        };
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
        const cancellationToken: any = undefined;
        const uriParams = UriParams.fromElement(elementRepo, elementQualifier);
    it('should fetch document from Endevor by virtual uri', async () => {
        // given
        jest.spyOn(uri, 'fromUri').mockImplementation((_uri: vscode.Uri) => uriParams);
        const expectedDocumentContent = 'very important text';
        jest.spyOn(cliProxy, 'proxyBrowseElement').mockImplementation((_repo, _qualifier) => {
            return Promise.resolve(expectedDocumentContent);
        });
        // when
        const providerResult = await new EndevorElementDataProvider()
                .provideTextDocumentContent(uriMock, cancellationToken);
        // then
        expect(uri.fromUri).toHaveBeenCalledWith(uriMock);
        expect(cliProxy.proxyBrowseElement).toHaveBeenLastCalledWith(elementRepo, elementQualifier);
        assert.equal(providerResult, expectedDocumentContent);
    });

    it('should show error message if incorrect uri came', () => {
        // given
        jest.spyOn(uri, 'fromUri').mockImplementation((uri: vscode.Uri) => {
            throw new IncorrectUriError(uri);
        });
        jest.spyOn(logger, 'error').mockImplementation((_message: string) => {
            // do nothing
        });
        // when
        new EndevorElementDataProvider().provideTextDocumentContent(uriMock, cancellationToken);
        // then
        expect(uri.fromUri).toHaveBeenCalledWith(uriMock);
        expect(logger.error).toHaveBeenCalledTimes(1);
    });

    it('should show error message if something went wrong in general', () => {
        // given
        const errorReason = 'really huge mistake';
        jest.spyOn(uri, 'fromUri').mockImplementation((uri: vscode.Uri) => {
            throw new Error(errorReason);
        });
        jest.spyOn(logger, 'error').mockImplementation((_message: string) => {
            // do nothing
        });
        // when
        new EndevorElementDataProvider().provideTextDocumentContent(uriMock, cancellationToken);
        // then
        expect(uri.fromUri).toHaveBeenCalledWith(uriMock);
        expect(logger.error).toHaveBeenLastCalledWith(`something went wrong: ${errorReason}`);
    });

    it('should show error message if something went wrong with Endevor cli proxy call', async () => {
        // given
        jest.spyOn(uri, 'fromUri').mockImplementation((_uri: vscode.Uri) => uriParams);
        const errorReason = 'Endevor not answered';
        jest.spyOn(cliProxy, 'proxyBrowseElement').mockImplementation((_repo, _qualifier) => {
            return Promise.reject(errorReason);
        });
        jest.spyOn(logger, 'error').mockImplementation((_message: string) => {
            // do nothing
        });
        // when
        assert.isUndefined(
            await new EndevorElementDataProvider()
                        .provideTextDocumentContent(uriMock, cancellationToken)
        );
        // then
        expect(uri.fromUri).toHaveBeenCalledWith(uriMock);
        expect(cliProxy.proxyBrowseElement).toHaveBeenLastCalledWith(elementRepo, elementQualifier);
        expect(logger.error).toHaveBeenCalledWith(errorReason);
    });
});
