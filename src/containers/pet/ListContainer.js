import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import List from '../../components/pet/List';
import throttle from '../../lib/throttle';
import { changeField } from '../../modules/pet';
import { initBoards, searchBoards } from '../../modules/pet';

function ListContainer() {
  const dispatch = useDispatch();
  const { searchForm, boards, boardsLength } = useSelector(({ pet }) => ({
    searchForm: pet.searchForm,
    boards: pet.boards,
    boardsLength: pet.boardsLength,
  }));
  const loading = useSelector(({ loading }) => loading);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    return () => {
      dispatch(initBoards());
      dispatch(
        changeField({
          form: 'searchForm',
          key: 'page',
          value: 0,
        }),
      );
    };
  }, [dispatch]);

  useEffect(() => {
    const onScroll = () => {
      if (
        !searchForm.done &&
        window.scrollY + document.documentElement.clientHeight >
          document.documentElement.scrollHeight - 400
      ) {
        dispatch(searchBoards(searchForm));
      }
    };
    const onScrollThrottle = throttle(onScroll, 100);

    window.addEventListener('scroll', onScrollThrottle);
    return () => {
      window.removeEventListener('scroll', onScrollThrottle);
    };
  }, [dispatch, searchForm]);

  return <List boards={boards} loading={loading} />;
}

export default ListContainer;
