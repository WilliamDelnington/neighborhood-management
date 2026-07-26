import{R as f,r as g}from"./vendor-react-Dyk2Mbpm.js";import{B as b,P as w,H as y}from"./PageLayout-ZVzkrFDF.js";import{A as v}from"./AppBottomNav-fXcIE7Ui.js";import{A as N,U as H,E as T}from"./utinities-DjZEeBmD.js";import{q as n}from"./vendor-ui-DSLGHbw-.js";import{j as e,a as i,I,h,i as $,B as m,T as p}from"./vendor-zmp-C-z0RYEK.js";import{h as C}from"./index-BvIzGHrq.js";import{f as k}from"./announcementApi-CDAnDH-i.js";import{L as z}from"./domain-DKigGBjk.js";import{u as x}from"./index-DkVQl7dS.js";const S=()=>e("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-.836 1.71l-1.174.588a.75.75 0 0 0-.375.977 8.024 8.024 0 0 0 4.679 4.679.75.75 0 0 0 .977-.375l.588-1.174a1.5 1.5 0 0 1 1.71-.836l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z",fill:"currentColor"})}),B=n.div`
    ${{borderRadius:"1rem","--tw-text-opacity":"1",color:"rgb(255 255 255 / var(--tw-text-opacity, 1))"}};
    margin: 16px;
    padding: 16px;
    background: linear-gradient(
            135deg,
            rgba(37, 99, 235, 0.95),
            rgba(29, 78, 216, 0.95)
        ),
        url(${b});
    background-size: cover;
    background-position: center;
`,P=n.div`
    ${{fontSize:"0.75rem",lineHeight:"1rem",fontWeight:"500",color:"rgba(255, 255, 255, 0.7)"}};
    letter-spacing: 1px;
`,A=n.div`
    ${{fontSize:"1.25rem",lineHeight:"1.75rem",fontWeight:"700"}};
    margin-top: 4px;
`,E=n.div`
    ${{display:"flex",flexDirection:"row",alignItems:"center",fontSize:"0.75rem",lineHeight:"1rem",color:"rgba(255, 255, 255, 0.7)"}};
    margin-top: 8px;
    .zaui-icon {
        margin-right: 4px;
        font-size: 14px;
    }
`,R=r=>{const{title:a,address:c}=r;return i(B,{children:[e(P,{children:"CỔNG THÔNG TIN ĐIỆN TỬ"}),e(A,{children:a}),i(E,{children:[e(I,{icon:"zi-location"}),e("span",{children:c})]})]})},_=n.div`
    ${{display:"flex",flexDirection:"row",alignItems:"center",borderRadius:"1rem","--tw-bg-opacity":"1",backgroundColor:"rgb(254 242 242 / var(--tw-bg-opacity, 1))"}};
    margin: 8px 16px 0;
    padding: 12px 16px;
`,L=n.div`
    ${{display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"9999px","--tw-bg-opacity":"1",backgroundColor:"rgb(254 226 226 / var(--tw-bg-opacity, 1))","--tw-text-opacity":"1",color:"rgb(220 38 38 / var(--tw-text-opacity, 1))"}};
    width: 40px;
    height: 40px;
    margin-right: 12px;
    flex-shrink: 0;
`,W=n.div`
    ${{fontSize:"0.875rem",lineHeight:"1.25rem",fontWeight:"600","--tw-text-opacity":"1",color:"rgb(220 38 38 / var(--tw-text-opacity, 1))"}};
`,D=n.div`
    ${{display:"flex",flexDirection:"row",flexWrap:"wrap",alignItems:"center",fontSize:"0.75rem",lineHeight:"1rem","--tw-text-opacity":"1",color:"rgb(118 122 127 / var(--tw-text-opacity, 1))"}};
    margin-top: 2px;
`,j=n.span`
    ${{fontWeight:"500","--tw-text-opacity":"1",color:"rgb(239 68 68 / var(--tw-text-opacity, 1))"}};
`,U=n.span`
    ${{"--tw-text-opacity":"1",color:"rgb(185 189 193 / var(--tw-text-opacity, 1))"}};
    margin: 0 4px;
`,q=r=>{const{hotlines:a}=r,c=h(),s=(o,l)=>{o.stopPropagation(),$({phoneNumber:l})};return i(_,{onClick:()=>c("/emergency",{animate:!0}),children:[e(L,{children:e(S,{})}),i("div",{children:[e(W,{children:"Liên hệ khẩn cấp"}),e(D,{children:a.map((o,l)=>i(f.Fragment,{children:[l>0&&e(U,{children:"·"}),i(j,{onClick:d=>s(d,o.phoneNumber),children:[o.label," ",o.phoneNumber]})]},o.key))})]})]})},G=n.div`
    ${{borderRadius:"1rem","--tw-bg-opacity":"1",backgroundColor:"rgb(255 255 255 / var(--tw-bg-opacity, 1))"}};
    margin: 8px 16px 16px;
    padding: 16px;
`,M=n.div`
    ${{fontSize:"0.875rem",lineHeight:"1.25rem",fontWeight:"600","--tw-text-opacity":"1",color:"rgb(20 20 21 / var(--tw-text-opacity, 1))"}};
`,O=n.div`
    ${{fontSize:"0.75rem",lineHeight:"1rem","--tw-text-opacity":"1",color:"rgb(118 122 127 / var(--tw-text-opacity, 1))"}};
    margin-top: 4px;
`,V=r=>{const{title:a,description:c}=r,s=h();return i(G,{onClick:()=>s("/emergency",{animate:!0}),children:[e(M,{children:a}),e(O,{children:c})]})},ie=()=>{const r=h(),a=x(t=>t.user),c=x(t=>t.hasUnreadMeetingNotification),[s,o]=g.useState([]),[l,d]=g.useState(!0),u=N.filter(t=>!t.requiredPermission||C(a,t.requiredPermission)).map(t=>({...t,showBadge:t.key==="meetings"?c:void 0}));return g.useEffect(()=>{k(1,3).then(t=>o(t.items)).catch(()=>o([])).finally(()=>d(!1))},[]),i(w,{id:"home-page",customHeader:e(y,{title:"Tổ dân phố Hòa Bình"}),bottomNav:e(v,{}),children:[e(R,{title:"Tổ dân phố Hòa Bình",address:"Phường Dương Nội, TP Hà Nội"}),e(H,{utinities:u}),i(m,{className:"bg-white mt-2 p-4",children:[i(m,{flex:!0,justifyContent:"space-between",alignItems:"center",mb:2,children:[e(p.Title,{size:"small",children:"Thông báo mới nhất"}),e(p,{size:"xSmall",className:"text-main",onClick:()=>r("/announcements",{animate:!0}),children:"Xem tất cả"})]}),!l&&s.length===0&&e(p,{size:"xSmall",className:"text-text_2",children:"Chưa có thông báo nào."}),s.map(t=>i(m,{py:2,className:"border-b border-divider_01 last:border-0",onClick:()=>r(`/announcements/${t._id}`,{animate:!0}),children:[i(p,{size:"small",className:"font-medium",children:[t.pinned?"📌 ":"",t.title]}),e(p,{size:"xxSmall",className:"text-text_2",children:z[t.category]})]},t._id))]}),e(q,{hotlines:T}),e(V,{title:"Thông tin liên hệ tổ dân phố",description:"Tổ trưởng tổ dân phố Hòa Bình, phường Dương Nội, TP Hà Nội"})]})};export{ie as default};
