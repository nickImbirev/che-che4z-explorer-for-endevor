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
import { logger } from '../../globals';
import { EndevorQualifier } from '../../model/IEndevorQualifier';
import { Repository } from '../../model/Repository';

export function buildUri(uriParams: UriParams): vscode.Uri {
  try {
    const strictMode = true;
    const builtUri = vscode.Uri
      .parse(uriParams.getSchema() + "://" + uriParams.getAuthority(), strictMode)
      .with({
        path: "/" + uriParams.getPathPart(),
        query: JSON.stringify(uriParams.getFullQuery())
      });
    logger.trace(`uri was built: ${builtUri}`);
    return builtUri;
  } catch(e) {
    logger.error(e.message);
    throw new IncorrectUriParamsError(uriParams);
  }
}
    
export function fromUri(uri: vscode.Uri): UriParams {
  try {
    const uriQuery: UriQuery = JSON.parse(uri.query);
    logger.trace(`uri query was parsed into: ${JSON.stringify(uriQuery)}`);
    return UriParams.fromQuery(uri.scheme, uri.authority, uri.path, uriQuery);
  } catch(e) {
    logger.trace(e.message);
    throw new IncorrectUriError(uri);
  }
}

export class UriParams {

  private readonly schemaName: string;
  private readonly authorityPart: string;
  private readonly pathPart: string;
  private readonly queryPart: UriQuery;

  private constructor(
    elementRepo: Repository, elementQualifier: EndevorQualifier,
    scheme: string, authority: string, path: string) {
    
    const simpleParamsAreValid = scheme && authority && path;
    if (simpleParamsAreValid) {
      this.checkRepo(elementRepo);
      this.checkQualifier(elementQualifier);
      this.queryPart = new UriQuery(
        new QueryRepository(
          elementRepo.getName(), elementRepo.getUrl(), elementRepo.getUsername(),
          elementRepo.getPassword(), elementRepo.getDatasource(), elementRepo.getProfileLabel()
        ),
        elementQualifier
      );
      this.schemaName = scheme;
      this.pathPart = path;
      this.authorityPart = authority;
    } else {
      throw new Error(`some of important param value(s) is/are missing: ${[scheme, authority, path]}`);
    }
  }
  
  private checkRepo(repo: Repository): void {
    const repoIsValid = repo
                            && repo.getUrl() 
                            && repo.getUsername()   
                            && repo.getDatasource() 
                            && repo.getPassword() 
                            && repo.getProfileLabel();
    if (!repoIsValid) {
      throw new Error(`repository is invalid: ${repo}`);
    }
  }

  private checkQualifier(qualifier: EndevorQualifier): void {
    const qualifierIsValid = qualifier    
                                    && qualifier.element 
                                    && qualifier.env
                                    && qualifier.stage  
                                    && qualifier.subsystem 
                                    && qualifier.system 
                                    && qualifier.type;
    if (!qualifierIsValid) {
      throw new Error(`qualifier is invalid: ${qualifier}`);
    }
  }

  static fromQuery(scheme: string, authority: string, path: string, fullQuery: UriQuery): UriParams {
    if (fullQuery) {
      const queryRepo: QueryRepository = fullQuery.repository;
      return new UriParams(
        new Repository(
          queryRepo.name, queryRepo.url, queryRepo.username,
          queryRepo.password, queryRepo.datasource, queryRepo.profileLabel
        ),
        fullQuery.qualifier, scheme, authority, path
      );
    } else {
      throw new Error(`
        some of important param value(s) is/are missing: ${[fullQuery]}
      `);
    }
  }

  public static fromElement(elementRepo: Repository, elementQualifier: EndevorQualifier): UriParams {
    const paramsArePresented = elementRepo && elementQualifier;
    if (paramsArePresented) {
      const elementName = elementQualifier.element;
      const repoUrl = elementRepo.getUrl();
      if (elementName && repoUrl) {
        return new UriParams(elementRepo, elementQualifier, SCHEMA_NAME, new URL(repoUrl).host, elementName);
      }
    }
    throw new Error(`repository or qualifier missing values: ${[elementRepo, elementQualifier]}`);
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

  public getSchema(): string {
    return this.schemaName;
  }

  public getAuthority(): string {
    return this.authorityPart;
  }

  public getPathPart(): string {
    return this.pathPart;
  }

  public getFullQuery(): UriQuery {
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

export class IncorrectUriError extends Error {
  constructor(uri: vscode.Uri) {
    super(`such uri cannot be parsed: ${uri}`);
    this.name = "IncorrectUriError";
  }
}

export class IncorrectUriParamsError extends Error {
  constructor(uriParams: UriParams) {
    super(`such uri params cannot be converted into uri: ${JSON.stringify(uriParams)}`);
    this.name = "IncorrectUriParamsError";
  }
}
