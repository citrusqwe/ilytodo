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
    const projectSnap = await getDoc(doc(db, 'projects', id));
    return docSnapshotToObject(projectSnap);
  },
  async createProject(project: any, user: any) {
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
  },
  async updateProject(project: any, field: any) {
    await updateDoc(
      doc(db, 'projects', project.id),
      Object.fromEntries(Object.entries(field))
    );

    return project;
  },
  async deleteProject(project: any) {
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
  },
  async createTask(task: any) {
    const taskRef = await addDoc(collection(db, 'tasks'), {
      ...task,
      timestamp,
    });
    const taskSnap = await getDoc(taskRef);
    return docSnapshotToObject(taskSnap);
  },
  async updateTask(task: any, field: any) {
    await updateDoc(
      doc(db, 'tasks', task.id),
      Object.fromEntries(Object.entries(field))
    );

    return task;
  },
  async deleteTask(task: any) {
    await deleteDoc(doc(db, 'tasks', task.id));

    return task;
  },
  async getProjectTasks(id: string, order: OrderByDirection = 'desc') {
    const q = query(
      collection(db, 'tasks'),
      where('projectId', '==', id),
      orderBy('timestamp', order)
    );
    const tasksSnap = await getDocs(q);
    const res = querySnapshotsToObject(tasksSnap);
    if (!res) return [];
    return querySnapshotsToObject(tasksSnap);
  },
});
