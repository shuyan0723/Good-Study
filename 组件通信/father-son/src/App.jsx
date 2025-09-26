function Detail(){
  return(
    <>
    
    </>
  )
}


function Son({title,content,active}){
  return (
    <>
    <h2>我是子组件:{title}</h2>
    <Detail 
    
    />
    {/* <p>我是子组件的内容:{content}</p>
    <p>状态:{active? '显示':'隐藏'}</p> */}
    </>
  )
}


export default function App(){
  const articleData={}

  return(
    <>
     <Son  
       title='标签1'
       content='我是标签1的内容'
       active={false}
     />  
     <Son 
       title='标签2'
       content='我是标签2的内容'
     />
     <Son
       title='标签3'
       content='我是标签3的内容'
     />
     </>
  )
}