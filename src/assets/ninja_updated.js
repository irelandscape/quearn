(() => {
    window.SteemNinja = window.SteemNinja || {};
    window.SteemNinja.version = '1.0.0';
    window.SteemNinja.author = 'wehmoen';
    window.SteemNinja.prices = {
        account_15: 250
    };

    window.SteemNinja.widgetClass = 'ninja-widget';

    window.SteemNinja.widgetURL = 'https://widget.steem.ninja/widget.html';

    window.SteemNinja.widgetFrame = null;

    window.SteemNinja.widgetFrame = document.createElement('iframe');
    window.SteemNinja.widgetFrame.id = "ninja-frame";
    window.SteemNinja.widgetFrame.setAttribute("style", 'display:none;position:fixed;left:0;top:0;z-index:10000000;border:0;width:100%;height:100%;');
    document.body.appendChild(window.SteemNinja.widgetFrame);

    function launchSteemNinja (referrer, name, image, title) {
        window.SteemNinja.widgetFrame.src = window.SteemNinja.widgetURL + '?referrer=' + referrer + '&name=' + name + '&image=' + image + '&title=' + title;
        window.SteemNinja.widgetFrame.onload = () => {
            document.body.style.overflowY = "hidden";
            window.SteemNinja.widgetFrame.style.display = 'block';
            window.SteemNinja.widgetFrame.focus();
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const widgetsOnPage = document.getElementsByClassName(window.SteemNinja.widgetClass);

        window.SteemNinja.onWidgetLinkClick = (event) => {
            event.preventDefault();
            const referrer = event.target.getAttribute('data-referrer');
            const name = event.target.getAttribute('data-name');
            const image = event.target.getAttribute('data-image');
            const title = event.target.getAttribute('title');
            launchSteemNinja(referrer, name, image, title);
        };

        Array.from(widgetsOnPage).forEach(widget => {
            widget.onclick = window.SteemNinja.onWidgetLinkClick;
        });

        window.addEventListener('message', (event) => {
            if (~event.origin.indexOf('https://widget.steem.ninja')) {
                if (typeof event.data === "string") {
                    document.body.style.overflowY = "auto";
                    window.SteemNinja.widgetFrame.style.display = 'none';
                }
            }
        });
        console.log("%c ", "padding: 50px;background:url('https://cdn.steem.ninja/Steem_Ninja_Head_Logo.png'); background-size:cover;");
        console.log("[Steen.Ninja] v"+window.SteemNinja.version);
        console.log("[Steem.Ninja] loaded. Found", Array.from(widgetsOnPage).length, "widgets.");

    }, false);

})();
