
const DB_NAME = 'stateManager'
const DB_VERSION = 6
const TABLE_NAME = 'selections'
let DB

const getDb = async () => new Promise((resolve, reject) => {
  console.log('call get DB')
  if (DB) {
    console.log('exists')
    resolve(DB)
  }

  const request = indexedDB.open(DB_NAME, DB_VERSION)
  console.log("REQUEST", request)

  request.onerror = (event) => {
    console.log('DB ERROR', event)
    reject(`Error ${event}`)
  }

  request.onsuccess = (event) => {
    console.log('DB SUCCESS', event.target.result)
    DB = event.target.result
    resolve(DB)
  }

  request.onupgradeneeded = (event) => {
    console.log('DB ON UPDATE NEEDED')
    const db = (event.target).result
    try {
      db.deleteObjectStore(TABLE_NAME)
    } catch {

    }
    db.createObjectStore(TABLE_NAME, { keyPath: 'selectionId' })
  }
})


export const getSelections = async (sessionId) => {
  const db = await getDb()
  let selections = {}

  return new Promise((resolve, reject) => {
    try {
      const trans = db.transaction(TABLE_NAME, 'readonly')
      const store = trans.objectStore(TABLE_NAME)
      const request = store.get(sessionId)

      // assign results to selections when request has been successful
      request.onsuccess = (event) => {
        selections = event.target.result ?? selections
        resolve(selections)
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

export const saveSelections = async (newSelections) => {
const db = await getDb()
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const trans = db.transaction(TABLE_NAME, 'readwrite')
      const store = trans.objectStore(TABLE_NAME)

      /* Remove observable data added by VUE
    https://github.com/vuejs/Discussion/issues/292 */
      // const cleanedUpData = JSON.parse(JSON.stringify(newSelections))

      const note = {
        selectionId: 2,
        selectionList: [{id: 1, selected:false}]
      }

      console.log('ADD TO INDEXEDDB', note)
      const result = await store.add(note)


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


/*
ATTEMPT TO COPY TUTORIAL LOGIC HERE
 */


export const createDBFromTutorial = () => {
  const request = window.indexedDB.open(DB_NAME, DB_VERSION)
  console.log('test request', request)

  //on upgrade needed
  request.onupgradeneeded = e => {
    DB = e.target.result
    /* note = {
         title: "note1",
         text: "this is a note"
     }*/
    const todoNotes = DB.createObjectStore("todo_notes", {keyPath: "title"})

    console.log(`upgrade is called database name: ${DB.name} version : ${DB.version}`)

  }
  //on success
  request.onsuccess = e => {
    DB = e.target.result
    console.log('DB SUCCESS', event.target.result)
    console.log(`success is called database name: ${DB.name} version : ${DB.version}`)
  }
  //on error
  request.onerror = e => {
    console.log('DB SUCCESS', event.target.result)
    console.log(`error: ${e.target.error} was found `)

  }
}
