// Create IndexedDB - Set DB-Name and DB-Version
const DB_NAME = "stateManager";
const DB_VERSION = 10;
const DATA_DB_VERSION = 11;
const SESSION_ID = "selectionSession";
const DATA_SESSION_ID = "dataSession";
const SELECTION_TABLE_NAME = "selections";
const DATA_TABLE_NAME = "api_data";
let DB;

// Creation of IndexedDB with 2 database stores, "selections" and "api_data"
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
        db.deleteObjectStore(SELECTION_TABLE_NAME);
        db.deleteObjectStore(DATA_TABLE_NAME);
      } catch {}
      db.createObjectStore(SELECTION_TABLE_NAME, { keyPath: "selectionId" });
      db.createObjectStore(DATA_TABLE_NAME, { keyPath: "selectionId" });
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

      const trans = db.transaction(SELECTION_TABLE_NAME, "readwrite");
      const store = trans.objectStore(SELECTION_TABLE_NAME);

      console.log("ADD TO INDEXEDDB", note);
      const result = await store.put(note);

      resolve(result);
    } catch (error) {
      console.error(`There was an error adding to drafts, ${error}`);
      reject(error);
    }
  });
};

// Save API Data to indexedDB api_data table
export const saveData = async (newSelections) => {
  const db = await getDb();
  return new Promise(async (resolve, reject) => {
    try {
      const note = {
        selectionId: DATA_SESSION_ID,
        selectionList: JSON.parse(JSON.stringify(newSelections)),
      };

      const trans = db.transaction(DATA_TABLE_NAME, "readwrite");
      const store = trans.objectStore(DATA_TABLE_NAME);

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
      const trans = db.transaction(SELECTION_TABLE_NAME, "readonly");
      const store = trans.objectStore(SELECTION_TABLE_NAME);
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

// Get data from api_data table in indexedDB
export const getData = async () => {
  const db = await getDb();
  let data = {};

  return new Promise((resolve, reject) => {
    try {
      const trans = db.transaction(DATA_TABLE_NAME, "readonly");
      const store = trans.objectStore(DATA_TABLE_NAME);
      const request = store.get(DATA_SESSION_ID);

      // assign results to data when request has been successful
      request.onsuccess = (event) => {
        data = event.target.result ?? data;
        resolve(data);
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
