// 如果后续需要使用 Mock，可以添加简单的使用示例避免该警告，以下注释掉的代码为示例
import Mock from 'mockjs'
// 只能劫持XMLHttpRequest请求,不能劫持fetch，有局限性
Mock.mock('/api/test','get',()=>{
    return {
        error:0,
        data:{
            name:`张三 ${Date.now()}`
        },
    }
})