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
} from '@firebase/firestore';
import { setDoc } from 'firebase/firestore';
import { db, timestamp } from '.';
import {
  docSnapshotToObject,
  querySnapshotsToObject,
  querySnapshotToObject,
} from './utils';

export const fb = () => ({
  async getColors() {
    const docs = await getDocs(collection(db, 'colors'));

    return querySnapshotsToObject(docs);
  },
  async getUserByEmail(email: string) {
    if (!email) return null;

    const q = query(collection(db, 'users'), where('email', '==', email));

    const docsSnap = await getDocs(q);
    return querySnapshotToObject(docsSnap);
  },
  async getAllTasks() {
    const docs = await getDocs(collection(db, 'tasks'));

    return querySnapshotsToObject(docs);
  },
  async getAllProjects(user: any) {
    console.log(user);
    if (!user) return null;
    try {
      const q = query(
        collection(db, 'projects'),
        where('userId', '==', user.id)
      );

      const docs = await getDocs(q);

      return querySnapshotsToObject(docs);
    } catch (error) {
      console.log(error);
    }
  },
  async getProject(id: string) {
    const projectSnap = await getDoc(doc(db, 'projects', id));

    return docSnapshotToObject(projectSnap);
  },
  async createProject(project: any, user: any) {
    const collectionRef = collection(db, 'projects');
    const docRef = doc(collectionRef);
    console.log(user);

    await setDoc(docRef, {
      ...project,
      id: docRef.id,
      userId: user.id,
      timestamp,
    });

    const createdProject = await getDoc(docRef);
    return createdProject.data();
  },
  async deleteProject(project: any) {
    await deleteDoc(doc(db, 'projects', project.id));

    return project;
  },
  async createTask(task: any) {
    const taskRef = await addDoc(collection(db, 'tasks'), {
      ...task,
      timestamp,
    });
    const taskSnap = await getDoc(taskRef);
    return docSnapshotToObject(taskSnap);
  },
  async updateTask(task: any, text: string) {
    await updateDoc(doc(db, 'tasks', task.id), {
      text,
    });
    return task;
  },
  async deleteTask(task: any) {
    await deleteDoc(doc(db, 'tasks', task.id));

    return task;
  },
  async getProjectTasks(id: string) {
    const q = query(collection(db, 'tasks'), where('projectId', '==', id));
    const tasksSnap = await getDocs(q);
    return querySnapshotsToObject(tasksSnap);
  },
});
