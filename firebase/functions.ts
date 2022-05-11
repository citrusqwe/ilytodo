import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  deleteDoc,
  updateDoc,
  onSnapshot,
  DocumentData,
  orderBy,
  OrderByDirection,
} from '@firebase/firestore';
import { setDoc } from 'firebase/firestore';
import { db, timestamp } from '.';
import {
  docSnapshotToObject,
  querySnapshotsToObject,
  querySnapshotToObject,
} from './utils';

export const fb = () => ({
  async getUserByEmail(email: string) {
    if (!email) return null;

    try {
      const q = query(collection(db, 'users'), where('email', '==', email));

      const docsSnap = await getDocs(q);
      return querySnapshotToObject(docsSnap);
    } catch (error) {
      return null;
    }
  },
  async getAllTasks() {
    try {
      const docs = await getDocs(collection(db, 'tasks'));
      return querySnapshotsToObject(docs);
    } catch (error) {
      return null;
    }
  },
  async getAllProjects(user: any) {
    if (!user) return null;
    try {
      const q = query(
        collection(db, 'projects'),
        where('userId', '==', user.id),
        orderBy('timestamp', 'desc')
      );

      const docs = await getDocs(q);

      return querySnapshotsToObject(docs);
    } catch (error) {
      console.log(error);
    }
  },
  async getAllProjectsRealtime(user: any, setProjectsList: any) {
    if (!user) return null;
    try {
      const q = query(
        collection(db, 'projects'),
        where('userId', '==', user.id),
        orderBy('timestamp', 'desc')
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const projects: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
          projects.push(doc.data());
        });
        setProjectsList(projects);
      });

      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  },
  async getProject(id: string) {
    try {
      const projectSnap = await getDoc(doc(db, 'projects', id));
      return docSnapshotToObject(projectSnap);
    } catch (error) {
      return null;
    }
  },
  async createProject(project: any, user: any) {
    try {
      const collectionRef = collection(db, 'projects');
      const docRef = doc(collectionRef);

      await setDoc(docRef, {
        ...project,
        id: docRef.id,
        userId: user.id,
        timestamp,
      });

      const createdProject = await getDoc(docRef);
      return createdProject.data();
    } catch (error) {
      return null;
    }
  },
  async updateProject(project: any, field: any) {
    try {
      await updateDoc(
        doc(db, 'projects', project.id),
        Object.fromEntries(Object.entries(field))
      );

      return project;
    } catch (error) {
      return error;
    }
  },
  async deleteProject(project: any) {
    try {
      await deleteDoc(doc(db, 'projects', project.id));
      const q = query(
        collection(db, 'tasks'),
        where('projectId', '==', project.id)
      );
      const projectTasks = await getDocs(q);

      projectTasks.docs.forEach(
        async (d) => await deleteDoc(doc(db, 'tasks', d.id))
      );

      return project;
    } catch (error) {
      return null;
    }
  },
  async createTask(task: any) {
    try {
      const taskRef = await addDoc(collection(db, 'tasks'), {
        ...task,
        timestamp,
      });
      const taskSnap = await getDoc(taskRef);
      return docSnapshotToObject(taskSnap);
    } catch (error) {
      return null;
    }
  },
  async updateTask(task: any, field: any) {
    try {
      await updateDoc(
        doc(db, 'tasks', task.id),
        Object.fromEntries(Object.entries(field))
      );

      return task;
    } catch (error) {
      return null;
    }
  },
  async deleteTask(task: any) {
    try {
      await deleteDoc(doc(db, 'tasks', task.id));

      return task;
    } catch (error) {
      return null;
    }
  },
  async getProjectTasks(id: string, order: OrderByDirection = 'desc') {
    try {
      const q = query(
        collection(db, 'tasks'),
        where('projectId', '==', id),
        orderBy('timestamp', order)
      );
      const tasksSnap = await getDocs(q);
      const res = querySnapshotsToObject(tasksSnap);
      if (!res) return [];
      return querySnapshotsToObject(tasksSnap);
    } catch (error) {
      return [];
    }
  },
});
