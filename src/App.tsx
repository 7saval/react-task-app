import { useState } from 'react'
import { appContainer, board, buttons, deleteBoardButton, loggerButton } from './App.css'
import BoardList from './components/BoardList/BoardList'
import LIstsContainer from './components/ListsContainer/LIstsContainer';
import { useTypeDispatch, useTypedSelector } from './hooks/redux';
import EditModal from './components/EditModal/EditModal';
import LoggerModal from './components/LoggerModal/LoggerModal';
import { deleteBoard, sort } from './store/slices/boardsSlice';
import {v4 as uuidv4 } from 'uuid';
import { addLog } from './store/slices/loggerSlice';
import { DragDropContext } from '@hello-pangea/dnd';

function App() {
  const dispatch = useTypeDispatch();
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [activeBoardId, setActiveBoardId] = useState('board-0');
  
  const boards = useTypedSelector(state => state.boards.boardArray);
  const modalActive = useTypedSelector(state => state.boards.modalActive);
  
  const getActiveBoard = boards.filter(board => board.boardId === activeBoardId)[0];
  
  const lists = getActiveBoard?.lists;

  // 게시판 삭제하기
  const handleDeleteBoard = () => {
    if(boards.length > 1){
      dispatch(deleteBoard({boardId: getActiveBoard.boardId})); // 게시판 삭제

      // 로그 생성
      dispatch(
        addLog({
          logId: uuidv4(),
          logMessage: `게시판 지우기: ${getActiveBoard.boardName}`,
          logAuthor: 'admin',
          logTimestamp: String(Date.now())
        })
      );

      // 삭제 시 활성화 인덱스 변경
      const newIndexToSet = () => {
        // 삭제 인덱스 찾기
        const indexToBeDeleted = boards.findIndex(
                                  board => board.boardId === getActiveBoard.boardId
                                );
        // 삭제 인덱스가 0이면 그 다음, 아니면 그 전 인덱스 리턴
        return indexToBeDeleted === 0 ? indexToBeDeleted + 1 : indexToBeDeleted - 1;
      }

      // 활성화 아이디 셋팅
      setActiveBoardId(boards[newIndexToSet()].boardId);

    } else{
      alert('최소 게시판 개수는 한 개입니다.');
    }
  }

  const handleDragEnd = (result: any) => {
    console.log(result);
    const { destination, source, draggableId } = result;
    console.log('lists', lists);
    const sourceList = lists.filter(list => list.listId === source.droppableId)[0];
    console.log('sourceList', sourceList);
    // const destinationList = lists.filter(list => list.listId === destination.droppableId)[0];
    // if (!result.destination) return;
    dispatch(
      sort({
        boardIndex: boards.findIndex(board => board.boardId === activeBoardId),
        droppableIdStart: source.droppableId,
        droppableIdEnd: destination.droppableId,
        droppableIndexStart: source.index,
        droppableIndexEnd: destination.index,
        draggableId
      })
    )

    // 로그 생성
    dispatch(
      addLog({
        logId: uuidv4(),
        logMessage: `
        리스트 "${sourceList.listName}"에서
        리스트 "${lists.filter(list => list.listId === destination.droppableId)[0].listName}"으로 
        ${sourceList.tasks.filter(task => task.taskId === draggableId)[0].taskName}을 옮김.
        `,
        logAuthor: 'admin',
        logTimestamp: String(Date.now())
      })
    )
  }

  return (
    <div className={appContainer}>
      {isLoggerOpen ? <LoggerModal setIsLoggerOpen={setIsLoggerOpen} /> : null}
      {modalActive ? <EditModal /> : null}

      <BoardList 
        activeBoardId={activeBoardId} 
        setActiveBoardId={setActiveBoardId} 
        />
      <div className={board}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <LIstsContainer lists={lists} boardId={getActiveBoard.boardId} />
        </DragDropContext>
      </div>
      <div className={buttons}>
        <button className={deleteBoardButton} onClick={handleDeleteBoard}>
          이 게시판 삭제하기
        </button>
        <button className={loggerButton} onClick={() => setIsLoggerOpen(!isLoggerOpen)}>
          {isLoggerOpen ? "활동목록 숨기기" : "활동목록 보이기"}
        </button>
      </div>
    </div>
  )
}

export default App
