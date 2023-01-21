let manifestData = chrome.runtime.getManifest();
$("#current-version").text ("v" + manifestData.version + " Manifest V" + manifestData.manifest_version)

// button がclickされたときに発火！！！！(前はsubmitだったけど必要ないと思ったのでclickへ)
function saveOptions() {
    console.log(`submit!`)
    // storageに変更を書き込む。
    console.log($("#input-alignpagewidth").prop('checked'))
    chrome.storage.sync.set(
        {
            //"test_var": $("#test-form-input").val,
            //"test_checkbox": $("#checkbox-form-input").prop('checked'),
            // Hide
            "hiderankpagead": $("#input-hiderankpagead").prop('checked'),
            "hideeventbanner": $("#input-hideeventbanner").prop('checked'),
            "hidepopup": $("#input-hidepopup").prop('checked'),
            // Player
            "playertheme": $("#select-playertheme").val(),
            "playerstyleoverride": $("#select-playerstyleoverride").val(),
            // Watchpage
            "replacemarqueetext": $("#input-replacemarqueetext").prop('checked'),
            "highlightlockedtag": $("#input-highlightlockedtag").prop('checked'),
            "watchpagetheme": $("#select-watchpagetheme").val(),
            "usetheaterui": $("#input-usetheaterui").prop('checked'),
            "enablenicoboxui": $("#input-enablenicoboxui").prop('checked'),
            "usenicoboxui": $("#input-usenicoboxui").prop('checked'),
            "enabledlbutton": $("#input-enabledlbutton").prop('checked'),
            // NicoPedia
            "hidereputation": $("#select-hidereputation").val(),
            "liketonicoru": $('#input-liketonicoru').prop('checked'),
            //"dicfullwidth": $("#input-dicfullwidth").prop('checked'),
            //"sidebartoleft": $("#input-sidebartoleft").prop('checked'),
            // Other
            "alignpagewidth": $("#input-alignpagewidth").prop('checked'),
            "highlightnewnotice": $("#input-highlightnewnotice").prop('checked'),
            // Global
            "darkmode": $("#select-darkmode").val(),
            "headerbg": $("#select-headerbg").val(),
            "headercolor": $("#input-headercolor").val(),
            "enableseriesstock": $("#input-enableseriesstock").prop('checked'),
            // Unstable
            "quickvidarticle": $("#input-quickvidarticle").prop('checked')
        }
    );
    let getStorageData = new Promise((resolve) => chrome.storage.sync.get(null, resolve));
    getStorageData.then(restoreOptions, onError)
    console.log(`Saved!:`)
}


// エラー！！！！！
function onError(error) {
    console.log(`Error: ${error}`);
}

// ストレージからHTMLに戻す！！！
function restoreOptions() {
    function setCurrentChoice(result) {
        //$("#test-form-input").val = result.test_var || "hello";
        //$("#checkbox-form-input").prop('checked',result.test_checkbox;
        // Hide
        $("#input-hiderankpagead").prop('checked',result.hiderankpagead);
        $("#input-hideeventbanner").prop('checked',result.hideeventbanner);
        $("#input-hidepopup").prop('checked',result.hidepopup);
        // Player
        $("#select-playertheme").val(result.playertheme || "");
        // TODO: 後回しのためとりあえずDisableに戻す
        $("#select-playerstyleoverride").val("");
        // WatchPage
        $("#input-replacemarqueetext").prop('checked',result.replacemarqueetext);
        $("#input-highlightlockedtag").prop('checked',result.highlightlockedtag);
        $("#select-watchpagetheme").val(result.watchpagetheme || "");
        $("#input-usetheaterui").prop('checked',result.usetheaterui);
        $("#input-enablenicoboxui").prop('checked',result.enablenicoboxui);
        $("#input-usenicoboxui").prop('checked',result.usenicoboxui);
        $("#input-enabledlbutton").prop('checked',result.enabledlbutton);
        // NicoPedia
        $("#select-hidereputation").val(result.hidereputation || "");
        $('#input-liketonicoru').prop('checked',result.liketonicoru)
        //$("#input-dicfullwidth").prop('checked',result.dicfullwidth;
        //$("#input-sidebartoleft").prop('checked',result.sidebartoleft;
        // Other
        $("#input-alignpagewidth").prop('checked',result.alignpagewidth);
        $("#input-highlightnewnotice").prop('checked',result.highlightnewnotice);
        // Global
        $("#select-darkmode").val(result.darkmode || "");
        $("#select-headerbg").val(result.headerbg || "");
        $("#input-headercolor").val(result.headercolor || "#252525");
        $("#input-enableseriesstock").prop('checked',result.enableseriesstock)
        // Unstable
        $("#input-quickvidarticle").prop('checked',result.quickvidarticle);
        if ( result.headerbg != "custom" ) {
            $('#input-headercolor').prop('disabled', true);
        } else {
            $('#input-headercolor').prop('disabled', false);
        }
        console.log(result.alignpagewidth)
    }
    let getStorageData = new Promise((resolve) => chrome.storage.sync.get(null, resolve));
    getStorageData.then(setCurrentChoice, onError)
}

$("#settings-form").on('change',saveOptions);

    document.addEventListener("DOMContentLoaded", restoreOptions);
    //document.querySelector("#settings-form").addEventListener("click", saveOptions);