import authors from "../data/authors.json"

export interface BlogAuthor {
  id: string
  name: string
  description: string
  avatar: string
  github?: string | null
  linkedin?: string | null
  website?: string | null
}

const authorMap = new Map(authors.map((a) => [a.id, a as BlogAuthor]))

export function getAuthorById(id: string): BlogAuthor | undefined {
  return authorMap.get(id)
}

export function getAuthorsByIds(ids: string[]): BlogAuthor[] {
  return ids.map((id) => getAuthorById(id)).filter((a): a is BlogAuthor => !!a)
}
