"use client";

import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import cartService from "@/lib/services/cartService";
import { useAuth } from "./AuthContext";

export const ShopContext = createContext();

const initialState = {
  cart: [],
  isCartOpen: false,
  isMenuOpen: false,
  isSearchOpen: false,
  searchQuery: "",
  favorites: [],
  isLoadingCart: false,
  isLoadingFavorites: false,
};

function shopReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id,
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? {
                  ...item,
                  quantity: item.quantity + (action.payload.quantity || 1),
                }
              : item,
          ),
        };
      }
      return {
        ...state,
        cart: [
          ...state.cart,
          { ...action.payload, quantity: action.payload.quantity || 1 },
        ],
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_CART_QUANTITY":
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };

    case "TOGGLE_CART":
      return { ...state, isCartOpen: !state.isCartOpen };

    case "OPEN_CART":
      return { ...state, isCartOpen: true };

    case "CLOSE_CART":
      return { ...state, isCartOpen: false };

    case "TOGGLE_MENU":
      return { ...state, isMenuOpen: !state.isMenuOpen };

    case "OPEN_MENU":
      return { ...state, isMenuOpen: true };

    case "CLOSE_MENU":
      return { ...state, isMenuOpen: false };

    case "TOGGLE_SEARCH":
      return { ...state, isSearchOpen: !state.isSearchOpen };

    case "OPEN_SEARCH":
      return { ...state, isSearchOpen: true };

    case "CLOSE_SEARCH":
      return { ...state, isSearchOpen: false };

    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };

    case "TOGGLE_FAVORITE": {
      const isFavorited = state.favorites.some((id) => id === action.payload);
      return {
        ...state,
        favorites: isFavorited
          ? state.favorites.filter((id) => id !== action.payload)
          : [...state.favorites, action.payload],
      };
    }

    case "CLEAR_CART":
      return { ...state, cart: [] };

    case "SET_CART":
      return { ...state, cart: action.payload };

    case "SET_FAVORITES":
      return { ...state, favorites: action.payload };

    case "SET_LOADING_CART":
      return { ...state, isLoadingCart: action.payload };

    case "SET_LOADING_FAVORITES":
      return { ...state, isLoadingFavorites: action.payload };

    default:
      return state;
  }
}

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(shopReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Load cart and favorites on mount or auth change
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated) {
        try {
          dispatch({ type: "SET_LOADING_CART", payload: true });
          const cartResponse = await cartService.getCart();
          dispatch({ type: "SET_CART", payload: cartResponse.items || [] });
        } catch (error) {
          console.log("[v0] Failed to load cart:", error.message);
        } finally {
          dispatch({ type: "SET_LOADING_CART", payload: false });
        }

        try {
          dispatch({ type: "SET_LOADING_FAVORITES", payload: true });
          const favoritesResponse = await cartService.getFavorites();
          dispatch({
            type: "SET_FAVORITES",
            payload: favoritesResponse.products?.map((p) => p._id) || [],
          });
        } catch (error) {
          console.log("[v0] Failed to load favorites:", error.message);
        } finally {
          dispatch({ type: "SET_LOADING_FAVORITES", payload: false });
        }
      }
    };

    loadUserData();
  }, [isAuthenticated]);

  const addToCart = useCallback(
    async (product, quantity = 1) => {
      if (isAuthenticated) {
        try {
          await cartService.addToCart(product._id || product.id, quantity);
        } catch (error) {
          console.error("[v0] Failed to add to cart:", error);
        }
      }
      dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity } });
    },
    [isAuthenticated],
  );

  const removeFromCart = useCallback(
    async (productId) => {
      if (isAuthenticated) {
        try {
          await cartService.removeFromCart(productId);
        } catch (error) {
          console.error("[v0] Failed to remove from cart:", error);
        }
      }
      dispatch({ type: "REMOVE_FROM_CART", payload: productId });
    },
    [isAuthenticated],
  );

  const updateCartQuantity = useCallback(
    async (productId, quantity) => {
      if (isAuthenticated) {
        try {
          await cartService.updateCartItem(productId, quantity);
        } catch (error) {
          console.error("[v0] Failed to update cart:", error);
        }
      }
      dispatch({
        type: "UPDATE_CART_QUANTITY",
        payload: { id: productId, quantity },
      });
    },
    [isAuthenticated],
  );

  const toggleCart = useCallback(() => {
    dispatch({ type: "TOGGLE_CART" });
  }, []);

  const openCart = useCallback(() => {
    dispatch({ type: "OPEN_CART" });
  }, []);

  const closeCart = useCallback(() => {
    dispatch({ type: "CLOSE_CART" });
  }, []);

  const toggleMenu = useCallback(() => {
    dispatch({ type: "TOGGLE_MENU" });
  }, []);

  const openMenu = useCallback(() => {
    dispatch({ type: "OPEN_MENU" });
  }, []);

  const closeMenu = useCallback(() => {
    dispatch({ type: "CLOSE_MENU" });
  }, []);

  const toggleSearch = useCallback(() => {
    dispatch({ type: "TOGGLE_SEARCH" });
  }, []);

  const openSearch = useCallback(() => {
    dispatch({ type: "OPEN_SEARCH" });
  }, []);

  const closeSearch = useCallback(() => {
    dispatch({ type: "CLOSE_SEARCH" });
  }, []);

  const setSearchQuery = useCallback((query) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  }, []);

  const toggleFavorite = useCallback(
    async (productId) => {
      if (isAuthenticated) {
        try {
          const isFavorite = state.favorites.includes(productId);
          if (isFavorite) {
            await cartService.removeFromFavorites(productId);
          } else {
            await cartService.addToFavorites(productId);
          }
        } catch (error) {
          console.error("[v0] Failed to toggle favorite:", error);
        }
      }
      dispatch({ type: "TOGGLE_FAVORITE", payload: productId });
    },
    [isAuthenticated, state.favorites],
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (error) {
        console.error("[v0] Failed to clear cart:", error);
      }
    }
    dispatch({ type: "CLEAR_CART" });
  }, [isAuthenticated]);

  const value = {
    // State
    cart: state.cart,
    isCartOpen: state.isCartOpen,
    isMenuOpen: state.isMenuOpen,
    isSearchOpen: state.isSearchOpen,
    searchQuery: state.searchQuery,
    favorites: state.favorites,
    isLoadingCart: state.isLoadingCart,
    isLoadingFavorites: state.isLoadingFavorites,

    // Cart actions
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,

    // UI actions
    toggleCart,
    openCart,
    closeCart,
    toggleMenu,
    openMenu,
    closeMenu,
    toggleSearch,
    openSearch,
    closeSearch,
    setSearchQuery,
    toggleFavorite,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = React.useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within ShopProvider");
  }
  return context;
}
