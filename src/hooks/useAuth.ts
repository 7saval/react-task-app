import { useTypedSelector } from "./redux"

export function useAuth(){

    const {id, email}= useTypedSelector((state) => state.user);

    return {
        // ! : false, !! : true
        isAuth: !!email,
        id,
        email
    }
}