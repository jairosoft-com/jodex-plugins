import { SANDBOX, FIXTURE_RANGE } from "./sandbox.js";

const BASE = `https://dev.azure.com/${SANDBOX.org}/${SANDBOX.project}/_apis`;
const VERSION = "api-version=7.1";

function authHeader(pat: string): Record<string, string> {
  const encoded = Buffer.from(`:${pat}`).toString("base64");
  return { Authorization: `Basic ${encoded}`, "Content-Type": "application/json" };
}

async function request(url: string, options: RequestInit): Promise<unknown> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ADO ${options.method ?? "GET"} ${url} → ${res.status}: ${body}`);
  }
  return res.json();
}

export interface WorkItem {
  id: number;
  url: string;
  fields: Record<string, unknown>;
}

export class AdoClient {
  private pat: string;

  constructor(pat: string) {
    this.pat = pat;
  }

  async getProject(): Promise<{ id: string; name: string }> {
    const url = `https://dev.azure.com/${SANDBOX.org}/_apis/projects/${SANDBOX.project}?${VERSION}`;
    return request(url, { headers: authHeader(this.pat) }) as Promise<{ id: string; name: string }>;
  }

  async getWorkItem(id: number): Promise<WorkItem> {
    const url = `${BASE}/wit/workitems/${id}?$expand=relations&${VERSION}`;
    return request(url, { headers: authHeader(this.pat) }) as Promise<WorkItem>;
  }

  async getWorkItemsBatch(ids: number[]): Promise<WorkItem[]> {
    if (ids.length === 0) return [];
    const url = `${BASE}/wit/workitemsbatch?${VERSION}`;
    const body = JSON.stringify({ ids, $expand: "relations" });
    const data = (await request(url, {
      method: "POST",
      headers: authHeader(this.pat),
      body,
    })) as { value: WorkItem[] };
    return data.value;
  }

  /** Returns IDs of non-Removed items matching the given tag. */
  async queryByTag(tag: string): Promise<number[]> {
    const wiql = `SELECT [System.Id] FROM WorkItems WHERE [System.Tags] CONTAINS '${tag}' AND [System.TeamProject] = '${SANDBOX.project}' AND [System.State] <> 'Removed'`;
    const url = `${BASE}/wit/wiql?${VERSION}`;
    const data = (await request(url, {
      method: "POST",
      headers: authHeader(this.pat),
      body: JSON.stringify({ query: wiql }),
    })) as { workItems: Array<{ id: number }> };
    return data.workItems.map((w) => w.id);
  }

  /**
   * Returns IDs of items with prd:FEAT-9XX or prd:US-9XX tags (fixture range) with the given state.
   * Queries by tag pattern, NOT by ADO work item ID — ADO assigns system IDs in the 100k+ range.
   */
  async queryFixtureRange(state?: string): Promise<number[]> {
    const stateFilter = state ? ` AND [System.State] = '${state}'` : "";
    // Match any tag starting with prd: that uses a 9XX feature number (901–999)
    const wiql = `SELECT [System.Id] FROM WorkItems WHERE [System.TeamProject] = '${SANDBOX.project}' AND ([System.Tags] CONTAINS 'prd:FEAT-9' OR [System.Tags] CONTAINS 'prd:US-9')${stateFilter}`;
    const url = `${BASE}/wit/wiql?${VERSION}`;
    const data = (await request(url, {
      method: "POST",
      headers: authHeader(this.pat),
      body: JSON.stringify({ query: wiql }),
    })) as { workItems: Array<{ id: number }> };
    return data.workItems.map((w) => w.id);
  }

  async getChildIds(parentId: number): Promise<number[]> {
    const item = await this.getWorkItem(parentId);
    const childLinks = (item.fields["System.Relations"] as Array<{ rel: string; url: string }> | undefined) ?? [];
    return childLinks
      .filter((r) => r.rel === "System.LinkTypes.Hierarchy-Forward")
      .map((r) => {
        const m = r.url.match(/\/(\d+)$/);
        return m ? parseInt(m[1], 10) : 0;
      })
      .filter(Boolean);
  }

  /** PATCH work item to Removed state (reversible cleanup). */
  async patchToRemoved(id: number): Promise<void> {
    const url = `${BASE}/wit/workitems/${id}?${VERSION}`;
    await request(url, {
      method: "PATCH",
      headers: { ...authHeader(this.pat), "Content-Type": "application/json-patch+json" },
      body: JSON.stringify([{ op: "replace", path: "/fields/System.State", value: "Removed" }]),
    });
  }

  /** Hard-delete a work item (requires Delete scope PAT). */
  async hardDelete(id: number): Promise<void> {
    const url = `${BASE}/wit/workitems/${id}?${VERSION}`;
    await request(url, { method: "DELETE", headers: authHeader(this.pat) });
  }
}
