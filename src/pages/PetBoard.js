import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '../components/common/Button';
import Footer from '../components/Footer';
import HeaderContainer from '../containers/common/HeaderContainer';
import palette from '../lib/styles/palette';
import * as petAPI from '../lib/api/pet';
import { Tag, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {
  FaFacebookSquare,
  FaTwitterSquare,
  FaInstagramSquare,
} from 'react-icons/fa';

const genderMap = {
  MALE: '남아',
  FEMALE: '여아',
};

const PetBoardBlock = styled.div`
  background: white;

  .menu {
    position: fixed;
    top: 8rem;
    right: 0;
    left: 0;
    width: 80rem;
    margin: 0 auto;

    .box {
      float: right;
      height: 1rem;
      margin-right: 8rem;
      width: 21rem;

      .ant-tag {
        margin-top: 0.5rem;
      }
      .title {
        border-bottom: solid 0.25rem;
        padding: 1rem 0;
        font-size: 1.5rem;
        font-weight: 700;
      }
      .sub-title {
        margin-bottom: 0.5rem;
        border-bottom: solid 0.125rem ${palette.gray[4]};
        padding: 0.5rem 0;
        font-size: 1rem;
        font-weight: 500;
      }
      .tags {
        margin: 1.5rem 0;
        font-size: 1.125rem;
        font-weight: 500;
        color: ${palette.gray[6]};

        span + span {
          margin-left: 0.5rem;
        }
      }
      .price-area {
        font-family: Montserrat;
        font-size: 2rem;
        color: ${palette.sub};

        .price {
          font-weight: 500;
          font-size: 2.5rem;
          margin-right: 0.25rem;
        }
      }
      .btn-area {
        margin: 1rem 0;
        display: flex;
        justify-content: space-between;

        .btn {
          width: 48%;

          button {
            padding: 0.5rem 0;
            font-size: 1rem;
          }
        }
      }
      .share-area {
        a + a {
          margin-left: 0.25rem;
        }
      }
      .manager-area {
        overflow: scroll;
        height: 10rem;

        .user {
          height: 4rem;

          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;

          p {
            width: 12rem;
            margin: 0;
            font-size: 1rem;
            color: black;
          }
          .phone-number {
            font-size: 0.75rem;
          }
        }
        .user + .user {
          margin-top: 1rem;
        }
      }
    }
  }
  .context {
    width: 80rem;
    min-height: 50rem;
    margin: 0 auto;
    padding: 4rem 6rem;

    .wrapper {
      width: 42rem;

      img {
        width: 42rem;
        height: 42rem;
      }
      img + img {
        margin-top: 1rem;
      }
      p {
        border-bottom: solid 0.125rem ${palette.gray[4]};
        padding: 1rem 0;
        font-size: 1.5rem;
        font-weight: 500;
      }
      .description {
        font-size: 1.25rem;
      }
    }
  }
`;

function PetBoard({ match }) {
  const id = match.params.id;
  const [loading, setLoading] = useState(false);
  const [board, setBoard] = useState({
    id: null,
    manager: '',
    title: '.',
    credit: 0,
    zone: '태그',
    gender: '',
    year: 0,
    month: 0,
    petTitle: '',
    petAge: '',
    checkUpImage: '',
    lineAgeImage: '',
    hasNeutered: false,
    description: '반려동물 설명',
    boardImage1: '',
    boardImage2: '',
    boardImage3: '',
    closed: true,
  });
  const [applied, setApplied] = useState(false);
  const [applyList, setApplyList] = useState(null);

  async function setBoardAPI() {
    try {
      const response = await petAPI.getBoard({ id });
      setBoard(response.data.data);
    } catch (e) {
      console.log('불러오기 오류');
    }
  }
  const onClickApply = () => {
    async function callAPI() {
      try {
        await petAPI.applyBoard({ id });
        await message.info('신청이 취소되었습니다.', 1);
        const response = await petAPI.getApplyed({ id });
        setApplied(response.data.success);
      } catch (e) {
        console.log('신청취소 오류');
      }
    }
    callAPI();
  };
  const onClickAccept = (e) => {
    e.persist();
    async function callAPI() {
      try {
        setLoading(true);
        const nickname = e.target.name;
        await petAPI.acceptBoard({ id, nickname });
        await message.success('신청이 성공적으로 수락되었습니다!', 1);
        setLoading(false);
      } catch (e) {
        console.log('신청수락 오류');
      }
      setBoardAPI();
    }
    callAPI();
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
    async function callAPI() {
      setBoardAPI();
      try {
        const response = await petAPI.getApplyed({ id });
        setApplied(response.data.success);
      } catch (e) {
        console.log('불러오기 오류');
      }
      try {
        const response = await petAPI.getApplyList({ id });
        setApplyList(response.data.data.users);
      } catch (e) {
        setApplyList(null);
      }
    }
    callAPI();
  }, [id]);

  return (
    <PetBoardBlock>
      <HeaderContainer />
      <div className="menu">
        <div className="box">
          <div className="ant-tags">
            {board.closed ? (
              <Tag color="red">입양완료</Tag>
            ) : (
              <Tag color="blue">입양가능</Tag>
            )}
            {board.checkUpImage && <Tag color="green">건강검진</Tag>}
            {board.lineAgeImage && <Tag color="magenta">혈통서</Tag>}
          </div>
          <div className="title">{board.title}</div>
          <div className="tags">
            {[
              board.zone,
              board.gender && genderMap[board.gender],
              board.petTitle,
              board.petAge,
              board.hasNeutered && '중성화',
            ].map((i, index) => i && <span key={index}>#{i}</span>)}
          </div>
          <div className="price-area">
            <span className="price">{board.credit}</span>껌
          </div>
          {!board.closed && !applyList && (
            <div className="btn-area">
              <div className="btn">
                {applied ? (
                  <Button
                    fullWidth
                    background={palette.gray[6]}
                    onClick={onClickApply}
                  >
                    신청취소
                  </Button>
                ) : (
                  <Link to={`/pet/board/${board.id}/apply`}>
                    <Button fullWidth background="#8164ae">
                      신 청
                    </Button>
                  </Link>
                )}
              </div>
              <div className="btn">
                <Button fullWidth>관심글 등록</Button>
              </div>
            </div>
          )}
          <p className="sub-title">공유하기</p>
          <div className="share-area">
            <a href="http://www.facebook.com">
              <FaFacebookSquare size="3rem" color={palette.facebook} />
            </a>
            <a href="http://www.instagram.com">
              <FaInstagramSquare size="3rem" color={palette.instagram} />
            </a>
            <a href="http://www.twitter.com">
              <FaTwitterSquare size="3rem" color={palette.twitter} />
            </a>
          </div>
          {!board.closed && applyList && (
            <>
              <p className="sub-title">받은 신청</p>
              <div className="manager-area">
                {applyList.map((user) => (
                  <div className="user" key={user.id}>
                    <Avatar
                      shape="square"
                      size={4 * 16}
                      icon={<UserOutlined />}
                    />
                    <div>
                      <Link to={`/profile/user/${user.id}`}>
                        <p>{user.nickname}</p>
                      </Link>
                      <span className="phone-number">
                        전화번호 : {user.phoneNumber}
                      </span>
                    </div>
                    <div>
                      <Button
                        name={user.nickname}
                        fullWidth
                        onClick={onClickAccept}
                        loading={loading}
                      >
                        수락
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="context">
        <div className="wrapper">
          {[board.boardImage1, board.boardImage2, board.boardImage3].map(
            (i, index) => i && <img key={index} src={i} alt="board-img" />,
          )}
          <p>아이 설명</p>
          <div className="description">{board.description}</div>
          {board.checkUpImage && (
            <>
              <p>건강검진</p>
              <img src={board.checkUpImage} alt="check-up-img" />
            </>
          )}
          {board.lineAgeImage && (
            <>
              <p>혈통서</p>
              <img src={board.lineAgeImage} alt="line-age-img" />
            </>
          )}
        </div>
      </div>
      <Footer />
    </PetBoardBlock>
  );
}

export default PetBoard;
