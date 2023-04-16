chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        chrome.tabs.create({
            url: chrome.runtime.getURL("pages/welcome.html")
        });
    }
    chrome.contextMenus.create({
        id: "dicsearch",
        title: 'ニコニコ大百科で %s を検索',
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    switch (info.menuItemId) {
        case "dicsearch":
            let dicsearchlink = 'https://dic.nicovideo.jp/s/al/t/' + info.selectionText
            chrome.tabs.create({
                url: dicsearchlink
            });
            break;
    }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type == "getThumbUrl") {
        if ( message.smID != null || message.smID != undefined ){
            fetch("https://ext.nicovideo.jp/api/getthumbinfo/" + message.smID, {'method': 'GET'}).then((res) => {
                if( res.ok ) {
                    res.text().then((data) => {
                        sendResponse(data)
                    })
                } else {
                    sendResponse({
                        'status': false,
                        'reason': 'API fetch failed'
                    });
                }
            })
            return true;
        } else {
            sendResponse({
                'status': false,
                'reason': 'smID is not defined'
            });
            return true;
        }
    } else if (message.type == "getRankingXml") {
            fetch("https://www.nicovideo.jp/ranking/genre/all?rss=2.0", {method: 'GET'}).then((res) => {
                if( res.ok ) {
                    res.text().then((data) => {
                        console.log(data)
                        sendResponse(data)
                    })
                } else {
                    sendResponse({
                        'status': false,
                        'reason': 'Page fetch failed'
                    });
                }
            })
            return true;
    } else {
        sendResponse({
            'status': false,
            'reason': 'Invalid type or type is not defined'
        });
        return true;
    }
    //sendResponse({'status': false,'reason': 'Invalid error'});

});