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

import { URL } from 'url';
import * as vscode from 'vscode';
import { SCHEMA_NAME } from '../../constants';
import { EndevorQualifier } from '../../model/IEndevorQualifier';
import { Repository } from '../../model/Repository';

export class UriBuilder {
  
    public buildUri(uriParams: UriParams): vscode.Uri {
        return vscode.Uri
                  .parse(uriParams.getSchema() + "://" + uriParams.getAuthority(), true)
                  .with({
                    path: "/" + uriParams.getPathPart(),
                    query: JSON.stringify(uriParams.getFullQuery())
                  });
      }
    
    public fromUri(uri: vscode.Uri): UriParams {
      const queryPart: UriQuery = JSON.parse(uri.query);
      return UriParams.fromQuery(queryPart);
    }
}

export class UriParams {

  private readonly schemaName?: string;
  private readonly authorityPart?: string;
  private readonly pathPart?: string;

  private readonly queryPart: UriQuery;

  private constructor(
    elementRepo: Repository, elementQualifier: EndevorQualifier,
    schemaName?: string, endevorHost?: string, elementName?: string) {

    this.queryPart = new UriQuery(
      new QueryRepository(
        elementRepo.getName(), elementRepo.getUrl(), elementRepo.getUsername(),
        elementRepo.getPassword(), elementRepo.getDatasource(), elementRepo.getProfileLabel()
      ),
      elementQualifier
    );
    this.schemaName = schemaName;
    this.pathPart = elementName;
    this.authorityPart = endevorHost;
  }

  static fromQuery(fullQuery: UriQuery): UriParams {
    const queryRepo: QueryRepository = fullQuery.repository;
    return new UriParams(
      new Repository(
          queryRepo.name, queryRepo.url, queryRepo.username,
          queryRepo.password, queryRepo.datasource, queryRepo.password
      ),
      fullQuery.qualifier
    );
  }

  public static fromElement(
      elementRepo: Repository, elementQualifier: EndevorQualifier
                                                          ): UriParams {
      
    return new UriParams(
      elementRepo, elementQualifier,
      SCHEMA_NAME, new URL(elementRepo.getUrl()).host, elementQualifier.element
    );
  }

  public getRepository(): Repository {
    const queryRepo = this.queryPart.repository;
    return new Repository(
      queryRepo.name,
      queryRepo.url,
      queryRepo.username,
      queryRepo.password,
      queryRepo.datasource,
      queryRepo.profileLabel
    )
  }

  public getQualifier(): EndevorQualifier {
    return this.queryPart.qualifier;
  }

  public getSchema(): string | undefined {
    return this.schemaName;
  }

  public getAuthority(): string | undefined {
    return this.authorityPart;
  }

  public getPathPart(): string | undefined {
    return this.pathPart;
  }

  getFullQuery(): UriQuery {
    return this.queryPart;
  }
}

class UriQuery {
 readonly repository: QueryRepository;
 readonly qualifier: EndevorQualifier;

  constructor(elementRepo: QueryRepository, elementQualifier: EndevorQualifier) {
    this.qualifier = elementQualifier;
    this.repository = elementRepo;
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
      password: string | undefined, datasourse: string, profileLabel: string | undefined) {
    this.name = name;
    this.url = url;
    this.username = username;
    this.password = password;
    this.datasource = datasourse;
    this.profileLabel = profileLabel;
  }
}
