import $ from "jquery";

let text = $('.header__todo-input');
let comment = $('.header__todo-comment');
let manager = {
  completed: 0,
  inWork: 1,
  delete: 0
};

$(document).ready(addClickToBlock);

$('.todo-list').on('click', '.todo-block__button_save-edit', function() {
  let edit = $(this).closest('.todo-list__todo-block').find('.todo-block__edit');
  let text = $(this).closest('.todo-list__todo-block').find('.todo-block__text');
  let buttonDone = $(this).closest('.todo-block__buttons').find('.todo-block__button_done');
  let buttonDel = $(this).closest('.todo-block__buttons').find('.todo-block__button_delete');
  let groupEdit = $(this).closest('.todo-block__buttons').find('.todo-block__edit-wrapper');
  let buttonCorrect = $(this).closest('.todo-block__buttons').find('.todo-block__button_correct');

  buttonCorrect.toggleClass('non-visible');
  groupEdit.toggleClass('non-visible');
  text.toggleClass('non-visible');
  edit.toggleClass('non-visible');
  text.html(edit.val());
  buttonDone.attr('disabled', null);
  buttonDel.attr('disabled', null);
});

$('.todo-list').on('click', '.todo-block__button_cancle-edit', function() {
  let edit = $(this).closest('.todo-list__todo-block').find('.todo-block__edit');
  let text = $(this).closest('.todo-list__todo-block').find('.todo-block__text');
  let buttonDone = $(this).closest('.todo-block__buttons').find('.todo-block__button_done');
  let buttonDel = $(this).closest('.todo-block__buttons').find('.todo-block__button_delete');
  let groupEdit = $(this).closest('.todo-block__buttons').find('.todo-block__edit-wrapper');
  let buttonCorrect = $(this).closest('.todo-block__buttons').find('.todo-block__button_correct');

  groupEdit.toggleClass('non-visible');
  text.toggleClass('non-visible');
  buttonCorrect.toggleClass('non-visible');
  edit.toggleClass('non-visible');
  buttonDone.attr('disabled', null);
  buttonDel.attr('disabled', null);
});

$('.todo-list').on('click', '.todo-block__button_correct', function() {
  let text = $(this).closest('.todo-list__todo-block').find('.todo-block__text');
  let edit = $(this).closest('.todo-list__todo-block').find('.todo-block__edit');
  let buttonDone = $(this).closest('.todo-block__buttons').find('.todo-block__button_done');
  let buttonDel = $(this).closest('.todo-block__buttons').find('.todo-block__button_delete');
  let groupEdit = $(this).closest('.todo-block__buttons').find('.todo-block__edit-wrapper');

  text.toggleClass('non-visible');
  edit.toggleClass('non-visible');
  $(this).toggleClass('non-visible');
  groupEdit.toggleClass('non-visible');
  edit.val(text.html());
  buttonDone.attr('disabled', '');
  buttonDel.attr('disabled', '');
});

function render(callback) {
  window.requestAnimationFrame(function() {
    window.requestAnimationFrame(function() {
      callback();
    });
  });
}

function addClickToBlock() {
  $('.todo-list').on('click', '.todo-block__button_delete', function() {
    let block = $(this).closest('.todo-block');

    let handler = function() {
      block.addClass('non-visible');
      block.remove();
      block.removeClass('fade-leave-active');
      block.removeClass('fade-leave-to');
      block.off('transitionend', handler);
    };

    block.addClass('fade-leave');

    render(function() {
      block.addClass('fade-leave-active');
      block.addClass('fade-leave-to');
      block.removeClass('fade-leave');
    });

    block.on('transitionend', handler);

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
    "class": "todo-block todo-list__todo-block"
  });

  blockReturn.html(`<span class="todo-block__title">${comment.val()}</span>
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
  </div>`);
  $('.todo-list').prepend(blockReturn);
  let handler = function() {
    blockReturn.removeClass('fade-enter-active');
    blockReturn.removeClass('fade-enter-to');
    blockReturn.off('transitionend', handler);
  };

  blockReturn.addClass('fade-enter');

  render(function() {
    blockReturn.addClass('fade-enter-active');
    blockReturn.addClass('fade-enter-to');
    blockReturn.removeClass('fade-enter');
  });

  blockReturn.on('transitionend', handler);


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
