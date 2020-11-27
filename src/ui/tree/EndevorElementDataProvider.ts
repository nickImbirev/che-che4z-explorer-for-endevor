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
import { logger } from '../../globals';
import { proxyBrowseElement } from '../../service/EndevorCliProxy';
import { fromUri, IncorrectUriError, UriParams } from './uri';

export class EndevorElementDataProvider implements vscode.TextDocumentContentProvider {

  provideTextDocumentContent(uri: vscode.Uri, _token: vscode.CancellationToken
                                                              ): vscode.ProviderResult<string> {

    try {
      const uriParts: UriParams = fromUri(uri);   
      logger.trace(`browse element action with uri: ${uri} will be submitted to Endevor`);                                                    
      return proxyBrowseElement(uriParts.getRepository(), uriParts.getQualifier())
                .catch((reason: any) => {
                        logger.error(reason);
                        return Promise.resolve(undefined);
                });
    } catch(e) {
      if (e instanceof IncorrectUriError) {
        logger.error(e.message);
      } else {
        logger.error(`something went wrong: ${e.message}`);
      }
    }
  }
}
