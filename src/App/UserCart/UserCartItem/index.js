import React, { useState, useEffect, useCallback, useMemo } from "react";
import { get } from "axios";
import { useRoute } from "wouter";
import { db, fs } from "../../../Firebase";
import JSZip from "jszip";
import Header from "@bit/vitorbarbosa19.ziro.header";
import Spinner from "@bit/vitorbarbosa19.ziro.spinner-with-div";
import Button from "@bit/vitorbarbosa19.ziro.button";
import { brandCart, brandName } from "./styles";
import Card from "./card";
import currencyFormat from "@ziro/currency-format";
import { summary, saleSummary, total, priceTotal } from "./styles_catalog";
import { containerWithPadding } from "@ziro/theme";
import { reduceTotal } from "./utils";
import { useLocation } from "wouter";

export default ({
    cart: { productIds, products, ...cart },
    storeowner,
    oldQuery,
}) => {
    const [prices, setPrices] = useState({});
    const [urls, setURLs] = useState({});
    const [location, setLocation] = useLocation();
    const [match, params] = useRoute("/pedidos/:cartId?");
    console.log(params);

    const [totalItems, totalPrice] = useMemo(
        () =>
            productIds && products
                ? productIds.reduce(reduceTotal(prices, products), [0, 0])
                : [0, 0],
        [productIds, products, prices]
    );

    const confirmCartItem = useCallback(async () => {
        try {
            await db
                .collection("catalog-user-data")
                .doc(cart.storeownerId)
                .collection("cart")
                .doc(cart.id)
                .set(
                    {
                        status: "waitingPayment",
                        lastUpdate: fs.FieldValue.serverTimestamp(),
                        updatedBy: "seller",
                        total: `${totalPrice}`,
                    },
                    { merge: true }
                );
        } catch (error) {
            console.log({ error });
            throw error;
        }
    }, [cart, totalPrice]);

    const downloadAllImages = useCallback(async () => {
        try {
            const zip = new JSZip();
            const folder = zip.folder(`${storeowner.razao}`);
            await Promise.all(
                Object.entries(urls).map(([productId, url]) => {
                    return get(url, { responseType: "arraybuffer" }).then(
                        ({ data }) => {
                            const filename = `peca_${
                                productIds.indexOf(productId) - 1
                            }.png`;
                            const file = new Blob([
                                Buffer.from(data, "binary"),
                            ]);
                            folder.file(filename, file);
                        }
                    );
                })
            );
            const content = await zip.generateAsync({ type: "blob" });
            const url = window.URL.createObjectURL(content);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${storeowner.razao}.zip`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.log({ error });
        }
    }, [productIds, urls]);

    return (
        <div style={containerWithPadding}>
            <Header
                type="icon-link"
                title={storeowner.razao}
                navigateTo={`/pedidos${oldQuery || ""}`}
                icon="back"
            />
            <div style={brandCart}>
                <label style={brandName}>{cart.brandName}</label>
                <Button
                    type="button"
                    cta="Fazer download"
                    click={downloadAllImages}
                />
                {productIds.map((productId) => (
                    <Card
                        key={productId}
                        productId={productId}
                        cartProduct={products[productId]}
                        setPrice={(price) =>
                            setPrices((old) => ({ ...old, [productId]: price }))
                        }
                        setURL={(url) =>
                            setURLs((old) => ({ ...old, [productId]: url }))
                        }
                    />
                ))}
                <div style={summary}>
                    <div style={saleSummary}>
                        <label style={total}>Total da compra</label>
                        <label style={priceTotal}>
                            {currencyFormat(totalPrice)}
                        </label>
                    </div>
                    <div style={saleSummary}>
                        <label style={total}>Quantidade</label>
                        <label style={priceTotal}>{totalItems}</label>
                    </div>
                </div>
                {cart.status === "waitingConfirmation" && (
                    <Button
                        type="button"
                        cta={"Confirmar pedido"}
                        click={confirmCartItem}
                        submitting={false}
                    />
                )}
                {cart.status === "waitingPayment" && (
                    <Button
                        type="button"
                        cta={"Aguardando pagamento"}
                        click={() => {}}
                        submitting={true}
                    />
                )}
            </div>
        </div>
    );
};
