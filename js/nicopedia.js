console.log(`hello nicopedia!`)
getStorageData.then(createCSSRule, onError);
function createCSSRule(result) {
    if ( result.hidereputation != "" ) {
        console.log(`f**k dislike count!!!!`)
        $('.res_reaction_bad_count').css('display','none');
        if ( result.hidereputation == "all" ) {
            $('.res_reaction_good_count').css('display','none');
        }
        $('.reaction_good_mark').text('')
        $('.reaction_good_mark').append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="17px" height="17px" transform="translate(0 5)"><circle cx="12" cy="12" r="9.3" fill="#fcd842"></circle><path d="M12 22a10 10 0 1 1 10-10 10 10 0 0 1-10 10Zm0-18a8 8 0 1 0 8 8 8 8 0 0 0-8-8Z" fill="#252525"></path><rect x="8.5" y="6.7" width="2" height="4.5" rx="1" ry="1" fill="#252525"></rect><rect x="13.5" y="6.7" width="2" height="4.5" rx="1" ry="1" fill="#252525"></rect><path d="M14.5 12.8a1 1 0 0 0-1 1v1.5h-3v-1.5a1 1 0 1 0-2 0v2.5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-2.5a1 1 0 0 0-1-1Z" fill="#252525"></path></svg>')
        addCSS(chrome.runtime.getURL("pagemod/css/nicopedia/liketonicoru.css"))
    }
    if ( result.dicfullwidth == true ) {

    }
}