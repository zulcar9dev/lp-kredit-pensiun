import Script from "next/script";
import { PIXEL_ID } from "@/lib/pixel";
import { PIXEL_CONTENT_NAME } from "@/lib/constants";

export function PixelScript() {
  if (!PIXEL_ID) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${PIXEL_ID}');
        // PRD §4.1: PageView memakai event_id agar bisa didedup dengan CAPI.
        (function () {
          var eid = (window.crypto && window.crypto.randomUUID)
            ? window.crypto.randomUUID()
            : ('pv-' + Date.now() + '-' + Math.random().toString(36).slice(2, 12));
          try {
            window.sessionStorage.setItem('lp-pensiunku:pageview-eid', eid);
          } catch (e) {}
          fbq('track', 'PageView', { content_name: '${PIXEL_CONTENT_NAME}' }, { eventID: eid });
        })();
      `}
    </Script>
  );
}
