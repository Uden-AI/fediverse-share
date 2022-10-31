const doc = document;
const plainsvgTextarea = doc.querySelector("#plainsvg");
const downloadLink = doc.querySelector("#downloadlink");
const encodedsvgTextarea = doc.querySelector("#encodedsvg");
const resultCssTextarea = doc.querySelector("#result-css");
const previewArea = doc.querySelector("#preview-img");
const demoWrapper = doc.querySelector(".preview-img-wrapper");
const contrastButton = doc.querySelector("#bgcolor");

const expanders = doc.querySelectorAll(".expander");
const expandedClass = "expanded";
const symbols = /[\r\n%#()<>?\[\\\]^`{|}]/g;

const quotesInputs = doc.querySelectorAll(".options__input");
let externalQuotesValue = doc.querySelector(".options__input:checked").value;
let quotes = getQuotes();
const previewBorder = "border: 1px solid green;";
// Textarea Actions
//----------------------------------------
plainsvgTextarea.oninput = function () {
    getResults();
};

doc.querySelector("#copy-plainsvg").addEventListener("click", () => {
    plainsvgTextarea.focus();
    plainsvgTextarea.select();
    try {
        var successful = doc.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log("Copying text command was " + msg);
    } catch (err) {
        console.log("Oops, unable to copy");
    }
});

encodedsvgTextarea.oninput = function () {
    const value = encodedsvgTextarea.value
        .trim()
        .replace(/background-image:\s{0,}url\(/, ``)
        .replace(/["']{0,}data:image\/svg\+xml,/, ``)
        .replace(/["']\);{0,}$/, ``);
    try {
        plainsvgTextarea.value = decodeURIComponent(value);
        getResults();
    } catch (err) {
        previewArea.setAttribute("src", "");
        plainsvgTextarea.value = "";
        resultCssTextarea.value = "";
        doc.body.style.backgroundImage = "";
        console.log("Bad encoded SVG");
    }
};

doc.querySelector("#copy-encodedsvg").addEventListener("click", () => {
    encodedsvgTextarea.focus();
    encodedsvgTextarea.select();
    try {
        var successful = doc.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log("Copying text command was " + msg);
    } catch (err) {
        console.log("Oops, unable to copy");
    }
});

doc.querySelector("#copy-resultcss").addEventListener("click", () => {
    resultCssTextarea.focus();
    resultCssTextarea.select();
    try {
        var successful = doc.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log("Copying text command was " + msg);
    } catch (err) {
        console.log("Oops, unable to copy");
    }
});

function getResults() {
    if (!plainsvgTextarea.value) {
        resultCssTextarea.value = "";
        previewArea.setAttribute(
            "src",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"
        );
        previewArea.setAttribute("style", "");
        doc.body.style.backgroundImage = "";
        downloadLink.removeAttribute("href");
        downloadLink.style.cursor = "not-allowed";
        return;
    }

    const namespaced = addNameSpace(plainsvgTextarea.value);
    const escaped = encodeSVG(namespaced);
    encodedsvgTextarea.value = escaped;
    const svgdata = `data:image/svg+xml,${escaped}`;
    const bgurl = `url(${quotes.level1}${svgdata}${quotes.level1})`;
    resultCssTextarea.value = bgurl;
    previewArea.setAttribute("style", previewBorder);
    previewArea.setAttribute("src", svgdata);
    doc.body.style.backgroundImage = bgurl;
    downloadLink.href = makeSvgFile(plainsvgTextarea.value);
    downloadLink.style.cursor = "progress";
}
previewArea.onerror = function () {
    previewArea.setAttribute("style", "");
    downloadLink.removeAttribute("href");
    downloadLink.style.cursor = "not-allowed";
    console.log("Malformed image");
};

var svgFile = null;
function makeSvgFile(text) {
    var data = new Blob([text], { type: "image/svg+xml" });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (svgFile !== null) {
        window.URL.revokeObjectURL(svgFile);
    }

    svgFile = window.URL.createObjectURL(data);

    return svgFile;
}

// Tabs Actions
//----------------------------------------

for (var i = 0; i < expanders.length; i++) {
    var expander = expanders[i];

    expander.onclick = function () {
        var parent = this.parentNode;
        var expanded = parent.querySelector("." + expandedClass);
        expanded.classList.toggle("hidden");
        this.classList.toggle("opened");
    };
}

// Switch quotes
//----------------------------------------

quotesInputs.forEach((input) => {
    input.addEventListener("input", function () {
        externalQuotesValue = this.value;
        quotes = getQuotes();
        getResults();
    });
});

// Set example
//----------------------------------------
doc.querySelector("#colorcircles").addEventListener("click", () => {
    plainsvgTextarea.value = `<svg width="110" height="110">
  <circle r="50" cx="55" cy="55" fill="tomato"/>
  <circle r="41" cx="52" cy="55" fill="orange"/>
  <circle r="33" cx="53" cy="58" fill="gold"/>
  <circle r="25" cx="52" cy="56" fill="yellowgreen"/>
  <circle r="17" cx="55" cy="55" fill="lightseagreen"/>
  <circle r="9" cx="60" cy="53" fill="teal"/>
</svg>`;
    getResults();
});

doc.querySelector("#fedi-logo-simplified").addEventListener("click", () => {
    plainsvgTextarea.value = `<svg width="196.52mm" height="196.52mm" version="1.1" viewBox="0 0 196.52 196.52" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
<metadata>
<rdf:RDF>
<cc:Work rdf:about="">
<dc:format>image/svg+xml</dc:format>
<dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/>
<dc:title/>
</cc:Work>
</rdf:RDF>
</metadata>
<g transform="translate(6.679 -32.496)" shape-rendering="auto">
<path transform="matrix(.26458 0 0 .26458 -6.679 32.496)" d="m181.13 275.14a68.892 68.892 0 0 1-29.465 29.328l161.76 162.39 38.998-19.764zm213.36 214.19-38.998 19.764 81.963 82.283a68.892 68.892 0 0 1 29.471-29.332z" color="#000000" color-rendering="auto" dominant-baseline="auto" fill="#a730b8" image-rendering="auto" solid-color="#000000" style="font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
<path transform="matrix(.26458 0 0 .26458 -6.679 32.496)" d="m581.65 339.39-91.576 46.41 6.752 43.189 103.62-52.514a68.892 68.892 0 0 1-18.791-37.086zm-144.74 73.352-216.53 109.73a68.892 68.892 0 0 1 18.795 37.09l204.48-103.63z" color="#000000" color-rendering="auto" dominant-baseline="auto" fill="#5496be" image-rendering="auto" solid-color="#000000" style="font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
<path transform="matrix(.26458 0 0 .26458 -6.679 32.496)" d="m367.28 142.44-104.48 203.97 30.848 30.967 110.62-215.96a68.892 68.892 0 0 1-36.99-18.98zm-131.65 257.02-52.922 103.31a68.892 68.892 0 0 1 36.986 18.979l46.781-91.328z" color="#000000" color-rendering="auto" dominant-baseline="auto" fill="#ce3d1a" image-rendering="auto" solid-color="#000000" style="font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
<path transform="matrix(.26458 0 0 .26458 -6.679 32.496)" d="m150.77 304.92a68.892 68.892 0 0 1-34.416 7.1953 68.892 68.892 0 0 1-6.6504-0.69531l30.902 197.66a68.892 68.892 0 0 1 34.416-7.1953 68.892 68.892 0 0 1 6.6465 0.69531z" color="#000000" color-rendering="auto" dominant-baseline="auto" fill="#d0188f" image-rendering="auto" solid-color="#000000" style="font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
<path transform="matrix(.26458 0 0 .26458 -6.679 32.496)" d="m239.34 560.54a68.892 68.892 0 0 1 0.7207 13.877 68.892 68.892 0 0 1-7.2676 27.18l197.63 31.713a68.892 68.892 0 0 1-0.72266-13.879 68.892 68.892 0 0 1 7.2695-27.178z" color="#000000" color-rendering="auto" dominant-baseline="auto" fill="#5b36e9" image-rendering="auto" solid-color="#000000" style="font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
<path transform="matrix(.26458 0 0 .26458 -6.679 32.496)" d="m601.13 377.2-91.219 178.08a68.892 68.892 0 0 1 36.994 18.982l91.217-178.08a68.892 68.892 0 0 1-36.992-18.984z" color="#000000" color-rendering="auto" dominant-baseline="auto" fill="#30b873" image-rendering="auto" solid-color="#000000" style="font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
<path transform="matrix(.26458 0 0 .26458 -6.679 32.496)" d="m476.72 125.33a68.892 68.892 0 0 1-29.471 29.332l141.27 141.81a68.892 68.892 0 0 1 29.469-29.332z" color="#000000" color-rendering="auto" dominant-baseline="auto" fill="#ebe305" image-rendering="auto" solid-color="#000000" style="font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
<path transform="matrix(.26458 0 0 .26458 -6.679 32.496)" d="m347.79 104.63-178.58 90.498a68.892 68.892 0 0 1 18.793 37.086l178.57-90.502a68.892 68.892 0 0 1-18.791-37.082z" color="#000000" color-rendering="auto" dominant-baseline="auto" fill="#f47601" image-rendering="auto" solid-color="#000000" style="font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
<path transform="matrix(.26458 0 0 .26458 -6.679 32.496)" d="m446.93 154.83a68.892 68.892 0 0 1-34.982 7.4824 68.892 68.892 0 0 1-6.0293-0.63281l15.818 101.29 43.162 6.9258zm-16 167.03 37.4 239.48a68.892 68.892 0 0 1 33.914-6.9434 68.892 68.892 0 0 1 7.207 0.79101l-35.357-226.41z" color="#000000" color-rendering="auto" dominant-baseline="auto" fill="#57c115" image-rendering="auto" solid-color="#000000" style="font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
<path transform="matrix(.26458 0 0 .26458 -6.679 32.496)" d="m188.13 232.97a68.892 68.892 0 0 1 0.75781 14.096 68.892 68.892 0 0 1-7.1602 26.982l101.37 16.281 19.924-38.908zm173.74 27.9-19.926 38.912 239.51 38.467a68.892 68.892 0 0 1-0.69531-13.719 68.892 68.892 0 0 1 7.3496-27.324z" color="#000000" color-rendering="auto" dominant-baseline="auto" fill="#dbb210" image-rendering="auto" solid-color="#000000" style="font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
</g>
<g transform="translate(6.679 -32.496)" fill-opacity=".99597">
<circle transform="rotate(3.1178)" cx="106.27" cy="51.536" r="16.571" fill="#ffca00"/>
<circle transform="rotate(3.1178)" cx="171.43" cy="110.19" r="16.571" fill="#64ff00"/>
<circle transform="rotate(3.1178)" cx="135.76" cy="190.28" r="16.571" fill="#00a3ff"/>
<circle transform="rotate(3.1178)" cx="48.559" cy="181.11" r="16.571" fill="#9500ff"/>
<circle transform="rotate(3.1178)" cx="30.329" cy="95.367" r="16.571" fill="#f00"/>
</g>
</svg>`;
    getResults();
});

doc.querySelector("#use").addEventListener("click", () => {
    plainsvgTextarea.value = `<svg width="26" height="26" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <path fill="green" d="M0 0zm24 9.6c1 0 2 1.4 1 2.4L15 22c-.6.5-1.4.5-2 0l-4-4c-1.2-1.3.7-3.2 2-2l3 3 9-9c.4-.3.7-.4 1-.4z"/></svg>`;
    getResults();
});

doc.querySelector("#animate").addEventListener("click", () => {
    plainsvgTextarea.value = `<svg  width="50" height="50"><style type="text/css">  #c {animation: x 5s alternate infinite;}  @keyframes x { from { fill: gold; } to { fill: purple} }</style><circle id="c" cx="30" cy="30" r="20" fill="gold"/><!-- works in chrome ... not in IE and others --></svg>`;
    getResults();
});

doc.querySelector("#trans").addEventListener("click", () => {
    plainsvgTextarea.value = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">    <path fill="#ddd" d="m0 0h16v32h16V16H0z" /></svg>`;
    getResults();
});

doc.querySelector("#zigzag").addEventListener("click", () => {
    plainsvgTextarea.value = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="30" viewBox="0 0 20 30">
  <path fill="none" stroke="#6a6" stroke-width="10" d="m-13.6 27 23-20.7 26.5 22"/>
</svg>`;
    getResults();
});

// Preview Background Switch
//----------------------------------------

contrastButton.onchange = function () {
    previewArea.style.background = contrastButton.value;
    doc.body.style.backgroundColor = contrastButton.value;
};

// Namespace
//----------------------------------------

function addNameSpace(data) {
    if (data.indexOf("http://www.w3.org/2000/svg") < 0) {
        data = data.replace(
            /<svg/g,
            `<svg xmlns=${quotes.level2}http://www.w3.org/2000/svg${quotes.level2}`
        );
    }

    return data;
}

// Encoding
//----------------------------------------

function encodeSVG(data) {
    // Use single quotes instead of double to avoid encoding.
    if (externalQuotesValue === "double") {
        data = data.replace(/"/g, "'");
    } else {
        data = data.replace(/'/g, '"');
    }

    data = data.replace(/>\s{1,}</g, "><");
    data = data.replace(/\s{2,}/g, " ");

    return data.replace(symbols, encodeURIComponent);
}

// Get quotes for levels
//----------------------------------------

function getQuotes() {
    const double = `"`;
    const single = `'`;

    return {
        level1: externalQuotesValue === "double" ? double : single,
        level2: externalQuotesValue === "double" ? single : double
    };
}

function dragDropTextLoader(dropTargetTextarea, textHandler, filesHandler) {
    dropTargetTextarea.addEventListener("dragover", function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "copy";
    });
    dropTargetTextarea.addEventListener("drop", function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var files = evt.dataTransfer.files;
        var count = files.length;
        var filesObj = [];
        function loadEndHandler(i) {
            return function (event) {
                var file = files[i];
                var name = file.name;
                //dropTargetTextarea.value = event.target.result;
                textHandler(event.target.result);
                filesObj.push({ name: name, content: event.target.result });
                if (filesObj.length == count) {
                    if (filesHandler) {
                        filesHandler(filesObj);
                    }
                }
            };
        }
        for (var i = 0; i < files.length; i++) {
            var reader = new FileReader();
            reader.onload = loadEndHandler(i);
            reader.readAsText(files[i], "UTF-8");
        }
    });
}

function putText(txt) {
    plainsvgTextarea.value = txt;
    getResults();
}
function filesReady(files) {
    console.log(files);
}
dragDropTextLoader(plainsvgTextarea, putText, filesReady);
