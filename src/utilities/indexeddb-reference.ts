/*
 * Copyright (c) 2022. OpenEye Scientific Software, Inc
 * All rights reserved
 */

interface subview {
  description: string
  layout: any /* TODO:MA create interface for layout  */
  resources: any /* TODO:MA create interface for resources  */
  uuid: string
  page: string
  name: string
}


interface discussionDraft {
  draftMessage: string
  messageId: string
  discussionId: number
  subviews: Array<subview>
}

const DB_NAME = 'discussionDrafts'
const DB_VERSION = 2
const TABLE_NAME = 'drafts'
let DB: any

const getDb = async (): Promise<any> => new Promise<any>((resolve, reject) => {
  if (DB) {
    resolve(DB)
  }

  const request = (window as any).indexedDB.open(DB_NAME, DB_VERSION)

  request.onerror = (event) => {
    reject(`Error ${event}`)
  }

  request.onsuccess = (event) => {
    DB = (event.target as IDBOpenDBRequest).result
    resolve(DB)
  }

  request.onupgradeneeded = (event) => {
    const db = (event.target as IDBOpenDBRequest).result
    try {
      db.deleteObjectStore(TABLE_NAME)
    } catch {

    }
    const store = db.createObjectStore(TABLE_NAME, { keyPath: 'discussionId' })
    store.createIndex('discussionId_and_messageId', ['discussionId', 'messageId'], { unique: true })
  }
})

export const promptAutoSaveWarning = ():
  Promise<void> => (<any>window).OrionSwal.fire({
  type: 'warning',
  title: 'Warning',
  html: 'You have unsaved changes. <br> Please discard or save to continue.',
  showCancelButton: false,
  confirmButtonText: 'Ok',
  allowOutsideClick: true,
})

export const deleteDraft = async (): Promise<any> => {
  const db: any = await getDb()

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const trans = db.transaction(TABLE_NAME, 'readwrite')
      const store = trans.objectStore(TABLE_NAME)
      const result = await store.clear()

      // close database when transaction is complete
      trans.oncomplete = () => {
        db.close()
      }
      resolve(result)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`There was an error clearing drafts, ${error}`)
      reject(error)
    }
  })
}

export const deleteDraftByIds = async (discussionId: number, messageId: string): Promise<any> => {
  const db: any = await getDb()

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const trans = db.transaction(TABLE_NAME, 'readwrite')
      const store = trans.objectStore(TABLE_NAME)
      const discussionMessageIDIndex = store.index('discussionId_and_messageId')

      const requestDraftByIds = await discussionMessageIDIndex.get([discussionId, messageId])

      if (requestDraftByIds) {
        store.delete(discussionId)
      }

      resolve(requestDraftByIds)
      // close db when request is complete
      requestDraftByIds.oncomplete = () => {
        db.close()
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`There was an error clearing drafts, ${error}`)
      reject(error)
    }
  })
}

export const getDraft = async (discussionId: number): Promise<discussionDraft> => {
  const db: any = await getDb()
  let drafts = {} as discussionDraft

  return new Promise((resolve, reject) => {
    try {
      const trans = db.transaction(TABLE_NAME, 'readonly')
      const store = trans.objectStore(TABLE_NAME)
      const request = store.get(discussionId)

      // assign results to drafts when request has been successful
      request.onsuccess = (event) => {
        drafts = event.target.result ?? drafts
        resolve(drafts)
      }

      // close db when request is complete
      request.oncomplete = () => {
        db.close()
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`There was an error accessing drafts, ${error}`)
      reject(error)
    }
  })
}

export const saveDraft = async (draft: discussionDraft): Promise<any> => {
  const db: any = await getDb()

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const trans = db.transaction(TABLE_NAME, 'readwrite')
      const store = trans.objectStore(TABLE_NAME)

      /* Remove observable data added by VUE
          https://github.com/vuejs/Discussion/issues/292 */
      draft.subviews = JSON.parse(JSON.stringify(draft.subviews))

      const result = await store.put(draft)

      // close database when transaction is complete
      trans.oncomplete = () => {
        db.close()
      }

      resolve(result)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`There was an error adding to drafts, ${error}`)
      reject(error)
    }
  })
}
