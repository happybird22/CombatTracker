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

const charactersRef = (uid) => collection(db, "users", uid, "characters");

export const subscribeToCharacters = (uid, callback) => {
  const q = query(charactersRef(uid), orderBy("name"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

export const saveCharacter = (uid, { name, maxHp, ac }) =>
  addDoc(charactersRef(uid), { name, maxHp, ac, createdAt: serverTimestamp() });

export const deleteCharacter = (uid, characterId) =>
  deleteDoc(doc(db, "users", uid, "characters", characterId));
