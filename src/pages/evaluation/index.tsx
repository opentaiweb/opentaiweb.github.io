import React, { useState, useEffect } from 'react';
import PcHeader from "@/components/header/pcHeader";
import PcFooter from "@/components/footer/pcFooter";
import { connect } from 'umi';

const Evaluation = ({ global: { language } }) => {
    const [route, setRoute] = useState(localStorage.getItem("evalRoute") || "/main/eval?");
    const [lang, setLang] = useState("");
    const [iframeHeight, setIframeHeight] = useState(1200);

    useEffect(() => {
        window.removeEventListener('message', (e) => { }, false);
    }, [])

    useEffect(() => {
        const defaultLang = (language || localStorage.getItem("umi_locale") || navigator.language).toLowerCase();
        if (defaultLang === "zh" || defaultLang === "zh-cn") {
            setLang("zh");
        } else {
            setLang("en");
        }
    }, [language]);

    window.addEventListener('message', (e) => {
        if (e.data.type === "sizeChange") {
            setIframeHeight(e.data.height + 10);
        } else if (e.data.type === "urlChange") {
            let url = e.data.url;
            let redirectUrl = url.match(/(?<=).+(?=lang)/);
            if (url.indexOf("eval") >= 0) {
                if (redirectUrl === null) {
                    if (url !== route) {
                        if (url.match(/[^?]+(?=\?)/)?.length > 0) {
                            setRoute(url);
                            localStorage.setItem("evalRoute", url);
                        } else {
                            setRoute(`${url}?`);
                            localStorage.setItem("evalRoute", `${url}?`);
                        }
                    }
                } else if (redirectUrl !== null && redirectUrl?.length > 0) {
                    if (redirectUrl[0] !== route) {
                        setRoute(redirectUrl[0]);
                        localStorage.setItem("evalRoute", redirectUrl[0]);
                    }
                }
            }
        }
    }, false);

    return (
        <>
            <PcHeader />
            <iframe style={{ border: "none" }} height={iframeHeight} width={"100%"} src={`https://tech.openeglab.org.cn${route}&lang=${lang}`} />
            <PcFooter />
        </>
    )
}

export default connect(({ global }) => ({
    global
}))(Evaluation);