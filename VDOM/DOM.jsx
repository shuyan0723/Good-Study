// jsx写法
<div className="box" onClick={click}>
    <h1>hello world</h1>
    <p>这是一个段落</p>
</div>

// 编译后 / 手写虚拟DOM
const vnode={
    type:'div',
    props:{
        className:'box',
        onClick:click
    },
    children:[
        {
            type:'h1',
            props:{},
            children:'hello world'
        },
        {
            type:'p',
            props:{},
            children:'这是一个段落'
        }
    ]
}