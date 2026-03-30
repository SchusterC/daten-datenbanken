/*
 *
 * WebWeaverÆ Courselets JavaScript Library
 *
 * Copyright 1998-2026 DigiOnline GmbH
 *
 * https://www.digionline.de
 * https://www.webweaver.de
 *
 */

"use strict";

function object_courselet() {
  var C=this;
  this.first_page_id=null; // ID erster Seite (evtl. erster mit Inhalt)
  this.page_id=null; // ID geladener Seite
  this.p_page_features=null;
  this.p_history=[]; // Aufgerufene Seiten (wird nicht gespeichert)
  this.p_edit=false; // Editiermarken anzeigen
  this.p_suite=true; // laeuft innerhalb WebWeaver Suite
  this.p_app=false; // laeuft innerhalb einer App (mit Schnittstelle), >1 == Maximale Anzahl Zeichen in der URL
  this.p_scorm=false; // Laeuft als SCORM-Paket (false, SCORM_SINGLE, SCORM_MULTI)
  this.p_skip_load_suspend_data=false; // Keine Suspend-Daten vorhanden, Laden ueberspringen
  this.p_params=null; // run() uebergebene Parameter
  this.p_xarr_courselet=null; // XArray: Courselet
  this.p_xarr_page=null; // XArray: Geladene Seite
  this.p_xarr_blocks=null; // XArray: Bloecke
  this.p_xids=null; // Object: Bloecke und Elemente (nach Zeichnen)
  this.p_xarr_meta={}; // XArray: Meta-Block der Seite
  this.p_xarr_timer=null; // XArray: Timer
  this.p_xarr_pages=null; // XArray: Seiten als Baum
  this.p_xarr_pages_flat=null; // XArray: Seiten flach
  this.p_xarr_pages_page=null; // XArray: geladene Seite im Baum
  this.p_ids_page=null; // IDs=>XArray: Seite
  this.p_ids_pages=null; // IDs=>XArray: Seiten
  this.p_ids_resources=null; // IDs=>XArray: Ressourcen (im Package-Modus)
  this.p_current_scores={}; // Aktuell erreichte Scores (ueberschreibt leeren Score bei combined in p_init_pages, insbesondere fuer anonyme Nutzer)
  this.p_results_basis=null; // Basis fuer Ergebnisse: "last" oder "best"
  this.p_epoch_delta=0;
  this.p_epoch_page_start=null; // Wann wurde die Seite geladen?
  this.p_epoch_limit=null; // Bis wann darf das Courselet bearbeitet werden?
  this.p_state={ // Status gesamtes Courselet
    is_locked: null,     // Courselet gegen Bearbeitung gesperrt
    is_timed_out: null  // Bearbeitungszeit abgelaufen
  };
  this.p_is_exercise=false; // Seite hat Aufgaben
  this.p_max_attempts=-1; // Maximale Anzahl Versuche
  this.p_is_read_only=false; // Seite ist read-only
  this.p_result=null; // Ergebnis (1.0 = alles richtig)
  this.p_click_areas=null; // Liste aller "Click-Areas" [id_block,id_element,Fadenkreuz-x,Fadenkreuz-y,Klickstelle coords,@shape,clickable,@evaluation,@clickable]
  this.p_block_feedback_attempts; // Feedback-Bloecke fuer diese Versuche definiert?
  this.p_last_input=null; // Letzte "Eingabe" in einer Uebung (fuer Feedback nach Eingabe)
  this.p_load_error=null; // Fehler beim Laden
  this.p_reposition_objects=null; // DOM-Objekte, die an anderen ausgerichtet sind und mit diesen verschoben und ggf. skaliert werden sollen
  this.p_marked_events=null; // Vergemerkte Events beim Generieren der Seite
  this.p_preview_results=false; // Loesungen anzeigen
  this.p_page_uses_suspend_data=false; // Seite benutzt Suspend-Daten
  this.p_suspend_data=null; // SCORM bzw. Courselet-Daten
  this.p_loaded_results=null; // Geladene Results (App-Modus)
  this.p_current_suspend_data=null; // Aktuelle SCORM bzw. Courselet-Daten als JSON
  this.p_flash_detected=null; // Ergebnis Flash-Detection
  this.p_subtitles=false; // Subtitles verwendet?
  this.p_mathjax_loaded=false; // MathJax eingebunden
  this.p_corrector_mode=0; // Korrektur-Modus: 0=aus, 1=Lerner (nach Feedback durch Tutor), 2=Tutor
  this.p_instructor_mode=false; // Lehrer-Modus: Didaktische Hinweise anzeigen
  this.p_is_ios=navigator.platform.match(/iPad|iPhone|iPod/); // *grmpf*
  this.courselet=this; // Fuer Methoden-Aufrufe in window (global) und lokal
  this.p_was_touch=false; // Touch-Event gesehen?
  this.translations={
    button_evaluation: /**@tr:courselets_js_button_evaluation{{{*/{"en":"Evaluation","de":"Auswertung","fr":"Valider","es":"EvaluaciÛn","it":"Valutazione","tr":"Degerlendirme","hsb":"wuhÛdnocenje","uk":"??????","rm":"Evaluaziun"}/**}}}*/,
    button_reflection: /**@tr:courselets_js_button_reflection{{{*/{"en":"Finish","de":"Beenden","fr":"Finir","es":"Finalizar","it":"Finisci","tr":"Bitirmek","hsb":"skÛncic","uk":"?????????","rm":"Finir"}/**}}}*/,
    only_one_attempt: /**@tr:courselets_js_only_one_attempt{{{*/{"en":"This exercise can only be done once.","de":"Diese Aufgabe kann nur einmal bearbeitet werden.","fr":"Cet exercice ne peut Ítre rÈalisÈ qu\"une seule fois.","es":"Este ejercicio sÛlo se puede realizar una vez.","it":"Questo esercizio puÚ essere lavorato solo una volta.","tr":"Bu Gˆrev sadece bir kez islenebilir.","hsb":"TutÛn nadawk mÛûece jenoû jÛnu wobdzelac.","uk":"?? ???????? ????? ???????? ???? ???? ???.","rm":"Quest pensum po vegnir elavur‡ mo ina giada. "}/**}}}*/,
    read_only: /**@tr:courselets_js_read_only{{{*/{"en":"This task is already completed.","de":"Diese Aufgabe wurde bereits bearbeitet.","fr":"Cette t‚che a dÈj‡ ÈtÈ traitÈe.","es":"Este ejercicio ya se ha realizado","it":"Questo compito Ë gi‡ stato elaborato.","tr":"Bu ÷dev hen¸z d¸zenlenmedi.","hsb":"TutÛn nadawk je hiûo wobdzelany.","uk":"?? ???????? ??? ?????????.","rm":"Quest pensum Ë gia elavur‡. "}/**}}}*/,
    target_not_found: /**@tr:courselets_js_target_not_found{{{*/{"en":"The specified target was not found.","de":"Das angegebene Ziel wurde nicht gefunden.","fr":"La destination choisie n\"a pas ÈtÈ trouvÈe.","es":"No se encontrÛ el destino indicado.","it":"L\"oggetto indicato non Ë stato trovato.","tr":"Tanimlanan hedef bulunamadi","hsb":"Podaty cil njebu namakany.","uk":"??????? ???? ?? ????????.","rm":"Betg chatt‡ la destinaziun tschertgada. "}/**}}}*/,
    link_next_page: /**@tr:courselets_js_link_next_page{{{*/{"en":"Continue with \"%1\"","de":"Weiter mit \"%1\"","fr":"Continuer avec \"%1\"","es":"Continuar con \"%1\"","it":"Segue con \"%1\"","tr":"\"%1\" ile devam","hsb":"dale z \"%1\"","uk":"?????????? ? \"%1\"","rm":"Vinavant cun \"%1\""}/**}}}*/,
    button_next_page: /**@tr:courselets_js_button_next_page{{{*/{"en":"Continue","de":"Weiter","fr":"Continuer","es":"Continuar","it":"Continuare","tr":"Devam etmek","hsb":"dale","uk":"????","rm":"Vinavant"}/**}}}*/,
    button_back: /**@tr:courselets_js_button_back{{{*/{"en":"Back","de":"Zur¸ck","fr":"Retour","es":"Volver","it":"Indietro","tr":"Geri","hsb":"wrÛco","uk":"?????","rm":"Enavos"}/**}}}*/,
    help: /**@tr:courselets_js_help{{{*/{"en":"Help","de":"Hilfe","fr":"Aide","es":"Ayuda","it":"Aiuto","tr":"Yardim","hsb":"pomoc","uk":"???????","rm":"Agid"}/**}}}*/,
    date: /**@tr:courselets_js_date{{{*/{"en":"d/m/Y","de":"d.m.Y","fr":"d/m/Y","es":"d-m-Y","it":"d-m-Y","tr":"d.m.Y","hsb":"dz.m.l","uk":"?.?.?","rm":"d-m-Y"}/**}}}*/,
    time: /**@tr:courselets_js_time{{{*/{"en":"H:i","de":"H:i","fr":"H:i","es":"H:i","it":"H:i","tr":"H:i","hsb":"H:i","uk":"H:i","rm":"H:i"}/**}}}*/,
    overview_passed: "%1",
    overview_passed_failed: "%1",
    overview_score: "%1",
    overview_percent: "%5 %",
    overview_score_score_max: "%1 / %2",
    overview_score_score_max_attempts: /**@tr:courselets_js_overview_score_score_max_attempts{{{*/{"en":"%1 / %2 in %3 attempt(s)","de":"%1 / %2 in %3 Versuch(en)","fr":"%1 / %2 en %3 essais","es":"%1 / %2 en %3 intento(s)","it":"%1 / %2 in %3 prova(e)","tr":"%3 Denemede %1 / %2 in","hsb":"%1 / %2 wot %3 pospytow","uk":"%1 / %2 ?? ???? ????????? ?????: %3","rm":"%1 / %2 en %3 emprova(s) "}/**}}}*/,
    overview_score_score_max_time: /**@tr:courselets_js_overview_score_score_max_time{{{*/{"en":"%1 / %2 in %4 second(s)","de":"%1 / %2 in %4 Sekunde(n)","fr":"%1 / %2 en %4 secondes","es":"%1 / %2 en %3 segundo(s)","it":"%1 / %2 in %4 secondo(i)","tr":"%4 Saniyede %1 / %2","hsb":"%1 / %2 za %4 sek. ","uk":"%1 / %2 ?? %4 ?","rm":"%1 / %2 en %4 secunda(s)"}/**}}}*/,
    loading: /**@tr:courselets_js_loading{{{*/{"en":"Please wait!","de":"Bitte warten!","fr":"Merci de patienter!","es":"Espere por favor.","it":"Attendere, per cortesia!","tr":"L¸tfen Bekleyin!","hsb":"Proöu cakajce!","uk":"?????????!","rm":"P.pl. spetgar!"}/**}}}*/,
    standalone: /**@tr:courselets_js_standalone{{{*/{"en":"Stand-alone mode: No results are transmitted.","de":"Lokaler Modus: Es wird kein Ergebnis ¸bertragen.","fr":"Mode local: aucune transmission de rÈsultats.","es":"Modo local: No se transmiten resultados.","it":"Modo stand-alone: Nessun risultato viene trasmesso.","tr":"Yerel Mod¸l: SonuÁ tasinmayacak.","hsb":"lokalny modus: Wusledk so njeposredkuje.","uk":"????????? ?????: ????????? ?? ???? ????????.","rm":"Modus local: i na vegn tramess nagin resultat. "}/**}}}*/,
    time_limit_reached: /**@tr:courselets_js_time_limit_reached{{{*/{"en":"Your working time has expired.","de":"Ihre Bearbeitungszeit ist abgelaufen.","fr":"Votre temps de traitement est ÈcoulÈ.","es":"Su tiempo de procesamiento ha expirado.","it":"Il tuo tempo di elaborazione Ë scaduto.","hsb":"Cas za wobdzelanje je nimo.","uk":"??? ??? ??????? ??????????.","rm":"Voss temp da modificaziun Ë scadÏ. "}/**}}}*/,
    nav_error_scorm: /**@tr:courselets_js_nav_error_scorm{{{*/{"en":"SCORM mode: No internal navigation is possible. Please use the navigation elements of your LMS.","de":"SCORM-Modus: Eine interne Navigation ist nicht mˆglich. Bitte verwenden Sie die Navigationselemente Ihres LMS.","fr":"Mode SCORM: navigation interne impossible. Veuillez utiliser les ÈlÈments de navigation de votre plateforme de formation ‡ distance (LMS).","es":"Modo SCORM: No es posible una navegaciÛn interna. Por favor, utilize los elementos de navegaciÛn de su sistema de gestiÛn del aprendizaje (LMS).","it":"Modalit‡ SCORM: la navigazione interna non Ë possibile. Utilizzare gli elementi di navigazione del proprio LMS.","tr":"SCORM-Mod¸l¸: SistemiÁi yˆnlendirme m¸mk¸n degil. L¸tfen ÷grenim Yˆnetim Sisteminize (LMS) ait yˆnlendirme unsurlarini kullanin.","hsb":"SCORM-modus: Interna nawigacija njendze. Proöu wuûiwajce nawigaciske elementy swojeho LMS.","uk":"????? SCORM: ????????? ????????? ?????????. ?????????????? ???????? ????????? ????? ??????? LMS.","rm":"Modus SCORM: Ina navigaziun interna níË betg pussaivla. P.pl. duvrar ils elements da navigaziun da Voss LMS."}/**}}}*/,
    load_error_access_denied: "Access denied",
    load_error_courselet_not_found: "Courselet not found",
    load_error_no_valid_license: /**@tr:courselets_js_load_error_no_valid_license{{{*/{"en":"No valid licence found.","de":"Es wurde leider keine nutzbare Lizenz gefunden.","fr":"Aucune licence valable trouvÈe.","es":"No se encuentra una licencia v·lida.","it":"Non esiste una licenza valida.","tr":"GeÁerli bir lisans bulunamadi","hsb":"ûana wuûiwajomna licenca ","uk":"?? ????, ?????? ???????? ?? ????????.","rm":"Betg chatt‡ ina licenza valaivla."}/**}}}*/,
    load_error_general: "Unknown error while loading.",
    save_error_general: /**@tr:courselets_js_save_error_general{{{*/{"en":"The changes couldn't be saved.","de":"Die ƒnderungen konnten nicht gespeichert werden.","fr":"Les modifications n'ont pu Ítre sauvegardÈes.","es":"No se pudieron guardar las modificaciones","it":"Impossibile rinominare l'oggetto","tr":"Degisiklikler kaydedilemedi","hsb":"Zmeny njehodzachu so skladowac.","uk":"?? ??????? ???????? ?????.","rm":"Betg pussaivel da memorisar las midadas. \n"}/**}}}*/,
    manual_score_ok: /**@tr:courselets_js_manual_score_ok{{{*/{"en":"\u2714","de":"Speichern","fr":"\u2714","es":"\u2714","it":"\u2714","tr":"\u2714","hsb":"skladowac","uk":"????????","rm":"Memorisar"}/**}}}*/,
    corr_selection: /**@tr:courselets_js_corr_selection{{{*/{"en":"Selection","de":"Auswahl","fr":"Choix","es":"SelecciÛn","it":"Scelta","tr":"SeÁenek","hsb":"wuber","uk":"?????","rm":"Selecziun"}/**}}}*/,
    corr_placement_before: /**@tr:courselets_js_corr_placement_before{{{*/{"en":"Insert before selection","de":"Vor dem Text einf¸gen","fr":"InsÈrer avant le texte","es":"Insertar antes del texto","it":"Inserire prima del testo","hsb":"pred tekstom zasadzic","uk":"???????? ????? ???????","rm":"Inserir davant il text"}/**}}}*/,
    corr_placement_after: /**@tr:courselets_js_corr_placement_after{{{*/{"en":"Insert after selection","de":"Nach dem Text einf¸gen","fr":"InsÈrer aprËs le texte","es":"Insertar despuÈs del texto","it":"Inserire dopo il testo","hsb":"za tekstom zasadzic","uk":"???????? ????? ??????","rm":"Inserir suenter il text"}/**}}}*/,
    corr_correction: /**@tr:courselets_js_corr_correction{{{*/{"en":"Correction","de":"Korrektur","fr":"Juste","es":"CorrecciÛn","it":"Corretto","tr":"Dogru","hsb":"korektura","uk":"???????????","rm":"Correctura"}/**}}}*/,
    corr_explanation: /**@tr:courselets_js_corr_explanation{{{*/{"en":"Explanation","de":"Erkl‰rung","fr":"Explication","es":"ExplicaciÛn","it":"Spiegazione","tr":"AÁiklama","hsb":"wujasnjenje","uk":"?????????"}/**}}}*/,
    corr_classification: /**@tr:courselets_js_corr_classification{{{*/{"en":"Classification","de":"Klassifizierung","fr":"Classification","es":"ClasificaciÛn","it":"Classificazione","tr":"Siniflandirma","hsb":"klasifikowanje","uk":"????????????","rm":"Classificaziun"}/**}}}*/,
    corr_mobile_warning: /**@tr:courselets_js_corr_mobile_warning{{{*/{"en":"This may not be fully reproducible on mobile devices.","de":"Auf Mobilger‰ten mˆglicherweise nicht vollst‰ndig darstellbar.","fr":"Ceci ne peut pas Ítre entiËrement reproduit sur un appareil mobile.","es":"Posiblemente no reproducible completamente en dispositivos mÛviles.","it":"Non puÚ essere completamente riprodotto su un apparecchio mobile.","hsb":"na mobilnych nastrojach njeje snadz dospolnje widzec","uk":"???? ?? ???????? ????????????? ?? ????????? ?????????.","rm":"Na vegn forsa betg visualis‡ correctamain sin apparats mobils. "}/**}}}*/,
    corr_save: /**@tr:courselets_js_corr_save{{{*/{"en":"Complete correction","de":"Korrektur beenden","fr":"Terminer la correction","es":"Finalizar correcciÛn","it":"Completare la correzione","tr":"Kaydet","hsb":"korekturu skÛncic","uk":"????????? ???????????","rm":"Terminar la correctura"}/**}}}*/,
    corr_ok: /**@tr:courselets_js_corr_ok{{{*/{"en":"\u2714","de":"‹bernehmen","fr":"\u2714","es":"\u2714","it":"\u2714","tr":"\u2714","hsb":"prewzac","uk":"?????????","rm":"Surpigliar"}/**}}}*/,
    corr_cancel: /**@tr:courselets_js_corr_cancel{{{*/{"en":"\u2718","de":"Verwerfen","fr":"\u2718","es":"\u2718","it":"\u2718","tr":"\u2718","hsb":"zacisnyc","uk":"???????","rm":"Ignorar"}/**}}}*/,
    corr_class_3: "\u23A1",
    corr_class_4: "\u2500\u2500",
    conv_add: /**@tr:courselets_js_conv_add{{{*/{"en":"Write feedback","de":"Feedback schreiben","fr":"…crire un feedback","es":"Escribir feedback","it":"Scrivere un feedback","tr":"Yaz","hsb":"feedback pisac","uk":"???????? ??????","rm":"Scriver in resun"}/**}}}*/,
    conv_reply: /**@tr:courselets_js_conv_reply{{{*/{"en":"Reply","de":"Antworten","fr":"RÈpondre","es":"Responder","it":"Rispondi","tr":"Cevap yaz","hsb":"wotmolwic","uk":"?????????","rm":"Respostas"}/**}}}*/,
    conv_ok: /**@tr:courselets_js_conv_ok{{{*/{"en":"\u2714","de":"\u2714","fr":"\u2714","es":"\u2714","it":"\u2714","tr":"\u2714","hsb":"\u2714","uk":"\u2714","rm":"\u2714"}/**}}}*/,
    conv_cancel: /**@tr:courselets_js_conv_cancel{{{*/{"en":"\u2718","de":"\u2718","fr":"\u2718","es":"\u2718","it":"\u2718","tr":"\u2718","hsb":"\u2718","uk":"\u2718","rm":"\u2718"}/**}}}*/,
    vocabulary_trainer_right: /**@tr:courselets_js_vocabulary_trainer_right{{{*/{"en":"\u2714","de":"\u2714","fr":"\u2714","es":"\u2714","it":"\u2714","tr":"\u2714","hsb":"\u2714","uk":"\u2714","rm":"\u2714"}/**}}}*/, // css: text-indent:-99px;
    vocabulary_trainer_wrong: /**@tr:courselets_js_vocabulary_trainer_wrong{{{*/{"en":"\u2718","de":"\u2718","fr":"\u2718","es":"\u2718","it":"\u2718","tr":"\u2718","hsb":"\u2718","uk":"\u2718","rm":"\u2718"}/**}}}*/,
    usermedia_denied: /**@tr:courselets_js_usermedia_denied{{{*/{"en":"Local media devices can not be accessed.","de":"Auf lokale Medien-Ger‰te kann nicht zugegriffen werden.","fr":"Les pÈriphÈriques multimÈdia locaux ne sont pas accessibles.","es":"No se puede acceder a dispositivos de medios locales.","it":"Le periferiche multimediali locali non sono accessibili.","hsb":"éadyn pristup k lokalnym nastrojam.","uk":"????????? ???????? ?????? ?? ????????? ??????????????.","rm":"Ils apparats multimedials locals níËn betg accessibels."}/**}}}*/,
    usermedia_error: /**@tr:courselets_js_usermedia_error{{{*/{"en":"Your Browser does not support UserMedia.","de":"Ihr Browser unterst¸tzt kein UserMedia.","fr":"Votre navigateur ne supporte pas la technologie UserMedia.","es":"Su navegador no soporta UserMedia.","it":"Il vostro browser non sopporta la tecnologia UserMedia.","hsb":"Waö browser njepodperuje UserMedia.","uk":"??? ??????? ?? ????????? ????????????? ?????.","rm":"Voss navigatur na sustegna nagin UserMedia."}/**}}}*/,
    edit_meta: /**@tr:courselets_js_edit_meta{{{*/{"en":"Edit meta data","de":"Metadaten bearbeiten","fr":"Modifier les mÈtadonnÈes","es":"Editar los metadatos","it":"Modifica dei metadati","hsb":"metadaty wobdzelac","uk":"?????????? ????????","rm":"Elavurar las metadatas"}/**}}}*/,
    edit_block: /**@tr:courselets_js_edit_block{{{*/{"en":"Edit block","de":"Block bearbeiten","fr":"Modifier le bloc","es":"Editar bloque","it":"Modifica blocco","hsb":"blok wobdzelac","uk":"?????????? ????","rm":"Elavurar il bloc"}/**}}}*/,
    edit_element: /**@tr:courselets_js_edit_element{{{*/{"en":"Edit element","de":"Element bearbeiten","fr":"Modifier un ÈlÈment","es":"Editar elemento","it":"Modifica elemento","hsb":"element wobdzelac","uk":"?????????? ???????","rm":"Modifitgar in element"}/**}}}*/,
    mix_and_match_button: /**@tr:courselets_js_mix_and_match_button{{{*/{"en":"\u2714","de":"Lˆsen","fr":"\u2714","es":"\u2714","it":"\u2714","tr":"\u2714","hsb":"prewzac","uk":"\u2714","rm":"Schliar \u2714"}/**}}}*/,
    dummy: { "en":"", "de":"", "fr":"", "es":"", "it":"", "tr":""},
    bottom:0
  };
  this.src_suite={
    path: '../pics/courselets',  
    feedback: '../pics/courselets/i_feedback.svg',
    right: '../pics/courselets/i_right.svg',
    wrong: '../pics/courselets/i_wrong.svg',
    neutral: '../pics/courselets/i_neutral.svg',
    undone: '../pics/courselets/i_undone.svg',
    passed: '../pics/courselets/i_passed.svg',
    failed: '../pics/courselets/i_failed.svg',
    audio_play: '../pics/courselets/i_audio_play.svg',
    audio_pause: '../pics/courselets/i_audio_pause.svg',
    audio_disabled: '../pics/courselets/i_audio_disabled.svg',
    record_record: '../pics/courselets/i_record_record.svg',
    record_stop: '../pics/courselets/i_record_stop.svg',
    record_play: '../pics/courselets/i_record_play.svg',
    record_pause: '../pics/courselets/i_record_pause.svg',
    crosshairs: '../pics/courselets/m_crosshairs.svg',
    mathjax: '/misc/mathjax/MathJax.js',
    bottom:0
  };
  this.src_package={
    path: 'assets/icons',  
    feedback: 'assets/icons/i_feedback.svg',
    right: 'assets/icons/i_right.svg',
    wrong: 'assets/icons/i_wrong.svg',
    neutral: 'assets/icons/i_neutral.svg',
    undone: 'assets/icons/i_undone.svg',
    passed: 'assets/icons/i_passed.svg',
    failed: 'assets/icons/i_failed.svg',
    audio_play: 'assets/icons/i_audio_play.svg',
    audio_pause: 'assets/icons/i_audio_pause.svg',
    audio_disabled: 'assets/icons/i_audio_disabled.svg',
    record_record: 'assets/icons/i_record_record.svg',
    record_stop: 'assets/icons/i_record_stop.svg',
    record_play: 'assets/icons/i_record_play.svg',
    record_pause: 'assets/icons/i_record_pause.svg',
    crosshairs: 'assets/icons/m_crosshairs.svg',
    mathjax: 'https://www.lernsax.de/misc/mathjax/MathJax.js', // Wird nur aufgerufen, wenn auch Formeln eingebunden sind, http://www.mathjax.org
    xml: 'courselet.xml',
    bottom:0
  };
  this.src=function(ident) {
    var arr;
    if(this.p_suite) {
      arr=this.src_suite;
    } else {
      arr=this.src_package;
    }
    if(ident) {
      return this.ie_edge_fix(arr[ident]);
    } else {
      return arr;
    }
  };
  this.ajax_call_running=false;
  this.waiting_for_ajax=[];
  $(document).ajaxStart(function() {
    C.ajax_call_running=true;
    C.after_ajax(function() {
      C.d('AJAX finished.');
    });
    C.d('AJAX started.');
  });
  $(document).ajaxStop(function() {
    C.ajax_call_running=false;
    for(var i in C.waiting_for_ajax) {
      C.waiting_for_ajax[i]();
    }
    C.waiting_for_ajax=[];
  });
  this.after_ajax=function(f) {
    if(this.ajax_call_running) {
      this.waiting_for_ajax.push(f);
    } else {
      f();
    }
  };
  this.ie_edge_fix=function(url) {
    if(url && url.match(/\.svg$/) && navigator.userAgent.match(/Edge|Trident/)) {
      url+='#ie_edge_fix_'+new Date().getTime();
    }
    return url;
  };
  this.p_init_parts={};
  this.p_init=function(part) { // Wird mehrfach aufgerufen
    if(!this.p_init_parts[-1]) {
      this.p_init_parts[part]=true;
      this.d('Initialized',this.p_init_parts);
      if(this.p_init_parts[1] && this.p_init_parts[2]) {
        if(this.p_init_parts[3] && (!(this.p_app || this.p_scorm) || this.p_init_parts[4])) {
          this.p_init_parts[-1]=true;
          this.d('Initialization completed.');
          this.p_first_load();
        } else if(!this.p_init_parts[3] && !this.p_init_parts[4]) {
          this.p_load_suspend_data();
          if(this.p_app || this.p_scorm) {
            this.p_load_results();
          }
        }
      }
    }
  };
  this.run=function(params) { // Diese Methode wird von aussen aufgerufen, Parameter: dom_id_courselet, url_page, url_talkback, page_id, url_page_format, dom_id_breadcrumb, scorm, locale, user_name, user_id
    this.p_params=params?params:{};
    // alert(JSON.stringify(params));
    if(this.p_params['epoch']) {
      var t=this.to_int(this.p_params['epoch']);
      if(t && (t>1595517888) && (t<4120039486) && (this.to_string(t)===this.to_string(this.p_params['epoch']))) {
        this.p_epoch_delta=(t-this.epoch());
      }
    }
    if(!this.p_params['locale']) {
      var t_lang=navigator.language?navigator.language:navigator.browserLanguage;
      if(t_lang) {
        this.p_params['locale']=t_lang.substr(0,2).toLowerCase();
      }
    }
    if(!this.p_params['dom_id_courselet']) {
      this.p_params['dom_id_courselet']='courselet';
    }
    if(!this.p_params['dom_id_breadcrumb']) {
      this.p_params['dom_id_breadcrumb']='courselet_breadcrumb';
    }
    // this.p_params['dom_id_translations']
    // this.p_params['prevent_wraparound']
    if(!this.p_params['url_page']) { // SCORM + STANDALONE
      this.p_suite=false;
      if(!this.p_params['url_page_format']) {
        this.p_params['url_page_format']='xml';
      }
    }
    if(!this.p_params['url_page_format']) {
      this.p_params['url_page_format']='json';
    }
    if(this.p_params['scorm']) {
      this.p_scorm=(this.p_params['scorm']==='SCORM_SINGLE')?'SCORM_SINGLE':'SCORM_MULTI';
    }
    if(this.p_params['app']) {
      this.p_app=this.p_params['app'];
      this.p_suite=false;
    }
    this.p_preview_results=this.p_params['author_mode'] && (this.p_params['author_mode'] & 1);
    this.p_edit=this.p_params['author_mode'] && (this.p_params['author_mode'] & 2);
    if(this.p_edit && !this.p_params['app'] && !(0===this.p_params['app']) && !(false===this.p_params['app'])) {
      this.p_app=1;
    }
    if(!this.p_params['user_id']) {
      this.p_params['user_id']='anonymous';
    }
    if(!this.p_params['user_name']) {
      this.p_params['user_name']='Anonymous';
    }
    if(typeof(this.p_params['external_link_target'])==='undefined') {
      this.p_params['external_link_target']='_blank';
    }
    this.p_corrector_mode=this.p_params['corrector_mode']?2:0;
    this.p_instructor_mode=this.p_params['instructor_mode']?true:false;
    this.p_skip_load_suspend_data=this.p_params['skip_load_suspend_data']?true:false;
    // this.p_params['button_custom']
    this.p_init(1);
  };
  this.get_page_id=function() { // Von "aussen" Seiten-ID abfragen
    return this.page_id;
  };
  this.async_load_page=function(page_id) { // Von "aussen" bestimmte Seite asynchron laden
    window.setTimeout(function() {
      C.load_page(page_id);
    },50);
  };
  this.load_page=function(page_id) { // Von "aussen" bestimmte Seite laden
    this.p_load_page(page_id);
  };
  this.load_page_by_name=function(page_name) { // Von "aussen" bestimmte Seite laden
    this.p_load_page_by_name(page_name);
  };
  this.reload_page=function() { // Von "aussen" Seite erneut laden
    this.p_load_page(this.page_id);
  };
  this.meta_courselet=function() { // Von "aussen": Meta-Daten des Courselets
    var r={};
    try {
      var m=this.p_xarr_courselet['courselet'][0]['meta'][0];
      for(var p0 in m) {
        if(p0[0]!=='~') {
          r[p0]={};
          for(var p1 in m[p0][0]) {
            if(p1[0]!=='~') {
              r[p0][p1]=m[p0][0][p1][0][0];
            }
          }
        }
      }
    } catch(e) {
      alert(e);
    }
    return r;
  };
  this.meta_page=function() { // Von "aussen": Meta-Daten der Seite
    return this.xarray_properties(this.p_xarr_meta);
  };
  this.parameters=function() { // Von "aussen": Dem Courselet uebergebene (und berechnete) Parameter
    return this.p_params;
  };
  this.d=function(s0,s1) {
    if($('#debug').length) {
      var s=((typeof(s0)=='object')?JSON.stringify(s0):s0)+(s1?(': '+((typeof(s1)=='object')?JSON.stringify(s1):s1)):'');
      $('#debug').empty().text(s);
      console.log('Courselet: '+s);
      if($('#debug3').length) {
        $('#debug3').append($('<li></li>').text(s));
      }
    }
  };
  this.d2=function(o) {
    var $d2=$('#debug2');
    if($d2.length) {
      $('#debug2').empty().text(JSON.stringify(o,null,2)).css({whiteSpace:'pre-wrap'});
    }
  };
  this.event_document_loaded=function() {
    this.d(window.navigator.userAgent);
    this.d('jQuery '+($.fn?$.fn.jquery:'error'));
    this.p_init(2);
    this.d2($('body script').html());
  };
  this.p_cache_images=function() {
    this.p_image_cache={};
    for(var name in this.src()) {
      if(this.src(name) && this.src(name).match(/(gif|jpg|png|svg)$/)) {
        this.p_image_cache[name]=new Image();
        this.p_image_cache[name].src=this.src(name);
      }
    }
  };
  this.p_lg=function(id,p1,p2,p3,p4,p5) {
    var result='';
    if(this.p_params['dom_id_translations']) {
      result=$('#'+this.p_params['dom_id_translations']).find('.'+id+' [lang='+this.p_params['locale']+']').text();
    }
    if(!result) {
      if(this.translations[id]) {
        if(typeof(this.translations[id])=='object') {
          if(this.translations[id][this.p_params['locale']]) {
            result=this.translations[id][this.p_params['locale']];
          } else {
            result=this.translations[id].en;
          }
        } else {
          result=this.translations[id];
        }
      }
    }
    if(!result) {
      result='';
    }
    return result.replace(/%1/,p1).replace(/%2/,p2).replace(/%3/,p3).replace(/%4/,p4).replace(/%5/,p5);
  };
  this.p_create_id_counter=0;
  this.p_create_id=function() {
    return 'auto_id_'+(++this.p_create_id_counter);
  };

  this.p_interval=function() {
    this.p_page_methods.call('interval');
    if(this.p_epoch_page_start) {
      var epoch=this.epoch();
      var sec_from_start=(epoch-this.p_epoch_page_start);
      var $tlg=$('.time_left_global');
      if($tlg.length) {
        if(this.p_epoch_limit) {
          var t=this.p_epoch_limit-epoch;
          if(t<0) {
            t=0;
            if(!C.p_state.is_timed_out) {
              C.p_warning(C.p_lg('time_limit_reached'));
              if(C.p_is_exercise) {
                C.p_evaluate();
              }
              C.p_state.is_timed_out=true;
            }
          }
          $tlg.text(C.to_time_hr(t));
        }
      }
      if(this.p_xarr_timer && !this.p_xarr_timer['@timeout_triggered']) {
        var timeout=this.p_xarr_timer['@timeout'];
        if((timeout-sec_from_start)>0) {
          $('#courselet_timeout').html(Math.ceil(timeout-sec_from_start));
        } else {
          this.p_xarr_timer['@timeout_triggered']=true;
          // this.dump(this.p_xarr_timer);
          switch(this.p_xarr_timer['@mode']) {
            case 'evaluate_right':
              this.p_xarr_timer['@is_right']=true;
              this.p_evaluate();
              break;
            default:
              // alert('Unknown timer mode: '+this.p_xarr_timer['@mode']);
          }
          $('#courselet_timeout').html('Submit');
        }
      }
    }
  };

  this.$evt_feedback=null;

  this.hide_feedback=function() {
    if(this.$evt_feedback) {
      this.$evt_feedback.off('.courselet_feedback');
    }
    $('#courselet_element_feedback').remove();
  };

  this.show_feedback=function(evt,data) {
    if(!data) {
      data=evt.data;
    }
    if(data) {
      var evt_move=function(evt) {
        var $element=$('#courselet_element_feedback');
        if(!C.show_feedback_css) {
          C.show_feedback_css={
              p:  parseFloat($element.css('padding-top')),
              r:  parseFloat($element.css('border-top-left-radius')),
              fc: $element.css('background-color'),
              sc: $element.css('border-top-color'),
              sw: parseFloat($element.css('border-top-width')),
          };
          // C.d(C.show_feedback_css);
        }
        var css=C.show_feedback_css;
        var $window=$(window);
        $element.css({maxWidth:($window.width()*0.4)+'px',minWidth:css.r+'px'});
        var x=(evt.clientX?evt.clientX:0);
        var y=(evt.clientY?evt.clientY:0);
        var b_left=(x<($window.width()/2));
        var b_top=(y<($window.height()/2));
        var n_left=(!b_left?(evt.pageX-$element.outerWidth()-8):(evt.pageX+8));
        var n_top=(!b_top?(evt.pageY-$element.outerHeight()-16):(evt.pageY+16));
        $element.css({'left':n_left+'px','top':n_top+'px'});
        if(window.btoa) {
          var w=$element.outerWidth();
          var h=$element.outerHeight();
          var p=css.p;
          var r=css.r;
          var fc=css.fc;
          var sc=css.sc;
          var sw=css.sw;
          var w2=w-sw;
          var h2=h-sw-p;

          // M = moveto, L = lineto, H = horizontal lineto, V = vertical lineto, Q = quadratic BÈzier curve
          //              N        NO            O        SO                S         /                |        SW              W     NW
          var d=['M',r,0,'H',w2-r,'Q',w2,0,w2,r,'V',h2-r,'Q',w2,h2,w2-r,h2,'H',r+p/2,'L',r*0.7,h2+p/2-sw,'L',r,h2,'Q',0,h2,0,h2-r,'V',r,'Q',0,0,r,0];
          // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform
          var tf='';
          if(b_left) {
            if(b_top) {
              tf='matrix(1 0 0 -1 '+(sw/2)+' '+(h-sw/2-p/2)+')';
            } else {
              tf='matrix(1 0 0 1 '+(sw/2)+' '+(sw/2+p/2)+')';
            }
          } else {
            if(b_top) {
              tf='matrix(-1 0 0 -1 '+(w-sw/2)+' '+(h-sw/2-p/2)+')';
            } else {
              tf='matrix(-1 0 0 1 '+(w-sw/2)+' '+(sw/2+p/2)+')';
            }
          }
          var svg='<path d="'+d.join(' ')+'" fill="'+fc+'" stroke-width="'+sw+'" stroke="'+sc+'" transform="'+tf+'" />';
          // C.d2(svg);
          var url=C.svgcssbg(w,h,svg);
          $element.css({'background':url,'background-size':'100% 100%','border':'none','border-radius':0});
          // $element.css({'background-color':'rgba(128,128,128,0.5)'});
        }
      };
      var existed=$('#courselet_element_feedback').length;
      C.hide_feedback();
      var $fb=$('<div id="courselet_element_feedback" style="display:none;position:absolute;left:0px;top:0px;z-Index:'+(60000+2)+'">'+data+'</div>').appendTo('body').fadeIn('fast').on('click',function() {
        C.hide_feedback();
      });
      evt_move(evt);
      if(existed || C.p_was_touch) {
        $fb.stop(true,true);
      }
      this.$evt_feedback=$(evt.currentTarget).on('mouseleave.courselet_feedback',function(evt) {
        C.hide_feedback();
      }).on('mousemove.courselet_feedback',evt_move);
    }
  };

  this.p_update_feedback_block=function(xarr_block,current_score,attempt) {
    var id_block=xarr_block['@id'];
    var xarr_elements=xarr_block['element'];
    var $obj_block=$('#'+id_block).hide();
    var result=((!this.p_block_feedback_attempts[attempt] && !this.is_numeric(xarr_block['@attempt'])) || (this.to_string(xarr_block['@attempt'])===this.to_string(attempt)));
    result=(result && (!xarr_block['@value'] || this.is_equal(xarr_block['@value'],this.p_last_input)));
    if(xarr_elements && result) {
      var feedback_max_score=0;
      var feedback_start_id='undefined'; // xarr_elements[0]['@id'];
      var feedback_end_id='';
      for(var e_i in xarr_elements) {
        var xarr_element=xarr_elements[e_i];
        if(xarr_element['@type']=='feedback_score') {
          var score=parseInt(xarr_element[0]);
          if((score>=feedback_max_score)&&(score<=current_score)) {
            feedback_max_score=score;
            feedback_start_id=xarr_element['@id'];
            feedback_end_id='';
          } else if(!feedback_end_id) {
            feedback_end_id=xarr_element['@id'];
          }
        }
      }
      var $objs=$obj_block.hide().children().hide().filter('#'+feedback_start_id).nextAll();
      if($objs.not('.courselet_spacer').length) {
        $objs.each(function(i) {
          var id=$(this).attr('id');
          if(feedback_end_id && (id==feedback_end_id)) {
            return false;
          }
          $(this).show();
          return true;
        });
        $obj_block.show();
      }
    }
    return result;
  };

  this.p_get_global_score=function() {
    var score=0;
    var score_max=0;
    var scores={};
    for(var i in this.p_xarr_pages_flat) {
      var xarr_page=this.p_xarr_pages_flat[i];
      var ov=xarr_page['@overview'];
      if((ov!=='hidden') && (ov!=='no_score') && (ov!=='reflection') && xarr_page['@score_max']) {
        score+=this.to_int(xarr_page['@score']);
        score_max+=this.to_int(xarr_page['@score_max']);
        scores[xarr_page['@id']]={
          'page_id':   xarr_page['@id'],
          'score':     xarr_page['@score'],
          'score_max': xarr_page['@score_max'],
          'attempts':  xarr_page['@attempts'],
          'time':      xarr_page['@time']
        };
      }
    }
    // console.log(scores);
    return {"score":score,"score_max":score_max,"scores":scores};
  };

  this.p_update_feedbacks=function(step) {
    var g=this.p_get_global_score();
    var page_score=this.to_int(this.p_xarr_pages_page['@score']);
    var page_attempts=this.to_int(this.p_xarr_pages_page['@attempts']);
    $('span.score_global').html(g.score);
    $('span.percent_global').html(g.score_max?Math.round(100*g.score/g.score_max):0);
    $('span.score_page').html(page_score);
    $('span.attempts_page').html(page_attempts);
    for(var b_i in this.p_xarr_blocks) {
      var xarr_block=this.p_xarr_blocks[b_i];
      if(xarr_block['@type']=='feedback') {
        if(xarr_block['@counting']&&(step||(xarr_block['@visibility']=='always'))) {
          var current_score=((xarr_block['@counting']=='global')?g.score:page_score);
          this.p_update_feedback_block(xarr_block,current_score,page_attempts);
        }
      }
    }
/*
    var cnt=0;
    $('.courselet_page_feedback').each(function() {
      var $t=$(this);
      var b=$t.filter(':visible').length;
      $t.addClass(b?'courselet_page_feedback_visible':'courselet_page_feedback_hidden');
      $t.removeClass(b?'courselet_page_feedback_hidden':'courselet_page_feedback_visible');
      $t.attr({'data-courselet_page_feedback_visible_counter':b?(++cnt):0});
    });
*/
  };

  this.p_transfer_suspend_data=function(store) {
    var arr_types=[];
    for(var b_i in this.p_xarr_blocks) {
      var xarr_elements=this.p_xarr_blocks[b_i]['element'];
      if(xarr_elements) {
        for(var e_i in xarr_elements) {
          var xarr_element=xarr_elements[e_i];
          var id_element=xarr_element['@id'];
          var $e=$('#'+id_element);
          var data=store?undefined:this.p_get_suspend_data(false,id_element);
          arr_types[xarr_element['@type']]=1;
          if(store || ((data!==null) && (data!==undefined))) {
            switch(xarr_element['@type']) {
              case 'checkbox':
                if(store) {
                  data=$e.prop('checked')?(xarr_element['@alternative_value']?xarr_element['@alternative_value']:1):0;
                } else {
                  $e.prop('checked',data?true:false);
                }
                break;
              case 'select':
                if(store) {
                  data=$e.find('select').val();
                } else {
                  $e.find('select').val(data);
                }
                break;
              case 'input':
              case 'input_levenshtein':
              case 'textarea':
                if(store) {
                  data=$e.val();
                } else {
                  $e.val(data);
                }
                break;
              case 'horizontal_radios':
                $('input[name=\'r:'+id_element+'\']').each(function(i) {
                  if(store) {
                    if(this.checked) {
                      data=$(this).val();
                    }
                  } else if($(this).val()==data) {
                    this.checked=true;
                  }
                });
                break;
              case 'click_area':
                for(var i in this.p_click_areas) {
                  var a=this.p_click_areas[i];
                  if(a[1]===id_element) {
                    if(store) {
                      data=false;
                      if((a[2]>=0) && (a[3]>=0)) {
                        data={x:a[2],y:a[3]};
                      }
                    } else if(data) {
                      this.p_click_areas[i][2]=data['x'];
                      this.p_click_areas[i][3]=data['y'];
                    }
                  }
                }
                break;
              case 'audio':
                if(!store) {
                  if('played'===data) {
                    this.p_update_audio_player($e.find('audio').addClass('has_played'));
                  }
                }
                break;
              case 'slider_target':
              case 'syllabification':
              case 'highlighter_target':
              case 'crossword_puzzle_word':
              case 'manual_score':
              case 'range':
              case 'dev_test':
                var obj=this[xarr_element['@type']];
                if(!obj) {
                  obj=this[xarr_element['@type'].replace(/_[a-z]+$/,'')];
                }
                if(store) {
                  data=obj.get(xarr_element);
                } else {
                  obj.set(xarr_element,data);
                }
                break;
            }
          }
          if(store && (data!==undefined)) {
            this.p_set_suspend_data(false,id_element,data);
          }
        }
      }
    }
    if(store) {
      this.p_save_suspend_data(0,2); // Sofort, aynchron, commit=2 (Aufruf nur in Auswertung)
    } else {
      // this.p_update_audio_player();
      this.p_set_read();
      var copa=(this.p_get_suspend_data(false,'corrections') || this.p_get_suspend_data(false,'conversation'));
      var cogl=this.p_get_suspend_data(true,'is_corrected');
      if(copa || cogl) {
        if(!this.p_corrector_mode) {
          this.p_corrector_mode=1; // Lerner
        }
        if(copa) {
          $('.courselet_page_feedback_hidden_after_individual').remove();
        }
      }
      if(this.p_corrector_mode) {
        this.p_evaluate();
        this.corrector.init(this.p_corrector_mode);
        this.conversation.init(this.p_corrector_mode);
      } else if(this.p_is_read_only || this.p_state.is_locked || this.p_state.is_timed_out) {
        this.p_evaluate();
      }
      this.manual_score.suspend_data_init();
      this.slider.hidden_sources();
      this.p_reposition();
    }
  };

  this.p_schedule_evaluation_timer=null;
  this.p_schedule_evaluation=function() {
    if(!this.p_schedule_evaluation_timer) {
      this.p_schedule_evaluation_timer=window.setTimeout(function() {
        C.p_evaluate();
      },1);
    }
  }

  var CourseletEvaluate; // @jump evaluate
  this.p_evaluate=function(force_write) {
    C.d('Evaluating');
    if(C.p_schedule_evaluation_timer) {
      window.clearTimeout(C.p_schedule_evaluation_timer);
      C.p_schedule_evaluation_timer=null;
    }
//    var class_names='.courselet_block_feedback,.courselet_icon_feedback_right,.courselet_icon_right,.courselet_icon_feedback_wrong,.courselet_icon_wrong,.courselet_audio_feedback_right,.courselet_audio_feedback_wrong';
    var class_names='.courselet_block_feedback,.courselet_element_feedback';
    $(class_names).remove();
    $('.courselet_plugin:empty').remove();
    var page_right=0;
    var page_total=0;
    var diff_right=0;
    var solution={};
    C.p_last_input=null;

    // quiet: Ergebnisse nicht zum Server schicken (Kein Versuch durch Lerner)
    var quiet=(!force_write && (C.p_corrector_mode || this.p_is_read_only || this.p_state.is_locked || this.p_state.is_timed_out));
    var page_attempts=this.to_int(this.p_xarr_pages_page['@attempts']);
    if(!quiet) {
      page_attempts++;
    }

    for(var b_i in this.p_xarr_blocks) {
      var block_right=0;
      var block_total=0;
      var block_exercise_count=0;
      // C.d('Evaluating '+b_i);
      var xarr_block=this.p_xarr_blocks[b_i];
      var id_block=xarr_block['@id'];
      var obj_block=document.getElementById(id_block);
      var xarr_elements=xarr_block['element'];
      if(xarr_block['@type']=='feedback') {
        if(!xarr_block['@counting']) { // Differenziertes Feedback, vorangegangene Aufgaben
          if(this.p_update_feedback_block(xarr_block,diff_right,page_attempts)) {
            diff_right=0;
          }
        }
      } else {
        if(xarr_elements) {
          for(var e_i in xarr_elements) {
            var xarr_element=xarr_elements[e_i];
            var id_element=xarr_element['@id'];
            // C.d('Evaluating '+b_i+'-'+e_i+': '+id_element+' '+xarr_element['@type']);
            var $e=$('#'+id_element);
            var obj_element=$e.get(0);
            var $obj_feedback=$e;
            var is_exercise=true;
            var s={}; // solution
            s.target=String(xarr_element[0]);
            s.score=0;
            s.score_max=1;
            switch(xarr_element['@type']) {
              case 'checkbox':
                s.input=this.to_bool(obj_element.checked);
                if('0|1'===s.target) {
                  s.input=s.input?'1':'0';
                  s.options=[0,1];
                  s.correct=true;
                } else {
                  s.target=this.to_bool(s.target);
                  s.correct=(s.target==s.input);
                }
                break;
              case 'select':
                if(s.target.indexOf('|')>=0) {
                  s.target=s.target.split('|');
                }
                s.input=$(obj_element).find('select').val();
                s.options=xarr_element['@options']?xarr_element['@options'].split('|'):[];
                this.update_correct(s);
                break;
              case 'input':
              case 'textarea':
                s.input=$(obj_element).val();
                if(xarr_element['@ignore_whitespace']) {
                  s.input=s.input.replace(/\s+/g,'');
                  s.target=s.target.replace(/\s+/g,'');
                }
                if(s.target.indexOf('|')>=0) {
                  s.target=s.target.split('|');
                }
                if(xarr_element['@minlength']) {
                  s.correct=(s.input.length>=parseInt(xarr_element['@minlength']));
                } else {
                  this.update_correct(s);
                }
                break;
              case 'horizontal_radios':
                $('input[name=\'r:'+id_element+'\']').each(function() {
                  if(this.checked) {
                    s.input=$(this).val();
                    C.update_correct(s);
                  }
                });
                break;
              case 'click_area':
                if(xarr_element['@clickable']==='disabled') {
                  is_exercise=false;
                } else {
                  $obj_feedback=null;
                  var coords=this.explode_to_ints(',',xarr_element['@coords']);
                  for(var i in this.p_click_areas) {
                    var a=this.p_click_areas[i];
                    if((a[0]==id_block) && (a[1]==id_element)) {
                      $obj_feedback=$(obj_element.firstChild);
                      s.correct=((a[2]>=coords[0]) && (a[3]>=coords[1]) && (a[2]<=coords[2]) && (a[3]<=coords[3]));
                    }
                  }
                }
                break;
              case 'timer':
                s.correct=this.to_bool(xarr_element['@is_right']);
                break;
              case 'slider_target':
              case 'syllabification':
              case 'highlighter_target':
              case 'pairs_break':
              case 'crossword_puzzle_word':
              case 'input_levenshtein':
              case 'manual_score':
              case 'range':
              case 'dev_test':
                var obj=this[xarr_element['@type']];
                if(!obj) {
                  obj=this[xarr_element['@type'].replace(/_[a-z]+$/,'')];
                }
                obj.evaluate(s,xarr_element,xarr_block);
                break;
              default:
                // C.d('Evaluating '+b_i+'-'+e_i+': '+id_element+' '+xarr_element['@type']+' - skipped');
                is_exercise=false;
                break;
            }
            if(is_exercise) {
              if(s.hide_feedback) {
                $obj_feedback=null;
              }
              var $span=$obj_feedback?$('<span class="courselet_element_feedback" style="display:none"></span>').insertAfter($obj_feedback):false;
              if(s.correct) {
                if(!s.score) {
                  s.score=s.score_max;
                }
                if($span) {
                  $span.append('<img class="courselet_icon_right courselet_icon" src="'+this.src('right')+'">');
                  var t_fb=xarr_element['@feedback_right'];
                  if(t_fb && (t_fb.indexOf('|')>=0)) {
                    t_fb=t_fb.split('|');
                    t_fb=t_fb[s.position];
                  }
                  if(t_fb) {
                    $('<img class="courselet_icon_feedback_right courselet_icon touchable_tooltip" src="'+this.src('feedback')+'">').appendTo($span).attr({'data-tooltip':C.html(t_fb)});
                  }
                  if(this.p_href(xarr_element,'audio_feedback_right')) {
                    $(this.p_draw_media({type:'audio',href:this.p_href(xarr_element,'audio_feedback_right'),class_name:'courselet_audio_feedback_right'})).appendTo($span);
                  }
                }
              } else {
                if($span) {
                  $span.append('<img class="courselet_icon_wrong courselet_icon" src="'+this.src('wrong')+'">');
                  if(xarr_element['@feedback_wrong']) {
                    // $('<img class="courselet_icon_feedback_wrong courselet_icon" src="'+this.src('feedback')+'">').appendTo($span).bind('mouseover',xarr_element['@feedback_wrong'],this.show_feedback);
                    $('<img class="courselet_icon_feedback_wrong courselet_icon touchable_tooltip" src="'+this.src('feedback')+'">').appendTo($span).attr({'data-tooltip':C.html(xarr_element['@feedback_wrong'])});
                  }
                  if(this.p_href(xarr_element,'audio_feedback_wrong')) {
                    $(this.p_draw_media({type:'audio',href:this.p_href(xarr_element,'audio_feedback_wrong'),class_name:'courselet_audio_feedback_wrong'})).appendTo($span);
                  }
                }
              }
              block_exercise_count++;
              block_total+=s.score_max;
              block_right+=s.score;
              s.attributes=this.xarray_properties(xarr_element);
              s.correct=s.correct?true:false;
              solution[id_element]=s;
              C.p_last_input=s.input;
            }
          }
        }
      }
      if(block_exercise_count) {
        // alert(xarr_block['@score_max']);
        var $fb=null;
        if((block_total==block_right) && xarr_block['@feedback_right']) {
          $fb=$('<div class="courselet_block_feedback courselet_block_feedback_right" style="display:none">'+this.html(xarr_block['@feedback_right'])+'</div>');
        }
        if((block_total>block_right) && xarr_block['@feedback_wrong']) {
          $fb=$('<div class="courselet_block_feedback courselet_block_feedback_wrong" style="display:none">'+this.html(xarr_block['@feedback_wrong'])+'</div>');
        }
        if($fb) {
          if(obj_block.tagName==='TABLE') {
            $fb.insertAfter(obj_block);
          } else {
            $fb.appendTo(obj_block);
          }
        }
        // var block_score_total=(parseInt(xarr_block['@score_max'])>0)?parseInt(xarr_block['@score_max']):block_exercise_count;
        var block_score_total=(C.to_string(xarr_block['@score_max']).length>0)?parseInt(xarr_block['@score_max']):block_exercise_count;
        var block_score_right=0;
        switch(xarr_block['@score_mode']) {
          case 'all_right':
            block_score_right=(block_right==block_total)?block_score_total:0;
            break;
          default:
            block_score_right=parseInt(((block_right*block_score_total)/block_total).toString()); // Abrunden
            break;
        }
        page_right+=block_score_right;
        page_total+=block_score_total;
        diff_right+=block_score_right;
      }
    }
    this.p_result=(page_right/page_total);
    C.d('Evaluated: '+page_right+'/'+page_total);
    if(!quiet) {
      this.p_commit(0);
      this.p_external_send('event',{event:'evaluated',page_id:this.page_id,score:page_right,score_max:page_total,solution:solution},function(data) {
        if(data && (typeof(data.score)==='number')) {
          page_right=data.score;
        }
        C.p_send_score(page_right,page_total);
        C.p_commit(1);
      });
    }
    this.p_update_feedbacks(1);
    if(!quiet) {
      if(this.p_page_uses_suspend_data) {
        this.p_transfer_suspend_data(true); // ruft p_commit() nach Speichern auf
      } else {
        this.p_commit(2);
      }
    }
    this.p_is_read_only=(this.p_is_read_only || (this.p_max_attempts==1) || ((this.p_max_attempts>=0) && (page_attempts >= this.p_max_attempts)));

    var feedback_mode=this.p_xarr_meta['@feedback'];
    if((feedback_mode!='0')) {
      feedback_mode='1'; // default;
    }
    if(((feedback_mode=='0')) && !C.p_corrector_mode) {
      $(class_names).remove();
      // Verzoegert, damit AJAX-Requests auch dann abgeschlossen werden, falls das Courselet per Event entladen wird.
      this.after_ajax(this.p_load_next_page);
    } else {
      var ef=this.p_xarr_meta['@element_feedback'];
      if(('disabled'===ef)||('only_wrong'===ef)) {
        $('.courselet_icon_right').remove();
      }
      if(('disabled'===ef)||('only_right'===ef)) {
        $('.courselet_icon_wrong').remove();
      }
      if('neutral'===ef) {
        $('.courselet_icon_wrong, .courselet_icon_right').remove('courselet_icon_wrong').remove('courselet_icon_right').addClass('courselet_icon_neutral').attr('src',this.src('neutral'));
      }
      $('.courselet_element_feedback:empty').remove();
      $(class_names).fadeIn();
      this.p_draw_init_bottom();
      this.p_reposition();
      this.p_register_events();
      this.p_evaluate_flashcards();
    }
  };

  this.p_commit_mode=0;
  this.p_commit=function(mode) {
    // this.d([mode]);
    if(mode===0) {
      this.p_commit_mode=0;
    } else {
      this.p_commit_mode|=mode;
    }
    if(3==(this.p_commit_mode & 3)) {
      this.d('Commit');
      if(this.p_app) {
        this.p_external_send('commit',{});
      } else if(this.p_scorm) {
        this.p_scorm_commit();
      }
      this.p_commit_mode=0;
    }
  };

  this.p_send_score=function(score,max_score) {
    C.d('Sending score',[score,max_score]);
    var dt=(this.epoch()-this.p_epoch_page_start);
    var attempts=1; // (t_ov_page['@attempts']?parseInt(t_ov_page['@attempts'])+1:1);
    var t_ov_page=this.p_xarr_pages_page;
    if(t_ov_page) { // Aktualisierung nur fuer interne Abfragen und App
      attempts=(t_ov_page['@attempts']?parseInt(t_ov_page['@attempts'])+1:1);
      if(this.p_results_basis==='last') {
        t_ov_page['@score']=score;
      } else {
        t_ov_page['@score']=(t_ov_page['@score']?Math.max(parseInt(t_ov_page['@score']),score):score);
      }
      t_ov_page['@attempts']=attempts;
      t_ov_page['@time']=(t_ov_page['@time']?parseInt(t_ov_page['@time'])+dt:dt);
      // siehe p_init_pages();
      this.p_current_scores[t_ov_page['@id']]={
        'score':    t_ov_page['@score'],
        'attempts': t_ov_page['@attempts'],
        'time':     t_ov_page['@time'],
      };
    }
    if(this.p_suite) {
      var url=this.p_params['url_talkback']+'&c='+this.p_params['courselet_id']+'&p='+this.page_id+'&s='+score+'&m='+max_score+'&t='+dt;
      $.ajax({
        'async'    : true,
        'dataType' : 'text',
        'success'  : function(result) {
          C.d('Score sent.');
          C.d(result);
        },
        'url'      : url,
        'cache'    : false,
      });
    } else if(this.p_app) {
      this.p_external_send('add_result',{'page_id':this.page_id,'score':score,'time':dt,'score_max':max_score,'attempts':attempts});
    } else if(this.p_scorm) {
      var scorm_score=0;
      var scorm_score_max=0;
      if(this.p_scorm==='SCORM_MULTI') {
        // Jede Seite (==SCO) hat eigene Suspend-Daten
        scorm_score=score;
        scorm_score_max=max_score;
      } else { // 'SCORM_SINGLE'
        var g=this.p_get_global_score();
        this.p_set_suspend_data(1,'scores',g.scores);
        scorm_score=g.score;
        scorm_score_max=g.score_max;
      }
      if(scorm_score_max) {
        var scorm_score_raw=Math.round(100*scorm_score/scorm_score_max);
        C.d('scorm_score_raw: '+scorm_score_raw);
        this.p_scorm_set_value('cmi.core.score.raw',scorm_score_raw);
        if(score==max_score) {
          this.p_scorm_set_value('cmi.core.lesson_status','passed');
        }
      }
    } else if(!this.p_params['disable_warning_standalone']) {
      this.p_warning(this.p_lg('standalone'));
    }
    this.d2(this.p_xarr_pages_flat);
    C.d('Score was sent',[score,max_score]);
  };

  this.p_register_global_events=function() { // Wird einmal bei "Start" aufgerufen
    C.d('Registering global events.');
    $(document).on('click','span.courselet_syllabification',function(evt) {
      C.syllabification.click(evt);
    });
    $(document).on('click','span.courselet_highlighter, span.courselet_highlighter_target',function(evt) {
      C.highlighter.click(evt);
    });
    $(document).on('click','span.audio_recorder',function(evt) {
      C.audio_recorder.click(evt);
    });
    $(document).on('click','.courselet_help_icon, .courselet_help_title',function(evt) {
      var $d=$(evt.currentTarget).parent();
      var $h=$d.find('.courselet_help_inner');
      if($d.hasClass('courselet_help_closed')) {
        $h.fadeIn('fast');
        $d.addClass('courselet_help_opened').removeClass('courselet_help_closed');
        window.setTimeout(function() {
          C.p_evt_resize();
        },10);
      } else {
        $h.fadeOut('fast',function() {
          $d.addClass('courselet_help_closed').removeClass('courselet_help_opened');
          C.p_evt_resize();
        });
      }
    });
    $(document).on('mouseover','[data-tooltip]',function(evt) {
      C.show_feedback(evt,C.html($(evt.currentTarget).attr('data-tooltip')));
    }).on('mouseout','[data-tooltip]',function(evt) {
      C.hide_feedback();
    });

    $(document).on('touchstart','.touchable_tooltip[data-tooltip]',function(evt) { // iOS
      C.p_was_touch=true;
      C.show_feedback(C.p_evt(evt),C.html($(evt.currentTarget).attr('data-tooltip')));
    });

    if(this.p_edit) {
      $(document).on('mouseover','.courselet_edit_block',function(evt) {
        $(evt.currentTarget).parentsUntil('#courselet_form').last().addClass('courselet_edit_hover');
      }).on('mouseover','.courselet_edit_element',function(evt) {
        $(evt.currentTarget).prevUntil('.courselet_edit_element, .courselet_edit_block').addBack().addClass('courselet_edit_hover');
      }).on('mouseout','.courselet_edit_block, .courselet_edit_element',function(evt) {
        $('.courselet_edit_hover').removeClass('courselet_edit_hover');
      });
    }

    $(document).on('readystatechange',function() {
      if((document.readyState=='complete') && C.page_id) {
        C.p_reposition(2);
      }
    });

  };

  this.external_callback=function(id,data) {
    var o=C.p_external_history[id];
    C.d({external_callback:{id:id,data:data,method:o.method}});
    if(o) {
      $('#external_send'+id).remove();
      var f=o['callback'];
      if(f) {
        o['callback']=null;
        try {
          o['result']=f(data);
        } catch(e) {
          alert('Calling the callback function failed.\n'+e.name+': '+e.message);
        }
      }
    }
    window.setTimeout(function() {
      C.p_external_history[id]=null;
    },5000);
    return o;
  };

  this.p_listeners=[];
  this.register_listener=function(f) {
    this.p_listeners.push(f);
  };

  this.p_external_send_i=0;
  this.p_external_history={};
  this.p_external_send=function(method,params,callback) {
    var id=++this.p_external_send_i;
    this.p_external_history[id]={method:method,params:params};
    if(callback) {
      this.p_external_history[id]['callback']=callback;
    }
    C.d(this.p_external_history[id]);
    for(var i in this.p_listeners) {
      var f=this.p_listeners[i];
      var r=f(method,params);
      if(r && C.p_external_history[id]['callback']) { // Der erste Listener, der eine Ausgabe hat
        C.p_external_history[id]['callback']=null;
        callback(r);
      }
    }
    if(this.p_app) {
      var cmd={id:id,method:method,params:params};
      var domid='external_send'+cmd.id;
      var i_app=this.to_int(this.p_app);
      if(i_app) { // Aufruf via IFrame
        var url='/external/'+encodeURIComponent(C.json_encode(cmd));
        if((i_app>1) && (url.length>i_app)) {
          cmd.params=null;
          url='/external/'+encodeURIComponent(C.json_encode(cmd));
        }
        C.d2(url);
        C.d(url);
        // alert(C.json_encode(cmd));
        $('<iframe width="4" height="4" style="opacity:1;border: 3px solid rgb('+Math.floor(256*Math.random())+','+Math.floor(256*Math.random())+','+Math.floor(256*Math.random())+')"></iframe>').attr({id:domid,src:url}).appendTo('body');
      } else { // Aufruf via Funktionsaufruf
        try {
          var a=this.p_app.split('.');
          var o=window;
          var i;
          for(i=0;i<a.length-1;i++) {
            o=o[a[i]];
          }
          o[a[i]](C.json_encode(cmd));
        } catch(e) {
          alert('Call of "'+this.p_app+'()" failed.');
        }
        // Test: window.document.test=function(a) { alert(a) };courselet.p_app='window.document.test';
      }
      window.setTimeout(function() {
        if(C.p_external_history[id]) {
          $('#'+domid).remove();
          if(C.p_external_history[id]['callback']) {
            C.external_callback(id,null);
            // alert(method+': Callback nicht aufgerufen');
          }
        }
      },5000);
    } else if(C.p_external_history[id]['callback']) {
      C.p_external_history[id]['callback']=null;
      callback();
    }
  };

  this.p_update_audio_player=function($os) {
    if(!$os) {
      $os=$('audio');
    }
    $os.each(function() {
      var $o=$(this);
      var id=$o.parent().attr('id');
      if(id) {
        var o=$o.get(0);
        var key=((o.paused || o.ended)?'audio_play':'audio_pause');
        if($o.hasClass('has_played')) {
          C.p_may_set_suspend_data(false,id,'played',5000);
          if($o.hasClass('playable_once')) {
            key='audio_disabled';
            $o.hide();
          }
        }
        $o.next('a.courselet_icon_media_play_a').first().children('img').attr('src',C.src(key));
      }
    });
  };

  this.p_register_events=function() { // Events - wird nach Zeichnen und Auswertung aufgerufen
    C.d('Registering events.');
    $('[data-audio_background]').off('click.courselet_audiobg').on('click.courselet_audiobg',function(evt) { // Als erstes
      $('#courselet_audiobg').remove();
      $('<audio id="courselet_audiobg"><source src="'+$(this).attr('data-audio_background')+'"></audio>').appendTo('body').get(0).play();
    });
//    C.p_edge_svg_fix(1);
    // Load bubblet nicht -> funktioniert nicht global auf document wie click
    $('#'+this.p_params['dom_id_courselet']+' img').off('load.courselet').on('load.courselet',function(evt) {
      C.p_evt_image_loaded(evt);
    });
    $(document).off('click.courselet','img').on('click.courselet','img',function(evt) {
      C.p_evt_image_clicked(evt);
    });
    $('img').unbind('mousemove.courselet').bind('mousemove.courselet',function(evt) {
      C.p_evt_image_mouse_move(evt);
    });
/*
    $(window).unbind('mousemove.courselet').bind('mousemove.courselet',function(evt) {
      C.p_external_send('event',{event:'mousemove',page_id:this.page_id,x:evt.pageX,y:evt.pageY});
    });
*/
    $('img').unbind('mouseout.courselet').bind('mouseout.courselet',function(evt) {
      C.p_evt_image_mouse_out(evt);
    });
    $(window).unbind('resize.courselets').bind('resize.courselets',function(evt) {
      C.p_evt_resize(evt);
    });
    $('#body_inner').off('scroll.courselets').on('scroll.courselets',function(evt) {
      C.p_evt_resize(evt); // iOS und Pop-over
    });
    $(document).unbind('mousemove.courselets touchmove.courselets').bind('mousemove.courselets touchmove.courselets',function(evt) {
      C.p_evt_mouse_move(evt);
    });
    $(document).unbind('mouseup.courselets touchend.courselets').bind('mouseup.courselets touchend.courselets',function(evt) {
      C.p_evt_mouse_up(evt);
    });
    $('img.courselet_icon[data-reference]').off().on('click touch',function(evt) {
      evt.stopImmediatePropagation();
      C.p_page_methods.call('reference',$(this).attr('data-reference'));
      C.hide_feedback();
    });
    $('a.courselet_icon_media_play_a').off().on('mousedown touchstart',function(evt) {
      // Fuer Audio auf Gleitern
      evt.stopImmediatePropagation();
    }).on('click touch',function(evt) {
      var $o=$(this).prev('audio, video').last();
      var o=$o.get(0);
      if(o) {
        if(($o.data('last-source')!==$o.html()) && o.load) {
          $o.data('last-source',$o.html());
          o.load();
        }
        if(o.paused) {
          if(!$o.hasClass('playable_once') || !$o.hasClass('has_played')) {
            o.play();
          }
        } else {
          o.pause();
        }
      } else {
        alert('Player not found.');
      }
      evt.preventDefault();
      evt.stopPropagation();
    });
    $('.courselet_slider').not('.courselet_slider_readonly').unbind().bind('mousedown touchstart',function(evt) {
      evt.preventDefault();
      C.slider.activate(evt.currentTarget,C.p_evt(evt).pageX,C.p_evt(evt).pageY);
    }).bind('dblclick',function(evt) {
      $(evt.currentTarget).attr('idref',$(evt.currentTarget).attr('source_idref'));
      C.slider.hidden_sources();
      C.slider.reposition(true);
    });
    $('.courselet_slider_target').unbind().bind('click',function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      C.slider.drop_active(evt.pageX,evt.pageY,1);
    });
    $('#courselet_form').unbind().submit(function(evt) {
      evt.stopImmediatePropagation();
      evt.preventDefault();
      C.p_evaluate();
    });
    $('.courselet_internal_link, .courselet_progress_bar_page_navigation').off('click.courselet_internal_link').on('click.courselet_internal_link',function(evt) {
      C.p_evt_load_page(evt);
    });
    $('.courselet_email_link').off('click.courselet_email_link').on('click.courselet_email_link',function(evt) {
      C.p_evt_email(evt);
    });
    $('.courselet_path').unbind().change(function(evt) {
      C.p_load_page($(evt.currentTarget).val(),true);
    });
    $(window).unbind('unload.courselet').bind('unload.courselet',function(evt) {
      C.p_unload_page();
    });
    $(window).off('visibilitychange.courselet').on('visibilitychange.courselet',function() {
      C.d('visibilitychange');
      if(C.p_epoch_page_start) {
        // C.p_save_suspend_data(-1); // Speichert Zwischenstaende beim Korrektur-Tool: Unerwuenscht.
      }
    });
    $('audio').off().on('play pause ended',function(evt) {
      var $a=$(this);
      if(evt.type==='ended') {
        $a.addClass('has_played');
      }
      C.p_update_audio_player($a);
    });
    $('a.courselet_edit').off().on('click',function(evt) {
      C.p_external_send('edit',{page_id:C.page_id,id:$(this).attr('data-id'),mode:'edit'});
      // window.location.href='/edit/'+C.json_encode({id:$(this).attr('data-id'),page_id:C.page_id,mode:'edit'});
      evt.preventDefault();
      evt.stopPropagation();
      C.hide_feedback();
    }).on('contextmenu',function(evt) {
      C.p_external_send('edit',{page_id:C.page_id,id:$(this).attr('data-id'),mode:'contextmenu'});
      evt.preventDefault();
      evt.stopPropagation();
      C.hide_feedback();
    });
    $(window).on('contextmenu',function(evt) {
      C.d('Context menu suppressed.');
      evt.preventDefault();
    });
    if(this.p_marked_events) {
      for(var i in this.p_marked_events) {
        var a=this.p_marked_events[i];
        $(a[0]).bind(a[1],a[2],a[3]);
      }
      this.p_marked_events=null;
    }
  };
  this.p_mark_event=function(query,event_name,data,callback) {
    if(!this.p_marked_events) {
      this.p_marked_events=[];
    }
    this.p_marked_events.push([query,event_name,data,callback]);
  };

  this.p_evt=function(evt) { // Liefert bei Touch-Event den ersten Finger, ansonsten das Mouse-Event
    var r=evt;
    try {
      if(typeof(evt.originalEvent.targetTouches[0].pageX)!='undefined') {
        r=evt.originalEvent.targetTouches[0];
      }
    } catch(e) {
    }
    return r;
  };

  this.p_evt_image_mouse_move=function(evt) {
    if(this.p_preview_results) {
      var $image=$(evt.currentTarget);
      if($image.hasClass('courselet_block_image')) {
        if(!$('#courselet_image_position').length) {
          $('body').append('<div id="courselet_image_position" style="display:none;position:absolute;left:100px;top:100px;background-color:white;padding:1px;border: 1px solid black">x</div>');
        }
        var offset=$image.offset();
        $('#courselet_image_position').fadeIn().text('x,y = '+Math.round(evt.pageX-offset.left)+','+Math.round(evt.pageY-offset.top)).offset({'left':evt.pageX+20,'top':evt.pageY});
      }
    }
  };

  this.p_evt_image_mouse_out=function(evt) {
    $('#courselet_image_position').remove();
  };

  this.p_evt_image_counter=0;
  this.p_evt_image_loaded_timer=null;
  this.p_evt_image_loaded_ids=[];
  this.p_evt_image_loaded_timed=function() {
    C.p_evt_image_loaded_timer=null;
    var a=C.p_evt_image_loaded_ids;
    C.p_evt_image_loaded_ids=[];
    C.d('Image loaded event: '+(++C.p_evt_image_counter));
    C.p_reposition();
    C.p_resize_all_cards();
    for(var i in a) {
      var id=a[i];
      var $part=$('#'+id);
      if($part.hasClass('courselet_slider_target')) {
        var $image=$part.find('img');
        $part.attr({'data-fixed-width':$image.width()+'px','data-fixed-height':$image.height()+'px'});
        C.slider.reposition(false,true);
      } else if($part.attr('data-courselet_img_to_background')) {
        var $t=$('#'+$part.attr('data-courselet_img_to_background'));
        $t.addClass('max_width').attr({width:$part.width(),height:$part.height()}).width($part.width()).height($part.height()).css({backgroundImage:'url("'+$part.attr('src')+'")'/*,backgroundSize:'cover'*/});
        C.p_reposition(2);
      } else {
        var xarr_block=C.p_ids_page[id];
        if(xarr_block && xarr_block.element) {
          for(var i in xarr_block.element) {
            // alert(this.dump(xarr_block));
            var xarr_element=xarr_block.element[i];
            if(xarr_element && (xarr_element['@type']=='click_area')) {
              var coords=C.explode_to_ints(',',xarr_element['@coords']);
              // alert(this.dump(coords));
              if(coords[2] && coords[3] && (coords[0]<coords[2]) && (coords[1]<coords[3])) {
                // $image.after('<div onmouseover="this.style.display=\'none\';" style="position:relative;left:'+(coords[0])+'px;top:'+(coords[1]-$image.height())+'px;border:1px solid red;width:'+(coords[2]-coords[0])+'px;height:200px;height:'+(coords[3]-coords[1])+'px;overflow:hidden">&nbsp;</div>');
              }
            }
          }
        }
      }
    }
  };

  this.p_evt_image_loaded=function(evt) {
    C.d('Image loaded.');
//    C.p_edge_svg_fix(1);
    if(C.p_evt_image_loaded_timer) {
      window.clearTimeout(C.p_evt_image_loaded_timer);
    }
    var $image=$(evt.currentTarget);
    if($image.attr('data-original_width')) {
      $image.removeAttr('data-original_width'); // siehe p_get_image_original_width()
    }
    // $image.attr({'data-loaded':1}); // ,'src':$image.attr('src')+'#'
    var id=C.get_ID($image);
    if(id) {
      C.p_evt_image_loaded_ids.push(id);
    }
    // Mehrere/alle onload-Events gesammelt ausfuehren
    C.p_evt_image_loaded_timer=window.setTimeout(C.p_evt_image_loaded_timed,100);
  };

/*
  this.p_edge_svg_fix_timer=null;
  this.p_edge_svg_fix=function(b) {
    if(this.p_edge_svg_fix_timer) {
      window.clearTimeout(this.p_edge_svg_fix_timer);
    }
    if(b) {
      this.p_edge_svg_fix_timer=window.setTimeout(function() {
        $('#'+C.p_params['dom_id_courselet']+' img:not([data-loaded])').css({'border':'2px solid red'}).each(function() {
          $(this).attr('src',$(this).attr('src')+'#');
        });
      },2000);
    }
  };
*/

  this.p_evt_image_clicked=function(evt) {
    C.d('Image clicked.');
    var $image=$(evt.currentTarget);
    var image_offset=$image.offset();
    var x=evt.pageX-image_offset.left;
    var y=evt.pageY-image_offset.top;
    var id=this.get_ID($image);
    if(id) {
      if($image.hasClass('courselet_click_area_crosshairs')) {
        this.p_click_area_remove(id);
      }
      if(this.p_ids_page[id]) {
        if($image.hasClass('courselet_block_image')) {
          this.p_click_area_click(id,$image,x,y); // Eigentlich auch nur bei Bloecken noetig
        }
        if($image.hasClass('courselet_magnification')) {
          this.show_image_layer(this.p_href(this.p_ids_page[id],'magnification'));
        }
      }

    }
  };

  this.black_layer=function(selector,opacity,css,func_close) {
    $('#courselet_layer_black').add(selector).remove();
    var $l=$('<div id="courselet_layer_black" style="position:fixed;left:0px;top:0px;height:100%;width:100%;display:none;z-Index:'+(60000+9)+'"></div>').appendTo('body');
    $l.fadeTo('normal',opacity?opacity:0.5).click(function() {
      var $t=$l;
      if(func_close) {
        func_close();
      } else {
        $t=$t.add(selector);
      }
      $t.stop().fadeOut('fast');
    });
    if(css) {
      $l.css(css);
    }
    return $l;
  };

  this.show_image_layer=function(src) {
    var $b=this.black_layer('#courselet_layer_image');
    $('body').append('<table id="courselet_layer_image" style="position:fixed;left:0px;top:0px;height:100%;width:100%;display:none;z-Index:'+(60000+9)+';border-collapse:collapse;"><tr><td><table class="courselet_media" style="margin:auto"><tr><td><img style="max-width:100%;max-height:calc(100vh - 6px);vertical-align:middle;" src="'+src+'" alt=""></td></tr></table></td></tr></table>');
    $('#courselet_layer_image').fadeIn('fast').click(function() {
      $b.click();
    });
  };

  this.p_evt_resize=function(evt) {
    C.d('Window resized.');
    C.hide_feedback();
    this.p_reposition();
  };

  this.p_evt_mouse_move=function(evt) {
    // C.d(this.p_evt(evt).pageX+' x '+this.p_evt(evt).pageY);
    this.slider.move_active(this.p_evt(evt).pageX,this.p_evt(evt).pageY,evt);
  };

  this.p_evt_mouse_up=function(evt) {
    C.d('Mouse: up.');
    this.slider.drop_active(evt.pageX,evt.pageY,0);
  };

  this.register_drag_temp=null;
  this.register_drag=function($selection,callback,passthrough) {
    var ms;
    var epdcto=function(evt) {
      evt.preventDefault();
      if(C.register_drag_temp && C.register_drag_temp[3]) {
        window.clearTimeout(C.register_drag_temp[3]);          
      }
    };
    var rto=function() {
      C.register_drag_temp[3]=setTimeout(function() {
        if(C.register_drag_temp && C.register_drag_temp[0]) {
          C.register_drag_temp[0].trigger('touchend.crdt');
        }
      },5000);
    };
    var sndlasta=null;
    var snd=function(m,evt) {
      var e=C.p_evt(evt);
      var a;
      // 2025: Fehlt bei Android in touchend
      if((!e || !e.pageX) && sndlasta) { 
        a=sndlasta;
      } else {
        a={
          dx: e.pageX-C.register_drag_temp[1],
          dy: e.pageY-C.register_drag_temp[2],
          offsetX: 0,
          offsetY: 0,
          pageX: e.pageX,
          pageY: e.pageY,
          // event: C.p_evt(evt),
          passthrough: passthrough
        }
        try {
          // 2025: weder offsetX noch clientX bei iOS
          var scr=$selection.get(0).getBoundingClientRect();
          var bcr=document.body.getBoundingClientRect();
          a.offsetX=(a.pageX+bcr.left-scr.left);
          a.offsetY=(a.pageY+bcr.top-scr.top);
          // console.log(a);
        } catch (err) {
          console.log(err)
        }
        sndlasta=a;
      }
      callback(m,a);
    };
    $selection.on('mousedown touchstart',function(evt) {
      epdcto(evt);
      C.register_drag_temp=[$(this),C.p_evt(evt).pageX,C.p_evt(evt).pageY,null];
      rto();
      snd('start',evt);
      ms=Date.now();
      $(document).on('mousemove.crdt touchmove.crdt',function(evt) {
        if(C.register_drag_temp && C.register_drag_temp[0]) {
          epdcto(evt);
          rto();
          snd('move',evt);
        }
      }).on('mouseup.crdt touchend.crdt',function(evt) {
        if(C.register_drag_temp && C.register_drag_temp[0]) {      
          epdcto(evt);
          snd('end',evt);
          if(Date.now()-200<ms) {
            snd('click',evt);
          }
          C.register_drag_temp=null;      
        }
        $(document).off('.crdt');
      });
    });
  };

  this.p_evt_email=function(evt) {
    var $obj=$(evt.currentTarget);
    var id=$obj.attr('id');
    var xarr=C.p_ids_page[id];
    if(xarr) {
      C.p_external_send('event',{event:'email',page_id:C.page_id,to:xarr['@to']?xarr['@to']:'',subject:xarr['@subject']?xarr['@subject']:'',body:xarr['@body']?xarr['@body']:''});
    }
    if(this.p_suite || C.p_params['prevent_email']) {
      evt.preventDefault();
    }
  };

  this.p_load_page_by_name=function(name,by_user) {
    var target_id=null;
    for(var i in this.p_xarr_pages_flat) {
      var xarr_page=this.p_xarr_pages_flat[i];
      if(this.is_equal(xarr_page['@title'],name)) {
        target_id=xarr_page[this.p_params['author_mode']?'@id':'@filled_id'];
      }
    }
    if(target_id) {
      this.p_load_page(target_id,by_user);
    } else {
      C.p_external_send('event',{event:'pagenotfound',page_name:name});
      if(this.p_params['author_mode']) {
        alert(this.p_lg('target_not_found'));
      }
    }
  };

  this.p_evt_load_page=function(evt) {
    evt.preventDefault();
    var obj=evt.currentTarget;
    var search=String($(obj).attr('title'));
    if(!search.length || (search==='undefined')) {
      search=String($(obj).attr('data-internal_link'));
    }
    if(search.length && (search!=='undefined')) {
      this.p_load_page_by_name(search,true);
    }
  };

  this.p_load_next_page=function() {
    var page_id=C.p_ids_pages[C.page_id]['@next_filled_id'];
    var wa=(page_id===C.p_first_page_id);
    C.p_external_send('event',{event:'beforenextpageload',page_id:page_id,wraparound:wa});
    if(!wa || !C.p_params['prevent_wraparound']) {
      C.p_load_page(page_id,true);
    }
  };

  this.p_first_load_page_ended=function() {
    this.d('First page loaded.');
    var epoch=this.epoch();
    var meta=this.meta_courselet();
    if(meta && meta['timing'] && meta['timing']['time_limit']) {
      var t_limit=epoch+this.to_int(meta['timing']['time_limit']);
      if(!this.p_epoch_limit || (this.p_epoch_limit>t_limit)) {
        this.p_epoch_limit=t_limit;
        this.p_may_set_suspend_data(true,'e_date',t_limit,30);
      }
    }
    // console.log(meta);
    this.p_results_basis=((meta && meta['general'] && (meta['general']['results_basis']==='last'))?'last':'best');
    var $dom=$('#'+C.p_params['dom_id_courselet']);
    $dom.attr('data-meta-courselet-custom',(meta && meta['general'] && meta['general']['custom'])?meta['general']['custom']:'');
    this.p_interval();
    window.setInterval(function() {
      this.courselet.p_interval();
    },250);
  };

  this.p_first_load_suspend_data_ended=function() {
    this.d('Suspend data loaded.');
    var t=this.to_int(this.p_get_suspend_data(true,'e_date'));
    if(t) {
      this.p_epoch_limit=t;
      if(t<this.epoch()) {
        this.p_state.is_timed_out=true;
      }
    }
    if(this.p_get_suspend_data(true,'is_locked')) {
      this.p_state.is_locked=true;
    }
    C.d(this.p_state);
  };

  this.p_first_load=function() {
    // alert(navigator.userAgent);
    $('#'+this.p_params['dom_id_courselet']).text(this.p_lg('loading'));
    this.p_register_global_events();
    if(this.p_suite) {
      this.p_load_page(this.p_params['page_id']);
    } else {
      this.p_first_load_courselet(this.p_params['page_id']);
    }
  };

  this.p_first_load_courselet=function(page_id) {
    var all_pages_started=false;
    var pages_loading=0;
    C.d('Loading '+C.src('xml'));
    $.ajax({
      'url': C.src('xml'),
      'success': function(data,status,xhr) {
        C.p_xarr_courselet=C.xml_to_xarray(data);
        if(C.p_xarr_courselet['courselet']) {
          C.d(C.src('xml')+' was loaded.');
          C.p_init_pages();
          var total_pages=C.p_xarr_pages_flat.length;
          for(var i=0;i<total_pages;i++) {
            var xarr_pages_page=C.p_xarr_pages_flat[i];
            pages_loading++;
            all_pages_started=(i==total_pages-1);
            var url=xarr_pages_page['@href'];
            C.d('Start loading '+url);
            $.get(url,function(data,status,xhr) {
              var xarr_page=C.xml_to_xarray(data);
              if(xarr_page['page']) {
                C.p_first_load_courselet_process_page(xarr_page);
                pages_loading--;
                if(all_pages_started && (pages_loading==0)) {
                  C.d('All pages were loaded.');
                  C.p_mark_next_pages();
                  C.p_load_page(page_id?page_id:C.p_first_page_id);
                }
              } else {
                C.p_load_error=url+' could not be loaded.';
                C.p_warning();
              }
            },'text');
          }
        } else {
          C.p_load_error=C.src('xml')+' could not be loaded.';
          C.p_warning();
        }
      },
      'error': function(xhr,status,error) {
        C.p_load_error=C.src('xml')+' could not be loaded. '+error;
        C.p_warning();
        C.d(xhr);
      },
      'dataType': 'text'
    });
  };

  this.p_first_load_courselet_process_page=function(xarr_page) {
    var page_id=xarr_page['page'][0]['@id'];
    var xarr_blocks=xarr_page['page'][0]['contents'][0]['block'];
    // var xarr_meta=xarr_blocks[0];
    var xarr_pages_page=this.p_ids_pages[page_id];
    if(!xarr_blocks[1]) {
      xarr_pages_page['@is_empty']=1;
    }
  };

  this.p_unload_page=function() { /* Aktuelle Seite nicht mehr gueltig */
    this.p_xarr_timer=null;
//    this.p_edge_svg_fix(0);
    if(this.p_epoch_page_start) {
      C.d('Unloading page.');
      $('#'+this.p_params['dom_id_courselet']+' iframe,#'+this.p_params['dom_id_courselet']+' embed').remove(); // Eventuelle Destruktoren aufrufen, die per SCORM-API kommunizieren
      this.p_save_suspend_data(-1,3); // synchron
      if(this.p_scorm) {
        this.p_scorm_finish(this.p_scorm==='SCORM_MULTI');
      }
      $('#courselet_layer_image, #courselet_layer_black').remove();
      this.p_epoch_page_start=null;
    }
  };
//  this.unload=function() { /* Courselet "entladen" */
//    this.p_unload_page();
//  };

  this.p_load_page=function(page_id,by_user) {
    this.p_external_send('event',{event:'beforepageload',page_id:page_id});
    if(by_user && (this.p_scorm==='SCORM_MULTI')) {
      // SCORM kann das nicht: Ergebnis wird in falscher Seite abgelegt.
      this.p_warning(this.p_lg('nav_error_scorm'));
    } else {
      var url='';
      if(this.p_suite) {
        url=C.p_params['url_page']+'&page_id='+page_id+'&timestamp='+parseInt(new Date().getTime()/1000);
      } else if(this.p_ids_pages[page_id]) {
        if(this.p_edit) {
          url=this.p_ids_pages[page_id]['@href']+'?timestamp='+parseInt(new Date().getTime()/1000);
        } else {
          url=this.p_ids_pages[page_id]['@href'];
        }
      }
      if(url) {
        this.p_unload_page();
        C.d('Loading '+C.p_params['url_page_format']);
        switch(C.p_params['url_page_format']) {
          case 'html':
            if(page_id!=C.p_params['page_id']) {
              window.location.pathname=window.location.pathname.replace(/[^\/]+$/,page_id+'.html');
              break;
            }
            // continue xml
          case 'xml':
            $.get(url,function(data,status,xhr) {
              C.p_load_page_2(C.xml_to_xarray(data));
            },'text');
            break;
          case 'json':
            $.getJSON(url,function(data,status) {
              C.p_load_page_2(data);
            });
            break;
          default:
            alert('Unknown url_page_format: '+C.p_params['url_page_format']);
            break;
        }
      } else {
        alert(this.p_lg('target_not_found'));
      }
    }
  };
  this.p_load_page_2=function(xarr) {
    var is_first_load=!this.page_id;
    this.p_is_read_only=true;
    this.p_load_error=null;
    if(xarr) {
      if(xarr['combined'] && xarr['combined'][0]) {
        this.p_xarr_page=xarr['combined'][0];
        this.p_xarr_courselet=xarr['combined'][0];
        this.p_init_pages();
        this.p_mark_next_pages();
      } else if(xarr['page']) {
        this.p_xarr_page=xarr;
      } else {
        if(xarr['error'] && xarr['error'][0] && xarr['error'][0][0]) {
          this.p_load_error=this.p_lg('load_error_'+xarr['error'][0][0]);
        } else {
          this.p_load_error=this.p_lg('load_error_general');
        }
      }
      if(this.p_xarr_page && this.p_xarr_page['page']) {
        this.p_xarr_blocks=this.p_xarr_page['page'][0]['contents'][0]['block'];
        this.p_xarr_meta=this.p_xarr_blocks[0];
        if(this.p_xarr_meta['@type']!='meta') {
          alert('Bad meta block in page');
        }
        this.page_id=this.p_xarr_page['page'][0]['@id'];
        this.p_history.push(this.page_id);
        this.p_ids_page=this.xarray_to_ids(this.p_xarr_page);
        //this.dump(this.p_ids_page);
        if(!this.page_id) {
          // alert('Im XML-Modus kann noch nicht auf die Page-ID zugegriffen werden. Bitte den JSON-Modus benutzen.');
        }
        // this.courselet_id=this.p_xarr_courselet['courselet']['@id'];
        // this.p_xarr_pages=this.p_xarr_courselet['courselet'][0]['pages'][0]['page'];
        // this.p_init_pages();
        this.p_mark_path();
        this.p_xarr_pages_page=this.p_ids_pages[this.page_id];
        switch(this.p_xarr_meta['@attempts']) {
          case 'once':
            this.p_max_attempts=1;
            break;
          case 'twice':
            this.p_max_attempts=2;
            break;
          case 'thrice':
            this.p_max_attempts=3;
            break;
          default:
            this.p_max_attempts=-1;
            break;
        }
        this.p_page_features={
          'event':     'pageload', 
          'page_id':   this.page_id,
          'page_name': this.p_xarr_meta['@title']
        };
        if(this.page_id===this.p_first_page_id) {
          this.p_page_features['is_first_page']=1;
        }
        if(this.p_ids_pages[this.page_id] && (this.p_ids_pages[this.page_id]['@next_filled_id']===this.p_first_page_id)) {
          this.p_page_features['is_last_page']=1;
        }
        this.p_is_read_only=((this.p_max_attempts>=0) && (this.to_int(this.p_xarr_pages_page['@attempts']) >= this.p_max_attempts));
        this.p_corrector_mode&=~1;
        this.p_page_uses_suspend_data=this.p_xarr_meta['@suspend_data']?true:false;
        this.p_draw();
        if(this.p_page_uses_suspend_data) {
          this.p_transfer_suspend_data(false);
        }
        this.p_epoch_page_start=this.epoch();
        this.p_cache_images();
        if(this.p_scorm) {
          this.p_scorm_initialize();
        }
        this.p_external_send('event',this.p_page_features);
        if(is_first_load) {
          this.p_first_load_page_ended();
        }
      }
    } else {
      this.p_load_error=this.p_lg('load_error_general');
    }
    if(this.p_load_error) {
      this.p_warning();
    }
  };

  this.xarray_properties=function(xarr) {
    var a={};
    for(var i in xarr) {
      if(i[0]==='@') {
        a[i.substr(1)]=xarr[i];
      }
    }
    return a;
  };

  this.xarray_to_ids=function(xarr,internal) {
    if(!internal) {
      internal={};
    }
    for(var i in xarr) {
      var e=xarr[i];
      if(i=='@id') {
        internal[e]=xarr;
      } else if(this.is_array(e)) {
        this.xarray_to_ids(e,internal);
      }

    }
    return internal;
  };

  this.p_init_pages=function() {
    // var old_scores={};
    var cs=this.p_current_scores;
    var l_flatten_pages=function(xarr_pages,level,p,t) {
      for(var i in xarr_pages) {
        var xarr_page=xarr_pages[i];
        var id=xarr_page['@id'];
        if(id && cs[id]) {
          if( (!xarr_page['@attempts'] || (xarr_page['@attemts']<=cs[id]['attempts'])) && (!xarr_page['@score'] || (xarr_page['@score']<=cs[id]['score'])) ) {
            // siehe p_send_score();
            xarr_page['@attempts']=cs[id]['attempts'];
            xarr_page['@score']=cs[id]['score'];
            xarr_page['@time']=cs[id]['time'];
            // C.d(xarr_page);
          }
        }
        xarr_page['@level']=level;
        xarr_page['@parent_id']=p;
        xarr_page['@top_id']=t;
        C.p_xarr_pages_flat.push(xarr_page);
        if(xarr_page['page']) {
          l_flatten_pages(xarr_page['page'],level+1,id,level?t:id);
        }
      }
    }
    this.p_xarr_pages=this.p_xarr_courselet['courselet'][0]['pages'][0]['page'];
    this.p_xarr_pages_flat=[];
    l_flatten_pages(this.p_xarr_pages,0,'','');
    // C.d(C.p_xarr_pages_flat);
    this.p_ids_pages=this.xarray_to_ids(this.p_xarr_pages_flat);
    if(this.p_xarr_courselet['courselet'][0]['resources'] && this.p_xarr_courselet['courselet'][0]['resources'][0] && this.p_xarr_courselet['courselet'][0]['resources'][0]['resource']) {
      var xarr_resources=this.p_xarr_courselet['courselet'][0]['resources'][0]['resource'];
      this.p_ids_resources=this.xarray_to_ids(xarr_resources);
      // this.dump(this.ids_resources);
    }

    if(this.p_loaded_results) {
      C.d('Init pages: Transfering loaded results.');
      // console.log(this.p_loaded_results);
      try {
        for(var i in this.p_loaded_results) {
          var r=this.p_loaded_results[i];
          if(r['page_id'] && this.p_ids_pages[r['page_id']]) {
            var p=this.p_ids_pages[r['page_id']];
            if(p) {
              p['@score']=parseInt(r['score']);
              p['@attempts']=parseInt(r['attempts']);
              p['@time']=parseInt(r['time']);
            }
            // alert(JSON.stringify(p));
          }
        }
        this.p_loaded_results=null;
      } catch(e) {
        // alert('Error loading results: '+e);
      }
    } else {
      C.d('Init pages: No loaded results.');
    }
  };

  this.p_visited_pages=function() { // Funktioniert nur bei Seiten der aktuellen Session oder Seiten mit Uebungen.
    var a=[];
    var f=false;
    for(var i=this.p_xarr_pages_flat.length-1;i>=0;i--) {
      var xarr_page=this.p_xarr_pages_flat[i];
      var id_page=xarr_page['@id'];
      if(!f) {
        f=((this.p_history.indexOf(id_page)>-1) || (xarr_page['@attempts']));
        // this.d(xarr_page);
      }
      if(f) {
        a.push(id_page);
      }
    }
    a.reverse();
    return a;
  };

  this.p_mark_next_pages=function() {
    if(this.p_xarr_pages_flat) {
      var next_id=this.p_xarr_pages_flat[0]['@id'];
      var next_filled_id=null;
      for(var i in this.p_xarr_pages_flat) {
        if(!this.p_xarr_pages_flat[i]['@is_empty']) {
          next_filled_id=this.p_xarr_pages_flat[i]['@id'];
          break;
        }
      }
      if(!next_filled_id) {
        next_filled_id=next_id;
      }
      for(var i=this.p_xarr_pages_flat.length-1;i>=0;i--) {
        this.p_xarr_pages_flat[i]['@next_id']=next_id;
        this.p_xarr_pages_flat[i]['@next_filled_id']=next_filled_id;
        next_id=this.p_xarr_pages_flat[i]['@id'];
        if(!this.p_xarr_pages_flat[i]['@is_empty']) {
          next_filled_id=next_id;
        }
        this.p_xarr_pages_flat[i]['@filled_id']=next_filled_id;
      }
      this.p_first_page_id=this.p_params['author_mode']?next_filled_id:next_id;
      // alert(this.p_first_page_id);
    }
  };

  this.p_mark_path=function(xarr_pages,level) {
    var result=false;
    if(!level) {
      xarr_pages=this.p_xarr_pages;
      level=0;
    }
    for(var i in xarr_pages) {
      var xarr_page=xarr_pages[i];
      xarr_page['@_path']=0;
      // xarr_page['@active']=0;
      if(xarr_page['@id']==this.page_id) {
        result=true;
        xarr_page['@_path']=1;
        // xarr_page['@active']=1;
      }
      if(xarr_page['page']) {
        if(this.p_mark_path(xarr_page['page'],level+1)) {
          result=true;
          xarr_page['@_path']=1;
        }
      }
    }
    return result;
  };

  this.p_draw_breadcrumb=function(xarr_pages,parent_id) {
    var html='';
    var html_next='';
    var html_options='';
    // var level0=false;
    if(!xarr_pages) {
      xarr_pages=this.p_xarr_pages;
      // level0=true;
    }
    for(var i in xarr_pages) {
      var xarr_page=xarr_pages[i];
      var selected=!(!(xarr_page['@_path']));
      // if(level0 || selected || this.p_params['author_mode'] || !xarr_page['@overview'] || (xarr_page['@overview']!='hidden')) {
      if(!xarr_page['@path'] || this.p_params['author_mode']) {
        html_options+='<option value="'+xarr_page[this.p_params['author_mode']?'@id':'@filled_id']+'"'+(selected?' selected':'')+'>'+xarr_page['@title']+'</option>';
        if(selected && xarr_page['page']) {
          html_next=this.p_draw_breadcrumb(xarr_page['page'],(!this.p_params['author_mode'] && xarr_page['@is_empty'])?null:xarr_page['@id']);
        }
      }
    }
    if(html_options) {
      html+='<span class="select_outer"><select class="courselet_path">';
      if(parent_id) {
        html+='<option value="'+parent_id+'"></option>';
      }
      html+=html_options;
      html+='</select></span>';
      html+='&nbsp;'+html_next;
    }
    if(this.p_edit && !parent_id) {
      html+='<a class="courselet_edit courselet_edit_meta" style="display:inline-block !important; text-decoration:none" data-id="'+this.p_xarr_meta['@id']+'" href="#" data-tooltip="'+C.p_lg('edit_meta')+'">&#9998;<!--&#10033;--></a>';
    }
    return html;
  };

  this.p_draw_init_bottom=function() {
    var $bottom=$('#courselet_bottom');
    var fade_next=($bottom.find('#courselet_bottom_submit').length && !$bottom.find('#courselet_button_next').length);
    $bottom.empty();
    var is_e=this.p_is_exercise;
    var result=this.p_result;
    var $p=$('<p id="courselet_bottom_submit"></p>').appendTo($bottom);
    if(this.p_corrector_mode<2) {
      $('<input type="submit" value="">').appendTo($('<span style="display:inline-block;width:0;height:0;overflow:hidden;visibility:hidden"></span>').appendTo($p)).on('click',function(evt) {
        // Default-Submit
        evt.stopImmediatePropagation();
        evt.preventDefault();
        $('#courselet_button_evaluation').click();
      });
      if(this.p_xarr_meta['@link_back']) {
        $('<input type="submit" id="courselet_button_back" value="'+this.p_lg('button_back')+'">').appendTo($p).on('click',function(evt) {
          evt.stopImmediatePropagation();
          evt.preventDefault();
          C.p_load_page_by_name(C.p_xarr_meta['@link_back'],true);
        }).attr('value',this.p_xarr_meta['@link_back_text']?this.p_xarr_meta['@link_back_text']:this.p_lg('button_back'));
      }
      if(is_e) {
        if(this.p_is_read_only || this.p_state.is_locked || this.p_state.is_timed_out || this.p_corrector_mode) {
          // $bottom.append('<p style="clear:left"><span id="courselet_no_button_evaluation">'+this.p_lg('read_only')+'</span></p>');
        } else if(!this.p_scorm_content_api_initialized && (this.p_xarr_meta['@evaluation_button']!=='never') && ((this.p_xarr_meta['@evaluation_button']!=='until_right_solution') || (result!=1))) {
          var is_reflection=(this.p_xarr_meta['@overview']==='reflection');
          $('<input type="submit" id="courselet_button_evaluation" class="'+(is_reflection?'courselet_button_reflection':'courselet_button_evaluation')+'">').appendTo($p).on('click',function(evt) {
            evt.stopImmediatePropagation();
            evt.preventDefault();
            C.p_evaluate();
          }).attr('value',this.p_xarr_meta['@evaluation_button_text']?this.p_xarr_meta['@evaluation_button_text']:this.p_lg(is_reflection?'button_reflection':'button_evaluation'));
        }
      }
      var v=this.p_xarr_meta['@link_next_page'];
      if(!v) {
        v='after_attempt'; // default
      }
      if((v=='always')
            ||((v=='after_attempt')&&(!is_e || this.p_is_read_only || this.p_state.is_locked || this.p_state.is_timed_out || this.p_corrector_mode || !isNaN(result)))
            ||((v=='after_right_solution'))&&(!is_e || (result==1))
            ||((v=='after_right_solution_or_last_attempt')&&(!is_e || (result==1) || this.p_is_read_only || this.p_state.is_locked || this.p_state.is_timed_out || this.p_corrector_mode))
          ) {
        $('<input type="submit" id="courselet_button_next" style="'+(fade_next?'display:none':'')+'">').appendTo($p).on('click',function(evt) {
          evt.stopImmediatePropagation();
          evt.preventDefault();
          if(C.p_xarr_meta['@link_next_page_page']) {
            C.p_load_page_by_name(C.p_xarr_meta['@link_next_page_page'],true);
          } else {
            C.p_load_next_page();
          }
        }).attr('value',this.p_xarr_meta['@link_next_page_text']?this.p_xarr_meta['@link_next_page_text']:this.p_lg('button_next_page')).fadeIn();
      }
      if(this.p_params['button_custom']) {
        $('<input type="submit" id="courselet_button_custom">').val(this.p_params['button_custom']).appendTo($p).on('click',function(evt) {
          evt.stopImmediatePropagation();
          evt.preventDefault();
          C.p_external_send('event',{event:'buttoncustomclick',page_id:this.page_id});
        });
      }
    }
  };

  this.p_scrolltops=function($o,a) {
    var r={};
    var i=0;
    while($o.length) {
      if(a && a[i]) {
        $o.scrollTop(a[i]);
      }
      r[i]=$o.scrollTop();
      $o=$o.parent();
      i++;
    }
    return r;
  };

  this.p_meta_to_dom=function($dom,m) {
    try {
      if(m) {
        var mp=this.meta_page();
        // C.d(mp);
        for(var i in mp) {
          if(!i.match(/^(id|type|element)$/) && i.match(/^[a-z0-9_]+$/)) {
            $dom.attr('data-meta-page-'+i,mp[i]);
          }
        }
      } else {
        var dom=$dom.get(0);
        var t_arr=[];
        for(var i in dom.attributes) {
          var a=dom.attributes[i];
          if(a && a.name && a.name.match(/^data-meta-page-/)) {
            t_arr.push(a.name);
          }
        }
        for(var i in t_arr) {
          dom.removeAttribute(t_arr[i]);
        }
      }
    } catch(e) {
      C.d('meta_to_dom',e);
    }
  };

  this.p_draw=function() {
    var $dom=$('#'+C.p_params['dom_id_courselet']);
    var sc={};
    var transition=(this.p_xarr_meta['@transition']!=='disabled');
    $dom.fadeOut('normal');
    C.d('Drawing');

    if(!transition) {
      $dom.css('min-height',$dom.height()+'px');
      sc=this.p_scrolltops($dom);
    }
    // alert(JSON.stringify(this.p_scrolltops($dom)));

    this.p_is_exercise=false;
    this.p_is_scorm_content=false;
    this.p_result=Number.NaN;
    this.p_click_areas=[];
    this.p_reposition_objects=[];
    this.p_scorm_content_api_destruct();
    var html='';
    html+='<form id="courselet_form">';
    html+=C.p_draw_inner();
    html+='<div id="courselet_bottom"></div>';
    html+='</form>';
/*
    html+=this.json_encode(this.p_xarr_page);
    html+='<br><br>';
    html+=this.json_encode(this.p_xarr_pages_flat);
*/
    if(this.p_params['dom_id_breadcrumb']) {
      $('#'+this.p_params['dom_id_breadcrumb']).empty().append(this.p_draw_breadcrumb());
    }
//    var $dom=$('#'+this.p_params['dom_id_courselet']);
    $dom.stop(true,true).empty().hide();
    C.p_meta_to_dom($dom,0);
    var t=$dom.get(0).offsetHeight; // force redraw: scroll up
    t=t*1;
    if(transition) {
      $dom.parents().addBack().scrollTop(0); // iOS
    }

    $dom.append(html);
    C.p_meta_to_dom($dom,1);
    this.p_draw_init_tables();
    $dom.fadeIn(400,function() {
      C.p_reposition(2);
    });
    if(navigator.userAgent.match(/Edge|Trident/)) {
      $dom.find('img[src*="svg#"]').each(function() {
        $(this).attr('src',$(this).attr('src')+'a');
      });
    }

    this.p_update_feedbacks(0);
    this.manual_score.draw_init();
    this.slideshow.init();
    this.p_draw_init_subtitles();
    this.p_draw_init_bottom();
    this.p_draw_init_inputs();
    this.slider.draw_init();
    this.pairs.draw_init();
    this.p_page_methods.call('init');
    this.vocabulary_trainer.draw_init();
    this.crossword_puzzle.draw_init();
    this.p_draw_init_click_areas();
    this.p_draw_init_positions();
    this.p_draw_init_horizontal_radios();
    this.p_draw_init_flashcards(); // Arbeitet mit bereits berechneten Groessen anderer Elemente
    this.p_draw_init_folders();
    this.p_register_events();
    this.p_warning();
    this.p_reposition(2);
    window.setTimeout(function() {
      C.p_reposition(2);
    },600);
    C.d('Finished drawing.');
    if(window.MathJax) { // Ist beim ersten Laden noch nicht definiert
      window.MathJax.Hub.Queue(['Typeset',window.MathJax.Hub]);
      window.MathJax.Hub.Queue(function() {courselet.p_reposition();});
    }
    if(this.p_edit || !transition) {
      $dom.stop(true,true);
      if(!transition) {
        this.p_scrolltops($dom,sc);
      }
    }
  };

  this.p_draw_mathjax=function(s) {
    if(!this.p_mathjax_loaded) {
      this.p_mathjax_loaded=true;
      var h=document.getElementsByTagName('head')[0];
      var e=document.createElement('script');
      e.type='text/x-mathjax-config';
      e[(window.opera?'innerHTML':'text')]='MathJax.Hub.Config({tex2jax:{skipTags:[\'span\',\'a\',\'div\']}, \'HTML-CSS\':{imageFont:null} });'
        +'MathJax.Hub.Queue(function() {courselet.p_reposition();});';
      h.appendChild(e);
      var e=document.createElement('script');
      e.type='text/javascript';
      e.src=this.src('mathjax')+'?config=TeX-AMS_HTML-full';
      h.appendChild(e);
    }
    return '<script type="math/tex">'+s.replace(/<br>/g,'')+'</script>';
  };

  this.p_draw_media=function(param) {
    var html='';
    var responsive=(parseInt(param['responsive']) || ('audio'===param['type']));
    if(responsive) {
      param['class_name']=param['class_name']+' max_width';
    }
    if(param['restrictions']==='once') {
      param['class_name']=param['class_name']+' playable_once';
    }
    var add=(param['class_name']?(' class="'+param['class_name']+'"'):'')
           +(param['style']?(' style="'+param['style']+'"'):'')
           +(param['id']?(' id="'+param['id']+'"'):'');
    var width=parseInt(param['width']);
    var height=parseInt(param['height']);
    var mime_type=this.mime_type(param['href']);
    var autoplay=parseInt(param['autoplay']);
    var controls=parseInt(param['controls']);
    var inner=param['inner']?param['inner']:'';
    if(param['onended'] && (param['onended']==='next_page')) {
      add+=' onended="courselet.p_load_next_page();"';
    }
    // this.dump(param);
    switch(param['type']) {
      case 'audio':
          height=width=0;
          // replace_html @ ABC: <audio><source></audio>!
          html='<audio'+(controls?' controls="controls" controlsList="nodownload"':'')+(autoplay?' autoplay':'')+add+' preload="none"><source src="'+param['href']+'" type="'+mime_type+'"></audio>';
          if(!controls) {
            html+='<a href="#" class="courselet_icon_media_play_a"><img src="'+this.src('audio_play')+'" class="courselet_icon_media_play courselet_icon" alt="play/pause" title=""></a>';
          }
        break;
      case 'video':
          // iOS benoetigt http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.35.1
          html='<video width="'+width+'" height="'+height+'" controls="controls" controlsList="nodownload"'+(autoplay?' autoplay':'')+(param['still_href']?' poster="'+param['still_href']+'"':'')+add+' preload="none"><source src="'+param['href']+'" type="'+mime_type+'">'+inner+'</video>';
        this.p_page_features['is_video']=1;
        break;
      case 'embed':
        html='<embed src="'+param['href']+'" wmode="transparent" width="'+width+'" height="'+height+'"'+add+'>';
        this.p_page_features['is_embed']=1;
        break;
      case 'iframe':
        html='<iframe src="'+param['href']+'" width="'+width+'" height="'+height+'"'+add+'></iframe>';
        this.p_page_features['is_iframe']=1;
        break;
    }
    html='<span class="courselet_plugin'+(param['class_outer']?(' '+param['class_outer']):'')+'"'+(responsive?'':(' style="min-width:'+width+'px;min-height:'+height+'px"'))+'>'+html+'</span>';
    return html;
  };

  this.p_href=function(xarr,attribute_name) {
    var result=null;
    if(xarr['@'+attribute_name+'_href']) {
      result=xarr['@'+attribute_name+'_href'];
    } else if(xarr['@'+attribute_name+'_idref'] && this.p_ids_resources && this.p_ids_resources[xarr['@'+attribute_name+'_idref']]) {
      result=this.p_ids_resources[xarr['@'+attribute_name+'_idref']]['@href'];
    } else if(xarr['@'+attribute_name]) {
      result=xarr['@'+attribute_name];
    }
    return this.ie_edge_fix(result);
  };

  this.p_extract_inner_outer_css=function(xarr) {
    var o={'inner':'','outer':''};
    for(var t_key in xarr) {
      if(t_key && (t_key.substring(0,5)==='@css_')) {
        var css=t_key.substring(5).replace(/_/g,'-')+':'+xarr[t_key]+' !important;';
        if(css.match(/width:[0-9]+%.*/)) {
          o.inner+=css.replace(/[0-9]+/,'100');
          o.outer+=css;
        } else {
          o.inner+=css;
        }
      }
    }
    return o;
  };

  this.p_extract_css=function(xarr) {
    var o=this.p_extract_inner_outer_css(xarr);
    return o.inner+o.outer;
  };

  var CourseletDrawInner;// @jump draw_inner
  this.p_draw_inner=function() {
    var t='';
    var html='';
    var xarr_blocks=this.p_xarr_blocks; // p_xarr_page['page'][0]['contents'][0]['block'];
    var preview_results=this.p_preview_results;
    var select_options='';
    var horizontal_radios_options='';
    this.p_subtitles=false;
    this.p_xids={};
    this.p_block_feedback_attempts={};
    this.p_page_methods.clear();
    for(var b_i in xarr_blocks) {
      var xarr_block=xarr_blocks[b_i];
      var id_block=xarr_block['@id'];
      if(this.p_xids[id_block]) {
        alert('Duplicate ID: '+id_block);
      }
      this.p_xids[id_block]=xarr_block;
      var html_elements='';
      var xarr_elements=xarr_blocks[b_i]['element'];
      if(xarr_block['@random']) {
        xarr_elements=this.shuffle(xarr_elements);
      }
      var image_map='';
      var media_inner='';
      var element_types=[];
      for(var e_i in xarr_elements) {
        var xarr_element=xarr_elements[e_i];
        var xarr_element_before=xarr_elements[parseInt(e_i)-1];
        var xarr_element_after=xarr_elements[parseInt(e_i)+1];
        var e_id=xarr_element['@id'];
        var spacer=true;
        if(this.p_xids[e_id]) {
          alert('Duplicate ID: '+e_id);
        }
        this.p_xids[e_id]=xarr_element;
        if(xarr_element[0]==null) {
          xarr_element[0]='';
        }
        var html_element='';
        var html_element_prolog='';
        var data='';
        if(t=this.p_href(xarr_element,'audio_background')) {
          data+=' data-audio_background="'+t+'"';
        }
        if(xarr_element['@tooltip']) {
          data+=' data-tooltip="'+xarr_element['@tooltip']+'"';
        }
        element_types.push(xarr_element['@type']);
        var css=this.p_extract_css(xarr_element);
        var attr_css=css?(' style="'+css+'"'):''; // '+attr_css+'
        switch(xarr_element['@type']) {
          case 'line':
          case 'text':
            html_element+='<span class="courselet_text'+(xarr_element['@color']?(' courselet_text_marked_'+xarr_element['@color']):'')+'"'+attr_css+'>'+this.html(xarr_element[0])+'</span>';
            break;
          case 'html':
            html_element+='<span class="courselet_html">'+xarr_element[0]+'</span>';
            break;
          case 'definition':
            var descr=xarr_element['@description'];
            html_element+='<span class="courselet_text'+(descr?' courselet_definition':'')+(xarr_element['@color']?(' courselet_text_marked_'+xarr_element['@color']):'')+'"'+attr_css+'>'+this.html(xarr_element[0])+'</span>';
            if(descr) {
              this.p_mark_event('#'+e_id,'mouseover',this.html(descr),this.show_feedback);
            }
            break;
          case 'heading3':
            html_element+='<b class="heading3"'+attr_css+'>'+this.html(xarr_element[0])+'</b>';
            break;
          case 'download':
            html_element+='<a href="'+this.p_href(xarr_element,'file')+'" class="courselet_download_link" download target="_blank"'+attr_css+'>'+xarr_element[0]+'</a>';
            break;
          case 'internal_link':
            html_element+='<a href="#" title="'+(xarr_element['@page']?xarr_element['@page']:'')+'" class="courselet_internal_link"'+data+attr_css+'>'+xarr_element[0]+'</a>';
            break;
          case 'link':
            html_element+='<a rel="noreferrer noopener" href="'+this.p_href(xarr_element,'url')+'" target="'+this.p_params['external_link_target']+'" class="courselet_external_link"'+data+attr_css+'>'+xarr_element[0]+'</a>';
            break;
          case 'email':
            html_element+='<a href="mailto:'+encodeURIComponent(xarr_element['@to']?xarr_element['@to']:'')+'?subject='+encodeURIComponent(xarr_element['@subject']?xarr_element['@subject']:'')+'&body='+encodeURIComponent(xarr_element['@body']?xarr_element['@body']:'')+'" target="_top" class="courselet_email_link"'+data+attr_css+'>'+xarr_element[0]+'</a>';
            break;
          case 'map_link':
            var coords=this.explode_to_ints(',',xarr_element['@coords']);
            var hide_hotspot=(xarr_element['@hotspot']==='disabled');
            image_map+='<area shape="'+xarr_element['@shape']+'" coords="'+xarr_element['@coords']+'" title="'+xarr_element['@url']+'" rel="noreferrer noopener" href="'+this.p_href(xarr_element,'url')+'"'+(hide_hotspot?' tabindex="-1"':'')+' target="'+this.p_params['external_link_target']+'"'+data+'>';
            html_element+='<span></span>';
            html_element+=this.p_preview_area('#'+id_block+' .courselet_block_image',xarr_element['@shape'],coords,xarr_block['@border']?1:0,xarr_block['@border']?1:0);
            break;
          case 'map_internal_link':
          case 'map_wws_popup':
            var co='',attr='';
            if(xarr_element['@type']==='map_wws_popup') {
              var tl=xarr_element['@filename'];
              if(tl) {
                co='oc';
                tl+='.php';
                if(window.session_link) {
                  tl=window.session_link(tl);
                }
                attr=' data-known_popup="'+tl+'"';
              }
            } else {
              co='courselet_internal_link';
            }
            var coords=this.explode_to_ints(',',xarr_element['@coords']);
            var hide_hotspot=(xarr_element['@hotspot']==='disabled');
            image_map+='<area'+attr+' shape="'+xarr_element['@shape']+'" coords="'+xarr_element['@coords']+'" href="#" title="'+(xarr_element['@page']?xarr_element['@page']:'')+'" class="'+co+'"'+(hide_hotspot?' tabindex="-1"':'')+data+'>';
            html_element+='<span></span>';
            html_element+=this.p_preview_area('#'+id_block+' .courselet_block_image',xarr_element['@shape'],coords,xarr_block['@border']?1:0,xarr_block['@border']?1:0);
            break;
          case 'icon':
            if(xarr_element['@reference']) {
              data+=' data-reference="'+xarr_element['@reference']+'" tabindex="0"';
            }  
            var src=this.p_href(xarr_element,'image');
            if(!src && xarr_element['@local_image']) {
              src=C.src('path')+xarr_element['@local_image'];
            }
            if(src) {
              html_element+='<img class="courselet_icon" src="'+src+'"'+(xarr_element['@alt']?(' alt="'+xarr_element['@alt'].replace(/<.*?>/g,'')+'"'):'')+data+'>';
            }
            break;
          case 'audio':
            var co='';
            var ab=['transition'];
            if((!xarr_element_before || ab.includes(xarr_element_before['@type'])) && xarr_element_after && (xarr_element_after['@type']==='heading3')) { // Gesprochene Ueberschrift
              co='courselet_inline_float';
            }
            html_element+=this.p_draw_media({type:'audio',href:this.p_href(xarr_element,'audio'),autoplay:xarr_element['@autoplay'],controls:xarr_element['@controls'],class_outer:co,restrictions:xarr_element['@restrictions']});
            break;
          case 'webvtt':
            media_inner+='<track kind="captions" label="'+xarr_element['@label']+'" src="'+this.p_href(xarr_element,'file')+'"'+(xarr_element['@srclang']?(' srclang="'+xarr_element['@srclang']+'"'):'')+''+(xarr_element['@default']?' default':'')+'></track>';
            break;
          case 'video':
            html_element+=this.p_draw_media({type:'video',href:this.p_href(xarr_element,'video'),still_href:this.p_href(xarr_element,'still'),width:xarr_element['@width'],height:xarr_element['@height'],responsive:xarr_element['@responsive'],autoplay:xarr_element['@autoplay']});
            break;
          case 'checkbox':
            this.p_is_exercise=true;
            html_element_prolog=((html_elements && (xarr_element['@newline']!=='disabled'))?'<br>':'');
            var t='type="checkbox"';
            if(xarr_element['@radio']) {
              t='type="radio" name="radio_set_'+xarr_element['@radio']+'"';
            }
            html_element+='<input '+t+((preview_results && this.to_bool(xarr_element[0]))?' checked':'')+'>';
            break;
          case 'select':
            this.p_is_exercise=true;
            if(xarr_element['@options']) {
              select_options=xarr_element['@options'].split('|');
            }
            if(select_options) {
              html_element+='<span class="select_outer"><select>';
              for(var i in select_options) {
                var option=this.trim(select_options[i]);
                html_element+='<option value="'+option+'"'+((preview_results && (xarr_element[0]==option))?' selected':'')+'>'+option+'</option>';
              }
              html_element+='</select></span>';
            }
            break;
          case 'horizontal_radios':
            this.p_is_exercise=true;
            var show_titles=false;
            if(xarr_element['@options']) {
              horizontal_radios_options=xarr_element['@options'].split('|');
              show_titles=true;
            }
            if(horizontal_radios_options) {
              html_element_prolog=(html_elements?'<br>':'');
              var html_titles='';
              var html_inputs='';
              for(var i in horizontal_radios_options) {
                var option=this.trim(horizontal_radios_options[i]);
                html_titles+='<span class="courselet_horizontal_radios_title" style="display:inline-block">'+option+'</span>';
                html_inputs+='<span class="courselet_horizontal_radios_input" style="display:inline-block"><input type="radio" name="r:'+e_id+'" value="'+option+'"'+((preview_results && (xarr_element[0]==option))?' checked':'')+'></span>';
              }
              html_element_prolog+=(show_titles?(html_titles+'<br>'):'')+html_inputs;
              html_element='<span></span>';
            }
            break;
          case 'input':
          case 'input_levenshtein':
            this.p_is_exercise=true;
            var p=this.to_string(xarr_element['@placeholder']);
            var d=this.to_string(xarr_element['@default']);
            var sizing=this.to_string(xarr_element['@sizing'],'page');
            html_element+='<input class="courselet_input" type="text" value="'+(d.length?d:(preview_results?xarr_element[0]:''))+'"'+(p.length?(' placeholder="'+p+'"'):'')+' data-sizing="'+sizing+'" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false"'+attr_css+'>';
            break;
          case 'textarea':
            this.p_is_exercise=true;
            var p=this.to_string(xarr_element['@placeholder']);
            var d=this.to_string(xarr_element['@default']);
            var w=this.to_int(xarr_element['@width']);
            var h=this.to_int(xarr_element['@height']);
            w=w?(w+'px'):'100%';
            h=h?(h+'px'):'4em';
            html_element+='<textarea class="courselet_textarea" style="width:'+w+';height:'+h+';max-width:100%;box-sizing:border-box;'+css+'" '+(p.length?(' placeholder="'+p+'"'):'')+' autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">'+(d.length?d:(preview_results?xarr_element[0]:''))+'</textarea>';
            break;
          case 'break':
            html_element+='<br>';
            if(css) {
              html_element+='<span class="courselet_vertical_spacer" style="display:block;line-height:0;font-size:0;'+css+'"></span>';
            } else if(xarr_element['@blank_line']) {
              html_element+='<br>';
            }
            spacer=false;
            break;
          case 'table_column_break':
          case 'table_row_break':
            html_element+='</td>';
            if('table_row_break'===xarr_element['@type']) {
              html_element+='</tr><tr>';
            }
            var c=xarr_element['@text_align']?('courselet_table_text_align_'+xarr_element['@text_align']):'';
            html_element+='<td'+(c?(' class="'+c+'"'):'')+(xarr_element['@merge']?' data-merge="1"':'')+'>';
            spacer=false;
            break;
          case 'flashcard_break':
            var a=xarr_element['@timeout']?(' data-timeout="'+xarr_element['@timeout']+'"'):'';
            html_element+='<span class="courselet_flashcard_break"'+a+'></span>';
            spacer=false;
            break;
          case 'pairs_break':
            this.p_is_exercise=true;
            html_element+='<span class="courselet_pairs_break"></span>';
            spacer=false;
            break;
          case 'mix_and_match_break':
            // this.p_is_exercise=true;
            html_element+='<span class="courselet_mix_and_match_break"></span>';
            spacer=false;
            break;
          case 'table_cell':
          case 'position': // -> courselet_position
          case 'vocabulary_trainer_break':
            html_element+='<span class="courselet_'+xarr_element['@type']+'"></span>';
            spacer=false;
            break;
          case 'vocables':
            html_element+='';
            spacer=false;
            break;
          case 'feedback_score':
            html_element+='<span></span>'; // '+xarr_element[0]+'
            break;
          case 'click_area':
            var clickable=(xarr_element['@clickable']!=='disabled');
            this.p_is_exercise=clickable;
            var x=-1;
            var y=-1;
            // var r=0;
            var coords=this.explode_to_ints(',',xarr_element['@coords']);
            this.p_click_areas.push([id_block,e_id,x,y,coords,xarr_element['@shape'],clickable,xarr_element['@evaluation'],xarr_element['@clickable']]);
            html_element+='<span class="courselet_click_area" style="display:none;position:absolute;left:0px;top:0px;z-Index:'+(60000+1)+'"></span>';
            html_element+=this.p_preview_area('#'+id_block+' .courselet_block_image',xarr_element['@shape'],coords,xarr_block['@border']?1:0,xarr_block['@border']?1:0,clickable?null:'#CC0000');
            break;
          case 'timer':
            this.p_is_exercise=true;
            this.p_xarr_timer=xarr_element;
            if(preview_results) {
              html_element+='<span>[<span id="courselet_timeout">XX</span>]</span>';
            }
            break;
          case 'scorm_api':
            this.p_scorm_score_max=xarr_block['@score_max'];
            this.p_is_exercise=true;
            this.p_scorm_content_api_construct();
            html_element+='<span></span>';
            if(xarr_element['@debugging']) {
              html_element+='<pre id="courselet_scorm_content_api_debug">SCORM-API</pre>';
            }
            break;
          case 'wws_cms_api':
            this.p_scorm_score_max=xarr_block['@score_max'];
            this.p_is_exercise=true;
            window.send_result=function(i) {
              C.p_send_score(C.p_scorm_score_max-i,C.p_scorm_score_max);
            };
            html_element+='<span></span>';
            break;
          case 'dynamic':
            var t='';
            switch(xarr_element[0]) {
              case 'user_id':
              case 'user_name':
                t=this.htmlspecialchars(this.p_params[xarr_element[0]]);
                break;
              case 'now_date':
              case 'now_time':
                t=this.date(this.p_lg(xarr_element[0].substr(4)));
                break;
              case 'score_global':
              case 'percent_global':
              case 'score_page':
              case 'attempts_page':
              case 'time_left_global':
              case 'range':
              case 'reserved':
                t='<span class="'+xarr_element[0]+'">X</span>';
                break;
            }
            html_element+='<span'+attr_css+'>'+t+'</span>';
            break;
          case 'math':
            html_element+='<span class="courselet_math"'+attr_css+'>'+this.p_draw_mathjax(xarr_element[0])+'</span>';
            break;
          case 'timecode':
            var t=-1;
            var a=xarr_element[0].match(/^(?:([0-9]+):)?([0-9]+)$/);
            if(a) {
              t=60*parseInt(a[1]?a[1]:0)+parseInt(a[2]);
            }
            html_element+='<span data-timecode="'+t+'">'+xarr_element[0]+'</span>';
            break;
          case 'transition':
            html_element+='<span class="courselet_slideshow_transition"></span>';
            break;
          case 'crossword_puzzle_word':
            html_element+='<span class="courselet_crossword_puzzle_word"></span>';
            this.p_is_exercise=true;
            break;
          case 'slider_target':
          case 'slider':
          case 'syllabification':
          case 'highlighter':
          case 'highlighter_target':
          case 'audio_recorder':
          case 'manual_score':
          case 'range':
          case 'overlay':  
          case 'dev_test':
            var obj=this[xarr_element['@type']];
            if(!obj) {
              obj=this[xarr_element['@type'].match(/^[a-z]+/)];
            }
            var result=obj.draw(xarr_element,xarr_block);
            if(result.is_exercise) {
              this.p_is_exercise=true;
            }
            if(result.calls) {
              this.p_page_methods.push(result.calls);
            }
            if(result.feature) {
              this.p_page_features[result.feature]=1;
            }
            html_element+=result.html;
            // html_element+='<span class="courselet_highlighter_target">'+this.html(xarr_element[0])+'</span>';
            break;
          default:
            html_element+='<span style="text-decoration:line-through">['+xarr_element[0]+']</span>';
            break;
        }
        html_element=html_element.replace(/^(<\w+)/,'$1'+' id="'+e_id+'" data-courselet_element="1"');
        if(this.p_edit) {
          html_element+='<a class="courselet_edit courselet_edit_element" style="display:inline-block !important; text-decoration:none" data-id="'+e_id+'" href="#" data-tooltip="'+C.p_lg('edit_element')+'">&#9998;</a>';
        }
        html_elements+=html_element_prolog+html_element+'<span class="courselet_spacer'+(('disabled'===xarr_element['@spacer'])?' courselet_spacer_disabled':'')+'"'+(spacer?'':' style="display:none"')+'> </span>';
      }
      var html_block='';
      if(this.p_edit) {
        html_elements='<a class="courselet_edit courselet_edit_block" style="display:inline-block !important; text-decoration:none" data-id="'+id_block+'" href="#" data-tooltip="'+C.p_lg('edit_block')+'">&#9660;<!--&#10033;--></a>'+html_elements;
      }
      var o_css=this.p_extract_inner_outer_css(xarr_block);
      var css=o_css.outer+o_css.inner;
      var attr_css=css?(' style="'+css+'"'):''; // '+attr_css+'
      switch(xarr_block['@type']) {
        case 'heading1':
          html_block+='<h1'+attr_css+'>'+html_elements+'</h1>';
          break;
        case 'heading2':
          html_block+='<h2'+attr_css+'>'+html_elements+'</h2>';
          break;
        case 'folder':
          html_block+='<h2'+attr_css+' class="courselet_folder'+((xarr_block['@expanded'] || this.p_edit)?' courselet_folder_expanded':' courselet_folder_collapsed')+(xarr_block['@entangled']?' courselet_folder_entangled':'')+'">'+html_elements+'</h2>';
          break;
        case 'paragraph':
          html_block+='<p'+attr_css+' class="'+this.precede(xarr_block['@text_align'],' courselet_text_align_')+'">'+html_elements+'</p>';
          break;
        case 'list':
          var c=(xarr_block['@class']?xarr_block['@class']:'bullets');
          var m=this.elvis(xarr_block['@marker'],'');
          if(C.p_href(xarr_block,'image')) {
            m='<img src="'+C.p_href(xarr_block,'image')+'" alt="'+m+'">';
          } else if(m) {
            m='<span class="courselet_list_marker">'+m+'</span>';
          }
          if(m) {
            html_elements='<span class="before">'+m+'</span>'+html_elements;
            c='generic';
          }
          html_block+='<ul class="'+c+'"'+attr_css+'><li>'+html_elements+'</li></ul>';
          break;
        case 'box':
          html_block+='<p style="'+(xarr_block['@width']?('width:'+xarr_block['@width']+'px;'):'')+css+'" class="courselet_box'+this.precede(xarr_block['@text_align'],' courselet_text_align_')+(xarr_block['@align']?(' courselet_alignment_'+xarr_block['@align']):'')+(xarr_block['@color']?(' courselet_box_'+xarr_block['@color']):'')+'">'+html_elements+'</p>';
          break;
        case 'image':
          var t_map_id=(image_map?this.p_create_id():0);
          // onerror="alert(\'test\')" Edge zeigt SVG von Zeit zu Zeit nicht an, loest aber auch KEIN Event aus.
          // Moeglicherweise Workaround ueber Data-URI (svg laden per jQuery, danach tauschen?)
          var t_image='<img class="max_width courselet_block_image'+(xarr_block['@border']?' courselet_border':'')+(this.p_href(xarr_block,'magnification')?' courselet_magnification':'')+'" src="'+this.p_href(xarr_block,'image')+'"'+(xarr_block['@alt']?(' alt="'+xarr_block['@alt']+'" title="'+xarr_block['@alt']+'"'):'')+(t_map_id?(' usemap="#'+t_map_id+'"'):'')+this.precede(o_css.inner,' style="','"')+'>';
          if(this.p_href(xarr_block,'magnification')) {
          } else if(this.p_href(xarr_block,'url')) {
            t_image='<a rel="noreferrer noopener" href="'+this.p_href(xarr_block,'url')+'" target="'+this.p_params['external_link_target']+'">'+t_image+'</a>';
          } else if(xarr_block['@page']) {
            t_image='<a href="#" title="'+xarr_block['@page']+'" class="courselet_internal_link">'+t_image+'</a>';
          }
          if(t_map_id) {
            t_image+='<map name="'+t_map_id+'">'+image_map+'</map>';
          }
          html_block+='<div class="courselet_media'+(xarr_block['@align']?(' courselet_alignment_'+xarr_block['@align']):' courselet_alignment_normal')+(xarr_block['@placement']?(' courselet_placement_'+xarr_block['@placement']):' courselet_placement_vertical')+'"'+this.precede(o_css.outer,' style="','"')+'><div class="courselet_media_media_outer"><div class="courselet_media_media_inner">'+t_image+'</div></div>'+(html_elements?'<div class="courselet_media_caption_outer"><div class="courselet_media_caption_inner"'+attr_css+'>'+html_elements+'</div></div>':'')+'</div>';
          // html_block+='<table width="1%" class="courselet_media'+(xarr_block['@align']?(' courselet_alignment_'+xarr_block['@align']):'')+'"'+this.precede(o_css.outer,' style="','"')+'><tr><td>'+t_image+'</td></tr>'+(html_elements?'<tr><td'+attr_css+'>'+html_elements+'</td></tr>':'')+'</table>';
          break;
        case 'video':
          html_block+='<table width="1%" class="courselet_media'+(xarr_block['@align']?(' courselet_alignment_'+xarr_block['@align']):'')+'"><tr><td>'+this.p_draw_media({type:'video',href:this.p_href(xarr_block,'video'),still_href:this.p_href(xarr_block,'still'),width:xarr_block['@width'],height:xarr_block['@height'],responsive:xarr_block['@responsive'],autoplay:xarr_block['@autoplay'],onended:xarr_block['@onended'],inner:media_inner})+'</td></tr>'+(html_elements?'<tr><td'+attr_css+'>'+html_elements+'</td></tr>':'')+'</table>';
          break;
        case 'embed':
          var t=this.p_href(xarr_block,'file');
          html_block+='<table width="1%" class="courselet_media'+(xarr_block['@align']?(' courselet_alignment_'+xarr_block['@align']):'')+'"><tr><td>'+this.p_draw_media({type:'embed',href:t?t:'about:blank',width:xarr_block['@width'],height:xarr_block['@height'],responsive:xarr_block['@responsive']})+'</td></tr>'+(html_elements?'<tr><td'+attr_css+'>'+html_elements+'</td></tr>':'')+'</table>';
          break;
        case 'iframe':
          var t=this.p_href(xarr_block,'file');
          html_block+='<table width="1%" class="courselet_media'+(xarr_block['@align']?(' courselet_alignment_'+xarr_block['@align']):'')+'"><tr><td>'+this.p_draw_media({type:'iframe',href:t?(t+'/'+xarr_block['@link']):'about:blank',width:xarr_block['@width'],height:xarr_block['@height'],responsive:xarr_block['@responsive']})+'</td></tr>'+(html_elements?'<tr><td'+attr_css+'>'+html_elements+'</td></tr>':'')+'</table>';
          break;
        case 'overview':
          html_block+='<div>'+html_elements+this.p_draw_overview()+'</div>';
          break;
        case 'line':
          html_block+=html_elements?('<div>'+html_elements+'<hr></div>'):'<hr>';
          break;
        case 'clear':
          html_block+=html_elements?('<div>'+html_elements+'<div style="clear:both;height:0;overflow:hidden"></div></div>'):'<div style="clear:both;height:0;overflow:hidden"></div>';
          break;
        case 'sliders':
          var d='';
          ['stacked'].forEach(function(a) {
            if(xarr_block['@'+a]) {
              d+=' data-'+a+'="'+xarr_block['@'+a]+'"';
            }
          });
          html_block+='<p class="courselet_sliders"'+d+(xarr_block['@hidden']?' style="position:absolute;visibility:hidden"':'')+'>'+html_elements+'</p>';
          break;
        case 'html':
          html_block+='<div class="courselet_html"'+attr_css+'>'+html_elements+'</div>';
          break;
        case 'feedback':
          this.p_block_feedback_attempts[xarr_block['@attempt']]=1;
          html_block+='<div class="courselet_page_feedback'+(xarr_block['@hide_after_individual']?' courselet_page_feedback_hidden_after_individual':'')+'" style="display:none">'+html_elements+'</div>';
          break;
        case 'timer':
          if(preview_results) {
            html_block+='<p>'+html_elements+'</p>';
          }
          break;
        case 'table':
          var c='courselet_table';
          var d='';
          if(xarr_block['@gridlines']==='disabled') {
            c+=' courselet_table_without_gridlines';
          }
          if(xarr_block['@padding']==='disabled') {
            c+=' courselet_table_without_padding';
          }
          if(xarr_block['@text_align']) {
            c+=' courselet_table_text_align_'+xarr_block['@text_align'];
          }
          if(xarr_block['@symmetric']) {
            c+=' courselet_table_symmetric';
          }
          ['sizing','column_widths','row_heights'].forEach(function(a) {
            if(xarr_block['@'+a]) {
              d+=' data-'+a+'="'+xarr_block['@'+a]+'"';
            }
          });
          var src=this.p_href(xarr_block,'image');
          if(src) {
            c+=' courselet_table_background_sizing_'+(xarr_block['@image_sizing']?xarr_block['@image_sizing']:'cover');
          }
          html_block+='<table class="'+c+'"'+d+attr_css+'><tr><td>'+html_elements+'</td></tr></table>';
          if(src) {
            html_block+='<div style="position:absolute;opacity:0;height:1px;width:1px;overflow:hidden"><img src="'+src+'" id="'+this.p_create_id()+'" data-courselet_img_to_background="'+id_block+'"></div>';
          }
          break;
        case 'subtitles':
          this.p_subtitles=true;
          html_block+='<p class="courselet_subtitles" style="display:none">'+html_elements+'</p>';
          break;
        case 'flashcard':
          html_block+='<div class="courselet_flashcard'+(xarr_block['@align']?(' courselet_alignment_'+xarr_block['@align']):'')+'" style="visibility:hidden">'+html_elements+'</div>';
          break;
        case 'help':
          var a=(xarr_block['@align']=='left')?'left':'right';
          var t=xarr_block['@target'];
          var src=this.p_href(xarr_block,'image');
          t=t?t:'everyone';
          var i0=(src?('<img class="courselet_help_icon_inner_image" src="'+src+'">'):'');
          var i1=(xarr_block['@text']?('<span class="courselet_help_icon_inner_text">'+xarr_block['@text']+'</span>'):'');
          var it=(i0 || i1)?((a=='left')?(i0+i1):(i1+i0)):'<span class="courselet_help_icon_inner_text courselet_help_icon_inner_text_default"></span>';
          if((t==='everyone') || (this.p_instructor_mode && (t==='instructor')) || ((this.p_corrector_mode===2) && ((t==='corrector') || (t==='instructor'))) || this.p_params['author_mode']) {
            html_block+='<div class="courselet_help courselet_help_closed courselet_help_'+t+' courselet_help_alignment_'+a+'">'
                         +'<div class="courselet_help_icon" data-tooltip="'+(xarr_block['@tooltip']?C.html(xarr_block['@tooltip']):this.p_lg('help'))+'">'
                           +it
                         +'</div>'
                         +'<p class="courselet_help_inner" style="display:none;'+css+'">'+html_elements+'</p>'
                       +'</div>';
          }
          break;
        case 'slideshow':
        case 'conversation':
        case 'vocabulary_trainer':
        case 'pairs':
        case 'crossword_puzzle':
        case 'progress_bar':
        case 'dev_test':
        case 'mix_and_match':
        case 'lightbox':  
          var obj=this[xarr_block['@type']];
          var result=obj.draw(xarr_block,html_elements);
          html_block+=result.html;
          if(result.calls) {
            this.p_page_methods.push(result.calls);
          }
          break;
        case 'meta':
          break;
        default:
          html_block+='<p style="border: 2px solid black;text-decoration:line-through">['+html_elements+']</p>';
          break;
      }
      var block_add_attrs=' id="'+id_block+'" data-courselet_block="1" data-courselet_element_types="'+element_types.join(' ')+'"';
      if(html_block.includes('{{') && html_block.includes('}}')) {
        block_add_attrs+=' data-courselet_block_contains_double_braces="1"';          
      }
      html_block=html_block.replace(/^(<\w+)/,'$1'+block_add_attrs);
      html+=html_block;
    }
    return html;
  };

  this.p_draw_overview=function () {
    var html='<ul class="courselet_overview">';
    for(var i in this.p_xarr_pages_flat) {
      var xarr_page=this.p_xarr_pages_flat[i];
      if(xarr_page['@overview']!='hidden') {
        html+='<li class="courselet_overview_levels courselet_overview_level'+Math.min(xarr_page['@level'],5)+'">';
        var overview_type=xarr_page['@overview'];
        if(!overview_type) {
          overview_type='score score_max'; // default
        }
        var score_max=parseInt(xarr_page['@score_max']);
        var score=parseInt(xarr_page['@score']);
        var attempts=parseInt(xarr_page['@attempts']);
        var time=parseInt(xarr_page['@time']);
        var percent=(score_max?Math.round(100*score/score_max):score);
        if(overview_type==='reflection') {
          // FIXME reflection
        } else if((overview_type!='no_score') && score_max) {
          if(attempts) {
            if(overview_type.search(/passed/)>=0) {
              if(score>=score_max) {
                score='<img class="courselet_icon_passed courselet_icon" src="'+this.src('passed')+'">';
              } else if(overview_type.search(/failed/)>=0) {
                score='<img class="courselet_icon_undone courselet_icon" src="'+this.src('failed')+'">';
              } else {
                score='<img class="courselet_icon_undone courselet_icon" src="'+this.src('undone')+'">';
              }
            }
          } else {
            percent=score='<img class="courselet_icon_undone courselet_icon" src="'+this.src('undone')+'">';
            if(overview_type.search(/score score_max/)>=0) {
              overview_type='score score_max';
            }
          }
          html+='<div class="courselet_overview_results">';
          html+=this.p_lg('overview_'+overview_type.replace(/ /g,'_'),score,score_max,attempts,time,percent);
          html+='</div>';
        }
        if(xarr_page['@is_empty'] && !this.p_params['author_mode']) {
          html+=this.html(xarr_page['@title']);
        } else {
          html+=this.html('[['+xarr_page['@title']+']]');
        }
        html+='</li>';
      }
    }
    html+='</ul>';
    return html;
  };

  this.p_text_width=function(solution,class_name) {
    var width=0;
    solution=this.to_string(solution);
    if(solution.length) {
      var a=solution.split('|');
      for(var i in a) {
        var s=this.trim(a[i]);
        var $elem=$('<span id="courselet_text_width" style="display:inline-block;visibility:hidden" class="'+class_name+'">'+s+'</span>').appendTo('#'+this.p_params['dom_id_courselet']);
        width=Math.max(width,$elem.width());
        $elem.remove();
      }
    }
    return width;
  };

  this.p_resize_all_cards=function() {
    this.resize_cards($('.courselet_flashcard, .courselet_vocabulary_trainer_card, .courselet_pairs_card'));
  };

  this.animate=function(callback,finished) {
    $('<div style="width:0"></div>').animate({width:1000+'px'},{step:function(i) {
      callback(i/1000);
    },complete:function() {
      if(finished) {
        finished();
      }
    }/*,duration:1000*/});
  };

  this.turnaround=function($from,$to,tf,middle,finished) {
    var swapped=0;
    var $e=$from.add($to);
    var css='';
    var val;
    this.animate(function(i) {
      if(i>=0.5) {
        if(!swapped) {
          $from.css({visibility:'hidden'});
          $to.css({visibility:''}); // 'visible'
          swapped=1;
          if(middle) {
            middle();
          }
        }
        val=2-2*i;
      } else {
        val=2*i;
      }
      switch(tf) { // https://developer.mozilla.org/en-US/docs/Web/CSS/transform
        case 'rotateX':
        case 'rotateY':
          css=tf+'('+Math.round(90*val)+'deg)';
          break;
        case 'rotate':
          css=tf+'('+Math.round(180*val)+'deg)';
          break;
        case 'scale':
          css=tf+'('+(1-val)+','+(1-val)+')';
          break;
      }
      $e.css({'-webkit-transform':css,'-moz-transform':css,'-ms-transform':css,'-o-transform':css,'transform':css});
    },finished);
  };

  this.resize_cards_w={};
  this.resize_cards=function($cards,init) {
    if($cards.length) {
      var w=this.resize_cards_w[this.page_id]?this.resize_cards_w[this.page_id]:80;
      var $pages=$cards.children();
      var $inner=$pages.children();
      if(init) {
        $cards.css({position:'relative'});
        $pages.css({position:'absolute',display:'table','box-sizing':'content-box'});
        $inner.css({display:'table-cell','box-sizing':'content-box'});
      }
      var iw=1000;
      var ih=1000;
      w-=4; // 2020-09-08: Chrome 85 bei Zoom 90%: tw immer groesser als w
      while(((iw>w)||(ih>w))&&(w<1000)) {
        w+=2;
        $pages.width(w);
        var tw=0;
        var th=0;
        $inner.each(function() {
          tw=Math.max(tw,$(this).outerWidth());
          th=Math.max(th,$(this).outerHeight());
        });
        iw=Math.min(iw,tw);
        ih=Math.min(ih,th);
        C.d([w,tw,iw,th,ih]);
      }
      $pages.width(w).height(w);
      $cards.width($pages.outerWidth()).height($pages.outerHeight());
      this.resize_cards_w[this.page_id]=w;
    }
  };

  this.p_evaluate_flashcards=function() {
    var $cards=$('.courselet_flashcard');
    if($cards.length) {
      this.resize_cards($cards);
      $cards.filter('[data-visible]').each(function() {
        var $t=$(this);
        window.setTimeout(function() {
          if($t.attr('data-visible')) {
            $t.click();
          }
        },100); // Kurze Verzoegerung, damit Events abgearbeitet sind und die Animation fluessiger laeuft
      });
    }
  };

  this.draw_card=function($card,cn,turnmode,callback0,callback1) { // turnmode: 1: 0 loeschen, 2: n<2 loeschen, 4: letzte Seite loeschen
    var $inner=null;
    var $page=null;
    var i=0;
    var ss=false;
    var timer=null;
    var $children=$card.children();
    $card.append($page=$('<div class="'+cn+'_page '+cn+'_page'+i+'"></div>'));
    $page.append($inner=$('<div class="'+cn+'_page_inner"></div>'));
    $children.each(function() {
      var $t=$(this);
      var b=$t.hasClass(cn+'_break');
      if(b) {
        i++;
        $card.append($page=$('<div class="'+cn+'_page '+cn+'_page'+i+'"></div>'));
        $page.css({visibility:'hidden'});
        $page.append($inner=$('<div class="'+cn+'_page_inner"></div>'));
        ss=true;
        if($t.attr('data-timeout')) {
          $page.attr('data-timeout',$t.attr('data-timeout'));
        }
      }
      if(!b && ss) {
        ss=$t.hasClass('courselet_spacer');
      }
      if(!b && !ss) {
        $inner.append($t); // Verschieben
      } else {
        $t.remove();
      }
    });
    $card.attr('data-visible',null).css({visibility:'visible'}).click(function(evt) {
      // Globale Events bubblen zum Schluss und muessen hier rein
      if(callback0) {
        callback0($card);
      }
      if($(evt.target).not('INPUT, TEXTAREA, SELECT, OPTION, .courselet_syllabification, .courselet_highlighter, .courselet_highlighter_target').length) {
        var $children=$card.children();
        if($children.length>1) {
          var $from,$to;
          var del=false;
          if(timer) {
            window.clearTimeout(timer);
            timer=null;
          }
          if($card.attr('data-visible')) {
            $to=$children.first();
            $from=$to.next();
            $card.attr('data-visible',null);
            del=($card.children().length>2)?(turnmode & 2):(turnmode & 4);
          } else {
            $from=$children.first();
            $to=$from.next();
            if(!(del=(turnmode & 1))) {
              $card.attr('data-visible',1);
            }
          }
          C.turnaround($from,$to,'rotateY',null,function() {
            if(callback1) {
              callback1($card);
            }
            if(del) {
              $from.remove();
            }
            if($to.attr('data-timeout')) {
              timer=window.setTimeout(function() {
                timer=null;
                if($card.attr('data-visible')) {
                  $card.click();
                }
              },$to.attr('data-timeout')*1000);
            }
            // $card.click();
          });
        }
      }
    });
  };

  this.p_draw_init_folders=function() {
    var sel='.courselet_folder';
    var $f=$(sel);
    if($f.length) {
      var u=function($h) {
        if($h.length) {
          var v=$h.hasClass('courselet_folder_expanded');
          var $n=$h.nextUntil(sel+', #courselet_bottom');
          $h.attr('aria-expanded',v?'true':'false');
          if(v) {
            $h.removeClass('courselet_folder_collapsed');
            $n.removeClass('courselet_folder_hidden');
          } else {
            $h.addClass('courselet_folder_collapsed');
            $n.addClass('courselet_folder_hidden');
          }
        }
      };
      $f.not(':empty').each(function() {
        u($(this));
      }).on('click',function(evt) {
        var $t=$(this);
        if($t.hasClass('courselet_folder_entangled') && !$t.hasClass('courselet_folder_expanded')) {
          u($f.filter('.courselet_folder_entangled.courselet_folder_expanded').removeClass('courselet_folder_expanded'));
        }
        u($t.toggleClass('courselet_folder_expanded'));
        C.hide_feedback();
        C.p_reposition(2); // Mehrere Durchlaeufe fuer "Luecken auf Grafik" und anschliessend "Gleiter in Luecken".
      });
    }
  };

  this.p_draw_init_flashcards=function() {
    var $cards=$('.courselet_flashcard');
    if($cards.length) {
      $cards.each(function() {
        C.draw_card($(this),'courselet_flashcard',2);
      });
      this.resize_cards($cards,true);
    }
  };

  this.p_draw_init_subtitles_interval=null;
  this.p_draw_init_subtitles=function() {
    if(this.p_draw_init_subtitles_interval) {
      window.clearInterval(this.p_draw_init_subtitles_interval);
      this.p_draw_init_subtitles_interval=null;
    }
    if(this.p_subtitles) {
      var $children=$('.courselet_subtitles').show().children().hide();
      var $media=$('video').first();
      if(!$media.length) {
        $media=$('audio[controls]').first();
      }
      if(!$media.length) {
        $media=$('audio').first();
      }
      if($media.length) {

        var $arr_subtitles={};
        $('span[data-timecode]').each(function() {
          $arr_subtitles[$(this).attr('data-timecode')]=$(this);
          //alert($(this).attr('data-timecode'));
        });
        var last_pos=-2;
        var set_position=function(pos) {
          var next_pos=-2;
          for(var i_pos in $arr_subtitles) {
            if(i_pos<=pos) {
              next_pos=i_pos;
            }
          }
          if(last_pos!==next_pos) {
            last_pos=next_pos;
            var $t=$arr_subtitles[next_pos];
            if($t && $t.length) {
              $children.not($t.nextUntil('span[data-timecode]').show()).hide();
              $t.hide();
            } else {
              $children.hide();
            }
          }
        };

        this.p_draw_init_subtitles_interval=window.setInterval(function() {
          var pos=$media.get(0).currentTime;
          set_position(pos);
        },250);
      }
    }
  };

  this.p_draw_init_tables=function() {
    $('table.courselet_table_symmetric').each(function() {
      var $table=$(this);
      var o=0,e=0,l=0;
      $table.find('tr').each(function() {
        var tl=$(this).find('td').length;
        if(tl % 2) {
          e++;
        } else {
          o++;
        }
        l=Math.max(l,tl);
      });
      var oe=(o && e);
      var w=(100/l);
      if(oe) {
        $table.find('td').attr('colspan',2);
      }
      // Breiten je nach Browser ungenau, werden ggf. weiter unten wieder geloescht
      $table.find('td').css({width:w+'%'});
      $table.find('tr').each(function() {
        var $r=$(this);
        var tl=$r.find('td').length;
        if(tl<l) {
          var td='<td class="courselet_table_symmetric_spacer" style="width:'+(w/2)+'%"></td>';
          var tdt='';
          for(var i=0;i<(l-tl)/(oe?1:2);i++) { // Chrome: colspan fuehrt zu Fehldarstellung mit border, IE kennt kein repeat()
            tdt=td+tdt;
          }
          $r.prepend(tdt).append(tdt);
        }
      });
    });
    $('table.courselet_table').find('td[data-merge]').each(function() {
      var $r=$(this);
      var $l=$r.prev();
      $r.children().each(function() {
        $l.append($(this));
      });
      var lc=C.to_int($l.attr('colspan'));
      var rc=C.to_int($r.attr('colspan'));
      $l.attr({colspan:(lc?lc:1)+(rc?rc:1)});
      $r.remove();
      $l.css({width:''});
    });
    $('table.courselet_table[data-sizing="width"]').each(function() {
      // Breiten exakt gleich, aber je nach Browser zu schmal
      var $table=$(this);
      var nc=0;
      $table.find('tr').each(function() {
        var tnc=0;
        $(this).find('td,th').each(function() {
          var cs=C.to_int($(this).attr('colspan'));
          tnc+=(cs?cs:1);
        });
        nc=Math.max(nc,tnc);
      });
      var cols='';
      for(var i=0;i<nc;i++) {
        cols+='<col style="width:'+(100/nc)+'%">';
      }
      $table.prepend('<colgroup>'+cols+'</colgroup>');
      $table.find('td').css({width:''});
    });
    $('table.courselet_table[data-column_widths]').each(function() {
      var $t=$(this);
      var ws=C.explode_to_ints(',',$t.attr('data-column_widths'));
      if(ws.length) {
        if(!$t.children('colgroup').length) {
          $t.prepend('<colgroup></colgroup>');
        }
        var $cg=$t.children('colgroup');
        for(var i=$t.find('col').length;i<ws.length;i++) {
          $cg.append('<col>');
        }
        var v=0;
        $t.find('col').each(function(i) {
          v=(i<ws.length)?ws[i]:v;
          $(this).css({width:v+'px'});
        });
      }
      $t.find('td').css({width:''});
    });
    $('table.courselet_table[data-row_heights]').each(function() {
      var $t=$(this);
      var hs=C.explode_to_ints(',',$t.attr('data-row_heights'));
      if(hs.length) {
        var v=0;
        $t.find('tr').each(function(i) {
          v=(i<hs.length)?hs[i]:v;
          $(this).css({height:v+'px'});
        });
      }
    });
    $('table.courselet_table span.courselet_table_cell').each(function() {
      var e_id=$(this).attr('id');
      var xarr_element=C.p_xids[e_id];
      var $td=$(this).parent();
      var a=['text_align','border_top','border_right','border_bottom','border_left','background_color'];
      for(var i in a) {
        if(xarr_element['@'+a[i]]) {
          $td.addClass('courselet_table_'+a[i]+'_'+xarr_element['@'+a[i]]);
        }
      }
      $td.attr('style',C.p_extract_css(xarr_element));
    });

  };

  this.p_draw_init_inputs=function() {
    var width=0;
    $('.courselet_input').each(function(i) {
      var $this=$(this);
      var xarr=C.p_ids_page[$this.attr('id')];
      var t=xarr[0];
      var d=xarr['@default'];
      var p=xarr['@placeholder'];
      var w=Math.max(C.p_text_width(t,'courselet_input'),C.p_text_width(d,'courselet_input'),C.p_text_width(p,'courselet_input'));
      if($this.attr('data-sizing')==='page') {
        width=Math.max(width,w);
      } else {
        $this.width(w+2);
      }
    });
    $('.courselet_input[data-sizing="page"]').width(width+2); // 2 -> FF
  };

  this.equalize_size=function(sources,targets,add_width,add_height) {
    var t_width=0;
    var t_height=0;
    $(sources).each(function(i) {
      var $this=$(this);
      t_width=Math.max(t_width,$this.width());
      t_height=Math.max(t_height,$this.height());
    });

    if(!isNaN(add_width)) {
      $(targets).width(Math.ceil(t_width+add_width));
    }
    if(!isNaN(add_height)) {
      $(targets).height(Math.ceil(t_height+add_height));
    }
  };

  this.p_draw_init_horizontal_radios=function() {
    this.equalize_size('.courselet_horizontal_radios_title,.courselet_horizontal_radios_input','.courselet_horizontal_radios_title,.courselet_horizontal_radios_input',0);
  };

  this.p_draw_init_click_areas=function() {
    var $a=$('area[tabindex=-1]');
    $a.filter(':not([data-internal_link])').each(function() {
      $(this).attr('data-internal_link',$(this).attr('title'));
    });
    $a.css({cursor:'default'}).attr('title','');
    this.p_click_area_reposition(1);
  };

  this.p_draw_init_positions=function() {
    var $form=$('#courselet_form');
    $form.find('.courselet_position').each(function() {
      var $this=$(this);
      var e_id=$this.attr('id');
      var xarr_element=C.p_xids[e_id];
      var $temp;
      var $target=false;
      if(($temp=$this.parents('.courselet_media')) && $temp.length) {
        $target=$temp.find('img.courselet_block_image').first();
      }
      if($target && $target.length) {
        var $a=$('<span style="display:block;position:absolute;'+C.p_extract_css(xarr_element)+'"></span>').append($this.nextUntil('.courselet_position')).appendTo($form);
        var coords=C.explode_to_ints(',',xarr_element['@coords']);
        $a.addClass(C.precede(xarr_element['@background_color'],'courselet_background_color_'));
        C.p_reposition_objects.push([$target,$a,coords[0],coords[1],coords[2]?(1+coords[2]-coords[0]):0,coords[3]?(1+coords[3]-coords[1]):0]);
      }
    });
  };

  this.p_click_area_remove=function(element_id) {
    for(var i in this.p_click_areas) {
      if(this.p_click_areas[i][1]==element_id) {
        this.p_click_areas[i][2]=-1;
        this.p_click_areas[i][3]=-1;
        this.p_click_area_reposition(1);
      }
    }
  };

  this.p_get_image_original_width=function($image) {
    var w0=0;
    if($image) {
      if(!(w0=$image.attr('data-original_width'))) {
        if($image.filter('img').length) {
          var t=$image.css('max-width');
          $image.css({maxWidth:'none'});
          $image.attr({'data-original_width':w0=$image.width()});
          $image.css({maxWidth:t});
        }
      }
    }
    return w0;
  };

  this.p_get_image_scale=function($image) {
    var t;
    if($image && (t=$image.css('max-width'))) {
      var w0=this.p_get_image_original_width($image);
      var w1=$image.width();
      if(w0 && (w0>w1)) {
        // C.d('Scale: '+w1+'/'+w0+'='+(w1/w0));
        return (w1/w0);
      }
    }
    return 1;
  };

  this.p_click_area_click=function(block_id,$image,x,y) {
    var empty=-1;
    var right=-1;
    var scale=this.p_get_image_scale($image);
    x/=scale;
    y/=scale;
    for(var i in this.p_click_areas) {
      var a=this.p_click_areas[i];
      var coords=a[4];
      if(a[0]==block_id) {
        if((a[2]<0) && (a[3]<0) && a[6]) {
          empty=i;
        }
        if((right==-1) && (x>=coords[0]) && (y>=coords[1]) && (x<=coords[2]) && (y<=coords[3])) {
          right=i;
        }
      }
    }
    if((right>=0) && (!this.p_click_areas[right][6])) {
      var r=35;
      var o=$image.offset();
      $(this.svg(2*r,2*r,'<circle cx="'+r+'" cy="'+r+'" r="'+r+'" fill="#FF3333" />')).appendTo('body').offset({left:o.left+x-r,top:o.top+y-r}).fadeOut(function() {$(this).remove();});
      if(this.p_click_areas[right][7]) {
        this.p_schedule_evaluation();
      }
    } else if(empty>=0) {
      if(right>=0) { // Bei Treffer auch gleich das richtige Fadenkreuz abgelegen
        this.p_click_areas[empty][2]=this.p_click_areas[right][2];
        this.p_click_areas[empty][3]=this.p_click_areas[right][3];
        this.p_click_areas[right][2]=x;
        this.p_click_areas[right][3]=y;
        if(this.p_click_areas[right][7]) {
          this.p_schedule_evaluation();
        }
      } else {
        this.p_click_areas[empty][2]=x;
        this.p_click_areas[empty][3]=y;
      }
      this.p_click_area_reposition(1);
    }
  };

  this.p_click_area_reposition=function(init_crosshairs) {
    // C.d(this.p_click_areas);
    for(var i in this.p_click_areas) {
      var a=this.p_click_areas[i];
      var id=a[1];
      var x=0;
      var y=0;
      var $image=$('#'+a[0]+' img');
      var visible=false;
      var $marker=$('#'+id);
      if(init_crosshairs) {
        $marker.empty().append('<img class="courselet_click_area_crosshairs" src='+this.src('crosshairs')+'>');
        if(a[8]==='hidden') {
          $marker.find('img').css({opacity:0}); // "visibility:hidden" ist nicht klickbar
        }
      }
      if($image.length) {
        if((a[2]>=0) && (a[3]>=0)) {
          var scale=this.p_get_image_scale($image);
          var $marker_image=$('#'+id+' img');
          $marker.show();
          var offset=$image.offset();
          x=Math.round(offset.left+scale*a[2]-$marker_image.width()/2);
          y=Math.round(offset.top+scale*a[3]-$marker_image.height()/2);
          $marker.offset({'left':x,'top':y});
          visible=true;
        }
      }
      if(!visible) {
        $marker.fadeOut('fast');
      }
    }
  };


  
  this.p_reposition=function(rep) {
    // "Normale" Grafiken werden per CSS verkleinert.
    var $dom=$('#'+this.p_params['dom_id_courselet']);
    var lmh=$dom.css('min-height');
    var dom_max_width=Math.max(2,$dom.width()-4);
    
    var max_width=function($e) {
      var r=dom_max_width;
      var $p=$e.parents('.courselet_lightbox_inner, .courselet_lightbox_outer');
      var pw=$p.first().innerWidth();
      if($p.length && (pw>2)) {
        r=Math.min(pw,r);
        // console.log($e.html());
      }
      return r;
    };    
    
    if(!lmh || !parseInt(lmh) || (parseInt(lmh)<$dom.height())) {
      $dom.css('min-height',$dom.height()+'px'); // verhindert Hochscrollen bei Berechnung unter iOS
    }
    // var max_width=Math.max(2,$dom.width()-4);
    $('.max_width').each(function() {
      $(this).css({maxWidth:max_width($(this))+'px'});
    });
    $('.max_width[width][height]').each(function() {
      var $t=$(this);
      var max_height=$t.attr('height')*max_width($t)/$t.attr('width');
      $t.css({maxHeight:max_height+'px'});
    });
    $('.courselet_media').each(function() {
      var $t=$(this);
      $t.attr('data-courselet_media_width_quotient','unknown');
      var img=$t.find('.courselet_media_media_inner img').first().each(function() {
        $t.attr('data-courselet_media_width_quotient',(Math.trunc(100*dom_max_width/Math.max(1,C.p_get_image_original_width($(this))))/100).toFixed(2));
      });
    });
    $('.courselet_media_caption_outer, .courselet_media tr:nth-child(2)').each(function() {
      $(this).children().css({padding:($(this).height()>4)?'':'0'});
    });
    $('img.max_width[usemap]').each(function() {
      var name=$(this).attr('usemap').substring(1);
      var scale=C.p_get_image_scale($(this));
      $('map[name="'+name+'"]').children('area[coords]').each(function() {
        var $area=$(this);

        var s=$area.data('coords');
        if(!s) {
          $area.data('coords',s=$area.attr('coords'));
        }
        var coords=C.explode_to_ints(',',s);
        for(var i in coords) {
          coords[i]=Math.round(scale*coords[i]);
        }
        $area.attr('coords',coords.join(','));
      });
    });
    this.slider.reposition(false,true);
    this.p_click_area_reposition();
    if(this.p_reposition_objects) {
      for(var i in this.p_reposition_objects) {
        var a=this.p_reposition_objects[i];
        var $master=$(a[0]);
        var $slave=$(a[1]);
        if($master.length && $slave.length) {
          var offset=$master.offset();
          var scale=this.p_get_image_scale($master);
          $slave.offset({'left':Math.round(offset.left+scale*a[2]),'top':Math.round(offset.top+scale*a[3])});
          if(a[4]) {
            $slave.width(Math.round(scale*a[4]));
          }
          if(a[5]) {
            $slave.height(Math.round(scale*a[5]));
          }
        }
      }
    }
    this.syllabification.p_reposition_layer();
    this.crossword_puzzle.p_reposition_layer();
    this.corrector.p_reposition_layer();
    this.crossword_puzzle.p_reposition_layer();
    this.p_page_methods.call('reposition');
    $dom.css('min-height',lmh);
    if(rep>1) {
      this.p_reposition(rep-1);
    }
  };

  this.p_preview_area=function(target_selector,shape,coords,shift_x,shift_y,color) {
    var html='';
    if(this.p_preview_results) {
      var my_id=this.p_create_id();
      html='<span id="'+my_id+'" style="display:block;background-color:'+(color?color:'#00CC00')+';opacity:0.5;position:absolute;left:0px;top:0px;overflow:hidden;z-Index:'+(60000+10)+'" onmouseover="this.style.display=\'none\'"></span>';
      this.p_reposition_objects.push([target_selector,'#'+my_id,coords[0]+shift_x,coords[1]+shift_y,1+coords[2]-coords[0],1+coords[3]-coords[1]]);
    }
    return html;
  };

  this.p_warning=function(text) {
    $('#courselet_warning').remove();
    var delay=3000;
    if(!text) {
      if(this.p_load_error) {
        text=this.p_load_error;
        delay=86400;
      } else if(this.p_is_read_only) {
        text=this.p_lg('read_only');
        delay=5000;
      } else if(this.p_max_attempts==1) {
        text=this.p_lg('only_one_attempt');
      }
    }
    if(text && (' '!==text)) {
      $('<p id="courselet_warning" style="display:none;position:fixed;left:25%;top:25%;width:50%;margin-left:auto;margin-right:auto;z-Index:'+(60000+11)+'"></p>').text(text).appendTo('body').fadeTo('normal',0.8).delay(delay).fadeOut().click(function(evt) {
        $(this).remove();
      });
    }
  };

  this.p_page_methods=new function() {

    this.p_arr={};

    this.clear=function() {
      this.p_arr={};
    };

    this.call=function(m,p1) {
      if(this.p_arr[m]) {
        for(var i in this.p_arr[m]) {
          var c=this.p_arr[m][i];
          // C.d('Calling page method: '+m);
          c(p1);
        }
      }
    };

    this.push=function(o) {
      if(o) {
        for(var i in o) {
          if(!this.p_arr[i]) {
            this.p_arr[i]=[];
          }
          if(o[i]) {
            var skip=false;
            for(var j in this.p_arr[i]) {
              if(this.p_arr[i][j]===o[i]) {
                skip=true;
              }
            }
            if(!skip) {
              // C.d('Registering page method: '+i);
              this.p_arr[i].push(o[i]);
            } else {
              // C.d('Skipped page method: '+i);
            }
          }
        }
      }
    };

  };

/* --------------- */

  var Lightbox; // @jump lightbox
  this.lightbox=new function() {
    
    this.draw=function(xarr_block,html_elements) {
      var result={};
      result.html='<div class="courselet_lightbox_outer '+C.precede(xarr_block['@background_color'],'courselet_background_color_')+'" data-reference="'+xarr_block['@reference']+'" style="display:none;'+C.p_extract_css(xarr_block)+'"><div class="courselet_lightbox_inner '+C.precede(xarr_block['@text_align'],' courselet_text_align_')+'">'+html_elements+'</div></div>';
      result.calls={
        reposition: this.reposition,
        reference: this.reference
      };
      return result;
    };    
    
    this.reference=function(ref) {
      var $all=$('div.courselet_lightbox_outer');
      var $one=$all.filter('[data-reference="'+ref+'"]');
      if(!$one.filter('.courselet_lightbox_visible').length) {
        if($all.filter('.courselet_lightbox_visible').length) {
          $('#courselet_layer_black').click();
        }
        if($one.length) {
          window.setTimeout(function() { // Erst ausfuehren, wenn alle Referenz-Objekte durchgerattert sind.
            C.d('Lightbox: '+ref);
            var $b=C.black_layer(null,0.2,null,function() {
              $('.courselet_lightbox_visible').hide().removeClass('courselet_lightbox_visible');   
            });
            // $one.insertAfter('#courselet_layer_black');
            $one.fadeIn(300).addClass('courselet_lightbox_visible').css({position:'fixed',zIndex:(60000+10)}).on('click',function() {
              $b.trigger('click');
            });
            C.p_reposition();
            //C.lightbox.reposition();
          });
        }
      }
    };
    
    this.reposition=function() {
      var $one=$('.courselet_lightbox_visible');
      if($one.length) {
        var w=$one.outerWidth();
        var h=$one.outerHeight();
        $one.css({left:'calc(50vw - '+(w/2)+'px)',top:'calc(50vh - '+(h/2)+'px)'});
      }
    };
    
  };
  
/* --------------- */

  var ProgressBar; // @jump progress_bar
  this.progress_bar=new function() {

    this.draw=function(xarr_block) {
      var result={};
      var html='<ul class="courselet_progress_bar">';
      var pos='before';
      var nav_mode=((xarr_block['@navigation']!=='disabled')?((xarr_block['@navigation']!=='visited')?1:2):0);
      var tt_mode=(xarr_block['@tooltips']==='disabled')?0:1;
      var xarr_pages=C.p_xarr_pages;
      // var cnt=xarr_pages.length; xarr_pages wird offline zum Objekt 
      var cnt=0;
      for(var i in xarr_pages) {
        cnt++;
      }
      var current_id=C.p_xarr_pages_page['@top_id']?C.p_xarr_pages_page['@top_id']:C.page_id;
      var nav_a=[];
      if(nav_mode===2) {
        nav_a=C.p_visited_pages();
      }
      for(var i in xarr_pages) {
        var xarr_page=xarr_pages[i];
        var page_id=xarr_page['@id'];
        if((nav_mode===2) && (nav_a.indexOf(page_id)===-1)) {
          nav_mode=0;
        }
        if(page_id===current_id) {
          pos='current';
        } else if(pos==='current') {
          pos='after';
        }
        html+='<li class="courselet_progress_bar_page courselet_progress_bar_page_'+pos+(nav_mode?' courselet_progress_bar_page_navigation':'')+'" data-internal_link="'+C.html(xarr_page['@title'])+'" title="'+(tt_mode?C.html(xarr_page['@title']):'')+'" style="--courselet_progress_bar_pagecount:'+cnt+'">'
             +'<span class="courselet_progress_bar_page_inner">&#160;</span>'
             +'</li>';
      }
      html+='</ul>';
      result.html=html;
      return result;
    };

  }; // progress_bar

  var Slider; // @jump slider 
  this.slider=new function() {

    var SLIDER=this;

    this.p_active_slider=null; // Gleiter, der gerade unter der Maus klebt
    this.p_clicked_slider=null; // Gleiter, der geklickt wurde (alternative Bedienung, falls kein Drag and Drop moeglich)
    this.p_options=[];
    this.p_was_initalized=false; // Wurde (vorheriges) Malen mit init abgeschlossen?
    this.p_width=null;
    this.p_height=null;
    this.p_return_sliders=null;

    this.draw=function(xarr_element,xarr_block) {
      var result={};
      if(this.p_was_initalized) {
        this.p_options=[];
        this.p_was_initalized=false;
      }
      if(xarr_element['@type']==='slider_target') {
        result.is_exercise=true;
        var cls='courselet_slider_target';
        cls+=(xarr_element['@readonly']?(' courselet_slider_target_readonly'):'');
        var a=xarr_element[0].split('|');
        var d=xarr_element['@default'];
        var t=(C.p_preview_results?a.join('\n'):'');
        var m=xarr_element['@multi']?((xarr_element['@multi']==='auto')?a.length:xarr_element['@multi']):0;
        var l=m?(xarr_element['@layout']?xarr_element['@layout']:'vertical'):'';
        var c=xarr_element['@centering']?xarr_element['@centering']:'';
        var mad=xarr_element['@manual_order']?xarr_element['@manual_order']:'';
        var t_inner=(t?t:'&nbsp;');
        if(C.p_href(xarr_element,'image')) {
          t_inner='<img src="'+C.p_href(xarr_element,'image')+'">';
        }
        var css='display:inline-block;overflow:hidden;';
        css+=C.p_extract_css(xarr_element);
        if(xarr_element['@color']) {
          if('transparent'===xarr_element['@color']) {
            css+='opacity: 0 !important;';
          }
        }
        result.html='<span class="'+cls+'"'+(d?(' data-default="'+d+'"'):'')+(m?(' data-multi="'+m+'"'):'')+(l?(' data-layout="'+l+'"'):'')+(c?(' data-centering="'+c+'"'):'')+(mad?(' data-manual_order="'+mad+'"'):'')+' style="'+css+'" title="'+t+'">'+t_inner+'</span>';
      } else if(xarr_element['@type']==='slider') {
        var sizing=C.to_string(xarr_block['@sizing'],'page');
        var h=xarr_block['@hidden']?1:0;
        var t_inner=xarr_element[0];
        var css='display:inline-block;';
        var data_css=C.p_extract_css(xarr_element);
        var css_classes='';
        if(xarr_element['@text_align']) {
          css_classes+=' courselet_slider_text_align_'+xarr_element['@text_align'];
        };
        this.p_width=xarr_block['@width'];
        this.p_height=xarr_block['@height'];
/*
        if(xarr_block['@width'] || xarr_block['@height']) {
          css+='box-sizing:border-box;';
          if(xarr_block['@width']) {
            css+='min-width:'+xarr_block['@width']+'px !important;max-width:'+xarr_block['@width']+'px !important;overflow-x:hidden;';
          }
          if(xarr_block['@height']) {
            css+='min-height:'+xarr_block['@height']+'px !important;max-height:'+xarr_block['@height']+'px !important;overflow-y:hidden;';
          }
        }
*/
        if(C.p_href(xarr_element,'image')) {
          t_inner='<img src="'+C.p_href(xarr_element,'image')+'">';
        }
        if(C.p_href(xarr_element,'audio')) {
          t_inner=C.p_draw_media({type:'audio',href:C.p_href(xarr_element,'audio'),controls:xarr_element['@controls']})+'&#160;'+t_inner;
        }
        result.html='<span class="courselet_slider_source'+css_classes+'"'+(h?(' data-hidden="1"'):'')+' data-return="'+xarr_block['@return']+'" data-sizing="'+sizing+'" data-value="'+C.html_double_quotes(xarr_element[0])+'" data-color="'+(xarr_element['@color']?xarr_element['@color']:'')+'" data-style="'+data_css+'" style="'+css+'"><span>'+t_inner+'</span></span>';
        this.p_options.push(xarr_element[0]);
      }
      return result;
    };

    this.get=function(xarr_element) {
      var data=''; // Ein Array wird von PHP in ein Object konvertiert
      $('.courselet_slider[idref=\''+xarr_element['@id']+'\']').each(function() {
        data+=(data?'|':'')+$(this).attr('source_idref');
      });
      return data?data:false;
    };

    this.set=function(xarr_element,data) {
      $('.courselet_slider[idref="'+xarr_element['@id']+'"]').each(function() {
        $(this).attr({'idref':$(this).attr('source_idref')});
      });
      if(data) {
        $.each(String(data).split('|'),function(i,v) {
          var $s=$('.courselet_slider[source_idref=\''+v+'\']');
          $s.attr('idref',xarr_element['@id']);
          $s.parent().append($s); // Reihenfolge
        });
      }
    };

    this.evaluate=function(s,xarr_element) {
      // xarr_element: slider_target
      var id_element=xarr_element['@id'];
      s.target=(String(xarr_element[0]).indexOf('|')>=0)?String(xarr_element[0]).split('|'):String(xarr_element[0]);
      s.options=this.p_options;
      s.correct=false;
      var m=C.to_int($('#'+id_element).attr('data-multi'));
      s.multi=m?true:false;
      var t=C.is_array(s.target)?s.target.slice(0):[s.target]; // .slice(0) == clone
      var $sliders_in=$('.courselet_slider[idref=\''+id_element+'\']');
      s.input=[];
      $sliders_in.each(function() {
        s.input.push($(this).attr('data-value'));
      });
      if((t.length===1)&&(''===t[0])) { // Loesung: leer
        s.correct=(0===$sliders_in.length);
      } else if(s.multi) {
        if(xarr_element['@order']) {
          // Reiter in richtiger Reihenfolge
          if($sliders_in.length==t.length) {
            s.correct=true;
            $sliders_in.each(function(i) { // Reihenfolge wie im Quellcode
              if(!C.is_equal(t,$(this).attr('data-value'),i)) {
                s.correct=false;
              }
            });
          }
        } else if((t.length==m)||(t.length>C.array_unique(t).length)) {
          // Jeder Gleiter einzeln in Loesung aufgezaehlt (10+10+1=21): entweder Anzahl Gleiter vorgegeben oder ein Wert doppelt
          if($sliders_in.length==t.length) {
            $sliders_in.each(function() {
              for(var i=0;i<t.length;i++) {
                if(C.is_equal(t,$(this).attr('data-value'),i)) {
                  t.splice(i,1);
                  break;
                }
              }
            });
            s.correct=(t.length==0);
          }
        } else {
          // Mehr richtige Gleiter als Loesungs-Varianten (alle 4en in Luecke 4 sortieren)
          s.correct=true;
          $('.courselet_slider').each(function() {
            var idref=$(this).attr('idref');
            if(C.is_equal(t,$(this).attr('data-value'))) {
              if(idref!==id_element) { // Muss auf Ziel liegen
                s.correct=false;
              }
            } else if(idref===id_element) { // Darf nicht auf Ziel liegen
              s.correct=false;
            }
          });
        }
      } else {
        s.input=$sliders_in.attr('data-value'); // scalar
        C.update_correct(s);
        // s.correct=C.is_equal(t,s.input);
      }
      if(!s.correct) {
        $sliders_in.each(function() {
          var $t=$(this);
          if($t.attr('data-return')==='wrong') {
            if(!SLIDER.p_return_sliders) {
              SLIDER.p_return_sliders=[];
              window.setTimeout(function() {
                for(var i in SLIDER.p_return_sliders) {
                  var $t=SLIDER.p_return_sliders[i];
                  $t.attr('idref',$t.attr('source_idref'));
                }
                SLIDER.p_return_sliders=null;
                SLIDER.hidden_sources();
                SLIDER.reposition(true);
              },250); // Zeitverzoegert fuer Animation
            }
            SLIDER.p_return_sliders.push($t);
            $t.attr('idref',''); // Falsche Position nicht in suspend_data ablegen.
          }
        });
      }
      // C.d(s);
      return s;
    };

    this.draw_init=function() {
      this.p_was_initalized=true;
      $('.courselet_slider').remove();
      $('.courselet_slider_source').each(function(i) {
        var $t=$(this);
        var css='position:absolute;left:'+(50+i*20)+'px;top:'+(50+i*20)+'px;z-Index:'+(60000+1)+';';
        if($t.attr('data-style')) {
          css+=$t.attr('data-style');
        }
        var c=$t.attr('class').replace('courselet_slider_source','courselet_slider');
        var $s=$('<div class="'+c+'" idref="'+$t.attr('id')+'"'+($t.attr('data-hidden')?' data-hidden="1"':'')+' data-return="'+$t.attr('data-return')+'" data-sizing="'+$t.attr('data-sizing')+'" source_idref="'+$t.attr('id')+'" style="'+css+'"></div>')
          .attr({'data-value':$t.attr('data-value')}).html($t.html()).appendTo('body');
        if($t.attr('data-color')) {
          $s.addClass('courselet_slider_'+$t.attr('data-color'));
        }
      });
      $('.courselet_slider_source_inner').removeClass('courselet_slider_source_inner');
      $('.courselet_slider_source > span').addClass('courselet_slider_source_inner');
      $('.courselet_slider > span').addClass('courselet_slider_inner');
      $('.courselet_slider_target[data-default]').each(function() {
        var $t=$(this);
        var ro=$t.hasClass('courselet_slider_target_readonly');
        var a=$t.attr('data-default').split('|');
        for(var i in a) {
          var v=a[i];
          $('.courselet_slider').each(function() {
            var $s=$(this);
            if(($s.attr('data-value')==v) && ($s.attr('idref')==$s.attr('source_idref'))) {
              $s.attr({idref:$t.attr('id')});
              if(ro) {
                $s.addClass('courselet_slider_readonly');
              }
              $s.parent().append($s); // Reihenfolge
              return false;
            }
          });
          // C.d(a[i]);
        }
      });
      this.hidden_sources();
      $('.courselet_sliders[data-stacked]').each(function() {
        var $t=$(this);
        var same=($t.attr('data-stacked')==='same');
        $t.css({position:'relative'});
        var $ch=$t.children();
        var v=false;
        var h=false;
        $ch.css({position:'relative'});
        if(!same) {
          $ch.children().css({visibility:'hidden'});
        }
        var $stacker=null;
        $ch.each(function(i) {
          var $s=$(this);
          var is_source=$s.hasClass('courselet_slider_source');
          if(is_source) {
            var tv=$(this).attr('data-value');
            h=(i && (!same || (tv===v)));
            v=tv;
          }
          if(!h) {
            if(is_source) {
              $stacker=$('<span class="courselet_sliders_stacker" style="position:relative;display:inline-block"></span>').appendTo($t);
            }
          } else {
            $(this).css({position:'absolute','left':0,'top':0}).css({visibility:'hidden'});
          }
          if(h || is_source) {
            $(this).appendTo($stacker);
          } else {
            $(this).after($stacker); // courselet_spacer
          }
        });
      });
      this.reposition(false,true);
    };

    this.hidden_sources=function() {
      var $sliders=$('.courselet_slider[data-hidden]');
      if($sliders.length) {
        C.d('hidden');
        var $targets=$('.courselet_slider_target');
        $sliders.each(function(i) {
          var $s=$(this);
          if($s.attr('idref')==$s.attr('source_idref')) {
            $targets.each(function() {
              var $t=$(this);
              var id=$t.attr('id');
              var c=$('.courselet_slider[idref="'+id+'"]').length;
              var m=$t.attr('data-multi');
              if(c<(m?m:1)) {
                $s.attr('idref',id);
                return false;
              }
            });
          }
        });
      }
    };

    this.reposition=function(animate,resize) {
      if(resize) {
        var s='.courselet_slider_source';
        var c=s+',.courselet_slider_target,.courselet_slider';
        $(c).height('auto').width('auto');
        if(this.p_width) {
          $(s).outerWidth(this.p_width);
        }
        if(this.p_height) {
          $(s).outerHeight(this.p_height);
        }
        C.equalize_size(s,c,this.p_width?0:2,0);
        var $c_indi=$(c).filter('[data-sizing=element],[data-sizing=page_width],[data-sizing=page_height],[data-fixed-width]');
        if(!this.p_width) {
          $c_indi.not('[data-sizing=page_width]').width('auto').each(function() {
            $(this).width(Math.ceil($(this).width()+1.01)); // ~ +2px
          });
        }
        if(!this.p_height) {
          $c_indi.not('[data-sizing=page_height]').height('auto').each(function() {
            $(this).height(Math.ceil($(this).height()));
          });
        }
        var $multi=$('.courselet_slider_target[data-multi]').not('[data-fixed-width]');
        if($multi.length) {
          var max=1;
          $multi.each(function() {
            max=Math.max(max,$(this).attr('data-multi'));
          });
          var $sliders=$('.courselet_slider');
          $multi.each(function() {
            var $t=$(this);
            var h=0,w=0;
            if($c_indi.length) {
              var a_sol=String(C.p_xids[$t.attr('id')][0]).split('|');
              for(var i in a_sol) {
                var $r=$t;
                $sliders.each(function() {
                  if(C.is_equal($(this).attr('data-value'),a_sol[i])) {
                    $r=$(this);
                    return false;
                  }
                });
                h+=$r.outerHeight();
                w+=$r.outerWidth();
              }
            } else {
              h=$t.outerHeight()*max;
              w=$t.outerWidth()*max;
            }
            if($t.attr('data-layout')==='horizontal') {
              $t.outerWidth(w+max+3);
              $t.css({maxWidth:'100%'});
              $t.height($t.height()+4);
            } else {
              $t.outerHeight(h+max+3);
              $t.width($t.width()+4);
            }
          });
        }
      }
      var idrefs={};
      var $s=$('.courselet_slider[idref]');
      $s.each(function(i) {
        idrefs[$(this).attr('idref')]=1;
      });
      for(var idref in idrefs) {
        var $pad=idref?$('#'+idref):false;
        if($pad && $pad.length) {
          var cent=($pad.attr('data-centering')!=='disabled');
          var c=C.coords($pad);
          var $sf=$s.filter('[idref="'+idref+'"]');
          var sf_pos=[];
          var dx=0,dy=0;
          if($pad.attr('data-layout')==='rows') {
            var gap=1;
            var mw=0;
            var x,y,h;
            do {
              mw=0;
              x=cent?0:2;
              y=cent?0:2;
              h=0;
              $sf.each(function(i) {
                var tw=$(this).outerWidth();
                var th=$(this).outerHeight();
                h=Math.max(h,th);
                if(x && ((x+tw)>c.w)) {
                  x=cent?0:2;
                  y+=gap+th;
                  h=th;
                }
                sf_pos[i]=[x,y];
                x+=gap+tw;
                mw=Math.max(mw,x);
              });
              gap--;
            } while((y>10) && (y+h>c.h));
            if(cent) {
              dx=Math.round((c.w-mw)/2);
              dy=Math.round((c.h-y-h)/2);
            }
          } else {
            var lay=($pad.attr('data-layout')==='horizontal');
            var avail=lay?c.w:c.h;
            var t_tot=0;

            $sf.each(function(i) {
              t_tot+=lay?$(this).outerWidth():$(this).outerHeight();
            });
            var t_pos=0;
            var gap=1;
            if(t_tot+($sf.length-1)*gap>=avail) {
              gap=(avail-t_tot)/($sf.length-1);
            } else if(cent) {
              t_pos=(avail-t_tot-gap*($sf.length-1))/2;
            } else {
              t_pos=2;
            }
            $sf.each(function(i) {
              var $this=$(this);
              var t_x,t_y;
              if(lay) {
                t_x=t_pos;
                t_y=(c.h-$this.outerHeight())/2;
              } else {
                t_x=(c.w-$this.outerWidth())/2;
                t_y=t_pos;
              }
              sf_pos[i]=[t_x,t_y];
              t_pos+=(lay?$this.outerWidth():$this.outerHeight())+gap;
            });
          }
          $sf.each(function(i) {
            if(sf_pos[i]) { // immer true
              if(animate) {
                $(this).stop(true).animate({left:(c.x1+dx+sf_pos[i][0])+'px',top:(c.y1+dy+sf_pos[i][1])+'px'},'fast','swing');
              } else {
                $(this).stop(true).offset({left:(c.x1+dx+sf_pos[i][0]),top:(c.y1+dy+sf_pos[i][1])});
              }
            }
          });
        } else {
          // alert('"#'+idref+'" not found.');
        }
      }
    };

    this.activate=function(obj,x,y) {
      var offset=$(obj).offset();
      var $obj=$(obj);
      this.p_active_slider={
        obj   : obj,
        x     : x,
        y     : y,
        dx    : offset.left-x,
        dy    : offset.top-y,
//        next  : $obj.next(),
        t     : 0
      };
      this.p_clicked_slider=this.p_active_slider;
  /*
      if(!$obj.attr('source_idref')) {
        $obj.attr('source_idref',$obj.attr('idref'));
      }
  */
      $('.courselet_slider').css({zIndex:(60000+1)});
      $obj.css({zIndex:(60000+2)}).addClass('courselet_slider_active');
      $('body').addClass('courselet_unselectable');
    };

    this.move_active=function(x,y,evt,as) {
      if(!as) {
        as=this.p_active_slider;
      }
      if(as) {
        var $obj=$(as.obj);
        $obj.offset({left:x+as.dx,top:y+as.dy});
        if(evt) {
          // verhindert scrollen auf Mobilgeraeten
          evt.preventDefault();
        }
      }
    };

    this.drop_active=function(x,y,is_clicked) {
      $('.courselet_slider_active').removeClass('courselet_slider_active');
      var as=this.p_active_slider;
      this.p_active_slider=null;
      if(is_clicked) {
        as=this.p_clicked_slider;
        this.p_clicked_slider=null;
        this.move_active(x,y,null,as);
      }
      if(as) {
        var $obj=$(as['obj']);
        var c=C.coords($obj);
        var new_idref=null;
        var d=999;
        // C.d('Dropping',[x,y,c]);

        $('.courselet_slider_target').not('.courselet_slider_target_readonly').each(function(i) {
          var tc=C.coords($(this));
          if((c.x2>=tc.x1)&&(c.x1<=tc.x2)&&(c.y2>=tc.y1)&&(c.y1<=tc.y2)) {
            var td=Math.sqrt(Math.pow(tc.xc-c.xc,2)+Math.pow(tc.yc-c.yc,2));
            if(td<d) {
              new_idref=$(this).attr('id');
              d=td;
            }
          }
        });

        if(new_idref) {
          $obj.attr('idref',new_idref);
          var l=$('#'+new_idref).attr('data-multi');
          var mad=$('#'+new_idref).attr('data-manual_order');
          l=l?l:1;
          var $s=$('.courselet_slider[idref=\''+new_idref+'\']');
          if($s.length>l) { // Zu viele Gleiter im Target
            var $f=$s.not($obj).first();
            $f.attr('idref',$f.attr('source_idref'));
            this.hidden_sources();
          }
          if((l>1) && ($s.length>1)) {
            var d=9999;
            var $b=0;
            var $so=$s.not($obj);
            var hor=($('#'+new_idref).attr('data-layout')==='horizontal');
            if(!mad) { // manual order disabled.
              $so.each(function() {
                var tc=C.coords($(this));
                var tp=hor?(tc.xc-c.xc):(tc.yc-c.yc);
                if((tp>0)&&(tp<d)) {
                  $b=$(this);
                  d=tp;
                }
              });
            }
  /* Code fuer mehrzeilige Drop-Zones
            $so.each(function(i) {
              var tc=C.coords($(this));
              if((c.x2>tc.x1)&&(c.x1<tc.x2)&&(c.y2>tc.y1)&&(c.y1<tc.y2)) {
                if((c.xc<tc.xc) || (c.yc<tc.yc)) { // Mitte weiter links und hoeher
                  var td=Math.sqrt(Math.pow(tc.xc-c.xc,2)+Math.pow(tc.yc-c.yc,2));
                  if(td<d) {
                    $b=$(this);
                    d=td;
                  }
                  C.d($(this).text()+' '+td+' '+i);
                } else if(!$b && (i==$so.length-1)) {
                  $b={length:0}; // Ganz unten
                }
              }
            });
            if(!$b) {
              $b=as.next.filter($s); // Alte Position, falls vorher im selben Target
            }
  */
            if($b && $b.length) {
              $b.before($obj);
            } else {
              if(!$obj.parent().children().last().is($obj)) {
                $obj.parent().append($obj);
                C.d('Slider appended.');
              }
            }
          }
        } else {
          $obj.attr('idref',$obj.attr('source_idref'));
          this.hidden_sources();
        }
        this.reposition(true);
      }
      $('body').removeClass('courselet_unselectable');
    };

  }; // slider

  var Syllabification; // @jump syllabification
  this.syllabification=new function() {

    this.p_layer_html=function(v,o) {
      if(!o) {
        // o=v.replace(/[|]/g,'').split('').join('|');
        o=C.string_to_array(v.replace(/[|]/g,'')).join('|');
      }
      var h='';
      var p=0;
      var t='';
      for(var i=0;i<o.length;i++) { // JavaScript behandelt UTF-8-Sequenzen >2^16 wie zwei Zeichen!
        var c=o.charAt(i);
        if(c==='|') {
          if(t) {
            h+='<span>'+C.html(t)+'</span>';
            t='';
          }
          var b=(v.charAt(p)===c);
          h+='<a href="#" class="courselet_syllabification_limiter'+(b?' courselet_syllabification_limiter_active':'')+'">|</a>';
          if(b) {
            p++;
          }
        } else {
          t+=c;
          p++;
        }
      }
      if(t) {
        h+='<span>'+C.html(t)+'</span>';
        t='';
      }
      return h;
    };

    this.p_reposition_layer=function(animate) {
      var $l=$('#courselet_syllabification');
      if($l.length) {
        var $ls=$('#courselet_syllabification_inner');
        $l.css({fontSize:''});
        var fs=50;
        var ws=$(window).width()-$l.outerWidth()+$l.width();
        while((fs>6) && ($ls.outerWidth()>ws*0.9)) {
          fs--;
          $l.css({fontSize:fs+'px'});
        }
        var w=Math.ceil($ls.outerWidth());
        var h=$ls.outerHeight();
        var l=(ws-w)/2;
        var t=($(window).height()-$l.outerHeight()+$l.height()-h)/2;
        var css={left:l+'px',top:t+'px',width:w+'px',height:h+'px'};
        if(animate) {
          $l.stop().animate(css,300);
          $ls.stop().animate({opacity:1},400);
        } else {
          $l.stop().css(css);
          $ls.stop().css({opacity:1});
        }
      }
    };

    this.draw=function(xarr_element) {
      var result={is_exercise:true};
      xarr_element[0]=String(xarr_element[0]).replace(/[∑]/g,'|');
      xarr_element['@options']=xarr_element['@options']?String(xarr_element['@options']).replace(/[∑]/g,'|'):'';
      var s=C.p_preview_results?String(xarr_element[0]):String(xarr_element[0]).replace(/[|]/g,'');
      var css=C.p_extract_css(xarr_element);
      result.html='<span class="courselet_syllabification'+(xarr_element['@color']?(' courselet_text_marked_'+xarr_element['@color']):'')+'" style="'+css+'">'+C.html(s)+'</span>';
      return result;
    };

    this.get=function(xarr_element) {
      return $('#'+xarr_element['@id']).text();
    };

    this.set=function(xarr_element,data) {
      if(String(data).replace(/[|]/g,'')===xarr_element[0].replace(/[|]/g,'')) {
        $('#'+xarr_element['@id']).text(data);
      }
    };

    this.evaluate=function(s,xarr_element) {
      s.input=this.get(xarr_element);
      s.target=xarr_element[0];
      s.correct=(this.get(xarr_element)===xarr_element[0]);
    };

    this.click=function(evt) {
      var $e=$(evt.currentTarget);
      var c=C.coords($e);
      C.black_layer('#courselet_syllabification',0.2,null,function() {
        var $l=$('#courselet_syllabification');
        if($l.length) {
          var c=C.coords($e);
          $l.stop().animate({left:c.x1+'px',top:c.y1+'px',width:c.w+'px',height:c.h+'px',padding:0},'fast',function(){
            $l.remove();
          });
        }
      });
      var id=$e.attr('id');
      var xarr_element=C.p_xids[id];
      var v=String($e.text());
      var o=xarr_element['@options'];
      var h=this.p_layer_html(v,o);
      var $l=$('<div id="courselet_syllabification" style="overflow:hidden;white-space:nowrap;position:fixed;z-index:'+(60000+9)+'"><span id="courselet_syllabification_inner" style="opacity:0"></span></div>').appendTo('body');
      $l.offset({left:c.x1,top:c.y1}).outerWidth(c.w).outerHeight(c.h);
      var $ls=$('#courselet_syllabification_inner');
      $ls.html(h);
      $ls.find('a').on('click',function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        var $t=$(this);
        $t.toggleClass('courselet_syllabification_limiter_active');
        var t='';
        $ls.children().each(function() {
          var c=$(this).text();
          if((c!=='|') || $(this).hasClass('courselet_syllabification_limiter_active')) {
            t+=$(this).text();
          }
        });
        $e.text(t);
      });
      this.p_reposition_layer(true);
    };
  };

  var Highlighter // @jump highlighter
  this.highlighter=new function() {

    this.p_color;
    this.p_bc='courselet_highlighter';
    this.p_bct=this.p_bc+'_target';

    this.draw=function(xarr_element) {
      var result={};
      this.p_color=null;
      if(xarr_element['@type']==='highlighter') {
        result.html='<span class="'+this.p_bc+' '+this.p_bc+'_'+xarr_element['@color']+'">'+C.html(xarr_element[0])+'</span>';
      } else if(xarr_element['@type']==='highlighter_target') {
        result.is_exercise=true;
        var add=(C.p_preview_results && xarr_element['@color'])?(' '+this.p_bct+'_marked_'+xarr_element['@color']):'';
        result.html='<span class="'+this.p_bct+add+'">'+C.html(xarr_element[0])+'</span>';
      }
      return result;
    };

    this.get=function(xarr_element) {
      return this.p_get_color($('#'+xarr_element['@id']));
    };

    this.set=function(xarr_element,data) {
      if(data.match(/^[a-z]+$/)) {
        this.p_set_color($('#'+xarr_element['@id']),data);
      }
    };

    this.evaluate=function(s,xarr_element) {
      s.correct=((s.target=this.get(xarr_element))===(s.input=C.to_string(xarr_element['@color'])));
    };

    this.p_get_color=function($e) {
      var s=$e.attr('class').match(new RegExp(this.p_bct+'_marked_[a-z_]*'));
      return s?s[0].replace(/^.*_/,''):'';
    };

    this.p_set_color=function($e,color) {
      var c=this.p_get_color($e);
      if(c) {
        $e.removeClass(this.p_bct+'_marked_'+c);
      }
      if(color) {
        $e.addClass(this.p_bct+'_marked_'+color);
      }
    };

    this.click=function(evt) {
      var bc=this.p_bc;
      var bct=this.p_bct;
      var $e=$(evt.currentTarget);
      if($e.hasClass(bc)) {
        $('.'+bc).removeClass(bc+'_active');
        var c=C.p_xids[$e.attr('id')]['@color'];
        if(c && (this.p_color!=c)) {
          $e.addClass(bc+'_active');
          $('.'+bct).addClass(bct+'_clickable');
          this.p_color=c;
        } else {
          $('.'+bct).removeClass(bct+'_clickable');
          this.p_color=null;
        }
      } else if($e.hasClass(bct) && this.p_color) {
        var color=this.p_get_color($e);
        this.p_set_color($e,(color!==this.p_color)?this.p_color:null);
      }
    };

  };

  var AudioRecorder; // @jump audio_recorder
  this.audio_recorder=new function() {

    var REC=this;
    var cs=['audio_recorder_record','audio_recorder_stop','audio_recorder_play','audio_recorder_pause'];

    this.p_storage={};

    var merge_Float32Array=function(b) {
      var s=0;
      for(var i=0;i<b.length;i++) {
        s+=b[i].length;
      }
      var r=new Float32Array(s);
      var p=0;
      for(var i=0;i<b.length;i++) {
        r.set(b[i],p);
        p+=b[i].length;
      }
      return r;
    };

    this.draw=function(xarr_element) {
      var id=xarr_element['@id'];
      if(!this.p_storage[id]) {
        this.p_storage[id]={};
      }
      var result={};
      result.html='<span class="audio_recorder"><span class="'+cs[0]+'"><img class="courselet_icon" src="'+C.src('record_record')+'"></span>'
                 +'<span class="'+cs[1]+'" style="display:none"><img class="courselet_icon" src="'+C.src('record_stop')+'"></span>'
                 +'<span class="'+cs[2]+'" style="display:none"><img class="courselet_icon" src="'+C.src('record_play')+'"></span>'
                 +'<span class="'+cs[3]+'" style="display:none"><img class="courselet_icon" src="'+C.src('record_pause')+'"></span></span>';
      result.feature='is_audio_recorder';
      return result;
    };

    this.p_b=function($recorder,a) {
      for(var i in cs) {
        var $b=$recorder.find('.'+cs[i]);
        if(a[i]) {
          $b.show();
        } else {
          $b.hide();
        }
      }
    };

    this.set_buttons=function(a) {
      if(a.id && (!a.page_id || (a.page_id==C.page_id))) {
        var $recorder=$('#'+a.id);
        if($recorder.length) {
          this.p_b($recorder,[a.record,a.stop,a.play,a.pause]);
        }
      }
    };

    this.click=function(evt) {
      var $recorder=$(evt.currentTarget);
      var id=evt.currentTarget.id;
      var $button=(evt.target.tagName==='SPAN')?$(evt.target):$(evt.target).parent();
      var button=$button.attr('class');
      var store=REC.p_storage[id];
      C.p_external_send('event',{event:C.underscore_to_camelcase(button),page_id:C.page_id,id:id});
      if(C.p_params['disable_audio_recorder']) {
      } else if(button===cs[0]) { // Aufnehmen

        if(!navigator.mediaDevices) {
          navigator.mediaDevices={};
        }
        if(!navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia=function(constraints) {
            var getUserMedia=(navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
            if(!getUserMedia) {
              return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }
            return new Promise(function(resolve,reject) {
              getUserMedia.call(navigator,constraints,resolve,reject);
            });
          };
        }

        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          // Fuer iOS muss der AudioContext "onclick" erstellt werden, nicht erst in getUserMedia.
          var AudioContext=window.AudioContext || window.webkitAudioContext;
          store.context=new AudioContext();
          store.processor=store.context.createScriptProcessor(4096,1,1); // bufferSize, numberOfInputChannels, numberOfOutputChannels
          store.cacheMimeType=function() {
            // 2022-04-26: iOS braucht mimeType zum Abspielen, in MediaRecorder ist er aber erst ca. eine Sekunde nach Start der Aufnahme bis zum Stopp verfuegbar.
            if(store.recorder && !store.mimeType) {
              store.mimeType=store.recorder.mimeType;
              if(store.mimeType) {
                C.d(store.mimeType);
              } else {
                window.setTimeout(store.cacheMimeType,100);
              }
            }
          };
          navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream) { // onSuccess
            try {
              store.recorder=new MediaRecorder(stream); // https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
            } catch(e) {
              store.recorder=null;
            }
            store.chunks=[];
            if(store.recorder) { // MediaRecorder-Objekt existiert
              C.d('Using MediaRecorder');
              store.recorder.ondataavailable=function(e) {
                store.chunks.push(e.data);
              };
              store.recorder.onstop=function(e) {
                var blob;
                if(store.mimeType) {
                  blob=new Blob(store.chunks,{type:store.mimeType});
                } else {
                  blob=new Blob(store.chunks);
                }
                store.chunks=[];
                var $audio=$('<audio></audio>').attr('src',window.URL.createObjectURL(blob));
                $audio.on('play pause ended',function() {
                  if($audio.get(0).paused || $audio.get(0).ended) {
                    REC.p_b($recorder,[1,0,1,0]);
                  } else {
                    REC.p_b($recorder,[1,0,0,1]);
                  }
                });
                // $audio.attr('controls','true');
                $recorder.append($audio);
                // $('<a download>download</a>').attr('href',window.URL.createObjectURL(blob)).appendTo($recorder);
                store.audio=$audio.get(0);
                REC.p_b($recorder,[1,0,1,0]);
              };
              $recorder.children('audio').remove();
              store.recorder.start();
              store.cacheMimeType();
            } else { // Fallback fuer iOS/Edge
              C.d('Using AudioContext (Fallback)');
              store.source=store.context.createMediaStreamSource(stream);
              store.processor.connect(store.context.destination);
              store.source.connect(store.processor);
              store.processor.onaudioprocess=function(evt) {
                var b=evt.inputBuffer.getChannelData(0); // Puffer lesen
                store.chunks.push(new Float32Array(b)); // Clone erstellen
              };
            }
            REC.p_b($recorder,[0,1]);
          },function() { // onError
            alert(C.p_lg('usermedia_denied'));
          });
        } else {
          alert(C.p_lg('usermedia_error'));
        }
      } else if(button===cs[1]) { // Aufnahme beenden
        if(store.recorder) {
          store.recorder.stop();
          store.recorder=true;
        } else {
          store.source.disconnect(store.processor);
          store.processor.disconnect(store.context.destination);
          REC.p_b($recorder,[1,0,1,0]);
        }
      } else if(button===cs[2]) { // Abspielen
        if(store.recorder) {
          store.audio.play();
        } else {
          var b=merge_Float32Array(store.chunks);
          var audio_buffer=store.context.createBuffer(1,b.length,store.context.sampleRate);
          var data=audio_buffer.getChannelData(0);
          data.set(b);
          store.recording=store.context.createBufferSource();
          store.recording.buffer=audio_buffer;
          store.recording.connect(store.context.destination);
          store.recording.onended=function() {
            REC.p_b($recorder,[1,0,1,0]);
          };
          store.recording.start();
          REC.p_b($recorder,[1,0,0,1]);
        }
      } else if(button===cs[3]) { // Abspielen beenden
        if(store.recorder) {
          store.audio.pause();
        } else {
          store.recording.stop();
        }
      }

    };

  };

  var SlideShow; // @jump slideshow
  this.slideshow=new function() {

    var S=this;
    var timers=[];
    this.v=0;

    this.draw=function(xarr_block,html_elements) {
      var result={};
      result.html='<p'+C.precede(C.p_extract_css(xarr_block),' style="','"')+' class="courselet_slideshow_outer'+(xarr_block['@align']?(' courselet_alignment_'+xarr_block['@align']):'')+(xarr_block['@navigation']?(' courselet_slideshow_navigation courselet_slideshow_navigation_'+xarr_block['@navigation']):'')+'"><span class="courselet_slideshow" style="display:inline-block;position:relative">'+html_elements+'</span></p>';
      return result;
    };

    this.init=function() {
      S.v++;
      $('.courselet_slideshow_outer').each(function() {
        var $outer=$(this);
        var id=$outer.attr('id');
        var $slides=[];
        var $t=$outer.children();
        if(!$t.children().first().hasClass('courselet_slideshow_transition')) {
          $t.prepend('<span class="courselet_slideshow_transition"></span>');
        }
        $t.children('span.courselet_slideshow_transition').hide().empty().each(function() {
          var $s=$(this);
          $s.append($s.nextUntil('span.courselet_slideshow_transition'));
          $s.children().first().filter('.courselet_spacer').remove();
          $s.children().last().filter('.courselet_spacer').remove();
          $slides.push($s);
        });
        $t.children().first().show();
        if($outer.hasClass('courselet_slideshow_navigation')) {
          var $nav=$('<span class="courselet_slideshow_navigation_line" style="display:none;z-index:10001"></span>');
          $outer.append($nav);
          for(var i=0;i<$slides.length;i++) {
            if($slides[i].children().length) {
              $('<span data-i="'+i+'" class="courselet_slideshow_navigation_point"></span>').appendTo($nav).on('click',function(evt) {
                evt.preventDefault();
                evt.stopImmediatePropagation();                
                S.update(id,$slides,C.to_int($(this).attr('data-i')),S.v,false,true);
              });
            }
          }
        }
        S.update(id,$slides,0,S.v,true);
      });
    };

    this.update=function(id,$slides,i,v,init,manual) {
      if(S.v!=v) { // Andere Seite geladen
        return;
      }
      if(manual && timers.length) {
        for(var t in timers) {
          window.clearTimeout(timers[t]);
        }
        timers=[];
      }
      C.d({f:0,v:v,i:i,s:$slides.length});
      var $outer=$slides[0].parent().parent();
      var $s=$slides[i];
      if(i && (!$s || !$s.children().length) && (i>=$slides.length-1)) {
        i=0;
        $s=$slides[0];
      }
      var sid=$s.attr('id');
      var xarr={};
      if(sid) { // Automatisches erstes span hat keine ID
        xarr=C.p_xids[sid];
      }
      var animate=init?0:1;
      var f_complete=function() {
        if(S.v!=v) {
          return;
        }
        var $ds=$('#'+id);
        var sz=[$ds.width(),$ds.height()];
        $ds.children('.courselet_slideshow').children().not($s).hide();
        $s.css({position:''}).show();
        if((sz[0]!=$ds.width()) || (sz[1]!=$ds.height())) {
          C.p_reposition();
        }
        if(i<$slides.length-1) {
          var d=(manual?0:parseInt(C.p_xids[$slides[i+1].attr('id')]['@delay']));
          if(d) {
            timers.push(window.setTimeout(function() {
              S.update(id,$slides,i+1,v);
            },1000*d));
          } else {
            $s.one('click',function() {
              S.update(id,$slides,i+1,v,false,manual);
            });
          }
        }
      };
      $s.css({position:'absolute',left:0,top:0,zIndex:10000});
      switch(xarr['@effect']) {
        case 'crossfade':
          $s.finish().fadeIn(animate?500:0,f_complete);
          break;
        case 'slidedown':
          $s.finish().slideDown(animate?500:0,f_complete);
          break;
        default:
          $s.finish().show(0,f_complete);
      }
      $outer.find('.courselet_slideshow_navigation_point').removeClass('courselet_slideshow_navigation_point_active').filter('[data-i='+i+']').addClass('courselet_slideshow_navigation_point_active');
      $outer.find('.courselet_slideshow_navigation_line').show();
    };

  };

  var Conversation; // @jump conversation
  this.conversation=new function() {

    var mode=0;
    var CONV=this;
    var messages=[];

    this.draw=function(xarr_block,html_elements) {
      var result={};
      result.html='<div class="courselet_conversation"></div>';
      return result;
    };

    this.get_new_arr=function(id,text) {
      return {
        idref:  id,
        date:   parseInt(new Date().getTime()/1000),
        author: C.p_params['corrector_user_name']?C.p_params['corrector_user_name']:C.p_params['user_name'],
        text:   text?text.trim():'',
        mode:   mode
      };
    };

    this.$p=function(r,no) {
      var $p=$('<p class="courselet_conversation_entry"><span class="courselet_conversation_meta"><span class="courselet_conversation_author"></span><span class="courselet_conversation_date"></span></span><span class="courselet_conversation_text"></span></p>');
      $p.attr({'data-no':no});
      $p.find('.courselet_conversation_author').text(r.author);
      $p.find('.courselet_conversation_date').text(C.date(C.p_lg('date')+' '+C.p_lg('time'),r.date));
      $p.find('.courselet_conversation_text').text(r.text);
      return $p;
    };

    this.event_edit=function(id,no) {
      CONV.update(true);
      var $div=$('#'+id);
      $div.find('input').parent().remove();
      var a,$p;
      if(no>=0) {
        a=messages[no];
        $p=$('#'+id).find('[data-no="'+no+'"]');
      } else {
        a=this.get_new_arr(id,'');
        $p=this.$p(a,no);
      }
      $p.attr({'id':'courselet_conversation_edit'});
      var $s=$p.find('.courselet_conversation_text');
      var $t=$('<textarea></textarea>').val($s.text()).appendTo($s.empty());
      var $b=$('<span class="courselet_conversation_buttons"></span>').appendTo($p);
      var $b0=$('<input type="submit">').val(C.p_lg('conv_ok')).appendTo($p).on('click',function(evt) {
        evt.preventDefault();
        var r=CONV.get_new_arr(id,$t.val());
        var save=true;
        if(r.text) {
          if(no>=0) {
            messages[no]=r;
          } else {
            messages.push(r);
            no=messages.length-1;
          }
        } else if(no>=0) {
          messages.splice(no,1);
        } else {
          save=false;
        }
        if(save) {
          C.p_set_suspend_data(false,'conversation',messages);
          C.p_set_unread();
          C.p_save_suspend_data(50,3);
          $('#courselet_button_correction_save').click();
          $(this).remove();
        }
        CONV.update();
      }).appendTo($b);
      $('<span>&#160; </span>').appendTo($b);
      $('<input type="submit">').val(C.p_lg('conv_cancel')).appendTo($p).on('click',function(evt) {
        evt.preventDefault();
        $t.val('');
        $b0.click();
      }).appendTo($b);
      $p.hide().appendTo($div).show('fast');
      $t.focus();
    };

    this.update=function(ro) {
      $('div.courselet_conversation').each(function(i) {
        var id=$(this).attr('id');
        var $div=$(this);
        var xarr_block=C.p_xids[id];
        var c=0;
        var l_mode=0;
        $div.empty();
        for(var i in messages) {
          var r=messages[i];
          if(r.idref===id) {
            CONV.$p(r,i).appendTo($div);
            l_mode=r.mode;
            c++;
          }
        }

        if(!ro) {
          if(l_mode==mode) {
            $div.children().last().one('click',function() {
              CONV.event_edit($(this).parent().attr('id'),$(this).attr('data-no'));
            });
          } else if((mode==2) || ((mode==1) && c && xarr_block['@reply'])) {
            var $p=$('<p></p>').appendTo($div);
            $('<input type="submit">').val(C.p_lg(c?'conv_reply':'conv_add')).appendTo($p).on('click',function(evt) {
              evt.preventDefault();
              CONV.event_edit($(this).parents().filter('div.courselet_conversation').attr('id'),-1);
            });
          }
        }
      });
    };

    this.init=function(param_mode) {
      mode=param_mode;
      messages=C.p_get_suspend_data(false,'conversation');
      if(!messages) {
        messages=[];
      }
      this.update();
    };

  }; // conversation

  var Corrector; // @jump corrector
  this.corrector=new function() {

    var CORR=this;
    var classes=0;
    var corrections=[];
    var mode=0; // 1=Lesen, 2=Schreiben
    var last_class=0;
    var gap_y=0;
    var space_to_add='  '; // Mindestens zwei Zeichen

    this.draw=function($input,corrections) { // Einzelnes Eingabefeld mit Korrekturen zeichnen
      $input.hide();
      var id=$input.attr('id');
      C.d('CORR DRAW: '+id);
      var chars=C.string_to_array($input.val()+' ');  // Ein Zeichen mehr, um das Ende markieren zu koennen.

      var corrs=[];
      for(var i in corrections) {
        var r=corrections[i];
        if(r.idref===id) {
          r=C.clone_object(r);
          r.i=i;
          // Kaputte Korrektur einfangen
          r.start=r.start?r.start:0;
          while(r.start>=chars.length) {
            chars.push(space_to_add);
          }
//          r.org_start=r.start;
//          r.org_length=r.length;
          corrs.push(r);
        }
      }

      // Leerzeichen fuer Korrekturen mit Laenge 0 einfuegen
      var add_spaces={};
      for(var i in corrs) {
        var r=corrs[i];
        if(!r.length) {
          add_spaces[r.start]=1;
        }
      }
      // C.d('ADD_SPACES',add_spaces);
      for(var x=chars.length;x>=0;x--) {
        if(add_spaces[x]) {
          // C.d('Adding at',x);
          chars.splice(x,0,space_to_add);
          for(var i in corrs) {
            var r=corrs[i];
            if((r.start>x) || ((r.start==x) && r.length)) {
              r.start++;
            } else if(((r.start+r.length)>x) && r.length) {
              r.length++;
            }
          }
        }
      }
      for(var i in corrs) {
        var r=corrs[i];
        if(!r.length) {
          r.length=1;
        }
      }

      // Ausgabe des Textes (ohne Tabellen)
      $('.corr_outer[idref="'+id+'"]').remove();
      var $outer=$('<span>@</span>').attr({class:$input.attr('class')+' corr_outer',idref:id}).insertAfter($input);
      var lineheight=$outer.height();
      $outer.empty();
      var x=0;
      for(var i in chars) {
        var $t=$('<span></span>').attr({id:'corr_span_'+id+'_'+i}).text(chars[i]).appendTo($outer);
        if(chars[i]!==space_to_add) {
          $t.attr({'data-x':x++}); // Nur Zeichen des Nutzers
        }
      }
      $outer.attr({style:$input.attr('style')}).css({'white-space':'pre-wrap',height:'','min-height':$input.height()+'px'}).show();
      if($input.attr('style').match(/(^|;)[ ]*width:[ ]*[0-9]+px/) && $input.hasClass('courselet_input')) {
        // Bei einzeiligen Eingabefeldern wird die Groesse automatisch bestimmt, daher hier nur als Minimum verwenden
        $outer.css({width:'','min-width':$input.width()+'px'});
      }

      // Laengen der Aenderungen bestimmen
      var t={};
      for(var i in corrs) {
        var r=corrs[i];
        var s=r.start;
        var e=s+r.length-1;
        if(!t[s] || (t[s]<e)) {
          t[s]=e;
        }
      }
      C.d(t);


      // Laengen auf Wortgrenzen ausdehnen
      var nws=function(chars,i) {
        var c=chars[i];
        return ((add_spaces===c) || (c.toLocaleLowerCase()!==c.toLocaleUpperCase()));
      };
      for(var p in t) {
        var i=t[p];
        while((i<chars.length) && nws(chars,i)) {
          t[p]=i;
          i++;
        }
        var i=p;
        while((i>=0) && nws(chars,i)) {
          if(!t[i] || t[i]<t[p]) {
            t[i]=t[p];
          }
          i--;
        }
      }

      // Tabellen einfuegen
      var $table=null;
      var $tr=null;
      var e=0;
      for(var p=0;p<chars.length;p++) {
        if($table) {
          if(p>e) {
            $table=null;
          } else if(t[p]) { // Ueberschneidung
            e=Math.max(e,t[p]);
          }
        }
        if(!$table && (typeof(t[p])==='number')) {
          e=t[p];
          $table=$('<span style="display:inline-block"><table class="corr_table"><tr class="corr_original"></tr></table></span>');
          // $table=$('<table class="corr_table"><tr class="corr_original"></tr></table>');
          $table.insertBefore($('#corr_span_'+id+'_'+p));
          $tr=$table.find('tr');
          // $table.css({'outline':'1px solid #CCF'});
        }
        if($table) {
          // Span mit Buchstaben verschieben
          var $s=$('#corr_span_'+id+'_'+p);
          if($s.text()===' ') {
            $s.text('\xA0');
          }
          $('<td></td>').append($s).appendTo($tr);
        }
      }
      // Korrekturen einfuegen
      var stack=0;
      for(var i in corrs) {
        var r=corrs[i];
        var $span=$('#corr_span_'+id+'_'+r.start);
        if($span.length) {
          if(!r.class || (r.class>=classes)) {
            r.class=0;
          }
          var $table=$span.parents('table').first();
          var $spans=$table.find('.corr_original span');
          var matches=$spans.first().attr('id').match(/[^_]+$/);
          var s=Number(matches[0]);
          var l=$spans.length;
          var p=r.start-s;
          // var cs=(l-r.start+s);
          var cs=r.length;
          var pe=l-p-cs;

          var $tr=$('<tr class="corr_correction" style="border-bottom: 1px solid white"></tr>').prependTo($table);
          if(p) {
            $tr.append('<td colspan="'+p+'"></td>');
          }
          var $td=$('<td data-i="'+i+'" colspan="'+cs+'"></td>').addClass('corr_marked_'+r.class).appendTo($tr);
          $('<span></span>').text(r.correction?r.correction:' ').appendTo($td);
          if(r.description) {
            $td.children().addBack().attr('data-tooltip',C.htmlspecialchars(r.description)).addClass('touchable_tooltip');
          }
          if(pe) {
            $tr.append('<td colspan="'+pe+'"></td>');
          }

          var $tr2=$('<tr class="corr_underline" style="border-top: 1px solid white"></tr>').appendTo($table);
          if(p) {
            $tr2.append('<td colspan="'+p+'"></td>');
          }
          $('<td colspan="'+cs+'" style="height:2px"></td>').addClass('corr_marked_'+r.class).appendTo($tr2);
          if(pe) {
            $tr2.append('<td colspan="'+pe+'"></td>');
          }

          stack=Math.max(stack,$table.find('.corr_correction').length);

          for(var x=r.start;x<r.start+r.length;x++) {
            $('#corr_span_'+id+'_'+x).parent().addClass('corr_marked_'+r.class);
          }
          $('#corr_span_'+id+'_'+(r.start+r.length-1)).parent().addClass('corr_marked_'+r.class+'_last');
          $('#corr_span_'+id+'_'+r.start).parent().addClass('corr_marked_'+r.class+'_first');
        } else {
          alert('Korrektur ausserhalb');
        }

      }
      $outer.css({'line-height':(lineheight+3*stack)+'px','padding-bottom':(3*stack)+'px'});
      $outer.children().css({'line-height':'normal'});
      $outer.find('table').each(function() {
        var $t=$(this);
        var c=$t.find('.corr_correction').length;
        // Hoehe im Vergleich zum Fliesstext
        $t.css({'margin-bottom':(gap_y-3*c)+'px'});
        // Abstand noch oben, um Linien nicht zu verdecken
        $t.css({'margin-top':(3*(stack-c))+'px'});

        if((mode==2) && ($t.width()>300)) {
          $t.css({outline:'3px dotted red'}).attr({'data-tooltip':C.p_lg('corr_mobile_warning')});
        }

      });

      // Korrekturen verlinken
      if(mode==2) {
        $outer.find('.corr_correction td[data-i]').on('click',function() {
          var i=$(this).attr('data-i');
          var r=corrs[i];
          if(r) {
            var a=[];
            for(var p=r.start;p<r.start+r.length;p++) {
              a.push('#corr_span_'+r.idref+'_'+p);
            }
            CORR.select($(a.join(',')),r.i);
          }
        });
        $outer.find('span[id^="corr_span_"]').on('mousedown',function() {
          CORR.select($(this));
        });
      }
      return $outer;
    }; // draw

    this.p_reposition_layer=function() {
      var $l=$('#corr_layer');
      if($l.length) {
        var $s=$('#'+$l.attr('idref'));
        var c=$s.offset();
        $l.css({top:(parseInt(c.top))+30+'px'});
        // $l.offset({top:c.top,left:20+'px'});
        var $c=$('#'+C.p_params['dom_id_courselet']);
        var mh=C.to_int($c.css('min-height'));
        // alert(C.to_int(c.top)+$l.outerHeight());
        mh=Math.max(mh,C.to_int(c.top)+$l.outerHeight());
        $c.css({'min-height':mh+'px'});
      }
    };

    this.p_change=function(idref) {
      $('#corr_layer').remove();
      CORR.draw($('#'+idref),corrections);
      var $p=$('#courselet_bottom_submit');
      if(!$p.find('#courselet_button_correction_save').length) {
        $('<input id="courselet_button_correction_save" type="submit">').val(C.p_lg('corr_save')).appendTo($p).on('click',function() {
          C.p_set_suspend_data(false,'corrections',corrections);
          C.p_set_unread();
          C.p_save_suspend_data(50,3);
          $(this).remove();
          $('#corr_layer').remove();
        });
      }
      C.p_set_suspend_data(false,'corrections',corrections);
      C.p_set_suspend_data(false,'unread',1); // Ohne (direkt) zu speichern
    };

    this.select=function($sel,no) {
      window.setTimeout(function() { // onchange-Event ggf. vorher auswerten
        $('[id^="corr_span_"]').css({borderBottom:'',borderTop:''});
        if($sel && $sel.length && !$('#corr_layer').attr('data-changed')) {
          var placement=0;
          var idref=$sel.first().parents('[idref]').attr('idref');
          var exists=((typeof(no)!=='undefined') && corrections[no]);
          var r;
          var $sel_user=$sel.filter('[data-x]'); // nur Zeichen des Nutzers haben data-x
          if(exists) {
            r=corrections[no];
          } else {
            if($sel_user.length) {
              r={
                idref: idref,
                start: parseInt($sel_user.attr('data-x')),
                length: $sel_user.length,
                class: last_class,
                correction: '',
                description: '',
              };
            }
          }
          if(r) {
            C.d(r.idref+': '+r.start+'['+r.length+']');
            last_class=r.class;
            $sel_user.css({borderBottom:'2px solid black',borderTop:'2px solid black'});
            var $p=$sel.last();
            $('#corr_layer').remove();
            var $d=$('<div></div>').attr({id:'corr_layer',idref:$p.attr('id'),style:'position:absolute'});
            // $d.appendTo('body').appendTo($('#'+C.p_params['dom_id_courselet']))/*.delay(500).fadeIn()*/;
            $d.appendTo('#courselet_form');

            var $p=$('<p style="margin-top:0" class="courselet_unselectable"></p>')
              .append($('<label></label>').text(C.p_lg('corr_selection')))
              .append('<br>')
              .append($('<span></span>').text('"'+$sel_user.text()+'"'))
              .appendTo($d);
            if(!exists) {
              var sel_clp=function($t,v) {
                $('.corr_layer_placement').removeClass('corr_layer_placement_selected');
                if(placement=placement?0:v) {
                  $t.addClass('corr_layer_placement_selected');
                }
              };
//              $('<span class="corr_layer_placement corr_layer_placement_before">\u2BC7</span>') nix Win7, iOS :-(
              $('<span class="corr_layer_placement corr_layer_placement_before">&lt;</span>')
              .on('click',function() {
                sel_clp($(this),1);
              })
              .attr('data-tooltip',C.p_lg('corr_placement_before'))
              .appendTo($p);
//              $('<span class="corr_layer_placement corr_layer_placement_after">\u2BC8</span>')
              $('<span class="corr_layer_placement corr_layer_placement_after">&gt;</span>')
              .on('click',function() {
                sel_clp($(this),2);
              })
              .attr('data-tooltip',C.p_lg('corr_placement_after'))
              .appendTo($p);
            }
            var $corr=$('<textarea id="corr_layer_correction"></textarea>').val(r.correction).appendTo($d).on('change',function() {
              $('#corr_layer').attr({'data-changed':1});
            });

            $('<p></p>')
              .append($('<label></label>').text(C.p_lg('corr_correction')))
              .append('<br>')
              .append($corr)
              .appendTo($d);


            var $expl=$('<textarea id="corr_layer_explanation"></textarea>').val(r.description).appendTo($d).on('change',function() {
              $('#corr_layer').attr({'data-changed':1});
            });

            $('<p></p>')
            .append($('<label></label>').text(C.p_lg('corr_explanation')))
            .append('<br>')
            .append($expl)
            .appendTo($d);

            var $table=$('<table id="corr_layer_classification" class="corr_table courselet_unselectable" style="min-width:50%"><tr class="corr_correction"></tr></table>');
            var $tr=$table.find('tr');
            for(var i=0;i<classes;i++) {
              var lg=C.p_lg('corr_class_'+i);
              $('<td></td>').text(lg?lg:'\xA0').css({width:(100/classes)+'%'}).attr({'class':'corr_marked_'+i,'data-class':i}).appendTo($tr).on('click',function() {
                r.class=last_class=parseInt($(this).attr('data-class'));
                $('#corr_layer .corr_table td').removeClass('corr_marked_selected');
                $('#corr_layer .corr_marked_'+r.class).addClass('corr_marked_selected');
              });
            }

            $('<p></p>')
            .append($('<label></label>').text(C.p_lg('corr_classification')))
            .append($table)
            .appendTo($d);

            var $p=$('<p></p>').appendTo($d);
            $('<input type="submit">').val(C.p_lg('corr_ok')).appendTo($p).on('click',function() {
              r.correction=$corr.val();
              r.description=$expl.val();
              if(exists) {
                corrections[no]=r;
              } else {
                if(placement) {
                  if(placement==2) {
                    r.start+=r.length;
                  }
                  r.length=0;
                }
                corrections.push(r);
              }
              CORR.p_change(idref);
            });
            $('<span>&#160; </span>').appendTo($p);
            $('<input type="submit">').val(C.p_lg('corr_cancel')).appendTo($p).on('click',function() {
              if(exists) {
                corrections.splice(no,1);
                CORR.p_change(idref);
              } else {
                $('#corr_layer').remove();
              }
            });
            CORR.p_reposition_layer();
            $('#corr_layer .corr_marked_'+r.class).click();
            // C.d($p.attr('id'));

          }
        }
      },1);
    };

    this.p_count_classes=function() {
      var $t=$('<table id="corr_temp"><tr class="corr_correction"><td id="corr_temp1">@</td></tr><tr class="corr_underline"><td id="corr_temp2">@</td></tr></table>').appendTo($('#'+C.p_params['dom_id_courselet']));
      var kc=[$('#corr_temp1').css('background-color'),$('#corr_temp2').css('background-color')];
      do {
        $('#corr_temp1,#corr_temp2').attr({'class':'corr_marked_'+classes});
      } while((($('#corr_temp1').css('background-color')!==kc[0]) || ($('#corr_temp2').css('background-color')!==kc[1])) && (++classes<20));
      $t.remove();
    };

    this.p_gap_y=function() {
      if(!gap_y) {
        var $t=$('<textarea id="corr_temp" type="text" class="courselet_textarea" style="width:200px;height:200px">----</textarea>').appendTo($('#'+C.p_params['dom_id_courselet']));
        var $t2=this.draw($t,[{idref:'corr_temp',start:1,length:1,correction:'_',class:1}]);
        gap_y=$t2.find('[data-x=1]').offset().top-$t2.find('[data-x=2]').offset().top;
        $t.remove();
        $t2.remove();
      }
    };

    this.init=function(param_mode) {
      mode=param_mode;
      corrections=C.p_get_suspend_data(false,'corrections');
      if(!corrections) {
        corrections=[];
      }
      this.p_count_classes();
      this.p_gap_y();
      $('input.courselet_input, textarea.courselet_textarea').each(function() {
        CORR.draw($(this),corrections);
      });
      if(mode==2) {
        var sel_interval=null;
        if(sel_interval) {
          window.clearInterval(sel_interval);
        }
        var sel_last='';
        sel_interval=window.setInterval(function() {
          var html=C.get_selected_html();
          // C.d(html);
          html=html.replace(/<span[^>]+><\/span>/g,''); // Diverse Browser haengen leeres folgendes <span> an.
          if(html && (html!==sel_last) && (html.length!==1)) {
            // alert(html);
            var matches=html.match(/<span id="corr_span_[^"]+/g);
            if(matches) {
              var a=[];
              for(var i in matches) {
                var m=matches[i].match(/[^"]+$/);
                a.push('#'+m[0]);
              }
              CORR.select($(a.join(',')));
            } else {
              CORR.select();
            }
          }
          sel_last=html;
        },200);
      }
    };


  }; // corrector

  var ManualScore; // @jump manual_score
  this.manual_score=new function() {

    var MS=this;

    this.draw=function(xarr_element,xarr_block) {
      var result={
        is_exercise: true,
        html: '<span class="courselet_manual_score">?</span>'
      };
      return result;
    };

    this.draw_init=function() {
      $('.courselet_manual_score').parents('[data-courselet_block]').hide();
    };

    this.suspend_data_init=function() {
      $('.courselet_manual_score:not([data-manual_score])').each(function() {
        MS.set(C.p_xids[C.get_ID($(this))],'');
      });
    };

    this.get=function(xarr_element) {
      return C.to_string($('#'+xarr_element['@id']).attr('data-manual_score'));
    };

    this.set=function(xarr_element,val) {
      var eid=xarr_element['@id'];
      var $e=$('#'+eid);
      $e.attr('data-manual_score',val);
      var $b=$e.parents('[data-courselet_block]');
      var cm=(C.p_corrector_mode & 2);
      if(val.length || cm) {
        var xarr_block=C.p_xids[$b.attr('id')];
        // C.d(xarr_element);
        // C.d(xarr_block);
        var so=xarr_element['@options'];
        if(!so) {
          so='';
          for(var i=0;i<=C.to_int(xarr_block['@score_max']);i++) {
            so+='|'+i;
          }
        }
        var arr_options=so.split('|');
        var $sel=$('<select></select>');
        var sgap='';
        for(var i in arr_options) {
          var t=arr_options[i];
          var tvar='';
          var tval='';
          var matches=t.match(/([0-9]+)(.*)/);
          if(matches) {
            tvar=matches[1];
            tval=matches[2]?matches[2]:matches[1];
          }
          var tf=(tvar===val);
          if(tf) {
            sgap=tval;
          }
          $sel.append('<option value="'+tvar+'"'+(tf?' selected':'')+'>'+tval+'</option>');
        }
        if(cm) {
          $e.empty().addClass('select_outer').append($sel);
          var $submit;
          $sel.on('change',function() {
            if(!$submit) {
              $submit=$('<input type="submit" class="courselet_manual_score_button">').val(C.p_lg('manual_score_ok')).insertAfter($e).on('click',function(evt) {
                evt.preventDefault();
                evt.stopImmediatePropagation();
                $submit.remove();
                $submit=null;
                val=$sel.val();
                $e.attr('data-manual_score',val);
                C.p_set_unread();
                C.p_evaluate(true); // Schreibt Suspend-Daten
              });
            }
          });
        } else {
          $e.empty().text(sgap);
        }
        $sel.val(val);
        $b.show();
      } else {
        $b.remove();
      }
    };

    this.evaluate=function(s,xarr_element,xarr_block) {
      var $e=$('#'+xarr_element['@id']);
      var v=$e.attr('data-manual_score');
      s.input=v;
      s.score_max=C.to_int(xarr_block['@score_max']);
      s.score=C.to_int(v);
      s.correct=(s.score==s.score_max);
      s.hide_feedback=true;
    };

  }; // manual_score

  var Pairs; // @jump pairs
  this.pairs=new function() {

    var PAIRS=this;
    this.p_next_draw_is_first=true; // Naechstes "draw" ist erstes

    this.p_reset=function() {
      this.draw_i=0;
      this.callback0_lock=false;
      this.p_cards=[];
      this.p_auto_evaluated=false;
    };

    this.draw=function(xarr_block,html_elements) {
      var result={};
      if(this.p_next_draw_is_first) {
        this.p_next_draw_is_first=false;
        this.p_reset();
      }
      this.p_cards.push({s:Math.floor(this.draw_i/2),b:xarr_block,e:html_elements});
      result.html='<div class="courselet_pairs_card courselet_alignment_left" style="visibility:hidden"></div>';
      this.draw_i++;
      return result;
    };

    this.callback0=function($card) {
      if(!PAIRS.callback0_lock) {
        PAIRS.callback0_lock=true;
        var $c=$('.courselet_pairs_active[data-visible="1"]');
        // C.d('callback0: '+$c.length);
        if($c.length==2) {
          $c.not($card).click();
        }
        PAIRS.callback0_lock=false;
      }
    };

    this.callback1=function($card) {
      var $c=$('.courselet_pairs_active[data-visible="1"]');
      // C.d('callback1: '+$c.length);
      if($c.length==2) {
        if($c.first().attr('data-set')==$c.last().attr('data-set')) {
          $c.off();
          C.turnaround($c,$c,'scale',function() {
            var cnt=$('.courselet_pairs_right').length/2+1;
            $c.removeClass('courselet_pairs_active').addClass('courselet_pairs_inactive courselet_pairs_right courselet_pairs_right_'+cnt).off();
          },function() {
            if(!$('.courselet_pairs_active').length) {
              var $cards=$('.courselet_pairs_card');
              C.turnaround($cards,$cards,'rotate',function() {
                $cards.removeClass('courselet_pairs_inactive').addClass('courselet_pairs_active');
              },function() {
                $cards.click(function() {
                  $cards.off();
                  C.turnaround($cards,$cards,'scale',function() {
                    PAIRS.draw_init();
                  });
                });
                if(!PAIRS.p_auto_evaluated) {
                  PAIRS.p_auto_evaluated=true;
                  C.p_evaluate();
                }
              });
            }
          });
        }
      }
    };

    this.draw_init=function() {
      this.p_next_draw_is_first=true;
      var $cards=$('.courselet_pairs_card');
      if($cards.length) {
        var a,b=false;
        do {
          a=C.shuffle(PAIRS.p_cards);
          for(var i=1;i<a.length;i++) {
            if(b=(a[i-1]['s']==a[i]['s'])) {
              break;
            }
          }
        } while(b && (a.length>4));

        var cs='';
        for(var i=0;i<=$cards.length/2;i++) {
          cs+=' courselet_pairs_right_'+(i+1);
        }
        $cards.each(function(i) {
          var $t=$(this);
          var o=a[i];
          $t.attr({'data-set':o.s,'id':o.b['@id']}).empty().html(o.e);
          C.draw_card($t,'courselet_pairs',0,PAIRS.callback0,PAIRS.callback1);
        }).removeClass('courselet_pairs_inactive courselet_pairs_right'+cs).addClass('courselet_pairs_active');
        C.resize_cards($cards,true);
      }
    };

    this.evaluate=function(s,xarr_element,xarr_block) {
      s.correct=$('#'+xarr_block['@id']).hasClass('courselet_pairs_right');
    };

  }; // pairs

  var VocabularyTrainer; // @jump vocabulary_trainer
  this.vocabulary_trainer=new function() {

    /*
  - Beim ersten Aufruf und Durchlauf werden alle Vokabeln gemischt
  - Eine Vokabel aus den tieferen Stapeln kommt, wenn i durch (4+1)^Stapelnummer teilbar
  - Eine Vokabel kann sich fuehestens nach 25% aller Vokablen wiederholen
  - Beim erneuten Aufruf wird jeder Stapel gemischt
     */

    var VOC=this;
    this.p_html_card='<div class="courselet_vocabulary_trainer_card"></div>';
    this.p_next_draw_is_first=true; // Naechstes "draw" ist erstes
    this.p_amp=4;
    this.p_rep=0.25;
    this.p_buckets_max=8;

    this.p_reset=function() {
      this.p_cards={};
      this.p_cards_length=0;
      this.p_buckets=[[]];
      this.p_stack=[];
      this.p_at_b0=0; // >0 -> Erster Durchlauf
      this.p_loop=0;
      this.p_org_sd={};
      if(C.p_page_uses_suspend_data) {
        var t=C.p_get_suspend_data(false,'vocabulary_trainer');
        if(t) {
          for(var b in t) {
            for(var i in t[b]) {
              this.p_org_sd[t[b][i]]=b;
            }
          }
        }
      }
    };

    this.p_insert_card=function(id,html) {
      var bucket=0;
      if(this.p_org_sd[id]) {
        bucket=Math.min(this.p_buckets_max,Math.abs(parseInt(this.p_org_sd[id])));
        for(var b=1;b<=bucket;b++) {
          if(!this.p_buckets[b]) {
            this.p_buckets[b]=[];
          }
        }
      }
      this.p_buckets[bucket].push(id);
      this.p_cards[id]=html;
      this.p_cards_length++;
      this.p_at_b0=(this.p_buckets[0].length==this.p_cards_length)?this.p_cards_length:0;
    };

    this.draw=function(xarr_block,html_elements) {
      var result={html:''};
      var id=xarr_block['@id'];
      if(this.p_next_draw_is_first) {
        this.p_next_draw_is_first=false;
        this.p_reset();
        result.html=this.p_html_card;
      }
      var vocs=false;
      for(var i in xarr_block['element']) {
        var xarr=xarr_block['element'][i];
        if(xarr['@type']==='vocables') {
          vocs=xarr['0'];
        }
      }
      if(vocs) {
        var a=vocs.split(/(<br[^>]*>|\n)/);
        for(var i in a) {
          var a2=a[i].split('|',2);
          if(a2[0] && a2[1]) {
            this.p_insert_card(id+'.'+i,'<span class="courselet_text">'+a2[0]+'</span><span class="courselet_vocabulary_trainer_break"></span><span class="courselet_text">'+a2[1]+'</span>');
          }
        }
      } else {
        this.p_insert_card(id,html_elements);
      }
      return result;
    };

    this.p_clicked=function(evt,bucket,button) {
      evt.preventDefault();
      evt.stopPropagation();
      var b=0;
      if(button) {
        b=Math.min(this.p_buckets_max,bucket+1);
        if(!VOC.p_buckets[b]) {
          VOC.p_buckets[b]=[];
        }
      }
      VOC.p_buckets[b].push(VOC.p_buckets[bucket].shift());
      VOC.show_next_card();
    };

    this.show_next_card=function() {
      var bucket,id;
      do {
        bucket=0;
        this.p_loop++;
        if(this.p_at_b0--<0) {
          while(((bucket+1)<this.p_buckets.length) && !(this.p_loop % Math.pow(this.p_amp+1,(bucket+1)))) {
            bucket++;
          }
        }
        id=this.p_buckets[bucket][0];
        // alert(JSON.stringify(['show_next_card',this.p_buckets.length,this.p_buckets[0].length,this.s_i,bucket,id]));
      } while(!id || (this.p_stack.indexOf(id)>-1));
      this.p_stack.unshift(id);
      if(this.p_stack.length && (this.p_stack.length>this.p_rep*this.p_cards_length)) {
        this.p_stack.pop();
      }

      var $old_card=$('.courselet_vocabulary_trainer_card');
      var $card=$(this.p_html_card).insertAfter($old_card).first();
      $card.html(this.p_cards[id]);
      C.p_register_events(); // u. a. img.load
      $('<input type="submit" class="courselet_vocabulary_trainer_right">').val(C.p_lg('vocabulary_trainer_right')).on('click',function(evt) {
        VOC.p_clicked(evt,bucket,1);
      }).appendTo($card);
      $('<input type="submit" class="courselet_vocabulary_trainer_wrong">').val(C.p_lg('vocabulary_trainer_wrong')).on('click',function(evt) {
        VOC.p_clicked(evt,bucket,0);
      }).appendTo($card);
      C.draw_card($card,'courselet_vocabulary_trainer',1);
      C.resize_cards($card,2);
      $old_card.css({position:'absolute'});
      $card.css({visibility:'hidden'});
      C.turnaround($old_card,$card,'scale',function() {
        $old_card.remove();
      });
      if(C.p_page_uses_suspend_data && !C.p_is_read_only && !C.p_state.is_locked && !C.p_state.is_timed_out && !C.p_corrector_mode) {
        C.p_set_suspend_data(false,'vocabulary_trainer',this.p_buckets);
        C.p_save_suspend_data(10000,3);
      }
      C.d('voctrainer: '+JSON.stringify({loop:this.p_loop,bucket:bucket,id:id}));
      C.d2({loop:this.p_loop,bucket:bucket,id:id,buckets:this.p_buckets,stack:this.p_stack});
    };

    this.draw_init=function() {
      this.p_next_draw_is_first=true;
      if($('.courselet_vocabulary_trainer_card').length) {
        // if(!this.p_at_b0) {
          for(var b in this.p_buckets) {
            this.p_buckets[b]=C.shuffle(this.p_buckets[b]);
          }
        // }
        if(this.p_cards_length>=2) {
          this.show_next_card();
        }
      }
    };

  }; // vocabulary_trainer

  var CrosswordPuzzle; // @jump crossword_puzzle
  this.crossword_puzzle=new function() {

    var CROSS=this;
    var a2=16,al=7,aw=2.5,ag=2;
    var css=null;
    this.p_places={
      'TH':[0,-1,0,['M',ag,a2+aw,'L',ag+al,a2,'L',ag+0,a2-aw,'L',ag,2*a2]],
      'RH':[1,0,0,['M',0,a2-aw,'L',al,a2,'L',0,a2+aw]],
      'RV':[1,0,1,['M',a2-aw,ag,'L',a2,ag+al,'L',a2+aw,ag,'L',0,ag]],
      'BH':[0,1,0,['M',ag,a2-aw,'L',ag+al,a2,'L',ag+0,a2+aw,'L',ag,0]],
      'BV':[0,1,1,['M',a2-aw,0,'L',a2,al,'L',a2+aw,0]],
      'LV':[-1,0,1,['M',a2+aw,ag,'L',a2,ag+al,'L',a2-aw,ag,'L',2*a2,ag]]
    };
    this.p_data={};
    this.p_evaluated=false;

    this.draw=function(xarr_block,html_elements) {
      return {
        html: '<div class="courselet_crossword_puzzle"><div class="courselet_crossword_puzzle_data" style="position:absolute;top:0;left:0;visibility:hidden">'+html_elements+'</div></div>'
      };
    };

    this.$td=function(id,pos) {
      return $('#'+id+'_td_'+pos[0]+'_'+pos[1]);
    };

    this.$tds=function(d) {
      var a=[];
      for(var i=0;i<d.len;i++) {
        a.push('#'+d.cross_id+'_td_'+(d.start[0]+i*d.step[0])+'_'+(d.start[1]+i*d.step[1]));
      }
      return $(a.join(', '));
    };

    this.p_reposition_layer=function() {
      var $l=$('#courselet_crossword_puzzle_layer');
      if($l.length) {
        $l.css({left:($(window).width()-$l.outerWidth())/2+'px',top:($(window).height()-$l.outerHeight())/2+'px'});
        if(C.p_is_ios) {
          $l.css({top:'',bottom:'32px',zIndex:200000});
        }
        var $d=$l.children('#courselet_crossword_puzzle_input');
        var $is=$d.children('.courselet_crossword_puzzle_input');
        $is.css({fontSize:''});
        var fs=64;
        while((--fs>10) && ($d.innerHeight()>1.9*$is.outerHeight())) {
          $is.css({fontSize:fs+'px'});
        }
      }
    };

    this.draw_init=function() {
      var $divs=$('.courselet_crossword_puzzle');
      if($divs.length) {
        this.p_data={};
        $divs.each(function(i) {
          var $div=$(this);
          var $data=$div.children('.courselet_crossword_puzzle_data');
          var cross_id=$div.attr('id');
          var size=[0,0];
          var $words=$data.children('.courselet_crossword_puzzle_word');
          $words.each(function() {
            var $w=$(this);
            $w.append($w.nextUntil('.courselet_crossword_puzzle_word'));
            var w_id=$w.attr('id');
            var xarr=C.p_xids[w_id];
            CROSS.p_data[w_id]={};
            var d=CROSS.p_data[$w.attr('id')];
            d.id=w_id;
            d.cross_id=cross_id;
            d.sol=xarr[0];
            d.pos=[parseInt(xarr['@x']),parseInt(xarr['@y'])];
            d.placement=xarr['@placement'];
            d.place=CROSS.p_places[d.placement];
            d.dir=d.place[2];
            d.start=[d.pos[0]+d.place[0],d.pos[1]+d.place[1]];
            d.len=d.sol.length;
            d.step=[d.dir?0:1,d.dir?1:0];
            size[0]=Math.max(size[0],d.start[0]+(d.len-1)*d.step[0]);
            size[1]=Math.max(size[1],d.start[1]+(d.len-1)*d.step[1]);
            // C.d(JSON.stringify(d));
          });
          // C.d2(CROSS.p_data);
          var html='';
          for(var y=1;y<=size[1];y++) {
            html+='<tr>';
            for(var x=1;x<=size[0];x++) {
              html+='<td id="'+cross_id+'_td_'+x+'_'+y+'"></td>';
            }
            html+='</tr>';
          }
          $('<table class="courselet_crossword_puzzle">'+html+'</table>').prependTo($div);
          $words.each(function() {
            var $w=$(this);
            var d=CROSS.p_data[$w.attr('id')];
            CROSS.$tds(d).addClass('courselet_crossword_puzzle').each(function(i) {
              if(C.p_preview_results) {
                $(this).text(d.sol[i]);
              }
            });
            var $link=$('<div class="courselet_crossword_puzzle_link" data-idref="'+d.id+'"></div>');
            var $td=CROSS.$td(cross_id,d.pos).append($link).addClass('courselet_crossword_puzzle courselet_crossword_puzzle_linked');
            $link.css({'height':'100%','box-sizing':'border-box'}).on('click',function() {
              if(CROSS.p_evaluated) {
                this.p_evaluated=false;
                $('.courselet_crossword_puzzle_right, .courselet_crossword_puzzle_wrong').removeClass('courselet_crossword_puzzle_right courselet_crossword_puzzle_wrong');
              }
              var $bl=C.black_layer('#courselet_crossword_puzzle_layer',0.2,null,function() {
                CROSS.$tds(d).each(function(i) {
                  $(this).text($('#courselet_crossword_puzzle_input_'+i).val());
                });
                $data.append($w);
                var $l=$('#courselet_crossword_puzzle_layer');
                if($l.length) {
                  $l.remove();
                }
              });
              var $d=$('<div id="courselet_crossword_puzzle_input"></div>');
              CROSS.$tds(d).each(function(i) {
                var ov=null;
                var $i=$('<input type="text" id="courselet_crossword_puzzle_input_'+i+'" class="courselet_input courselet_crossword_puzzle_input" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">').val($(this).text()).appendTo($d);
                var $il=null,$ir=null,$ili=null,$iri=null;
                var norm=function() {
                  var v=$i.val().toUpperCase();
                  if(v.length) {
                    if(v.length>1) {
                      if(v.substr(1,1)==ov) {
                        v=v.substr(0,1);
                      } else {
                        v=v.substr(1,1);
                      }
                    }
                    $i.val(v=v.replace(' ',''));
                  }
                  ov=$i.val();
                };
                norm();
                $i.on('keyup',function(evt) {
                  C.d(evt.which);
                  if(!$il) {
                    $il=$('#courselet_crossword_puzzle_input_'+(i-1));
                    $ili=$il.length?$il:$i;
                    $ir=$('#courselet_crossword_puzzle_input_'+(i+1));
                    $iri=$ir.length?$ir:$i;
                  }
                  switch(evt.which) {
                    case 8: // backspace
                      if(!ov.length) {
                        $ili.focus().select();
                      }
                      break;
                    case 13: // enter
                      $bl.click();
                      break;
                    case 33: // PgUp
                    case 37: // links
                    case 38: // hoch
                      $ili.focus();
                      break;
                    case 34: // PgDn
                    case 39: // rechts
                    case 40: // runter
                      $iri.focus();
                      break;
                    case 9: // tab
                    case 16: // shift
                      break;
                    default:
                      // if(!evt.key || (evt.key.length==1)) { Hier spielen die Mobilgeraete nicht mit.
                      if($i.val().length) {
                        if($ir.length) {
                          C.d2('Next: '+$ir.attr('id'));
                          $ir.focus();
                        } else {
                          window.setTimeout(function() {
                            $bl.click();
                          },10);
                        }
                      }
                  }
                  norm();
                }).on('focus',function(evt) {
                  norm();
                  $i.select();
                  try {
                    $i.get(0).setSelectionRange(0,9999);
                  } catch(e) {
                  }
                }).on('blur',function(evt) {
                  norm();
                });
              });
              var $l=$('<div id="courselet_crossword_puzzle_layer" style="overflow:hidden;position:fixed;z-index:'+(60000+9)+'"></div>').appendTo('body');
              $l.append($w).append($d);
              CROSS.p_reposition_layer();
/*
              iOS: Kein Focus, wenn nicht im Click-Event
              C.turnaround($l.css({visibility:'hidden'}),$l,'rotateX',null,function() {
                $l.find('input').first().focus();
              });
*/
              $l.find('input').first().focus();
              // alert(d.id);
            }).on('mouseover mouseout',function() {
              CROSS.$tds(d).toggleClass('courselet_crossword_puzzle_hover');
            });
          });
          var $tds=$div.find('td.courselet_crossword_puzzle_linked');
          if(!CROSS.css) {
            CROSS.css={
              sc: $tds.css('border-bottom-color'),
              sw: parseFloat($tds.css('border-bottom-width'))*32/$tds.height() // FF57: top ist 0px
            };
            C.d(CROSS.css);
          }
          $tds.each(function() {
            var $td=$(this);
            var $links=$td.find('div');
            var l=$links.length;
            if(l>1) {
              $links.css({height:(100/l)+'%'});
            }
            $links.each(function(i) {
              var $link=$(this);
              var d=CROSS.p_data[$link.attr('data-idref')];
              var $start=CROSS.$td(cross_id,d.start);
              var move=0;
              if((l>=1) && (d.placement==='RH')) {
                move=32*((2*i+1)/(2*l)-0.5);
              }
              $start.attr({'data-bgsvg':$start.attr('data-bgsvg')+'<path d="'+d.place[3].join(' ')+'" fill="'+CROSS.css.sc+'" stroke-width="'+CROSS.css.sw+'px" stroke="'+CROSS.css.sc+'" '+(move?' transform="translate(0,'+move+')"':'')+'/>'});

            });
          });
          $div.find('td[data-bgsvg]').each(function() {
            var $t=$(this);
            var url='url("data:image/svg+xml;base64,'+window.btoa(C.svg(32,32,$t.attr('data-bgsvg')))+'")';
            $t.css({'background-image':url,'background-size':'100% 100%','background-repeat':'no-repeat'});
          });
        });
      }
    };

    this.get=function(xarr_element) {
      var s='';
      CROSS.$tds(CROSS.p_data[xarr_element['@id']]).each(function(i) {
        var t=$(this).text();
        s+=t.length?t:' ';
      });
      return s;
    };

    this.set=function(xarr_element,data) {
      var s='';
      CROSS.$tds(CROSS.p_data[xarr_element['@id']]).each(function(i) {
        $(this).text(data[i]);
      });
      return s;
    };

    this.evaluate=function(s,xarr_element) {
      this.p_evaluated=true;
      s.target=xarr_element[0];
      s.input=this.get(xarr_element);
      s.correct=(s.target==s.input);
      CROSS.$tds(CROSS.p_data[xarr_element['@id']]).each(function(i) {
        $(this).addClass((s.target.substr(i,1)==s.input.substr(i,1))?'courselet_crossword_puzzle_right':'courselet_crossword_puzzle_wrong');
      });
      return s;
    };

  }; // crossword_puzzle

  var InputLevenshtein; // @jump input_levenshtein
  this.input_levenshtein=new function() {

    this.check=function(target,input,graphems,case_sensitivity) {
      var vowels=/[aeiouAEIOUƒ¿¡¬√≈∆»… ÀÃÕŒœ÷ÿ“”‘’‹Ÿ⁄€‰‡·‚„ÂÊËÈÍÎÏÌÓÔˆ¯ÚÛÙı¸˘˙˚]/;
      var debug=true;
      input=input.replace(/[ ]+/,' ').replace(/^[ ]/,'').replace(/[ ]$/,'');
      var a=(case_sensitivity==='yes')?target.split(''):target.toLowerCase().split('');
      var b=(case_sensitivity==='yes')?input.split(''):input.toLowerCase().split('');

      // https://de.wikipedia.org/wiki/Levenshtein-Distanz#Damerau-Levenshtein-Distanz
      var matrix=[];
      var mactions=[];
      var i,j;
      for(i=0;i<=a.length;i++) {
        matrix[i]=[i];
        mactions[i]=['D'];
      }
      for(j=0;j<=b.length;j++) {
        matrix[0][j]=j;
        mactions[0][j]=(j>0)?'I':'M';
      }
      var add=function(i,j,arr) {
        var m=9999;
        var action='';
        for(var l in arr) {
          if(arr[l][1]<m) {
            m=arr[l][1];
            action=arr[l][0];
          }
        }
        matrix[i][j]=m;
        mactions[i][j]=action;
      };
      for(i=1;i<=a.length;i++) {
        for(j=1;j<=b.length;j++) {
          var ca=a[i-1];
          var cb=b[j-1];
          var bv=(vowels.test(ca)==vowels.test(cb));
          add(i,j,[
            ['M',(cb==ca)?matrix[i-1][j-1]:9999], // match
            ['I',matrix[i][j-1]+1], // insertion
            ['D',matrix[i-1][j]+1], // deletion
            ['S',bv?(matrix[i-1][j-1]+1):9999], // substitution
            ['T',(((i>=2)&&(j>=2)&&(cb==a[i-2])&&(b[j-2]==ca)))?(matrix[i-2][j-2]+1):9999], // transposition
            ['X',9999]
          ]);
        }
      }
      // var distance=matrix[a.length][b.length];

      // Pfad rueckwaerts aufbauen, Laengen angleichen
      var transpositions=0;
      i=a.length;
      j=b.length;
      var path=[];
      while((i>=0)&&(j>=0)) {
        var action=mactions[i][j];
        path.unshift(action);
        if(action==='I') {
          a.splice(i,0,'-');
          j--;
        } else if(action==='D') {
          b.splice(j,0,'-');
          i--;
        } else if(action==='T') {
          var t=b[j-1]; //
          b[j-1]=b[j-2];
          b[j-2]=t;
          transpositions++;
          i-=2;
          j-=2;
        } else {
          i--;
          j--;
        }
      }
      path.shift();

      if(typeof(graphems)==='string') {
        graphems=graphems.split(/[ ]*[,| ][ ]*/);
      }
      var map_graphem=function(a0,a1,path,p) {
        var pl=p.length;
        if(pl) {
          for(i=0;i<=a0.length-pl;i++) {
            if(a0.slice(i,i+pl).join('')===p) {
              a0.splice(i,pl,p);
              a1.splice(i,pl,a1.slice(i,i+pl).join(''));
              path.splice(i,pl,['G']);
            }
          }
        }
      };

      // Maximalpunktzahl bestimmen
      var maxhits=0;
      var ta=a.join('').split('');
      var tb=b.join('').split('');
      for(var l in graphems) {
        map_graphem(ta,tb,[],graphems[l]);
      }
      for(var i=0;i<ta.length;i++) {
        if(!/^-+$/.test(ta[i])) {
          maxhits++;
        }
      }

      // Erreichte Punktzahl bestimmen
      for(var l in graphems) {
        map_graphem(a,b,path,graphems[l]);
        map_graphem(b,a,path,graphems[l]);
      }
      var hits=0;
      for(var i=0;i<a.length;i++) {
        if(b[i]==a[i]) {
          hits++;
        } else if(a[i]==='-') {
          hits--;
        }
      }
      hits-=transpositions;

      // Extrapunkt fuer Gross-/Kleinschreibung
      if(case_sensitivity=='extra') {
        maxhits++;
        if(((target.substr(0,1)===target.substr(0,1).toLowerCase())===(input.substr(0,1)===input.substr(0,1).toLowerCase())) && (input.substr(1)===input.substr(1).toLowerCase())) {
          hits++;
        }
      }

      if(debug) {
        var $debug=$('<div></div>');
        $('<pre></pre>').text(a.join("\t")+"\n"+b.join("\t")+"\n"+path.join("\t")+"\n").appendTo($debug);

        var $table=$('<table></table>').css({borderCollapse:'collapse'}).appendTo($debug);
        for(var i=0;i<matrix.length;i++) {
          var $tr=$('<tr></tr>').appendTo($table);
          for(var j=0;j<matrix[i].length;j++) {
            $('<td></td>').css({border:'1px solid lightgray',width:'2.2ch',textAlign:'right'}).text(matrix[i][j]+':'+mactions[i][j]).appendTo($tr);
          }
        }
        $table.find('td').last().css({background:'lime'});
        debug=$debug.html();
      }

      C.d({score:hits,score_max:maxhits});

      return {
        score: hits,
        score_max: maxhits,
        debug: debug
      };
    };

    this.evaluate=function(s,xarr_element) {
      // C.d(xarr_element);
      s.input=$('#'+xarr_element['@id']).val();
      var a=this.check(s.target,s.input,xarr_element['@graphemes'],xarr_element['@case_sensitivity']);
      s.score_max=a.score_max;
      s.score=Math.max(0,a.score);
      s.correct=(s.score_max===s.score);
    };

  }; // input_levenshtein

  var Range; // @jump range
  this.range=new function() {

    var RANGE=this;
    this.p={};

    this.p_min=0;
    this.p_max=6;
    this.p_step=0;

    this.p_update_dynamic=function() { // Dynamische Ausgabe
      $('#courselet span.range').each(function() {
        var $d=$(this);
        $d.parentsUntil('#courselet').each(function() {
          var $i=$(this).find('.courselet_range input[type=range]');
          if($i.length) {
            if($d.text()!==$i.val()) {
              $d.text($i.val());
              C.d('Updating: '+$i.val());
            }
            return false;
          }
        });
      });
    };

    this.draw=function(xarr_element) {
      var x=xarr_element;
      // C.d(x);
      var id=x['@id'];
      var a={};
      a.min=C.to_int(C.elvis(x['@min'],0));
      a.max=C.to_int(C.elvis(x['@max'],6));
      a.step=C.to_int(C.elvis(x['@step'],1));
      a.id=C.p_create_id();
      var result={};
      var html='';
      var html2='';
      var css='';
      css+=x['@width']?('width:'+x['@width']+'px;'):'';
      html+='<span class="courselet_range">';
      html+='<input type="range" id="'+a.id+'" min="'+a.min+'" max="'+a.max+'" step="'+a.step+'"';
      if(x['@tickmarks']) {
        var lid=C.p_create_id();
        html+=' list="'+lid+'"';
        html2+='<datalist id="'+lid+'">';
        if(a.step) {
          for(var i=a.min;i<=a.max;i+=a.step) {
            html2+='<option value="'+i+'" label="'+i+'">'+i+'</option>';
          }
        }
        html2+='</datalist>';
      }
      if(x['@default']) {
        html+=' value="'+x['@default']+'"';
      }
      if(C.p_href(xarr_element,'image')) {
        // Fuer eine Hintergrundgrafik muss die Appearance auf none gesetzt werden. Dann gibt es nur noch den Knopf.
        css+='background-image:url('+C.p_href(xarr_element,'image')+');background-size:100% 100%;appearance: none;';
      }
      css+=C.p_extract_css(xarr_element);
      if(css) {
        html+=' style="'+css+'"';
      }
      html+='>';
      html2+='</span>';
      result.html=html+html2;
      this.p[id]=a;
      result.is_exercise=true;
      result.calls={
        init:     this.draw_init,
        interval: this.p_update_dynamic
      };
      return result;
    };

    this.draw_init=function() {
      var $a=$('#courselet .courselet_range input[type=range]');
      if($a.length) {
        $a.on('change',RANGE.p_update_dynamic);
        RANGE.p_update_dynamic();
      }
    };

    this.get=function(xarr_element) {
      return $('#'+this.p[xarr_element['@id']]['id']).val();
    };

    this.set=function(xarr_element,data) {
      $('#'+this.p[xarr_element['@id']]['id']).val(data);
    };

    this.evaluate=function(s,xarr_element) {
      s.input=this.get(xarr_element);
      C.update_correct(s);
      // C.d(s);
    };

  }; // range

  var MixAndMatch; // @jump mix_and_match
  this.mix_and_match=new function() {

    var MIX=this;

    var drag_$=null;
    var drag_x=0;
    var drag_t=null;

    this.draw=function(xarr_block,html_elements) {
      var result={};
      result.html='<div class="courselet_mix_and_match_temp" style="display:none">'+html_elements+'</div>';
      result.calls={
        init:       this.draw_init,
        reposition: this.reposition
      };
      return result;
    };

    this.draw_init=function() {
      var floors_length=0;
      var $temp=$('.courselet_mix_and_match_temp');
      var arr_$temp=[];
      $temp.each(function(i) {
        var $t=$(this);
        $t.attr('data-column',i);
        floors_length=Math.max(floors_length,$t.children('.courselet_mix_and_match_break').length+1);
        arr_$temp.push($t);
      });
      var $t_table=$('<div id="courselet_mix_and_match" class="courselet_mix_and_match"></div>').insertBefore($temp.first());
      var table_state_last='';
      var table_state=function(s) {
        var c='courselet_mix_and_match'+(s?(' courselet_mix_and_match_'+s):'');
        if(table_state_last!==c) {
          $t_table.attr('class',c);
          table_state_last=c;
        }
      };
      for(var i=0;i<floors_length;i++) {
        var $t_floor=$('<div id="courselet_mix_and_match_floor_'+i+'" class="courselet_mix_and_match_floor_outer">'
                         +'<div class="courselet_mix_and_match_floor_middle">'
                           +'<div class="courselet_mix_and_match_floor_inner" style="overflow:hidden">'
                             +'<div id="courselet_mix_and_match_slider_'+i+'" data-i="'+i+'" class="courselet_mix_and_match_slider" style="display:table">'
                             +'</div>'
                           +'</div>'
                         +'</div>'
                      +'</div>');
        $t_floor.appendTo($t_table);
        var $t_slider=$('#courselet_mix_and_match_slider_'+i);
        for(var j in arr_$temp) {
          var $t=arr_$temp[j];
          var $t_slot=$('<div class="courselet_mix_and_match_segment" style="display:table-cell"></div>');
          $t_slot.attr('data-column',$t.attr('data-column'));
          $t_slot.appendTo($t_slider);
          $t.children().first().nextUntil('.courselet_mix_and_match_break').addBack().appendTo($t_slot);
        }
        $('<div class="courselet_mix_and_match_floor_left" data-i="'+i+'"></div>').prependTo($t_floor).on('click',function() {
          table_state('');
          MIX.p_turn($(this).attr('data-i'),-1);
        });
        $('<div class="courselet_mix_and_match_floor_right" data-i="'+i+'"></div>').appendTo($t_floor).on('click',function() {
          table_state('');
          MIX.p_turn($(this).attr('data-i'),1);
        });
        if(arr_$temp.length>1) {
          do {
            arr_$temp=C.shuffle(arr_$temp);
          } while(arr_$temp[0].attr('data-column')==0);
        }
      }
      $('.courselet_mix_and_match_temp, .courselet_mix_and_match_break').remove();
      // $('.courselet_mix_and_match_slider').css('margin-left','-2000px');
      $('.courselet_mix_and_match_slider').on('mousedown touchstart',function(evt) {
        evt.preventDefault();
        drag_$=$(this);
        drag_x=parseFloat(drag_$.css('margin-left'))-C.p_evt(evt).pageX;
        table_state('');
      }).on('mousemove touchmove',function(evt) {
        evt.preventDefault();
        if(drag_$) {
          drag_$.css('margin-left',(C.p_evt(evt).pageX+drag_x)+'px');
          if(drag_t) {
            window.clearTimeout(drag_t);
          }
          drag_t=window.setTimeout(function() {
            if(drag_$) {
              drag_$=null;
              MIX.p_snap();
            }
          },1000);
        }
      }).on('mouseup touchend',function(evt) { // mouseout bubbelt von innenliegenden Elementen
        evt.preventDefault();
        if(drag_$) {
          drag_$=null;
          MIX.p_snap();
        }
      });
      if(floors_length>1) {
        $('<input id="courselet_mix_and_match_button" class="submit" type="submit" value="">').attr('value',C.p_lg('mix_and_match_button')).insertAfter('#courselet_mix_and_match').on('click',function(evt) {
          evt.stopImmediatePropagation();
          evt.preventDefault();
          var $sliders=$('.courselet_mix_and_match_slider');
          var $slots=null;
          $sliders.each(function() {
            var $slider=$(this);
            var no=$slider.attr('data-no');
            var $slot=$slider.children().slice(no).first();
            $slots=$slots?$slots.add($slot):$slot;
          });
          var col=$slots.attr('data-column');
          var b=true;
          $slots.each(function() {
            if(col!=$(this).attr('data-column')) {
              b=false;
            }
          });
          if(b) {
            table_state('right');
            var d=1;
            try {
              var cs=window.getComputedStyle($t_table.get(0));
              d=Math.max(1,cs.getPropertyValue('--courselet_sleep'));
            } catch(e) {
            }
            window.setTimeout(function() {
              C.animate(function(i) {
                $slots.css({'transform':'scaleX('+(1+i*0.2)+')'});
              },function() {
                C.animate(function(i) {
                  $slots.css({'transform':'scaleX('+(1.2-i)+')'});
                },function() {
                  if($sliders.first().children().length>1) {
                    table_state('');
                    $slots.remove();
                    MIX.p_snap();
                  } else {
                    C.p_load_next_page();
                  }
                });
              });
            },d);
          } else {
            table_state('wrong');
            C.animate(function(i) {
              $slots.css({'transform':'rotate('+(8*Math.sin(5*Math.PI*i))+'deg)'});
            });
          }
        });
      }
      MIX.p_snap();
    };

    this.p_turn=function(i,dir) {
      var $slider=$('#courselet_mix_and_match_slider_'+i);
      var c=$slider.children().length;
      if(c) {
        var cw=$slider.width()/c;
        $slider.stop(true,true);
        var l=parseFloat($slider.css('margin-left'));
        $slider.animate({'margin-left':(l-dir*0.3*cw)+'px'},50,'linear',this.p_snap);
      }
    };

    this.p_snap=function() {
      var $arrows=$('.courselet_mix_and_match_floor_left, .courselet_mix_and_match_floor_right');
      $arrows.removeClass('courselet_mix_and_match_floor_left_disabled').removeClass('courselet_mix_and_match_floor_right_disabled');
      $('.courselet_mix_and_match_slider').each(function() {
        var $slider=$(this);
        var c=$slider.children().length;
        if(c) {
          var di=$slider.attr('data-i');
          var w=$slider.width(); // Funktioniert nur mit display:table
          var cw=w/c;
          $slider.stop(true,false);
          var l=parseFloat($slider.css('margin-left'));
          var no=Math.round(Math.min(Math.max(-(l/cw),0),c-1));
          var ln=-(no*cw);
          if(no==$slider.attr('data-no')) {
            // Bei "keiner Aenderung" auch bei 1/4 Verschiebung weiterschubsen
            if(Math.abs(ln-l)>=(cw/4)) {
              no=Math.min(Math.max(no+Math.sign(ln-l),0),c-1);
              ln=-(no*cw);
            }
          }
          if(Math.abs(ln-l)>0.1) {
            // C.d(l+' -> '+ln);
            $slider.animate({'margin-left':ln+'px'},200,'swing');
          }
          $slider.attr('data-no',no);
          $slider.parent().width(cw);
          if(!no) {
            $arrows.filter('.courselet_mix_and_match_floor_left[data-i='+di+']').addClass('courselet_mix_and_match_floor_left_disabled');
          }
          if(no==c-1) {
            $arrows.filter('.courselet_mix_and_match_floor_right[data-i='+di+']').addClass('courselet_mix_and_match_floor_right_disabled');
          }
        }
      });
    };

    this.reposition=function() {
      MIX.p_snap();
    };

  }; // mix_and_match
  
  var Overlay; // @jump overlay
  this.overlay=new function() {
    
    var O=this;
    
    this.draw=function(xarr_element,xarr_block) {
      var result={};      
      var src=C.p_href(xarr_element,'image');
      var p=Math.min(100,Math.max(0,C.to_int(xarr_element['@default'])));
      result.html='<img class="courselet_overlay" data-mode="'+xarr_element['@mode']+'" data-block="'+xarr_block['@id']+'" data-promille="'+(10*p)+'" style="display:none" src="'+src+'">';
      result.is_exercise=false;
      result.calls={
        init:       this.draw_init,
        reposition: this.reposition
      };
      return result;   
    };
    
    this.draw_init=function() {
      $('img.courselet_overlay').each(function() {
        var $ei=$(this);
        var eid=$ei.attr('id');
        var $bi=$('#'+$ei.attr('data-block')).find('.courselet_block_image');
        var $p=$bi.parent();
        var mode=$ei.attr('data-mode');
        var absleft=$p.css('padding-left');
        var abstop=$p.css('padding-top');
        console.log(mode);
        $p.css({position:'relative'});
        $bi.after($ei);
        $ei.css({position:'absolute',left:absleft,top:abstop,display:'inline-block'});
        var $lever=$('<span class="courselet_overlay_lever"></span>');
        $lever.addClass(((mode==='rtl')||(mode==='ltr'))?'courselet_overlay_lever_vertical':'courselet_overlay_lever_horizontal');
        $lever.css({position:'absolute',display:'inline-block',left:absleft,top:abstop}).appendTo($p);
        C.register_drag($bi.add($ei).add($lever),function(m,r) {
          if(m==='start') {
            $ei.attr('data-promille-dragging',$ei.attr('data-promille'));
          } else if(m==='move') {
            var p=(parseInt($ei.attr('data-promille-dragging'))/10);
            var d=((mode==='rtl')||(mode==='ltr'))?(100*r.dx/$($bi).width()):(100*r.dy/$($bi).height());
            p=((mode==='ltr')||(mode==='td'))?(p+d):(p-d);
            O.move(eid,p,false);
          } else if(m==='click') {
            // console.log(r);
            // alert(JSON.stringify(r));
            if(r.offsetX || r.offsetY) {
              var q=(mode==='rtl')?(1-r.offsetX/$ei.width()):((mode==='ltr')?(r.offsetX/$ei.width()):((mode==='td')?(r.offsetY/$ei.height()):((mode==='bu')?(1-r.offsetY/$ei.height()):0)));
              O.move(eid,100*q,true);
            }
          }
        });
      });
      O.reposition();
    };
    
    this.reposition=function() {
      $('img.courselet_overlay').each(function() {
        var $ei=$(this);
        var $bi=$('#'+$ei.attr('data-block')).find('.courselet_block_image');
        $ei.width($bi.width()).height($bi.height());
        var $lever=$ei.parent().find('.courselet_overlay_lever');
        if($lever.hasClass('courselet_overlay_lever_vertical')) {
          $lever.height($bi.height());
        } else {
          $lever.width($bi.width());
        }
        O.move($ei.attr('id'),null);
      });
    };
    
    this.p_move=function($ei,p) {
      var mode=$ei.attr('data-mode');
      var $lever=$ei.parent().find('.courselet_overlay_lever');
      if(mode==='rtl') {
        $ei.css({'clip-path':'polygon('+(100-p)+'% 0, 100% 0, 100% 100%, '+(100-p)+'% 100%)'});
        $lever.css({left:'calc( '+(100-p)+'% - '+($lever.width()/2)+'px )'});
      } else if (mode==='ltr') {
        $ei.css({'clip-path':'polygon('+p+'% 0, 0 0, 0 100%, '+p+'% 100%)'});
        $lever.css({left:'calc( '+p+'% - '+($lever.width()/2)+'px )'});
      } else if (mode==='td') {
        $ei.css({'clip-path':'polygon(0 '+p+'%, 0 0, 100% 0, 100% '+p+'%)'});
        $lever.css({top:'calc( '+p+'% - '+($lever.height()/2)+'px )'});
      } else if (mode==='bu') {
        $ei.css({'clip-path':'polygon(0 '+(100-p)+'%, 0 100%, 100% 100%, 100% '+(100-p)+'%)'});
        $lever.css({top:'calc( '+(100-p)+'% - '+($lever.height()/2)+'px )'});
      }
    };

    this.move=function(id,p,a) {
      var $ei=$('#'+id);
      var op=parseInt($ei.attr('data-promille'))/10;
      if(p===null) {
        p=op;
      } else if(op==p) {
        a=false;
      } else {
        p=Math.max(0,Math.min(p,100));
        $ei.attr('data-promille',Math.round(10*p));
      }
      if(a) {
        C.animate(function(i) {
          var pa=op-(i*(op-p));
          O.p_move($ei,pa);
        },O.reposition);
      } else {
        O.p_move($ei,p);
      }
    };

  }; // overlay


/* --------------- */

  this.coords=function($o) {
    var o=$o.offset(),w=$o.outerWidth(),h=$o.outerHeight();
    return {x1:o.left,y1:o.top,x2:o.left+w,y2:o.top+h,w:w,h:h,xc:o.left+w/2,yc:o.top+h/2};
  };

  this.htmlspecialchars=function(s) {
    return $('<div></div>').text(s).html().replace(/&(amp|#34);(#[0-9]+;)/g,'&$2');
  };

  this.html_double_quotes=function(s) {
    if(s) {
      s=s.replace(/"/g,'&#34;');
    }
    return s;
  };

  this.html=function(s) {
    s=s.replace(/\[\[([^\]<>\r\n|]+?)\|([^\]<>\r\n|]+?)\]\]/g,'<a href="#" title="$1" class="courselet_internal_link">$2</a>');
    s=s.replace(/\[\[([^\]<>\r\n]+?)\]\]/g,'<a href="#" title="$1" class="courselet_internal_link">$1</a>');
    s=s.replace(/(\n|&#10;|&#xA;)/g,'<br>');
    return s;
  };
/*
  this.define_class=function(sel,s) {
    var id='courselet_';
    for(var i=0;i<sel.length;i++) {
      id+=sel.charCodeAt(i);
    }
    $('#'+id).remove();
    $('<style type="text/css"></style>').attr({id:id}).html('<!--\n'+sel+' {\n'+s+'\n}\n-->').appendTo('head');
  };
*/
  this.trim=function(s) {
    return String(s).replace(/^[ \f\n\r\t\v]+/,'').replace(/[ \f\n\r\t\v]+$/,'');
  };

  this.replace_html=function(query,html) {
    $('#'+this.p_params['dom_id_courselet']).find(query).html(html);
    C.p_reposition();
  };

  this.p_xml_to_array_decode=function(s) {
    return this.trim(s).replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&');
  };

  this.xml_to_xarray=function(str_xml) {
    var result={};
    var level=-1;
    var result_path={};
    result_path={0:result};
    //                 1    2             3                          4     5
    var reg_exp_tag=/<(\/?)(\w+(?::\w+)?)((?:\s+[\w:]+="[^"]*")*)\s*(\/?)>([^<]*)/g;
    var arr_tag;
    while(arr_tag=reg_exp_tag.exec(str_xml)) {
      var tagname=arr_tag[2];
      if(!arr_tag[1]) {
        var result_point=result_path[level+1];
        var index=0;
        if(result_point[tagname]) {
          while(result_point[tagname][index]) {
            index++;
          }
        } else {
          result_point[tagname]={};
        }
        var element={};
        if(arr_tag[3]) {
          var reg_exp_prop=/([\w:]+)="([^"]*)"/g;
          var arr_prop;
          while(arr_prop=reg_exp_prop.exec(arr_tag[3])) {
            element['@'+arr_prop[1]]=this.p_xml_to_array_decode(arr_prop[2]);
          }
        }
        if(this.trim(arr_tag[5])) {
          element[0]=this.p_xml_to_array_decode(arr_tag[5]);
        }
        result_point[tagname][index]=element;
        if(!arr_tag[4]) {
          level++;
          result_path[level+1]=element;
        }
      } else {
        level--;
      }
    }
    return result;
  };
  this.dump=function(o) {
    alert(this.json_encode(o));
  };
  this.json_encode=function(o) {
    return JSON.stringify(o);
/*
    var result='';
    if(o==null) {
      result+='null';
    } else {
      switch(typeof(o)) {
        case 'undefined':
          result+='null';
          break;
        case 'array':
          result+='[';
          var i=0;
          for(var x in o) {
            result+=(i>0?',':'')+this.json_encode(o[x]);
            i++;
          }
          result+=']';
          break;
        case 'object':
          result+='{';
          var i=0;
          for(var x in o) {
            result+=(i>0?',':'')+this.json_encode(x)+':'+this.json_encode(o[x]);
            i++;
          }
          result+='}';
          break;
        case 'boolean':
          result+=(o?'true':'false');
          break;
        case 'number':
          result+=o.toString();
          break;
        case 'string':
          result+='"'+o.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/g,"\\n")+'"';
          break;
        default:
          result+='"'+typeof(o)+'"';
          break;
      }
    }
    if(result!=JSON.stringify(o)) {
      $('#courselet').append('<pre style="border:1px solid black"></pre>');
      $('#courselet pre').text(result+"\n\n"+JSON.stringify(o));
    }
    return JSON.stringify(o);
    return result;
*/
  };
  this.sleep=function(ms) {
    var start=new Date();
    while(new Date().getTime() < ms + start.getTime()) {
    }
  };
  this.svg=function(w,h,xml) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'">'+xml+'</svg>';
  };
  this.svgcssbg=function(w,h,xml) {
    return 'url(data:image/svg+xml;base64,'+window.btoa(this.svg(w,h,xml))+')';
  };
  this.epoch=function() {
    var ms_epoch=new Date().getTime();
    return (Math.floor(ms_epoch/1000)+this.p_epoch_delta);
  };
  this.to_time_hr=function(s) {
    var i=this.to_int(s);
    var n=(i<0);
    i=n?-i:i;
    var h=Math.floor(i/3600);
    var m=Math.floor(i/60)%60;
    var s=i%60;
    return (n?'-':'')+(h?(h+':'):'')+((m<10)?'0':'')+m+':'+((s<10)?'0':'')+s;
  };
  this.to_string=function(x,def) {
    if((x!==null) && (x!=undefined)) {
      return String(x);
    } else {
      return this.to_string(def,'');
    }
  };
  this.to_bool=function(x) {
    if(x && (x!='0')) {
      return true;
    } else {
      return false;
    }
  };
  this.to_int=function(s) {
    return (parseInt(s)?parseInt(s):0);
  };
  this.elvis=function(a,b) {
    if(a && (a!=='0')) {
      return a;
    } else {
      return b;
    }
  };
  this.precede=function(s,p,a) {
    return s?(''+(p?p:'')+s+(a?a:'')):'';
  };
  this.is_numeric=function(x) {
    return ((x!==null) && (x!==undefined) && (String(x)===String(parseInt(x))));
  };
  this.is_array=function(a) {
    return ((typeof(a)=='array')||(typeof(a)=='object'));
  };
  this.is_equal=function(solution,user,pos,as_object) {
    var result=false;
    var a=this.is_array(solution)?solution:String(solution).split('|');
    var tu=this.trim(user).replace(/\s+/g,' ');
    if((pos>0) || (0===pos)) { // Number.isInteger() nix IE11
      a=[a[pos]];
    }
    var p=-1;
    for(var i in a) {
      var ta=this.trim(a[i]).replace(/\s+/g,' ');
      if((ta==tu) || ($('<span />').html(ta).html()==$('<span />').html(tu).html()) || ($('<span />').text(ta).html()==$('<span />').html(tu).html()) || ($('<span />').html(ta).html()==$('<span />').text(tu).html())) {
        p=i;
        result=true;
      }
    }
    if(as_object) {
      result={correct:result,position:p};
    }
    return result;
  };
  this.update_correct=function(s) {
    var o=-1;
    if(s.target && s.target.indexOf && s.target.split && (s.target.indexOf('|')>=0)) {
      s.target=s.target.split('|');
    }
    o=this.is_equal(s.target,s.input,-1,true);
    s.correct=o.correct;
    s.position=o.position;
  };

  this.get_selected_html=function() {
    var html='';
    if(window.getSelection) {
      var sel=window.getSelection();
      if(sel.rangeCount) {
        var container=document.createElement('div');
        for(var i=0;i<sel.rangeCount;++i) {
          container.appendChild(sel.getRangeAt(i).cloneContents());
        }
        html=container.innerHTML;
      }
    } else {
      alert('get_selected_html: Ihr Browser wird nicht unterstuetzt.');
      this.get_selected_html=function() {};
/*
      if(typeof document.selection!='undefined') {
        if(document.selection.type=='Text') {
          html=document.selection.createRange().htmlText;
        }
      }
*/
    }
    return html;
  };

/*
  this.unselect=function() {
    try {
      if(window.getSelection) {
        window.getSelection().removeAllRanges();
      } else if(document.selection) {
        document.selection.empty();
      }
    } catch(e) {
    }
  };
*/
  this.underscore_to_camelcase=function(s) {
    return s.replace(/_[a-z]/g,function(c) {
      return c[1].toUpperCase();
    });
  };
  this.array_unique=function(arr) {
    var a=[];
    for(var i in arr) {
      if(-1==a.indexOf(arr[i])) {
        a.push(arr[i]);
      }
    }
    return a;
  };
  this.shuffle=function(o) {
    var a=[];
    for(var i in o) { // Object -> Array
      a.push(o[i]);
    }
    for(var i=a.length-1;i>0;i--) {
      var r=Math.floor(Math.random()*(i+1));
      var t=a[i];
      a[i]=a[r];
      a[r]=t;
    }
    return a;
  };
  this.shuffle_test=function() {
    var r={};
    for(var i=0;i<24000;i++) {
      var a=[1,2,3,4];
      a=this.shuffle(a);
      var v=r[a.join(',')];
      r[a.join(',')]=v?(v+1):1;
    }
    var s='';
    for(var i in r) {
      s+=i+':'+r[i]+'\n';
    }
    this.d2(s);
  };
  this.string_to_array=function(s) {
    // Ersatz fuer charAt() und split(''), die keine non-Basic-Multilingual-Plane (BMP) characters unterstuetzen
    var result=[];
    var i=0;
    while(i<s.length) {
      var c=s.charAt(i++);
      if(/[\uD800-\uDBFF]/.test(c) && /[\uDC00-\uDFFF]/.test(s.charAt(i))) {
        c+=s.charAt(i++);
        // alert(c);
      }
      result.push(c);
    }
    return result;
  };
  this.explode=function(c,s) {
    var result=[];
    s=this.to_string(s);
    if(s.length) {
      var t='';
      for(var i=0;i<s.length;i++) {
        if(s.charAt(i)==c) {
          result.push(t);
          t='';
        } else {
          t+=s.charAt(i); // s[i] nicht mit IE6
        }
      }
      result.push(t);
    }
    return result;
  };
  this.explode_to_ints=function(c,s) {
    var result=[];
    var arr=this.explode(c,s);
    for(var i in arr) {
      result.push(parseInt(arr[i])?parseInt(arr[i]):0);
    }
    return result;
  };
  this.get_ID=function($item) {
    var id=$item.attr('id');
    if(!id) {
      id=$item.parents('[id]').attr('id');
    }
    return id;
  };
  this.date=function(format,ts) {
    var t;
    var dt=(ts?new Date(1000*ts):new Date());
    return format.replace(/d/g,(((t=dt.getDate())<10)?'0':'')+t).replace(/m/g,(((t=(dt.getMonth()+1))<10)?'0':'')+t).replace(/Y/g,dt.getFullYear()).replace(/H/g,(((t=dt.getHours())<10)?'0':'')+t).replace(/i/g,(((t=dt.getMinutes())<10)?'0':'')+t);
  };
  this.log=function(s) {
    window.setTimeout(function(){throw(new Error(s,''));},0);
  };
  this.clone_object=function(o) {
    return JSON.parse(JSON.stringify(o));
  };
  this.mime_type=function(s) {
    // https://www.ww3-dev.de/wws/mime-types.php
    var a={
      "3gp":"video/3gpp",
      "7z":"application/x-7z-compressed",
      "ai":"application/postscript",
      "apk":"application/vnd.android.package-archive",
      "asp":"text/asp",
      "avi":"video/x-msvideo",
      "bmp":"image/bmp",
      "bz2":"application/x-bzip",
      "css":"text/css",
      "doc":"application/msword",
      "docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "eml":"message/rfc822",
      "eps":"application/postscript",
      "flv":"video/x-flv",
      "ggb":"application/vnd.geogebra.file",
      "ggs":"application/vnd.geogebra.slides",
      "ggt":"application/vnd.geogebra.tool",
      "gif":"image/gif",
      "gz":"application/x-gzip",
      "htm":"text/html",
      "html":"text/html",
      "ico":"image/x-icon",
      "ics":"text/calendar",
      "iso":"application/x-iso9660-image",
      "jar":"application/java-archive",
      "jpe":"image/jpeg",
      "jpeg":"image/jpeg",
      "jpg":"image/jpeg",
      "js":"text/javascript",
      "json":"application/json",
      "jsonl":"application/x-jsonl",
      "m4a":"audio/mpeg",
      "m4v":"video/mp4",
      "md":"text/markdown",
      "mdb":"application/msaccess",
      "mjs":"text/javascript",
      "mml":"text/mathml",
      "mov":"video/quicktime",
      "mp2":"audio/mpeg",
      "mp3":"audio/mpeg",
      "mp4":"video/mp4",
      "mpeg":"video/mpeg",
      "mpg":"video/mpeg",
      "odb":"application/vnd.oasis.opendocument.database",
      "odf":"application/vnd.oasis.opendocument.formula",
      "odg":"application/vnd.oasis.opendocument.graphics",
      "odp":"application/vnd.oasis.opendocument.presentation",
      "ods":"application/vnd.oasis.opendocument.spreadsheet",
      "odt":"application/vnd.oasis.opendocument.text",
      "oga":"audio/ogg",
      "ogg":"video/ogg",
      "ogv":"video/ogg",
      "p7m":"application/pkcs7-mime",
      "p7s":"application/pkcs7-signature",
      "pdf":"application/pdf",
      "php":"text/php",
      "png":"image/png",
      "potx":"application/vnd.openxmlformats-officedocument.presentationml.template",
      "pps":"application/vnd.ms-powerpoint",
      "ppt":"application/vnd.ms-powerpoint",
      "pptx":"application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "psd":"image/x-photoshop",
      "pub":"application/x-mspublisher",
      "rar":"application/rar",
      "rfc822-headers":"text/rfc822-headers",
      "rtf":"text/rtf",
      "sqlite":"application/vnd.sqlite3",
      "svg":"image/svg+xml",
      "svgz":"image/svg+xml",
      "swf":"application/x-shockwave-flash",
      "tar":"application/x-tar",
      "tif":"image/tiff",
      "tiff":"image/tiff",
      "txt":"text/plain",
      "vcf":"text/x-vcard",
      "vtt":"text/vtt",
      "wav":"audio/x-wav",
      "webm":"video/webm",
      "wma":"audio/x-ms-wma",
      "wmv":"video/x-ms-wmv",
      "wps":"application/vnd.ms-works",
      "wsdl":"text/xml",
      "wwtext":"text/vnd.webweaver.inlinehtml",
      "xls":"application/vnd.ms-excel",
      "xlsx":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "xml":"text/xml",
      "zip":"application/zip",
      "zst":"application/zstd"
    };
    if(s) {
      s=s.replace(/^.*\.([0-9a-zA-Z]+)$/,'$1');
      if(a[s]) {
        return a[s];
      }
    }
    return 'application/octet-stream';
  };




  /***** SCORM Content API - http://adlnet.gov/adl-research/scorm/scorm-1-2/ ******/

  this.p_scorm_content_api_initialized=false;
  this.p_custom_properties={};

  this.p_scorm_content_api_construct=function() {
    if(!this.p_scorm_content_api_initialized) {
      // alert('construct');
      this.p_scorm_content_api_initialized=true;
      window.API={
        'LMSInitialize'     : this.scorm_content_api_initialize_1_2,
        'LMSFinish'         : this.scorm_content_api_finish,
        'LMSCommit'         : this.scorm_content_api_commit,
        'LMSGetValue'       : this.scorm_content_api_get_value,
        'LMSSetValue'       : this.scorm_content_api_set_value,
        'LMSGetLastError'   : this.scorm_content_api_get_last_error,
        'LMSGetErrorString' : this.scorm_content_api_get_error_string,
        'LMSGetDiagnostic'  : this.scorm_content_api_get_diagnostic,
        'error'             : 0,
        'courselet'         : this
      };
      if(window.API_1484_11) { // SCORM 2004
        try {
          window.API_1484_11=undefined;
        } catch(e) {
          window.API_1484_11=null;
        }
      }
    }
  };

  this.p_scorm_content_api_destruct=function() {
    if(this.p_scorm_content_api_initialized) {
      window.API=null;
      this.p_scorm_content_api_initialized=false;
    }
  };

  this.p_load_results_timer=null;
  this.p_load_results_callback=function(data) {
    if(C.p_load_results_timer) {
      window.clearTimeout(C.p_load_results_timer);
      C.p_load_results_timer=null;
      // C.d('p_load_results_timer cleared.');
    } else {
      // C.d('p_load_results_timer not set.');
    }
    if(data) {
      if(data && data['results']) {
        C.p_loaded_results=data['results'];
      }
      C.d('Results loaded.');
    } else {
      C.d('No results loaded.');
    }
    C.p_init(4);
  };

  this.p_load_results=function() {
    if(this.p_edit) {
      C.p_load_results_callback();
    } else if(this.p_app) {
      C.d('Loading results (app).');
      C.p_load_results_timer=window.setTimeout(function() {
        alert('load_results: Callback nicht aufgerufen');
        C.p_load_results_callback();
      },5000);
      this.p_external_send('get_results',{},C.p_load_results_callback);
    } else if(this.p_scorm) {
      // Nur bei SCORM_SINGLE gesetzt.
      C.p_load_results_callback({'results':this.p_get_suspend_data(1,'scores')});
    }
  };

  this.p_get_suspend_data=function(global,id) {
    if(null===this.p_suspend_data) {
      // this.p_load_suspend_data();
      // alert('Suspend-Daten nicht initalisiert?!');
    }
    C.d2(this.p_suspend_data['courselet']?[this.p_suspend_data['courselet']['0'],this.p_suspend_data['courselet'][this.page_id]]:'');
    var part=global?'_':this.page_id;
    var data=null;
    if((typeof this.p_suspend_data['courselet']!=='undefined') && (typeof this.p_suspend_data['courselet'][part]!=='undefined') && (typeof this.p_suspend_data['courselet'][part][id]!=='undefined')) {
      data=C.clone_object(this.p_suspend_data['courselet'][part][id]);
    }
    return data;
  };

  this.p_may_set_suspend_data=function(global,id,data,timeout) {
    var chg=false;
    if(global || this.p_page_uses_suspend_data) {
      if(chg=this.p_set_suspend_data(global,id,data)) {
        this.p_save_suspend_data(timeout,3);
      }
    }
    return chg;
  };

  this.p_set_unread=function() {
    this.p_may_set_suspend_data(false,'unread',(this.p_corrector_mode<=1)?2:1,500);
  };

  this.p_set_read=function() {
    if(this.p_page_uses_suspend_data) {
      var unread=C.p_get_suspend_data(false,'unread');
      var mode=(this.p_corrector_mode<=1)?1:2;
      if(unread && (unread & mode)) {
        C.p_may_set_suspend_data(false,'unread',(unread & ~ mode),1000);
      }
    }
  };

  this.p_set_suspend_data=function(global,id,data) {
    var old=this.p_get_suspend_data(global,id);
    var chg=false;
    if(data!==old) {
      var part=global?'_':this.page_id;
      if(!this.p_suspend_data['courselet'] || (typeof(this.p_suspend_data['courselet'])!=='object') || (JSON.stringify(this.p_suspend_data['courselet'])==='[]')) {
        this.p_suspend_data['courselet']={};
      }
      if(!this.p_suspend_data['courselet'][part] || (typeof(this.p_suspend_data['courselet'][part])!=='object') || (JSON.stringify(this.p_suspend_data['courselet'][part])==='[]')) {
        this.p_suspend_data['courselet'][part]={};
      }
      this.p_suspend_data['courselet'][part][id]=C.clone_object(data);
      C.d('set_suspend_data "'+part+','+id+'"');
      C.d2(this.p_suspend_data['courselet'][part]);
      chg=true;
    }
    return chg;
  };

  this.p_load_suspend_data_timer=null;
  this.p_load_suspend_data_callback=function(data) {
    // this ist bei Aufruf ueber external_callback nicht definiert.
    if(C.p_load_suspend_data_timer) {
      window.clearTimeout(C.p_load_suspend_data_timer);
      C.p_load_suspend_data_timer=null;
    }
    if(data) {
      if(C.p_suite) {
        C.p_suspend_data=data;
      } else if(C.p_app || this.p_scorm) {
        try {
          if(data['suspend_data']) {
            C.p_suspend_data=JSON.parse(data['suspend_data']);
            // console.log(C.p_suspend_data);
          } else {
            C.d('No suspend data found.');
          }
        } catch(e) {
          alert('Parsing of suspend data failed.\n'+e.name+': '+e.message);
          alert(data['suspend_data']);
        }
      }
    }
    if(!C.p_suspend_data) {
      C.p_suspend_data={};
    }
    C.p_current_suspend_data=C.json_encode(C.p_suspend_data);
    C.p_first_load_suspend_data_ended();
    C.d2(data);
    C.p_init(3);
  };

  this.p_load_suspend_data=function() {
    this.p_suspend_data={};
    if(this.p_skip_load_suspend_data) {
      C.p_load_suspend_data_callback();
    } else if(this.p_suite) {
      C.d('Loading suspend data (suite).');
      $.ajax({
        'url'      : this.p_params['url_talkback']+'&c='+this.p_params['courselet_id']+'&load_suspend_data=1',
        'async'    : true,
        'cache'    : false,
        'dataType' : 'JSON',
        'success'  : function(data) {
          C.p_load_suspend_data_callback(data);
        },
        'error'    : function() {
          alert('Error loading suspend data.');
          C.p_load_suspend_data_callback();
        },
        'type'     : 'GET'
      });
    } else if(this.p_edit) {
      C.p_load_suspend_data_callback();
    } else if(this.p_app) {
      C.d('Loading suspend data (app).');
      C.p_load_suspend_data_timer=window.setTimeout(function() {
        alert('load_suspend_data: Callback nicht aufgerufen');
        C.p_load_suspend_data_callback();
      },5000);
      this.p_external_send('get_suspend_data',{},C.p_load_suspend_data_callback);
    } else if(this.p_scorm) {
      C.d('Loading suspend data (scorm).');
      C.p_scorm_initialize();
      C.p_load_suspend_data_callback({'suspend_data':C.p_scorm_get_value('cmi.suspend_data')});
    } else { // Standalone
      C.p_load_suspend_data_callback();
    }
  };

  this.p_save_suspend_data_timer=null;
  this.p_save_suspend_data_commit=3;
  this.p_save_suspend_data=function(ms,commit) {
    if(this.p_save_suspend_data_timer) {
      window.clearTimeout(this.p_save_suspend_data_timer);
      this.p_save_suspend_data_timer=null;
    }
    if(commit) {
      this.p_save_suspend_data_commit=commit;
    }
    if(this.p_suspend_data && (this.p_current_suspend_data!==this.json_encode(this.p_suspend_data))) {
      if((ms>0) && this.p_suite) { // Zeitverzoegerung nur im Suite-Modus, da kein Unload-Event in App
        this.p_save_suspend_data_timer=window.setTimeout(function() {
          C.p_save_suspend_data(0);
        },ms);
      } else {
        this.p_current_suspend_data=this.json_encode(this.p_suspend_data);
        if(this.p_suite) {
          var t_url=this.p_params['url_talkback']+'&c='+this.p_params['courselet_id']+'&save_suspend_data=1';
          if((ms<0) && navigator.sendBeacon) {
            C.d('Saving suspend data (Suite, Beacon).');
            if(navigator.sendBeacon(t_url,JSON.stringify({'suspend_data':this.p_current_suspend_data}))) {
              C.d('Suspend data scheduled.');
            } else {
              // Wird nie erreicht.
              C.p_warning(C.p_lg('save_error_general'));
              C.d('Suspend data FAILED.');
            }
            C.p_commit(C.p_save_suspend_data_commit);
          } else {
            C.d('Saving suspend data (Suite, AJAX).');
            $.ajax({
              'type'     : 'POST',
              'url'      : t_url,
              'data'     : {'suspend_data' : this.p_current_suspend_data},
              'success'  : function(result) {
                C.d('Suspend data saved.');
                C.d(result);
                C.p_commit(C.p_save_suspend_data_commit);
              },
              'error'    : function() {
                C.p_warning(C.p_lg('save_error_general'));
                C.d('Suspend data FAILED.');
              },
              'dataType' : 'JSON',
              'async'    : (ms<0)?false:true,
              'cache'    : false
            });
          }
        } else if(this.p_app) {
          C.d('Saving suspend data (app).');
          C.p_external_send('set_suspend_data',{'suspend_data':this.p_current_suspend_data});
          C.p_commit(C.p_save_suspend_data_commit);
        } else if(this.p_scorm) {
          C.d('Saving suspend data (scorm).');
          C.p_scorm_set_value('cmi.suspend_data',this.p_current_suspend_data);
          C.p_commit(C.p_save_suspend_data_commit);
        }
      }
    } else {
      C.p_commit(C.p_save_suspend_data_commit);
    }
  };

  this.p_scorm_content_api_property=function(property,set,value) {
    var key=this.page_id;
    var dv='';
    window.API.error='0';
    switch(property) {
      case 'cmi.core._children':
        return 'student_name,student_id,lesson_location,credit,entry,score,lesson_status,total_time,exit,session_time'; // lesson_mode
      case 'cmi.core.student_id':
        return this.p_params['user_id'];
      case 'cmi.core.student_name':
        return this.p_params['user_name'];
      case 'cmi.core.lesson_location':
        break;
      case 'cmi.core.credit':
        return 'credit'; // no-credit
      case 'cmi.lesson_status':
        dv='not attempted';
        break;
      case 'cmi.core.entry':
        dv='ab-inito'; // resume
        break;
      case 'cmi.core.score._children':
        return 'raw,max,min';
      case 'cmi.core.score.raw':
      case 'cmi.core.score.max':
      case 'cmi.core.score.min':
        break;
      case 'cmi.core.total_time':
        return '0000:00:00.00';
      case 'cmi.core.exit':
      case 'cmi.core.session_time':
      case 'cmi.suspend_data':
        break;
      case 'cmi.launch_data':
        return '';
      case 'cmi.student_preference._children':
        return 'audio';
      case 'cmi.student_preference.audio':
      case 'cmi.student_preference.language':
      case 'cmi.student_preference.speed':
      case 'cmi.student_preference.text':
        key='global';
        break;
      default:
        window.API.error='401';
        break;
    }
    if(window.API.error='0') {
      if(!this.p_suspend_data) {
        this.p_load_suspend_data(); // Suite-Modus: Synchron
      }
      if(!this.p_suspend_data['SCORM'] || (this.p_suspend_data['SCORM']=='undefined')) {
        this.p_suspend_data['SCORM']={};
      }
      if(!this.p_suspend_data['SCORM'][key] || (this.p_suspend_data['SCORM'][key]=='undefined')) {
        this.p_suspend_data['SCORM'][key]={};
      }
      if(set) {
        var ov=this.p_suspend_data['SCORM'][key][property];
        this.p_suspend_data['SCORM'][key][property]=value;
        var ss=false;
        if(('cmi.core.score.raw'==property) && (parseInt(value) || ('0'==value)) && parseInt(this.p_suspend_data['SCORM'][key]['cmi.core.score.max'])) {
          ss=true;
        } else if(('cmi.core.score.max'==property) && (value!=ov) && (parseInt(this.p_suspend_data['SCORM'][key]['cmi.core.score.raw']) || ('0'==this.p_suspend_data['SCORM'][key]['cmi.core.score.max'])) && parseInt(value)) {
          ss=true;
        }
        if(ss) {
          this.p_send_score(Math.round(parseInt(this.p_suspend_data['SCORM'][key]['cmi.core.score.raw'])*this.p_scorm_score_max/parseInt(this.p_suspend_data['SCORM'][key]['cmi.core.score.max'])),this.p_scorm_score_max);
          // alert('Score sent, trigger: '+property);
        }
      } else {
        return ((this.p_suspend_data['SCORM'][key][property] && (this.p_suspend_data['SCORM'][key][property]!='undefined'))?this.p_suspend_data['SCORM'][key][property]:dv);
      }
    }
    return '';
  };

  this.p_scorm_content_api_debug=function(message,property,value,result) {
    var s=message+'('+(property?property:'')+((value || (value===''))?(', \''+value+'\''):'')+');'+((result || (result===''))?(' // => \''+result+'\''):'');
    this.d(s);
    $('#courselet_scorm_content_api_debug').text($('#courselet_scorm_content_api_debug').text()+'\n'+s);
  };

  this.scorm_content_api_initialize_1_2=function() {
    this.courselet.p_scorm_content_api_debug('SCORM_API_Initialize','API','1.2');
    window.API.error='0';
    return 'true';
  };

  this.scorm_content_api_finish=function() {
    this.courselet.p_scorm_content_api_debug('SCORM_API_Finish');
    window.API.error='0';
    this.courselet.p_scorm_content_api_property('cmi.core.entry',true,'resume');
    // this.courselet.scorm_content_api_commit();
    this.courselet.p_scorm_content_api_destruct();
    // this.p_send_score=function(score,max_score);
    return 'true';
  };

  this.scorm_content_api_commit=function() {
    this.courselet.p_scorm_content_api_debug('SCORM_API_Commit');
    window.API.error='0';
    // this.courselet.p_save_suspend_data(100,3); Erst beim Unload der Seite
    return 'true';
  };

  this.scorm_content_api_get_value=function(property) {
    window.API.error='0';
    var value=this.courselet.p_scorm_content_api_property(property);
    this.courselet.p_scorm_content_api_debug('SCORM_API_GetValue',property,null,value);
    return value;
  };

  this.scorm_content_api_set_value=function(property,value) {
    window.API.error='0';
    this.courselet.p_scorm_content_api_debug('SCORM_API_SetValue',property,value);
    this.courselet.p_scorm_content_api_property(property,true,value);
    return 'true';
  };

  this.scorm_content_api_get_last_error=function() {
    window.API.error='0';
    this.courselet.p_scorm_content_api_debug('SCORM_API_GetLastError');
    var error=window.API.error;
    window.API.error='0';
    return error;
  };

  this.scorm_content_api_get_error_string=function(no) {
    window.API.error='0';
    this.courselet.p_scorm_content_api_debug('SCORM_API_GetErrorString');
    return 'No Error';
  };

  this.scorm_content_api_get_diagnostic=function() {
    window.API.error='0';
    this.courselet.p_scorm_content_api_debug('SCORM_API_GetDiagnostic');
    return 'true';
  };


  /***** SCORM API-Wrapper ******/

  this.p_scorm_api=null;

  this.p_scorm_get_api=function(win,i) {
    if(!i) {
      return this.p_scorm_get_api(window,1);
    } else if(win.API) {
      return win.API;
    } else if(i>10) {
      return null;
    } else if((win.parent!=null) && (win.parent!=win)) {
      return this.p_scorm_get_api(win.parent,i+1);
    } else if((win.opener!=null) && (typeof(window.opener)!='undefined')) {
      return this.p_scorm_get_api(win.opener,i+1);
    }
  };

  this.p_scorm_initialize=function() {
   if(!this.p_scorm_api) {
    this.p_scorm_api=this.p_scorm_get_api();
    if(this.p_scorm_api) {
      C.d('SCORM API: LMSInitialize()');
      this.p_scorm_api.LMSInitialize('');
      var t=this.p_scorm_get_value('cmi.core.lesson_status');
      if(!t || (t=='not attempted')) {
        this.p_scorm_set_value('cmi.core.lesson_status','browsed');
      }
      this.p_scorm_set_value('cmi.core.score.min',0);
      this.p_scorm_set_value('cmi.core.score.max',100);
      this.p_scorm_commit();
    } else {
      C.d('SCORM API NOT FOUND.');
    }
   }
  };

  this.p_scorm_finish=function(finish) {
    if(this.p_scorm_api) {
      var i=(this.epoch()-this.p_epoch_page_start);
      this.p_scorm_set_value('cmi.core.session_time',this.to_time_hr(i));
      this.p_scorm_commit();
     if(finish) {
      C.d('SCORM API: LMSFinish()');
      this.p_scorm_api.LMSFinish('');
      this.p_scorm_api=null;
     }
    }
  };

  this.p_scorm_get_value=function(n) {
    if(this.p_scorm_api) {
      return this.p_scorm_api.LMSGetValue(n);
    }
  };

  this.p_scorm_set_value=function(n,v) {
    if(this.p_scorm_api) {
      this.p_scorm_api.LMSSetValue(n,v);
    }
  };

  this.p_scorm_commit=function(n,v) {
    if(this.p_scorm_api) {
      this.p_scorm_api.LMSCommit('');
    }
  };

}

var courselet=new object_courselet();

var courselet_load_page=function(page_id) {
  courselet.load_page(page_id);
};

var courselet_load_page_by_name=function(page_name) {
  courselet.load_page_by_name(page_name);
};

var courselet_reload_page=function() {
  courselet.reload_page();
};

var courselet_get_page_id=function() {
  return courselet.page_id;
};

var courselet_external_callback=function(id,data) {
  return courselet.external_callback(id,data);
};

var courselet_replace_html=function(query,html) {
  courselet.replace_html(query,html);
};

var courselet_audio_recorder_set_buttons=function(a) {
  courselet.audio_recorder.set_buttons(a);
};

// var courselet_unload=function() {
//   courselet.unload();
// };

$(function() {
  courselet.event_document_loaded();
  // courselet.shuffle_test();
});

/*
$(function() {
  $('<div>Test 12</div>').prependTo('#content_inner').on('click',function() {
    location.reload(true);
  });
});
*/

