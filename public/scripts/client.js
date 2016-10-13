$(function() {
  getBooks();

  $('#book-form').on('submit', addBook);

  $('#book-list').on('click', '.save', updateBook);
  $('#book-list').on('click', '.delete', deleteBook);
});

function getBooks() {
  $.ajax({
    type: 'GET',
    url: '/books',
    success: displayBooks
  });
}

function displayBooks(response) {
  console.log(response);
  var $list = $('#book-list');
  $list.empty();
  response.forEach(function(book) {
    var $li = $('<li></li>');
    var $form = $('<form></form>');
    $form.append('<input type="text" name="title" value="' + book.title + '"/>');
    $form.append('<input type="text" name="author" value="' + book.author + '"/>');
    var date = new Date(book.published);

    // surely there must be a better way to format this date
    $form.append('<input type="date" name="published" value="' + date.toISOString().slice(0,10) + '"/>');

    // make a button and store the id data on it
    var $saveButton = $('<button class="save">Save!</button>');
    $saveButton.data('id', book.id);
    $form.append($saveButton);

    var $deleteButton = $('<button class="delete">Delete!</button>');
    $deleteButton.data('id', book.id);
    $form.append($deleteButton);


    $li.append($form);
    $list.append($li);
  });
}

function addBook(event) {
  event.preventDefault();

  // title=someTitle&author=someAuthor&published=today
  var bookData = $(this).serialize();

  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookData,
    success: getBooks
  });

  $(this).find('input').val('');
}

function updateBook(event) {
  event.preventDefault();

  var $button = $(this);
  var $form = $button.closest('form');

  var data = $form.serialize();

  $.ajax({
    type: 'PUT',
    url: '/books/' + $button.data('id'),
    data: data,
    success: getBooks
  });
}

function deleteBook(event) {
  event.preventDefault();

  var bookId = $(this).data('id');

  $.ajax({
    type: 'DELETE',
    url: '/books/' + bookId,
    success: getBooks
  });
}
