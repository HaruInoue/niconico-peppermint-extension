// www.nicovideo.jpの全てで実行

    function onError(error) {
        console.log(`Error: ${error}`);
    }
    function appendCSS(cssfile) {
        $('head').append( $('<link>').attr( {'rel': 'stylesheet','href': cssfile} ) );
    }
    var getting = browser.storage.sync.get(null);
    getting.then(createCSSRule, onError);
    function createCSSRule(result) {
        if ( result.darkmode != "" ) {
            appendCSS(browser.runtime.getURL("pagemod/css/darkmode/" + result.darkmode + ".css"));
            appendCSS(browser.runtime.getURL("pagemod/css/darkmode/forall.css"));
            $(function() { 
                appendCSS(browser.runtime.getURL("pagemod/css/darkmode/header.css"))
                appendCSS(browser.runtime.getURL("pagemod/css/darkmode/userpage.css"))
            });
        }
        if ( result.alignpagewidth == true ) {
            appendCSS(browser.runtime.getURL("pagemod/css/other/alignpagewidth.css"));
        }
    }