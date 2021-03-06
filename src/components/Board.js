import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import './Board.css';
import Card from './Card';
import NewCardForm from './NewCardForm';

const generateCardComponents = (cards, deleteCard) => {
  return cards.map(card => {
    return (
      <Card key={ card.id } card={ card } deleteCard={ deleteCard } />
    )
  });
}

const Board = ({ boardName, url }) => {
  const [cards, setCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    axios.get(`${url}/boards/${boardName}/cards`)
      .then((response) => {
        const responseCards = response.data.map(({ card }) => card);
        setCards(responseCards);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        console.error(error.message);
      });
  }, []);

  const deleteCard = (cardId) => {
    axios.delete(`${url}/cards/${cardId}`).then(() => {
      // filter out deleted card
      setCards(cards.filter(card => cardId !== card.id))
    }).catch((error) => {
      console.error(error.message);
    })
  }

  const addCard = (cardFields) => {
    axios.post(`${url}/boards/${boardName}/cards`, cardFields).then(response => {
      // filter out deleted card
      setCards([ response.data.card, ...cards ]);
    }).catch((error) => {
      console.error(error.message);
    })
  }

  const cardComponents = generateCardComponents(cards, deleteCard);

  return (
    <div>
      <div>
        <NewCardForm addCard={ addCard }/>
      </div>
      <div>
        { errorMessage || cardComponents }
      </div>
    </div>
  )
};
Board.propTypes = {
  boardName: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default Board;
