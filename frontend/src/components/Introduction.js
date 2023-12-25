import React, { useState, useEffect } from 'react';
import Hammer from 'hammerjs';
import './Introduction.css';

const Introduction = () => {
  const [userQuery, setUserQuery] = useState('');
  const [data, setData] = useState([]);
  const backendURL = 'http://192.168.50.111:8000/search';

  useEffect(() => {
    // Attach listeners to the buttons
    const nopeButton = document.getElementById('nope');
    const loveButton = document.getElementById('love');
    nopeButton.addEventListener('click', createButtonListener(false));
    loveButton.addEventListener('click', createButtonListener(true));

    return () => {
      // Cleanup listeners
      nopeButton.removeEventListener('click', createButtonListener(false));
      loveButton.removeEventListener('click', createButtonListener(true));
    };
  }, []);

  useEffect(() => {
    // Initialize Hammer.js on all cards
    data.forEach((bill, index) => {
      const card = document.querySelector(`.congress--card[data-index="${index}"]`);
      if (card) {
        initHammer(card);
      }
    });
  }, [data]);

  const sendQueryToBackend = (query) => {
    const fullURL = `${backendURL}?query=${encodeURIComponent(query)}`;
    fetch(fullURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error('Network error:', error);
      });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    sendQueryToBackend(userQuery);
  };

  const initHammer = (element) => {
    const hammertime = new Hammer(element);
    hammertime.on('pan', (event) => handlePan(event, element));
    hammertime.on('panend', (event) => handlePanEnd(event, element));
  };

  const handlePan = (event, element) => {
    element.classList.add('moving');
    if (event.deltaX === 0) return;
    if (event.center.x === 0 && event.center.y === 0) return;

    const congressContainer = document.querySelector('.congress');
    congressContainer.classList.toggle('congress_love', event.deltaX > 0);
    congressContainer.classList.toggle('congress_nope', event.deltaX < 0);

    var xMulti = event.deltaX * 0.03;
    var yMulti = event.deltaY / 80;
    var rotate = xMulti * yMulti;

    element.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
  };

  const handlePanEnd = (event, element) => {
    const congressContainer = document.querySelector('.congress');
    element.classList.remove('moving');
    congressContainer.classList.remove('congress_love');
    congressContainer.classList.remove('congress_nope');

    var moveOutWidth = document.body.clientWidth;
    var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

    element.classList.toggle('removed', !keep);

    if (keep) {
      element.style.transform = '';
    } else {
      var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
      var toX = event.deltaX > 0 ? endX : -endX;
      var endY = Math.abs(event.velocityY) * moveOutWidth;
      var toY = event.deltaY > 0 ? endY : -endY;
      var xMulti = event.deltaX * 0.03;
      var yMulti = event.deltaY / 80;
      var rotate = xMulti * yMulti;

      element.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
    }
  };

  const createButtonListener = (love) => {
    return (event) => {
      const cards = document.querySelectorAll('.congress--card:not(.removed)');
      var moveOutWidth = document.body.clientWidth * 1.5;

      if (!cards.length) return false;

      var card = cards[0];

      card.classList.add('removed');

      if (love) {
        card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
      } else {
        card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
      }

      initCards();

      event.preventDefault();
    };
  };

  const initCards = () => {
    const newCards = document.querySelectorAll('.congress--card:not(.removed)');

    newCards.forEach(function (card, index) {
      card.style.zIndex = newCards.length - index;
      card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
      card.style.opacity = (10 - index) / 10;
    });

    const congressContainer = document.querySelector('.congress');
    congressContainer.classList.add('loaded');
  };

  return (
    <div className="congress">
      <form id="queryForm" onSubmit={handleFormSubmit}>
        <input
          type="text"
          id="userQuery"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="congress--cards">
        {data.map((bill, index) => (
          <div className="congress--card" key={index} data-index={index}>
            <img src="https://picsum.photos/600/300" alt="" />
            <h3 className="sponsor-name">{bill.sponsor_name || 'Unknown Sponsor'}</h3>
            <p className="bill-id">{bill.bill_id || 'No Bill ID'}</p>
            <p className="title">{bill.title || 'No Title Available'}</p>
          </div>
        ))}
      </div>

      <button id="nope">Nope</button>
      <button id="love">Love</button>
    </div>
  );
};

export default Introduction;

