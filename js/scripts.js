(function() {

  // Show game list
  window.onload = getGamesRequest;

   // Show Add Form
  document.querySelector('.add-game').onclick = function() {
    showAddForm();
  }

  // Add Game
  document.querySelector('form[name="add-game"]').onsubmit = function(event) {
    event.preventDefault();
    addGameRequest();
    hidePopup();
  }

  // Close Add Form
  document.querySelector('form[name="add-game"] .cancel').onclick = function(event) {
    event.preventDefault();
    hidePopup();
  }

  // Edit Game
  document.querySelector('form[name="edit-game"]').onsubmit = function(event) {
    event.preventDefault();
    editGameRequest();
    hidePopup();
  }

  // Close Edit Form
  document.querySelector('form[name="edit-game"] .cancel').onclick = function(event) {
    event.preventDefault();
    hidePopup();
  }

  // Vote Game
  document.querySelector('form[name="vote-game"]').onsubmit = function(event) {
    event.preventDefault();
    voteGameRequest();
    hidePopup();
  }

  // Close Vote Form
  document.querySelector('form[name="vote-game"] .cancel').onclick = function(event) {
    event.preventDefault();
    hidePopup();
  }

/*************************************** Create Game **********************************************/
  
  // Get game list request
  function getGamesRequest() {
    var xhr = new XMLHttpRequest();
    var url = 'api/database.json';

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send();

    xhr.onload = function () {
      const games = JSON.parse(xhr.responseText);

      renderGameList(games);
      addDeleteBtnClickEvent();
      addEditBtnClickEvent();
      addVoteBtnClickEvent()
    }
    xhr.onerror = function () {
      alert('Что-то пошло не так');
    }
  }

  // Game Template
  function gameStringTemplate(game) {
    return `
      <article class="game">
        <h1 class="game-id">${game.id}</h1>
        <div class="game-rating">
           <span><i class="fa fa-star-o" aria-hidden="true"></i> - <span>` + (game.rating ? `${game.rating.toFixed(1)}` : 0) + `</span></span>
           <a href="#" class="vote-game">Оставить голос</a>
           <span><i class="fa fa-user-o" aria-hidden="true"></i> - <span>${game.votes}</span></span>
        </div>
        <figure class="game-image">
          <img src="` + (game.src ? `${game.src}` : 'images/game-default.png') + `" alt="">
        </figure>
        <div class="game-info">
          <h2 class="title">${game.title}</h2>
          <p class="price"><span>${game.price}</span> руб.</p>
          <p class="platform">${game.platform}</p>
        </div>
        <div class="actions">
          <button class="btn edit">Изменить</button>
          <button class="btn delete">Удалить</button>
        </div>
      </article>
    `;
  }

  // Render Game List
  function renderGameList(games) {
    document.querySelector('.games').innerHTML =
      games.reduce(function(html, game) {
        html += gameStringTemplate(game);
        return html;
    }, '');
  }

/*************************************** Add Game *************************************************/

  // Add game request
  function addGameRequest() {
    var gameTitle = document.querySelector('input[name="title"]');
    var gamePrice = document.querySelector('input[name="price"]');
    var gamePlatform = document.querySelector('input[name="platform"]');

    var xhr = new XMLHttpRequest();
    var url = 'api/add.php';
    var params = 'title=' + gameTitle.value + '&price=' + gamePrice.value + '&platform=' + JSON.stringify
    (gamePlatform.value.split());

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);

    xhr.onload = function() {
      getGamesRequest();

      if (JSON.parse(xhr.responseText).status === 'ok') {
        showMessage('success', 'Игра успешно добавлена!');
      } else {
        showMessage('error', 'Что-то пошло не так :(');
      }

      setTimeout(hidePopup, 1500);
    }
    xhr.onerror = function() {
      showMessage('error', 'Что-то пошло не так');
      setTimeout(hidePopup, 1500);
    }
  }

  function showAddForm() {
    document.body.classList.add('no-scroll');
    document.querySelector('.form-holder.add').classList.remove('hidden');
  }


/*************************************** Update Game **********************************************/

  //Edit game request
  function editGameRequest() {
    var gameId = parseInt(document.querySelector('.edit-id').textContent, 10);
    var gameTitle = document.querySelector('input[name="edit-title"]');
    var gamePrice = parseInt(document.querySelector('input[name="edit-price"]').value, 10);
    var gamePlatform = document.querySelector('input[name="edit-platform"]');

    var xhr = new XMLHttpRequest();
    var url = 'api/edit.php';
    var params = 'id=' + gameId + '&title=' + gameTitle.value + '&price=' + gamePrice + '&platform=' + JSON.stringify
    (gamePlatform.value.split());

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);

    xhr.onload = function() {
      getGamesRequest();

      if (JSON.parse(xhr.responseText).status === 'ok') {
        showMessage('success', 'Игра успешно изменена!');
      } else {
        showMessage('error', 'Что-то пошло не так :(');
      }

      setTimeout(hidePopup, 1500);
    }
    xhr.onerror = function() {
      showMessage('error', 'Что-то пошло не так');
      setTimeout(hidePopup, 1500);
    }
  }

  // Edit Game
  function addEditBtnClickEvent() {
    var editBtns = document.querySelectorAll('.edit');

    function onEditBtnClick() {
      var game = this.closest('.game');

      document.querySelector('.edit-id').innerText = game.children[0].textContent;
      document.querySelector('input[name="edit-title"]').value = game.children[3].children[0].textContent;
      document.querySelector('input[name="edit-price"]').value = game.children[3].children[1].children[0].textContent;
      document.querySelector('input[name="edit-platform"]').value = game.children[3].children[2].textContent;

      showEditForm();
    }

    for (var i = 0; i < editBtns.length; i++) {
      editBtns[i].onclick = onEditBtnClick; 
    }
  }

  function showEditForm() {
    document.body.classList.add('no-scroll');
    document.querySelector('.form-holder.edit').classList.remove('hidden');
  }


  /*************************************** Delete Game ********************************************/

  // Delete game request
  function deleteGameRequest(gameId) {
    var xhr = new XMLHttpRequest();
    var url = 'api/delete.php';
    var params = 'id=' + gameId;

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);

    xhr.onload = function() {   
      getGamesRequest();

      if (JSON.parse(xhr.responseText).status === 'ok') {
        showMessage('success', 'Игра успешно удалена!');
      } else {
        showMessage('error', 'Что-то пошло не так :(');
      }

      setTimeout(hidePopup, 1500);
    }
    xhr.onerror = function() {
      showMessage('error', 'Что-то пошло не так');
      setTimeout(hidePopup, 1500);
    }
  }

  // Delete Game
  function addDeleteBtnClickEvent() {
    var deleteBtns = document.querySelectorAll('.delete');

    function onDeleteBtnClick() {
      var gameId = this.closest('.game').firstElementChild.innerText;
      confirmDeleteGame(gameId);
    }

    for (var i = 0; i < deleteBtns.length; i++) {
      deleteBtns[i].onclick = onDeleteBtnClick;
    }
  }

  // Confirm Delete Game
  function confirmDeleteGame(gameId) {
    document.querySelector('.confirm-delete').classList.remove('hidden');
    document.querySelector('.confirm-delete .ok').onclick = function() {
      deleteGameRequest(gameId);
      hidePopup();
    };
    document.querySelector('.confirm-delete .cancel').onclick = function() {
      hidePopup();
    };
  }
  

  /*************************************** Vote Game **********************************************/

  // Vote request
  function voteGameRequest() {
    var gameId = parseInt(document.querySelector('.vote-id').textContent, 10);
    var gameRating = parseInt(document.querySelector('input[name="r1"]:checked').value, 10);

    var xhr = new XMLHttpRequest();
    var url = 'api/vote.php';
    var params = 'id=' + gameId + '&rating=' + gameRating;

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);

    xhr.onload = function() {
      getGamesRequest();

      if (JSON.parse(xhr.responseText).status === 'ok') {
        showMessage('success', 'Спасибо за вашу оценку!');
      } else {
        showMessage('error', 'Что-то пошло не так :(');
      }

      setTimeout(hidePopup, 1500);
    }
    xhr.onerror = function() {
      showMessage('error', 'Что-то пошло не так');
      setTimeout(hidePopup, 1500);
    }
  }

  // Vote Game Click Event
  function addVoteBtnClickEvent() {
    var voteBtns = document.querySelectorAll('.vote-game');

    function onVoteBtnClick() {
      event.preventDefault();

      var game = this.closest('.game');

      document.querySelector('.vote-id').innerText = game.children[0].textContent;
      document.querySelector('.game-title').innerText = game.children[3].children[0].textContent;

      showVoteForm();
    }

    for (var i = 0; i < voteBtns.length; i++) {
      voteBtns[i].onclick = onVoteBtnClick;
    }
  }

  function showVoteForm() {
    document.body.classList.add('no-scroll');
    document.querySelector('.form-holder.vote').classList.remove('hidden');
  }

  /*************************************** Other **************************************************/

  function showMessage(messageClass, message) {
    document.body.classList.add('no-scroll');
    document.querySelector('.form-status').classList.remove('hidden');
    document.querySelector('.form-status h2').classList.add(messageClass);
    document.querySelector('.form-status h2').textContent = message;
  }

  function hidePopup() {
    var popups = document.querySelectorAll('.popup');

    document.body.classList.remove('no-scroll');

    for (var i = 0; i < popups.length; i++) {
      popups[i].classList.add('hidden');
    }
    
  }
     
}) ();