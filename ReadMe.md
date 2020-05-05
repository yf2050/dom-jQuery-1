这是自己封装的一个简单的jQuery操作API，具有以下功能：

**调用时，请采用操作jQuery对象，如：jQuery('.test').find('.child')**

参考文章：

[阮一峰的jQuery设计思想](http://www.ruanyifeng.com/blog/2011/07/jquery_fundamentals.html)

[jQuery官方文档](https://jquery.com/)

#### 一、jQuery 如何获取元素

jQuery选择网页元素，但是返回元素，而是返回对象，对象里有相应函数对元素进行操作，把api转成this，由于JQuery是window调的，this为window,不可修改，修改的是addClass()函数的api

```js
window.jQuery = function (selector) {
    const elements = document.querySelectorAll(selector)
    const api = {
        addClass(className) {//闭包
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.add(className)
            }
            return this
        }
    }
    return api
}
```

简化一下jquery.js，定义了api,又返回了api,省略定义这一步，直接return

```js
window.jQuery = function (selector) {
    const elements = document.querySelectorAll(selector)
    return {
        addClass(className) {
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.add(className)
            }
            return this
        }
    }
}
```

具体如何获取元素：

选择表达式可以是[CSS选择器](http://www.ruanyifeng.com/blog/2009/03/css_selectors.html)：

> ```js
> 　　$(document) //选择整个文档对象
> 
> 　　$('#myId') //选择ID为myId的网页元素
> 
> 　　$('div.myClass') // 选择class为myClass的div元素
> 
> 　　$('input[name=first]') // 选择name属性等于first的input元素
> ```

也可以是jQuery[特有的表达式](http://api.jquery.com/category/selectors/)：

> ```js
> 　　$('a:first') //选择网页中第一个a元素
> 
> 　　$('tr:odd') //选择表格的奇数行
> 
> 　　$('#myForm :input') // 选择表单中的input元素
> 
> 　　$('div:visible') //选择可见的div元素
> 
> 　　$('div:gt(2)') // 选择所有的div元素，除了前三个
> 
> 　　$('div:animated') // 选择当前处于动画状态的div元素
> ```

```

const api = jQuery('.test') //返回的不是元素，而是对象
//向遍历的所有对象里添加.red,.blue,.yellow
api.addClass('red')
    .addClass('blue')
    .addClass('yellow')
//this就是api
<div class="test red blue">你好3</div>
```

简化下main.js

```
jQuery('.test')
.addClass('red')
    .addClass('blue')
    .addClass('yellow')
```

#### 二、jQuery是构造函数吗？

他是不需要加new的构造函数，但又不是常规意义上的构造函数

口头约定术语

jQuery对象：是jQuery函数构造出来的对象

Object对象：是Object构造函数构造出来的对象

Array对象/数组对象：是Array构造函数构造出来的对象

Function对象：是Function构造函数构造出来的对象

#### 三、jQuery元素实现find函数

查找#xxx里的.red元素 ：jQuery.find('#xxx').find('.red')

现在返回的是数组，没法调用同一个api

```
find(selector) {
    let array = []
    //遍历这些元素，转换成数组
    for (let i = 0; i < elements.length; i++) {
        const elements2 = Array.from(elements[i].querySelectorAll(selector))
        array = array.concat(elements2)
        //数组=元素+空数组
    }
    return array
}
```

$div.find返回新的api对象

- 利用jQuery创一个新的newApi
- 把JQuery函数设置参数为字符串或者数组，为字符串时装换成数组，为数组直接返回数组
- 返回newApi

```js
window.jQuery = function (selectorOrArray) {
    let elements
    if (typeof selectorOrArray === 'string') {
        elements = document.querySelectorAll(selectorOrArray)
    } else if (selectorOrArray instanceof Array) {
        elements = selectorOrArray
    }
    return {
        addClass(className) {
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.add(className)
            }
            return this
        },
        find(selector) {
            let array = []
            //遍历这些元素，转换成数组
            for (let i = 0; i < elements.length; i++) {
                const elements2 = Array.from(elements[i].querySelectorAll(selector))
                array = array.concat(elements2)
                //数组=元素+空数组
            }
            const newApi = jQuery(array)
            return newApi
        }
    }

}

const api1 = jQuery('.test') //返回的不是元素，而是对象
api1.addClass('blue')
const api2 = jQuery('.test').find('.child').addClass('.red')
api1.addClass('green')
```

结果

```html
<div class="test blue green">你好1
    <div class="child .red">child1</div>
    <div class="child .red">child2</div>
    <div class="child .red">child3</div>
</div>
```

简化一下

```js
return jQuery(array)
```

```html
<div class="child .red .blue yellow">child1</div>
```

```js
jQuery('.test')
    .find('.child')
    .addClass('.red')
    .addClass('.blue')
    .addClass('yellow')
```

#### 五、jQuery实现end函数

- oldApi: selectorOrArray.oldApi,
- array.oldApi = this //this就是旧Api
- end() {
          return this.oldApi //    this就是新Api
      }

```js
window.jQuery = function (selectorOrArray) {
    let elements
    if (typeof selectorOrArray === 'string') {
        elements = document.querySelectorAll(selectorOrArray)
    } else if (selectorOrArray instanceof Array) {
        elements = selectorOrArray
    }
    return {
        addClass(className) {
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.add(className)
            }
            return this
        },
        find(selector) {
            let array = []
            //遍历这些元素，转换成数组
            for (let i = 0; i < elements.length; i++) {
                const elements2 = Array.from(elements[i].querySelectorAll(selector))
                array = array.concat(elements2)
                //数组=元素+空数组
            }
            array.oldApi = this //this就是旧Api
            return jQuery(array)
        },
        oldApi: selectorOrArray.oldApi,
        end() {
            return this.oldApi //    this就是新Api
        }
    }

    jQuery('.test')
    .find('.child')
    .addClass('.red')
    .addClass('.blue')
    .addClass('yellow')
    .end()
    .addClass('green2') //作用于test上
```

#### 六、jQuery实现each()函数

获得所有的.child类的div

```js
let x = jQuery('.test').find('.child')
x.each((div) => console.log(div))

each(fn) {
  for (let i = 0; i < elements.length; i++) {
    fn.call(null, elements[i], i);
  }
  return this;
}
```

#### 七、jQuery实现parent函数

```
parent() {
    const arr = []
    this.each((node) => {
        arr.push(node.parentNode)
    })
    return jQuery(arr)
},

//let x = jQuery('.test').parent()
//x.each((div) => console.log(div)) 
jQuery('.test').parent().print() 打出数组
```

得到三个body,判断一下arr.parentNode的下标是否为-1

```
parent() {
    const arr = []
    this.each((node) => {
        if (arr.indexOf(node.parentNode) === -1) {
            arr.push(node.parentNode)
        }
    })
    return jQuery(arr)
},
print() {
    console.log(elements)
},
```

#### 八、jQuery实现children()函数

...node.children把数组里的都显示出来

```
jQuery('.test').children().print()

children() {
    const array = []
    this.each((node) => {
        array.push(...node.children)
    })
    return jQuery(array)
},
```

实现一下：http://js.jirengu.com/wibifopome/17/edit?html,css,js,output

#### 八、jQuery命名

简化JQuery:$符代替

```
window.$ = window.jQuery = function (){}
//两个等于号是从右向左的
```

命名风格：$div与div

DOM对象---DOM的API 如querySelector、appendChild

JQuery对象----JQuery的API 如find、each

所以采用div前加前缀，$div

```
const eldiv1 = document.querySelector('.test')
const $div = jQuery('.test')//操作这个对象的api,不是div 
```

#### 九、jQuery 如何创建、删除、清空元素

创建div `$('<div>1</div>')`

创建新元素的方法非常简单，只要把新元素直接传入jQuery的构造函数就行了

`$div.remove()`

`$div.empty()`

#### 十、jQuery 如何修改元素的属性

$div多为数组，需要遍历一下，$div常为多个数

读写文本内容 `$div.text(?)`

读写HTML内容`$div.HTML(?)`

读写属性 `$div.attr('title',?)`

读写Style `$div.css({color:'red'})` **css改变是样式**

加class类 `$div.add('blue')`

点击事件 `$div.on('click',fn)`

清除事件`$div.off('click',fn)`

#### JQuery原型

`$.fn = ==jQuery.prototype===api.__proto__ `

第一步：把共有属性放在Jquery,prototype里

```js
jQuery.prototype = {
    constructor: jQuery,
    jquery: true,
    get(index) {
```

第二步：以共有属性创建api

```js
const api = this.Object.create(jQuery.prototype)
```

第三步：给创建的对象加自身属性

```js
    Object.assign(api, {
        elements: elements,
        oldApi: selectorOrArray.oldApi,
    })
```

问题点：

elements的作用域是JQuery()函数里：把函数外的以this.elements修改

jQuery.prototype 里必须有`constructor: jQuery,jquery: true,`

#### JQuery涉及的设计模式

1.不用new的构造函数模式

2.重载：$(支持多种参数)

3.闭包隐藏细节（elements变量在函数里操纵）

4.getter/setter模式：`$div.text()`

5.别名：$.fn=jQuery.prototype

6.适配器：对不同浏览器用不同代码（if  else）

7.封装：把变量放在函数中，暴露出api,api可以操作这些变量

更多设计模式在写代码中发现，就是给通用代码取个名字而已