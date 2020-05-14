import $ from "jquery";
//const $ = require('jquery');

let text = $('.header__todo-input');
let comment = $('.header__todo-comment');
let manager = {
  completed: 0,
  inWork: 1,
  delete: 0
};

$(document).ready(addClickToBlock);

class Timer {
  constructor(timeFrom, el) {
    this.time = timeFrom;
    this.el = el;
    this.startDate = timeFrom;
    this.timerId = timeFrom;
  }

  tick() {
    this.time--;
  }

  moveToTop() {
    this.el.closest('.todo-block__header').find('.todo-block__paused').toggleClass('non-visible');
    this.el.html('Time is off');
    this.el.toggleClass('time-is-off');

    fadeOut(this.el.closest('.todo-list__todo-block'))
      .then((elem) => {
        return elem;
      })
      .then((elem) => {
        //elem.toggleClass('non-visible').appendTo($('.todo-list'));
        //fadeIn(elem);
      })
  }

  runTimer() {
    this.startDate = Date.now();
    this.timerId = setInterval(() => {
      this.tick();
      this.el.html(this.time);
      if (this.time == 59) {
        this.moveToTop();
        clearInterval(this.timerId);
      }
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.timerId);
  }

  returnTime() {
    return this.time;
  }
}

//А сделал тут промисы ддя того, что когда исчезает элемент в фйэдаут и срабатывает
//трансэнд - он сразу же срабатывает и на фэйдин
// фйэдаут -> асинхронно включает трансэнд и включаем классы по трансу (т.к. renderAnim асинхронная)
//Пока транс идет - ждем, как только заканчивается - убираем классы
//Тут же включает фэйдин свои классы и трансэнд и вот тут трансэнд срабатывает уже в фэйдин,
//т.к. работает присвоение класса и трансэнд асинхронно
//Что бы это избежать - включаю что бы трансэнд включился только после присвоения классов

// function fadeIn(el) {
//   return new Promise((resolve, rejected) => {
//     el.addClass('fade-enter');
//     renderAnim(function() {
//       el.addClass('fade-enter-active');
//       el.addClass('fade-enter-to');
//       el.removeClass('fade-enter');
//       resolve();
//     });
//   }).then(() => {
//     return new Promise((resolve, reject) => {
//       let handler = function() {
//         el.removeClass('fade-enter-active');
//         el.removeClass('fade-enter-to');
//         el.off('transitionend', handler);
//         resolve();
//       };
//       el.on('transitionend', handler)
//     })
//   });
// }

// function fadeOut(el) {
//   el.addClass('fade-leave');
//   return new Promise((resolve, reject) => {
//     renderAnim(function() {
//       el.addClass('fade-leave-active');
//       el.addClass('fade-leave-to');
//       el.removeClass('fade-leave');
//       resolve();
//     });
//   }).then(() => {
//     return new Promise((resolve, reject) => {
//       let handler = function(e) {
//         if (e.target == el[0]) {
//           el.addClass('non-visible');
//           el.removeClass('fade-leave-active');
//           el.removeClass('fade-leave-to');
//           el.off('transitionend', handler);
//           resolve(el.detach());
//         }
//       };
//       el.on('transitionend', handler);
//     })
//   })
// }

function fadeIn(el) {
  return new Promise((resolve, rejected) => {
    el.addClass('fade-enter');
    renderAnim(function() {
      console.log('in start');
      el.addClass('fade-enter-active');
      el.addClass('fade-enter-to');
      el.removeClass('fade-enter');
      resolve();
    });
  }).then(() => {
    let handler = function(e) {
      console.log('in trans end');
      el.removeClass('fade-enter-active');
      el.removeClass('fade-enter-to');
      el.off('transitionend', handler);

    };
    el.on('transitionend', handler)
  })
}


function fadeOut(el) {
  return new Promise((resolve, reject) => {
    el.addClass('fade-leave');
    renderAnim(function() {
      console.log('out start');
      el.addClass('fade-leave-active');
      el.addClass('fade-leave-to');
      el.removeClass('fade-leave');
      //resolve();
    })
    // }).then(() => {
    // return new Promise((resolve, reject) => {
    let handler = function(e) {
      if (e.target == el[0]) {
        console.log('out trans end');
        el.addClass('non-visible');
        el.removeClass('fade-leave-active');
        el.removeClass('fade-leave-to');
        el.off('transitionend', handler);
        resolve(el.detach());
      }
    };
    el.on('transitionend', handler);
  })
  //})
}


$('.todo-list').on('click', '.todo-block__button_save-edit', function() {
  renderButtons(this, {
    'changeEl': 'text',
    'blockValue': null
  });
});

$('.todo-list').on('click', '.todo-block__button_cancle-edit', function() {
  renderButtons(this, {
    'blockValue': null
  });
});

$('.todo-list').on('click', '.todo-block__button_correct', function() {
  renderButtons(this, {
    'changeEl': 'edit',
    'blockValue': ''
  });
});

$('.todo-list').on('click', '.todo-block__paused', function(e) {
  $(this).closest('.todo-block__header').find('.todo-block__paused-text').toggleClass('non-visible')
});

function renderAnim(callback) {
  window.requestAnimationFrame(function() {
    window.requestAnimationFrame(function() {
      callback();
    });
  });
}

function renderButtons(context, changeObj) {
  let editArea = $(context).closest('.todo-list__todo-block').find('.todo-block__edit');
  let textArea = $(context).closest('.todo-list__todo-block').find('.todo-block__text');
  $(context).closest('.todo-block__buttons').find('.todo-block__button_done').attr('disabled', changeObj.blockValue);
  $(context).closest('.todo-block__buttons').find('.todo-block__button_delete').attr('disabled', changeObj.blockValue);
  $(context).closest('.todo-block__buttons').find('.todo-block__edit-wrapper').toggleClass('non-visible');
  $(context).closest('.todo-block__buttons').find('.todo-block__button_correct').toggleClass('non-visible');

  editArea.toggleClass('non-visible');
  textArea.toggleClass('non-visible');

  if (changeObj.changeEl == 'edit') {
    editArea.val(textArea.html());
  } else if (changeObj.changeEl == 'text') {
    textArea.html(editArea.val());
  }
}

function addClickToBlock() {
  $('.header__todo-comment').val('fsdf');
  $('.header__todo-input').html('333');

  $('.todo-list').on('click', '.todo-block__button_delete', function() {

    fadeOut($(this).closest('.todo-block'));

    manager.inWork--;
    manager.delete++;
    renderManager();
  });

  $('.todo-list').on('click', '.todo-block__button_done', function(e) {
    $(this).closest('.todo-block').remove();
    manager.inWork--;
    manager.completed++;
    renderManager()
  });

};

$('.buttons__button_add').click(function() {
  if (text.val().replace(/ /g, "") == '') {
    alert('Введите текст!');
    return;
  }
  let blockReturn = $('<div></div>', {
    "class": "todo-block todo-list__todo-block card"
  });

  blockReturn.html(`<div class="todo-block__header card-header">
    <span class="todo-block__title">${comment.val()}</span>
    <span class="todo-block__timestamp">15:46 </span>
    <span class="todo-block__paused"><span class="todo-block__paused-text non-visible">Paused</span></span>
  </div>
  <div class="card-body">
  <p class="todo-block__text">${text.val()}</p>
  <textarea class="form-control non-visible todo-block__edit" aria-label="With textarea"></textarea>
  <div class="todo-block__buttons">
    <button type="button" class="btn btn-success todo-block__button todo-block__button_done">Выполнено</button>
    <button type="button" class="btn btn-danger todo-block__button todo-block__button_delete">Удалить</button>
    <button type="button" class="btn btn-warning todo-block__button todo-block__button_correct">Редактировать</button>
    <div class="todo-block__edit-wrapper non-visible">
      <div class="todo-block__edit-block">
        <button type="button" class="btn btn-success todo-block__edit-button todo-block__button_save-edit">Save</button>
        <button type="button" class="btn btn-danger todo-block__edit-button todo-block__button_cancle-edit">Cancle</button>
      </div>
    </div>
    </div>
  </div>`);

  $('.todo-list').prepend(blockReturn);

  let timer = new Timer(60, blockReturn.find('.todo-block__timestamp'));
  timer.runTimer();

  blockReturn.find('.todo-block__paused').on('click', function() {
    if (!$(this).find('.todo-block__paused-text').hasClass('non-visible')) {
      timer.runTimer();
    } else {
      timer.pauseTimer()
    }
  });

  fadeIn(blockReturn);

  text.val('');
  comment.val('');
  manager.inWork++;
  renderManager();
});
$('.buttons__button_clear').click(function() {
  text.val('');
  comment.val('');
});

function done() {
  this.closest('.todo-block').remove();
  manager.inWork--;
  manager.completed++;
  renderManager()
}

function del() {
  this.closest('.todo-block').remove();
  manager.inWork--;
  manager.delete++;
  renderManager()
}

function renderManager() {
  let template = `<li class="manager__item">
    В работе: ${manager.inWork}
  </li>
  <li class="manager__item">
    Выполненных: ${manager.completed};
  </li>
  <li class="manager__item">
    Удаленных: ${manager.delete};
  </li>`;
  $('.manager__menu').empty().append(template);
}
