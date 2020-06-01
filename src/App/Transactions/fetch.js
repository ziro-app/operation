import currencyFormat from "@ziro/currency-format";
import { db } from "../../Firebase/index";
import matchStatusColor from "./matchStatusColor";
import { dateFormat } from "./utils";

const fetch = (
    setIsLoading,
    setErrorLoading,
    payments,
    setPayments,
    zoopId,
    limit,
    lastDoc,
    setLastDoc,
    setTotalTransactions,
    setLoadingMore,
    setStatusFilter,
    statusFilter,
    setSellerFilter,
    sellerFilter,
    setNumberOfLoops,
    setIsLoadingResults,
    limitFetch,
    setIsLoadingMore
) => {
    //setIsLoadingResults(true);
    if(payments)
        setIsLoadingMore(true);
    else
        setIsLoadingMore(false);
    let query = "";
    if (!sellerFilter && !statusFilter) {
        query = db
            .collection("credit-card-payments")
            .orderBy("dateLinkCreated", "desc")
            .limit(limitFetch);
    }
    if (sellerFilter && !statusFilter) {
        query = db
            .collection("credit-card-payments")
            .orderBy("dateLinkCreated", "desc")
            .where("seller", "==", `${sellerFilter}`)
            .limit(limitFetch);
    }
    if (!sellerFilter && statusFilter) {
        query = db
            .collection("credit-card-payments")
            .orderBy("dateLinkCreated", "desc")
            .where("status", "==", `${statusFilter}`)
            .limit(limitFetch);
    }
    if (sellerFilter && statusFilter) {
        query = db
            .collection("credit-card-payments")
            .orderBy("dateLinkCreated", "desc")
            .where("seller", "==", `${sellerFilter}`)
            .where("status", "==", `${statusFilter}`)
            .limit(limitFetch);
    }
    //if (sellerFilter) query = query.where("seller", "==", `${sellerFilter}`);
    /*statusFilter
        ? (query = query.where("status", "==", `${statusFilter}`))
        : null;
    sellerFilter
        ? (query = query.where("seller", "==", `${sellerFilter}`))
        : null;*/

    /*if (statusFilter) {
        /*setLastDoc(null);
        setPayments([]);
        query = query.where("status", "==", `${statusFilter}`);
    }*/

    /*if (sellerFilter) {
        /*setLastDoc(null);
        setPayments([]);
        console.log(payments);
        query = query.where("seller", "==", `${sellerFilter}`);
    }*/
    //if (lastDoc) query = query.startAfter(lastDoc);
    const run = async () => {
        try {
            await query.onSnapshot(
                async (snapshot) => {
                    let collectionData = "";
                    if (!sellerFilter && !statusFilter) {
                        //setPayments([]);
                        collectionData = await db
                            .collection("credit-card-payments")
                            .get();
                        //.limit(limit);
                    }
                    if (sellerFilter && !statusFilter) {
                        collectionData = await db
                            .collection("credit-card-payments")
                            .where("seller", "==", `${sellerFilter}`)
                            .get();
                        //.limit(limit);
                    }
                    if (!sellerFilter && statusFilter) {
                        collectionData = await db
                            .collection("credit-card-payments")
                            .where("status", "==", `${statusFilter}`)
                            .get();
                        //.limit(limit);
                    }
                    if (sellerFilter && statusFilter) {
                        collectionData = await db
                            .collection("credit-card-payments")
                            .where("seller", "==", `${sellerFilter}`)
                            .where("status", "==", `${statusFilter}`)
                            .get();
                        //.limit(limit);
                    }

                    setTotalTransactions(collectionData.docs.length);
                    if (!collectionData.docs.length){
                        setPayments([]);
                        setIsLoadingMore(false);
                    }
                    const paymentDoc = [];
                    if (!snapshot.empty) {
                        snapshot.forEach((doc) => {
                            const {
                                charge,
                                date,
                                fees,
                                installments,
                                dateLinkCreated,
                                transactionZoopId,
                                maxInstallments,
                                sellerZoopId,
                                status,
                                buyerRazao,
                                receivables,
                                receivement,
                                seller,
                                brand,
                                firstFour,
                                lastFour,
                                cardholder,
                                receiptId,
                            } = doc.data();
                            const chargeFormatted = currencyFormat(charge);
                            const dateFormatted = date ? dateFormat(date) : "";

                            /*const dateFormatted = new Date(date.seconds * 1000)
                                .toLocaleDateString("pt-br", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "2-digit",
                                })
                                .replace(" de ", "/");*/
                            const statusColor = matchStatusColor(status);
                            paymentDoc.push({
                                transactionZoopId: transactionZoopId
                                    ? transactionZoopId
                                    : "",
                                transactionId: doc.id,
                                charge: chargeFormatted,
                                dateLinkCreated,
                                date: dateFormatted,
                                fees: fees ? fees : "",
                                installments: installments ? installments : "",
                                maxInstallments: maxInstallments
                                    ? maxInstallments
                                    : "",
                                seller: buyerRazao ? buyerRazao : "-",
                                sellerZoopId: sellerZoopId ? sellerZoopId : "",
                                status: status ? status : "",
                                statusColor: matchStatusColor(status),
                                buyerRazao,
                                receivables: receivables ? receivables : [],
                                receivement,
                                seller,
                                status,
                                date: dateFormatted,
                                brand,
                                firstFour,
                                lastFour,
                                installments,
                                cardholder,
                                statusColor,
                                receiptId,
                            });
                        });
                        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
                        //setPayments([]);
                        //setPayments([...payments, ...paymentDoc]);
                        setPayments([...paymentDoc]);
                        setNumberOfLoops(0);
                        setIsLoadingMore(false);
                        //setIsLoadingResults(false);
                    } else {
                        //setLastDoc(null);
                        //if (payments) setPayments([]);
                    }
                    setIsLoading(false);
                    setLoadingMore(false);
                },
                (error) => {
                    console.log(error);
                    setIsLoading(false);
                    setLoadingMore(false);
                }
            );
        } catch (error) {
            setErrorLoading(true);
            setIsLoading(false);
            setLoadingMore(false);
        }
    };
    run();
};

export default fetch;
