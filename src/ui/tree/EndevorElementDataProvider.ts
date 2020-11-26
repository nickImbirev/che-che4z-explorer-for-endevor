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
    return proxyBrowseElement(
      new Repository(
        queryParams.repository.name,
        queryParams.repository.url,
        queryParams.repository.username,
        queryParams.repository.password,
        queryParams.repository.datasource,
        queryParams.repository.profileLabel
      ),
      queryParams.qualifier
    );
  }
}

export class UriQueryParams {
  readonly repository: QueryRepository;
  readonly qualifier: EndevorQualifier;

  constructor(elementRepo: Repository, elementQualifier: EndevorQualifier) {
    this.qualifier = elementQualifier;
    this.repository = new QueryRepository(
      elementRepo.getName(), elementRepo.getUrl(), elementRepo.getUsername(),
      elementRepo.getPassword(), elementRepo.getDatasource(), elementRepo.getProfileLabel()
    );
  }
}

class QueryRepository {
  readonly name: string;
  readonly url: string;
  readonly username: string | undefined;
  readonly password: string | undefined;
  readonly datasource: string;
  readonly profileLabel: string | undefined;

  constructor(
      name: string, url: string, username: string | undefined,
      password: string | undefined, datasourse: string, profileLabel: string | undefined
    ) {
    this.name = name;
    this.url = url;
    this.username = username;
    this.password = password;
    this.datasource = datasourse;
    this.profileLabel = profileLabel;
  }
}
