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

import { CancellationToken, ProviderResult, TextDocumentContentProvider, Uri } from "vscode";
import { logger } from "../../globals";
import { Repository } from "../../model/Repository";
import { proxyBrowseElement } from "../../service/EndevorCliProxy";
import { parseUri } from "../../service/uri";
import { endevorElementQueryDeserializer, EndevorElementUriQuery } from "./EndevorElementUriAdapter";

export class EndevorElementContentProvider implements TextDocumentContentProvider {
    public provideTextDocumentContent(uri: Uri, _token: CancellationToken): ProviderResult<string> {
        try {
            const parsedQuery = parseUri(uri, endevorElementQueryDeserializer).query.getValue();
            return this.browseElementViaEndevor(parsedQuery);
        } catch(e) {
            logger.error(e.message);
            return Promise.resolve(undefined);
        }
    }

    private browseElementViaEndevor(parsedQuery: EndevorElementUriQuery): ProviderResult<string> {
        return proxyBrowseElement(
            new Repository(
                parsedQuery.repository.name,
                parsedQuery.repository.url,
                parsedQuery.repository.username,
                parsedQuery.repository.password,
                parsedQuery.repository.datasource,
                parsedQuery.repository.profileLabel
            ),
            parsedQuery.qualifier
        ).catch((reason: string) => {
            logger.error(reason);
            return Promise.resolve(undefined);
        });
    }
}