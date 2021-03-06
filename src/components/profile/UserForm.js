import React, { useEffect, useState } from 'react';
import * as profileAPI from '../../lib/api/profile';
import { whiteLocations } from '../../constants/index';
import styled from 'styled-components';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import Comment from '../Comment';

const commentMap = {
  apartment: ' 아파트, 연립주택, 대세대주택, 기숙사',
  house: ' 단독주택, 다중주택, 다가구주택, 공관',
  etc: ' 오피스텔, 도시형생활주택, 주상복합',
};

const UserFormBlock = styled.div``;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  input + input {
    margin-left: 1rem;
  }
`;

const ButtonWithMarginTop = styled(Button)`
  margin-top: 3rem;
`;

const UserForm = ({ form, onChange, onChangeCheckbox, onSubmit }) => {
  console.log(form);
  return (
    <UserFormBlock>
      <form onSubmit={onSubmit}>
        <Row>
          <div>
            <p>나이</p>
            <Input
              name="age"
              type="number"
              textAlign="center"
              width="12rem"
              value={form.age}
              onChange={onChange}
            />
          </div>
          <div>
            <p>직업</p>
            <Input
              name="occupation"
              textAlign="center"
              width="16rem"
              value={form.occupation}
              onChange={onChange}
            />
          </div>
        </Row>
        <p>전화번호</p>
        <Input
          name="phoneNumber"
          textAlign="center"
          placeholder="숫자만 입력"
          value={form.phoneNumber}
          onChange={onChange}
        />
        <Comment>전화번호는 입양신청을 제외하고 공개되지 않습니다.</Comment>
        <Row>
          <div>
            <p>사는 곳</p>
            <Select
              name="location"
              width="7rem"
              onChange={onChange}
              value={form.location}
            >
              {whiteLocations.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <p>혼자 사는 중</p>
            <label>
              <Input
                name="liveAlone"
                type="checkbox"
                width="7rem"
                onChange={onChangeCheckbox}
                checked={form.liveAlone}
              />
              <span>#1인가구</span>
            </label>
          </div>
          <div>
            <p>반려동물 기르는 중</p>
            <label>
              <Input
                name="hasPet"
                type="checkbox"
                width="7rem"
                onChange={onChangeCheckbox}
                checked={form.hasPet}
              />
              <span>#보호자</span>
            </label>
          </div>
          <div>
            <p>반려동물 경험</p>
            <label>
              <Input
                name="experience"
                type="checkbox"
                width="7rem"
                onChange={onChangeCheckbox}
                checked={form.experience}
              />
              <span>#경험</span>
            </label>
          </div>
        </Row>
        <p>주거형태</p>
        <Row>
          <label>
            <Input
              type="radio"
              name="houseType"
              value="apartment"
              width="9rem"
              onChange={onChange}
              checked={form.houseType === 'apartment'}
            />
            <span>#공동주택</span>
          </label>
          <label>
            <Input
              type="radio"
              name="houseType"
              value="house"
              width="9rem"
              onChange={onChange}
              checked={form.houseType === 'house'}
            />
            <span>#단독주택</span>
          </label>
          <label>
            <Input
              type="radio"
              name="houseType"
              value="etc"
              width="9rem"
              onChange={onChange}
              checked={form.houseType === 'etc'}
            />
            <span>#비주택</span>
          </label>
        </Row>
        {form.houseType && <Comment>{commentMap[form.houseType]}</Comment>}
        <p>한줄소개</p>
        <Textarea
          name="description"
          onChange={onChange}
          value={form.description}
        />
        <ButtonWithMarginTop fullWidth>저장</ButtonWithMarginTop>
      </form>
    </UserFormBlock>
  );
};

export default UserForm;
