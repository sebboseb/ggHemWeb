import { db } from "../../firebase";
import { doc, setDoc, onSnapshot, deleteDoc, deleteField, updateDoc, collection, query } from "firebase/firestore";

export async function likeGlass(glass, uid) {
    const likedRef = doc(db, "User", uid, "Liked", glass.namn)
    await setDoc(likedRef, {
        glass: glass,
    }, { merge: true });
}

export async function removeLikeGlass(glass, uid) {
    await deleteDoc(doc(db, "User", (uid), "Liked", glass.namn));
}

export async function addToCart(glass, uid, cartlol) {
    const cartRef = doc(db, "User", (uid), "Cart", "glassar");
    let amount = await cartlol.filter(x => x.namn === glass.namn).length + 1;
    await setDoc(cartRef, {
        [glass.namn + " " + amount]: glass,
    }, { merge: true });
}

export async function deleteFromCart(glass, uid, cartlol) {
    const deleteRef = doc(db, "User", (uid), "Cart", "glassar");
    let amountlol = await cartlol.filter(x => x.namn === glass.namn).length;
    await updateDoc(deleteRef, {
        [glass.namn + " " + amountlol]: deleteField()
    });
}