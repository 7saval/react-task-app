import { FC } from 'react'
import { GrSubtract } from 'react-icons/gr'
import Task from '../Task/Task'
import ActionButton from '../ActionButton/ActionButton'
import { IList, ITask } from '../../types'
import { useTypeDispatch } from '../../hooks/redux'
import { deleteList, setModalActive } from '../../store/slices/boardsSlice'
import { addLog } from '../../store/slices/loggerSlice'
import {v4 as uuidv4 } from 'uuid';
import { setModalData } from '../../store/slices/modalSlice'
import { deleteButton, header, listWrapper, name } from './List.css'
import { Droppable } from '@hello-pangea/dnd'

type TListProps = {
  list : IList;
  boardId : string;
}

const List: FC<TListProps> = ({
  list,
  boardId
}) => {

  const dispatch = useTypeDispatch();
  const handleListDelete = (listId : string) => {
    dispatch(
      deleteList({
        boardId,
        listId
      })
    )

    dispatch(
      addLog({
        logId: uuidv4(),
        logMessage: `리스트 삭제 ${list.listName}`,
        logAuthor: 'admin',
        logTimestamp: new Date().toISOString()
      })
    )
  }

  const handleTaskChange = (
    boardId : string,
    listId : string,
    task : ITask
  ) => {
    dispatch(setModalData({boardId,listId,task}));
    dispatch(setModalActive(true));
  }

  return (
    <Droppable droppableId={list.listId}>
      {provided => (
        <div
          className={listWrapper}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div className={header}>
            <div className={name}>{list.listName}</div>
            <GrSubtract 
              className={deleteButton}
              onClick={()=> handleListDelete(list.listId)}
            />
          </div>
          {list.tasks.map((task, index) => (
            <div
              onClick={() => handleTaskChange(boardId, list.listId, task)}
              key={task.taskId}
            >
              <Task 
                index={index}
                id={task.taskId}
                boardId={boardId}
                taskName={task.taskName}
                taskDescription={task.taskDescription}
              />
            </div>
          ))}
        {provided.placeholder}
        <ActionButton 
          boardId={boardId} 
          listId={list.listId}
        />
      </div>
      )}
    </Droppable>
    
  )
}

export default List