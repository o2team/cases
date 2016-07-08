// author: EC
// last modify: 2015-12-25 13:16

exports.lazyLoad = function (context, container){
    var doc = document,
        body = doc.body,
        win = window, 
        $win = win.document.documentElement, 
        $cont = container ? container : null, 
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
        var elem = iElement,
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
                eleSrc = iElement.getAttribute('src');

            if(isVisible(iElement) && !eleSrc){
                iElement.setAttribute('src', lazySrc);
                iElement.style.opacity = 1;
            }
        });
    }

    if($cont){
        var contLen = $cont.length;
        if(contLen > 1){
            for(var i=0; i<contLen; i++){
                $cont[i].addEventListener('scroll', checkImage);
            }
        }else{
            $cont.addEventListener('scroll', checkImage);
        }
    }else{
        win.addEventListener('scroll', checkImage);
    }
    $win.addEventListener('resize', checkImage);
    'ontouchstart' in window && $win.addEventListener('touchmove', checkImage);

    function onLoad(e){
        var $el = this,
            uid = getUid($el);

        // $el.css('opacity', 1);
        this.style.opacity = '1';

        if(elements.hasOwnProperty(uid)){
            delete elements[uid];
        }
    }

    if(context){
        imgArr = context.getElementsByTagName('img');
    }else{
        imgArr = doc.getElementsByTagName('img');
    }

    for(var i=0; i<imgArr.length; i++){
        var el = imgArr[i], 
            src = imgArr[i].getAttribute('lazy-src');

        el.addEventListener('load', onLoad);

        if(src){
            if(isVisible(el)){
                el.setAttribute('src', src);
                el.style.opacity = 1;
            }else{
                var uid = getUid(el);
                el.style.backgroundColor = '#fff';
                el.style.opacity = 1; 
                el.style.webkitTransition = 'opacity .2s'; 
                el.style.transition = 'opacity .2s';

                elements[uid] = {
                    iElement: el, 
                    lazySrc: src
                };
            }
        }

        el.removeEventListener('load', onLoad);
    }

    setTimeout(function(){checkImage();}, 200);
};