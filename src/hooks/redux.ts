import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";

export const useTypedSelector: TypedUseSelectorHook<RootState>  = useSelector
export const useTypeDispatch = () => useDispatch<AppDispatch>();

// // 타입스크립트 => 추론x => 개발자가 타입지정
// const logger = useTypedSelector((state) => state.logger);

// interface Obj<T>{
//     name: T;
// }

// interface State {
//     state: {
//         data: string,
//         loading: boolean
//     }
// }

// const obj: Obj<State> = {
//     name : {
//         state: {
//             data: 'abcd',
//             loading: false
//         }
//     }
// }
