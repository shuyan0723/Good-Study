function deepClone(obj) {
    // 处理null 或 非对象类型
    if (obj === null || typeof obj !== 'object') return obj;

    // 处理 Date
    if (obj instanceof Date) return new Date(obj.getTime());
    // 处理RegExp
    if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);
    // 处理 Array
    if (Array.isArray(obj)) {
        const arr = [];
        for (let i = 0; i < obj.length; i++) {
            arr[i] = deepClone(obj[i]);
        }
        return arr;
    }

    // 处理普通对象
    const clonedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }
    return clonedObj;
}

const obj = {
    name: 'qwe',
    age: 15,
    hobbies: ['football', 'basketball'],
    dfd: {
        value: 55
    }
}

const copy = deepClone(obj)
copy.name = '123';
copy.hobbies.push('reading')
copy.dfd.value = 55
console.log(copy);
console.log(obj);

