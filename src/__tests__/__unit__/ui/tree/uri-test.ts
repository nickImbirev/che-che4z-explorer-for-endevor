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
import { buildUri, fromUri, IncorrectUriError, IncorrectUriParamsError, UriParams } from '../../../../ui/tree/uri';
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
        const initialUriParams = UriParams.fromElement(elementRepo, elementQualifier);
        const uriQueryValue = JSON.stringify(initialUriParams.getFullQuery());
        const uriMock: vscode.Uri = {
            scheme: 'some_schema',
            authority: 'some_authority',
            fsPath: '',
            path: 'some_path',
            query: uriQueryValue,
            fragment: '',
            with: jest.fn(),
            toJSON: jest.fn()
        };
        // when
        const uriParams: UriParams = fromUri(uriMock);
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

        assert.equal(uriParams.getAuthority(), uriMock.authority);
        assert.equal(uriParams.getPathPart(), uriMock.path);
        assert.equal(uriParams.getSchema(), uriMock.scheme);
    });

    it('should throw an error if uri to parse from contains invalid query part', () => {
        // given
        const uriWithIncorrectQuery: vscode.Uri = {
            scheme: 'some_schema',
            authority: 'some_authority',
            fsPath: '',
            path: 'some_path',
            query: 'this is not a JSON, isnt it?',
            fragment: '',
            with: jest.fn(),
            toJSON: jest.fn()
        };
        // when && then
        assert.throws(
            function() {
                fromUri(uriWithIncorrectQuery)
            },
            IncorrectUriError
        );
    });

    it('should throw an error if uri to parse from contains no schema', () => {
        // given
        const initialUriParams = UriParams.fromElement(elementRepo, elementQualifier);
        const uriQueryValue = JSON.stringify(initialUriParams.getFullQuery());
        const emptyValue = '';
        const uriWithNoSchema: vscode.Uri = {
            scheme: emptyValue,
            authority: 'some_authority',
            fsPath: '',
            path: 'some_path',
            query: uriQueryValue,
            fragment: '',
            with: jest.fn(),
            toJSON: jest.fn()
        };
        // when && then
        assert.throws(
            function() {
                fromUri(uriWithNoSchema)
            },
            IncorrectUriError
        );
    });
    
    it('should throw an error if uri to parse from contains no authority', () => {
        // given
        const initialUriParams = UriParams.fromElement(elementRepo, elementQualifier);
        const uriQueryValue = JSON.stringify(initialUriParams.getFullQuery());
        const emptyValue = '';
        const uriWithNoSchema: vscode.Uri = {
            scheme: 'some_schema',
            authority: emptyValue,
            fsPath: '',
            path: 'some_path',
            query: uriQueryValue,
            fragment: '',
            with: jest.fn(),
            toJSON: jest.fn()
        };
        // when && then
        assert.throws(
            function() {
                fromUri(uriWithNoSchema)
            },
            IncorrectUriError
        );
    });

    it('should throw an error if uri to parse from contains no path', () => {
        // given
        const initialUriParams = UriParams.fromElement(elementRepo, elementQualifier);
        const uriQueryValue = JSON.stringify(initialUriParams.getFullQuery());
        const emptyValue = '';
        const uriWithNoSchema: vscode.Uri = {
            scheme: 'some_scheme',
            authority: 'some_authority',
            fsPath: '',
            path: emptyValue,
            query: uriQueryValue,
            fragment: '',
            with: jest.fn(),
            toJSON: jest.fn()
        };
        // when && then
        assert.throws(
            function() {
                fromUri(uriWithNoSchema)
            },
            IncorrectUriError
        );
    });

    it('should be converted into vs code virtual uri', () => {
        // given
        const initialParams: UriParams = UriParams.fromElement(elementRepo, elementQualifier);
        const withFunction = jest.fn();
        const parseFunction = jest.fn();
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
        vscode.Uri.parse = parseFunction;
        withFunction.mockImplementation(() => {
            return uriMock;
        });
        // when
        const actualUri: vscode.Uri = buildUri(initialParams);
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

    it('should throw an exception, if incorrect uri params are incorrect', () => {
        // given
        const initialParams: UriParams = UriParams.fromElement(elementRepo, elementQualifier);
        const withFunction = jest.fn();
        const parseFunction = jest.fn();
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
        vscode.Uri.parse = parseFunction;
        withFunction.mockImplementation(() => {
            throw new Error("something went wrong!");
        });
        // when && then
        assert.throws(
            function() {
                buildUri(initialParams);
            }, 
            IncorrectUriParamsError
        );
    });

    it('should throw an exception, if repository is empty', () => {
        // given
        const emptyRepo: any = undefined;
        // when && then
        assert.throws(
            function() {
                UriParams.fromElement(emptyRepo, elementQualifier);
            },
            Error
        );
    });

    it('should throw an exception, if required repository properties are missed', () => {
        // given
        const emptyValue = '';
        const incorrectRepo = new Repository(
            'testRepo',
            `https://${endevorHost}`,
            emptyValue,
            'testPass',
            'testRepo',
            'testConnLabel'
        );
        // when && then
        assert.throws(
            function() {
                UriParams.fromElement(incorrectRepo, elementQualifier);
            },
            Error
        );
    });

    it('should throw an exception, if qualifier is empty', () => {
        // given
        const emptyQualifier: any = undefined;
        // when && then
        assert.throws(
            function() {
                UriParams.fromElement(elementRepo, emptyQualifier);
            },
            Error
        );
    });

    it('should throw an exception, if required qualifier properties are missed', () => {
        // given
        const emptyValue = '';
        const incorrectQualifier: EndevorQualifier = {
            element: emptyValue,
            env: emptyValue,
            stage: '1',
            subsystem: 'sbsTest',
            system: 'sysTest',
            type: 'COBOL',
        };
        // when && then
        assert.throws(
            function() {
                UriParams.fromElement(elementRepo, incorrectQualifier);
            },
            Error
        );
    });
});
