import{r as d,R as b}from"./vendor-react-Dyk2Mbpm.js";import{q as a}from"./vendor-ui-DSLGHbw-.js";import{u as l}from"./index-DkVQl7dS.js";import{h as m,a as s,B as w,j as e,I as u,H as v,P as y}from"./vendor-zmp-C-z0RYEK.js";const k=""+new URL("logo-DCGAmU5T.png",import.meta.url).href,z=a.div`
    ${{position:"fixed",left:"0px",top:"0px",display:"flex",width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"space-between","--tw-bg-opacity":"1",backgroundColor:"rgb(255 255 255 / var(--tw-bg-opacity, 1))",paddingLeft:"1rem",paddingRight:"1rem","--tw-text-opacity":"1",color:"rgb(20 20 21 / var(--tw-text-opacity, 1))"}};
    height: calc(48px + var(--zaui-safe-area-inset-top, 0px));
    padding-top: var(--zaui-safe-area-inset-top);
    z-index: 1;
    box-shadow: inset 0 -1px 0 0 #e9ebed;
`,B=a.div`
    ${{overflow:"hidden",borderRadius:"0.5rem"}};
    width: 32px;
    height: 32px;
    margin-right: 8px;
    flex-shrink: 0;
`,C=a.div`
    ${{fontSize:"1rem",lineHeight:"1.5rem",fontWeight:"600"}}
`,H=a.div`
    ${{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}};
    width: 32px;
    height: 32px;
`,R=a.div`
    ${{position:"absolute",borderRadius:"9999px","--tw-bg-opacity":"1",backgroundColor:"rgb(239 68 68 / var(--tw-bg-opacity, 1))"}};
    top: 4px;
    right: 4px;
    width: 8px;
    height: 8px;
`,N=t=>{const{title:r}=t,o=m(),i=l(n=>n.unreadCount),c=l(n=>n.refreshNotificationStatus);return d.useEffect(()=>{c()},[c]),s(z,{children:[s(w,{flex:!0,alignItems:"center",children:[e(B,{children:e("img",{src:k,alt:r,width:32,height:32})}),e(C,{children:r})]}),s(H,{onClick:()=>o("/notifications",{animate:!0}),children:[e(u,{icon:"zi-notif"}),i>0&&e(R,{})]})]})},$=""+new URL("header-background-BUzz8hlB.png",import.meta.url).href,I=a(v)`
    ${{position:"fixed",left:"0px",top:"0px",display:"flex",height:"calc(48px + var(--zaui-safe-area-inset-top, 0px))",width:"100%",flexDirection:"row",alignItems:"center","--tw-bg-opacity":"1",backgroundColor:"rgb(37 99 235 / var(--tw-bg-opacity, 1))",paddingLeft:"1rem",paddingRight:"1rem","--tw-text-opacity":"1",color:"rgb(255 255 255 / var(--tw-text-opacity, 1))"}};
    z-index: 1;
    background: linear-gradient(
            0deg,
            rgba(37, 99, 235, 0.92),
            rgba(37, 99, 235, 0.92)
        ),
        url(${$});
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
`,L=t=>{const{title:r,back:o,onBackClick:i}=t;return e(I,{title:r,backIcon:e(u,{icon:"zi-arrow-left"}),showBackIcon:o,onBackClick:i})},S=a(y)`
    ${{"--tw-bg-opacity":"1",backgroundColor:"rgb(234 235 237 / var(--tw-bg-opacity, 1))"}}
    padding: calc(var(--zaui-safe-area-inset-top, 0px) + 48px) 0 var(--zaui-safe-area-inset-bottom) 0;
    ${({$bg:t})=>t?{backgroundColor:t}:""}
`,q=b.forwardRef((t,r)=>{const{title:o,children:i,customHeader:c,restoreScrollBackOnly:n=!0,restoreScroll:f,bg:h,bottomNav:p,...x}=t,g=d.useRef(null);return d.useImperativeHandle(r,()=>g.current),s(S,{...x,restoreScroll:f,restoreScrollOnBack:n,ref:g,$bg:h,style:p?{paddingBottom:64}:void 0,children:[c||e(L,{title:o,back:!0}),i,p]})});export{$ as B,L as D,N as H,k as L,q as P};
