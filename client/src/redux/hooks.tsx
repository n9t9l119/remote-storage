import {useDispatch, TypedUseSelectorHook, useSelector} from "react-redux";
import {MainDispatchType, MainStateType} from "./store";

export const useTypedDispatch = () => useDispatch<MainDispatchType>()
export const useTypedSelector: TypedUseSelectorHook<MainStateType> = useSelector