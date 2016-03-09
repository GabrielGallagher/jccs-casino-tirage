$.fn.extend({
  animateCss: function (animationName) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    $(this).addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);
    });
  }
});


function animate(n, fn) {
  var $el = $('#winner');
  var id = setInterval(function () {
    var i = Math.floor(Math.random()*window.names.length);
    var name = window.names[i];
    $el.html(name);

    if (--n <= 0) {
      clearInterval(id);
      fn();
    }
  }, 100);
}

function draw() {
  console.log('# STARTING A DRAW #');

  // do nothing if there's no names
  if (!window.names || !window.names.length) {
    console.log('no names loaded');
    $('#winner').html('Aucune donnée');
    $('#start').text('Faites vos jeux');
    return;
  }

  // pick a random name
  var n = Math.floor(Math.random()*window.names.length);
  var name = window.names[n];

  // audit in the console
  console.log('names in the hat', window.names.length);
  console.log('picked number', n, '('+name+')');

  // show winner
  $('#winner').html(name);
  $('#winner').animateCss('bounce');
  $('#start').text('Rien ne va plus');

  // remove winner from names
  remove(name, window.names);
}

function remove(e, arr) {
    var found = arr.indexOf(e);
    arr.splice(found, 1);

    // while (found !== -1) {
    //     arr.splice(found, 1);
    //     found = arr.indexOf(e);
    // }
}

function flattenEntries(entries) {
  return entries.reduce(function (prev, entry) {
    for (var i = 0; i < entry.chances; i++)
      prev.push(entry.name);
    return prev;
  }, []);
}

function dataToEntry(raw) {
  return {
    name: raw['gsx$prenom']['$t'] + ' ' + raw['gsx$nom']['$t'],
    chances: raw['gsx$chances']['$t']
  };
}

function refresh() {
  $('#winner').text('Tirage');
  var source = 'https://spreadsheets.google.com/feeds/list/1j5rYcIyj-RzXd8JekdXUuve65LlrlEb4ypQx6X4zxzM/od6/public/values?alt=json-in-script&callback=?';

  $('#start').text('chargement ...');

  $.getJSON(source, function(data) {
    var entries = data.feed.entry.map(dataToEntry);
    window.names = flattenEntries(entries);
    $('#start').text('Faites vos jeux');
  });
}

$(function() {
  window.names = [];

  refresh();

  $('#start').on('click', function () {
    $('#start').text('wait for it...');
    $('#start').blur();
    animate(25, draw);
  });

  $('#refresh').on('click', function() {
    refresh();
  });
});


