import dotenv from 'dotenv'
import * as sdk from 'matrix-js-sdk'
import type { MatrixClient } from 'matrix-js-sdk'
import { DataFactory, Store } from 'n3'
import { selectSiloEntities, entitiesDifference, silos, ex } from '../util.ts'

export async function aggregateMatrix(dataset: Store): Promise<Store> {
  dotenv.config()
  if (!process.env.MATRIX_SERVER || !process.env.MATRIX_USER_ID || !process.env.MATRIX_PASSWORD) {
    console.error('Matrix credentials not found!')
    process.exit(1)
  }
  const client = sdk.createClient({
    baseUrl: process.env.MATRIX_SERVER,
  })
  await client.login("m.login.password", { "user": process.env.MATRIX_USER_ID, "password": process.env.MATRIX_PASSWORD })

  const updated = await getIds(dataset, client)
  return aggregateRooms(updated, client)
}

export async function getIds(dataset: Store, client: MatrixClient): Promise<Store> {
  const withUsername = await selectSiloEntities(dataset, ex.siloUsername, silos.matrix)
  const withId = await selectSiloEntities(dataset, ex.siloId, silos.matrix)
  const withoutId = entitiesDifference(withUsername, withId)
  console.info(`Fetching ids from room aliases: ${withoutId.length}`)
  for (const entity of withoutId) {
    try {
      const { room_id } = await client.getRoomIdForAlias(entity.value)
      const quad = DataFactory.quad(entity.id, ex.terms.siloId, DataFactory.literal(`matrix:${room_id}`))
      dataset.add(quad)
    } catch (err) {
      console.error(err)
    }
  }
  return dataset
}

export async function aggregateRooms(dataset: Store, client: MatrixClient): Promise<Store> {
  const withId = await selectSiloEntities(dataset, ex.siloId, silos.matrix)
  console.info(`Fetching summaries for rooms: ${withId.length}`)
  for (const entity of withId) {
    try {
      const room = await client.getRoomSummary(entity.value)
      // @ts-expect-error
      if (room.canonical_alias) {
        dataset.deleteMatches(entity.id, ex.terms.siloUsername)
        // @ts-expect-error
        const quad = DataFactory.quad(entity.id, ex.terms.siloUsername, DataFactory.literal(`matrix:${room.canonical_alias}`))
        dataset.add(quad)
      }
      if (room.name) {
        dataset.deleteMatches(entity.id, ex.terms.name)
        const quad = DataFactory.quad(entity.id, ex.terms.name, DataFactory.literal(room.name))
        dataset.add(quad)
      }
      if (room.topic) {
        dataset.deleteMatches(entity.id, ex.terms.description)
        const quad = DataFactory.quad(entity.id, ex.terms.description, DataFactory.literal(room.topic))
        dataset.add(quad)
      }
    } catch (err) {
      console.error(err)
    }
  }
  return dataset
}
