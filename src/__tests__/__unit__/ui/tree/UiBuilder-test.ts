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
import { EndevorQualifier } from '../../../../model/IEndevorQualifier';
import { Repository } from '../../../../model/Repository';
import { UriBuilder, UriParams } from '../../../../ui/tree/UriBuilder';
// Explicitly show NodeJS how to find VSCode (required for Jest)
process.vscode = vscode;

describe('vs code uri building features', () => {
    // input stubs
    const elementRepo = new Repository(
        'testRepo',
        'https://example.com:1234',
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
        const anyUri: vscode.Uri = vscode.Uri.parse('some_value');
        const uriQueryValue = 
                    JSON.stringify(UriParams.fromElement(elementRepo, elementQualifier).getFullQuery());
        Object.defineProperty(anyUri, "query", {
            value: uriQueryValue
        });
        // when
        const uriParams = new UriBuilder().fromUri(anyUri);
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
});
