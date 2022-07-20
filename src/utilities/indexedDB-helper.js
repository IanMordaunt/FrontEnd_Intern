// Create IndexedDB - Set DB-Name and DB-Version
const DB_NAME = "stateManager";
const DB_VERSION = 10;
const SESSION_ID = "blahblah";
const TABLE_NAME = "selections";
let DB;

export const getDb = async () =>
  new Promise((resolve, reject) => {
    if (DB) {
      resolve(DB);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    console.log("REQUEST", request);

    request.onerror = (event) => {
      console.log("DB ERROR", event);
      reject(`Error ${event}`);
    };

    request.onsuccess = (event) => {
      console.log("DB SUCCESS", event.target.result);
      DB = event.target.result;
      resolve(DB);
    };

    request.onupgradeneeded = (event) => {
      console.log("DB ON UPDATE NEEDED");
      const db = event.target.result;
      try {
        db.deleteObjectStore(TABLE_NAME);
      } catch {}
      db.createObjectStore(TABLE_NAME, { keyPath: "selectionId" });
    };
  });

// Save new selections to selection array in indexedDB selections table
export const saveSelections = async (newSelections) => {
  const db = await getDb();
  return new Promise(async (resolve, reject) => {
    try {
      const note = {
        selectionId: SESSION_ID,
        selectionList: JSON.parse(JSON.stringify(newSelections)),
      };

      const trans = db.transaction(TABLE_NAME, "readwrite");
      const store = trans.objectStore(TABLE_NAME);

      console.log("ADD TO INDEXEDDB", note);
      const result = await store.put(note);

      resolve(result);
    } catch (error) {
      console.error(`There was an error adding to drafts, ${error}`);
      reject(error);
    }
  });
};

// Get selections array from selections table in indexedDB
export const getSelections = async () => {
  const db = await getDb();
  let selections = {};

  return new Promise((resolve, reject) => {
    try {
      const trans = db.transaction(TABLE_NAME, "readonly");
      const store = trans.objectStore(TABLE_NAME);
      const request = store.get(SESSION_ID);

      // assign results to selections when request has been successful
      request.onsuccess = (event) => {
        selections = event.target.result ?? selections;
        resolve(selections);
      };

      // close db when request is complete
      request.oncomplete = () => {
        db.close();
      };
    } catch (error) {
      console.error(`There was an error accessing drafts, ${error}`);
      reject(error);
    }
  });
};
