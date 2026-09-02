import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

const customMonstersRef = (uid) => collection(db, "users", uid, "customMonsters");

export const subscribeToCustomMonsters = (uid, callback) => {
  const q = query(customMonstersRef(uid), orderBy("name"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

export const saveCustomMonster = (uid, { name, ac, maxHp, cr }) =>
  addDoc(customMonstersRef(uid), { name, ac, maxHp, cr: cr || "", createdAt: serverTimestamp() });

export const deleteCustomMonster = (uid, monsterId) =>
  deleteDoc(doc(db, "users", uid, "customMonsters", monsterId));
