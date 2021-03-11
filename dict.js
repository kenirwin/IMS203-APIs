const urls = {
  eng: 'https://kenirwin.net/dev/apiClass/dict.php?engl=',
  spa: 'https://kenirwin.net/dev/apiClass/dict.php?span=',
};

$(document).ready(function () {
  $('.citation').attr('target', '_blank');

  $('#engLookup').click(function () {
    let selected = getSelected();
    console.log(selected);
    Lookup(selected, 'eng');
  });

  $('#spaLookup').click(function () {
    let selected = getSelected();
    console.log(selected);
    Lookup(selected, 'spa');
  });

  function getSelected() {
    var text = '';
    if (window.getSelection) {
      text = window.getSelection().toString();
    }
    return text;
  }

  function Lookup(word, dict) {
    url = urls[dict] + word;

    console.log(url);
    let res = $.get(url, function (data) {
      let defs = JSON.parse(res.responseText)[0].shortdef;
      if (dict == 'eng') {
        lang = 'en';
        country = 'us';
        pron = JSON.parse(res.responseText)[0].hwi.prs[0].sound.audio;
      } else if (dict == 'spa') {
        lang = 'es';
        country = 'me';
        pron = JSON.parse(res.responseText)[0].hwi.prs[0].sound.audio;
      }

      letter = pron.substring(0, 1);

      audioUrl =
        'https://media.merriam-webster.com/audio/prons/' +
        lang +
        '/' +
        country +
        '/mp3/' +
        letter +
        '/' +
        pron +
        '.mp3';
      audio =
        '<audio controls><source src="' +
        audioUrl +
        '" type="audio/mpeg"></audio>';
      console.log(defs);
      console.log(audioUrl);
      let defHtml = '';
      defs.forEach((def) => {
        defHtml += '<li>' + def + '</li>';
      });
      $('.alert').hide();
      $('#' + dict + 'Term')
        .html(
          '<h2 class="defTerm">' +
            word +
            '</h2><ol>' +
            defHtml +
            '</ol>' +
            audio
        )
        .show();
    });
  }
});
