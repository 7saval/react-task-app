import React, { useRef, useState } from 'react'
import { useTypeDispatch, useTypedSelector } from '../../hooks/redux';
import SideForm from './SideForm/SideForm';
import { FiLogIn, FiPlusCircle } from 'react-icons/fi';
import { addButton, addSection, boardItem, boardItemActive, container, title } from './BoardList.css';
import clsx from 'clsx';
import { GoSignOut } from 'react-icons/go';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import app from '../../firebase';
import { clearUser, setUser } from '../../store/slices/userSlice';
import { useAuth } from '../../hooks/useAuth';
import { sign } from 'crypto';

type TBoardListProps = {
  activeBoardId : string;
  setActiveBoardId : React.Dispatch<React.SetStateAction<string>>
}
const BoardList = ({
    activeBoardId,
    setActiveBoardId
} : TBoardListProps) => {

  const dispatch = useTypeDispatch();
  const { boardArray } = useTypedSelector(state => state.boards);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // firebase 인증 모듈
  const auth= getAuth(app);
  const provider = new GoogleAuthProvider();

  const { isAuth } = useAuth();

  const hadleLogin = () => {
    // 로그인 인증 팝업
    signInWithPopup(auth, provider)
    .then((userCredential) => {
      console.log(userCredential);
      dispatch(
        setUser({
          email: userCredential.user.email,
          id: userCredential.user.uid
        })
      )
    })
    .catch((error) => {
      console.error(error);
    })
  }

  const handleSignOut = () => {
    signOut(auth)
    .then(() => {
      dispatch(
        clearUser()
      )
    })
    .catch((error) => {
      console.error(error);
    })
  }

  const handleClick = () => {
    setIsFormOpen(!isFormOpen);
    setTimeout(() => {
      inputRef.current?.focus();
    },0);
  }

  return (
    <div className={container}>
      <div className={title}>
        게시판:
      </div>
      {boardArray.map((board, index)=> (
        <div key={board.boardId}
          onClick={()=> setActiveBoardId(boardArray[index].boardId)}
          className={
            clsx(
              {
                [boardItemActive]:
                boardArray.findIndex(b => b.boardId === activeBoardId) === index,
              },
              {
                [boardItem]:
                boardArray.findIndex(b => b.boardId === activeBoardId) !== index,
              }
            )
          }
        >
          <div>
            {board.boardName}
          </div>
        </div>
      ))}
    <div className={addSection}>
      {
        isFormOpen ?
        <SideForm inputRef={inputRef} setIsFormOpen={setIsFormOpen} />
        : 
        <FiPlusCircle className={addButton} onClick={handleClick} />
      }

      {/* 로그인 버튼 보이기/숨기기 */}
      {isAuth 
        ?
        <GoSignOut className={addButton} onClick={handleSignOut} />
        :
        <FiLogIn className={addButton} onClick={hadleLogin}/>
      }
    </div>

    </div>
  )
}

export default BoardList
