$('#title').html(decodeURIComponent($.url().param('title')));
$('#message').html(decodeURIComponent($.url().param('message')));
$('#avatar').attr('src', $.url().param('avatar'));
$('#color').addClass("color_" + $.url().param('color'));