import { db } from "../../firebase";
import { doc, setDoc, onSnapshot, deleteDoc, deleteField, updateDoc, collection, query } from "firebase/firestore";

export function addToOfflineCart(glass) {
    // let array = ["lol"]

    let array = JSON.parse(localStorage.getItem("cart"));

    if (array !== null) {
        localStorage.setItem("cart", JSON.stringify(array.concat(glass)));
    } else {
        let array = [glass]
        localStorage.setItem("cart", JSON.stringify((array)));
    }
}

export function deleteFromOfflineCart(glass) {
    let array = JSON.parse(localStorage.getItem("cart"));

    let index = array.map((item) => item.namn).indexOf(glass.namn);
    if (index > -1) {
        array.splice(index, 1);
        console.log("Result", array);
    }

    localStorage.setItem("cart", JSON.stringify((array)));
}

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
    // const currentUser = false;
    // if (currentUser) {
    const cartRef = doc(db, "User", (uid), "Cart", "glassar");
    const stripeRef = doc(db, "User", (uid), "Cart", "stripeGlassar");
    let stripeGlass = {};
    let amount = await cartlol.filter(x => x.namn === glass.namn).length + 1;
    Object.assign(stripeGlass,
        { quantity: 1 },
        { amount: parseInt(glass.displayPris) * 100 },
        { name: glass.namn },
        { images: [glass.url] },
        { currency: 'sek' }
    );
    await setDoc(cartRef, {
        [glass.namn + " " + amount]: glass,
    }, { merge: true });

    await setDoc(stripeRef, {
        [stripeGlass.name + " " + amount]: stripeGlass,
    }, { merge: true });
    // }
    // else {
    //     localStorage.setItem("cart", JSON.stringify([glass]))
    //     // console.log(JSON.stringify(glass))
    //     console.log(localStorage.getItem("cart"))
    // }
}

export async function deleteFromCart(glass, uid, cartlol) {
    const deleteRef = doc(db, "User", (uid), "Cart", "glassar");
    const deleteRefStripe = doc(db, "User", (uid), "Cart", "stripeGlassar");
    let amountlol = await cartlol.filter(x => x.namn === glass.namn).length;
    await updateDoc(deleteRefStripe, {
        [glass.namn + " " + amountlol]: deleteField()
    });

    await updateDoc(deleteRef, {
        [glass.namn + " " + amountlol]: deleteField()
    });
}

export async function deleteCart(uid) {
    await deleteDoc(doc(db, "User", uid, "Cart", "glassar"));
    await deleteDoc(doc(db, "User", uid, "Cart", "stripeGlassar"));
    window.location.reload(false);
}

export async function addOfflineCartToCart(glass, uid) {
    const cartRef = doc(db, "User", (uid), "Cart", "glassar");
    await setDoc(cartRef, {
        glass,
    }, { merge: true });
}

export async function addDatum(uid, date) {
    const userRef = doc(db, "User", uid)
    await updateDoc(userRef, {
        date
    })
}