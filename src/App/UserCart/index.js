import React, { useEffect, useState, useMemo } from "react";
import { db } from "../../Firebase";
import { toCartArray, toStoreownerData } from "./utils";
import SearchCart from "./SearchCart";
import CartItem from "./UserCartItem";
import SpinnerWithDiv from "@bit/vitorbarbosa19.ziro.spinner-with-div";

export default ({ cartId }) => {
    const [carts, setCarts] = useState([]);
    const [fecthingCarts, setFetchingCarts] = useState(true);
    const [storeowners, setStoreowners] = useState({});
    const [fetchingStoreowners, setFetchingStoreowners] = useState(true);
    const [queryStr, setQueryStr] = useState();

    useEffect(() => {
        const cartObserver = db
            .collectionGroup("cart")
            .orderBy("added", "asc")
            .onSnapshot(
                ({ docs }) =>
                    setCarts(docs.reduce(toCartArray, [])) ||
                    setFetchingCarts(false)
            );
        const storeownersObserver = db
            .collection("storeowners")
            .onSnapshot(
                ({ docs }) =>
                    setStoreowners(docs.reduce(toStoreownerData, {})) ||
                    setFetchingStoreowners(false)
            );
        return () => {
            cartObserver();
            storeownersObserver();
        };
    }, []);

    const selectedCart = useMemo(
        () => (cartId ? carts.find(({ id }) => id === cartId) : undefined),
        [cartId, carts]
    );
    const selectedStoreowner = useMemo(
        () =>
            selectedCart ? storeowners[selectedCart.storeownerId] : undefined,
        [selectedCart, storeowners]
    );

    if (fecthingCarts || fetchingStoreowners) return <SpinnerWithDiv />;
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
