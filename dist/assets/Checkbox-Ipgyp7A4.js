import{q as r,$ as c}from"./vendor-ui-DSLGHbw-.js";import{j as a,o as p,a as u,F as b,p as n,R as s,C as l}from"./vendor-zmp-B1YMxWW5.js";import{r as o}from"./vendor-react-Dyk2Mbpm.js";const g=r(p)`
    ${{"--tw-bg-opacity":"1",backgroundColor:"rgb(37 99 235 / var(--tw-bg-opacity, 1))","--tw-text-opacity":"1",color:"rgb(255 255 255 / var(--tw-text-opacity, 1))"}}
    &.zaui-btn-disabled:disabled {
        ${{backgroundColor:"transparent"}}
    }
    &.zaui-btn-loading {
        ${{"--tw-bg-opacity":"1",backgroundColor:"rgb(37 99 235 / var(--tw-bg-opacity, 1))","--tw-text-opacity":"1",color:"rgb(255 255 255 / var(--tw-text-opacity, 1))"}}
    }
    &:focus,
    &:active {
        ${{"--tw-bg-opacity":"1",backgroundColor:"rgb(37 99 235 / var(--tw-bg-opacity, 1))","--tw-text-opacity":"1",color:"rgb(255 255 255 / var(--tw-text-opacity, 1))"}}
    }
`;r.div`
    ${{display:"flex",flexDirection:"column",alignItems:"center"}}
`;r.div`
    ${{marginTop:"0.5rem",fontSize:"1rem",lineHeight:"1.5rem","--tw-text-opacity":"1",color:"rgb(255 255 255 / var(--tw-text-opacity, 1))"}}
`;r(p)`
    ${{backgroundColor:"rgba(0, 0, 0, 0.2)",fontWeight:"400"}}
`;const z=t=>a(g,{...t}),d=r(n)`
    ${{borderColor:"transparent","--tw-bg-opacity":"1",backgroundColor:"rgb(244 245 246 / var(--tw-bg-opacity, 1))","&:focus":{borderColor:"transparent"},"&:focus-visible":{borderColor:"transparent"}}}
    .zaui-input-group-addon {
        ${{marginBottom:"0.75rem"}}

        .zaui-input-label {
            ${{fontSize:"15px",fontWeight:"500","--tw-text-opacity":"1",color:"rgb(20 20 21 / var(--tw-text-opacity, 1))",lineHeight:"20px"}}
        }
    }
    .zaui-input-status-error {
        ${{"--tw-border-opacity":"1",borderColor:"rgb(220 31 24 / var(--tw-border-opacity, 1))"}}
    }
`,w=r(n.TextArea)`
    ${{borderColor:"transparent","--tw-bg-opacity":"1",backgroundColor:"rgb(244 245 246 / var(--tw-bg-opacity, 1))","&:focus":{borderTopColor:"transparent"},"&:focus-visible":{borderColor:"transparent"}}}
    .zaui-input-group-addon {
        ${{marginBottom:"0.75rem"}}

        .zaui-input-label {
            ${{fontSize:"15px",fontWeight:"500","--tw-text-opacity":"1",color:"rgb(20 20 21 / var(--tw-text-opacity, 1))",lineHeight:"20px"}}
        }
    }
`,x=c`
    .zaui-input-textarea-affix-wrapper,.zaui-input-affix-wrapper{
        ${{borderColor:"transparent","--tw-bg-opacity":"1",backgroundColor:"rgb(244 245 246 / var(--tw-bg-opacity, 1))","&:focus":{borderTopColor:"transparent"},"&:focus-visible":{borderColor:"transparent"}}}
    }
    .zaui-input-textarea-affix-wrapper,.zaui-input-affix-wrapper,.zaui-input-group-wrapper-status-error{
 
        .zaui-input-textarea,.zaui-input-affix-wrapper-status-error,&.zaui-input-affix-wrapper-status-error {
            ${{"--tw-border-opacity":"1",borderColor:"rgb(220 31 24 / var(--tw-border-opacity, 1))"}}
        }
    }
`,$=o.forwardRef((t,i)=>{const e=o.useRef(null);return o.useImperativeHandle(i,()=>e.current?.input),a(d,{...t,ref:e})}),k=o.forwardRef((t,i)=>{const e=o.useRef(null);return o.useImperativeHandle(i,()=>e.current?.textarea),u(b,{children:[a(x,{}),a(w,{...t,ref:e})]})}),f=r(s)`
    .zaui-radio-checked .zaui-radio-checkmark {
        ${{"--tw-bg-opacity":"1",backgroundColor:"rgb(37 99 235 / var(--tw-bg-opacity, 1))"}}
    }
`,h=t=>a(f,{...t}),y=r(l)`
    .zaui-checkbox-inner {
        ${{borderRadius:"1.5rem"}}
    }

    &.zaui-checkbox-checked .zaui-checkbox-inner {
        ${{"--tw-bg-opacity":"1",backgroundColor:"rgb(37 99 235 / var(--tw-bg-opacity, 1))"}}
    }
`,R=t=>a(y,{...t});export{$ as A,k as T,z as a,h as b,R as c};
