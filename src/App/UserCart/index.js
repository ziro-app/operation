import React, { useState, useMemo } from "react";
import { useFirestore, useFirestoreCollection } from 'reactfire'
import { toCartArray, toStoreownerData } from "./utils";
import SearchCart from "./SearchCart";
import CartItem from "./UserCartItem";

export default ({ cartId }) => {
    const [queryStr, setQueryStr] = useState()
    const last7days = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate() - 7}`)
    console.log(last7days)
    const allCarts = useFirestoreCollection(
        useFirestore()
        .collectionGroup('cart')
        .where('lastUpdate', '>=', last7days)
        .orderBy('lastUpdate', 'desc')
    )
    const carts = allCarts.docs.reduce(toCartArray, [])
    const allStoreowners = useFirestoreCollection(useFirestore().collection('storeowners'))
    const storeowners = allStoreowners.docs.reduce(toStoreownerData, [])
    const selectedCart = useMemo(
        () => (cartId ? carts.find(({ id }) => id === cartId) : undefined),
        [cartId, carts]
    );
    const selectedStoreowner = useMemo(
        () =>
            selectedCart ? storeowners[selectedCart.storeownerId] : undefined,
        [selectedCart, storeowners]
    );
    if (cartId && selectedCart && selectedStoreowner)
        return (
            <CartItem
                cart={selectedCart}
                storeowner={selectedStoreowner}
                oldQuery={queryStr}
            />
        );
    return (
        <SearchCart
            carts={carts}
            storeowners={storeowners}
            setQueryStr={setQueryStr}
        />
    );
};
