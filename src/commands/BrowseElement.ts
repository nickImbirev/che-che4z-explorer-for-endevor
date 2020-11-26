/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { EndevorQualifier } from '../model/IEndevorQualifier';
import { Repository } from '../model/Repository';
import { SCHEMA_NAME } from '../constants';
import { URL } from 'url';
import { UriQueryParams } from '../ui/tree/EndevorElementDataProvider';

export async function browseElement(arg: any) {
  const repo: Repository = arg.getRepository();
  const elementName: string = arg.label;
  const eq: EndevorQualifier = arg.getQualifier();
  vscode.window.showTextDocument(buildUri(repo, elementName, eq), {preview: false});
}

function buildUri(repo: Repository, elementName: string, elementQualifier: EndevorQualifier): vscode.Uri {
  const endevorHost = new URL(repo.getUrl()).host;
  return vscode.Uri
            .parse(SCHEMA_NAME + "://" + endevorHost, true)
            .with({
              path: "/" + elementName,
              query: JSON.stringify(new UriQueryParams(repo, elementQualifier))
            });
}
