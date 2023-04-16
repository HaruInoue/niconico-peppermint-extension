// www.nicovideo.jpの全てで実行

$('body').append('<div class="pmbutton-container"></div>');
//$('body').append('<div class="version-watermark" style="position: sticky; left:0; bottom:0px;color:#aaa;font-size:8px">Niconico-PepperMint Preview</div>');
addCSS("https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined")
addCSS(chrome.runtime.getURL("pagemod/css/peppermint-ui.css"));
$('html').append('<style id="peppermint-css"></style>')
getStorageData.then(createBaseCSSRule, onError);
function createBaseCSSRule(result) {
    $(function() {
        if ( result.highlightnewnotice == true ) {
            addCSS(chrome.runtime.getURL("pagemod/css/other/highlightnewnotice.css"), true);
        }
        if ( result.darkmode != "" && result.darkmode != undefined && !(result.darkmodedynamic == true && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ) {
            addCSS(chrome.runtime.getURL("pagemod/css/darkmode/" + result.darkmode + ".css"), true);
            if ( location.hostname != "game.nicovideo.jp" ) { addCSS(chrome.runtime.getURL("pagemod/css/darkmode/all_compressed.css"), true);}
            $('.NiconicoLogo_black').addClass('NiconicoLogo_white')
            $('.NiconicoLogo_black').removeClass('NiconicoLogo_black')
            $('.NicovideoLogo[data-color="black"]').attr('data-color',"white")
            //addCSS(chrome.runtime.getURL("pagemod/css/peppermint-ui-var.css"), true, `link[href="${chrome.runtime.getURL("pagemod/css/darkmode/" + result.darkmode + ".css")}"]`, 'before')
        } else { addCSS(chrome.runtime.getURL("pagemod/css/peppermint-ui-var.css"), true) }
        if ( result.alignpagewidth == true ) {
            addCSS(chrome.runtime.getURL("pagemod/css/other/alignpagewidth.css"), true);
        } else {
            console.log(result.alignpagewidth)
        }
        if (result.headerbg == "gradient") {
            addCSS(chrome.runtime.getURL("pagemod/css/header/gradient.css"), true);
        } else if (result.headerbg == "custom") {
            addCSS(chrome.runtime.getURL("pagemod/css/header/custom.css"), true);
            $('body').css('--headercolor', result.headercolor);
            console.log(`HeaderBG changed to ${result.headercolor}`);
        }
        if ( result.enableseriesstock == true && location.pathname == "/" && location.hostname == "www.nicovideo.jp" ){
            $('.pmbutton-container').append('<div class="openstock-container"><button id="openstock" class="material-icons mainaction-button" style="background: #00796b">folder</button></div>')
            $('#openstock').on('mouseenter', function() {
                $('#openstock').css({
                    'font-size':'28px',
                    'transition':'all .1s'
                })
                $('.openstock-container').append('<span id="openstock-text" style="background: #ddd;padding: 5px;border-radius: 5px;margin-left: 5px;box-shadow: 0px 0px 5px rgba(0,0,0,40%); color: #000;">ストック中のシリーズ</span>')
            })
            $('#openstock').on('mouseleave', function() {
                $('#openstock').css({
                    'font-size':'24px',
                    'transition':'all .1s'
                })
                $('#openstock-text').remove()
            })
            $('#openstock').on('click', function () {
                console.log(document.querySelector('.stockedserieswindow-container') != null)
                if (document.querySelector('.stockedserieswindow-container') != null) {
                    $('.stockedserieswindow-container').remove()
                } else {
                    // <button id="togglelock" class="togglelock">ロック解除</button>
                    $('.openstock-container').before('<div class="stockedserieswindow-container"><div>ストック中のシリーズ<button id="togglelock" class="togglelock">ロック解除</button></div><div class="stockedserieslist-container"></div></div>')
                    var getNewStorageData = new Promise((resolve) => chrome.storage.sync.get(null, resolve));
                    getNewStorageData.then(function (newresult) {
                        $.each(newresult.stockedseries, function (i, object) {
                            let seriesHref = `https://www.nicovideo.jp/series/${object.seriesID}`
                            // ニコニコ動画は、watchページのリンクにクエリパラメータ playlist を渡すことで連続再生できるようになります
                            // 内容はJSONで、Base64でエンコードします
                            let playlist = btoa(`{"type":"series","context":{"seriesId":${object.seriesID}}}`)
                            // create row container dom
                            let elem = document.createElement('div')
                            elem.id = object.seriesID
                            elem.classList.add('stockedseries-row')

                            // create serieslink container
                            let linkcontainer = document.createElement('div')
                            linkcontainer.classList.add('serieslink-container')

                            // create link
                            let link = document.createElement('a')
                            link.classList.add('stockedseries-row-link')
                            link.setAttribute('href',seriesHref)
                            link.textContent = object.seriesName
                            linkcontainer.appendChild(link)
                            // create remove button
                            let removebutton = document.createElement('button')
                            removebutton.id = 'removeseries'
                            removebutton.textContent = '削除'
                            linkcontainer.appendChild(removebutton)
                            // push to row container
                            elem.appendChild(linkcontainer)

                            // create nextvid/lastvid link
                            let lastvidlink = document.createElement('a')
                            lastvidlink.classList.add('stockedseries-row-link')
                            if (object.lastVidID != undefined && object.lastVidName != undefined) {
                                lastvidlink.textContent = `最後に見た動画: ${object.lastVidName}`
                                lastvidlink.setAttribute('href',`https://www.nicovideo.jp/watch/${object.lastVidID}?ref=series&playlist=${playlist}&transition_type=series&transition_id=${object.seriesID}`)
                            } else {
                                lastvidlink.setAttribute('style','color: var(--textcolor3)')
                                lastvidlink.textContent = `最後に見た動画が保存されていません`
                            }
                            elem.appendChild(lastvidlink)
                            let nextvidlink = document.createElement('a')
                            nextvidlink.classList.add('stockedseries-row-link')
                            if (object.nextVidID != undefined && object.nextVidID != undefined) {
                                nextvidlink.textContent = `次の動画: ${object.nextVidName}`
                                nextvidlink.setAttribute('href',`https://www.nicovideo.jp/watch/${object.nextVidID}?ref=series&playlist=${playlist}&transition_type=series&transition_id=${object.seriesID}`)
                            } else {
                                nextvidlink.setAttribute('style','color: var(--textcolor3)')
                                nextvidlink.textContent = `次の動画が保存されていません`
                            }
                            elem.appendChild(nextvidlink)
                            // push to stockedseries container
                            document.querySelector('.stockedserieslist-container').appendChild(elem)
                        })
                    }, onError);
                }
            })
    
            $(document).on('click', '#removeseries', function () {
                manageSeriesStock(this.closest('.stockedseries-row').id)
                this.closest('.stockedseries-row').remove()
            })
            $(document).on('click', '#togglelock', function () {
                console.log($(this).text())
                if ($(this).text() == 'ロック解除') {
                    $(".stockedserieslist-container").sortable({
                        "axis": "y",
                        "update": function(event,ui) {
                            console.log()
                            let sortlist = $('.stockedserieslist-container').sortable("toArray")
                            var getNewStorageData = new Promise((resolve) => chrome.storage.sync.get(null, resolve));
                            getNewStorageData.then(function (newresult) {
                                let currentstock = newresult.stockedseries
                                currentstock.sort((a,b) => sortlist.indexOf(a.seriesID) - sortlist.indexOf(b.seriesID))
                                console.log(currentstock)
                                chrome.storage.sync.set({
                                    "stockedseries": currentstock
                                })
                            })
                        }
                    }
                    )
                    $(this).text('ロック')
                } else {
                    $(".stockedserieslist-container").sortable("destroy")
                    $(this).text('ロック解除')
                }
            })
        }
    });
    if ( result.hidesupporterbutton == "all" && !location.pathname.indexOf('/user') ) {
        addCSS(chrome.runtime.getURL("pagemod/css/other/hidesupporter.css"))
    }
    $(document).on('click',function(e) {
        console.log(e.target.closest('.pmbutton-container'))
        if(e.target.closest('.pmbutton-container') == null && e.target.id != 'removeseries') {
            $('.stockedserieswindow-container, .quickcommander-container').remove()
        }
    });
    if (result.hidepopup == true) {
        pushCSSRule('.FollowAppeal,.SeekBarStoryboardPremiumLink-content,.PreVideoStartPremiumLinkContainer,.CreatorSupportAppealContainer {display:none;}')
    }
}