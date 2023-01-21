getStorageData.then(createCSSRule, onError);
function createCSSRule(result) {
    if ( result.darkmode != "" ) {
        addCSS(chrome.runtime.getURL("pagemod/css/darkmode/video_top.css"));
    }
    if ( result.enableseriesstock == true ) {
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
        $('#openstock').on('click', function() {
            console.log( document.querySelector('.stockedserieswindow-container') != null )
            if (document.querySelector('.stockedserieswindow-container') != null) {
                $('.stockedserieswindow-container').remove()
            } else {
                $('.openstock-container').before('<div class="stockedserieswindow-container"><div>ストック中のシリーズ</div></div>')
                var getNewStorageData = new Promise((resolve) => chrome.storage.sync.get(null, resolve));
                getNewStorageData.then(function(newresult) {
                    $.each(newresult.stockedseries, function(i,object) {
                        console.log(object)
                        let playlist = btoa(`{"type":"series","context":{"seriesId":${object.seriesID}}}`)
                        let serieslinkhtml = `<div class="stockedseries-row"><div class="serieslink-container"><a class="stockedseries-row-link" href="https://www.nicovideo.jp/series/${object.seriesID}">${object.seriesName}</a><button id="removeseries" class="removeseries">削除</button></div></div>`
                        let lastvidhtml = ``
                        let nextvidhtml = ``
                        if ( object.lastVidID != undefined && object.lastVidName != undefined ) {
                            lastvidhtml = `<a class="stockedseries-row-link" href="https://www.nicovideo.jp/watch/${object.lastVidID}?ref=series&playlist=${playlist}&transition_type=series&transition_id=${object.seriesID}">最後に見た動画: ${object.lastVidName}</a>`
                        }
                        if ( object.nextVidID != undefined && object.nextVidName != undefined ) {
                            nextvidhtml = `<a class="stockedseries-row-link" href="https://www.nicovideo.jp/watch/${object.nextVidID}?ref=series&playlist=${playlist}&transition_type=series&transition_id=${object.seriesID}">次の動画: ${object.nextVidName}</a>`
                        }
                        $('.stockedserieswindow-container').append(`<div class="stockedseries-row"><div class="serieslink-container"><a class="stockedseries-row-link" href="https://www.nicovideo.jp/series/${object.seriesID}">${object.seriesName}</a><button id="removeseries" class="removeseries">削除</button></div>${lastvidhtml}${nextvidhtml}</div>`)
                    })
                }, onError);
            }
        })

        $(document).on('click', '#removeseries', function() {
            console.log(`Hello!`)
            manageSeriesStock( $(this).prev().prop('href').slice(32) )
            $(this).parent('.stockedseries-row').remove()
        })
    }
}