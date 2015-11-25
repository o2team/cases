// author: EC
// last modify: 2015-11-25 17:57

function lazyLoad(){
    var doc = document,
        body = doc.body,
        win = window,
        $win = angular.element(win),
        uid = 0,
        elements = {}, 
        imgArr = [];

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
                yVisible = true;
            }
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
                lazySrc = obj.lazySrc;

            if(isVisible(iElement)){
                iElement.attr('src', lazySrc)
                    .css({'opacity': 1});
            }
        });
    }

    $win.bind('scroll', checkImage);
    $win.bind('resize', checkImage);

    function onLoad(){
        var $el = angular.element(this),
            uid = getUid($el);

        $el.css('opacity', 1);

        if(elements.hasOwnProperty(uid)){
            delete elements[uid];
        }
    }

    imgArr = doc.getElementsByTagName('img');
    for(var i=0; i<imgArr.length; i++){
        var el = angular.element(imgArr[i]), 
            src = imgArr[i].getAttribute('lazy-src');

        el.bind('load', onLoad);

        if(src){
            if(isVisible(el)){
                el.attr('src', src);
            }else{
                var uid = getUid(el[0]);
                el.css({
                    'background-color': '#fff',
                    'opacity': 0,
                    '-webkit-transition': 'opacity .2s',
                    'transition': 'opacity .2s'
                });
                elements[uid] = {
                    iElement: el, 
                    lazySrc: src
                };
            }
        }

        el.unbind('load');
    }
};