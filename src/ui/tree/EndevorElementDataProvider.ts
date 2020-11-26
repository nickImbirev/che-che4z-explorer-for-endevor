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
import { EndevorQualifier } from '../../model/IEndevorQualifier';
import { Repository } from '../../model/Repository';
import { proxyBrowseElement } from '../../service/EndevorCliProxy';

export class EndevorElementDataProvider implements vscode.TextDocumentContentProvider {

  provideTextDocumentContent(uri: vscode.Uri, _token: vscode.CancellationToken
                                                              ): vscode.ProviderResult<string> {
    const queryParams: UriQueryParams = JSON.parse(uri.query);                                                          
    return proxyBrowseElement(queryParams.repository, queryParams.qualifier);
  }
}

export class UriQueryParams {
  readonly repository: Repository;
  readonly qualifier: EndevorQualifier;

  constructor(elementRepo: Repository, elementQualifier: EndevorQualifier) {
    this.qualifier = elementQualifier;
    this.repository = elementRepo;
  }
}
