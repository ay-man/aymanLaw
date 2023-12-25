import React, { useState, useEffect } from 'react';
import Hammer from 'hammerjs';
import './Introduction.css';

const Introduction = () => {
    const [userQuery, setUserQuery] = useState('');
    const backendURL = 'http://192.168.50.111:8000/search';
    const congressContainer = document.querySelector('.congress');

    useEffect(() => {
        initCards();
        // Attach event listeners to the buttons
        const nopeButton = document.getElementById('nope');
        const loveButton = document.getElementById('love');

        if (nopeButton && loveButton) {
            nopeButton.addEventListener('click', createButtonListener(false));
            loveButton.addEventListener('click', createButtonListener(true));
        }

        return () => {
            // Cleanup event listeners
            if (nopeButton && loveButton) {
                nopeButton.removeEventListener('click', createButtonListener(false));
                loveButton.removeEventListener('click', createButtonListener(true));
            }
        };
    }, []);

    const sendQueryToBackend = (query) => {
        const fullURL = `${backendURL}?query=${encodeURIComponent(query)}`;
        fetch(fullURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                displayResponse(data);
            })
            .catch(error => {
                console.error('Network error:', error);
            });
    };

    const displayResponse = (data) => {
        const cardsContainer = document.querySelector('.card-list');
        cardsContainer.innerHTML = ''; // Clear existing cards

        data.forEach(bill => {
            const card = document.createElement('article');
            card.className = 'card';

            const header = document.createElement('header');
            header.className = 'card-header';
            card.appendChild(header);

            const billDate = document.createElement('p');
            billDate.className = 'bill-date';
            billDate.textContent = bill.introduced_date || 'No Date Available';
            header.appendChild(billDate);

            const billId = document.createElement('h2');
            billId.className = 'bill-id';
            billId.textContent = bill.bill_id || 'No Bill ID';
            header.appendChild(billId);

            const sponsor = document.createElement('p');
            sponsor.className = 'card-sponsor';
            sponsor.textContent = `${bill.sponsor_title || ''} ${bill.sponsor_name || 'Unknown Sponsor'} from ${bill.sponsor_state || ''} [${bill.sponsor_party || ''}]`;
            card.appendChild(sponsor);

            const title = document.createElement('p');
            title.className = 'title';
            title.textContent = bill.title || 'No Title Available';
            card.appendChild(title);

            const summary = document.createElement('p');
            summary.className = 'summary';
            summary.textContent = bill.summary || 'No summary available';
            card.appendChild(summary);

            const latestAction = document.createElement('p');
            latestAction.className = 'latest-action';
            latestAction.textContent = `Latest action: ${bill.latest_major_action || 'None'}`;
            card.appendChild(latestAction);

            cardsContainer.appendChild(card);

            // Initialize Hammer.js on the new card
            let hammertime = new Hammer(card);

            hammertime.on('pan', function (event) {
                card.classList.add('moving');
                if (event.deltaX === 0) return;
                if (event.center.x === 0 && event.center.y === 0) return;

                congressContainer && congressContainer.classList.toggle('congress_love', event.deltaX > 0);
                congressContainer && congressContainer.classList.toggle('congress_nope', event.deltaX < 0);

                var xMulti = event.deltaX * 0.03;
                var yMulti = event.deltaY / 80;
                var rotate = xMulti * yMulti;

                card.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
            });

            hammertime.on('panend', function (event) {
                card.classList.remove('moving');
                congressContainer && congressContainer.classList.remove('congress_love');
                congressContainer && congressContainer.classList.remove('congress_nope');

                var moveOutWidth = document.body.clientWidth;
                var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

                card.classList.toggle('removed', !keep);

                if (keep) {
                    card.style.transform = '';
                } else {
                    var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
                    var toX = event.deltaX > 0 ? endX : -endX;
                    var endY = Math.abs(event.velocityY) * moveOutWidth;
                    var toY = event.deltaY > 0 ? endY : -endY;
                    var xMulti = event.deltaX * 0.03;
                    var yMulti = event.deltaY / 80;
                    var rotate = xMulti * yMulti;

                    card.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
                }
            });
        });
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        sendQueryToBackend(userQuery);
    };

    const initCards = () => {
        var newCards = document.querySelectorAll('.congress--card:not(.removed)');

        newCards.forEach(function (card, index) {
            card.style.zIndex = newCards.length - index;
            card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
            card.style.opacity = (10 - index) / 10;
        });

        congressContainer && congressContainer.classList.add('loaded');
    };

    const createButtonListener = (loveIndicator) => {
        return function (event) {
            var cards = document.querySelectorAll('.congress--card:not(.removed)');
            var moveOutWidth = document.body.clientWidth * 1.5;

            if (!cards.length) return false;

            var card = cards[0];

            card.classList.add('removed');

            if (loveIndicator) {
                card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
            } else {
                card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
            }

            initCards();

            event.preventDefault();
        };
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

            <div className="card-list">
                {/* Cards will be added here by displayResponse() */}
            </div>

            <button id="nope">Nope</button>
            <button id="love">Love</button>
        </div>
    );
};

export default Introduction;

