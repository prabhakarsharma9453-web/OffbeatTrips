/**
 * Helper function to sort Cosmos DB results in memory
 * Azure Cosmos DB requires composite indexes for multi-field sorts,
 * so we fetch all data and sort in memory instead
 */

export function sortByOrderAndDate<T extends { order?: number; createdAt?: Date | string }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    // First by order field
    const orderA = a.order || 0
    const orderB = b.order || 0
    if (orderA !== orderB) {
      return orderA - orderB
    }
    // Then by createdAt (newest first)
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return dateB - dateA
  })
}

export function sortByDate<T extends { createdAt?: Date | string }>(
  items: T[],
  ascending: boolean = false
): T[] {
  return [...items].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return ascending ? dateA - dateB : dateB - dateA
  })
}
