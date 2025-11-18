import React, { ChangeEvent, FC, useRef, useState } from 'react'
import { FiCheck } from 'react-icons/fi';
import { icon, sideForm, input } from './SideForm.css';
import { useTypeDispatch } from '../../../hooks/redux';
import { addBoard } from '../../../store/slices/boardsSlice';
import {v4 as uuidv4 } from 'uuid';
import { addLog } from '../../../store/slices/loggerSlice';

type TSideFormProps = {
  setIsFormOpen : React.Dispatch<React.SetStateAction<boolean>>,
  inputRef : React.RefObject<HTMLInputElement>
}

const SideForm: FC<TSideFormProps> = ({
  setIsFormOpen,
  inputRef
}) => {

  const [inputText, setinputText] = useState('');
  const dispatch = useTypeDispatch();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setinputText(e.target.value);
  }
  const handleOnBlur = () => {
    setIsFormOpen(false);
  }

  const handleClick = () => {
    if(inputText){
      dispatch(
        addBoard({
          board: {
            boardId: uuidv4(), 
            boardName: inputText,
            lists: []
          }
        })
      )

      dispatch(
        addLog({
          logId: uuidv4(),
          logMessage: `게시판 등록 ${inputText}`,
          logAuthor: 'admin',
          logTimestamp: new Date().toISOString()
        })
      )
    }
  }

  return (
    <div className={sideForm}>
      <input 
        // ref={inputRef}
        autoFocus
        className={input}
        type='text'
        placeholder='새로운 게시판 등록하기'
        value={inputText}
        onChange={handleChange}
        onBlur={handleOnBlur}
      />
      <FiCheck className={icon} onMouseDown={handleClick}/>
    </div>
  )
}

export default SideForm