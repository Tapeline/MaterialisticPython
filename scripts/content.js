function createTOCSidenav() {
    let listComponent = $(`
        <ul style="width: 300px; flex-grow: 0" class="mp-toc card"></ul>`);
    $(".sphinxsidebarwrapper").children().each((i, item) => {
        const elem = $(`<li></li>`)
        elem.append(item)
        listComponent.append(elem);
    })
    return listComponent;
}

function createNavbar() {
    const docLangDropdown = $(`<ul id="lang-dd" class="dropdown-content"></ul>`)
    const docVerDropdown = $(`<ul id="ver-dd" class="dropdown-content"></ul>`)
    const urlParams = getUrlParams()
    $(".language-select").eq(0).children("option").each((i, item) => {
       docLangDropdown.append(
           item.value !== "en"
               ?
           $(`<li><a href="/${item.value}/${urlParams.ver}/${urlParams.resource}">
               ${item.text}</a></li>`)
               :
           $(`<li><a href="/${urlParams.ver}/${urlParams.resource}">
               ${item.text}</a></li>`)
       );
    });
    $(".version-select").eq(0).children("option").each((i, item) => {
       docVerDropdown.append(
           $(`<li><a href="/${urlParams.lang}/${item.value}/${urlParams.resource}">
               ${item.text}</a></li>`)
       );
    });
    const nav = $(`
        <nav>
        <div class="nav-wrapper">
        <a href="https://docs.python.org" class="brand-logo"><img src="../_static/py.svg"/>Python Docs</a>
        <ul class="right hide-on-med-and-down">
            <li><a href="/${urlParams.ver}/py-modindex.html">
            <i class="material-icons" style="color: white!important">format_list_bulleted</i></a></li>
            <li><a href="/${urlParams.ver}/genindex.html">
            <i class="material-icons" style="color: white!important">sort_by_alpha</i></a></li>
        </ul>
        <form action="/search.html" method="get" class="right hide-on-med-and-down">
            <div class="input-field">
            <input id="search" type="search" required name="q" placeholder="Quick search">
            <label class="label-icon" for="search"><i class="material-icons">search</i></label>
            <i class="material-icons">close</i>
            </div>
        </form>
        <ul class="right">
            <li><a class="dropdown-trigger" href="#!" data-target="lang-dd">
                <i class="material-icons">language</i></a></li>
            <li><a class="dropdown-trigger" href="#!" data-target="ver-dd">
                <i class="material-icons">timelapse</i></a></li>
        </ul>
        </div>
        </nav>
    `);
    const res = $(`<div class="navbar-fixed"></div>`)
    res.append(docLangDropdown);
    res.append(docVerDropdown);
    res.append(nav)
    return res
}

function createBody(toc) {
    const body = $(`<div style="display: flex; " id="mp-body"></div>`)
    const doc = $(`<div style="flex-grow: 1" class="mp-doc-body"></div>`)
    doc.append($(".body"))
    body.append(toc)
    body.append(doc)
    return body
}

function renderDocPage() {
    const nav = createNavbar();
    const toc = createTOCSidenav();
    const body = createBody(toc);
    const docBody = $("body");
    docBody.empty();
    docBody.append(nav);
    docBody.append(body);
    commonModifications()
}

function createModIndexTOCSidenav() {
    let listComponent = $(`
        <ul style="width: 300px; flex-grow: 0" class="mp-toc card table-of-contents section"></ul>`);
    [..."_abcdefghijklmnopqrstuvwxyz"].forEach(letter => {
        listComponent.append($(`<li><a href="#cap-${letter}">${letter}</a></li>`));
    })
    return listComponent;
}

function createModIndexBody(toc) {
    const body = $(`<div style="display: flex; " id="mp-body"></div>`)
    const doc = $(`<div style="flex-grow: 1" class="mp-doc-body"></div>`)
    const modules = {};
    [..."_abcdefghijklmnopqrstuvwxyz"].forEach(letter => modules[letter] = []);
    let letter = "_";
    $(".indextable tbody").eq(0).children("tr").each((i, item) => {
        if ($(item).hasClass("pcap")) return;
        if ($(item).hasClass("cap")) {
            letter = $(item).attr("id").substring(4)
        } else {
            const link = $($(item).children("td").eq(1).children("a").eq(0)).attr("href");
            const label = $($(item).children("td").eq(1).children("a").eq(0)).text();
            const text = $($(item).children("td").eq(2)).text();
            if (!modules[letter]) modules[letter] = [];
            modules[letter].push([link, label, text]);
        }
    });
    console.log(modules);
    [..."_abcdefghijklmnopqrstuvwxyz"].forEach(letter => {
        doc.append(`<h4 id="cap-${letter}" class="cap">${letter}</h4>`);
        const table = $(`<table class="card striped"></table>`)
        modules[letter].forEach(([link, label, text]) => {
            table.append($(`<tr>
                <td><a href="${link}">${label}</a></td>
                <td>${text}</td>
            </tr>`))
        })
        doc.append(table)
    });
    body.append(toc)
    body.append(doc)
    return body
}

function renderModIndexPage() {
    const nav = createNavbar();
    const toc = createModIndexTOCSidenav();
    const body = createModIndexBody(toc);
    const docBody = $("body");
    docBody.empty();
    docBody.append(nav);
    docBody.append(body);
    commonModifications("h4.cap")
}

function commonModifications(sectionSel = "section") {
    $(".responsive-table__container").addClass("card")
    $("table").removeClass("docutils").addClass("striped")
    $(".highlight-python3").addClass("card")
    $(".highlight-default").addClass("card")
    $(".doctest").addClass("card")
    $("section").addClass("section scrollspy")
    //$('.scrollspy').scrollSpy();
    $(".mp-toc ul").addClass("table-of-contents section")
    $(".admonition").addClass("card")
    $('.dropdown-trigger').dropdown({constrainWidth: false});
    $(".contentstable").addClass("card").removeClass("striped")
    initScrollspy(sectionSel)
}

function initScrollspy(sectionSel ) {
    const sections = document.querySelectorAll(sectionSel);
    const menuLinks = {};
    document.querySelectorAll(".mp-toc a").forEach(link => {
        menuLinks[link.href.split("#")[1]] = link
    })
    const removeAllActive = () => (
        [...Array(sections.length).keys()].forEach(
            (link) => menuLinks[sections[link].id]?.classList?.remove("active")
        )
    );
    const sectionMargin = 200;
    let currentActive = 0;
    console.log(sections, menuLinks)
    window.addEventListener("scroll", () => {
        const current = (
            sections.length - [...sections].reverse().findIndex(
                (section) => window.scrollY >= section.offsetTop - sectionMargin
            ) - 1
        );
        console.log(sections[current].id, )
        if (current !== currentActive) {
            removeAllActive();
            currentActive = current;
            menuLinks[sections[current].id]?.classList?.add("active")
        }
    });
}

function getUrlParams() {
    const re = /https?:\/\/docs\.python\.org\/(?<lang>[a-z]{2})?\/?(?<ver>[0-9\.]+)\/(?<res>.*)/gm
    const res = re.exec(window.location.href);
    const gr = res.groups;
    return {
        ver: gr.ver,
        lang: gr.lang || "en",
        resource: gr.res
    }
}


function hidePreloader() {
    $(".big-f-preloader").remove();
}

function showPreloader() {
    $("body").append(`<div class="big-f-preloader center-content-on-page">
<div class="preloader-wrapper big active">
      <div class="spinner-layer spinner-blue">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-red">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-yellow">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-green">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
</div>`)
}

var findEventHandlers = function (eventType, jqSelector) {
    var results = [];
    var $ = jQuery;// to avoid conflict between others frameworks like Mootools

    var arrayIntersection = function (array1, array2) {
        return $(array1).filter(function (index, element) {
            return $.inArray(element, $(array2)) !== -1;
        });
    };

    var haveCommonElements = function (array1, array2) {
        return arrayIntersection(array1, array2).length !== 0;
    };


    var addEventHandlerInfo = function (element, event, $elementsCovered) {
        var extendedEvent = event;
        if ($elementsCovered !== void 0 && $elementsCovered !== null) {
            $.extend(extendedEvent, { targets: $elementsCovered.toArray() });
        }
        var eventInfo;
        var eventsInfo = $.grep(results, function (evInfo, index) {
            return element === evInfo.element;
        });

        if (eventsInfo.length === 0) {
            eventInfo = {
                element: element,
                events: [extendedEvent]
            };
            results.push(eventInfo);
        } else {
            eventInfo = eventsInfo[0];
            eventInfo.events.push(extendedEvent);
        }
    };


    var $elementsToWatch = $(jqSelector);
    if (jqSelector === "*")//* does not include document and we might be interested in handlers registered there
        $elementsToWatch = $elementsToWatch.add(document);
    var $allElements = $("*").add(document);

    $.each($allElements, function (elementIndex, element) {
        var allElementEvents = $._data(element, "events");
        if (allElementEvents !== void 0 && allElementEvents[eventType] !== void 0) {
            var eventContainer = allElementEvents[eventType];
            $.each(eventContainer, function(eventIndex, event){
                var isDelegateEvent = event.selector !== void 0 && event.selector !== null;
                var $elementsCovered;
                if (isDelegateEvent) {
                    $elementsCovered = $(event.selector, element); //only look at children of the element, since those are the only ones the handler covers
                } else {
                    $elementsCovered = $(element); //just itself
                }
                if (haveCommonElements($elementsCovered, $elementsToWatch)) {
                    addEventHandlerInfo(element, event, $elementsCovered);
                }
            });
        }
    });

    return results;
};

// chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
//     console.log(tab)
//     chrome.scripting
//     .executeScript({
//       target : {tabId : tab},
//       files : [ "switchTheme.js" ],
//     })
//     .then(() => console.log("script injected"));
// })


$("body").addClass("hidden");

$(document).ready(() => {

    $("body").addClass("hidden");
    showPreloader();
    $("head").append(`
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
        <script type="text/javascript">activateTheme("light")</script>
    `);
    $("body").removeClass("hidden");
    const params = getUrlParams();
    console.log(params.resource)
    if (params.resource.startsWith("genindex")) {

    } else if (params.resource.startsWith("py-modindex")) {
        renderModIndexPage();
    } else {
        renderDocPage();
    }
    hidePreloader();
})
