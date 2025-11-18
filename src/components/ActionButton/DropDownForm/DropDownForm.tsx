import React, { FC, useState } from 'react'
import { FiX } from 'react-icons/fi';
import { useTypeDispatch } from '../../../hooks/redux';
import { addList, addTask } from '../../../store/slices/boardsSlice';
import {v4 as uuidv4 } from 'uuid';
import { addLog } from '../../../store/slices/loggerSlice';
import { button, buttons, input, listForm, taskForm, close } from './DropDownForm.css';

type TDropDownFormProps = {
  boardId : string;
  listId : string;
  setIsFormOpen : React.Dispatch<React.SetStateAction<boolean>>;
  list? : boolean;
}

const DropDownForm : FC<TDropDownFormProps> = ({
  boardId,
  listId,
  setIsFormOpen,
  list
}) => {
  const dispatch = useTypeDispatch();
  const [text, setText] = useState('');
  const formPlaceholder = list ? 
  "리스트의 제목을 입력하세요.":
  "일의 제목을 입력하세요.";

  const buttonTitle = list ?
  "리스트 추가하기":
  "일 추가하기";

  const handleTextChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }

  const handleButtonClick = () => {
    if(text){
      if(list){
        dispatch(
          addList({
            boardId,
            list: {listId: uuidv4(), 
                    listName: text, 
                    tasks: []
                  }
          })
        )

        dispatch(
          addLog({
            logId: uuidv4(),
            logMessage: `리스트 생성하기: ${text}`,
            logAuthor: 'admin',
            logTimestamp: String(Date.now())
          })
        )
      }
      else{
        dispatch(
          addTask({
            boardId,
            listId,
            task: {
              taskId: uuidv4(),
              taskName: text,
              taskDescription: '',
              taskOwner: 'admin'
            }
          })
        )

        dispatch(
          addLog({
            logId: uuidv4(),
            logMessage: `일 생성하기 : ${text}`,
            logAuthor: 'admin',
            logTimestamp: String(Date.now())
          })
        )
      }
    }
  }


  return (
    <div className={list ? listForm : taskForm}>
      <div>
        <textarea 
          className={input}
          value={text}
          onChange={handleTextChange}
          autoFocus
          placeholder={formPlaceholder}
          onBlur={()=> setIsFormOpen(false)}
        />
        <div className={buttons}>
          <button
            className={button}
            onMouseDown={handleButtonClick}>
            {buttonTitle}
          </button>
          <FiX className={close} />
        </div>
      </div>
    </div>
  )
}

export default DropDownForm