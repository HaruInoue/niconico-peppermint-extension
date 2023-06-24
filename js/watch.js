getStorageData.then(createCSSRule, onError);
function createCSSRule(result) {
    //console.log(result)

    // TODO: 将来的にbuttonに置き換える
    if (result.quickvidarticle == true) {
        $('.pmbutton-container').append('<div class="vidarticle-container subaction-container"><a id="openvidarticle" class="subaction-button">百</a></div>')
        $('#openvidarticle').on('mouseenter', function () {
            $('.vidarticle-container').append('<span id="vidarticle-text" class="pmui-hinttext">この動画の大百科記事を開く</span>')
        })
        $('#openvidarticle').on('mouseleave', function () {
            $('#vidarticle-text').remove()
        })
        $('#openvidarticle').on('click', function (e) {
            $(e.target).attr({
                href: "https://dic.nicovideo.jp/v/" + location.pathname.slice(7)
            })
        });

    }

    if (result.enabledlbutton == true) {
        $('.pmbutton-container').append('<div class="downloadvideo-container subaction-container"><a id="downloadvideo" class="material-icons subaction-button" target="_blank" rel="noopener noreferrer">download</a></div>')
        if (location.pathname.slice(7, 9) != "so") {
            $('#downloadvideo').on('mouseenter', function () {
                $('.downloadvideo-container').append('<span id="downloadvideo-text" class="pmui-hinttext">動画をダウンロード</span>')
            })
            $('#downloadvideo').on('mouseleave', function () {
                $('#downloadvideo-text').remove()
            })
            $('#downloadvideo').on('click', setDownloadButton);
            function setDownloadButton(e) {
                // 誤爆防止のために、一回目は行われたクリック操作をなかったことにする
                if ($(e.target).attr('href') == undefined) {
                    e.preventDefault();
                }
                // videoのsrcを取得する
                let videourl = $('.MainVideoPlayer video').attr('src');
                // ロード前にクリックされるかもしれないので、undefinedだったら蹴る
                if (videourl == undefined || videourl == "" || videourl == null) {
                    $('#downloadvideo-text').text('ダウンロードリンクの設定に失敗しました')
                } else if (videourl.startsWith('blob:')) {
                    $('#downloadvideo-text').text('視聴方式をHTTPに変更してください')
                } else {
                    $('#downloadvideo-text').text('もう一度クリックしてダウンロード')
                    $('#downloadvideo').css({
                        'background': '#4caf50',
                        'color': '#fff',
                        'transition': 'all .1s'
                    })
                    // hrefを設定
                    // Downloadは書いてるけどクロスオリジン関係で動かないっぽい
                    $(e.target).attr({
                        download: location.pathname.slice(7) + ".mp4",
                        href: videourl
                    })
                }
            }
        } else {
            $('#downloadvideo').addClass('disabled')
            $('#downloadvideo').text('file_download_off')
            $('#downloadvideo').on('mouseenter', function () {
                $('.downloadvideo-container').append('<span id="downloadvideo-text" class="pmui-hinttext">この動画はダウンロードできません</span>')
            })
            $('#downloadvideo').on('mouseleave', function () {
                $('#downloadvideo-text').remove()
            })
        }
    }
    if (result.usetheaterui == true && result.usenicoboxui != true) {
        let fullsize = false
        $('.pmbutton-container').append('<div class="togglefullsize-container subaction-container"><a id="togglefullsize" class="material-icons-outlined subaction-button">width_full</a></div>')
        $('#togglefullsize').on('mouseenter', function () {
            $('.togglefullsize-container').append('<span id="togglefullsize-text" class="pmui-hinttext">21:9で拡大</span>')
        })
        $('#togglefullsize').on('mouseleave', function () {
            $('#togglefullsize-text').remove()
        })
        $('#togglefullsize').on('click', setFullsize);
        function setFullsize(e) {
            fullsize = !fullsize
            if (fullsize == true) {
                addCSS(chrome.runtime.getURL("pagemod/css/theater_21_9_full.css"), `link[href="${chrome.runtime.getURL("pagemod/css/theater_video.css")}"]`)
                $('#togglefullsize').css({
                    'background': '#0288d1',
                    'color': '#fff',
                    'transition': 'all .1s'
                })
            } else {
                removeCSS(chrome.runtime.getURL("pagemod/css/theater_21_9_full.css"))
                $('#togglefullsize').css({
                    'background': '#ccc',
                    'color': '#222',
                    'transition': 'all .1s'
                })
            }
        }
    }
    if (result.enablenicoboxui == true) {
        $('.pmbutton-container').append('<div class="togglenicobox-container"><button id="togglenicobox" class="material-icons mainaction-button">headphones</button></div>')
        if (result.usenicoboxui != true) {
            $('#togglenicobox').css({
                'background': '#d85353'
            })
        } else {
            $('#togglenicobox').css({
                'background': '#555'
            })
            $('#togglenicobox').text('video_library')
        }
        $('#togglenicobox').on('mouseenter', function () {
            $('.togglenicobox-container').append('<span id="togglenicobox-text" class="pmui-hinttext">Nicoboxへ切り替え</span>')
            if (result.usenicoboxui == true) {
                $('#togglenicobox-text').text('通常プレイヤーへ戻る')
            }
        })
        $('#togglenicobox').on('mouseleave', function () {
            $('#togglenicobox-text').remove()
        })
        $('#togglenicobox').on('click', ToggleNicobox);
        function ToggleNicobox() {
            //console.log(`Nicobox Toggled!!! ${result.usenicoboxui}`)
            chrome.storage.sync.set({ "usenicoboxui": !result.usenicoboxui, "nicoboxuichanged": true });
            $('.togglenicobox-container').css('height', '52px')
            $('#togglenicobox').css({
                'width': '250vw',
                'height': '250vh',
                'transition': 'width 0.25s ease, height 0.25s ease, background-color 0.25s ease',
                'position': 'fixed',
                'left': '-12px',
                'bottom': '36px',
                'transform': 'translate(-50%, 50%)',
                'z-index': '10000000',
                'border-radius': '250vw',
                'background-color': 'var(--bgcolor1)'
            })
            $('#CommonHeader').css({
                'transform': 'translate(0, -100%)',
                'transition': 'transform 0.1s ease',
            })
            setTimeout(function () {
                location.reload()
            }, 250)
        }
    }

    if (result.highlightlockedtag == true) {
        if (result.watchpagetheme == "harazyuku" && result.usenicoboxui != true && result.usetheaterui != true) {
            pushCSSRule('.TagItem.is-locked{border-bottom: 2px solid #ffd794;}')
        } else {
            pushCSSRule('.TagItem.is-locked{border: 1px solid #ffd794;}')
        }

    }
    if (result.hideeventbanner == true) {
        $('.WakutkoolNoticeContainer, .WakutkoolFooterContainer, .WakutkoolHeaderContainer-image').remove()
    }
    if (result.commentrow != 1) {
        $('.CommentPostContainer').css('height', `${32 * result.commentrow}px`)
        $('.CommentPostContainer-commandInput .CommentCommandInput, .CommentPostContainer-commentInput .CommentInput, .CommentPostButton.ActionButton').css('height', `${28 * result.commentrow}px`)
    }

    if (result.hidesupporterbutton == "watch" || result.hidesupporterbutton == "all") {
        addCSS(chrome.runtime.getURL("pagemod/css/other/hidesupporter.css"))
    }

    if (result.cleanvidowner) {
        $('.VideoOwnerInfo .FollowButton,.VideoOwnerInfo-linkButtons').remove()
        $('.VideoOwnerInfo-links').css({
            'position': 'relative',
            'top': '6px',
        })
    }
    if (result.hidemetadata == "watch" || result.hidemetadata == "all") {
        pushCSSRule('.VideoOwnerInfo-gridCell,.VideoViewCountMeta,.CommentCountMeta,.MylistCountMeta,.GenreRankMeta {display:none;}')
    }

    if (result.shortcutassist) {
        async function cmdACT(cmdstr) {
            // return -1 = ERROR | 0 = SUCCESS | 1 = SUCCESS with external flag | 2 = SUCCESS with external output
            const commandstr = cmdstr
            let runresult = 0
            let runresultstr = ``
            if (commandstr.startsWith('fw/')) {
                location.href = "https://www.nicovideo.jp/search/" + commandstr.slice(2)
            } else if (commandstr.startsWith('ft/')) {
                location.href = "https://www.nicovideo.jp/tag/" + commandstr.slice(3)
            } else if (commandstr.startsWith('w/')) {
                location.href = "https://www.nicovideo.jp/watch/" + commandstr.slice(2)
            } else if (commandstr == ":p") {
                document.querySelector('.PlayerPauseButton, .PlayerPlayButton').click();
                document.querySelector(':focus-visible').blur();
            } else if (commandstr == ":>") {
                document.querySelector('.PlayerSkipNextButton').click();
                document.querySelector(':focus-visible').blur();
            } else if (commandstr == ":<") {
                document.querySelector('.SeekToHeadButton').click();
                document.querySelector(':focus-visible').blur();
            } else if (commandstr == ":l") {
                document.querySelector('.LikeActionButton').click();
                document.querySelector(':focus-visible').blur();
            } else if (commandstr == ":r") {
                document.querySelector('.PlayerRepeatOnButton, .PlayerRepeatOffButton').click();
                document.querySelector(':focus-visible').blur();
            } else if (commandstr == ":oc") {
                document.querySelector('.PlayerPanelContainer-tabItem:first-child').click();
                document.querySelector(':focus-visible').blur();
            } else if (commandstr == ":op") {
                document.querySelector('.PlayerPanelContainer-tabItem:last-child').click();
                document.querySelector('.PlayerPanelContainer-content').focus()
            } else if (commandstr == ":top") {
                location.href = "https://www.nicovideo.jp/video_top"
            } else if (commandstr == "-nbu") {
                chrome.storage.sync.set({ "usenicoboxui": !result.usenicoboxui, "nicoboxuichanged": true });
                location.reload()
            } else if (commandstr == "-tar") {
                chrome.storage.sync.set({ "usetheaterui": !result.usetheaterui});
                location.reload()
            } else if (commandstr == "-cts") {
                runresult = -1
                if (result.enableseriesstock == true && document.querySelector('.SeriesBreadcrumbs-title') != null) {
                    if ( await manageSeriesStock(document.querySelector('.SeriesBreadcrumbs-title').href.slice(32), document.querySelector('.SeriesBreadcrumbs-title').textContent) ) {
                        runresult = 2
                        runresultstr = `SUCCESS(ADDED)`
                    } else {
                        runresult = 2
                        runresultstr = `SUCCESS(REMOVED)`
                    }
                }
            } else if (commandstr == "help" || commandstr == "HELP" || commandstr == "Help") {
                runresult = 2
                runresultstr = `PEPPERMINT EXSHORTCUT COMMANDER v0.1<br>
                PepperMint ExShortcut Commanderは、マウス無しで視聴ページの操作を行うコマンダーです。BackSpaceキーを押して開きます。<br>
                fw/<検索ワード> = キーワード検索を行います。<br>
                ft/<検索ワード> = タグ検索を行います。<br>
                w/<動画ID> = 指定された動画IDに移動します。<br>
                :p = 動画の再生/一時停止をトグルします。<br>
                :> = 次の動画に移動します。<br>
                :< = 先頭にシークします。<br>
                :l = "いいね！"をトグルします。<br>
                :r = リピート再生をトグルします。<br>
                :oc = "コメントリスト"タブを開きます。<br>
                :op = "動画リスト"タブを開きます。<br>
                :top = 動画トップに戻ります。<br>
                -nbu = Nicobox風UIをトグルします。<br>
                -tar = シアターUIをトグルします。<br>
                -cts = シリーズストックが有効化されている場合に、ストックへの追加をトグルします。`

            } else {
                runresult = -1
            }
            return {"result": runresult,"resultstr": runresultstr}
        }
        function commanderKeyEvent(e) {
            if (e.key === 'Enter') {
                cmdACT(document.getElementById('pm-vicommander').value).then(actresult => {
                    if ( actresult.result == 2) {
                        $('.pmbutton-container').append(`<div class="pm-viCommanderOutput">${actresult.resultstr}</div>`)
                        setTimeout(function() {
                            document.querySelector('.pm-viCommanderOutput').remove()
                        },4000)
                    } else if ( actresult.result == 1 || actresult.result == 0) {
                        $('.pmbutton-container').append(`<div class="pm-viCommanderOutput">SUCCESS(${actresult.result})</div>`)
                        setTimeout(function() {
                            document.querySelector('.pm-viCommanderOutput').remove()
                        },4000)
                    } else {
                        $('.pmbutton-container').append('<div class="pm-viCommanderError">ERROR: Unknown Command.</div>')
                        setTimeout(function() {
                            document.querySelector('.pm-viCommanderError').remove()
                        },4000)
                    }
                })
                document.querySelector('.pm-viCommanderContainer').remove()
            }
        }
        function openViCommander() {
            if (document.querySelector('.pm-viCommanderContainer') != null) {
                document.querySelector('.pm-viCommanderContainer').remove()
            } else {
                $('.pmbutton-container').append(`<div class="pm-viCommanderContainer"><input id="pm-vicommander" placeholder="exCommander(Press ENTER to submit, type 'HELP' to help)"></input></div>`)
                document.getElementById('pm-vicommander').focus()
                document.getElementById('pm-vicommander').addEventListener('keypress', commanderKeyEvent);
            }
            
        }
        $(document).on('keydown', shortCutAction);

        function shortCutAction(e) {
            if ((e.key === ' ' || e.key === '　') && !$(e.target).closest("input, textarea").length) {
                document.querySelector('.PlayerPauseButton, .PlayerPlayButton').click();
                document.querySelector(':focus-visible').blur();
                return false;
            } else if ((e.key === 'ArrowLeft') && !$(e.target).closest("input, textarea").length) {
                document.querySelector('.PlayerSeekBackwardButton').click();
                document.querySelector(':focus-visible').blur();
                return false;
            } else if ((e.key === 'ArrowRight') && !$(e.target).closest("input, textarea").length) {
                document.querySelector('.PlayerSeekForwardButton').click();
                document.querySelector(':focus-visible').blur();
                return false;
            } else if ((e.key === 'c' || e.key === 'C') && !$(e.target).closest("input, textarea").length) {
                document.querySelector('.CommentInput-textarea').focus();
                return false;
            } else if ((e.key === 'h' || e.key === 'H') && !$(e.target).closest("input, textarea").length) {
                document.querySelector('.LikeActionButton').click();
                document.querySelector(':focus-visible').blur();
                return false;
            } else if ((e.key === 'Backspace') && !$(e.target).closest("input, textarea").length) {
                openViCommander()
                return false;
            } 
        }
    }
    if (result.darkmode != "" && result.darkmode != undefined && !(result.darkmodedynamic == true && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        pushCSSRule(`.IchibaForWatch {
        background: var(--bgcolor2) !important;
    }
    .IchibaMain_Container .IchibaBalloon {
        background: var(--bgcolor3);
    }
    .IchibaMain_Container .IchibaBalloon::after {
        border-top: 16px solid #555;
    }
    .IchibaForWatch_Title_Body,.IchibaSuggest_Title {
        color: #fafafa;
    }
    .IchibaMainItem_Info,.IchibaSuggestItem_Info_Shop {
        color: var(--textcolor2);
    }
    .IchibaMainItem_Price_Number,.IchibaSuggestItem_Price_Number {
        color: var(--textcolor3);
    }
    .IchibaMainItem_Name,.IchibaSuggestItem_Name {
        color: #8fb9df;
    }
    .IchibaSuggestItem {    
        border: 1px solid var(--accent2);
    }`)
    }

    /*
    $(document).on('mousemove', function(e) {
        window.cursorX = e.pageX;
        window.cursorY = e.pageY;
    });*/
    if (result.usenicoboxui != true && result.usetheaterui != true) {
        if (result.usenicoboxui != true && result.usetheaterui != true && result.darkmode != "" && result.darkmode != undefined && !(result.darkmodedynamic == true && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)) {
            addCSS(chrome.runtime.getURL("pagemod/css/darkmode/watch.css"));
            if (result.watchpagetheme != "") {
                addCSS(chrome.runtime.getURL("pagemod/css/darkmode/watchpagetheme/" + result.watchpagetheme + ".css"), true, `link[href="${chrome.runtime.getURL("pagemod/css/darkmode/watch.css")}"]`, 'after');
            }
        }
        if (result.playertheme != "") {
            //console.log(`CSS Loaded!`);
            if (result.playertheme == "rc1" || result.playertheme == "rc1plus") {
                addCSS(chrome.runtime.getURL("pagemod/css/playertheme/rc1.css"));
            } else {
                addCSS(chrome.runtime.getURL("pagemod/css/playertheme/" + result.playertheme + ".css"));
            }

            if (result.playertheme == "harazyuku") {
                let lastbuttonwidth = (($(".ControllerContainer-area:last-child").length - 1) * 32) + 64
                if (lastbuttonwidth - 172 != 0) {
                    //$('.VolumeBarContainer').css('right', 165 + (lastbuttonwidth - 172) )
                }
                //
                //$('.MuteVideoButton,.UnMuteVideoButton').css('right', lastbuttonwidth)
            }
            if (result.playerstyleoverride != "") {
                if (result.playerstyleoverride != "none") {
                    addCSS(chrome.runtime.getURL("pagemod/css/playerstyle/" + result.playerstyleoverride + ".css"))
                }
                if (result.playertheme == "mint" && result.playerstyleoverride == "mint") {
                    pushCSSRule('.PlayerPauseButton,.PlayerPlayButton {background-image: linear-gradient(#232323,#171717);outline: 1px solid #1c1c1c;outline-offset: -1px;height: 34px;}.PlayerPauseButton:hover,.PlayerPlayButton:hover {background-image: linear-gradient(#2a2a2a,#1b1b1b);}.ControllerButton svg {filter: drop-shadow(0px 0px 2px rgba(0,0,0 50%)) ;}.ControllerButton:hover svg {fill:#ffffff;filter: drop-shadow(0px 0px 2px rgba(128,128,128 100%));transition:all .1s ease .1s}')
                }
                if (result.playerstyleoverride == "harazyuku" && result.playertheme != "harazyuku") {
                    pushCSSRule('.ControllerButton {top: 5px;}')
                }
                if (result.playertheme == "mint" && result.playerstyleoverride == "harazyuku") {
                    pushCSSRule('.PlayerPauseButton,.PlayerPlayButton{left: 5px}.SeekToHeadButton{left: 10px}.PlayerSeekBackwardButton{left: 15px}.MuteVideoButton,.UnMuteVideoButton {right: 95px;}')
                }
                if (result.playertheme == "harazyuku" && result.playerstyleoverride != "harazyuku") {
                    pushCSSRule('.ControllerContainer-inner { top:-3px; }.SeekBarContainer {padding-left: 120px;padding-right: 455px;}.PlayerPlayTime { right:350px; } .VolumeBarContainer { top:4px; } .PlayerRepeatOnButton,.PlayerRepeatOffButton {padding: 8px 6px !important;}')
                }
                if (result.playertheme == "harazyuku" && result.playerstyleoverride == "mint") {
                    pushCSSRule('.ControllerContainer-inner { top:-1px; } .VolumeBarContainer { top:2px; } .PlaybackRateButton,.PlayerPlayTime { top: -2px; } .PlayerRepeatOffButton {padding: 6px 4px !important;}')
                }
                if (result.playertheme == "harazyuku" && result.playerstyleoverride == "rc1") {
                    pushCSSRule('.PlayerRepeatOffButton,.PlayerRepeatOnButton {padding: 2px 2px !important;} .SeekBarContainer {padding-left: 105px;padding-right: 455px;}')
                }
                if (result.playertheme == "harazyuku" && result.playerstyleoverride == "harazyuku") {
                    pushCSSRule('.PlayerRepeatOnButton,.PlayerRepeatOffButton,.CommentOnOffButton,.EnableFullScreenButton,.DisableFullScreenButton,.PlayerOptionButton {background:transparent;outline: 0px;border:0px;padding:2px;} .PlaybackRateButton { padding-top: 0px; } .PlayerPlayTime { line-height: 24px; }')
                }
                if (result.playertheme == "ginza" && result.playerstyleoverride == "harazyuku") {
                    pushCSSRule(`.PlayerPlayButton,.PlayerPauseButton {
                        left: 2px
                    }
                    .MuteVideoButton, .UnMuteVideoButton {
                        right: 255px
                    }
                    .VolumeBarContainer {
                        right: 155px
                    }
                    .SeekToHeadButton {
                        left: 6px;
                    }
                    .PlayerSeekBackwardButton {
                        left: 10px;
                    }
                    .PlayerSeekForwardButton {
                        left: 14px;
                    }
                    .PlayerSkipNextButton {
                        left: 18px;
                    }
                    .PlayerPlayTime {
                        left: 155px;
                    }
                    .ControllerButton {
                        top: 6px;
                    }
                    `)
                }
                if (result.playertheme == "mint" && (result.playerstyleoverride == "rc1" || result.playerstyleoverride == "rc1dark")) {
                    pushCSSRule(`.PlayerPlayButton,.PlayerPauseButton {
                        left: 2px;
                    }
                    .SeekToHeadButton {
                        left: 6px;
                    }
                    .PlayerSeekBackwardButton {
                        left: 10px;
                    }
                    .PlayerPlayTime,.PlayerPlayTime-duration {
                        background-image: none;
                        border: 0px solid #000;
                    }
                    .ControllerContainer-area:last-child {
                        background-image: linear-gradient(#aaa, #959595);
                        box-shadow: 0px 0px 5px rgba(0,0,0,0.5);
                    }
                    `)
                }
                if (result.playertheme == "mint" && result.playerstyleoverride == "rc1") {
                    pushCSSRule(`
                    .PlayerPlayTime,.PlayerPlayTime-duration {
                        color: #000;
                        text-shadow: 0px 0px 0px #000;
                    }
                    `)
                }
                if (result.playertheme != "rc1" && (result.playerstyleoverride == "rc1" || result.playerstyleoverride == "rc1dark")) {
                    pushCSSRule(`.PlayerPlayButton,.PlayerPauseButton {
                        top:-2px !important;
                        z-index:999999;
                    }`)
                }
            } else {
                if (result.playertheme == "rc1" || result.playertheme == "rc1plus") {
                    addCSS(chrome.runtime.getURL("pagemod/css/playerstyle/rc1.css"));
                } else {
                    addCSS(chrome.runtime.getURL("pagemod/css/playerstyle/" + result.playertheme + ".css"));
                }
                if (result.playertheme == "mint") {
                    pushCSSRule('.PlayerPauseButton,.PlayerPlayButton {background-image: linear-gradient(#232323,#171717);outline: 1px solid #1c1c1c;outline-offset: -1px;height: 34px;}.PlayerPauseButton:hover,.PlayerPlayButton:hover {background-image: linear-gradient(#2a2a2a,#1b1b1b);}.ControllerButton svg {filter: drop-shadow(0px 0px 2px rgba(0,0,0 50%)) ;}.ControllerButton:hover svg {fill:#ffffff;filter: drop-shadow(0px 0px 2px rgba(128,128,128 100%));transition:all .1s ease .1s}')
                }
                if (result.playertheme == "harazyuku") {
                    pushCSSRule('.PlayerRepeatOnButton,.PlayerRepeatOffButton,.CommentOnOffButton,.EnableFullScreenButton,.DisableFullScreenButton,.PlayerOptionButton {background:transparent;outline: 0px;border:0px;padding:2px;} .PlaybackRateButton { padding-top: 0px; } .PlayerPlayTime { line-height: 24px; }')
                }
            }
            if (result.playertheme == "rc1" || result.playertheme == "rc1plus") {
                let centeroffset = 0
                let volumeoffset = 0
                if (result.playertheme == "rc1") {
                    centeroffset = -20
                    volumeoffset = 15
                    pushCSSRule(`.PlayerRepeatOnButton,.PlayerRepeatOffButton,.CommentOnOffButton,.EnableFullScreenButton,.DisableFullScreenButton,.PlayerOptionButton {
                        background:transparent;
                        border: 0px;
                    }
                    .ControllerButton.PlayerRepeatOnButton svg path,.CommentOnOffButton svg,.EnableFullScreenButton svg,.DisableFullScreenButton svg,.PlayerOptionButton svg,.PlaybackRateButton svg  {
                        fill: #494949 !important;
                    }
                    .PlayerSkipNextButton {
                        display:none;
                    }
                    .VolumeBarContainer {
                        width: 66px;
                    }
                    .VolumeBarContainer {
                        position: absolute;
                        right: ${195 + volumeoffset}px;
                    }
                    .PlayerRepeatOnButton,.PlayerRepeatOffButton,.CommentOnOffButton,.EnableFullScreenButton,.PlayerOptionButton {
                        margin-right: 8px;
                        height:30px;
                        width:30px;
                    }
                    .PlayerRepeatOnButton,.PlayerRepeatOffButton,.CommentOnOffButton,.EnableFullScreenButton,.DisableFullScreenButton,.PlayerOptionButton {
                        top:3px;
                        padding:3px !important;
                    }
                    `)

                }
                pushCSSRule(`
                .VolumeBarContainer {
                    position: absolute;
                    right: ${185 + volumeoffset}px;
                }
                .MuteVideoButton,.UnMuteVideoButton {
                    position: absolute !important;
                    right: ${275 + volumeoffset}px;
                }
                .PlayerSkipNextButton {
                    position: absolute !important;
                    right: ${310 + centeroffset}px;
                }
                .PlayerSeekForwardButton {
                    position: absolute !important;
                    right: ${343 + centeroffset}px;
                }
                .PlayerPlayTime {
                    position:absolute;
                    right: ${380 + centeroffset}px;
                }
                .SeekBarContainer {
                    padding-left: 113px;
                    padding-right: ${486 + centeroffset}px;
                    padding-top: 0px;
                    position: relative;
                    height:1px
                }
                `)
            }
            if (result.playertheme == "rc1" && result.playerstyleoverride == "rc1dark") {
                pushCSSRule(`.ControllerButton.PlayerRepeatOnButton svg path,.CommentOnOffButton svg,.EnableFullScreenButton svg,.DisableFullScreenButton svg,.PlayerOptionButton svg,.PlaybackRateButton svg  {
                    fill: #aaa !important;
                }`)
            }
            if (result.playertheme == "rc1" && result.playerstyleoverride == "harazyuku") {
                pushCSSRule(`.ControllerButton.PlayerRepeatOnButton svg path,.CommentOnOffButton svg,.EnableFullScreenButton svg,.DisableFullScreenButton svg,.PlayerOptionButton svg,.PlaybackRateButton svg  {
                    fill: #fff !important;
                }
                .PlayerRepeatOnButton,.PlayerRepeatOffButton,.CommentOnOffButton,.EnableFullScreenButton,.DisableFullScreenButton,.PlayerOptionButton {
                    outline: none;
                }
                `)
            }
        }
        if (result.hidepopup == true) {
            // cssじゃないとロードの都合で反映されなかった
            //$('.FollowAppeal,.SeekBarStoryboardPremiumLink-content,.PreVideoStartPremiumLinkContainer').css('display','none')
            addCSS(chrome.runtime.getURL("pagemod/css/hide/hidepopup.css"));
        }
        /*if (result.replacemarqueecontent == "logo") {
            addCSS(chrome.runtime.getURL("pagemod/css/hide/replacemarqueetext.css"));
        }*/
        if (result.watchpagetheme != "") {
            //console.log(`CSS Loaded!`);
            addCSS(chrome.runtime.getURL("pagemod/css/watchpagetheme/" + result.watchpagetheme + ".css"));
        }
    } else if (result.usenicoboxui == true && result.useoldnicoboxstyle != true) {
        // New Nicobox UI
        if (result.darkmode != "" && result.darkmode != undefined && !(result.darkmodedynamic == true && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)) {
            addCSS(chrome.runtime.getURL("pagemod/css/darkmode/watch.css"));
            pushCSSRule(`.ControllerButton svg,.ControllerButton.PlayerRepeatOnButton svg path,.PlaybackRateButton svg {
                fill: #fff
            }`)
            $('html').css({
                '--nb-bgcolor': 'var(--bgcolor1)'
            })
        } else {
            $('html').css({
                '--nb-bgcolor': '#f6f6f6'
            })
        }
        addCSS(chrome.runtime.getURL("pagemod/css/nicobox-new.css"));
        $('body').css('background-color', '#fefefe')
        // 基本レイアウト変更
        pushCSSRule('.MainContainer-floatingPanel {position: fixed;right: 0;bottom: 0;top: 44px;z-index: 500;}')

        $(function () {
            chrome.runtime.sendMessage({ "type": "getThumbUrl", "smID": location.pathname.slice(7) }).then(res => {
                // why chrome can't use domparser in service worker...
                //console.log(res)
                let domparser = new DOMParser()
                let parsedxml = domparser.parseFromString(res, "text/xml");
                //console.log(parsedxml)
                let thumburl = parsedxml.querySelector("thumbnail_url").textContent
                $('html').css({
                    '--thumburl': "url(" + thumburl + ")",
                })
            })
            $('.VideoMetaContainer .VideoViewCountMeta').on('DOMSubtreeModified propertychange', function () {
                chrome.runtime.sendMessage({ "type": "getThumbUrl", "smID": location.pathname.slice(7) }).then(res => {
                    //console.log(res)
                    let domparser = new DOMParser()
                    let parsedxml = domparser.parseFromString(res, "text/xml");
                    //console.log(parsedxml)
                    let thumburl = parsedxml.querySelector("thumbnail_url").textContent
                    $('html').css({
                        '--thumburl': "url(" + thumburl + ")",
                    })
                })
            });
            $('.SeekBar').before($('.PlayerPlayTime-playtime'));
            $('.SeekBar').after($('.PlayerPlayTime-duration'));
            /*
            $('.MainContainer-player').css({
                'width': '100%'
            })
            $('.MainContainer-playerPanel').css({
                'position': 'fixed',
                'top': '36px',
                'height': 'calc( 100% - 72px )',
                'background': 'transparent',
            })
            $('.VideoContainer').css({
                'background': 'transparent',
                'margin': 'auto',
                'overflow': 'visible'
            })*/
            // cssは後から読み込まれるせいで.css()が使えないものに対してのみ使う
            // かつてヘッダーだったもの(動画情報)
            $('.HeaderContainer-row > .GridCell.col-full').removeClass('col-full')/*
            $('.VideoTitle').css('color', '#10101f')
            $('.VideoDescriptionExpander .VideoDescriptionExpander-switchExpand').css('background', 'linear-gradient(90deg,hsla(0,0%,96%,0),#f6f6f6 16%)')
            $('.HeaderContainer-searchBox').css({
                'position': 'fixed',
                'bottom': '0',
                'right': '0'
            })
            $('.SearchBox-input').css('width', '335px')
            $('.SearchBox').css('width', '382px')*/
            $('.SearchBox-optionDown').text('▲')
            /*$('.HeaderContainer').css({
                'width': '100%',
                'padding': '16px 64px 128px',
            })
            $('.HeaderContainer-topArea').css('text-align', 'center')
            $('.HeaderContainer-row .GridCell:last-child').css({
                'width': 'fit-content',
                'display': 'flex'
            })
            $('.HeaderContainer-row').css({
                'width': 'fit-content',
                'display': 'flex',
                'margin': '12px auto'
            })
            $('.VideoOwnerInfo').css({
                'position': 'absolute',
                'right': '0'
            })
            // vid
            $('.MainVideoPlayer video').css({
                'width': 'auto',
                'margin': 'auto',
                'box-shadow': '0px 0px 10px rgba(0,0,0,0.8)'
            })
            // プレイヤー
            //$('.PlayerContainer,.ControllerBoxContainer').css('background-color','transparent')
            $('.VideoDescriptionContainer').css({
                'margin': '0 auto'
            })
            $('.SeekBar').css({
                'margin': 'auto 0'
            })
            $('.PlayerPlayTime-playtime, .PlayerPlayTime-duration').css({
                'margin': 'auto 10px'
            })
            $('.ControllerBoxContainer').css({
                'margin-top': '8px',
                'padding': '0 128px'
            })
            $('.ControllerContainer').css({
                'height': '48px'
            })
            $('.EasyCommentContainer').css(
                'height', 'auto'
            )
            $('.SeekBarContainer').css({
                'padding': '8px 16px 0',
                'display': 'flex'
            })
            $('.PlayerPlayTime').css({
                'width': '40px',
            })
            $('.SeekBar-buffered').css('background-color', '#666')
            $('.ControllerBoxCommentAreaContainer, .EasyCommentContainer').css('background', 'transparent')
            $('.CommentOnOffButton').css('display', 'none')
            $('.SeekBar-buffered').css('background-color', '#666')
            $('.ControllerContainer').css('z-index', '3')*/
            // 不要な要素の削除
            $('.MainContainer-marquee, .ControllerBoxCommentAreaContainer, .CommentRenderer, .PlayerPlayTime-separator,.BottomContainer,.EasyCommentContainer-buttonBox').remove();
            window.scroll({ top: 0, behavior: 'smooth' });
            if (result.darkmode != "" && result.darkmode != undefined && !(result.darkmodedynamic == true && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                pushCSSRule(`
                    .VideoDescriptionExpander .VideoDescriptionExpander-switchExpand {background: linear-gradient(90deg,hsla(0,0%,96%,0),var(--bgcolor1) 16%)}
                    .SeekBar-played, .SeekBarHandle-handle, .VolumeBar-progress { background-color: #fff}
                    .VideoTitle {color: var(--textcolor1)}
                `)
            } else {
                pushCSSRule(`
                .HeaderContainer {
                    background: #f6f6f6
                }
                .PlayerPlayTime {
                    color: #1d2128
                }
                .SeekBar-played, .SeekBarHandle-handle, .VolumeBar-progress {
                    background-color: #22f5dc
                }
                .VideoTitle {
                    color: #10101f
                }
                `)
            }
        });
    } else if (result.usenicoboxui == true && result.useoldnicoboxstyle == true) {
        // Nicobox UI
        if (result.darkmode != "" && result.darkmode != undefined && !(result.darkmodedynamic == true && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)) {
            addCSS(chrome.runtime.getURL("pagemod/css/darkmode/watch.css"));
            pushCSSRule(`.ControllerButton svg,.ControllerButton.PlayerRepeatOnButton svg path,.PlaybackRateButton svg {
                fill: #fff
            }`)
        }
        addCSS(chrome.runtime.getURL("pagemod/css/nicobox.css"));
        $('body').css('background-color', '#fefefe')
        // 基本レイアウト変更
        //nicobox.cssに移動
        pushCSSRule('.MainContainer-floatingPanel {position: fixed;right: 0;bottom: 0;top: 44px;z-index: 500;}')

        $(function () {
            $('.SeekBar').before($('.PlayerPlayTime-playtime'));
            $('.SeekBar').after($('.PlayerPlayTime-duration'));
            // cssは後から読み込まれるせいで.css()が使えないものに対してのみ使う
            // かつてヘッダーだったもの(動画情報)
            $('.HeaderContainer-row > .GridCell.col-full').removeClass('col-full')
            $('.SearchBox-optionDown').text('▲')
            /*
            $('.VideoTitle').css('color', '#d85353')
            $('.VideoDescriptionExpander .VideoDescriptionExpander-switchExpand').css('background', 'linear-gradient(90deg,hsla(0,0%,96%,0),#fefefe 16%)')
            $('.HeaderContainer-searchBox').css({
                'position': 'fixed',
                'bottom': '0',
                'right': '0'
            })
            $('.SearchBox-input').css('width', '335px')
            $('.SearchBox').css('width', '382px')
            
            $('.HeaderContainer').css({
                'width': '100%',
                'padding': '16px 64px 128px',
                'margin': '0 0 240px'
            })
            $('.HeaderContainer-topArea').css('text-align', 'center')
            $('.HeaderContainer-row .GridCell:last-child').css({
                'width': 'fit-content',
                'display': 'flex'
            })
            $('.HeaderContainer-row').css({
                'width': 'fit-content',
                'display': 'flex',
                'margin': 'auto auto 12px'
            })
            $('.VideoOwnerInfo').css({
                'position': 'absolute',
                'right': '0'
            })
            // vid
            $('.MainVideoPlayer video').css({
                'width': 'auto',
                'margin': 'auto',
                'box-shadow': '0px 0px 10px rgba(0,0,0,0.8)'
            })
            // プレイヤー
            //$('.PlayerContainer,.ControllerBoxContainer').css('background-color','transparent')
            $('.VideoDescriptionContainer').css({
                'margin': '0 auto'
            })
            $('.SeekBar').css({
                'margin': 'auto 0'
            })
            $('.PlayerPlayTime-playtime, .PlayerPlayTime-duration').css({
                'margin': 'auto 10px'
            })
            $('.ControllerBoxContainer').css({
                'margin-top': '8px',
                'padding': '0 128px'
            })
            $('.ControllerContainer').css({
                'height': '48px'
            })
            $('.EasyCommentContainer').css(
                'height', 'auto'
            )
            $('.SeekBarContainer').css({
                'padding': '8px 16px 0',
                'display': 'flex'
            })
            $('.PlayerPlayTime').css({
                'width': '40px',
            })
            $('.SeekBar-buffered').css('background-color', '#666')
            $('.ControllerBoxCommentAreaContainer, .EasyCommentContainer').css('background', 'transparent')
            $('.CommentOnOffButton').css('display', 'none')
            $('.SeekBar-played, .SeekBarHandle-handle').css('background-color', '#d85353')
            $('.SeekBar-buffered').css('background-color', '#666')
            $('.ControllerContainer').css('z-index', '3')
            */
            // 不要な要素の削除
            $('.MainContainer-marquee, .ControllerBoxCommentAreaContainer, .CommentRenderer, .PlayerPlayTime-separator,.BottomContainer,.EasyCommentContainer-buttonBox').remove();
            window.scroll({ top: 0, behavior: 'smooth' });
            if (result.darkmode != "" && result.darkmode != undefined && !(result.darkmodedynamic == true && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                pushCSSRule('.VideoDescriptionExpander .VideoDescriptionExpander-switchExpand {background: linear-gradient(90deg,hsla(0,0%,96%,0),var(--bgcolor1) 16%);}')
            } else {
                pushCSSRule('.HeaderContainer {background: #fefefe;} .PlayerPlayTime { color: #1d2128; }')
            }
        });
    } else {
        // theater UI
        $('body').css('background-color', '#000')
        $('body').removeClass('is-large')
        $('body').removeClass('is-medium')
        $('body').addClass('is-autoResize')

        // cssは後から読み込まれるせいで.css()が使えないものに対してのみ使う
        // video関連は早めにスタイルシートで書かないとコメントコンテナーやシンボルが動画サイズの変更を反映してくれない
        //addCSS(chrome.runtime.getURL("pagemod/css/theater_video.css"));
        // 基本レイアウト変更
        // theater.cssに移動
        pushCSSRule('.MainContainer-floatingPanel {position: fixed;right: 0;bottom: 0;top: 44px;z-index: 500;}.common-header-1v0m9lc, .common-header-1nvgp3g, .common-header-h0l8yl, .common-header-cdesjj, .common-header-171vphh, .common-header-wb7b82, .common-header-1ufbzdh, .common-header-654o26, .common-header-11u4gc2, .common-header-1pxv7y0, .commonHeaderArea, #CommonHeader {background-color: #000 !important;}')
        if (result.darkmode != "" && result.darkmode != undefined && !(result.darkmodedynamic == true && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)) {
            addCSS(chrome.runtime.getURL("pagemod/css/darkmode/watch.css"));
        }
        addCSS(chrome.runtime.getURL("pagemod/css/theater.css"), `link[href="${chrome.runtime.getURL("pagemod/css/darkmode/watch.css")}"]`, 'after');
        $(function () {
            $('.SeekBar').before($('.PlayerPlayTime-playtime'));
            $('.SeekBar').after($('.PlayerPlayTime-duration'));
            $('.VideoTitle').after($('.SeriesBreadcrumbs'));
            $('.PlayerPanelContainer').append($('.HeaderContainer-searchBox'));
            $('.HeaderContainer-row > .GridCell.col-full').removeClass('col-full')
            $('.SearchBox-optionDown').text('▲')
            $('.PlayerPanelContainer').css('border-top-left-radius', '16px')
            // かつてヘッダーだったもの(動画情報)
            /*
            $('.VideoTitle').css({ 'color': '#fff', 'padding-top': '6px' })
            $('.VideoDescriptionExpander .VideoDescriptionExpander-switchExpand').css('background', 'linear-gradient(90deg,hsla(0,0%,96%,0),#fefefe 16%)')
            $('.HeaderContainer-searchBox').css({
                'position': 'fixed',
                'bottom': '0',
                'right': '0'
            })
            $('.SearchBox-input').css('width', '335px')
            $('.SearchBox').css('width', '382px')

            $('.HeaderContainer').css({
                'width': '100%',
                'padding': '0px 8px 0',
                'margin': '0 0 0'
            })
            $('.HeaderContainer-topArea').css('text-align', 'center')
            $('.HeaderContainer-row .GridCell:last-child').css({
                'width': 'fit-content',
                'display': 'flex'
            })
            $('.HeaderContainer-row').css({
                'width': 'fit-content',
                'display': 'flex',
                'margin': 'auto auto 12px'
            })
            $('.VideoOwnerInfo').css({
                'position': 'absolute',
                'right': '0'
            })
            $('.VideoDescriptionContainer').css({
                'margin': '0 auto',
                'margin-bottom': '16px'
            })
            // プレイヤー
            $('.SeekBar').css({
                'margin': 'auto 0'
            })
            $('.PlayerPlayTime-playtime, .PlayerPlayTime-duration').css({
                'margin': 'auto 10px'
            })
            $('.ControllerBoxContainer').css({
                'margin-top': '8px',
                'padding': '0 128px'
            })
            $('.ControllerContainer').css({
                'height': '48px'
            })
            $('.EasyCommentContainer').css(
                'height', 'auto'
            )
            $('.EasyCommentButton').css({
                'background': 'transparent',
                'color': '#fff',
                'border': '1px solid #aaa'
            })
            $('.CommentPostContainer-commandInput,.CommentPostContainer-commentInput').css('background', 'transparent')
            $('.CommentCommandInput,.CommentInput-textarea').css('color', '#fff')
            $('.CommentPostContainer-commentInput').css({
                'border-bottom': '2px solid #aaa',
                'border-top': '2px solid #aaa'
            })
            $('.CommentPostContainer-commandInput').css('border', '2px solid #aaa')
            $('.SeekBarContainer').css({
                'padding': '8px 16px 0',
                'display': 'flex'
            })
            $('.SeekBar-buffered').css('background-color', '#666')
            $('.ControllerBoxCommentAreaContainer, .EasyCommentContainer').css('background', 'transparent')
            $('.ControllerContainer').css('z-index', '3')*/
            // 不要な要素の削除
            $('.MainContainer-marquee, .PlayerPlayTime-separator, .EasyCommentContainer-buttonBox').remove();
            window.scroll({ top: 0, behavior: 'smooth' });
            /*$('.PlayerPlayTime,.PlayTimeFormatter').css({
                'color': '#fff',
                'width': '40px',
            })
            // ダークモードオーバーライド
            $('.BaseLayout-main, .BaseLayout').css('background-color', '#000')
            $('.BottomContainer').css('background-color', 'transparent')
            // 下側
            $('.HeaderContainer').css({
                'background': '#000'
            })
            $('.VideoDescriptionContainer').css({
                'padding': '16px',
                'background': 'rgba(255,255,255,0.3);',
                'box-shadow': '0px 0px 5px rgba(255,255,255,0.3)',
                'border-radius': '8px',
                'color': '#fff'
            })
            $('.VideoDescriptionExpander .VideoDescriptionExpander-switch').css({
                'bottom': '8px',
                'text-align': 'center',
                'width': '100%',
                'background': 'linear-gradient(180deg,hsla(0,0%,96%,0),#000 25%)'
            })
            $('.TagItem-name').css('color', '#fff')
            $('.VideoMenuContainer').css('background', '#000')
            $('.ControllerBoxCommentAreaContainer').css('border-right','none')*/
        });

    }
    //console.log(`createCSSRule Finished!`)
}
