import{r as s,R as m}from"./vendor-react-Dyk2Mbpm.js";import{q as r}from"./vendor-ui-DSLGHbw-.js";import{r as d,A as p,D as w}from"./index-BRzG-Inz.js";import{h as v,a as c,B as y,j as a,I as f,H as k,P as I}from"./vendor-zmp-B1YMxWW5.js";const C=""+new URL("logo-DCGAmU5T.png",import.meta.url).href,P=(t=1,e=w,o=!1)=>d("GET",p.NOTIFICATIONS,{page:t,limit:e,unreadOnly:o?"true":void 0}),z=()=>d("GET",p.NOTIFICATIONS_UNREAD_COUNT),_=t=>d("POST",`${p.NOTIFICATIONS}/${t}/read`),j=()=>d("POST",p.NOTIFICATIONS_READ_ALL),N=r.div`
    ${{position:"fixed",left:"0px",top:"0px",display:"flex",width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"space-between","--tw-bg-opacity":"1",backgroundColor:"rgb(255 255 255 / var(--tw-bg-opacity, 1))",paddingLeft:"1rem",paddingRight:"1rem","--tw-text-opacity":"1",color:"rgb(20 20 21 / var(--tw-text-opacity, 1))"}};
    height: calc(48px + var(--zaui-safe-area-inset-top, 0px));
    padding-top: var(--zaui-safe-area-inset-top);
    z-index: 1;
    box-shadow: inset 0 -1px 0 0 #e9ebed;
`,T=r.div`
    ${{overflow:"hidden",borderRadius:"0.5rem"}};
    width: 32px;
    height: 32px;
    margin-right: 8px;
    flex-shrink: 0;
`,R=r.div`
    ${{fontSize:"1rem",lineHeight:"1.5rem",fontWeight:"600"}}
`,B=r.div`
    ${{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}};
    width: 32px;
    height: 32px;
`,O=r.div`
    ${{position:"absolute",borderRadius:"9999px","--tw-bg-opacity":"1",backgroundColor:"rgb(239 68 68 / var(--tw-bg-opacity, 1))"}};
    top: 4px;
    right: 4px;
    width: 8px;
    height: 8px;
`,F=t=>{const{title:e}=t,o=v(),[i,n]=s.useState(0);return s.useEffect(()=>{z().then(l=>n(l.count)).catch(()=>n(0))},[]),c(N,{children:[c(y,{flex:!0,alignItems:"center",children:[a(T,{children:a("img",{src:C,alt:e,width:32,height:32})}),a(R,{children:e})]}),c(B,{onClick:()=>o("/notifications",{animate:!0}),children:[a(f,{icon:"zi-notif"}),i>0&&a(O,{})]})]})},A=""+new URL("header-background-BUzz8hlB.png",import.meta.url).href,S=r(k)`
    ${{position:"fixed",left:"0px",top:"0px",display:"flex",height:"calc(48px + var(--zaui-safe-area-inset-top, 0px))",width:"100%",flexDirection:"row",alignItems:"center","--tw-bg-opacity":"1",backgroundColor:"rgb(37 99 235 / var(--tw-bg-opacity, 1))",paddingLeft:"1rem",paddingRight:"1rem","--tw-text-opacity":"1",color:"rgb(255 255 255 / var(--tw-text-opacity, 1))"}};
    z-index: 1;
    background: linear-gradient(
            0deg,
            rgba(37, 99, 235, 0.92),
            rgba(37, 99, 235, 0.92)
        ),
        url(${A});
    background-size: cover;
    background-position: center;
    .zaui-btn-icon {
        ${{"--tw-text-opacity":"1",color:"rgb(255 255 255 / var(--tw-text-opacity, 1))"}}
    }
    .zaui-header-back-btn:active {
        background-color: transparent;
    }
    &:after {
        display: none;
    }
    .zaui-header-title {
        padding-right: 98px;
    }
`,$=t=>{const{title:e,back:o,onBackClick:i}=t;return a(S,{title:e,backIcon:a(f,{icon:"zi-arrow-left"}),showBackIcon:o,onBackClick:i})},H=r(I)`
    ${{"--tw-bg-opacity":"1",backgroundColor:"rgb(234 235 237 / var(--tw-bg-opacity, 1))"}}
    padding: calc(var(--zaui-safe-area-inset-top, 0px) + 48px) 0 var(--zaui-safe-area-inset-bottom) 0;
    ${({$bg:t})=>t?{backgroundColor:t}:""}
`,G=m.forwardRef((t,e)=>{const{title:o,children:i,customHeader:n,restoreScrollBackOnly:l=!0,restoreScroll:h,bg:x,bottomNav:g,...b}=t,u=s.useRef(null);return s.useImperativeHandle(e,()=>u.current),c(H,{...b,restoreScroll:h,restoreScrollOnBack:l,ref:u,$bg:x,style:g?{paddingBottom:64}:void 0,children:[n||a($,{title:o,back:!0}),i,g]})});export{A as B,$ as D,F as H,C as L,G as P,P as a,_ as b,z as f,j as m};
