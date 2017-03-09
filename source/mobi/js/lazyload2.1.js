// author: EC
// last modify: 2015-12-25 13:16

function lazyLoad(context){
    var doc = document,
        body = doc.body,
        win = window, 
        winDoc = win.document.documentElement, 
        $win = angular.element(win),
        uid = 0,
        elements = {}, 
        imgArr = [], 
        curW = winDoc.clientWidth - (1.28 * parseFloat(winDoc.style.fontSize));

    function getUid(el){
        return el.__uid || (el.__uid = ('' + (++uid)));
    }

    function getWindowOffset(){
        var t,
            pageXOffset = (typeof win.pageXOffset == 'number') ? win.pageXOffset : (((t = doc.documentElement) || (t = body.parentNode)) && typeof t.ScrollLeft == 'number' ? t : body).ScrollLeft,
            pageYOffset = (typeof win.pageYOffset == 'number') ? win.pageYOffset : (((t = doc.documentElement) || (t = body.parentNode)) && typeof t.ScrollTop == 'number' ? t : body).ScrollTop;
        return {
            offsetX: pageXOffset,
            offsetY: pageYOffset
        };
    }

    function isVisible(iElement){
        var elem = iElement[0],
            elemRect = elem.getBoundingClientRect(),
            windowOffset = getWindowOffset(),
            winOffsetX = windowOffset.offsetX,
            winOffsetY = windowOffset.offsetY,
            elemWidth = elemRect.width,
            elemHeight = elemRect.height,
            elemOffsetX = elemRect.left + winOffsetX,
            elemOffsetY = elemRect.top + winOffsetY,
            viewWidth = Math.max(doc.documentElement.clientWidth, win.innerWidth || 0),
            viewHeight = Math.max(doc.documentElement.clientHeight, win.innerHeight || 0),
            xVisible,
            yVisible;

        if(elemOffsetY <= winOffsetY){
            if(elemOffsetY + elemHeight >= winOffsetY){
                yVisible = true;
            }
        }else if(elemOffsetY >= winOffsetY){
            if(elemOffsetY <= winOffsetY + viewHeight){
                yVisible = true;            }
        }

        if(elemOffsetX <= winOffsetX){
            if(elemOffsetX + elemWidth >= winOffsetX){
                xVisible = true;
            }
        }else if(elemOffsetX >= winOffsetX){
            if(elemOffsetX <= winOffsetX + viewWidth){
                xVisible = true;
            }
        }

        return xVisible && yVisible;
    };

    function checkImage(){
        Object.keys(elements).forEach(function(key){
            var obj = elements[key],
                iElement = obj.iElement,
                lazySrc = obj.lazySrc, 
                eleSrc = iElement.attr('src');

            if(isVisible(iElement) && !eleSrc){
                iElement.attr('src', lazySrc)
                    .css({'opacity': 1});
            }
        });
    }

    $win.bind('scroll', checkImage);
    $win.bind('resize', checkImage);
    $win.bind('touchmove', checkImage);

    function onLoad(el, ctx){
        var $el = angular.element(ctx),
            uid = getUid($el),
            oriW = $el[0].width, 
            oriH = $el[0].height,
            ratio = oriH/oriW,
            curH = Math.ceil(curW*ratio);

        el.css('opacity', 1);

        curH && el.css('height', curH + 'px');

        if(elements.hasOwnProperty(uid)){
            delete elements[uid];
        }
    }

    if(context){
        imgArr = context.getElementsByTagName('img');
    }else{
        imgArr = doc.getElementsByTagName('img');
    }

    Array.prototype.forEach.call(imgArr, function(item, idx){
        var el = angular.element(item), 
            src = item.getAttribute('lazy-src'), 
            imgtemp = document.createElement('img');

        imgtemp.onload = function(){
            onLoad(el, this);
        };
        imgtemp.src = src;

        if(src){
            if(isVisible(el)){
                el.attr('src', src)
                    .css('opacity', 1);
            }else{
                var uid = getUid(el[0]);
                el.css({
                    'background-color': '#fff',
                    'opacity': 1,
                    '-webkit-transition': 'opacity .2s',
                    'transition': 'opacity .2s'
                });
                elements[uid] = {
                    iElement: el, 
                    lazySrc: src
                };
            }
        }
    });
    // for(var i=0; i<imgArr.length; i++){
    //     var el = angular.element(imgArr[i]), 
    //         src = imgArr[i].getAttribute('lazy-src'), 
    //         imgtemp = document.createElement('img');


    //         // src = imgArr[i].getAttribute('lazy-src'), 
    //         // oriW = el.attr('data-width') ? parseFloat(el.attr('data-width')) : 0, 
    //         // oriH = el.attr('data-height') ? parseFloat(el.attr('data-height')) : 0, 
    //         // ratio = oriW && oriH ? oriH/oriW : 0, 
    //         // curH = ratio ? Math.ceil(curW*ratio) : 0;

    //     imgtemp.onload = function(){
    //         onLoad(el, this);
    //     };
    //     imgtemp.src = src;

    //     if(src){
    //         if(isVisible(el)){
    //             el.attr('src', src)
    //                 .css('opacity', 1);
    //         }else{
    //             var uid = getUid(el[0]);
    //             el.css({
    //                 'background-color': '#fff',
    //                 'opacity': 1,
    //                 '-webkit-transition': 'opacity .2s',
    //                 'transition': 'opacity .2s'
    //             });
    //             elements[uid] = {
    //                 iElement: el, 
    //                 lazySrc: src
    //             };
    //         }
    //         // if(curH){
    //         //     el.css('height', curH + 'px');
    //         // }
    //     }
    // }

    setTimeout(function(){checkImage();}, 200);
};