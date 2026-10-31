"use client";
import React, { createContext, useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IStateStore } from "@/src/utils/istate_store";
import INavigator from "@/src/utils/inavigator";

import { ProductStore } from "./store";
import { ProductController } from "./controller";
import { ProductState } from "./state";
import { IProductClient } from "@repo/product/client/iclient";
import ProductFetchClient from "@repo/product/client/fetch_impl";

const ProductContext = createContext<{
  store: ProductStore;
  controller: ProductController;
} | null>(null);

interface ProductContextProps {
  children: React.ReactNode;
  initState: ProductState;
}

export function ProductContextProvider(props: ProductContextProps) {
  const router = useRouter();
  const [state, setState] = useState<ProductState>(props.initState);

  // 1. Keep a ref that always points to the latest state
  const stateRef = useRef(state);
  stateRef.current = state;

  const controllerRef = useRef<ProductController | null>(null);
  const storeRef = useRef<ProductStore | null>(null);

  if (!controllerRef.current || !storeRef.current) {
    // 2. Pass a dynamic getState that reads from stateRef.current
    const statestore: IStateStore<ProductState> = {
      getState: () => stateRef.current,
      setState: setState,
    };

    const navigator: INavigator = {
      push: (url: string) => router.push(url),
      refresh: () => router.refresh(),
    };
    const client: IProductClient = new ProductFetchClient("");
    storeRef.current = new ProductStore(statestore);

    controllerRef.current = new ProductController(
      storeRef.current,
      navigator,
      client
    );
  }

  const controller = controllerRef.current;
  const store = storeRef.current;

  return (
    <ProductContext.Provider value={{ store, controller }}>
      {props.children}
    </ProductContext.Provider>
  );
}

export function useProductStore(): ProductStore {
  const context = useContext(ProductContext);
  if (!context) throw new Error("Product Context Missing");
  return context.store;
}
export function useProductController(): ProductController {
  const context = useContext(ProductContext);
  if (!context) throw new Error("Product Context Missing");
  return context.controller;
}
