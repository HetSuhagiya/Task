import type { Task, DailyStats } from '../types/task';

const DB_NAME = 'TaskManagerDB';
const DB_VERSION = 2;
const TASKS_STORE_NAME = 'tasks';
const DAILY_STATS_STORE_NAME = 'dailyStats';

// Initialize the database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open database'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create tasks object store if it doesn't exist
      if (!db.objectStoreNames.contains(TASKS_STORE_NAME)) {
        const tasksStore = db.createObjectStore(TASKS_STORE_NAME, { keyPath: 'id' });
        tasksStore.createIndex('status', 'status', { unique: false });
        tasksStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Create dailyStats object store if it doesn't exist
      if (!db.objectStoreNames.contains(DAILY_STATS_STORE_NAME)) {
        db.createObjectStore(DAILY_STATS_STORE_NAME, { keyPath: 'date' });
      }
    };
  });
};

// Get all tasks
export const getAllTasks = async (): Promise<Task[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TASKS_STORE_NAME, 'readonly');
    const store = transaction.objectStore(TASKS_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error('Failed to get tasks'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Add a new task
export const addTask = async (task: Task): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TASKS_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(TASKS_STORE_NAME);
    const request = store.add(task);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error('Failed to add task'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Update a task
export const updateTask = async (task: Task): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TASKS_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(TASKS_STORE_NAME);
    const request = store.put(task);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error('Failed to update task'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Delete a task
export const deleteTask = async (id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TASKS_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(TASKS_STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error('Failed to delete task'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Get tasks by status
export const getTasksByStatus = async (status: string): Promise<Task[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TASKS_STORE_NAME, 'readonly');
    const store = transaction.objectStore(TASKS_STORE_NAME);
    const index = store.index('status');
    const request = index.getAll(status);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error('Failed to get tasks by status'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Get daily stats for a specific date
export const getDailyStats = async (date: string): Promise<DailyStats | undefined> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DAILY_STATS_STORE_NAME, 'readonly');
    const store = transaction.objectStore(DAILY_STATS_STORE_NAME);
    const request = store.get(date);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error('Failed to get daily stats'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Update or add daily stats for a specific date
export const updateDailyStats = async (stats: DailyStats): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DAILY_STATS_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(DAILY_STATS_STORE_NAME);
    const request = store.put(stats);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error('Failed to update daily stats'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Get the latest daily stats (for streak calculation)
export const getLatestDailyStats = async (): Promise<DailyStats | undefined> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DAILY_STATS_STORE_NAME, 'readonly');
    const store = transaction.objectStore(DAILY_STATS_STORE_NAME);
    const request = store.openCursor(null, 'prev'); // Open cursor in reverse order

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        resolve(cursor.value);
      } else {
        resolve(undefined);
      }
    };

    request.onerror = () => {
      reject(new Error('Failed to get latest daily stats'));
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}; 