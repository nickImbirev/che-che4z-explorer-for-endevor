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
import { proxyBrowseElement } from '../../service/EndevorCliProxy';
import { UriBuilder, UriParams } from './UriBuilder';

export class EndevorElementDataProvider implements vscode.TextDocumentContentProvider {

  provideTextDocumentContent(uri: vscode.Uri, _token: vscode.CancellationToken
                                                              ): vscode.ProviderResult<string> {
    const uriParts: UriParams = new UriBuilder().fromUri(uri);                                                       
    return proxyBrowseElement(
      uriParts.getRepository(),
      uriParts.getQualifier()
    );
  }
}
