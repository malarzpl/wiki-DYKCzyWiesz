
// DEBUG: po wpisaniu w konsoli "DYKnomination.debug()" skrypt uruchomi się
// w trybie debug, tzn. aktulane info pokażą się w konsoli JS a zgłoszenie
// pójdzie nie na stronę [[Wikiprojekt:Czy wiesz/propozycje]] ale na testową
// [[Wikipedysta:Kaligula/js/CzyWiesz.js/test]], a informowanie autora
// i wikiprojektów – na odpowiednich stronach "…/autor" i "…/wikiprojekt"
 
// Wersja dev skryptu:
//  https://pl.wikipedia.org/wiki/Wikipedysta:Kaligula/js/CzyWiesz.js
 
window.DYKnomination = {
	about : {
		version    : '5.0.0',
		author     : 'Kaligula',
		authorlink : '[[w:pl:user:Kaligula]]',
		homepage   : '[[w:pl:Wikipedia:Narzędzia/CzyWiesz]]',
		credits    : 'Tomasz Wachowski, Matma Rex'
	}
};
 
if (wgNamespaceNumber === 0) {
 
 
 
	DYKnomination.config = {
		interp:		'.,:;!?…-–—()[]{}⟨⟩\'"„”«»/\\', // [\s] must be added directly!; ['] & [\] escaped due to js limits, [\s] means [space]
		miesiacArr:	['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'],
		// ↓ summary template for nomination
		summary:	'/* NR (TITLE) */ nowe zgłoszenie za pomocą [[Wikipedia:Narzędzia/CzyWiesz|gadżetu CzyWiesz]]',
		// ↓ summary template for informing author
		summary_a:	'/* Czy wiesz – [[TITLE]] */ nowe zgłoszenie za pomocą [[Wikipedia:Narzędzia/CzyWiesz|gadżetu CzyWiesz]]',
		// ↓ sectiontitle template for informing author
		secttitl_a: 'Czy wiesz – [[TITLE]]',
		// ↓ summary template for informing wikiprojects
		summary_w:	'/* Czy wiesz – [[TITLE]] */ nowe zgłoszenie za pomocą [[Wikipedia:Narzędzia/CzyWiesz|gadżetu CzyWiesz]]',
		// ↓ sectiontitle template for informing wikiprojects
		secttitl_w: 'Czy wiesz – [[TITLE]]',
		// ↓ style for this gadget
		styletag:	$('<style id="CzyWieszStyleTag">' 
						+ '.wikiEditor-toolbar-dialog .czy-wiesz-gallery-chosen { border: solid 2px red; }\n' 
						+ '#CzyWieszWikiprojectAdd {cursor: pointer; }\n'
						+ '#CzyWieszGalleryToggler a, #CzyWieszLinkAfter, #CzyWieszRefs a, #CzyWieszAuthorTip a, #CzyWieszDateTip a, #CzyWieszErrorDialog a { '
							+ 'color: #0645AD; text-decoration: underline; cursor: pointer; padding-right: 13px; '
							+ 'background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAVklEQVR4Xn3PgQkAMQhDUXfqTu7kTtkpd5RA8AInfArtQ2'
							+ 'iRXFWT2QedAfttj2FsPIOE1eCOlEuoWWjgzYaB/IkeGOrxXhqB+uA9Bfcm0lAZuh+YIeAD+cAqSz4kCMUAAAAASUVORK5CYII=) center right no-repeat; '
							+ 'background: url(//bits.wikimedia.org/static-1.21wmf3/skins/vector/images/external-link-ltr-icon.png) center right no-repeat!ie; }'
					+ '</style>'),
		// ↓ [[File:Crystal Clear app clean.png]] (20px) [2012-11-20]
		yes:		'<img alt="Crystal Clear app clean.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/20px-Crystal_Clear_app_clean.png" width="20" height="20">',
		// ↓ [[File:Crystal Clear action button cancel.png]] (20px) [2012-11-20]
		no:			'<img alt="Crystal Clear action button cancel.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/20px-Crystal_Clear_action_button_cancel.png" width="20" height="20">',
		// ↓ [[File:PL Wiki CzyWiesz ikona.svg]] (80px) [2012-11-20]
		CWicon:		'<img alt="PL Wiki CzyWiesz ikona.svg" src="//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/80px-PL_Wiki_CzyWiesz_ikona.svg.png" width="80" height="80" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/120px-PL_Wiki_CzyWiesz_ikona.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PL_Wiki_CzyWiesz_ikona.svg/160px-PL_Wiki_CzyWiesz_ikona.svg.png 2x">',
		// ↓ = {{załatwione}} [2012-11-20]
		tmpldone:	'<span class="template-done"><img alt="Crystal Clear app clean.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/20px-Crystal_Clear_app_clean.png" width="20" height="20" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/30px-Crystal_Clear_app_clean.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/3/34/Crystal_Clear_app_clean.png/40px-Crystal_Clear_app_clean.png 2x"><span style="display:none">T</span> <b>Załatwione</b></span>',
		// ↓ = {{niezałatwione}} [2012-11-20]
		tmplndone:	'<span class="template-not-done"><img alt="Crystal Clear action button cancel.png" src="//upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/20px-Crystal_Clear_action_button_cancel.png" width="20" height="20" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/30px-Crystal_Clear_action_button_cancel.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Crystal_Clear_action_button_cancel.png/40px-Crystal_Clear_action_button_cancel.png 2x"><span style="display:none">N</span> <b>Niezałatwione</b></span>'
	}
 
	DYKnomination.wikiprojects = {
		counter : 1,
		list : ['Albumy muzyczne',
			'Anarchizm',
			'Antropologia',
			'Architektura',
			'Astronautyka',
			'Astronomia',
			'Baseball',
			'Białystok',
			'Biblia',
			'Bieżące wydarzenia',
			'Biografie',
			'Biologia',
			'Bitwy',
			'Botanika',
			'Bydgoszcz',
			'Chemia',
			'Chiny',
			'Chóralistyka',
			'Chrześcijaństwo',
			'Cmentarze żydowskie w Polsce',
			'Czechy',
			'Częstochowa',
			'Dinozaury',
			'Dolny Śląsk',
			'Drogi i autostrady',
			'Dyskografie',
			'Dzielnice Krakowa',
			'Ekonomia',
			'Elektronika',
			'Entomologia',
			'Euro 2012',
			'Eurowizja',
			'Fantastyka',
			'Filmy',
			'Filozofia',
			'Fizyka',
			'Formuła 1',
			'Francja',
			'Futbol amerykański',
			'Gdańsk',
			'Gender Studies',
			'Genetyka i biologia molekularna',
			'Geografia',
			'Górny Śląsk',
			'Góry Polski',
			'Gry komputerowe',
			'Gwiezdne wrota',
			'Harcerstwo',
			'Harry Potter',
			'Heavy metal',
			'Herby',
			'Hinduizm',
			'Hip-Hop',
			'Historia',
			'Igrzyska olimpijskie',
			'Igrzyska Wspólnoty Narodów',
			'Imiona',
			'Informatyka',
			'Irlandia',
			'Islam',
			'Izrael',
			'Japonia',
			'Kluby sportowe',
			'Kolarstwo',
			'Kompozytorzy',
			'Komputerowe gry fabularne',
			'Konflikty współczesne',
			'Korea',
			'Koszykówka',
			'Kraków',
			'Kynologia',
			'Lekkoatletyka',
			'LGBT',
			'Linie lotnicze',
			'Linux',
			'Literatura',
			'Literaturoznawstwo',
			'Lotnictwo',
			'Łódź',
			'Malarstwo',
			'Matematyka',
			'Meblarstwo',
			'Mikrobiologia',
			'Militaria',
			'Minerały',
			'Mistrzostwa Świata w Piłce Nożnej 2014',
			'Mitologia grecka',
			'Mitologia rzymska',
			'Mitologia słowiańska',
			'Motoryzacja',
			'Muzyka i muzykologia',
			'Muzyka poważna',
			'Mykologia',
			'National Basketball Association',
			'Nauki medyczne',
			'Nauru',
			'Nazwiska',
			'Niemcy',
			'Nowy Sącz',
			'Numizmatyka',
			'Ochrona przyrody',
			'Olsztyn',
			'Opis polskich wsi i gmin',
			'Paleontologia',
			'Pallotyni',
			'Państwa świata',
			'Petanque',
			'Piastowie',
			'Piłka nożna',
			'Piłka siatkowa',
			'Podlaskie',
			'Pokémon',
			'Polityka',
			'Powiat radomski',
			'Powiat szydłowiecki',
			'Powiat wrzesiński',
			'Poznań',
			'Prawo',
			'Programy telewizyjne',
			'Przeworsk',
			'Psychologia',
			'Racibórz',
			'Radio',
			'Religioznawstwo',
			'Rock progresywny',
			'Rosja',
			'Saska Kępa',
			'Seksuologia',
			'Seriale telewizyjne',
			'Skoki narciarskie',
			'Słowacja',
			'Snooker',
			'Socjologia',
			'Spółdzielczość',
			'Sport',
			'Sporty motorowe',
			'Sporty zimowe',
			'Stany Zjednoczone',
			'Starożytność',
			'Stosunki polsko-ukraińskie',
			'Synagogi w Polsce',
			'Szkoła austriacka (ekonomia)',
			'Sztuka współczesna',
			'Śródziemie',
			'Średniowiecze',
			'Technika',
			'Telefony komórkowe',
			'Tenis ziemny',
			'Transport',
			'Transport szynowy',
			'Turystyka',
			'Tybet',
			'U-Boot',
			'Ukraina',
			'Unia Europejska',
			'Warhammer',
			'Warszawa',
			'Wawel',
			'Wielka Brytania',
			'Województwo świętokrzyskie',
			'Województwo warmińsko-mazurskie',
			'Wrestling',
			'Wspinaczka',
			'XML',
			'Zoologia',
			'Żegluga',
			'Żużel',
			'Życie codzienne'],
		list2 : [
			// these wikiprojects want to be informed via their subpage
			{
				label : 'Biologia',
				page  : 'Wikiprojekt:Biologia/Czy wiesz',
				type  : 'subpage'
			},
			{
				label : 'Warszawa',
				page  : 'Wikiprojekt:Warszawa/Czy wiesz',
				type  : 'subpage'
			},
			// these wikiprojects want to be informed via their talk page
			{
				label : 'Astronomia',
				page  : 'Dyskusja wikiprojektu:Astronomia',
				type  : 'talk',
			},
			{
				label : 'Bitwy',
				page  : 'Dyskusja wikiprojektu:Bitwy',
				type  : 'talk',
			},
			{
				label : 'Botanika',
				page  : 'Dyskusja wikiprojektu:Botanika',
				type  : 'talk',
			},
			{
				label : 'Chemia',
				page  : 'Dyskusja wikiprojektu:Chemia',
				type  : 'talk',
			},
			{
				label : 'Chrześcijaństwo',
				page  : 'Dyskusja wikiprojektu:Chrześcijaństwo',
				type  : 'talk',
			},
			{
				label : 'Dyskografie',
				page  : 'Dyskusja wikiprojektu:Dyskografie',
				type  : 'talk',
			},
			{
				label : 'Filmy',
				page  : 'Dyskusja wikiprojektu:Filmy',
				type  : 'talk',
			},
			{
				label : 'Formuła 1',
				page  : 'Dyskusja wikiprojektu:Formuła 1',
				type  : 'talk',
			},
			{
				label : 'Góry Polski',
				page  : 'Dyskusja wikiprojektu:Góry Polski',
				type  : 'talk',
			},
			{
				label : 'Gry komputerowe',
				page  : 'Dyskusja wikiprojektu:Gry komputerowe',
				type  : 'talk',
			},
			{
				label : 'Irlandia',
				page  : 'Dyskusja wikiprojektu:Irlandia',
				type  : 'talk',
			},
			{
				label : 'Japonia',
				page  : 'Dyskusja wikiprojektu:Japonia',
				type  : 'talk',
			},
			{
				label : 'Koszykówka',
				page  : 'Dyskusja wikiprojektu:Koszykówka',
				type  : 'talk',
			},
			{
				label : 'Lekkoatletyka',
				page  : 'Dyskusja wikiprojektu:Lekkoatletyka',
				type  : 'talk',
			},
			{
				label : 'LGBT',
				page  : 'Dyskusja wikiprojektu:LGBT',
				type  : 'talk',
			},
			{
				label : 'Metro',
				page  : 'Dyskusja wikiprojektu:Metro',
				type  : 'talk',
			},
			{
				label : 'Militaria',
				page  : 'Dyskusja wikiprojektu:Militaria',
				type  : 'talk',
			},
			{
				label : 'Muzyka i muzykologia',
				page  : 'Dyskusja wikiprojektu:Muzyka i muzykologia',
				type  : 'talk',
			},
			{
				label : 'Nowy Sącz',
				page  : 'Dyskusja wikiprojektu:Nowy Sącz',
				type  : 'talk',
			},
			{
				label : 'Prawo',
				page  : 'Dyskusja wikiprojektu:Prawo',
				type  : 'talk',
			},
			{
				label : 'Seriale telewizyjne',
				page  : 'Dyskusja wikiprojektu:Seriale telewizyjne',
				type  : 'talk',
			},
			{
				label : 'Skoki narciarskie',
				page  : 'Dyskusja wikiprojektu:Skoki narciarskie',
				type  : 'talk',
			},
			{
				label : 'Słowacja',
				page  : 'Dyskusja wikiprojektu:Słowacja',
				type  : 'talk',
			},
			{
				label : 'Śródziemie',
				page  : 'Dyskusja wikiprojektu:Śródziemie',
				type  : 'talk',
			},
			{
				label : 'Żużel',
				page  : 'Dyskusja wikiprojektu:Żużel',
				type  : 'talk',
			}
		]
	}
 
	DYKnomination.errors = [function (){
		var D = DYKnomination;
		var dialog = $('<ul></ul>');
		for (var i=1;i<D.errors.length;i++) {
			dialog.append( $('<li></li>').html(D.errors[i]) );
		}
		dialog = $('<div id="CzyWieszErrorDialog"></div>').append(dialog).append( $('<p>Więcej informacji w konsoli przeglądarki.</p>') );
 
		dialog.dialog({
		  width: 400,
		  modal: true,
		  title: 'Wystąpił błąd',
		  draggable: true,
		  dialogClass: "wikiEditor-toolbar-dialog",
		  close: function() { $(this).dialog("destroy"); $(this).remove();}
		});
	}];
 
	DYKnomination.debugmode = false;
 
	DYKnomination.debug = function () {
		DYKnomination.debugmode = true;
		DYKnomination.askuser();
	}
 
	DYKnomination.askuser = function () {
 
		var D = DYKnomination;
		var debug = D.debugmode;
		if (D.errors.length > 1) { D.errors = [D.errors[0]]; }
		(debug ? console.log(D) : '');
 
		var IMG_ARR = $.merge($('#mw-content-text .infobox a.image img'),$('#mw-content-text .thumb a.image img'));
		var IMAGES = IMG_ARR.length;
		var REFS = {
			warn:	D.config.no + '&nbsp;&nbsp;<strong style="color: red;">Brak źródeł dyskwalifikuje artykuł ze zgłoszenia!!</strong> <small>(<a class="external">info</a>)</small>',
			ar1:	[''],
			ar2:	['Bibliografia','Przypisy']
		}
			$('.mw-headline').each(function(i){
				REFS.ar1.push( $(this).html().replace(/<span class="mw-headline-number"[^>]*>\d+<\/span> */,'') );
			});
			REFS.ar1 = REFS.ar1.join('#') + '#';
			D.sourced = false;
			for (var i=0; i < REFS.ar2.length; i++) {
				if ( REFS.ar1.match('#' + REFS.ar2[i] + '#') ) {D.sourced = true; break;}
			}
		var SIGNATURE = (wgUserName ? {name: wgUserName, disabled: ' disabled'} : {name: '~~' + '~', disabled: ' disabled'} );
 
		//workaround for Opera - the textarea must be inserted to a visible element
 
		var $title_paragraph = $('<p></p>')
			.html('Tytuł artykułu: &nbsp;&nbsp;<input type="text" id="CzyWieszTitle" name="CzyWieszTitle" value="' + wgTitle + '" style="width: 476px;" disabled>');
 
		var $question_paragraph = $('<p><strong>Zaproponuj pytanie:</strong></p>');
		var $question_textarea_paragraph = $('<p></p>')
			.html('<textarea id="CzyWieszQuestion" style="width: 570px;" rows="2" value="" autofocus></textarea>');
 
		var $ref_row = $('<tr id="CzyWieszRefs"></tr>')
			.html('<td>Źródła: </td>'
				+ '<td>' + ( D.sourced ? D.config.yes : REFS.warn ) + '</td>');
			if (D.sourced) {
				$ref_row.css({display: 'none'});
			}
 
		var $images_row = $('<tr></tr>')
			.html('<td>Liczba grafik w artykule: </td>'
				+ '<td><input type="text" id="CzyWieszImages" name="CzyWieszImages" value="' + IMAGES + '"' 
				+ 'style="width: 8%;text-align: right;margin-left: 2px;">'
				+ '<span id="CzyWieszGalleryToggler" style="display: none;"> &nbsp;<small>(<a class="external">zaproponuj grafikę z artykułu</a>)</small></span>');
 
		var $file_row = $('<tr></tr>')
			.html('<td style="width: 28%;"><input type="checkbox" id="CzyWieszFile1" name="CzyWieszFile1" style="vertical-align: middle;"> Zaproponuj grafikę: </td>' // style="width: 36%;
				+ '<td><tt>[[Plik:</tt><input type="text" id="CzyWieszFile2" name="CzyWieszFile2" style="width: 52%; vertical-align: middle;" disabled><tt>|100px|right]]</tt></td>');
 
		//author row
		var $author_row = $('<tr></tr>')
			.html('<td>Główny autor artykułu: </td>'
				+ '<td><input type="text" id="CzyWieszAuthor" name="CzyWieszAuthor" style="width: 50%;margin-left: 2px;vertical-align: middle;">'
				+ '&nbsp;&nbsp;<input type="checkbox" id="CzyWieszAuthorInf" name="CzyWieszAuthorInf" style="vertical-align: middle;">poinformuj go</td>');
 
		D.author2_input = $('<input type="text" class="CzyWieszAuthor2" name="CzyWieszAuthor2" style="width: 50%;margin-left: 2px;vertical-align: middle;">');
		var $author2_row = $('<span id="CzyWieszAuthor2Container"></span>').append(D.author2_input.clone());
		$author2_row = $('<td></td>').append($author2_row)
			.append('<a id="CzyWieszAuthor2Add">(+)</a>');
		$author2_row = $('<tr id="CzyWieszAuthor2" style="display: none;" title="Dodaj *tylko* jeśli jego wkład w obecną rozbudowę artykułu był równie duży jak autora podanego powyżej!"></tr>').append('<td>Kolejny autor: </td>').append($author2_row);
 
		var $date_row = $('<tr></tr>')
			.html('<td>Data utw./rozbud. artykułu: </td>'
				+ '<td><input type="text" id="CzyWieszDate" name="CzyWieszDate" style="width: 50%;margin-left: 2px;vertical-align: middle;">');
 
		var $signature_row = $('<tr></tr>')
			.html('<td>Twój podpis: </td>'
				+ '<td><input type="text" id="CzyWieszSignature" name="CzyWieszSignature" value="' 
				+ SIGNATURE.name + '" style="width: 50%;margin-left: 2px;"' + SIGNATURE.disabled + '></td>');
 
		//wikiproject row
		D.wikiproject_select = $('<select class="czywiesz-wikiproject"></select>').css('vertical-align', 'middle');
		D.wikiproject_select.append('<option value="none">-- (żaden) --</option>');
		for (var i=0;i<D.wikiprojects.list.length;i++) {
			if (typeof(D.wikiprojects.list[i]) == 'function') continue; //on IE wikibits adds indexOf method for arrays. skip it.
			$('<option value="' + i + '">' + D.wikiprojects.list[i] + '</option>').appendTo(D.wikiproject_select);
		}
		var $wikiproject_row = $('<span id="CzyWieszWikiprojectContainer"></span>').append(D.wikiproject_select.clone());
		$wikiproject_row = $('<td></td>').append($wikiproject_row)
			.append('<a id="CzyWieszWikiprojectAdd">(+)</a>');
		$wikiproject_row = $('<tr></tr>').append('<td>Powiadom wikiprojekt(y): </td>').append($wikiproject_row);
 
		var $comment_paragraph = $('<p><input type="checkbox" id="CzyWieszCommentCheckbox" name="CzyWieszCommentCheckbox" style="vertical-align: middle;">Potrzebujesz zamieścić dodatkowy komentarz?</p>');
		var $comment_textarea_paragraph = $('<p id="CzyWieszCommentContainer" style="display: none;"></p>')
			.html('<textarea id="CzyWieszComment" style="width: 570px;" rows="2" value=""></textarea>');
 
		//rules paragraph
		var $rules_paragraph = $('<p id="CzyWieszRules"></p>')
			.html('<small>Zgłaszaj hasła nie później niż 10 dni od powstania lub rozbudowania hasła, '
				+ 'posiadające źródła najlepiej w formie przypisów i zawierające co najmniej 2kb samej treści.</small>')
			.css({border: '1px solid #F0F080', backgroundColor: '#FFFFE0', paddingLeft: '5px'});
 
		var $loading_bar = $('<div id="CzyWieszLoaderBar"></div>')
			.css({width: '100%', backgroundColor: 'rgb(220, 220, 220)', border: '1px solid rgb(187, 187, 187)', borderRadius: '3px'})
			.html('<p id="CzyWieszLoaderBarParagraph" style="margin: 0 0 0 7px; position: absolute;">&nbsp;</p>'
				+ '<div id="CzyWieszLoaderBarInner" style="width: 0; height: 20px; background-color: #ABEC46; border: none; border-radius: 3px;"></div>');
 
		//build the dialog
		var $dialog = $('<table></table>').css('width','100%').append($ref_row).append($images_row).append($file_row)
			.append($author_row).append($author2_row).append($date_row).append($signature_row).append($wikiproject_row);
		var $dialog = $('<div id="CzyWieszGadget"></div>').append($title_paragraph).append($question_paragraph).append($question_textarea_paragraph)
			.append($dialog).append($comment_paragraph).append($comment_textarea_paragraph).append($rules_paragraph).append($loading_bar);
 
		//main buttons
		var buttons = {
			"Zgłoś": function() {
				if (D.sourced) {
					D.checkForm();
				}
				else {
					alert('Artykuł bez źródeł jest zdyskwalifikowany z nominacji. (Jeśli źródła są to zwróć uwagę czy tytuł sekcji jest prawidłowy, tzn. „Przypisy” lub „Bibliografia”.)');
				}
			},
			"Anuluj" : function() {
				$(this).dialog("close");
			}
		};
 
		$dialog.dialog({
		  width: 600,
		  modal: true,
		  title: 'Zgłaszanie artykułu do rubryki „Czy wiesz…”' + (debug ? ' &nbsp; (<small id="CzyWieszDialogDebug" style="color: red;">TRYB DEBUG</small>)' : ''),
		  draggable: true,
		  dialogClass: "wikiEditor-toolbar-dialog",
		  close: function() { $(this).dialog("destroy"); $(this).remove();},
		  buttons: buttons
		});
 
		// check size of article and make a tip for the possible author
		D.pagerevs();
 
		if ($('#CzyWieszStyleTag').length == 0) {
			D.config.styletag.appendTo('head');
		}
 
		// when user ticks he wants to nominate with picture → enable picture/file field
		$('#CzyWieszFile1').change(function(){
			var a=$('#CzyWieszFile2');
			(a.attr('disabled') ? a.removeAttr('disabled') : a.attr('disabled','true'));
		});
 
		// if there are images in article → add link to small gallery to quickly choose an image from article
		if (IMAGES > 0) {
			$('#CzyWieszGalleryToggler').toggle();
			$('#CzyWieszGalleryToggler a').click(function(){
				var GALLERY = '<div id="CzyWieszGalleryHolder">'
						+ '<div id="CzyWieszGallery" style="background-color: #F2F5F7;">'
						+ '<table><tbody>';
						for (var i=0; i<IMG_ARR.length; i++) {
							if (i%5 == 0) {GALLERY += '<tr>';}
							GALLERY += '<td>';
							GALLERY += IMG_ARR[i].outerHTML.replace(/ width=\"\d+\"/,' width="100"').replace(/ height=\"[^\"]*\"/,'').replace(/ class=\"[^\"]*\"/g,'');
							GALLERY += '</td>';
							if (i%5 == 4) {GALLERY += '</tr>';}
						}
				GALLERY	+= '</tbody></table> </div> </div>';
 
				$(GALLERY).dialog({
					width: 547,
					modal: true,
					title: 'Wybierz grafikę:',
					draggable: true,
					dialogClass: "wikiEditor-toolbar-dialog",
					close: function() { $(this).dialog("destroy"); $(this).remove();},
					buttons: {
						"Wybierz": function() {
							if ($('#CzyWieszFile1').length > 0) {
								$('#CzyWieszFile1').attr('checked',true);
								$('#CzyWieszFile2').removeAttr('disabled');
								$('#CzyWieszFile2').val( $('.czy-wiesz-gallery-chosen').length == 0 ? '' : decodeURIComponent($('.czy-wiesz-gallery-chosen')[0].src.match(/\/\/upload\.wikimedia\.org\/wikipedia\/commons(\/thumb)?\/.\/..\/([^\/]+)\/?/)[2]).replace(/_/g,' ') ); // ← extract file name
							}
 
							$(this).dialog("destroy");
							$(this).remove();
						},
						"Anuluj" : function() {
							$(this).dialog("close");
						}
					}
				});
				$('#CzyWieszGallery img').each(function(){
					$(this).click(function(){
						$('.czy-wiesz-gallery-chosen').each(function(){
							$(this).toggleClass('czy-wiesz-gallery-chosen');
						});
						$(this).toggleClass('czy-wiesz-gallery-chosen');
					});
				});
			});
		}
 
		// autofill today's date
		$('#CzyWieszDate').val(function(){
			var a = new Date();
			var y = a.getFullYear();
			var m = a.getMonth()+1; m=(m<10?'0'+m:m);
			var d = a.getDate(); d=(d<10?'0'+d:d);
			str = y + '-' + m + '-' + d;
			return str;
		});
 
		// if there are no refs (or they're badly named) → append this dialog to a link in $ref_row
		$('#CzyWieszRefs small a').click(function(){
			$('<div><div class="floatright">' + D.config.CWicon + '</div><p style="margin-left: 10px;">Zgodnie z wytycznymi <a href="/wiki/Wikiprojekt:Czy_wiesz" title="Wikiprojekt:Czy wiesz">Wikiprojektu Czy wiesz</a> zgłaszane hasło powinno posiadać źródła w formie bibliografii lub przypisów. <a href="/wiki/Wikiprojekt:Czy_wiesz/pomoc#Zg.C5.82aszanie_propozycji_i_poprawa_hase.C5.82" title="Wikiprojekt:Czy wiesz/pomoc#Zgłaszanie propozycji i poprawa haseł">(Więcej…)</a><br /><small>Możliwe, że w artykule sekcje ze źródłami są błędnie nazwane – w takim wypadku popraw je.</small></p></div>')
			.dialog({ modal: true, dialogClass: "wikiEditor-toolbar-dialog", close: function() { $(this).dialog("destroy"); $(this).remove();} });
		});
 
		// click on (+) near wikiprojects combo box → add new combo box and enlarge the dialog window
		$('#CzyWieszWikiprojectAdd').click(function(){
			$('#CzyWieszWikiprojectContainer').append(D.wikiproject_select.clone());
			$('#CzyWieszLoaderBar').parent().css({height: '+=24'});
		});
 
		// click on (+) near authors input field → add new input field and enlarge the dialog window
		$('#CzyWieszAuthor2Add').click(function(){
			if ($('#CzyWieszAuthor2').css('display') == 'none') {
				$('#CzyWieszAuthor2').removeAttr('style');
//				$('#CzyWieszLoaderBar').parent().css({height: '+=24'});
			}
			else {
				$('#CzyWieszAuthor2Container').append(D.author2_input.clone());
				$('#CzyWieszLoaderBar').parent().css({height: '+=24'});
			}
		});
 
		$('#CzyWieszCommentCheckbox').change(function(){
			$('#CzyWieszCommentContainer').toggle();
		});
 
		//$('#CzyWieszQuestion').keyup();
		$('#CzyWieszQuestion').focus();
 
	}
 
	DYKnomination.pagerevs = function () {
 
		var D = DYKnomination;
		var a,b,c,d0,d,i,aj0,revs0,aj,revs,str,maxdiffsize,maxdiffuser;
 
		d = new Date();
		a = d.toISOString(); // '2012-08-14T17:43:33Z' OR '2012-08-14T17:43:33.324Z'
		b = new Date(d.setUTCDate(d.getUTCDate()-10)).toISOString().replace(/T.*$/,'T00:00:00Z'); // 10 days before and from 00:00:00 on that day
 
		$.ajax('/w/api.php?action=query&prop=revisions&format=json&rvprop=timestamp%7Cuser%7Csize&redirects=&indexpageids='
				+ '&rvlimit=max'
				+ '&rvstart=' + encodeURIComponent(a)
				+ '&rvend=' + encodeURIComponent(b)
				+ '&titles=' + encodeURIComponent(wgTitle)
		)
		.done(function(d0){
			// number of edits in last 10 days
			revs0 = (d0.query.pages[d0.query.pageids[0]].revisions ? d0.query.pages[d0.query.pageids[0]].revisions.length : 0);
 
			// get one more revision to check current size and diffsize of last one in 10 days period
			$.ajax('/w/api.php?action=query&prop=revisions&format=json&rvprop=timestamp%7Cuser%7Csize&redirects=&indexpageids='
					+ '&rvlimit=' + (revs0+1)
					+ '&titles=' + encodeURIComponent(wgTitle)
			)
			.done(function(d){
				aj = d.query.pages[d.query.pageids[0]].revisions;
				revs = aj.length;
				if (debug) {
					console.log('edits in last 10 days:');
					console.log(aj);
				}
 
				if (revs0 > 0) {
				// there are edits in last 10 days
					aj0 = d0.query.pages[d0.query.pageids[0]].revisions;
					//revs0 = aj0.length;
					if (debug) {
						console.log('edits in last 10 days, plus one more:');
						console.log(aj0);
					}
 
					// check the author of the biggest edit in last 10 days
					str=[];
					for (var i=0;i<aj.length;i++){
						if (aj[i+1]) {
							str.push(aj[i].size-aj[i+1].size);
						}
						else {
							// (revs0 == revs) means the article was *created* in last 10 days so last edit really diffs from 0
							if (revs0 == revs) {str.push(aj[i].size);}
						}
					}
 
					maxdiffsize = Math.max.apply(Math,str);
					maxdiffrev = $.inArray(maxdiffsize,str); //if the same size is more than once it brings the most recent revision!
					maxdiffuser = aj[maxdiffrev].user;
					maxdiffdate = aj[maxdiffrev].timestamp.split('T')[0];
					(maxdiffsize > 0) ? (maxdiffsize = '+' + maxdiffsize) : ''
 
					(debug ? console.log('\"[str,maxdiffrev,maxdiffsize,maxdiffuser]\":') : '');
					(debug ? console.log([str,maxdiffrev,maxdiffsize,maxdiffuser]) : '');
 
					// add a tip about possible author…
					$('#CzyWieszAuthor').after('&nbsp;<small id="CzyWieszAuthorTip">(<a class=external>sugestia?</a>)</small>&nbsp;');
					$('#CzyWieszAuthorTip a').click(function(){
						prompt('Autor największej edycji (' + maxdiffsize + ') w ciągu ostatnich 10 dni (skopiuj wciskając Ctrl+C):',maxdiffuser);
						$('#CzyWieszAuthor').select();
					});
					// …and about date
					$('#CzyWieszDate').after('&nbsp;<small id="CzyWieszDateTip">(<a class=external>sugestia?</a>)</small>&nbsp;');
					$('#CzyWieszDateTip a').click(function(){
						prompt('Data największej edycji (' + maxdiffsize + ') w ciągu ostatnich 10 dni (skopiuj wciskając Ctrl+C):',maxdiffdate);
						$('#CzyWieszDate').select();
					});
				}
				else {
				// there are no edits in last 10 days
					//revs0 = 0;
					(debug ? console.log(d.query.pages[d.query.pageids[0]]) : '');
					alert('W ciągu ostatnich 10 dni nie dokonano żadnej edycji. Jeszcze raz rozważ zgłaszanie tego artykułu, gdyż może to być niezgodne z regulaminem.');
				}
 
				D.articlesize = {
					size:	aj[0].size,
					enough:	(aj[0].size > 2047),
					warn:	( (aj[0].size > 2047) ? '' : (D.config.no + '&nbsp;&nbsp;<strong style="color: red;">Rozmiar ' + aj[0].size + ' b dyskwalifikuje artykuł ze zgłoszenia!!</strong> <!--small>(<a class="external">info</a>)</small-->') )
				};
 
				var $size_row = $('<tr id="CzyWieszSize"></tr>')
					.insertAfter($('#CzyWieszRefs'))
					.html('<td>Rozmiar (>2 kb): </td>'
						+ '<td>' + (D.articlesize.enough ? D.config.yes : D.articlesize.warn) + '</td>')
					.css( D.articlesize.enough ? {display: 'none'} : {});
			})
			.fail(function(data){
				D.errors.push('Błąd pobierania historii artykułu (funkcja wewnętrzna): $.ajax.fail().');
				D.errors[0]();
				console.error('Błąd pobierania historii artykułu (funkcja wewnętrzna): $.ajax.fail().');
				console.error(data);
			});
		})
		.fail(function(data){
			D.errors.push('Błąd pobierania historii artykułu (funkcja zewnętrzna): $.ajax.fail().');
			D.errors[0]();
			console.error('Błąd pobierania historii artykułu (funkcja zewnętrzna): $.ajax.fail().');
			console.error(data);
		});
	}
 
	if (!String.toRegExp){
		String.prototype.toRegExp = function () {
			return this.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		}
	}
/*	DYKnomination.strToRegExp = function (str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}*/
 
	DYKnomination.values = {}
 
	DYKnomination.checkForm = function () {
 
		var D = DYKnomination;
		var debug = D.debugmode;
 
		//get the question
		var QUESTION = $('#CzyWieszQuestion').val().replace(/(.*?)(--)?~{3,5}\s*$/,'$1').replace(/^\s*(.*?)\s*$/,'$1').replace(/^([Cc]zy wiesz)?[\s,\.]*/,''); // remove signature, spaces on beginning and end, beginning of question ("Czy wiesz")
		var FILE = ( $('#CzyWieszFile1').attr('checked') ? $('#CzyWieszFile2').val().replace(/^\s*(.*?)\s*$/,'$1') : '' ); // remove spaces on beginning and end
		var IMAGES = $('#CzyWieszImages').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
		var REFS = (D.sourced ? '+' : ' ');
		var AUTHOR = $('#CzyWieszAuthor').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
		var AUTHOR2 = [];
			//get authors
			$('.CzyWieszAuthor2').each( function(index) {
				var val = $(this).val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
				if (val != '') {
					AUTHOR2.push(val);
				}
			});
		var AUTHOR_INF = ( $('#CzyWieszAuthorInf').attr('checked') ? true : false );
		var DATE = $('#CzyWieszDate').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
		var SIGNATURE = $('#CzyWieszSignature').val().replace(/^\s*(.*?)\s*$/,'$1'); // remove spaces on beginning and end
		var WIKIPROJECT = [];
			if (!debug) {
				//get the wikiprojects
				$('.czywiesz-wikiproject').each( function(index) {
					var val = $(this).val();
					if (val != 'none') {
						WIKIPROJECT.push(D.wikiprojects.list[val]);
					}
				});
			}
			else {
				WIKIPROJECT = ['Wikipedysta:Kaligula/js/CzyWiesz.js/wikiprojekt'];
			}
		var COMMENT = ( $('#CzyWieszCommentCheckbox').attr('checked') ? $('#CzyWieszComment').val().replace(/^\s*(.*?)\s*$/,'$1') : false );
 
		//validate form
		var invalid = {is: false, fields: [], alert: []};
			if (typeof QUESTION != 'string' || QUESTION === '') {
				invalid.is = true;
				invalid.fields.push('Question');
				invalid.alert.push('Wpisz pytanie.');
			}
			else {
				var tITLE = wgTitle.charAt(0).toLowerCase()+wgTitle.substr(1); //title in link starting with lowercase
				if (QUESTION.length < 10) {
					invalid.is = true;
					invalid.fields.push('Question');
					invalid.alert.push('Zadaj poprawne pytanie.');
				}
				else if (!QUESTION.match(RegExp('\'\'\'\\s*\\[\\[('+wgTitle.toRegExp()+'|'+tITLE.toRegExp()+')(\\]\\]|\\|.*?\\]\\])\\s*\'\'\''))) {
				// if there isn't any bold (a) link with title or (b) link with title starting with lowercase
					invalid.is = true;
					invalid.fields.push('Question');
					invalid.alert.push('Pytanie musi zawierać link do artykułu. Pogrubiony.\n Przykład:\n   \'\'\'[['+tITLE+']]\'\'\'\n lub\n   \'\'\'[['+wgTitle+'|nazwa do wyświetlenia, jeśli inna niż tytuł]]\'\'\'.');
				}
				else {
					QUESTION = (QUESTION.match(/^(…|\.\.\.)/) ? '' : '…') + QUESTION.replace(/\.\.\./g,'…') + (QUESTION.match(/\?[\s]*$/) ? '' : '?');
					QUESTION = QUESTION.replace(/\n+/g,'\n\n') + '\n';
				}
			}
			if (typeof FILE == 'string' && FILE != '') {
				FILE = '[[Plik:' + (FILE.match(/^(Plik:|File:)/i) ? FILE.replace(/^(Plik:|File:)/i,'') : (FILE)) + '|100px|right]]\n';
			}
			if (typeof IMAGES != 'string' || IMAGES === '') {
				invalid.is = true;
				invalid.fields.push('Images');
				invalid.alert.push('Podaj liczbę grafik w artykule.');
			}
			if (typeof AUTHOR != 'string' || AUTHOR === '') {
				invalid.is = true;
				invalid.fields.push('Author');
				invalid.alert.push('Podaj autora artykułu.');
			}
			if (typeof DATE != 'string' || DATE === '' || DATE.match(/\d\d\d\d-\d\d-\d\d/).length==0) {
				invalid.is = true;
				invalid.fields.push('Date');
				invalid.alert.push('Podaj datę utworzenia/rozbudowy artykułu (w formacie rrrr-mm-dd).');
			}
			if (typeof SIGNATURE != 'string' || SIGNATURE === '') {
				invalid.is = true;
				invalid.fields.push('Signature');
				invalid.alert.push('Podpisz się.');
			}
			if ( (typeof COMMENT!='string'&&typeof COMMENT!='boolean') || (typeof COMMENT=='string' && (COMMENT===''||COMMENT.match(/^[^A-ZĘÓĄŚŁŻŹĆŃa-zęóąśłżźćń]+$/)) ) || (typeof COMMENT=='string'&&COMMENT==true) ) {
				invalid.is = true;
				invalid.fields.push('Comment');
				invalid.alert.push('Jeśli musisz podać jakiś komentarz to podaj jakiś sensowny, jeśli nie – wyłącz to pole. Nie wstawiaj w tym polu samego podpisu (lecz po komentarzu podpisz się).');
			}
 
		if (invalid.is) {
			$(invalid.fields).each(function(){
				$('#CzyWiesz'+this).css({border: 'solid 2px red'}).change(function(){
					$(this).css({border: 'none'});
				});
			});
			alert(invalid.alert.join('\n'));
			$('#CzyWiesz'+invalid.fields[0]).focus();
		}
		else {
			D.values = {
				question:    QUESTION,
				file:        FILE,
				images:      IMAGES,
				refs:        REFS,
				author:      AUTHOR,
				date:        DATE,
				signature:   SIGNATURE,
				commment:    COMMENT,
				authorInf:   AUTHOR_INF,
				wikiproject: WIKIPROJECT
			}
			// here is the call of editing/ajax function
			D.prepare();
		}
	}
 
	DYKnomination.task = -1;
	DYKnomination.loadbar = function (task) {
 
		var D = DYKnomination;
		if (task == false) {
			D.task = -1;
			return;
		}
		else if (typeof task == 'undefined'){
			D.task++;
			task = Math.min(D.task,4);
		}
		var tasks = D.tasks;
 
		var txt;
		switch (task) {
			case 0:
				txt = 'Sprawdzam stronę zgłoszeń…';
				break;
			case 1:
				txt = 'Pobieram dane z formularza…';
				break;
			case 2:
				txt = 'Przygotowuję dane do wysłania…';
				break;
			case 3:
				txt = 'Zgłaszam propozycję…';
				break;
			case 4:
				txt = 'Informuję o zgłoszeniu…';
				break;
			case 'done':
				txt = 'Zakończono!';
				task = tasks;
				break;
			case 'error':
				txt = 'Wystąpił błąd!';
				break;
			default:
				txt = '';
		}
 
		$('#CzyWieszLoaderBarParagraph').text(txt);
		if (task != 'error') { // 'error' → task/tasks = NaN
			$('#CzyWieszLoaderBarInner').css({width: 100*task/tasks + '%'});
		}
		else {
			$('#CzyWieszLoaderBarInner').css({backgroundColor: 'red'});
		}
 
	}
 
	DYKnomination.getEditToken = function (callback,force) {
 
		var D = DYKnomination;
		var debug = D.debugmode;
 
		var tmpToken = mw.user.tokens.values.editToken;
		if (!force && typeof tmpToken == 'string' && tmpToken.length == 34) {
			D.edittoken = tmpToken;
			(debug ? console.log('DYKnomination.edittoken :',D.edittoken) : '');
			//runs callback function with all given parameters except two first ones
			window.DYKnomination[callback].apply(null, Array.prototype.slice.call(arguments, 2));
		}
		else {
			/* get edittoken */
			$.ajax({
				url:'/w/api.php?action=tokens&format=json&type=edit',
				cache: false
			})
			.done(function(data){
				if (debug) {
					console.log('CzyWiesz edittoken: komenda GET zakończona\nodpowiedź serwera:');
					console.log(data);
				}
				if (data.error) {
					D.errors.push('Błąd pobierania tokena: ' + data.error.info + '.');
					D.errors[0]();
					console.error('Błąd pobierania tokena: ' + data.error.info + '.');
					console.error(data);
				}
				else {
					(debug ? console.log('DYKnomination.edittoken :',D.edittoken) : '');
					(debug ? console.log('data.tokens.edittoken :',data.tokens.edittoken) : '');
					D.edittoken = data.tokens.edittoken;
					(debug ? console.log('DYKnomination.edittoken :',D.edittoken) : '');
					//runs callback function with all given parameters except two first ones
					window.DYKnomination[callback].apply(null, Array.prototype.slice.call(arguments, 2));
				}
			})
			.fail(function(data){
				D.errors.push('Błąd pobierania tokena: $.ajax.fail().');
				D.errors[0]();
				console.error('Błąd pobierania tokena: $.ajax.fail().');
				console.error(data);
			});
		}
	}
 
	DYKnomination.prepare = function () {
 
		var D = DYKnomination;
		var Dv = D.values;
		var debug = D.debugmode;
 
		/* prepare place for edition */
 
		D.tasks = 4 + Dv.wikiproject.length + (Dv.authorInf?1:0);
 
		D.loadbar();
 
			var miesiacArr = D.config.miesiacArr;
			DATE = Dv.date.match(/\d+/g);
			var dzisiaj = DATE[2].replace(/^0/,'') + ' ' + miesiacArr[(+(DATE[1])-1)]; //reading localmonthnamegen, but DATE[1]is a string since we could've added leading zero before
			(debug ? console.log('dzisiaj: ' + dzisiaj) : '');
		var updatesection = false;
 
		var sections,section,NR,updatesection; // section must be 'undefined' at the beginning!!! (look at the end of function)
 
		// search for section 'dd mmmm', because there may be a section like 'Białowieski megaczywiesz na koniec sierpnia (ew. pocz. września)'
		$.ajax({
			url: '/w/api.php?action=mobileview&format=json&page=' + encodeURIComponent(debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/test' : 'Wikiprojekt:Czy wiesz/propozycje') + '&prop=sections&sectionprop=level%7Cline%7Cnumber%7Canchor&noimages=',
			cache: false
		})
		.done(function(data){
			if (debug) {
				console.log('get sections: komenda GET zakończona');
				console.log('URI: /w/api.php?action=mobileview&format=json&page=' + encodeURIComponent(debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/test' : 'Wikiprojekt:Czy wiesz/propozycje') + '&prop=sections&sectionprop=level%7Cline%7Cnumber%7Canchor&noimages=');
				console.log('get sections: odpowiedź serwera:');
				console.log(data);
			}
			if (data.error) {
				D.errors.push('Błąd sprawdzania sekcji na stronie zgłoszeń: ' + data.error.info + '.');
				D.errors[0]();
				console.error('Błąd sprawdzania sekcji na stronie zgłoszeń: ' + data.error.info + '.');
				console.error(data);
			}
			else {
				sections = data.mobileview.sections;
				(debug ? console.log(sections) : '');
				var m0 = +(DATE[1]) - 1; //it was a string since we could've added leading zero
				var d0 = +(DATE[2]); //it was a string since we could've added leading zero
				var mt = 99; //shorthand for 'Month - Temporary variable' - in January the previous months have bigger nr than one of the sections so if the nomination has a date that is earlier than the first date in this year then the script will go through all sections and save the nomination as last one
				(debug ? console.log('current month [m0]:',m0,', current day [d0]:',d0) : '');
				section = 0;
				updatesection = -1;
				NR = 1;
				var nominated = false;
 
				$(sections).each(function(){
					if ( this.level && (this.level == 2) && this.line && (updatesection < 0) ) { //sekcja nagłówkowa (nie zgłoszenia) i ma nazwę i wciąż nie określono msc wstawienia
						var d = this.line.split(' ')[0];
						var m = $.inArray(this.line.split(' ')[1],miesiacArr);
						if ( d.match(/^\d+$/) && (m>-1) ) { //date format is 'd mmmm'
							if (m0 == m && d0 == d) { //the date is equal to section
								section = this.id;
								updatesection = 1;
								//↑dla obecnej już sekcji updatesection==1 (yes) → edit section
									var j = section;
									while (sections[j+1] && sections[j+1].level == 3) {
										NR++; j++;
									} //spr jaki nr zgłoszenia dać
							}
							else if (m0>m || (m0==m && d0>d) ) { //the date is newer than the section
								section = (this.id-1);
								updatesection = 0;
								//↑dla nieobecnej updatesection==0 (no) → append section
							}
							else if (mt<m) { //we went to previous year dates so STOP //TO DO: !
								if (m0 < 6) { //if first half of the year then as above
									section = (this.id-1);
									updatesection = 0;
									//↑dla nieobecnej updatesection==0 (no) → append section
								}
								else { //then as below (=we go on and check next)
									section = this.id;
									//↑dla nieobecnej najstarszej updatesection<0 (unset) → new section
								}
							}
							else {
							//jeśli nie nastąpią powyższe to ten będzie zapisywał kolejne id aż do _ost._sekcji_
								section = this.id;
								//↑dla nieobecnej najstarszej updatesection<0 (unset) → new section
							}
							mt = m;
						}
						(debug ? console.log('section:',section,', month [m]:',m,', day [d]:',d,'new section number would be here [NR]:',NR,', updatesection:',updatesection) : '');
					}
					if ( this.level && (this.level == 3) && this.line && this.line.match(/^\d+ \((.*?)\)/) ) { //sekcja zgłoszenia (nie nagłówek) i ma nazwę z nr na początku
						if ( this.line.match(/^\d+ \((.*?)\)/)[1] == wgTitle ) {
							nominated = true;
							D.errors.push('Podany artykuł prawdopodobnie już jest zgłoszony do rubryki „Czy wiesz…”. <br />'
								+ '<a href=\"/wiki/'+(debug?'Wikipedysta:Kaligula/js/CzyWiesz.js/test':'Wikiprojekt:Czy wiesz/propozycje')+'#' + this.anchor + '\" class="external" target=_blank>Sprawdź</a>.');
							D.errors[0]();
							console.error('Podany artykuł prawdopodobnie już jest zgłoszony do rubryki „Czy wiesz…”.\n'
								+ 'Sprawdź: '+location.origin+'/wiki/'+(debug?'Wikipedysta:Kaligula/js/CzyWiesz.js/test':'Wikiprojekt:Czy wiesz/propozycje')+'#' + this.anchor);
						}
					}
				});
 
				if (nominated === false) {
					Dv.nr = NR
					Dv.updatesection = updatesection;
					Dv.dzisiaj = dzisiaj;
					Dv.section = section;
					D.getEditToken(
					    'runNominate',
						false
					);
				}
			}
		})
		.fail(function(data){
			D.errors.push('Błąd pobierania listy sekcji: $.ajax.fail().');
			D.errors[0]();
			console.error('Błąd pobierania listy sekcji: $.ajax.fail().');
			console.error(data);
		}); // returns sections and section
		// we know the section to edit (section) and if it's up-to-date (updatesection:boolean)
 
	}
 
	DYKnomination.runNominate = function () {
 
		var D = DYKnomination;
		var Dv = D.values;
		var debug = D.debugmode;
		var summary,input;
 
		// NR ready, make summary
		summary = D.config.summary.replace('NR (TITLE)',Dv.nr+' ('+wgTitle+')');
 
		/* making data ready */
		D.loadbar();
 
		// making content
 
		input = '=== ' + Dv.nr + ' (' + wgTitle + ') ===\n'
			+ '<!-- artykuł zgłoszony za pomocą gadżetu CzyWiesz -->\n'
			+ Dv.file         //FILE is already with \n at the end
			+ Dv.question     //QUESTION is already with \n at the end
			+ '{' + '{Wikiprojekt:Czy wiesz/weryfikacja|' + wgTitle + '|' + Dv.refs + '|' + Dv.images + '|' + Dv.author + '|' + Dv.signature + '|?|?|?}}'
			+ (Dv.comment ? '\n'+Dv.comment : '');
 
		// text ready
		// ↓ new section or not? if updatesection =
		// =  1 then add only the nomination (to a section)
		// =  0 then add whole new section (to a section)
		// = -1 then add whole new section (at the end)
 
		if (Dv.updatesection == 1) { // if up-to-date → new subsection inside date section
			input = '\n\n' + input;
		}
		else if (Dv.updatesection < 1) { // if not up-to-date → new section with date + new subsection inside date section
			input = '\n\n== ' + Dv.dzisiaj +' ==\n' + input + '\n\n';
		}
 
		(debug ? console.log('input:') : '');
		(debug ? console.log(input) : '');
 
		Dv.input = input;
		Dv.summary = summary;
		D.nominate();
	}
 
	DYKnomination.nominate = function () {
 
		var D = DYKnomination;
		var Dv = D.values;
		var debug = D.debugmode;
 
		D.loadbar();
 
		/* edit */
 
		// Wikiprojekt:Czy wiesz
		D.loadbar();
 
		$.ajax({
			url : '/w/api.php',
			type: 'POST',
			data : {
				action : 'edit',
				format : 'json',
				title : (debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/test' : 'Wikiprojekt:Czy wiesz/propozycje'),
				section : Dv.section,
				appendtext : Dv.input,
				summary : Dv.summary,
				watchlist : 'nochange',
				token : D.edittoken
			}
		})
		.done(function(data){
			if (debug) {
				console.log('CzyWiesz nominate: POST done\nserver response:');
				console.log(data);
			}
			if (data.error) {
				D.errors.push('Błąd zgłaszania do rubryki: ' + data.error.info + '.');
				D.errors[0]();
				console.error('Błąd zgłaszania do rubryki: ' + data.error.info + '.');
				console.error(data);
			}
			else {
				if (Dv.authorInf) {
					D.inform_a();
				}
				else {
					D.inform_w();
				}
			}
		})
		.fail(function(data){
			D.errors.push('Błąd zgłaszania do rubryki: $.ajax.fail().');
			D.errors[0]();
			console.error('Błąd zgłaszania do rubryki: $.ajax.fail().');
			console.error('URI: /w/api.php?action=edit&format=json&title=' 
				+ encodeURIComponent( (debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/test' : 'Wikiprojekt:Czy wiesz/propozycje') ) 
				+ '&section=' + Dv.section + '&appendtext=' + encodeURIComponent(Dv.input) 
				+ '&summary=' + encodeURIComponent(Dv.summary) + '&token=' + encodeURIComponent(D.edittoken));
			console.error(data);
		});
 
	}
 
	DYKnomination.inform_a = function () {
 
		var D = DYKnomination;
		var Dv = D.values;
		var debug = D.debugmode;
 
		/* inform author */
 
		if ( !Dv.authorInf ) {
			D.inform_w();
		}
		else {
			var secttitl_a = D.config.secttitl_a.replace('TITLE',wgTitle);
			var summary_a = D.config.summary_a.replace('TITLE',wgTitle);
			$.ajax({
				url : '/w/api.php',
				type : 'POST',
				data : {
					action : 'edit',
					format : 'json',
					title : (debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/autor' : 'Dyskusja wikipedysty:' + Dv.author),
					section : 'new',
					sectiontitle : secttitl_a,
					text : '{' + '{subst:Czy wiesz - autor0|tytuł strony='+wgTitle+'}} ~~' + '~~',
					summary : summary_a,
					watchlist : 'nochange',
					token : D.edittoken
				}
			})
			.done(function(data){
				if (debug) {
					console.log('autor_inf: komenda POST zakończona\nodpowiedź serwera:');
					console.log(data);
				}
				if (data.error) {
					D.errors.push('Błąd informowania autora: ' + data.error.info + '.');
					D.errors[0]();
					console.error('Błąd informowania autora: ' + data.error.info + '.');
					console.error(data);
				}
				else {
					D.inform_w();
				}
			})
			.fail(function(data){
				D.errors.push('Błąd informowania autora: $.ajax.fail().');
				D.errors[0]();
				console.error('Błąd informowania autora: $.ajax.fail().');
				console.error('URI: /w/api.php?action=edit&format=json&title='
					+ encodeURIComponent(debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/autor' : 'Dyskusja wikipedysty:' + Dv.author)
					+ '&section=new' 
					+ '&sectiontitle=' + encodeURIComponent(secttitl_a) 
					+ '&text=' + encodeURIComponent('{' + '{subst:Czy wiesz - autor0|tytuł strony='+wgTitle+'}}~~' + '~~') 
					+ '&summary=' + encodeURIComponent(summary_a) + '&token=' + encodeURIComponent(D.edittoken));
				console.error(data);
			});
		}
	}
 
	DYKnomination.inform_w = function () {
 
		var D = DYKnomination;
		var Dv = D.values;
		var debug = D.debugmode;
		var i,summary_w,secttitl_w;
 
		// for debugging purposes (because of this -> later czy_talk will be true)
		if (debug) D.wikiprojects.list2.push(
			{
				label : 'Wikipedysta:Kaligula/js/CzyWiesz.js/wikiprojekt',
				page  : 'Wikipedysta:Kaligula/js/CzyWiesz.js/wikiprojekt',
				type  : 'talk'
			}
		);
 
		/* inform chosen wikiprojects */
 
		if ( Dv.wikiproject.length == 0 ) {
			D.success();
		}
		else {
			// chosen wikiprojects
			D.wikiprojects.counter = 1; //declared again in case user wants to try again nominating article without reloading (e.g. after an error)
			summary_w = D.config.summary_w.replace('TITLE',wgTitle);
			secttitl_w = D.config.secttitl_w.replace('TITLE',wgTitle);
 
			for (var i=0;i<Dv.wikiproject.length;i++) {
				var wnr = -1;
				//check if wikiproject wants to be informed other way than 'section=new'
				//(wnr=) -1 means 'no', any other number means 'yes' and is a number of the wikiproject in D.wikiprojects.list2
				$(D.wikiprojects.list2).each(function(n){
					if (this.label == Dv.wikiproject[i]) wnr=n;
				});
 
				var czy_talk;
				czy_talk = (wnr >= 0) && (D.wikiprojects.list2[wnr].type=='talk');
				var obj;
				if (czy_talk) {
				//if report type is 'section=new' then add new section
				//DEBUG: debug page 'Wikipedysta:Kaligula/js/CzyWiesz.js/wikiprojekt' gets here, because now it's on list2
					obj = {
						url : '/w/api.php',
						type : 'POST',
						data : {
							action : 'edit',
							format : 'json',
							title : (debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/wikiprojekt' : 'Dyskusja wikiprojektu:' + Dv.wikiproject[i]),
							section : 'new',
							sectiontitle : secttitl_w,
							text : '{' + '{Czy wiesz - wikiprojekt|' + wgTitle + '}} ~~' + '~~',
							summary : summary_w,
							watchlist : 'nochange',
							token : D.edittoken
						}
					}
				}
				else {
				//if report type is not 'section=new' then get page source [to edit]
					obj = {
						url : '/w/index.php?action=raw&title='
							+ encodeURIComponent(wnr<0 ? 'Wikiprojekt:'+Dv.wikiproject[i] : D.wikiprojects.list2[wnr].page),
						cache : false
					}
					summary_w = '/* Czy wiesz */ nowe zgłoszenie: [[' + wgTitle + ']]';
				}
 
				(debug ? console.log('obj:') : '');
				(debug ? console.log(obj) : '');
 
				$.ajax(obj)
				.done(function(data){
					if (debug) {
						console.log('wikiprojekt['+i+']: komenda POST' + (czy_talk?'':'(cz. 1.)') + ' zakończona\nodpowiedź serwera:');
						console.log(data);
					}
					if (data.error) {
						D.errors.push('Błąd informowania '+(i+1)+'-go wikiprojektu' + (czy_talk?'':'(cz. 1.)') + ': ' + data.error.info + '.');
						D.errors[0]();
						console.error('Błąd informowania '+(i+1)+'-go wikiprojektu' + (czy_talk?'':'(cz. 1.)') + ': ' + data.error.info + '.');
						console.error(data);
					}
					else {
						if (czy_talk) {
						//if report type is 'section=new' then this wikiproject is done
							D.loadbar();
							D.wikiprojects.counter++;
							if (D.wikiprojects.counter>Dv.wikiproject.length) {
								D.success();
							}
						}
						else {
						//if report type is not 'section=new' then now we need to save the page
							if (!data.match('<!-- Nowe zgłoszenia CzyWiesza wstawiaj poniżej tej linii. Nie zmieniaj i nie usuwaj tej linii -->')) {
								data = data.replace('[[Kategoria:','== Czy wiesz ==\n<!-- Nowe zgłoszenia CzyWiesza wstawiaj poniżej tej linii. Nie zmieniaj i nie usuwaj tej linii -->\n\n[[Kategoria:');
							}
 
							data = data.replace('<!-- Nowe zgłoszenia CzyWiesza wstawiaj poniżej tej linii. Nie zmieniaj i nie usuwaj tej linii -->',
								'<!-- Nowe zgłoszenia CzyWiesza wstawiaj poniżej tej linii. Nie zmieniaj i nie usuwaj tej linii -->\n'
								+ '{' + '{Czy wiesz - wikiprojekt|' + wgTitle + '}}')
							$.ajax({
								url : '/w/api.php',
								type : 'POST',
								data: {
									action: 'edit',
									format: 'json',
									title:  D.wikiprojects.list2[wnr].page,
									text:   data,
									summary: summary_w,
									watchlist: 'nochange',
									token:  D.edittoken
								}
							})
							.done(function(data2){
								if (debug) {
									console.log('wikiprojekt['+i+']: komenda POST' + (czy_talk?'':'(cz. 2.)') + ' zakończona\nodpowiedź serwera:');
									console.log(data2);
								}
								if (data2.error) {
									D.errors.push('Błąd informowania '+(i+1)+'-go wikiprojektu' + (czy_talk?'':'(cz. 2.)') + ': ' + data2.error.info + '.');
									D.errors[0]();
									console.error('Błąd informowania '+(i+1)+'-go wikiprojektu' + (czy_talk?'':'(cz. 2.)') + ': ' + data2.error.info + '.');
									console.error(data2);
								}
								else {
									D.loadbar();
									D.wikiprojects.counter++;
									if (D.wikiprojects.counter>Dv.wikiproject.length) {
										D.success();
									}
								}
							})
							.fail(function(data2){
								D.errors.push('Błąd informowania '+(i+1)+'-go wikiprojektu' + (czy_talk?'':'(cz. 2.)') + ': $.ajax.fail().');
								D.errors[0]();
								console.error('Błąd informowania '+(i+1)+'-go wikiprojektu' + (czy_talk?'':'(cz. 2.)') + ': $.ajax.fail().');
								console.error('URI: ' + obj.url);
								console.error(data2);
							});
						}
					}
				})
				.fail(function(data){
					D.errors.push('Błąd informowania '+(i+1)+'-go wikiprojektu' + (czy_talk?'':'(cz. 1.)') + ': $.ajax.fail().');
					D.errors[0]();
					console.error('Błąd informowania '+(i+1)+'-go wikiprojektu' + (czy_talk?'':'(cz. 1.)') + ': $.ajax.fail().');
					console.error('URI: ' + obj.url);
					console.error(data);
				});
			}
		}
	}
 
	DYKnomination.success = function () {
		var D = DYKnomination;
		var debug = D.debugmode;
 
		if (D.errors.length == 1) { //first element in errors is a nested function
			D.loadbar('done');
 
			// end dialog: "Finished!"
			$('<div><div class="floatright">' + D.config.CWicon + '</div><p style="margin-top: 10px;">' + D.config.tmpldone + '</p>'
				+ '<p style="margin-left: 10px;">Dziękujemy za <a id="CzyWieszLinkAfter" href="//pl.wikipedia.org/wiki/' 
				+ (debug ? 'Wikipedysta:Kaligula/js/CzyWiesz.js/test#' : 'Wikiprojekt:Czy_wiesz/propozycje#') + wgTitle.replace(/ /g,'_') + '" class="external">zgłoszenie</a>,<br />'
				+ '<a href="/wiki/Wikiprojekt:Czy_wiesz" title="Wikiprojekt:Czy wiesz">Wikiprojekt Czy wiesz</a></p></div>')
			.dialog({ modal: true, dialogClass: "wikiEditor-toolbar-dialog", close: function() { $(this).dialog("destroy"); $(this).remove(); $('#CzyWieszGadget').dialog("destroy"); $('#CzyWieszGadget').remove();} });
		}
	}
 
 
$(document).ready(function() {
	var menulink = $('<li id="t-DYKnomination"><a onclick="DYKnomination.askuser();">Zgłoś do „Czy wiesz…”</a></li>').css({cursor: 'pointer'});
	if ($('#t-ajaxquickdelete')[0]) {$('#t-ajaxquickdelete').after(menulink);}
	else {$('#p-tb ul').append(menulink);}
});
 
 
 
}
else {
	DYKnomination.error = 'The page is not an article. You cannot nominate this page.';
}