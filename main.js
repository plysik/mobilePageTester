(function () {
    'use strict';

    var btnsArray,
        floatPanelEl,
        iFrame,
        resizeIframe,
        draggedEl,
        dragCoverEl,
        grabPointY,
        grabPointX,
        onDragStart,
        onDrag,
        onDragEnd,
        checkFloatPanelElPosition,
        posX,
        posY,
        urlParams,
        loadUrl;

    btnsArray = [
        {
            title: 'Mobile',
            width: 320,
            heigth: 0,
            userAgent: ''
        }, {
            title: 'Tablet',
            width: 768,
            heigth: 0,
            userAgent: ''
        }, {
            title: 'Desktop',
            width: 1920,
            heigth: 0,
            userAgent: ''
        }
    ];

    floatPanelEl = document.querySelector('#sizingBtns');
    iFrame = document.querySelector('iframe');
    dragCoverEl = document.querySelector('.drag-cover');

    /* generate buttons */
    btnsArray.forEach(function (btn) {
        var btnEl = document.createElement('input');
        btnEl.setAttribute('type', 'button');
        btnEl.setAttribute('value', btn.title);
        btnEl.setAttribute('data-width', btn.width);
        btnEl.setAttribute('data-height', btn.heigth);
        btnEl.setAttribute('data-userAgent', btn.userAgent);
        floatPanelEl.appendChild(btnEl);
    });

    resizeIframe = function (e) {
        if (e.target.nodeName === "INPUT") {
            iFrame.style.width = e.target.dataset.width;
        }
    };

    onDragStart = function (ev) {
        var boundingClientRect;
        if (ev.target.className.indexOf('float-panel') === -1) {
            return;
        }

        draggedEl = this;

        boundingClientRect = draggedEl.getBoundingClientRect();

        grabPointY = boundingClientRect.top - ev.clientY;
        grabPointX = boundingClientRect.left - ev.clientX;
        dragCoverEl.classList.add('drag');
    };

    onDrag = function (ev) {
        if (!draggedEl) {
            return;
        }

        posX = ev.clientX + grabPointX;
        posY = ev.clientY + grabPointY;
        var bodyWidth = document.querySelector("body").offsetWidth,
            bodyHeight = document.querySelector("body").offsetHeight;

        if (posX < 0) {
            posX = 0;
        }

        if (posY < 0) {
            posY = 0;
        }
        if (posX + draggedEl.offsetWidth > bodyWidth) {
            posX = bodyWidth - draggedEl.offsetWidth;
        }
        if (posY + draggedEl.offsetHeight > bodyHeight) {
            posY = bodyHeight - draggedEl.offsetHeight;
        }

        draggedEl.style.transform = "translateX(" + posX + "px) translateY(" + posY + "px)";
    };

    onDragEnd = function () {
        draggedEl = null;
        grabPointX = null;
        grabPointY = null;
        dragCoverEl.classList.remove('drag');
    };

    checkFloatPanelElPosition = function () {
        var bodyWidth = document.querySelector("body").offsetWidth,
            bodyHeight = document.querySelector("body").offsetHeight,
            boundingClientRect = floatPanelEl.getBoundingClientRect();
        if (boundingClientRect.right > bodyWidth) {
            posX = bodyWidth - floatPanelEl.offsetWidth;
        }
        if (boundingClientRect.bottom > bodyHeight) {
            posY = bodyHeight - floatPanelEl.offsetHeight;
        }
        floatPanelEl.style.transform = "translateX(" + posX + "px) translateY(" + posY + "px)";

    };

    loadUrl = function () {
        var match,
            pl = /\+/g, // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) {
                return decodeURIComponent(s.replace(pl, " "));
            },
            query = window.location.search.substring(1);

        urlParams = {};
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);


        //Populate iframe
        var _url = ("url" in urlParams) ? ((urlParams["url"].startsWith("http") || urlParams["url"].startsWith("//")) ? urlParams["url"] : "//" + urlParams["url"]) : "https://www.w3schools.com";
        iFrame.src = _url;
        //display url
        var aEl = document.createElement('a');
        aEl.setAttribute('href', _url + "?forcereturn=true");
        aEl.setAttribute('target', "_blank");
        aEl.innerHTML = _url;
        floatPanelEl.appendChild(aEl);
    }



    /* EVENTS */
    floatPanelEl.addEventListener('click', resizeIframe, false);
    floatPanelEl.addEventListener('mousedown', onDragStart, false);
    document.addEventListener('mousemove', onDrag, false);
    document.addEventListener('mouseup', onDragEnd, false);
    window.addEventListener('resize', checkFloatPanelElPosition, false);
    window.addEventListener('load', loadUrl, false);

})();
