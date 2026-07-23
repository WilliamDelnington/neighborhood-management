import{R as x,r as g}from"./vendor-react-Dyk2Mbpm.js";import{B as u,P as f,H as b}from"./PageLayout-BIzk6KRu.js";import{A as w}from"./AppBottomNav-CbY4pCjf.js";import{A as y,U as v,E as H}from"./utinities-NSXD9pvw.js";import{q as e}from"./vendor-ui-DSLGHbw-.js";import{j as t,a as i,I as N,h,i as T,B as m,T as p}from"./vendor-zmp-B1YMxWW5.js";import{h as I}from"./index-Bh7g3j9E.js";import{f as $}from"./announcementApi-BRVAN-W4.js";import{L as C}from"./domain-CrSbarT2.js";import{u as z}from"./index-BRzG-Inz.js";const S=()=>t("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:t("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-.836 1.71l-1.174.588a.75.75 0 0 0-.375.977 8.024 8.024 0 0 0 4.679 4.679.75.75 0 0 0 .977-.375l.588-1.174a1.5 1.5 0 0 1 1.71-.836l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z",fill:"currentColor"})}),k=e.div`
    ${{borderRadius:"1rem","--tw-text-opacity":"1",color:"rgb(255 255 255 / var(--tw-text-opacity, 1))"}};
    margin: 16px;
    padding: 16px;
    background: linear-gradient(
            135deg,
            rgba(37, 99, 235, 0.95),
            rgba(29, 78, 216, 0.95)
        ),
        url(${u});
    background-size: cover;
    background-position: center;
`,B=e.div`
    ${{fontSize:"0.75rem",lineHeight:"1rem",fontWeight:"500",color:"rgba(255, 255, 255, 0.7)"}};
    letter-spacing: 1px;
`,P=e.div`
    ${{fontSize:"1.25rem",lineHeight:"1.75rem",fontWeight:"700"}};
    margin-top: 4px;
`,A=e.div`
    ${{display:"flex",flexDirection:"row",alignItems:"center",fontSize:"0.75rem",lineHeight:"1rem",color:"rgba(255, 255, 255, 0.7)"}};
    margin-top: 8px;
    .zaui-icon {
        margin-right: 4px;
        font-size: 14px;
    }
`,E=r=>{const{title:c,address:o}=r;return i(k,{children:[t(B,{children:"CỔNG THÔNG TIN ĐIỆN TỬ"}),t(P,{children:c}),i(A,{children:[t(N,{icon:"zi-location"}),t("span",{children:o})]})]})},R=e.div`
    ${{display:"flex",flexDirection:"row",alignItems:"center",borderRadius:"1rem","--tw-bg-opacity":"1",backgroundColor:"rgb(254 242 242 / var(--tw-bg-opacity, 1))"}};
    margin: 8px 16px 0;
    padding: 12px 16px;
`,_=e.div`
    ${{display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"9999px","--tw-bg-opacity":"1",backgroundColor:"rgb(254 226 226 / var(--tw-bg-opacity, 1))","--tw-text-opacity":"1",color:"rgb(220 38 38 / var(--tw-text-opacity, 1))"}};
    width: 40px;
    height: 40px;
    margin-right: 12px;
    flex-shrink: 0;
`,L=e.div`
    ${{fontSize:"0.875rem",lineHeight:"1.25rem",fontWeight:"600","--tw-text-opacity":"1",color:"rgb(220 38 38 / var(--tw-text-opacity, 1))"}};
`,W=e.div`
    ${{display:"flex",flexDirection:"row",flexWrap:"wrap",alignItems:"center",fontSize:"0.75rem",lineHeight:"1rem","--tw-text-opacity":"1",color:"rgb(118 122 127 / var(--tw-text-opacity, 1))"}};
    margin-top: 2px;
`,D=e.span`
    ${{fontWeight:"500","--tw-text-opacity":"1",color:"rgb(239 68 68 / var(--tw-text-opacity, 1))"}};
`,j=e.span`
    ${{"--tw-text-opacity":"1",color:"rgb(185 189 193 / var(--tw-text-opacity, 1))"}};
    margin: 0 4px;
`,q=r=>{const{hotlines:c}=r,o=h(),s=(a,l)=>{a.stopPropagation(),T({phoneNumber:l})};return i(R,{onClick:()=>o("/emergency",{animate:!0}),children:[t(_,{children:t(S,{})}),i("div",{children:[t(L,{children:"Liên hệ khẩn cấp"}),t(W,{children:c.map((a,l)=>i(x.Fragment,{children:[l>0&&t(j,{children:"·"}),i(D,{onClick:d=>s(d,a.phoneNumber),children:[a.label," ",a.phoneNumber]})]},a.key))})]})]})},G=e.div`
    ${{borderRadius:"1rem","--tw-bg-opacity":"1",backgroundColor:"rgb(255 255 255 / var(--tw-bg-opacity, 1))"}};
    margin: 8px 16px 16px;
    padding: 16px;
`,O=e.div`
    ${{fontSize:"0.875rem",lineHeight:"1.25rem",fontWeight:"600","--tw-text-opacity":"1",color:"rgb(20 20 21 / var(--tw-text-opacity, 1))"}};
`,U=e.div`
    ${{fontSize:"0.75rem",lineHeight:"1rem","--tw-text-opacity":"1",color:"rgb(118 122 127 / var(--tw-text-opacity, 1))"}};
    margin-top: 4px;
`,M=r=>{const{title:c,description:o}=r,s=h();return i(G,{onClick:()=>s("/emergency",{animate:!0}),children:[t(O,{children:c}),t(U,{children:o})]})},nt=()=>{const r=h(),c=z(n=>n.user),[o,s]=g.useState([]),[a,l]=g.useState(!0),d=y.filter(n=>!n.requiredPermission||I(c,n.requiredPermission));return g.useEffect(()=>{$(1,3).then(n=>s(n.items)).catch(()=>s([])).finally(()=>l(!1))},[]),i(f,{id:"home-page",customHeader:t(b,{title:"Tổ dân phố Hòa Bình"}),bottomNav:t(w,{}),children:[t(E,{title:"Tổ dân phố Hòa Bình",address:"Phường Dương Nội, TP Hà Nội"}),t(v,{utinities:d}),i(m,{className:"bg-white mt-2 p-4",children:[i(m,{flex:!0,justifyContent:"space-between",alignItems:"center",mb:2,children:[t(p.Title,{size:"small",children:"Thông báo mới nhất"}),t(p,{size:"xSmall",className:"text-main",onClick:()=>r("/announcements",{animate:!0}),children:"Xem tất cả"})]}),!a&&o.length===0&&t(p,{size:"xSmall",className:"text-text_2",children:"Chưa có thông báo nào."}),o.map(n=>i(m,{py:2,className:"border-b border-divider_01 last:border-0",onClick:()=>r(`/announcements/${n._id}`,{animate:!0}),children:[i(p,{size:"small",className:"font-medium",children:[n.pinned?"📌 ":"",n.title]}),t(p,{size:"xxSmall",className:"text-text_2",children:C[n.category]})]},n._id))]}),t(q,{hotlines:H}),t(M,{title:"Thông tin liên hệ tổ dân phố",description:"Tổ trưởng tổ dân phố Hòa Bình, phường Dương Nội, TP Hà Nội"})]})};export{nt as default};
