import React, { useState, useEffect } from "react"
import { Switch, Route, useRoute } from "wouter"
import useScrollEnd from "../Componentsv2/useScrollEnd"
import Link from "../Componentsv2/Link"
import DotsLoader from "../Componentsv2/DotsLoader"
import Button from "../Componentsv2/Button"
import ProductsNew from "../ProductsNew"
import ProductsEdit from "../ProductsEdit"

import ProductGallery, { CardType } from "../Componentsv2/ProductGallery"
import { useProducts } from "./useProducts"

type timestamp = {
  seconds: number
  nanoseconds: number
}

const maxItems = 10

const Productsv2 = () => {
  const [, params] = useRoute("/produtos/:fantasia/:supplierUid")
  const [, paramsNew] = useRoute("/produtos/:fantasia/:supplierUid/novo")
  const [, paramsEdit] = useRoute("/produtos/:fantasia/:supplierUid/:productId/editar")
  const fantasia = params && params.fantasia || paramsNew && paramsNew.fantasia || paramsEdit && paramsEdit.fantasia
  const supplierUid = params && params.supplierUid || paramsNew && paramsNew.supplierUid || paramsEdit && paramsEdit.supplierUid
  const baseUrl = `/produtos/${fantasia}/${supplierUid}`
  const [isLoading, setIsLoading] = useState(true)
  const [infiniteScroll, setInfiniteScroll] = useState(false)
  const [productList, setProductList] = useState<CardType[]>([])
  const [lastProduct, setLastProduct] = useState<timestamp | string | null>("")
  const { status, products } = useProducts(supplierUid, maxItems, lastProduct)
  const [pageEnd, hasScrollBar] = useScrollEnd()
  const lastProductInArray = products[products.length - 1]
  /** if user reaches end of page, set the last product fetched so useProducts can trigger a new fetch */
  useEffect(() => {
    if (pageEnd === true)
      setLastProduct(!lastProductInArray ? null : lastProductInArray.dateUpdated)
  }, [pageEnd, products])
  /** if new products are fetched, concat with the old products */
  useEffect(() => {
    setInfiniteScroll(true)
    if (status === "success") {
      setProductList(prevProductList => prevProductList.concat(products))
      setInfiniteScroll(false)
      setIsLoading(false)
    }
  }, [status, products, lastProductInArray])
  console.log(products)
  console.log(supplierUid)
  return (
    <Switch>
      <Route path="/produtos/:fantasia/:supplierUid">
        <Link isButton href={`${baseUrl}/novo`} style={{ marginBottom: "20px" }}>
          Adicionar novo
        </Link>
        <ProductGallery cards={productList} isLoading={isLoading} baseUrl={baseUrl} skeletonCount={maxItems} />
        {!isLoading && infiniteScroll && lastProduct !== null ? <DotsLoader /> : null}
        {!isLoading && !hasScrollBar && !lastProduct && productList.length === maxItems && (
          <Button
            type="button"
            onClick={() =>
              setLastProduct(
                !lastProductInArray ? null : lastProductInArray.dateUpdated,
              )
            }
            style={{ marginTop: "20px" }}
          >
            Ver mais
          </Button>
        )}
      </Route>
      <Route path="/produtos/:fantasia/:supplierUid/novo">
        <ProductsNew />
      </Route>
      <Route path="/produtos/:fantasia/:supplierUid/:productId/editar">
        <ProductsEdit />
      </Route>
    </Switch>
  )
}

export default Productsv2
