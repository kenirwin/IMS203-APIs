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
    audio = '';
    audioUrl = null;
    $('.alert').hide();
    url = urls[dict] + word;
    let res = $.get(url, function (data) {
      if (
        JSON.parse(res.responseText)[0] &&
        JSON.parse(res.responseText)[0].shortdef
      ) {
        // console.log('before the hood');
        $('#under-the-hood')
          .text(JSON.stringify(JSON.parse(res.responseText), null, 2))
          .show();
        // console.log('after the hood');
        let json = JSON.parse(res.responseText)[0];
        // console.log('found:', json);
        let defs = json.shortdef;
        if (dict == 'eng') {
          lang = 'en';
          country = 'us';
        } else if (dict == 'spa') {
          lang = 'es';
          country = 'me';
        }
        try {
          pron = json.hwi.prs[0].sound.audio;
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
          if (audioUrl != null) {
            audio =
              '<audio controls><source src="' +
              audioUrl +
              '" type="audio/mpeg"></audio>';
          }
          //   console.log(defs);
          //   console.log(audioUrl);
        } catch (e) {
          //   console.log(e);
        }

        let defHtml = '';
        defs.forEach((def) => {
          defHtml += '<li>' + def + '</li>';
        });
        $('#' + dict + 'Term')
          .html(
            '<h2 class="defTerm">' +
              audio +
              word +
              '</h2><ol>' +
              defHtml +
              '</ol>'
          )
          .show();
      } else {
        console.log('not found in ', dict);
        $('#' + dict + 'Term')
          .html('<h2 class="defTerm">' + word + '</h2>' + 'Not found')
          .show();
      }
    });
  }
});
