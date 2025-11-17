import { boardsReducer } from "../slices/boardsSlice";
import { loggerReducer } from "../slices/loggerSlice";
import { ModalReducer } from "../slices/modalSlice";

const reducer = {
    logger: loggerReducer,
    boards: boardsReducer,
    modal: ModalReducer
}

export default reducer;