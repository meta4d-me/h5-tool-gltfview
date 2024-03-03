let loadFile = (file, responseType) => {
    return new Promise((res, rej) => {
        let req = new XMLHttpRequest();
        req.open("GET", file);
        if (responseType) req.responseType = responseType;
        req.onreadystatechange = () => {
            if (req.readyState == 4 && req.status == 200) { res(req.response); }
        };
        req.onerror = (ev) => {
            rej(new Error(`URL : ${file} \n onerr on req: ${ev}`));
        };
        req.send();
    });
}


let loadJS = (file, htmlParent) => {
    return new Promise((res, rej) => {
        let s = document.createElement("script");
        s.type = `text/javascript`;
        s.src = file;
        htmlParent.appendChild(s);
        s.onload = () => { res(true); }
        s.onerror = (ev) => { rej(new Error(ev)); }
    });
}

//全局注册
/**
 * 启动 gltf view
 * @param {*HTMLDivElement} htmlDiv html DIV容器
 * @param {*string} urlParameter URL 参数
 */
globalThis.gltfView = (htmlDiv, urlParameter, CNDURL) => {
    //间接传递 gltfView 需要的URL 参数
    globalThis.gltfViewHREF = `http://x?${urlParameter}`;

    //H5 引擎启动
    let init = () => {
        resRootPath = CNDURL + resRootPath;
        window.onload = null;
        //引擎App
        let app = new m4m.framework.application();
        //引擎启动
        app.start(htmlDiv, m4m.framework.CanvasFixedType.Free, 720);
        app.bePlay = true;
        //查看器对象
        let gltfViewObj = new HDR_sample();
        //app 添加 执行对象
        app.addUserCodeDirect({
            onStart: (app) => { gltfViewObj.start(app); },
            onUpdate: (dt) => { gltfViewObj.update(dt); },
            isClosed: () => false,
        });
    }

    let jsFiles = [
        "lib/webgl-util.js",
        "lib/Reflect.js",
        "lib/m4m.js",
        "lib/example.js",
    ];


    let onLoadJS = () => {
        if (jsFiles.length <= 0) {
            init();
            return;
        }
        let jsURL = CNDURL + jsFiles.shift();
        let p = loadJS(jsURL, htmlDiv.parentElement);
        p.then(onLoadJS);
    }

    onLoadJS();
}
