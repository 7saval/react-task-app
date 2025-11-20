import { ChangeEvent, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { useTypeDispatch, useTypedSelector } from '../../hooks/redux'
import { deleteTask, setModalActive, updateTask } from '../../store/slices/boardsSlice';
import {v4 as uuidv4 } from 'uuid';
import { addLog } from '../../store/slices/loggerSlice';
import { buttons, closeButton, deleteButton, header, input, modalWindow, title, updateButton, wrapper } from './EditModal.css';

const EditModal = () => {

  const dispatch = useTypeDispatch();
  const editingState = useTypedSelector(state => state.modal);
  // state에 넣어주기
  const [data, setdata] = useState(editingState);

  const handleCloseButton = () => {
    dispatch(setModalActive(false));
  }

  const handleNameChange = (e:ChangeEvent<HTMLInputElement>) => {
    // 얕은 복사 : 주소값 복사. 원본도 수정
    // Object.assign(), 스프레드 연산자(...)등
    setdata({
      ...data,
      task: {
        ...data.task,
        taskName:e.target.value
      }
    })
  }

  const handleDescriptionChange = (e:ChangeEvent<HTMLInputElement>) => {
    setdata({
      ...data,
      task: {
        ...data.task,
        taskDescription:e.target.value
      }
    })
  }

  const handleAuthorChange = (e:ChangeEvent<HTMLInputElement>) => {
    setdata({
      ...data,
      task: {
        ...data.task,
        taskOwner:e.target.value
      }
    })
  }

  // 일 수정하기
  const handleUpdate = () => {
    // 일 수정하기
    dispatch(updateTask({
      boardId: editingState.boardId,
      listId: editingState.listId,
      task: data.task
    }));

    // 로그 남기기
    dispatch(
      addLog({
        logId: uuidv4(),
        logMessage: `일 수정하기: ${editingState.task.taskName}`,
        logAuthor: 'admin',
        logTimestamp: String(Date.now())
      })
    )

    // 모달창 닫기
    dispatch(setModalActive(false));
    
  }

  // 일 삭제하기
  const handleDelete = () => {
    dispatch(deleteTask({
      boardId: editingState.boardId,
      listId: editingState.listId,
      taskId: editingState.task.taskId
    }));

    dispatch(
      addLog({
        logId: uuidv4(),
        logMessage: `일 삭제하기: ${editingState.task.taskName}`,
        logAuthor: 'admin',
        logTimestamp: String(Date.now())
      })
    )

    dispatch(setModalActive(false));
  }


  return (
    <div className={wrapper}>
      <div className={modalWindow}>
        <div className={header}>
          {/* task 데이터 넣기 */}
          <div className={title}>{editingState.task.taskName}</div>
          <FiX className={closeButton} onClick={handleCloseButton} />
        </div>
        <div className={title}>제목</div>
        <input 
          className={input}
          type='text'
          value={data.task.taskName}
          onChange={handleNameChange}
        />
        <div className={title}>설명</div>
        <input 
          className={input}
          type='text'
          value={data.task.taskDescription}
          onChange={handleDescriptionChange}
        />
        <div className={title}>생성한 사람</div>
        <input 
          className={input}
          type='text'
          value={data.task.taskOwner}
          onChange={handleAuthorChange}
        />
        <div className={buttons}>
          <button onClick={handleUpdate} className={updateButton}>
            일 수정하기
          </button>
          <button onClick={handleDelete} className={deleteButton}>
            일 삭제하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditModal