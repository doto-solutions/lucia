import { PostgreSQLAdapter } from "../base.js";

import type { Controller, TableNames } from "../base.js";
import { Kysely, sql as sqlRaw } from "kysely";

export class NodeKyselyPostgresAdapter<DB> extends PostgreSQLAdapter {
	constructor(client: Kysely<DB>, tableNames: TableNames) {
		super(new NodeKyselyPostgresController(client), tableNames);
	}
}

class NodeKyselyPostgresController<DB> implements Controller {
	private client: Kysely<DB>;
	constructor(client: Kysely<DB>) {
		this.client = client;
	}

	public async get<T extends {}>(sql: TemplateStringsArray, args: any[]): Promise<T | null> {
		const { rows } = await sqlRaw<T>(sql, args).execute(this.client);
		return rows.at(0) ?? null;
	}

	public async getAll<T extends {}>(sql: TemplateStringsArray, args: any[]): Promise<T[]> {
		const { rows } = await sqlRaw<T>(sql, args).execute(this.client);
		return rows;
	}

	public async execute(sql: TemplateStringsArray, args: any[]): Promise<void> {
		await sqlRaw(sql, args).execute(this.client);
	}
}
