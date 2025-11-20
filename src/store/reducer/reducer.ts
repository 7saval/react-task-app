import { boardsReducer } from "../slices/boardsSlice";
import { loggerReducer } from "../slices/loggerSlice";
import { ModalReducer } from "../slices/modalSlice";
import { userReducer } from "../slices/userSlice";

const reducer = {
    logger: loggerReducer,
    boards: boardsReducer,
    modal: ModalReducer,
    user: userReducer,
}

export default reducer;