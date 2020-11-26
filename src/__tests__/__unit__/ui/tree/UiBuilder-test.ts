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

import { assert } from 'chai';
import * as vscode from 'vscode';
import { SCHEMA_NAME } from '../../../../constants';
import { EndevorQualifier } from '../../../../model/IEndevorQualifier';
import { Repository } from '../../../../model/Repository';
import { UriBuilder, UriParams } from '../../../../ui/tree/UriBuilder';
// Explicitly show NodeJS how to find VSCode (required for Jest)
process.vscode = vscode;

describe('vs code uri building features', () => {
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
    it('should be parsed from uri to domain object', () => {
        // given
        const uriQueryValue = 
                    JSON.stringify(UriParams.fromElement(elementRepo, elementQualifier).getFullQuery());
        // here we need to create uri explicitly to avoid strange mock behaviour
        const uriMock: vscode.Uri = {
            scheme: '',
            authority: '',
            fsPath: '',
            path: '',
            query: uriQueryValue,
            fragment: '',
            with: jest.fn(),
            toJSON: jest.fn()
        };
        // when
        const uriParams: UriParams = new UriBuilder().fromUri(uriMock);
        // then
        const actualQualifier = uriParams.getQualifier();
        assert.equal(actualQualifier.element, elementQualifier.element);
        assert.equal(actualQualifier.env, elementQualifier.env);
        assert.equal(actualQualifier.stage, elementQualifier.stage);
        assert.equal(actualQualifier.system, elementQualifier.system);
        assert.equal(actualQualifier.type, elementQualifier.type);
        assert.equal(actualQualifier.subsystem, elementQualifier.subsystem);
        
        const actualRepo = uriParams.getRepository();
        assert.equal(actualRepo.getName(), elementRepo.getName());
        assert.equal(actualRepo.getUsername(), elementRepo.getUsername());
        assert.equal(actualRepo.getPassword(), elementRepo.getPassword());
        assert.equal(actualRepo.getDatasource(), elementRepo.getDatasource());
        assert.equal(actualRepo.getProfileLabel(), elementRepo.getProfileLabel());

        assert.isUndefined(uriParams.getAuthority());
        assert.isUndefined(uriParams.getPathPart());
        assert.isUndefined(uriParams.getSchema());
    });

    it('should be converted into vs code virtual uri', () => {
        // given
        const initialParams: UriParams = UriParams.fromElement(elementRepo, elementQualifier);
        const withFunction = jest.fn();
        const parseFunction = jest.fn();
        // here we need to create uri explicitly to avoid strange mock behaviour
        const uriMock: vscode.Uri = {
            scheme: '',
            authority: '',
            fsPath: '',
            path: '',
            query: '',
            fragment: '',
            with: withFunction,
            toJSON: jest.fn()
        };
        parseFunction.mockImplementation(() => {
            return uriMock;
        });
        Object.defineProperty(vscode.Uri, "parse", {
            value: parseFunction
        });
        withFunction.mockImplementation(() => {
            return uriMock;
        });
        // when
        const actualUri: vscode.Uri = new UriBuilder().buildUri(initialParams);
        // then
        const strictCheck = true;
        expect(parseFunction).toHaveBeenCalledWith(SCHEMA_NAME + "://" + endevorHost, strictCheck);
        expect(withFunction).toHaveBeenLastCalledWith({
            path: '/' + elementQualifier.element,
            query: JSON.stringify(initialParams.getFullQuery())
        });
        // ensure, that mock value was returned after 'parse' and 'with' functions
        assert.equal(uriMock, actualUri);
    });
});
